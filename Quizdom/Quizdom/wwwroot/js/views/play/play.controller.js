var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService) {
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.GameService.loadGame(this.AuthenticationService.User);
                }
                PlayController.$inject = [
                    'AuthenticationService',
                    'GameService'
                ];
                return PlayController;
            }());
            Play.PlayController = PlayController;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
