var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GameModel = (function () {
            function GameModel() {
                this.id = 0;
                this.initiatorUserId = '';
                this.gameLength = 12;
                this.activeUserId = '';
                this.lastActiveUserId = '';
                this.startDateTime = new Date();
            }
            return GameModel;
        }());
        Models.GameModel = GameModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
