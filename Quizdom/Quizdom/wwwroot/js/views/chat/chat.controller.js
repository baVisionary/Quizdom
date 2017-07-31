var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Chat;
        (function (Chat) {
            var ChatController = (function () {
                function ChatController(AuthenticationService) {
                    this.AuthenticationService = AuthenticationService;
                    // Connect to the broadcaster on the server
                    var connection = ($.connection);
                    // A function we will call from the server
                    connection.broadcaster.client.addChatMessage = this.addPost;
                    // This console.logs a lot of helpful debugging info!
                    connection.hub.logging = true;
                    // Let's connect to the hub!
                    connection.hub.start().done(function (signalr) {
                        console.log('Connected!');
                        console.log('SignalR object: ', signalr);
                        // The subscribe method lets you subscribe to a specific method on the server
                        // You could use this method to subscribe to a specific chatroom,
                        // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
                        connection.broadcaster.server.subscribe("MainChatroom");
                    }).fail(function (error) {
                        // Just in case we fail to connect
                        console.log('Failed to start connection! Error: ', error);
                    });
                    this.getPosts();
                }
                ChatController.prototype.getPosts = function () {
                    $.ajax({
                        url: '/Chatroom',
                        method: 'GET',
                        dataType: 'JSON',
                        success: this.addPostsList
                    });
                };
                ChatController.prototype.addPostsList = function (posts) {
                    posts.forEach(function (post) {
                        $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
                    });
                };
                ChatController.prototype.addPost = function (post) {
                    console.log('New post from server: ', post);
                    $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
                };
                ChatController.prototype.sendMessage = function () {
                    var post = {
                        content: $("#textInput").val()
                    };
                    $.ajax({
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        type: 'POST',
                        url: '/chatroom/',
                        data: JSON.stringify(post),
                        dataType: 'json'
                    })
                        .always(function () {
                        $("#textInput").val("");
                    })
                        .fail(function (e) {
                        console.log(e);
                    });
                };
                ChatController.$inject = [
                    'AuthenticationService'
                ];
                return ChatController;
            }());
            Chat.ChatController = ChatController;
        })(Chat = Views.Chat || (Views.Chat = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
