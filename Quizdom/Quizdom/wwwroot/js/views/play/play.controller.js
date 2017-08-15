var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.showQ = false;
                    this.GameService.loadGame(this.AuthenticationService.User)
                        .then(function () {
                        _this.GameService.setupGameBoard();
                    });
                }
                PlayController.prototype.showThisQuestion = function (questionId) {
                    this.question = this.GameService.gameBoards.find(function (q) { return q.questionId == questionId; });
                    this.question.questionState = "ask";
                    this.showQ = true;
                };
                PlayController.prototype.chooseThisAnswer = function (questionId, answerIndex) {
                };
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
