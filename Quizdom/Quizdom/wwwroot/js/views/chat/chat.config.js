var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Chat', {
                    url: '/chat',
                    templateUrl: 'js/views/chat/chat.html',
                    controller: 'ChatController',
                    controllerAs: 'vm'
                });
            }
            Chat.Configuration = Configuration;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
