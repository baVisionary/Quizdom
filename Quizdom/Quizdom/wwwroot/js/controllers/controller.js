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
            function QuestionController(QuestionService, $state) {
                this.QuestionService = QuestionService;
                this.$state = $state;
                this.title = "Quiz Questions";
                this.questions = this.QuestionService.getAllQs();
            }
            QuestionController.prototype.onHideQuestion = function () {
                this.$state.go('questions.view', { id: this.questionToEdit.id });
            };
            QuestionController.prototype.onViewQuestion = function (questionId) {
                this.$state.go('questions.view', { id: questionId });
            };
            QuestionController.prototype.addQuestion = function () {
                var i = Math.max.apply(Math, this.questions.map(function (o) { return o.id; }));
                console.log("max id: " + i);
                this.$state.go('questions.new', { id: i + 1 });
            };
            QuestionController.prototype.onEditQuestion = function (questionId) {
                this.$state.go('questions.edit', { id: questionId });
                this.questionToEdit = this.questions[this.questions.findIndex(function (q) { return q.id == questionId; })];
                this.categoryToEdit = this.questions.find(function (q) { return q.id == questionId; }).category;
                this.difficultyToEdit = this.questions.find(function (q) { return q.id == questionId; }).difficulty;
            };
            QuestionController.prototype.saveQuestion = function () {
                this.QuestionService.updateOne(this.questionToEdit);
                this.$state.go('questions.view', { id: this.questionToEdit.id });
            };
            QuestionController.prototype.deleteQuestion = function (questionId) {
                this.QuestionService.deleteOne(questionId);
            };
            return QuestionController;
        }());
        QuestionController.$inject = ['QuestionService', '$state', '$stateParams'];
        Controllers.QuestionController = QuestionController;
        angular.module('app').controller('QuestionController', QuestionController);
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
