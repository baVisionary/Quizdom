var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GamePlayerModel = (function () {
            function GamePlayerModel() {
                this.initiator = false;
                this.prizePoints = 0;
                this.answer = 0;
                this.delay = 0;
            }
            return GamePlayerModel;
        }());
        Models.GamePlayerModel = GamePlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
