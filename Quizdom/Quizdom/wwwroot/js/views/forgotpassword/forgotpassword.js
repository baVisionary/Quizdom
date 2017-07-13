var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var ForgotPassword;
        (function (ForgotPassword) {
            var module = angular.module('View.ForgotPassword', []);
            module.config(ForgotPassword.Configuration);
            module.controller('ForgotPasswordController', ForgotPassword.ForgotPasswordController);
        })(ForgotPassword = Views.ForgotPassword || (Views.ForgotPassword = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
