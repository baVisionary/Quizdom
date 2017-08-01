var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var module = angular.module('View.Chat', []);
            module.config(Chat.Configuration);
            module.controller('ChatController', Chat.ChatController);
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
