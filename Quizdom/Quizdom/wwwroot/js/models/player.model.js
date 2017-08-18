var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var PlayerModel = (function () {
            function PlayerModel() {
                this.initiator = false;
                this.prizePoints = 0;
                this.answer = 0;
                this.delay = 0;
            }
            return PlayerModel;
        }());
        Models.PlayerModel = PlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
