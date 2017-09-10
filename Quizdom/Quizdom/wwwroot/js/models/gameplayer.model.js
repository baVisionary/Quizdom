var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GamePlayerModel = (function () {
            function GamePlayerModel() {
                this.gameId = 0;
                this.userId = "";
                this.initiator = false;
                this.prizePoints = 0;
                this.answer = 0;
                this.delay = 0;
                // playing (gameState: pick) prepare/ask/guess/right/winner/wrong (gameState: question) winner/loser (gameState: summary)
                this.playerState = "ready";
                this.questionsRight = 0;
                this.questionsRightDelay = 0;
                this.questionsWon = 0;
            }
            return GamePlayerModel;
        }());
        Models.GamePlayerModel = GamePlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
