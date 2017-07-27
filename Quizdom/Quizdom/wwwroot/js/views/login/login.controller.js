var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Login;
        (function (Login) {
            var LoginController = (function () {
                function LoginController($state, LoginService, AuthenticationService) {
                    this.$state = $state;
                    this.LoginService = LoginService;
                    this.AuthenticationService = AuthenticationService;
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
                    this.LoginService.loginUser(this.formData)
                        .then(function (result) {
                        if (result) {
                            _this.loginError = false;
                            _this.goToUser();
                        }
                        _this.loginError = true;
                    });
                };
                LoginController.prototype.goToUser = function () {
                    this.$state.go('User');
                };
                return LoginController;
            }());
            LoginController.$inject = [
                '$state',
                'LoginService',
                'AuthenticationService'
            ];
            Login.LoginController = LoginController;
        })(Login = Views.Login || (Views.Login = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
