var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            var RegisterController = (function () {
                function RegisterController(RegistrationService, $state) {
                    this.RegistrationService = RegistrationService;
                    this.$state = $state;
                    this.formData = new Quizdom.Models.RegisterModel();
                    this.pattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
                }
                RegisterController.prototype.registerUser = function () {
                    var _this = this;
                    this.RegistrationService
                        .registerUser(this.formData)
                        .then(function (result) {
                        if (result) {
                            _this.$state.go('Login');
                        }
                    });
                };
                return RegisterController;
            }());
            RegisterController.$inject = [
                'RegistrationService',
                '$state'
            ];
            Register.RegisterController = RegisterController;
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
