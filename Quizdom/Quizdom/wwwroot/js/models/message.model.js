var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var MessageModel = (function () {
            function MessageModel() {
                this.content = "";
                this.userName = "";
                this.group = "MainChatroom";
            }
            return MessageModel;
        }());
        Models.MessageModel = MessageModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
