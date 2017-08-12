// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    private allGames: any[] = [];
    public allCategories: Models.ICategory[] = [];
    private questionsByCatDiff: Models.GameQuestionModel[] = [];
    private difficulty = [
      { label: 'Easy', value: 'easy' },
      { label: 'Medium', value: 'medium' },
      { label: 'Hard', value: 'hard' }
    ];

    private newGameData;
    public gamePlayers: Models.IUser[] = [];
    public gameCategories: Models.ICategory[] = [];
    public gameDifficulty: string = 'all';
    public gameQuestions: Models.GameQuestionModel[] = [];
    private numQuestions: number = 0;

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
      this.findLastGame(user).$promise
        .then((lastGame) => {
          // console.log(`lastGame`, lastGame);
          if (lastGame.hasOwnProperty('initiatorUserId')) {
            this.newGameData = lastGame;
            console.log(`newGameData`, this.newGameData);
            this.$q.all([this.loadGameCategories(), this.loadPlayers(user)])
              .then(() => {
                console.log(`Game Player length:`, this.gamePlayers.length);
                console.log(`Game Category length:`, this.gameCategories.length);
                this.setupGameBoard();
                return true;
              })
          } else {
            let newGame = this._Resource_game.save({ initiatorUserId: user.userName });
            newGame.$promise
              .then((game) => {
                // this.newGameData = newGame;
                this._Resource_game.get({ gameId: game.id }).$promise
                  .then((newGame) => {
                    this.newGameData = newGame;
                    console.log(`newGameData`, this.newGameData);
                    // return this.loadPlayers(user);
                    return true;
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
            return false;
          }
        })
    }


    public destroyGame() {
      this.newGameData = {};
      this.gamePlayers = [];
      this.gameCategories = [];
      this.gameDifficulty = 'all';
      this.gameQuestions = [];
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
        })
    }

    // Show the gamecategories assigned to the current gameId
    private loadGameCategories() {
      return this._Resource_game_categories.query({ id: this.newGameId }).$promise
        .then((gameCategories) => {
          // let gameCategories = allGameCategories.filter(c => { return c.gameId == this.newGameId});
          gameCategories.forEach((gameCategory, i) => {
            let category = this.allCategories.find(c => { return c.id == gameCategory.categoryId })
            category.categoryId = gameCategory.id;
            this.gameCategories[i] = category;
          })
          console.log(`Game Categories`, this.gameCategories);
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
    private addInRandomOrder(arrayToAdd, arraySelect, amount: number): void {
      // might be nice to support if fewer in list than amount
      for (var i = 0; i < amount; i++) {
        let last = arraySelect.length - 1 - i;
        let randomOne = this.randomInt(0, last);
        arrayToAdd.push(arraySelect[randomOne])
        let temp = arraySelect[randomOne];
        arraySelect[randomOne] = arraySelect[last];
        arraySelect[last] = temp;
      }
    }

    // Load all the Qs with a specific Category and Difficulty
    // Store only the question data to play the game
    // Randomize the answer order
    private loadQsByCatAndDiff(cat: string, diff: string) {
      return this.QuestionService.getQsByCatAndDiff(cat, diff)
    }

    // Build the game board using the categories
    public setupGameBoard() {
      this.gameQuestions.length  = 0;
      if (this.gamePlayers.length < 2 || this.gameCategories.length < 1) {
        console.log(`Unable to setup game - invite players & select categories`);
        return false
      }

      // assign random question to each row & column based on
      // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
      // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
      let numQuestions = 18 / this.gameCategories.length / (this.gameDifficulty == 'all' ? 3 : 1);
      let QsByCatAndDiff = [];

      this.gameCategories.forEach(cat => {
        this.difficulty.forEach(diff => {
          this.loadQsByCatAndDiff(cat.longDescription, diff.value).$promise
            .then((questions) => {
              // console.log(`questions`, questions);
              QsByCatAndDiff.length = 0;
              questions.forEach(q => {
                let gameQ = new Models.GameQuestionModel;
                gameQ.questionId = q.id;
                gameQ.questionText = q.question;
                gameQ.categoryId = cat.id;
                this.addInRandomOrder(gameQ.answers, [
                  { answer: q.correct_Answer, correct: true },
                  { answer: q.incorrect_Answer1, correct: false },
                  { answer: q.incorrect_Answer2, correct: false },
                  { answer: q.incorrect_Answer3, correct: false }
                ], 4);
                gameQ.difficulty = q.difficulty;
                QsByCatAndDiff.push(gameQ);
              });
              // console.log(`QsByCatAndDiff`, QsByCatAndDiff);

              let numQs = (this.gameDifficulty == 'all' || this.gameDifficulty == diff.value ? numQuestions : 0);
              this.addInRandomOrder(this.gameQuestions, QsByCatAndDiff, numQs);
            })
            .catch((error) => {
              console.log(`error:`, error);
            });
        });
      });

      console.log(`gameQuestions:`, this.gameQuestions);
    }

  }
}