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
                this.getAllQs();
            }
            QuestionService.prototype.getAllQs = function () {
                var _this = this;
                if (this.questions.length == 0) {
                    this._question_resource.get().then(function (data) {
                        console.log(data);
                        return _this.questions = data;
                    });
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
        angular.module('app').service('questionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
