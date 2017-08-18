var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            var SetupController = (function () {
                function SetupController(AuthenticationService, GameService, $state) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.$state = $state;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.GameService.loadMyGameData(this.AuthenticationService.User)
                        .then(function () {
                        _this.GameService.loadGamePlayers(_this.GameService.gameId);
                        _this.GameService.loadGameCategories(_this.GameService.gameId);
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
                    this.GameService.setupGameBoards()
                        .then(function () {
                        _this.$state.go("Play", { gameId: _this.GameService.gameId });
                    });
                };
                SetupController.$inject = [
                    'AuthenticationService',
                    'GameService',
                    '$state'
                ];
                return SetupController;
            }());
            Setup.SetupController = SetupController;
        })(Setup = Views.Setup || (Views.Setup = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
