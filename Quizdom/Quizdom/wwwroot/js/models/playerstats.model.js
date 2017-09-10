var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var PlayerStatsModel = (function () {
            function PlayerStatsModel() {
                this.questionsRight = 0;
                this.questionsRightDelay = 0;
                this.questionsWon = 0;
                this.gamesPlayed = 0;
                this.gamesWon = 0;
            }
            return PlayerStatsModel;
        }());
        Models.PlayerStatsModel = PlayerStatsModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
