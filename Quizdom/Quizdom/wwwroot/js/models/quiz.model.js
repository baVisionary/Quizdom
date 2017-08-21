var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var QuizModel = (function () {
            function QuizModel() {
                this.id = 0;
                this.category = 'User Added';
                this.type = 'multiple';
                this.difficulty = '';
                this.question = '';
                this.correct_Answer = '';
                this.incorrect_Answer1 = '';
                this.incorrect_Answer2 = '';
                this.incorrect_Answer3 = '';
                this.incorrect_Answer4 = '';
                this.source = '';
                this.dateModified = new Date();
                this.userId = '';
                this.avatarId = 0;
                this.categoryId = 0;
            }
            return QuizModel;
        }());
        Models.QuizModel = QuizModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
