var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var ChatController = (function () {
                function ChatController($http, $scope, ChatService, AuthenticationService) {
                    var _this = this;
                    this.$http = $http;
                    this.$scope = $scope;
                    this.ChatService = ChatService;
                    this.AuthenticationService = AuthenticationService;
                    this.showDate = false;
                    $scope.posts = [];
                    $scope.post;
                    $scope.chatroom = 'MainChatroom';
                    $scope.getPosts = function () {
                        _this.$http({ method: 'GET', url: '/Chatroom' }).then(function (response) { $scope.addPostsList(response.data); });
                    };
                    $scope.addPostsList = function (pastPosts) {
                        pastPosts.forEach(function (post) {
                            $scope.posts.push(post);
                        });
                        console.log('$scope.posts', $scope.posts);
                    };
                    $scope.sendMessage = function () {
                        console.log($scope);
                        $scope.post = { Chatroom: $scope.chatroom, UserName: _this.AuthenticationService.User.userName, Content: $("#textInput").val() };
                        console.log($scope.post);
                        _this.$http.post('/chatroom/', JSON.stringify($scope.post))
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    // the scope of this proxy Method is this.connection.broadcaster
                    $scope.addPost = function (post) {
                        console.log('New post from server: ', post);
                        console.log('$scope:', $scope);
                        // console.log('this:', this);
                        $scope.posts.push(post);
                    };
                    // Connect to the broadcaster on the server
                    this.ChatService.connect();
                    // A function we will call from the server
                    this.ChatService.connection.broadcaster.client.addChatMessage = $scope.addPost;
                    // this.ChatService.connection.broadcaster.client.posts = [];
                    // Let's connect to the hub!
                    this.ChatService.startConnection(this.ChatService.connection, $scope.chatroom);
                    $scope.getPosts($scope);
                }
                // public posts: Models.MessageViewModel[];
                // public chatroom: string = 'MainChatroom';
                ChatController.$inject = [
                    '$http',
                    '$scope',
                    'ChatService',
                    'AuthenticationService'
                    // 'ChatService'
                ];
                return ChatController;
            }());
            Chat.ChatController = ChatController;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
