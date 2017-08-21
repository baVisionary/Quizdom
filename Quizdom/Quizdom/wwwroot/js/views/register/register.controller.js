var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            var RegisterController = (function () {
                function RegisterController(RegistrationService, LoginService, $state, AvatarService, AuthenticationService) {
                    this.RegistrationService = RegistrationService;
                    this.LoginService = LoginService;
                    this.$state = $state;
                    this.AvatarService = AvatarService;
                    this.AuthenticationService = AuthenticationService;
                    this.formData = new Quizdom.Models.RegisterModel();
                    this.newUser = new Quizdom.Models.LoginModel();
                    this.pattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
                    this.AvatarService.getAllAvatars();
                }
                RegisterController.prototype.checkRegExp = function (reg, str) {
                    // console.log(str);
                    var regTest = new RegExp('');
                    switch (reg) {
                        case 'Number':
                            regTest = new RegExp('(?=.*[0-9]).*');
                            break;
                        case 'Symbol':
                            regTest = new RegExp('(?=.*[!@#\$%\^&\*]).*');
                            break;
                        case 'Upper':
                            regTest = new RegExp('(?=.*[A-Z]).*');
                            break;
                        case 'Lower':
                            regTest = new RegExp('(?=.*[a-z]).*');
                            break;
                        default:
                            regTest = new RegExp('(?=.{8,}).*');
                            break;
                    }
                    // console.log(`Regexp: ${reg}: ${regTest.test(str)}`);
                    return regTest.test(str);
                };
                RegisterController.prototype.registerUser = function () {
                    var _this = this;
                    this.RegistrationService
                        .registerUser(this.formData)
                        .then(function (user) {
                        console.log(user);
                        _this.newUser.email = user.email;
                        _this.newUser.password = _this.formData.password;
                        console.log(_this.newUser);
                        _this.LoginService.loginUser(_this.newUser)
                            .then(function (result) {
                            console.log("Login process result: " + result);
                            if (result) {
                                _this.goToUser();
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return error;
                        });
                    });
                };
                RegisterController.prototype.goToUser = function () {
                    this.$state.go('User');
                };
                RegisterController.$inject = [
                    'RegistrationService',
                    'LoginService',
                    '$state',
                    'AvatarService',
                    'AuthenticationService'
                ];
                return RegisterController;
            }());
            Register.RegisterController = RegisterController;
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
