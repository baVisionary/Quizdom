namespace Quizdom.Views.Play {
  export class PlayController {

    static $inject = [
      'AuthenticationService'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService
    ) {
      
    }
  }
}