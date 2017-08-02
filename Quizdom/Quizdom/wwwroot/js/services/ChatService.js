var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var ChatService = (function () {
            function ChatService($http) {
                this.$http = $http;
                this.posts = [];
                // Connect to the broadcaster on the server
                this.connection = ($.connection);
                // A function we will call from the server
                this.connection.broadcaster.client.addChatMessage = this.addPost;
                this.connection.broadcaster.client.posts = [];
                // This console.logs a lot of helpful debugging info!
                this.connection.hub.logging = true;
                // Let's connect to the hub!
                this.startConnection(this.connection, 'MainChatroom');
            }
            ChatService.prototype.startConnection = function (connection, group) {
                // Let's connect to the hub!
                connection.hub.start().done(function (signalr) {
                    console.log('Connected!');
                    console.log('SignalR object: ', signalr);
                    // The subscribe method lets you subscribe to a specific method on the server
                    // You could use this method to subscribe to a specific chatroom,
                    // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
                    connection.broadcaster.server.subscribe(group);
                }).fail(function (error) {
                    // Just in case we fail to connect
                    console.log('Failed to start connection! Error: ', error);
                });
            };
            ChatService.prototype.getPosts = function () {
                var _this = this;
                this.$http({ method: 'GET', url: '/Chatroom' }).then(function (response) { _this.addPostsList(response.data); });
            };
            ChatService.prototype.addPostsList = function (pastPosts) {
                var _this = this;
                pastPosts.forEach(function (post) {
                    _this.connection.broadcaster.client.posts.push(post);
                });
                this.posts = this.connection.broadcaster.client.posts;
                console.log(this.posts);
            };
            // the scope of this proxy Method is this.connection.broadcaster
            ChatService.prototype.addPost = function (post) {
                console.log('New post from server: ', post);
                console.log(this);
                this.client.posts.push(post);
            };
            ChatService.prototype.sendMessage = function (messageText) {
                var post = { content: messageText };
                return this.$http.post('/chatroom/', JSON.stringify(post));
            };
            ChatService.$inject = [
                '$http'
            ];
            return ChatService;
        }());
        Services.ChatService = ChatService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
