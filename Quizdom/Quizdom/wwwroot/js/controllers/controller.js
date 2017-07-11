// import * as angular from '../../lib/angular/angular.min'
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
            QuestionController.prototype.onViewQuestion = function (questionId, event) {
                // let i = this.questions.findIndex( q => {return q.id == questionId} );
                // console.log(event);
                this.$state.go('questions.view', { id: questionId });
            };
            QuestionController.prototype.onHideQuestion = function () {
            };
            QuestionController.prototype.onEditQuestion = function (questionId) {
                this.$state.go('questions.edit', { id: questionId });
                this.questionToEdit = this.questions[this.questions.findIndex(function (q) { return q.id == questionId; })];
                this.categoryToEdit = this.questions.find(function (q) { return q.id == questionId; }).category;
                this.difficultyToEdit = this.questions.find(function (q) { return q.id == questionId; }).difficulty;
            };
            QuestionController.prototype.addQuestion = function () {
                var i = Math.max.apply(Math, this.questions.map(function (o) { return o.id; })) + 1;
                // i = Math.max( 5000, i+1 );
                // console.log(`max id: ${i}`);
                this.questionToEdit = this.QuestionService.newQuestion();
                this.questionToEdit.id = i;
                this.questionToEdit.UserId = "Quizdom User";
                console.log(this.questionToEdit);
                this.$state.go('questions.new');
            };
            QuestionController.prototype.saveNewQuestion = function () {
                var _this = this;
                this.QuestionService.createOne(this.questionToEdit).$promise.then(function () {
                    _this.questions.push(_this.QuestionService.getOneQuestionId(_this.questionToEdit.id));
                });
                this.$state.go('questions');
            };
            QuestionController.prototype.saveQuestion = function () {
                console.log(this.questionToEdit);
                this.QuestionService.updateOne(this.questionToEdit);
                this.$state.go('questions.view', { id: this.questionToEdit.id });
            };
            QuestionController.prototype.deleteQuestion = function (questionId) {
                var _this = this;
                var i = this.questions.findIndex(function (q) { return q.id == questionId; });
                console.log("questionId: " + questionId + " i: " + i);
                this.questions.splice(i, 1);
                // $('.collapsible').collapsible('close', i % 10);
                return this.QuestionService.deleteOne(questionId).then(function () {
                    _this.$state.go('questions');
                });
            };
            return QuestionController;
        }());
        QuestionController.$inject = ['QuestionService', '$state', '$stateParams'];
        Controllers.QuestionController = QuestionController;
        angular.module('app').controller('QuestionController', QuestionController);
        var QuestionViewController = (function () {
            function QuestionViewController() {
            }
            return QuestionViewController;
        }());
        QuestionViewController.$inject = ['QuestionService', '$state', '$stateParams'];
        Controllers.QuestionViewController = QuestionViewController;
        angular.module('app').controller('QuestionViewController', QuestionViewController);
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
