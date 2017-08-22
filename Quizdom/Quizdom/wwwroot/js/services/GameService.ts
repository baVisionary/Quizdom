// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    // private allGames: any[] = [];
    // private questionsByCatDiff: Models.GameBoardModel[] = [];
    public allCategories: Models.ICategory[] = [];
    private difficulty = [
      { label: 'Casual', value: 'easy' },
      { label: 'Engaging', value: 'medium' },
      { label: 'Brain bending!', value: 'hard' }
    ];

    private newGameData: any = new Models.GameModel;
    private gamePlayerId: number = 0;
    public players: Models.PlayerModel[] = [];
    public gameCategories: Models.ICategory[] = [];
    public gameCatClass: string = 'col s12';
    public gameDifficulty: string = 'all';
    public gameSource: string = "";
    public gameBoards: Models.IGameBoard[] = [];
    public gameQuestion;
    private numQuestions: number = 0;
    private row: number = 0;
    private column: number = 0;
    private perRow: number = 6;

    static $inject = [
      'PlayerService',
      'QuestionService',
      '$resource',
      '$q'
    ];

    constructor(
      private PlayerService: Services.PlayerService,
      private QuestionService: Services.QuestionService,
      private $resource: ng.resource.IResourceService,
      private $q: ng.IQService
    ) {

    }

    // manage 'Games' table
    private _Resource_game = <Models.IGameResource>this.$resource('/api/game/:gameId', null, {
      'update': {
        method: 'PUT'
      },
      'search': {
        method: 'GET',
        url: '/api/game/gameinitiator/:username',
      }
    });

    // manage 'GameCategories' table - lists the categories selected for each gameId
    private _Resource_game_categories = <Models.IGameCategoryResource>this.$resource('/api/game/gamecategories/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

    // manage 'GamePlayers' table
    private _Resource_game_players = <Models.IGamePlayerResource>this.$resource('/api/game/players/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

    // access 'Categories' to correlate categoryId to short & long name
    private _Resource_categories = <Models.ICategoryResource>this.$resource('/api/game/categories/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

    // manage 'GameBoard' table throughout game
    private _Resource_gameBoard = <Models.IGameBoardResource>this.$resource('api/game/board/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

    // manage 'GameMessage' using SignalR during game
    private _Resource_gameMessage = <any>this.$resource('/api/game/gamechat/:gameId');

    // SignalR game chat support
    public getAllGameMsgs() {
      return this._Resource_gameMessage.query({ gameId: this.gameId });
    }

    public postGameMsg(post) {
      return this._Resource_gameMessage.save(post);
    }

    // simple random function
    private randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // load all categories from DB if empty or local if available
    public getAllCats(): any {
      if (this.allCategories.length == 0) {
        this.allCategories = this._Resource_categories.query();
        return this.allCategories.$promise;
      } else {
        let categories = new Promise((res) => {
          res(this.allCategories);
        });
        return categories;
      }
    }

    // Should we limit each user to initiating only one game (and replace any other games?)
    private findLastGame(user: Models.IUser) {
      return this._Resource_game.search({ username: user.userName });
    }

    public get gameId(): number {
      return this.newGameData.id;
    }

    private loadNewGameData(gameId) {
      let newGameLoaded = new Promise((res) => {
        this.newGameData = this._Resource_game.get({ gameId: gameId });
        res('New game loaded to local model')
      })
      return newGameLoaded;
    }

    // Create new gameId
    // Check if user already has active game
    // YES - use last gameId again
    // NO - create new game resource
    public loadMyGameData(user) {
      let myGameLoaded = new Promise((res, err) => {
        this.findLastGame(user).$promise
          .then((lastGame) => {
            // console.log(`lastGame`, lastGame);
            if (lastGame.hasOwnProperty('initiatorUserId')) {
              this.newGameData = lastGame;
              res(`Previous game loaded`);
            } else {
              let newGame = new Models.GameModel;
              newGame.initiatorUserId = user.userName;
              this._Resource_game.save(newGame).$promise
                .then((newGame) => {
                  // console.log(`newGame`, newGame);
                  this.newGameData.id = newGame.id;
                  res('New game created');
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
      })
      return myGameLoaded;
    }

    public get myGamePlayerId() {
      return this.gamePlayerId;
    }

    // Load all game data from DB based on given gameId (allows other players to load new game)
    public loadGame(gameId) {

      let gameLoaded: any = [];
      gameLoaded.push(this.loadNewGameData(gameId));
      gameLoaded.push(this.loadPlayers(gameId));
      gameLoaded.push(this.loadGameCategories(gameId));
      gameLoaded.push(this.loadGameBoards(gameId));

      this.$q.all(gameLoaded)
        .then((results) => {
          console.log(`Game`, this.newGameData);
          console.log(`Game ${this.gameId} fully loaded`);
        })
        .catch((errors) => {
          console.log(`It was bad, dude`);
          console.log(`errors`, errors);
        })

      return this.$q.all(gameLoaded);
    }

    public destroyGame() {
      this._Resource_game.remove({ gameId: this.gameId }).$promise
        .then((gameData) => {
          this.newGameData = new Models.GameModel;
          this.players = [];
          this.gameCategories = [];
          this.gameDifficulty = 'all';
          this.gameBoards.length = 0;
        })
        .catch((error) => {
          console.log(`error`, error);
        })
    }

    // Show the players assigned to the current gameId
    public loadPlayers(gameId): any {
      let gamePlayersLoaded = new Promise((resAll) => {
        this.players.length = 0;
        let gamePlayersPromises: any = this.$q.when();
        gamePlayersPromises = gamePlayersPromises.then(() => {
          return new Promise((resPlayers) => {
            this._Resource_game_players.query({ id: gameId }).$promise
              .then((gameplayers) => {
                resPlayers('Players loaded from DB')
                gameplayers.forEach((gp) => {
                  gamePlayersPromises = gamePlayersPromises.then(() => {
                    return new Promise((resLoop) => {
                      this.PlayerService.findByUserName(gp.userId)
                        .then((p) => {
                          let player = new Models.PlayerModel(p, gp);
                          console.log(`Player ${p.userName} added`);
                          this.players.push(player);
                          resLoop('Player added')
                        })
                    })


                  })
                })
                this.$q.when(gamePlayersPromises)
                  .then(() => {
                    console.log(`Game Players`, this.players);
                    resAll(`Game players loaded to local model`);
                  })
              })
          })
        })
        return gamePlayersPromises;
      })
      return gamePlayersLoaded;
    }

    // Show the gamecategories assigned to the current gameId
    public loadGameCategories(gameId) {
      this.gameCategories.length = 0;
      let gameCategoriesLoaded = new Promise((res, err) => {
        this.getAllCats().then(() => {
          this._Resource_game_categories.query({ id: gameId }).$promise
            .then((gameCategories) => {

              gameCategories.forEach((gameCategory, i) => {
                let category = this.allCategories.find(c => { return c.id == gameCategory.categoryId })
                category.categoryId = gameCategory.id;
                this.gameCategories.push(category);
              })
              console.log(`Game Categories`, this.gameCategories);
              // set the proper width of the category labels using ng-class "col sX"
              this.gameCatClass = 'col s' + (12 / this.gameCategories.length).toString();
              res(`Game categories loaded to local model`);
            })
        })
      })
      return gameCategoriesLoaded;
    }

    // Show the gameBoards assigned to the current gameId
    private loadGameBoards(gameId) {
      let gameBoardsLoaded = new Promise((res, err) => {

        this._Resource_gameBoard.query({ id: gameId }).$promise
          .then((gameBoards) => {
            this.gameBoards.length = 0;
            gameBoards.forEach(gameBoard => {
              this.gameBoards.push(gameBoard);
            })
            console.log(`Game Boards`, this.gameBoards);
            res(`Game boards loaded to local model`);
          })
          .catch((error) => {
            console.log(`Unable to load Gameboard`);
            err(error);
          })
      })
      return gameBoardsLoaded;
    }

    // Add player who is registered
    public addPlayer(gameId: number, user: Models.IUser, initiator: boolean): any {
      let playerAdded = new Promise((res, err) => {
        let gamePlayer = new Models.GamePlayerModel;
        if (this.players.length < 3 && this.players.findIndex(p => { return p.userName == user.userName }) == -1) {
          gamePlayer.gameId = gameId;
          gamePlayer.userId = user.userName;
          gamePlayer.initiator = initiator;
          // player.prizePoints = 0;
          this._Resource_game_players.save(gamePlayer).$promise
            .then((gp) => {
              // console.log(`data`, gp);
              gamePlayer.id = gp.id;
              let player = new Models.PlayerModel(user, gamePlayer);
              console.log(`Player ${player.userName} added`, player);
              this.players.push(player);
              res(true);
            })
            .catch((error) => {
              console.log(`Player not saved to database`);
              err(error);
            })
        }
      })
      return playerAdded;
    }

    public saveGamePlayers(gameId: number) {
      let gamePlayersSaved = new Promise((res, err) => {
        this.players.forEach(player => {

        })

      })
      return gamePlayersSaved;
    }

    public removePlayer(playerId: number) {
      if (this.players.length > 1) {
        console.log(`Deleting playerId:`, playerId);
        this._Resource_game_players.delete({ id: playerId }).$promise
          .then(() => {
            this.players.splice(this.players.findIndex(p => { return p.playerId == playerId }), 1);
          })
      }
    }

    public addCategory(category: Models.ICategory) {
      let categoryAdded = new Promise((res, err) => {
        if (this.gameCategories.length < 3 && this.gameCategories.findIndex(c => { return c.shortDescription == category.shortDescription }) == -1) {
          var newGameCat = new this._Resource_game_categories;
          newGameCat.gameId = this.gameId;
          newGameCat.categoryId = category.id;
          console.log(`newGameCat`, newGameCat);
          newGameCat.$save((cat) => {
            category.categoryId = cat.id;
            this.gameCategories.push(category);
            console.log(`Categories`, this.gameCategories);
            res(this.gameCategories);
          })
        }
      })
      return categoryAdded;
    }

    public removeCategory(categoryId: number) {
      let categoryRemoved = new Promise((res, err) => {
        if (this.gameCategories.length > 0) {
          console.log(`Deleting game category:`, categoryId);
          this._Resource_game_categories.delete({ id: categoryId }).$promise
            .then(() => {
              this.gameCategories.splice(this.gameCategories.findIndex(c => { return c.categoryId == categoryId }), 1);
              res(this.gameCategories)
            })
        }
      })
      return categoryRemoved;
    }

    // select random items from arraySelect and add to arrayToAdd
    private addInRandomOrder(arrayToAdd, arraySelect, wanted: number): any {
      let arrayShuffled = new Promise((res, err) => {
        // might be nice to support if fewer in list than amount
        // if arraySelect.length < amount then randomize arraySelect.length repeatedly until amount reached
        if (arraySelect.length == 0) {
          let error = `No items to shuffle`;
          console.log(error);
          err(error)
        }
        let assigned = 0;
        do {
          let avail = Math.min(arraySelect.length, wanted - assigned);
          for (var i = 0; i < avail; i++) {
            let last = arraySelect.length - 1 - i;
            let randomOne = this.randomInt(0, last);
            arrayToAdd.push(arraySelect[randomOne])
            let temp = arraySelect[randomOne];
            arraySelect[randomOne] = arraySelect[last];
            arraySelect[last] = temp;
          }
          assigned += avail;
        } while (assigned < wanted);
        res(arrayToAdd);
      })
      return arrayShuffled;
    }

    // parse questions into GameBoardQuestions
    private parseQuizToGameBoard(cat, questions, prizePoints) {
      let gameBoardPromise = new Promise((res, err) => {
        let randomizedQs = [];
        this.addInRandomOrder(randomizedQs, questions, this.numQuestions);
        let randomizedGameBoards = [];
        randomizedQs.forEach(q => {
          let gameBoard: any = new Models.GameBoardModel;
          gameBoard.gameId = this.gameId;
          gameBoard.categoryId = q.categoryId;
          gameBoard.difficulty = q.difficulty;
          gameBoard.boardRow = this.row;
          gameBoard.boardColumn = this.column;
          gameBoard.questionId = q.id;
          gameBoard.questionText = q.question;
          gameBoard.prizePoints = prizePoints;
          let answers = [];
          this.addInRandomOrder(answers, [
            { answer: q.correct_Answer, correct: true },
            { answer: q.incorrect_Answer1, correct: false },
            { answer: q.incorrect_Answer2, correct: false },
            { answer: q.incorrect_Answer3, correct: false }
          ], 4);
          answers.forEach((a, i) => {
            let parameter = 'answer' + 'ABCD'[i];
            gameBoard[parameter] = a.answer;
            if (a.correct) { gameBoard.correctAnswer = i };
          });
          this.column++;
          if (this.column == this.perRow) {
            this.column = 0;
            this.row++;
          }
          if (this.row >= 3) {
            this.row = 0;
          }
          return this._Resource_gameBoard.save(gameBoard).$promise
            .then((data) => {
              // console.log(`data`, data);
              gameBoard.id = data.id;
              this.gameBoards.push(gameBoard);
            })
        });
        res(this.gameBoards);
      })
      return gameBoardPromise;
    }

    private loadNewGameBoards(cat, diff) {
      let promiseGameBoard = new Promise((res, err) => {
        this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
          .then((questions) => {
            console.log(`${cat.shortDescription} ${diff.value} Qs: ${questions.length}`);
            if (questions.length > 0) {
              let prizePoints = [100, 200, 300][this.difficulty.findIndex(d => { return d.value == diff.value })];
              this.parseQuizToGameBoard(cat, questions, prizePoints)
                .then()
              // console.log(`gameBoards:`, this.gameBoards);
              res(true);
            } else {
              let error = `No questions in ${cat.longDescription} - ${diff.title}`;
              console.log(`error`);
              err();
            }
          })
      })
      return promiseGameBoard;
    }

    // ensure all old GameBoards are 
    private removeAllGameBoards(gameId) {
      let gameBoardsRemoved = new Promise((res, err) => {
        let allGameBoards = this._Resource_gameBoard.query();
        allGameBoards.$promise
          .then(() => {
            let gameBoards = allGameBoards.filter(g => { return g.gameId == gameId })
            gameBoards.forEach((g) => {
              this._Resource_gameBoard.remove({ id: g.id });
            })
            console.log(`Removed old Gameboards`);
            res(true);
          })
      })
      return gameBoardsRemoved;
    }

    // Build the game board using the categories
    public setupGameBoards() {
      console.log(`Creating GameBoards`);
      // line up all the promises to fill the gameBoard
      let gamePromises: any = this.$q.when();

      let firstPromise = new Promise((res, err) => {
        if (this.players.length < 2 || this.gameCategories.length < 1) {
          console.log(`Unable to setup game - invite players & select categories`);
          err(false);
        }
        // set the proper width of the category labels using ng-class "col sX"
        this.gameCatClass = 'col s' + (12 / this.gameCategories.length).toString();

        // assign random question to each row & column based on
        // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
        // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
        this.numQuestions = 18 / this.gameCategories.length / (this.gameDifficulty == 'all' ? 3 : 1);
        this.row = 0;
        this.column = 0;
        this.perRow = 6 / this.gameCategories.length;


        gamePromises = gamePromises.then(() => {
          return this.removeAllGameBoards(this.gameId);
        })
        this.gameCategories.forEach(cat => {
          this.difficulty.forEach(diff => {
            if (this.gameDifficulty == 'all' || this.gameDifficulty == diff.value) {
              gamePromises = gamePromises
                .then(() => {
                  // console.log(`Loading new Gameboards...`);
                  return this.loadNewGameBoards(cat, diff);
                })
            }
          })
        })
        gamePromises = gamePromises
          .then(() => {
            console.log(`this.gameBoards`, this.gameBoards);
            res(this.gameBoards);
          })
          .catch((error) => {
            console.log(`Failed to load Gameboard`);
            err(error);
          })

      })
      return this.$q.when(gamePromises);
    }

    // SignalR methods update gameBoard to trigger server
    public updateGameBoard(gameBoard) {
      return this._Resource_gameBoard.update({ id: gameBoard.id }, gameBoard);
    }

    public getGamePlayer(gameId) {
      return this._Resource_game_players.query({ id: gameId });
    }

    public updateGamePlayer(gamePlayer) {
      return this._Resource_game_players.update({ id: gamePlayer.id }, gamePlayer);
    }

    public triggerLoadQandA(boardId) {

    }

    // research into how to use promise resolution to delay for loop action - SUCCESS!
    public testLoopPromise(loops) {
      let loopPromises: any = this.$q.when();
      // setup the looping behavior
      for (var i = 0; i < loops; i++) {
        // values that are dependent on the loop
        let loop = 'Loop ' + i;
        // the stuff that will take time
        loopPromises = loopPromises.then(() => {
          return new Promise((res) => {
            console.log(loop);

            // just to visibly count the seconds
            let tick = 0;
            let timer = setInterval(() => {
              tick++;
              console.log(`...${tick}`);
            }, 1000);

            // mimics API delay
            let delay = this.randomInt(1, 5);
            setTimeout(() => {
              clearInterval(timer);
              console.log(`Complete after ` + delay + ` seconds`, );
              res(`Success`)
            }, delay * 1000);
          });
        })
      }
      // stasting the action
      console.log(`Starting loop`);
      this.$q.when(loopPromises)
        .then(() => {
          // when all are complete!
          console.log(`All loops complete!`);
        })
    }

  }
}