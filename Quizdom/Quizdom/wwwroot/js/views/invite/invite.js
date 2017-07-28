var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Login;
        (function (Login) {
            var module = angular.module('View.Invite', []);
            module.config(Views.Invite.Configuration);
            module.controller('InviteController', Views.Invite.InviteController);
        })(Login = Views.Login || (Views.Login = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
