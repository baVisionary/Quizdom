var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var AuthUserModel = (function () {
            function AuthUserModel() {
                this.userName = 'Guest';
                this.email = '';
                this.isAdmin = false;
                this.avatarId = 0;
                this.avatarUrl = "avatar_generic.png";
            }
            // constructor(user?) {
            //     this.userName = user.userName || 'Guest';
            //     this.email = user.email || '';
            //     this.isAdmin = user.isAdmin || false;
            //     this.avatarId = user.avatarId || 0;
            //     this.avatarUrl = user.avatarUrl || "avatar_generic.png";
            //     this.friendId = user.friendId || 0;
            // }
            AuthUserModel.getAnonymousUser = function () {
                var user = new Models.AuthUserModel;
                console.log("user", user);
                return user;
            };
            return AuthUserModel;
        }());
        Models.AuthUserModel = AuthUserModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
