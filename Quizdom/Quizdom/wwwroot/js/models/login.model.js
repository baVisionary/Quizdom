var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var LoginModel = (function () {
            function LoginModel() {
                this.email = '';
                this.password = '';
                this.rememberMe = false;
            }
            return LoginModel;
        }());
        Models.LoginModel = LoginModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
