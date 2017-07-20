var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Login;
        (function (Login) {
            var LoginController = (function () {
                function LoginController(UserService, $state) {
                    this.UserService = UserService;
                    this.$state = $state;
                    this.formData = new Quizdom.Models.LoginModel();
                    this.loginError = false;
                }
                Object.defineProperty(LoginController.prototype, "canLogin", {
                    get: function () {
                        return this.formData.email.length > 0 &&
                            this.formData.password.length > 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                LoginController.prototype.loginUser = function () {
                    var _this = this;
                    this.UserService
                        .loginUser(this.formData)
                        .then(function (result) {
                        if (result) {
                            _this.loginError = false;
                            _this.$state.go('User', { userName: _this.UserService.user.userName });
                        }
                        _this.loginError = true;
                    });
                };
                return LoginController;
            }());
            LoginController.$inject = [
                'UserService',
                '$state'
            ];
            Login.LoginController = LoginController;
        })(Login = Views.Login || (Views.Login = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
