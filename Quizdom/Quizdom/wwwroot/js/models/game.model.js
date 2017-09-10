var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GameModel = (function () {
            function GameModel() {
                this.id = 0;
                this.initiatorUserId = '';
                this.gameLength = 18;
                this.activeUserId = '';
                this.lastActiveUserId = '';
                this.startDateTime = new Date();
                // cycles through setup/welcome/pick/question/results/summary
                this.gameState = "setup";
                this.gameBoardId = 0;
            }
            return GameModel;
        }());
        Models.GameModel = GameModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
