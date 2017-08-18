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
                this.questions = [];
                this.categories = [];
                this.allCategories = [];
                this.difficulty = [
                    "easy",
                    "medium",
                    "hard"
                ];
                this._Question = new Quizdom.Models.QuestionModel();
                this._Resource_question = this.$resource('/api/quiz/:questionId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                this._Resource_categories = this.$resource('/api/quiz/categories');
                this._Resource_game_categories = this.$resource('/api/game/categories');
                this._Resource_Qs_by_category = this.$resource('api/quiz/category/:category', null, {
                    'diff': {
                        method: 'GET',
                        isArray: true,
                        url: 'api/quiz/category/:category/difficulty/:difficulty',
                    }
                });
                // this.getAllQs();
                // this.getAllCats();
            }
            QuestionService.prototype.getAllQs = function () {
                var _this = this;
                if (this.questions.length == 0) {
                    this.questions = this._Resource_question.query();
                    return this.questions.$promise;
                }
                else {
                    var questions = new Promise(function (res) {
                        res(_this.questions);
                    });
                    return questions;
                }
            };
            QuestionService.prototype.getAllCats = function () {
                var _this = this;
                if (this.categories.length == 0) {
                    this.categories = this._Resource_categories.query();
                    return this.categories.$promise;
                }
                else {
                    var categories = new Promise(function (res) {
                        res(_this.categories);
                        console.log("Categories", _this.categories);
                    });
                    return categories;
                }
            };
            QuestionService.prototype.getAllCatIds = function () {
                var _this = this;
                if (this.allCategories.length == 0) {
                    this.allCategories = this._Resource_game_categories.query();
                    return this.allCategories.$promise;
                }
                else {
                    var categoryIds = new Promise(function (res) {
                        res(_this.allCategories);
                        console.log("Categories", _this.allCategories);
                    });
                    return categoryIds;
                }
            };
            QuestionService.prototype.getQsByCategory = function (cat) {
                return this._Resource_Qs_by_category.query({ category: cat });
            };
            QuestionService.prototype.getQsByCatAndDiff = function (cat, diff) {
                return this._Resource_Qs_by_category.diff({ category: cat, difficulty: diff });
            };
            QuestionService.prototype.sortCategories = function (a, b) {
                return (a == "User Added") ? 1 : 0;
            };
            QuestionService.prototype.getOneQuestionId = function (questionId) {
                return this._Resource_question.get({
                    questionId: questionId
                });
            };
            QuestionService.prototype.updateOne = function (question) {
                return this._Resource_question.update({
                    questionId: question.id
                }, question).$promise;
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
