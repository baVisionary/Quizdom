var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Questions;
        (function (Questions) {
            var QuestionsController = (function () {
                function QuestionsController(QuestionService, $state) {
                    this.QuestionService = QuestionService;
                    this.$state = $state;
                    this.title = "Quiz Questions";
                    this.questions = this.QuestionService.getAllQs();
                    this.preDelete = false;
                    this.deleteText = "Delete";
                }
                QuestionsController.prototype.onViewQuestion = function () {
                    this.preDelete = false;
                    this.deleteText = 'Delete';
                    this.$state.go('questions');
                };
                QuestionsController.prototype.addQuestion = function () {
                    var i = Math.max.apply(Math, this.questions.map(function (o) { return o.id; })) + 1;
                    this.questionToEdit = this.QuestionService.newQuestion();
                    this.questionToEdit.id = i;
                    this.questionToEdit.UserId = "Quizdom User";
                    console.log(this.questionToEdit);
                    this.$state.go('questions.new');
                };
                QuestionsController.prototype.onEditQuestion = function (q) {
                    this.questionToEdit = angular.copy(q);
                    this.preDelete = false;
                    console.log(this.questionToEdit);
                    this.$state.go('questions.edit', { id: this.questionToEdit.id });
                };
                QuestionsController.prototype.saveQuestion = function () {
                    var _this = this;
                    console.log(this.questionToEdit);
                    this.questionToEdit.dateModified = new Date();
                    this.QuestionService.updateOne(this.questionToEdit).then(function () {
                        var i = _this.questions.findIndex(function (q) { return q.id == _this.questionToEdit.id; });
                        _this.questions[i] = angular.copy(_this.questionToEdit);
                        _this.$state.go('questions');
                    });
                };
                QuestionsController.prototype.deleteQuestion = function (questionId) {
                    var _this = this;
                    if (this.preDelete) {
                        return this.QuestionService.deleteOne(questionId).then(function () {
                            var i = _this.questions.findIndex(function (q) { return q.id == questionId; });
                            console.log("questionId: " + questionId + " i: " + i);
                            _this.questions.splice(i, 1);
                            _this.preDelete = false;
                            _this.$state.go('questions');
                        });
                    }
                    else {
                        this.preDelete = true;
                        this.deleteText = 'Really Delete';
                    }
                };
                QuestionsController.prototype.saveNewQuestion = function () {
                    var _this = this;
                    this.QuestionService.createOne(this.questionToEdit).$promise.then(function () {
                        _this.questions.push(_this.QuestionService.getOneQuestionId(_this.questionToEdit.id));
                        _this.search = _this.questionToEdit.id;
                        _this.$state.go('questions');
                    });
                };
                return QuestionsController;
            }());
            QuestionsController.$inject = [
                'QuestionService',
                '$state',
                '$stateParams'
            ];
            Questions.QuestionsController = QuestionsController;
        })(Questions = Views.Questions || (Views.Questions = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));