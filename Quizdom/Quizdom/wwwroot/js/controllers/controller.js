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
                this.editQuestion = function (questionId) {
                    var i = this.questions.findIndex(function (q) { return q.id == questionId; });
                    if (i == undefined) {
                        this.questionToEdit = this.QuestionService.getOneQuestion(questionId);
                    }
                    else {
                        this.questionToEdit = this.questions[i];
                    }
                    this.categoryToEdit = this.questionToEdit.category;
                    this.difficultyToEdit = this.questionToEdit.difficulty;
                    console.log(this.questionToEdit);
                };
                this.saveQuestion = function () {
                    var _this = this;
                    console.log(this.questionToEdit);
                    this.QuestionService.updateOne(this.questionToEdit);
                    var i = this.questions.findIndex(function (q) { return q.id = _this.questionToEdit.id; });
                    // .then((data) => {
                    //   this.questions.length = 0;
                    //   this.QuestionService.getAllQs().$promise.then((data) => {
                    //     for (let i = 0; i < data.length; i++ ) {
                    //       this.questions.push(data[i]);
                    //     }
                    //   });
                    // });
                };
                this.title = "Quiz Questions";
                this.questions = this.QuestionService.getAllQs();
            }
            return QuestionController;
        }());
        QuestionController.$inject = ['QuestionService'];
        Controllers.QuestionController = QuestionController;
        angular.module('app').controller('QuestionController', QuestionController);
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
