// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    private allGames: any[] = [];
    public allCategories: Models.ICategory[] = [];
    private questionsByCatDiff: Models.GameBoardModel[] = [];
    private difficulty = [
      { label: 'Easy', value: 'easy' },
      { label: 'Medium', value: 'medium' },
      { label: 'Hard', value: 'hard' }
    ];

    private newGameData;
    public gamePlayers: Models.IUser[] = [];
    public gameCategories: Models.ICategory[] = [];
    public gameCatClass: string = 'col s12';
    public gameDifficulty: string = 'all';
    public gameSource: string = "";
    public gameBoards: Models.GameBoardModel[] = [];
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
      // this.getAllGames();
      this.getAllCats();
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
    private _Resource_game_players = <Models.IPlayerResource>this.$resource('/api/game/players/:id', null, {
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
    private _Resource_gameBoard = <Models.IGameBoardResource>this.$resource('api/game/board/:gameId', null, {
      'update': {
        method: 'PUT'
      }
    });

    // // 
    // private getAllGames(): boolean {
    //   this._Resource_game.query().$promise
    //     .then((games) => {
    //       this.allGames = games;
    //       console.log(`Games:`, this.allGames);
    //       return true;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       return false;
    //     })
    //   return false;
    // }

    // simple random function
    private randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // load all categories
    public getAllCats() {
      if (this.allCategories.length == 0) {
        this.allCategories = this._Resource_categories.query();
        return this.allCategories.$promise;
      } else {
        let categories = this.$q.defer();
        categories.resolve(this.allCategories);
        return categories;
      }
    }

    // Should we limit each user to initiating only one game (and replace any other games?)
    private findLastGame(user: Models.IUser) {
      return this._Resource_game.search({ username: user.userName });
    }

    public get newGameId(): number {
      return this.newGameData.id;
    }

    // Create new gameId
    // Check if user already has active game
    // YES - use last gameId again
    // NO - create new game resource
    public loadGame(user) {
      let gameLoaded = new Promise((res, er) => {
        this.findLastGame(user).$promise
          .then((lastGame) => {
            // console.log(`lastGame`, lastGame);
            if (lastGame.hasOwnProperty('initiatorUserId')) {
              this.newGameData = lastGame;
              console.log(`newGameData`, this.newGameData);
              this.$q.all([this.loadGameCategories(), this.loadPlayers(user), this.loadGameBoards()])
                .then(() => {
                  console.log(`Game Player length:`, this.gamePlayers.length);
                  console.log(`Game Category length:`, this.gameCategories.length);
                  console.log(`Game Boards:`, this.gameBoards.length);
                  res(true);
                })
                .catch((error) => {
                  console.log(`Unable to load players/categories/gameboard`);
                  console.log(`error`, error);
                })
            } else {
              this._Resource_game.save({ initiatorUserId: user.userName }).$promise
                .then((newGame) => {
                  console.log(`newGame`, newGame);
                  this.newGameData.id = newGame.id;
                  this.newGameData.initiatorUserId = user;
                  console.log(`newGameData`, this.newGameData);
                  this.loadPlayers(user);
                  res(true);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
      })
      return gameLoaded;
    }


    public destroyGame() {
      this._Resource_game.remove({ gameId: this.newGameId }).$promise
        .then((gameData) => {
          this.newGameData = {};
          this.gamePlayers = [];
          this.gameCategories = [];
          this.gameDifficulty = 'all';
          this.gameBoards.length = 0;
        })
        .catch((error) => {
          console.log(`error`, error);
        })
    }

    // Show the players assigned to the current gameId
    private loadPlayers(user: Models.IUser) {
      return this._Resource_game_players.query({ id: this.newGameId }).$promise
        .then((players) => {
          // console.log(`players`, players);
          if (players.length == 0) {
            this.addPlayer(this.newGameId, user, true);
            console.log(`Game Players`, this.gamePlayers);
          } else {
            players.forEach((p, i) => {
              // console.log(`p.userId`, p.userId);
              return this.PlayerService.findByUserName(p.userId)
                .then((player) => {
                  player.playerId = p.id;
                  this.gamePlayers[i] = player;
                })
            })
            console.log(`Game Players`, this.gamePlayers);
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    }

    // Show the gamecategories assigned to the current gameId
    private loadGameCategories() {
      return this._Resource_game_categories.query({ id: this.newGameId }).$promise
        .then((gameCategories) => {
          gameCategories.forEach((gameCategory, i) => {
            let category = this.allCategories.find(c => { return c.id == gameCategory.categoryId })
            category.categoryId = gameCategory.id;
            this.gameCategories[i] = category;
          })
          console.log(`Game Categories`, this.gameCategories);
        })
    }

    // Show the gameBoards assigned to the current gameId
    private loadGameBoards() {
      this.gameBoards.length = 0;
      return this._Resource_gameBoard.query({ id: this.newGameId }).$promise
        .then((gameBoards) => {
          gameBoards.forEach(gameBoard => {
            this.gameBoards.push(gameBoard);
          })
          console.log(`Game Boards`, this.gameBoards);
        })
    }

    // Add player who is registered
    public addPlayer(gameId: number, user: Models.IUser, initiator: boolean): boolean {
      if (this.gamePlayers.length < 3 && this.gamePlayers.findIndex(p => { return p.userName == user.userName }) == -1) {
        var player = new this._Resource_game_players;
        player.gameId = gameId;
        player.userId = user.userName;
        player.initiator = initiator;
        player.$save((player) => {
          user.playerId = player.id;
          this.gamePlayers.push(user);
          console.log(`players`, this.gamePlayers);
          return true;
        })
          .catch((error) => {
            console.log(`Error:`, error);
          })
      }
      return false;
    }

    public removePlayer(playerId: number) {
      if (this.gamePlayers.length > 1) {
        console.log(`Deleting playerId:`, playerId);
        this._Resource_game_players.delete({ id: playerId }).$promise
          .then(() => {
            this.gamePlayers.splice(this.gamePlayers.findIndex(p => { return p.playerId == playerId }), 1);
          })
      }
    }

    public addCategory(category: Models.ICategory): boolean {
      if (this.gameCategories.length < 3 && this.gameCategories.findIndex(c => { return c.shortDescription == category.shortDescription }) == -1) {
        var newGameCat = new this._Resource_game_categories;
        newGameCat.gameId = this.newGameId;
        newGameCat.categoryId = category.id;
        console.log(`newGameCat`, newGameCat);
        newGameCat.$save((cat) => {
          console.log(`cat`, cat);
          category.categoryId = cat.id;
          console.log(`category`, category);
          this.gameCategories.push(category);
          console.log(`selectCategories`, this.gameCategories);
          return true;
        })
          .catch((error) => {
            console.log(`Error:`, error);
          })
      }
      return false;
    }

    public removeCategory(categoryId: number) {
      if (this.gameCategories.length > 0) {
        console.log(`Deleting game category:`, categoryId);
        this._Resource_game_categories.delete({ id: categoryId }).$promise
          .then(() => {
            this.gameCategories.splice(this.gameCategories.findIndex(c => { return c.categoryId == categoryId }), 1);
          })
      }
    }

    // select random items from arraySelect and add to arrayToAdd
    private addInRandomOrder(arrayToAdd, arraySelect, wanted: number): any {
      let shuffling = new Promise((res, err) => {
        // might be nice to support if fewer in list than amount
        // if arraySelect.length < amount then randomize arraySelect.length repeatedly until amount reached
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
      return shuffling;
    }

    // parse questions into GameBoardQuestions
    private parseQuizToGameBoard(cat, questions, prizePoints): void {
      let gameBoardPromise = new Promise((res, err) => {
        let randomizedQs = [];
        this.addInRandomOrder(randomizedQs, questions, this.numQuestions);
        let randomizedGameBoards = [];
        randomizedQs.forEach(q => {
          let gameBoard = new Models.GameBoardModel;
          gameBoard.gameId = this.newGameId;
          gameBoard.categoryId = cat.id;
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
            if (a.correct) { gameBoard.correctAnswer = 'ABCD'[i] };
          });
          this.column++;
          if (this.column == this.perRow) {
            this.column = 0;
            this.row++;
          }
          if (this.row >= 3) {
            this.row = 0;
          }
          this._Resource_gameBoard.save(gameBoard).$promise
            .then((data) => {
              // console.log(`data`, data);
              gameBoard.id = data.id;
              this.gameBoards.push(gameBoard);
              res(true);
            })

        });
        return gameBoardPromise;
      })
    }

    private loadNewGameBoards(cat, diff) {
      let promiseGameBoard = new Promise((res, err) => {
        this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
          .then((questions) => {
            console.log(`${cat.shortDescription} ${diff.value} Qs: ${questions.length}`);
            let prizePoints = [100, 200, 300][this.difficulty.findIndex(d => { return d.value == diff.value })];
            this.parseQuizToGameBoard(cat, questions, prizePoints)
            // console.log(`gameBoards:`, this.gameBoards);
            res(true);
          })
      })
      return promiseGameBoard;
    }

    // Build the game board using the categories
    public setupGameBoard() {
      console.log(`Creating GameBoards`);
      this.gameBoards.length = 0;
      if (this.gamePlayers.length < 2 || this.gameCategories.length < 1) {
        console.log(`Unable to setup game - invite players & select categories`);
        return false
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

      // line up all the promises to fill the gameBoard
      let gamePromises = this.$q.when();
      this.gameCategories.forEach(cat => {
        this.difficulty.forEach(diff => {
          if (this.gameDifficulty == 'all' || this.gameDifficulty == diff.value) {
            gamePromises = gamePromises.then(() => {
              this.loadNewGameBoards(cat, diff);
            })
          }
        })
      })

      // line up all the promises to save the gameBoard
      // this.gameBoards.forEach(gameBoard => {
      //   gamePromises = gamePromises.then(() => {

      //     this._Resource_gameBoard.save(this.newGameId, gameBoard);
      //   })

      this.$q.when(gamePromises)
        .then(() => {
          console.log(`this.gameBoards`, this.gameBoards);
        })
    }

  }
}