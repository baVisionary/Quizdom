namespace Quizdom.Views.Setup {
  export class SetupController {

    static $inject = [
      'AuthenticationService',
      'GameService',
      '$state',
      '$q'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService,
      private $state: ng.ui.IStateService,
      private $q: ng.IQService
    ) {
      if (!this.AuthenticationService.isLoggedIn) {
        this.$state.go('Login');
      }
      let gameAndCatsLoaded = [];
      gameAndCatsLoaded.push(this.GameService.loadMyGameData(this.AuthenticationService.User.userName));
      gameAndCatsLoaded.push(this.GameService.getAllCats());

      this.$q.all(gameAndCatsLoaded).then(() => {
        this.GameService.loadGameCategories(this.GameService.gameId)
        this.GameService.loadPlayers(this.GameService.gameId, this.AuthenticationService.User.userName)
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
      let newGameData = angular.copy(this.GameService.gameData);
      let firstPlayerIndex = this.GameService.randomInt(0, this.GameService.players.length-1)
      newGameData.activeUserId = newGameData.lastActiveUserId = this.GameService.players[firstPlayerIndex].userName;
      newGameData.gameState = "welcome";

      let gameReady = [];
      gameReady.push(this.GameService.setupGameBoards());
      gameReady.push(this.GameService.updateGamesTable(newGameData));

      this.$q.all(gameReady).then(() => {
        this.$state.go(`Play`, { gameId: this.GameService.gameId });
      })
    }
    
  }
}