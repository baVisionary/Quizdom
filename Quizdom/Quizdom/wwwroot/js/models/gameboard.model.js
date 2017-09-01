var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var GameBoardModel = (function () {
            function GameBoardModel() {
                this.id = 0;
                this.gameId = 0;
                this.categoryId = 0;
                this.difficulty = "";
                this.questionId = 0;
                this.boardColumn = 0;
                this.boardRow = 0;
                this.prizePoints = 0;
                this.questionText = "";
                this.answerA = "A";
                this.answerB = "B";
                this.answerC = "C";
                this.answerD = "D";
                //  values: 0-3
                this.correctAnswer = 0;
                // possible states: new/asking/retired
                this.questionState = "new";
                this.answeredCorrectlyUserId = "";
                this.answerOrder = 0;
            }
            return GameBoardModel;
        }());
        Models.GameBoardModel = GameBoardModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
