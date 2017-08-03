var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        // This is the model for the JSON data that we send to the client
        // for each message. We are not sending back the actual "Message" object
        // to the client because we are not wanting to send back all of the data
        // about the ApplicationUser who authored the message. This allows us to
        // return only the UserName of the ApplicationUser who wrote the message.
        var MessageViewModel = (function () {
            function MessageViewModel() {
                this.content = "";
                this.author = "";
                this.timestamp = new Date();
            }
            return MessageViewModel;
        }());
        Models.MessageViewModel = MessageViewModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
