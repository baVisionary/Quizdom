var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var ChatController = (function () {
                function ChatController($http, $scope, ChatService) {
                    this.$http = $http;
                    this.$scope = $scope;
                    this.ChatService = ChatService;
                    this.showDate = false;
                    this.ChatService.getPosts();
                }
                ChatController.prototype.sendMessage = function () {
                    this.ChatService.sendMessage($("#textInput").val())
                        .then(function () {
                        $("#textInput").val("");
                    })
                        .catch(function (e) {
                        console.log(e);
                    });
                };
                ChatController.$inject = [
                    '$http',
                    '$scope',
                    'ChatService'
                    // 'ChatService'
                ];
                return ChatController;
            }());
            Chat.ChatController = ChatController;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
