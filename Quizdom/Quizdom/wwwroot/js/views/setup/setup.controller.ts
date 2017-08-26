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
      this.GameService.loadMyGameData(this.AuthenticationService.User).then(() => {
        this.GameService.getAllCats().then(() => {
          this.GameService.loadPlayers(this.GameService.gameId)
          this.GameService.loadGameCategories(this.GameService.gameId)
        })
      })
    }

    public addCategory(cat) {
      console.log(`Add category requested:`, cat.longDescription);
      this.GameService.addCategory(cat);
    }

    public removeCategory(playerId: number) {
      this.GameService.removeCategory(playerId);
    }

    public playQuizdom() {
      this.GameService.setupGameBoards()
        .then(() => {
          this.$state.go(`Play`, { gameId: this.GameService.gameId });
        })
    }

  }
}