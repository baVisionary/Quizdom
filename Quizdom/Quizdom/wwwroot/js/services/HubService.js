// Create the connection to SignalR and store the variable for Chat & Game
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var HubService = (function () {
            function HubService($http) {
                var _this = this;
                this.$http = $http;
                this.startHub = function () {
                    // Connect to the broadcaster on the server
                    _this.connection = _this.connection || $.connection;
                    // This console.logs a lot of helpful debugging info!
                    _this.connection.hub.logging = false;
                };
                this.startGroup = function (group) {
                    var connection = _this.connection;
                    console.log("connection.hub.state:", connection.hub.state);
                    // Check if connection already active and kill it to maintain only 1 connection
                    if (connection.hub && connection.hub.state === $.signalR.connectionState.connected) {
                        connection.hub.stop();
                    }
                    // Let's connect to the hub!
                    connection.hub.start()
                        .done(function (signalr) {
                        console.log('Connected!');
                        console.log('SignalR object: ', signalr);
                        console.log("connection.hub.state:", connection.hub.state);
                        // The subscribe method lets you subscribe to a specific method on the server
                        // You could use this method to subscribe to a specific chatroom,
                        // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
                        connection.broadcaster.server.subscribe(group);
                    }).fail(function (error) {
                        // Just in case we fail to connect
                        console.log('Failed to start connection! Error: ', error);
                    });
                };
                this.disconnect = function () {
                    _this.connection.hub.stop();
                };
            }
            HubService.$inject = [
                '$http'
            ];
            return HubService;
        }());
        Services.HubService = HubService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
