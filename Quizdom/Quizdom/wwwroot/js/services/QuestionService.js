// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var app;
(function (app) {
    var Services;
    (function (Services) {
        var Question = (function () {
            function Question() {
                this.id = 0;
                this.category = "User Added";
                this.type = "multiple";
                this.difficulty = "";
                this.question = "";
                this.correct_Answer = "";
                this.incorrect_Answer1 = "";
                this.incorrect_Answer2 = "";
                this.incorrect_Answer3 = "";
                this.incorrect_Answer4 = "";
                this.source = "";
                this.dateModified = new Date();
                this.userId = 0;
                this.avatarId = 0;
                this.categoryId = 0;
            }
            return Question;
        }());
        var QuestionService = (function () {
            function QuestionService($resource) {
                this.$resource = $resource;
                this._Resource_question = this.$resource('/api/quiz/:questionId', null, {
                    'update': {
                        method: 'PUT'
                    },
                    'delete': {
                        method: 'DELETE'
                        // , transformRequest: []
                        ,
                        data: { 'Content-Type': 'application/json' }
                    }
                });
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
                return this._Resource_question.get({
                    questionId: questionId
                });
            };
            QuestionService.prototype.updateOne = function (q) {
                return this._Resource_question.update({
                    questionId: q.id
                }, q).$promise;
            };
            QuestionService.prototype.deleteOne = function (q) {
                return this._Resource_question.delete({
                    questionId: q.id
                }, q).$promise;
            };
            QuestionService.prototype.newQuestion = function () {
                return new Question();
            };
            QuestionService.prototype.createOne = function (q) {
                return this._Resource_question.save(q);
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('QuestionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
