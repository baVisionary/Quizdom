var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            var RegisterController = (function () {
                function RegisterController(RegistrationService, AvatarService, UserService, $state, Avatar) {
                    this.RegistrationService = RegistrationService;
                    this.AvatarService = AvatarService;
                    this.UserService = UserService;
                    this.$state = $state;
                    this.Avatar = Avatar;
                    this.formData = new Quizdom.Models.RegisterModel();
                    this.authUser = new Quizdom.Models.LoginModel();
                    this.pattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
                    // this.avatars = [{id: 0, imageUrl: 'avatar_generic.png'}];
                    this.avatars = this.AvatarService.getAllAvatars();
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
                        _this.authUser.email = user.email;
                        _this.authUser.password = _this.formData.password;
                        _this.authUser.rememberMe = true;
                        console.log(_this.authUser);
                        _this.UserService
                            .loginUser(_this.authUser)
                            .then(function (result) {
                            if (result) {
                                _this.$state.go('User', {
                                    userName: _this.UserService.user.userName
                                });
                            }
                        });
                    })
                        .catch(function (error) {
                        console.log(error);
                        return error;
                    });
                };
                return RegisterController;
            }());
            // public RegistrationServices: angular.IServiceProvider;
            RegisterController.$inject = [
                'RegistrationService',
                'UserService',
                '$state',
                'AvatarResource',
                'AvatarService'
            ];
            Register.RegisterController = RegisterController;
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
