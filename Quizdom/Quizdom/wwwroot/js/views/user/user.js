var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var module = angular.module('View.User', []);
            module.config(User.Configuration);
            module.controller('UserController', User.UserController);
            // module.directive('PlayerDirective', Directives.qzPlayer);
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
