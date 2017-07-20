var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            var RegisterController = (function () {
                function RegisterController(RegistrationService, UserService, $state, $resource) {
                    this.RegistrationService = RegistrationService;
                    this.UserService = UserService;
                    this.$state = $state;
                    this.$resource = $resource;
                    this.formData = new Quizdom.Models.RegisterModel();
                    this.user = new Quizdom.Models.UserModel();
                    this.pattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
                    this.avatars = [];
                    this.avatars = this.RegistrationService.getAvatars();
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
                    this.RegistrationService
                        .registerUser(this.formData)
                        .then(function (result) {
                        if (result) {
                        }
                    })
                        .catch(function () {
                    });
                };
                return RegisterController;
            }());
            RegisterController.$inject = [
                'RegistrationService',
                'UserService',
                '$state',
                '$resource'
            ];
            Register.RegisterController = RegisterController;
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
