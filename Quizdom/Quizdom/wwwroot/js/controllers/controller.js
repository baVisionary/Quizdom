var app;
(function (app) {
    var Controllers;
    (function (Controllers) {
        var WelcomeController = (function () {
            function WelcomeController() {
                this.title = "Welcome to Quizdom";
                this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers.";
            }
            return WelcomeController;
        }());
        Controllers.WelcomeController = WelcomeController;
        var QuestionController = (function () {
            function QuestionController(questionService) {
                this.questionService = questionService;
                this.title = "Question form";
                this.questions = this.questionService.getAllQs();
            }
            return QuestionController;
        }());
        QuestionController.$inject = ['questionService'];
        Controllers.QuestionController = QuestionController;
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
