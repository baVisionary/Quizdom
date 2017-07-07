// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var app;
(function (app) {
    var Services;
    (function (Services) {
        var QuestionService = (function () {
            function QuestionService($resource) {
                this.$resource = $resource;
                this._Resource_question = this.$resource('/api/quiz/:questionId', null, { 'update': { method: 'PUT' } });
                this.questions = [];
                this._oneQuestion = {};
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
                    this.questions = this._Resource_question.query();
                    return this.questions;
                }
                else {
                    return this.questions;
                }
            };
            QuestionService.prototype.getOneQuestionId = function (questionId) {
                return this._Resource_question.get({ questionId: questionId });
            };
            QuestionService.prototype.updateOne = function (q) {
                return this._Resource_question.update({ questionId: q.id }, q).$promise;
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('QuestionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
