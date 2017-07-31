var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Welcome;
        (function (Welcome) {
            var WelcomeController = (function () {
                function WelcomeController(AvatarService, QuestionService, FriendService) {
                    this.AvatarService = AvatarService;
                    this.QuestionService = QuestionService;
                    this.FriendService = FriendService;
                    this.title = "Welcome to Quizdom";
                    this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers.";
                    this.AvatarService.getAllAvatars();
                    this.QuestionService.getAllQs();
                    this.QuestionService.getAllCats();
                }
                WelcomeController.$inject = [
                    'AvatarService',
                    'QuestionService',
                    'FriendService'
                ];
                return WelcomeController;
            }());
            Welcome.WelcomeController = WelcomeController;
        })(Welcome = Views.Welcome || (Views.Welcome = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
