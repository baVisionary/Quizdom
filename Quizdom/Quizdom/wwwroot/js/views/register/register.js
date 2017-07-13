var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            var module = angular.module('View.Register', []);
            module.config(Register.Configuration);
            module.controller('RegisterController', Register.RegisterController);
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
