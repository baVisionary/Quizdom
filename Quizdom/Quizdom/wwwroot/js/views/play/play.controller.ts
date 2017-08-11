namespace Quizdom.Views.Play {
  export class PlayController {

    static $inject = [
      'AuthenticationService',
      'GameService'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService
    ) {
      this.GameService.loadGame(this.AuthenticationService.User);
    }
  }
}