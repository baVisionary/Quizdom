namespace Quizdom.Views.Play {
  export class PlayController {
    public question: Models.GameQuestionModel;
    public showQ = false;


    static $inject = [
      'AuthenticationService',
      'GameService'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService
    ) {
      this.GameService.loadGame(this.AuthenticationService.User)
    }

    public showThisQuestion(questionId) {
      this.question = this.GameService.gameQuestions.find(q => { return q.questionId == questionId });
      this.question.questionState = "revealed"
      this.showQ = true;
    }

    public chooseThisAnswer(questionId, answerIndex) {
    }

  }
}