var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            var SetupController = (function () {
                function SetupController(AuthenticationService, GameService, $state) {
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.$state = $state;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.GameService.loadGame(this.AuthenticationService.User);
                }
                SetupController.prototype.addCategory = function (cat) {
                    console.log("Add category requested:", cat.longDescription);
                    this.GameService.addCategory(cat);
                };
                SetupController.prototype.removeCategory = function (playerId) {
                    this.GameService.removeCategory(playerId);
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
