var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var ChatController = (function () {
                function ChatController(AuthenticationService, $http, $scope) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.$http = $http;
                    this.$scope = $scope;
                    $scope.posts = [];
                    $scope.post;
                    $scope.connect = function (connection, chatroom) {
                        // Let's connect to the hub!
                        connection.hub.start().done(function (signalr) {
                            console.log('Connected!');
                            console.log('SignalR object: ', signalr);
                            // The subscribe method lets you subscribe to a specific method on the server
                            // You could use this method to subscribe to a specific chatroom,
                            // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
                            connection.broadcaster.server.subscribe(chatroom);
                        }).fail(function (error) {
                            // Just in case we fail to connect
                            console.log('Failed to start connection! Error: ', error);
                        });
                    };
                    $scope.getPosts = function () {
                        _this.$http({ method: 'GET', url: '/Chatroom' }).then(function (response) { $scope.addPostsList(response.data); });
                    };
                    $scope.addPostsList = function (posts) {
                        posts.forEach(function (post) {
                            // $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
                            $scope.posts.push(post);
                        });
                        $scope.posts.sort(function (a, b) { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1; });
                        console.log($scope.posts);
                    };
                    $scope.addPost = function (post) {
                        console.log('New post from server: ', post);
                        // $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
                        $scope.posts.push(post);
                        $scope.$applyAsync();
                    };
                    $scope.sendMessage = function () {
                        var post = {
                            content: $("#textInput").val(),
                            userName: _this.AuthenticationService.User.userName,
                            group: 'MainChatroom'
                        };
                        _this.$http.post('/chatroom/', JSON.stringify(post))
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    // Connect to the broadcaster on the server
                    $scope.connection = ($.connection);
                    // A function we will call from the server
                    $scope.connection.broadcaster.client.addChatMessage = $scope.addPost;
                    // This console.logs a lot of helpful debugging info!
                    $scope.connection.hub.logging = true;
                    $scope.connect($scope.connection, "MainChatroom");
                    $scope.getPosts();
                }
                ChatController.$inject = [
                    'AuthenticationService',
                    '$http',
                    '$scope'
                ];
                return ChatController;
            }());
            Chat.ChatController = ChatController;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
