var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            var SetupController = (function () {
                function SetupController(AuthenticationService, GameService, $state, $q) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.$state = $state;
                    this.$q = $q;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    var gameAndCatsLoaded = [];
                    gameAndCatsLoaded.push(this.GameService.loadMyGameData(this.AuthenticationService.User.userName));
                    gameAndCatsLoaded.push(this.GameService.getAllCats());
                    this.$q.all(gameAndCatsLoaded).then(function () {
                        _this.GameService.loadGameCategories(_this.GameService.gameId);
                        _this.GameService.loadPlayers(_this.GameService.gameId, _this.AuthenticationService.User.userName);
                    });
                }
                SetupController.prototype.addCategory = function (cat) {
                    console.log("Add category requested:", cat.longDescription);
                    this.GameService.addCategory(cat);
                };
                SetupController.prototype.removeCategory = function (playerId) {
                    this.GameService.removeCategory(playerId);
                };
                SetupController.prototype.playQuizdom = function () {
                    var _this = this;
                    // Games - initialize new game data
                    var newGameData = angular.copy(this.GameService.gameData);
                    var firstPlayerIndex = this.GameService.randomInt(0, this.GameService.players.length - 1);
                    newGameData.activeUserId = newGameData.lastActiveUserId = this.GameService.players[firstPlayerIndex].userName;
                    newGameData.gameBoardId = 0;
                    newGameData.gameState = "welcome";
                    var gamePlayerPromises = this.$q.when();
                    // GamePlayers - set all prizePoints to 0
                    this.GameService.players.forEach(function (playerData) {
                        // copy each player to update values
                        var newPlayerData = angular.copy(playerData);
                        newPlayerData.prizePoints = 0;
                        gamePlayerPromises = gamePlayerPromises.then(function () {
                            return _this.GameService.updateGamePlayersTable(newPlayerData);
                        });
                    });
                    var gameReady = [];
                    gameReady.push(this.$q.when(gamePlayerPromises));
                    gameReady.push(this.GameService.setupGameBoards());
                    gameReady.push(this.GameService.updateGamesTable(newGameData));
                    this.$q.all(gameReady).then(function () {
                        _this.$state.go("Play", { gameId: _this.GameService.gameId });
                    });
                };
                SetupController.$inject = [
                    'AuthenticationService',
                    'GameService',
                    '$state',
                    '$q'
                ];
                return SetupController;
            }());
            Setup.SetupController = SetupController;
        })(Setup = Views.Setup || (Views.Setup = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
