namespace Quizdom.Views.Setup {
  export class SetupController {

    static $inject = [
      'AuthenticationService'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService
    ) {
      
    }
  }
}