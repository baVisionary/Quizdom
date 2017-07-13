var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Welcome;
        (function (Welcome) {
            var WelcomeController = (function () {
                function WelcomeController() {
                    this.title = "Welcome to Quizdom";
                    this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers.";
                }
                return WelcomeController;
            }());
            Welcome.WelcomeController = WelcomeController;
        })(Welcome = Views.Welcome || (Views.Welcome = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
