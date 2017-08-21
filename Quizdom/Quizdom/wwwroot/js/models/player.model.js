var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var PlayerModel = (function () {
            function PlayerModel(user, gamePlayer) {
                this.userName = 'Guest';
                this.email = '';
                this.isAdmin = false;
                this.avatarId = 0;
                this.avatarUrl = "avatar_generic.png";
                this.gamePlayerId = 0;
                this.initiator = false;
                this.prizePoints = 0;
                this.gameId = gamePlayer.gameId;
                this.gamePlayerId = gamePlayer.id;
                this.initiator = gamePlayer.initiator;
                this.prizePoints = gamePlayer.prizePoints;
                this.answer = gamePlayer.answer;
                this.delay = gamePlayer.delay;
            }
            return PlayerModel;
        }());
        Models.PlayerModel = PlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
