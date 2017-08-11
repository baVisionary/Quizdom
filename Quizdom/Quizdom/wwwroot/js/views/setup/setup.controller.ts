namespace Quizdom.Views.Setup {
  export class SetupController {

    static $inject = [
      'AuthenticationService',
      'GameService',
      '$state'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService,
      private $state: ng.ui.IStateService
    ) {
      if (!this.AuthenticationService.isLoggedIn) {
        this.$state.go('Login');
      }
      this.GameService.loadGame(this.AuthenticationService.User);
    }

    public addCategory(cat) {
      console.log(`Add category requested:`, cat.longDescription);
      this.GameService.addCategory(cat);
    }

    public removeCategory(playerId: number) {
      this.GameService.removeCategory(playerId);
    }



  }
}