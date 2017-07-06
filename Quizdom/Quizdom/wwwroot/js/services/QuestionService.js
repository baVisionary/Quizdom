// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var app;
(function (app) {
    var Services;
    (function (Services) {
        var QuestionService = (function () {
            function QuestionService($resource) {
                this.$resource = $resource;
                this._question_resource = this.$resource('/api/quiz');
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
                this._category = 0;
                this._new_question = {};
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
            QuestionService.prototype.getQsByCategory = function (categoryId) {
                if (this._category != categoryId) {
                    this._category = categoryId;
                    this._question_resource += "/category/" + categoryId;
                    this.questions = this._question_resource.query();
                    return this.questions;
                }
                else {
                    return this.questions;
                }
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('QuestionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
