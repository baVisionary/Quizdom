var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var ForgotPassword;
        (function (ForgotPassword) {
            var ForgotPasswordController = (function () {
                function ForgotPasswordController() {
                    this.formData = new Quizdom.Models.ForgotPasswordModel();
                }
                ForgotPasswordController.prototype.requestPassword = function () {
                    // TODO: Complete process
                    console.log('testing request password');
                };
                return ForgotPasswordController;
            }());
            ForgotPasswordController.$inject = [];
            ForgotPassword.ForgotPasswordController = ForgotPasswordController;
        })(ForgotPassword = Views.ForgotPassword || (Views.ForgotPassword = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
