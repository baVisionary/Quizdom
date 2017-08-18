var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var ChatController = (function () {
                function ChatController(AuthenticationService, HubService, $http, $scope) {
                    // $scope.vm.posts = [];
                    // $scope.vm.group = 'MainChatroom';
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.HubService = HubService;
                    this.$http = $http;
                    this.$scope = $scope;
                    this.posts = [];
                    this.group = 'MainChatroom';
                    this.getPosts = function () {
                        _this.$http({ method: 'GET', url: '/Chatroom' })
                            .then(function (response) {
                            _this.addPostsList(response.data);
                        });
                    };
                    this.addPostsList = function (posts) {
                        _this.posts.length = 0;
                        posts.forEach(function (post) {
                            _this.posts.push(post);
                        });
                        _this.posts.sort(function (a, b) { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1; });
                        // console.log(`$scope`, $scope);
                        console.log(_this.posts);
                    };
                    this.sendMessage = function () {
                        var post = {
                            content: $("#textInput").val(),
                            userName: _this.AuthenticationService.User.userName,
                            group: _this.group
                        };
                        _this.$http.post('/chatroom/', JSON.stringify(post))
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    $scope.addPost = function (post) {
                        console.log('New post from server: ', post);
                        _this.posts.push(post);
                        $scope.$applyAsync();
                        console.log("$scope.vm.posts", $scope.vm.posts);
                        // console.log(`this`, this);        
                    };
                    this.HubService.startHub();
                    // A function we will call from the server
                    this.HubService.connection.broadcaster.client.addChatMessage = $scope.addPost;
                    // this.HubService.addConnect($scope.group);
                    this.HubService.startGroup(this.group);
                    this.getPosts();
                    // $scope.$on('$destroy', () => {
                    //   console.log(`Destroying controller`);
                    //   this.HubService.disconnect();
                    // })
                }
                // private connection;
                ChatController.$inject = [
                    'AuthenticationService',
                    'HubService',
                    '$http',
                    '$scope',
                ];
                return ChatController;
            }());
            Chat.ChatController = ChatController;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
