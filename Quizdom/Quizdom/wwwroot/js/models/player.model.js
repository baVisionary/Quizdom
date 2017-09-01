var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var PlayerModel = (function (_super) {
            __extends(PlayerModel, _super);
            function PlayerModel(user, gamePlayer) {
                var _this = _super.call(this) || this;
                _this.initiator = false;
                _this.prizePoints = 0;
                _this.answer = 0;
                _this.delay = 0;
                _this.playerState = 'ready';
                _this.userName = user.userName;
                _this.email = user.email;
                _this.avatarId = user.avatarId;
                _this.avatarUrl = user.avatarUrl;
                _this.isAdmin = user.isAdmin;
                _this.friendId = user.friendId;
                _this.playerId = gamePlayer.id;
                _this.gameId = gamePlayer.gameId;
                _this.initiator = gamePlayer.initiator;
                _this.prizePoints = gamePlayer.prizePoints;
                _this.answer = gamePlayer.answer;
                _this.delay = gamePlayer.delay;
                // ready (gameState: pick) prepare/ask/guess/results (gameState: question) winner/loser (gameState: summary)
                _this.playerState = gamePlayer.playerState;
                return _this;
            }
            return PlayerModel;
        }(Models.UserModel));
        Models.PlayerModel = PlayerModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
