var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Welcome;
        (function (Welcome) {
            var module = angular.module('View.Welcome', []);
            module.config(Welcome.Configuration);
            module.controller('WelcomeController', Welcome.WelcomeController);
        })(Welcome = Views.Welcome || (Views.Welcome = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
