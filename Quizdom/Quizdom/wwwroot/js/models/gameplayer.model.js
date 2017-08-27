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
                this.playerState = "ready";
            }
            return GamePlayerModel;
        }());
        Models.GamePlayerModel = GamePlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
