var Question = (function () {
    function Question(Id) {
        this.Id = Id;
        this.Category = "";
        this.Difficulty = "";
        this.Question = "";
        this.Correct_Answer = "";
        this.Incorrect_Answer1 = "";
        this.Incorrect_Answer2 = "";
        this.Incorrect_Answer3 = "";
        this.Incorrect_Answer4 = "";
        this.Source = "";
        this.DateModified = new Date();
        this.UserId = 0;
    }
    return Question;
}());
