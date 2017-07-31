// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    static $inject = [
      'AuthenticationService',
      '$resource'
    ];

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private $resource: ng.resource.IResourceService
    ) {

    }

    // manage 'Games' table
    private _Resource_game = this.$resource('/api/game/:gameId', null, {
      'update': {
        method: 'PUT'
      }
    });

    // manage 'GameCategories' - lists the categories selected for each gameId
    private _Resource_game_categories = this.$resource('/api/gamecategories/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

    // access 'Categories' to correlate categoryId to short & long name
    private _Resource_categories = this.$resource('/api/game/categories/:id', null, {
      'update': {
        method: 'PUT'
      }
    });

  }

}