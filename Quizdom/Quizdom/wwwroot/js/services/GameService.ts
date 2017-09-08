// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    // variables to setup new game
    public allCategories: Models.ICategory[] = [];
    private difficulty = [
      { label: 'Casual', value: 'easy' },
      { label: 'Engaging', value: 'medium' },
      { label: 'Brain bending!', value: 'hard' }
    ];
    public gameDifficulty: string = 'all';
    private numQuestions: number = 0;
    private row: number = 0;
    private column: number = 0;
    private perRow: number = 6;

    /* variables that define the initial game state */

    public gameData: any = new Models.GameModel;
    private gamePlayerId: number = 0;

    // Time to answer each question in seconds (* 1000 = millisecs)
    public duration: number = 10;

    public players: Models.PlayerModel[] = [];
    public gameCategories: Models.ICategory[] = [];
    public gameCatClass: string = 'col s12';
    public gameBoards: Models.IGameBoard[] = [];

    /* variables used during gameplay */

    // in game chat support
    private group: string = '';
    public gameChats = [];
    public showSection: string = "";

    // I do not understand why I cannot type this as IGameBoard?!?
    public question: any = new Models.GameBoardModel;

    // the order in which questions are selected
    public answerOrder: number = 0;

    // the player's guess as to the answer of the question
    public guess: number = 4;

    // timestamps to calculate guess delay in milliseconds
    public startTime: number;
    public endTime: number;
    public delay: number = this.duration;

    /* variables to summarize game */
    public winner: string = "";
    public playerResults = [];

    static $inject = [
      'PlayerService',
      'QuestionService',
      '$resource',
      '$q',
      '$interval',
      '$timeout',
    ];

    constructor(
      private PlayerService: Services.PlayerService,
      private QuestionService: Services.QuestionService,
      private $resource: ng.resource.IResourceService,
      private $q: ng.IQService,
      private $interval: ng.IIntervalService,
      private $timeout: ng.ITimeoutService,
      // private $scope: ng.IScope
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

    public createGroup(group) {
      this.group = group;
    }

    public get groupName() {
      return this.group;
    }

    // SignalR game chat support
    private getAllGameMsgs() {
      return this._Resource_gameMessage.query({ gameId: this.gameId });
    }

    public getGameMessages() {
      this.getAllGameMsgs().$promise
        .then((messages) => {
          // console.log(`messages`, messages);
          this.addGameMsgList(messages)
        });
    }

    public addGameMsgList(posts: Models.IMessage[]) {
      this.gameChats.length = 0;
      posts.forEach(post => {
        this.gameChats.push(post);
      });
      this.gameChats.sort((a, b) => { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1 })
      // console.log(this.posts);
    }


    // SignalR game chat support
    public postGameMsg(gameMsg) {
      return this._Resource_gameMessage.save(gameMsg);
    }

    // simple random function
    public randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // load all categories from DB if empty or local if available
    public getAllCats(): any {
      let allCatLoaded = new Promise((res) => {
        if (this.allCategories.length == 0) {
          this._Resource_categories.query().$promise
            .then((categories) => {
              this.allCategories = categories;
              // console.log(`All categories`, categories);
              console.log(`All categories loaded`);
              res(`All categories loaded`);
            })
        } else {
          console.log(`All categories already loaded`);
          res(`All categories already loaded`);
        };
      });
      return allCatLoaded;
    }

    // shorthand to access gameId
    public get gameId(): number {
      return this.gameData.id;
    }

    public isActive(userName): boolean {
      return userName == this.gameData.activeUserId;
    }

    // Should we limit each user to initiating only one game (and replace any other games?)
    private findLastGame(userName: string) {
      return this._Resource_game.search({ username: userName });
    }

    // Create new gameId
    // Check if user already has active game
    // YES - use last gameId again
    // NO - create new game resource
    public loadMyGameData(userName: string) {
      let myGameLoaded = new Promise((res, err) => {
        if (this.gameData.initiatorUserId == userName) {
          res('Previous game already in local model')
        } else {
          this.findLastGame(userName).$promise.then((lastGame) => {
            // console.log(`lastGame`, lastGame);

            // check if previous game found
            if (lastGame.hasOwnProperty('initiatorUserId')) {
              this.gameData = lastGame;
              res(`Previous game loaded`);
            } else {
              let newGame = new Models.GameModel;
              newGame.initiatorUserId = userName;
              this._Resource_game.save(newGame).$promise.then((newGame) => {
                // console.log(`newGame`, newGame);
                this.gameData.id = newGame.id;
                res('New game created');
              })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
        }
      })
      return myGameLoaded;
    }

    public get myGamePlayerId() {
      return this.gamePlayerId;
    }

    public get gameState() {
      return this.gameData.gameState;
    }

    // Load all game data from DB based on given gameId (allows other players to load new game)
    public loadGame(gameId: number, userName: string) {
      
      let gameLoaded = new Promise((resAll) => {
        let gamePromises: any = this.$q.when();
        gamePromises = gamePromises.then(() => {
          return new Promise((resCats) => {
            this.getAllCats().then((message) => {
              resCats(message)
            })
          })
        });

        let gameTablesLoaded: any = [];
        gameTablesLoaded.push(this.loadGameData(gameId));
        gameTablesLoaded.push(this.loadGameCategories(gameId));
        gameTablesLoaded.push(this.loadPlayers(gameId, userName));
        gameTablesLoaded.push(this.loadGameBoards(gameId));

        gamePromises = gamePromises.then(() => {
          return this.$q.all(gameTablesLoaded)
        })


        this.$q.when(gamePromises)
          .then(() => {
            // console.log(`Game`, this.newGameData);
            this.showSection = this.gameState;
            console.log(`AnswerOrder:`, this.answerOrder)
            if (this.gameData.gameBoardId > 0) {
              let gameBoard = this.gameBoards.find(gb => { return gb.id == this.gameData.gameBoardId })
              this.question = gameBoard;
              this.winner = gameBoard.answeredCorrectlyUserId;

              let player = this.players.find(p => { return p.playerId == this.myGamePlayerId });
              if (this.gameState == "question") {
                this.showSection = player.playerState;
              }
              console.log(`Question`, this.question, `My guess:`, this.guess, `My delay:`, this.delay, `Winner`, this.winner);
            }
            console.log(`Game ${this.gameId} fully loaded`, this.gameData);
            resAll(`Game fully loaded`)
          })
          .catch((errors) => {
            console.log(`It was bad, dude`);
            console.log(`errors`, errors);
          })
        return gamePromises;
      })
      return gameLoaded;
    }

    // TODO trigger once gameState "summary" is finished
    public destroyGame() {
      this._Resource_game.remove({ gameId: this.gameId }).$promise
        .then((gameData) => {
          this.gameDifficulty = 'all';
          this.gameData = new Models.GameModel;
          this.players.length = 0;
          this.gameCategories.length = 0;
          this.gameBoards.length = 0;
          this.group = '';
          this.gameChats.length = 0;
          this.question = new Models.GameBoardModel;
          this.answerOrder = 0;
          this.guess = 4;
        })
        .catch((error) => {
          console.log(`error`, error);
        })
    }

    // Used only when loading a game in the "play" state
    private loadGameData(gameId) {
      let newGameLoaded = new Promise((res) => {
        this.gameData = this._Resource_game.get({ gameId: gameId })
        this.gameData.$promise
          .then(() => {
            console.log(`Game Data loaded`);
            res('Game loaded to local model')
          })
      })
      return newGameLoaded;
    }

    // Show the gamecategories assigned to the current gameId
    public loadGameCategories(gameId) {
      let gameCategoriesLoaded = new Promise((resAll) => {
        let gameCategoriesPromises: any = this.$q.when();
        gameCategoriesPromises = gameCategoriesPromises.then(() => {
          return new Promise((resDelete, err) => {
            this.gameCategories.length = 0;
            resDelete(`Local Game Categories deleted`)
          })
        })
        gameCategoriesPromises = gameCategoriesPromises.then(() => {
          return new Promise((resData, err) => {
            this._Resource_game_categories.query({ id: gameId }).$promise
              .then((gameCats) => {
                resData(`Game category data loaded from table`);
                gameCats.forEach((oneCat) => {
                  gameCategoriesPromises = gameCategoriesPromises.then(() => {
                    return new Promise((resGameCat, err) => {
                      let gameCategory = this.allCategories.find(cat => { return cat.id == oneCat.categoryId })
                      gameCategory.gameCategoryId = oneCat.id;
                      gameCategory.categoryId = oneCat.categoryId;
                      this.gameCategories.push(gameCategory);
                      resGameCat(`Another game category loaded`)
                    })
                  })
                })
                this.$q.when(gameCategoriesPromises).then(() => {
                  // set the proper width of the category labels using ng-class "col sX"
                  this.gameCatClass = 'col s' + (12 / this.gameCategories.length).toString();
                  console.log(`Game Categories`, this.gameCategories);
                  resAll(`Game Categories loaded`)
                })
              })
          })
        })
        return gameCategoriesPromises;
      })
      return gameCategoriesLoaded;
    }

    // Show the players assigned to the current gameId
    public loadPlayers(gameId: number, userName: string): any {
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
                          if (player.userName == userName) {
                            this.gamePlayerId = player.playerId;
                            this.guess = player.answer;
                            this.delay = player.delay;
                          }
                          // console.log(`Player ${p.userName} added`);
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

    // Show the gameBoards assigned to the current gameId
    private loadGameBoards(gameId) {
      let gameBoardsLoaded = new Promise((resAll) => {
        let gameBoardsPromises: any = this.$q.when();
        gameBoardsPromises = gameBoardsPromises.then(() => {
          return new Promise((resData, err) => {
            this._Resource_gameBoard.query({ id: gameId }).$promise
              .then((gameBoards) => {
                resData(`Game board data loaded from table`)
                gameBoards.forEach(gameBoard => {
                  gameBoardsPromises = gameBoardsPromises.then(() => {
                    return new Promise((resBoard, err) => {
                      let cat = this.allCategories.find(cat => { return cat.id == gameBoard.categoryId });
                      gameBoard.catLong = cat.longDescription;
                      this.answerOrder = Math.max(this.answerOrder, gameBoard.answerOrder);
                      if (this.answerOrder == gameBoard.answerOrder) {
                        this.winner = gameBoard.answeredCorrectlyUserId
                      }
                      this.gameBoards.push(gameBoard);
                      resBoard(`Another gameBoard loaded`)
                    })
                  })
                })
                this.gameBoards.length = 0;
                console.log(`Local Game Boards deleted`);
                this.$q.when(gameBoardsPromises)
                  .then(() => {
                    console.log(`Game Boards`, this.gameBoards);
                    resAll(`Game Boards loaded`);
                  })
                  .catch((error) => {
                    console.log(`Unable to load Gameboard`);
                    err(error);
                  })
              })
          })
        })
        return gameBoardsPromises;
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
          // console.log(`newGameCat`, newGameCat);
          newGameCat.$save((cat) => {
            category.gameCategoryId = cat.id;
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
              this.gameCategories.splice(this.gameCategories.findIndex(c => { return c.gameCategoryId == categoryId }), 1);
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
      let gameBoardParsed = new Promise((resAll, err) => {
        let randomizedQs = [];
        let gameBoardPromises: any = this.$q.when();
        gameBoardPromises = gameBoardPromises.then(() => {
          return new Promise((resSave) => {
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
              })
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
                  resSave(this.gameBoards);
                })
            })
          })
        })
        this.$q.when(gameBoardPromises).then(() => {
          console.log(`Cat & Diff Game Boards selected`);
          resAll(`Cat & Diff Game Boards selected`);
        })
      })
      return gameBoardParsed;
    }

    // 
    private loadNewGameBoards(cat, diff) {
      let newGameBoardsLoaded = new Promise((resAll, err) => {
        let newGameBoardsPromises: any = this.$q.when();
        newGameBoardsPromises = newGameBoardsPromises.then(() => {
          return new Promise((resGet) => {
            this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
              .then((questions) => {
                console.log(`${cat.shortDescription} ${diff.value} Qs: ${questions.length}`);
                resGet(`Found Qs by Cat & Diff`)
                if (questions.length > 0) {
                  let prizePoints = [100, 200, 300][this.difficulty.findIndex(d => { return d.value == diff.value })];
                  newGameBoardsPromises = newGameBoardsPromises.then(() => {
                    return new Promise((resParse) => {
                      this.parseQuizToGameBoard(cat, questions, prizePoints).then(() => {
                        // console.log(`gameBoards:`, this.gameBoards);
                        resParse(`Cat & Diff Qs assigned to Game Boards`);
                      })
                    })
                  })
                } else {
                  let error = `No questions in ${cat.longDescription} - ${diff.title}`;
                  console.log(`error`);
                  err(`No questions to load`);
                }
              })
          })
        })
        this.$q.when(newGameBoardsPromises).then(() => {
          // console.log(`New Game Boards loaded`, );
          resAll(`New Game Boards loaded`)
        })
      })
      return newGameBoardsLoaded;
    }

    // ensure all old GameBoards are deleted from table
    private removeAllGameBoards(gameId) {
      let gameBoardsRemoved = new Promise((resAll) => {
        // this.gameBoards.length = 0;        
        let gameBoardsPromises: any = this.$q.when();
        gameBoardsPromises = gameBoardsPromises.then(() => {
          return new Promise((resData, err) => {
            this._Resource_gameBoard.query({ id: gameId }).$promise
              .then((gameBoards) => {
                resData(`Game Boards loaded from DB`)
                gameBoards.forEach((g) => {
                  gameBoardsPromises = gameBoardsPromises.then(() => {
                    return new Promise((resDelete, err) => {
                      this._Resource_gameBoard.remove({ id: g.id }).$promise
                        .then(() => {
                          resDelete(`Another Game Board deleted.`);
                        })
                    })
                  })
                })
                this.$q.when(gameBoardsPromises)
                  .then(() => {
                    console.log(`DB Game Boards Deleted`);
                    resAll(`DB Game Boards Deleted`);
                  })

              })
          })
        })
        return gameBoardsPromises;
      })
      return gameBoardsRemoved;
    }

    // Build the game board using the categories
    public setupGameBoards() {
      this.answerOrder = 0;
      console.log(`Creating GameBoards...`);
      this.gameBoards.length = 0;
      console.log(`Local Game Boards deleted`);
      let gameBoardsSetup = new Promise((resAll, err) => {
        if (this.players.length < 2 || this.gameCategories.length < 1) {
          console.log(`Unable to setup game - invite players & select categories`);
          err(`Unable to setup game`);
        }
        // line up all the promises to fill the gameBoard
        let gameBoardPromises: any = this.$q.when();

        gameBoardPromises = gameBoardPromises.then(() => {
          return new Promise((resRemove) => {
            this.removeAllGameBoards(this.gameId).then(() => {
              resRemove(`removeAllGameBoards complete`)
            })
          })
        })

        // set the proper width of the category labels using ng-class "col sX"
        this.gameCatClass = 'col s' + (12 / this.gameCategories.length).toString();

        // assign random question to each row & column based on
        // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
        // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
        this.numQuestions = 18 / this.gameCategories.length / (this.gameDifficulty == 'all' ? 3 : 1);
        this.row = 0;
        this.column = 0;
        this.perRow = 6 / this.gameCategories.length;

        this.gameCategories.forEach(cat => {
          this.difficulty.forEach(diff => {
            if (this.gameDifficulty == 'all' || this.gameDifficulty == diff.value) {
              gameBoardPromises = gameBoardPromises.then(() => {
                return new Promise((resLoad) => {
                  this.loadNewGameBoards(cat, diff).then(() => {
                    resLoad(`Another Game Board loaded`)
                  })
                })
              })
            }
          })
        })
        this.$q.when(gameBoardPromises).then(() => {
          console.log(`Game Boards setup`, this.gameBoards);
          resAll(`Game Boards setup`);
        })
      })
      return gameBoardsSetup;
    }

    // SignalR methods to update the tables
    public updateGamesTable(newGameData) {
      let gameUpdated = new Promise((res) => {
        // console.log(`newGameData`, newGameData);
        // console.log(`this.gameData`, this.gameData);

        // check whether any values actually changed
        var matches = true;
        for (var prop in newGameData) {
          if (newGameData.hasOwnProperty(prop)) {
            matches = matches && (newGameData[prop] == this.gameData[prop]);
          }
        }
        if (matches) {
          console.log(`No Game update required`);
          res(`No Game update required`);
        } else {
          console.log(`Updating Game...`, newGameData);
          this._Resource_game.update({ gameId: newGameData.id }, newGameData).$promise.then((gameData) => {
            res(`Game update sent to DB`)
          })
        }
      })
      return gameUpdated;
    }

    public updateGameBoardsTable(newGameBoardData) {
      let gameBoardUpdated = new Promise((res) => {

        // check whether any values actually changed
        let oldGameBoardData = this.gameBoards.find(gb => { return gb.id == newGameBoardData.id })
        let matches = true;
        for (var prop in newGameBoardData) {
          if (newGameBoardData.hasOwnProperty(prop)) {
            matches = matches && (newGameBoardData[prop] == oldGameBoardData[prop]);
          }
        }
        if (matches) {
          console.log(`No Game Board update required`);
          res(`No Game Board update required`);
        } else {
          console.log(`Updating Game Board...`, newGameBoardData);
          this._Resource_gameBoard.update({ id: newGameBoardData.id }, newGameBoardData).$promise.then((gameBoardData) => {
            res(`Game Board update sent to DB`)
          })
        }
      })
      return gameBoardUpdated;
    }

    public updateGamePlayersTable(newPlayerData) {
      let gamePlayerUpdated = new Promise((res) => {

        // check whether any values actually changed
        let oldPlayerData = this.players.find(p => { return p.playerId == newPlayerData.playerId })

        // console.log(`oldPlayerData`, oldPlayerData);
        // console.log(`newPlayerData`, newPlayerData);

        let matches = true;
        for (var prop in newPlayerData) {
          if (newPlayerData.hasOwnProperty(prop)) {
            matches = matches && (newPlayerData[prop] == oldPlayerData[prop]);
          }
        }
        if (matches) {
          console.log(`No Game Player update required`);
          res(`No Game Player update required`);
        } else {
          //  we have to whittle player down to gamePlayer properties
          let newGamePlayer = new this._Resource_game_players;
          newGamePlayer.gameId = newPlayerData.gameId;
          newGamePlayer.id = newPlayerData.playerId;
          newGamePlayer.initiator = newPlayerData.initiator;
          newGamePlayer.userId = newPlayerData.userName;
          newGamePlayer.prizePoints = newPlayerData.prizePoints;
          newGamePlayer.answer = newPlayerData.answer;
          newGamePlayer.delay = newPlayerData.delay;
          newGamePlayer.playerState = newPlayerData.playerState;

          console.log(`Updating Game Player...`, newGamePlayer);
          this._Resource_game_players.update({ id: newGamePlayer.id }, newGamePlayer).$promise.then(() => {
            res(`Game Player update sent to DB`)
          })
        }

      })
      return gamePlayerUpdated;
    }

    public setGameActiveUserId(userName: string): any {
      this.gameData.lastActiveUserId = this.gameData.activeUserId;
      this.gameData.activeUserId = userName;
      return this.updateGamesTable(this.gameData);
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
      // starting the action
      console.log(`Starting loop`);
      this.$q.when(loopPromises)
        .then(() => {
          // when all are complete!
          console.log(`All loops complete!`);
        })
    }

  }
}