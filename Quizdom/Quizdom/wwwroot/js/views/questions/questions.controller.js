var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Questions;
        (function (Questions) {
            var QuestionsController = (function () {
                function QuestionsController(QuestionService, AuthenticationService, $state, $q) {
                    this.QuestionService = QuestionService;
                    this.AuthenticationService = AuthenticationService;
                    this.$state = $state;
                    this.$q = $q;
                    this.title = "Quiz Questions";
                    this.QuestionService.getAllQs();
                    this.QuestionService.getAllCats();
                    this.QuestionService.getAllCatIds();
                    this.preDelete = false;
                    this.deleteText = "Delete";
                }
                QuestionsController.prototype.onViewQuestion = function () {
                    this.preDelete = false;
                    this.deleteText = 'Delete';
                    this.$state.go('Questions');
                };
                QuestionsController.prototype.addQuestion = function () {
                    var i = Math.max.apply(Math, this.QuestionService.questions.map(function (o) { return o.id; })) + 1;
                    this.questionToEdit = this.QuestionService.newQuestion();
                    this.questionToEdit.id = i;
                    this.questionToEdit.UserId = this.AuthenticationService.User.userName;
                    console.log(this.questionToEdit);
                    this.$state.go('Questions.new');
                };
                QuestionsController.prototype.onEditQuestion = function (q) {
                    this.questionToEdit = angular.copy(q);
                    this.preDelete = false;
                    console.log(this.questionToEdit);
                    this.$state.go('Questions.edit', { id: this.questionToEdit.id });
                };
                QuestionsController.prototype.saveQuestion = function () {
                    var _this = this;
                    console.log("QuestionToEdit", this.questionToEdit);
                    this.questionToEdit.dateModified = new Date();
                    this.questionToEdit.categoryId = this.QuestionService.allCategories.find(function (cat) { return _this.questionToEdit.category == cat.longDescription; }).id;
                    this.QuestionService.updateOne(this.questionToEdit)
                        .then(function () {
                        var i = _this.QuestionService.questions.findIndex(function (q) { return q.id == _this.questionToEdit.id; });
                        _this.QuestionService.questions[i] = angular.copy(_this.questionToEdit);
                        _this.$state.go('Questions');
                    });
                };
                QuestionsController.prototype.deleteQuestion = function (questionId) {
                    var _this = this;
                    if (this.preDelete) {
                        return this.QuestionService.deleteOne(questionId).then(function () {
                            var i = _this.QuestionService.questions.findIndex(function (q) { return q.id == questionId; });
                            console.log("questionId: " + questionId + " i: " + i);
                            _this.QuestionService.questions.splice(i, 1);
                            _this.preDelete = false;
                            _this.$state.go('Questions');
                        });
                    }
                    else {
                        this.preDelete = true;
                        this.deleteText = 'Really Delete';
                    }
                };
                QuestionsController.prototype.doNotDelete = function () {
                    this.preDelete = false;
                    this.deleteText = "Delete";
                };
                QuestionsController.prototype.saveNewQuestion = function () {
                    var _this = this;
                    this.questionToEdit.dateModified = new Date();
                    this.questionToEdit.categoryId = this.QuestionService.allCategories.find(function (cat) { return _this.questionToEdit.category == cat.longDescription; }).id;
                    this.QuestionService.createOne(this.questionToEdit).$promise
                        .then(function (newQuestion) {
                        _this.QuestionService.questions.push(_this.QuestionService.getOneQuestionId(_this.questionToEdit.id));
                        _this.category = _this.questionToEdit.category;
                        _this.$state.go('Questions');
                    });
                };
                QuestionsController.$inject = [
                    'QuestionService',
                    'AuthenticationService',
                    '$state',
                    '$q'
                ];
                return QuestionsController;
            }());
            Questions.QuestionsController = QuestionsController;
        })(Questions = Views.Questions || (Views.Questions = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
