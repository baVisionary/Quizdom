// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var QuestionService = (function () {
            function QuestionService($resource, $q) {
                this.$resource = $resource;
                this.$q = $q;
                this._Resource_question = this.$resource('/api/quiz/:questionId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                this._Resource_categories = this.$resource('/api/quiz/categories');
                this.questions = [];
                this.categories = [];
                this.difficulty = [
                    "easy",
                    "medium",
                    "hard"
                ];
                this._Question = new Quizdom.Models.QuestionModel();
                // this.getAllQs();
                // this.getAllCats();
            }
            QuestionService.prototype.getAllQs = function () {
                if (this.questions.length == 0) {
                    this.questions = this._Resource_question.query();
                    return this.questions.$promise;
                }
                else {
                    var questions = this.$q.defer();
                    questions.resolve(this.questions);
                    return questions;
                }
            };
            QuestionService.prototype.getAllCats = function () {
                if (this.categories.length == 0) {
                    this.categories = this._Resource_categories.query();
                    return this.categories.$promise;
                }
                else {
                    var categories = this.$q.defer();
                    categories.resolve(this.categories);
                    console.log(categories);
                    return categories;
                }
            };
            QuestionService.prototype.sortCategories = function (a, b) {
                return (a == "User Added") ? 1 : 0;
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
            QuestionService.prototype.deleteOne = function (questionId) {
                return this._Resource_question.delete({
                    questionId: questionId
                }).$promise;
            };
            QuestionService.prototype.newQuestion = function () {
                return this._Question;
            };
            QuestionService.prototype.createOne = function (q) {
                return this._Resource_question.save(q);
            };
            QuestionService.$inject = [
                '$resource',
                '$q'
            ];
            return QuestionService;
        }());
        Services.QuestionService = QuestionService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
