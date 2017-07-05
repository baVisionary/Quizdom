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
        angular.module('app').controller('WelcomeController', WelcomeController);
        var QuestionController = (function () {
            function QuestionController(QuestionService) {
                this.QuestionService = QuestionService;
                this.title = "Question form";
                this.questions = this.QuestionService.getAllQs();
                // $(document).ready(function () {
                //   $('.collapsible').collapsible();
                // });
            }
            return QuestionController;
        }());
        QuestionController.$inject = ['QuestionService'];
        Controllers.QuestionController = QuestionController;
        angular.module('app').controller('QuestionController', QuestionController);
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
