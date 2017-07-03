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
            }
            QuestionService.prototype.getAllQs = function () {
                return this._question_resource.get();
            };
            return QuestionService;
        }());
        QuestionService.$inject = ['$resource'];
        Services.QuestionService = QuestionService;
        angular.module('app').service('questionService', QuestionService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
