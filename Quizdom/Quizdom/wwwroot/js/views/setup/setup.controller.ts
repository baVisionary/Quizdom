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

      // Games - initialize new game data
      let newGameData = angular.copy(this.GameService.gameData);
      let firstPlayerIndex = this.GameService.randomInt(0, this.GameService.players.length - 1)
      newGameData.activeUserId = newGameData.lastActiveUserId = this.GameService.players[firstPlayerIndex].userName;
      newGameData.gameBoardId = 0;
      newGameData.gameState = "rules";

      let gamePlayerPromises: any = this.$q.when();

      // GamePlayers - set all prizePoints to 0
      this.GameService.players.forEach(playerData => {
        // copy each player to update values
        let newPlayerData = angular.copy(playerData);
        newPlayerData.prizePoints = 0;
        newPlayerData.questionsRight = 0;
        newPlayerData.questionsRightDelay = 0;
        newPlayerData.questionsWon = 0;

        gamePlayerPromises = gamePlayerPromises.then(() => {
          return this.GameService.updateGamePlayersTable(newPlayerData);
        })
        
      })

      let gameReady = [];
      gameReady.push(this.$q.when(gamePlayerPromises));
      gameReady.push(this.GameService.setupGameBoards());
      gameReady.push(this.GameService.updateGamesTable(newGameData));

      this.$q.all(gameReady).then(() => {
        this.$state.go(`Play.rules`, { gameId: this.GameService.gameId });
      })
    }

  }
}