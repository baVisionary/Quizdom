var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var UserModel = (function () {
            function UserModel() {
                this.userName = '';
            }
            UserModel.getAnonymousUser = function () {
                var user = new Models.UserModel();
                user.userName = 'Anonymous';
                return user;
            };
            return UserModel;
        }());
        Models.UserModel = UserModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
