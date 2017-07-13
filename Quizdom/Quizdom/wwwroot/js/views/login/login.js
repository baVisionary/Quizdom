var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Login;
        (function (Login) {
            var module = angular.module('View.Login', []);
            module.config(Login.Configuration);
            module.controller('LoginController', Login.LoginController);
        })(Login = Views.Login || (Views.Login = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
