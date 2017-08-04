var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var ChatService = (function () {
            function ChatService($http) {
                this.$http = $http;
            }
            // Connect to the broadcaster on the server
            ChatService.prototype.connect = function () {
                this.connection = ($.connection);
                console.log(this.connection);
                // This console.logs a lot of helpful debugging info!
                this.connection.hub.logging = true;
            };
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
            ChatService.$inject = [
                '$http'
            ];
            return ChatService;
        }());
        Services.ChatService = ChatService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
