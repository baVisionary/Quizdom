var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var FriendModel = (function () {
            function FriendModel() {
                this.id = 0;
                this.primaryUserName = "";
                this.friendUserName = "";
            }
            return FriendModel;
        }());
        Models.FriendModel = FriendModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
