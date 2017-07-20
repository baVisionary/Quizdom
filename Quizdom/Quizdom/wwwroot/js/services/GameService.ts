// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?

namespace Quizdom.Services {

  export class GameService {

    static $inject = [
      '$resource'
    ];
    private _Resource_game = this.$resource('/api/quiz/:gameId', null, {
      'update': {
        method: 'PUT'
      }
    });

    constructor(
      private $resource
    ) {

    }

  }

}