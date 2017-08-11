// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    public players: Models.IUser[] = [];
    public gameCategories: Models.ICategory[] = [];
    private newGameData;
    public allCategories: Models.ICategory[] = [];
    private allGames: any[] = [];

    static $inject = [
      'PlayerService',
      '$resource',
      '$q'
    ];

    constructor(
      private PlayerService: Services.PlayerService,
      private $resource: ng.resource.IResourceService,
      private $q: ng.IQService
    ) {
      this.getAllGames();
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
    public loadGame(user): boolean {
      let lastGame = this.findLastGame(user);
      lastGame.$promise
        .then(() => {
          // console.log(`lastGame`, lastGame);
          if (lastGame.hasOwnProperty('initiatorUserId')) {
            this.newGameData = lastGame;
            console.log(`newGameData`, this.newGameData);
            this.loadPlayers(user)
              .then(() => {
              })
              .catch((error) => {
                console.log(`Error:`, error);
              })
            this.loadGameCategories()
            return true;
          }
          let newGame = this._Resource_game.save({ initiatorUserId: user.userName });
          newGame.$promise
            .then((game) => {
              // this.newGameData = newGame;
              this.newGameData = this._Resource_game.get({ gameId: game.id })
              this.newGameData.$promise
                .then(() => {
                  console.log(`newGameData`, this.newGameData);
                  this.loadPlayers(user)
                  return true;
                })
            })
        })
        .catch((error) => {
          console.log(error);
          return false;
        })
      return false;
    }

    private getAllGames(): boolean {
      this._Resource_game.query().$promise
        .then((games) => {
          this.allGames = games;
          console.log(`Games:`, this.allGames);
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        })
      return false;
    }

    // Show the gamecategories assigned to the current gameId
    private loadGameCategories() {
      this._Resource_game_categories.query({ id: this.newGameId }).$promise
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

    // Show the players assigned to the current gameId
    private loadPlayers(user: Models.IUser) {
      return this._Resource_game_players.query({ id: this.newGameId }).$promise
        .then((players) => {
          // console.log(`players`, players);
          if (players.length == 0) {
            this.addPlayer(this.newGameId, user, true)
          } else {
            players.forEach((p, i) => {
              // console.log(`p.userId`, p.userId);
              this.PlayerService.findByUserName(p.userId)
                .then((player) => {
                  player.playerId = p.id;
                  this.players[i] = player;
                })
            })
          }
          console.log(`this.players`, this.players);
        })
    }

    // Add player who is registered
    public addPlayer(gameId: number, user: Models.IUser, initiator: boolean): boolean {
      if (this.players.length < 3 && this.players.findIndex(p => { return p.userName == user.userName }) == -1) {
        var player = new this._Resource_game_players;
        player.gameId = gameId;
        player.userId = user.userName;
        player.initiator = initiator;
        player.$save((player) => {
          user.playerId = player.id;
          this.players.push(user);
          console.log(`players`, this.players);
          return true;
        })
          .catch((error) => {
            console.log(`Error:`, error);
          })
      }
      return false;
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

  }
}