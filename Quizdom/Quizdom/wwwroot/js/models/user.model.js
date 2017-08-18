var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var UserModel = (function () {
            function UserModel() {
                this.userName = 'Guest';
                this.email = ',';
                this.avatarId = 0;
                this.avatarUrl = "avatar_generic.png";
                this.isAdmin = false;
                this.prizePoints = 0;
                this.answer = 0;
            }
            UserModel.getAnonymousUser = function () {
                var user = new Models.UserModel;
                return user;
            };
            return UserModel;
        }());
        Models.UserModel = UserModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
