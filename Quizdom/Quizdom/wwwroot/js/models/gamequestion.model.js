var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GameQuestionModel = (function () {
            function GameQuestionModel() {
                this.questionId = 0;
                this.questionText = "";
                this.answers = [];
                this.questionState = "fresh";
                this.answeredCorrectlyUserId = "";
                this.categoryId = 0;
                this.boardColumn = 0;
                this.boardRow = 0;
                this.boardId = 0;
                this.prize = 0;
                this.difficulty = "";
            }
            return GameQuestionModel;
        }());
        Models.GameQuestionModel = GameQuestionModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
