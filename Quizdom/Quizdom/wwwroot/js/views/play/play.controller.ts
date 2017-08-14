namespace Quizdom.Views.Play {
  export class PlayController {
    public question: Models.GameBoardModel;
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
        .then(() => {
          this.GameService.setupGameBoard();
        })
    }

    public showThisQuestion(questionId) {
      this.question = this.GameService.gameBoards.find(q => { return q.questionId == questionId });
      this.question.questionState = "ask"
      this.showQ = true;
    }

    public chooseThisAnswer(questionId, answerIndex) {
    }

  }
}