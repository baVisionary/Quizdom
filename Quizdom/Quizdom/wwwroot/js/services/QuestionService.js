// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var app;
(function (app) {
    var Services;
    (function (Services) {
        var QuestionService = (function () {
            function QuestionService($resource) {
                this.$resource = $resource;
                this._question_resource = this.$resource('http://localhost:5000/api/quiz');
                this.questions = [];
                this._data = {};
                this.getAllQs();
            }
            QuestionService.prototype.getAllQs = function () {
                if (this.questions.length == 0) {
                    this.questions = this._question_resource.query();
                    console.log(this.questions);
                    return this.questions;
                }
                else {
                    return this.questions;
                }
            };
            QuestionService.prototype.getQsByCategory = function (categoryId) {
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('QuestionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
