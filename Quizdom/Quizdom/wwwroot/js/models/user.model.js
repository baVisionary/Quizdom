var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var UserModel = (function () {
            function UserModel() {
                // public id: number;
                this.userName = 'Guest';
                this.email = ',';
                this.avatarId = 0;
                this.avatarUrl = "avatar_generic.png";
                this.isAdmin = false;
            }
            // to support gamePlayer
            // public gameId?: number;
            // public userId?: string;
            // public playerId?: number;
            // public initiator?: boolean;
            // public prizePoints?: number = 0;
            // public answer?: number = 0;
            UserModel.getAnonymousUser = function () {
                var user = new Models.UserModel;
                return user;
            };
            return UserModel;
        }());
        Models.UserModel = UserModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
