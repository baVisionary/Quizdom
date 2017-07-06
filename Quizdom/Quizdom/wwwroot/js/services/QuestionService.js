// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var app;
(function (app) {
    var Services;
    (function (Services) {
        var QuestionService = (function () {
            function QuestionService($resource) {
                this.$resource = $resource;
                this._question_resource = this.$resource('/api/quiz/:questionId');
                this.questions = [];
                this.categories = [
                    "Animals",
                    "Art",
                    "Celebrities",
                    "General Knowledge",
                    "Geography",
                    "History",
                    "Science & Nature",
                    "Sports",
                    "Vehicles",
                    "User Added"
                ];
                this.difficulty = [
                    "easy",
                    "medium",
                    "hard"
                ];
                this.getAllQs();
            }
            QuestionService.prototype.getAllQs = function () {
                if (this.questions.length == 0) {
                    this.questions = this._question_resource.query();
                    return this.questions;
                }
                else {
                    return this.questions;
                }
            };
            QuestionService.prototype.getOneQuestionId = function (questionId) {
                this._new_question = this._question_resource.get({ questionId: questionId });
                return this._new_question;
            };
            QuestionService.prototype.updateOneQuestion = function (question) {
                this._new_question = this.$resource('/api/quiz/:questionId', { questionId: question.id }, question);
                this._new_question.$save();
                return this._new_question;
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('QuestionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
