namespace Quizdom.Views.Play {
  export class PlayController {
    public question: Models.GameBoardModel = new Models.GameBoardModel;
    private questionOrder: number = 0;
    private guess: number = 4;
    private showQ = false;
    private showA = false;
    private showGuess = false;
    private showCorrect = false;
    private guessCorrect: boolean = false;


    static $inject = [
      'AuthenticationService',
      'GameService',
      'HubService',
      '$q',
      '$scope'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService,
      private HubService: Services.HubService,
      private $q: ng.IQProvider,
      private $scope: ng.IScope
    ) {
      this.GameService.loadMyGameData(this.AuthenticationService.User)
        .then(() => {
          this.GameService.loadGame(this.GameService.gameId);
        })

      // confirming how to relocate onto $scope if necessary for SignalR async
      $scope.loadQandA = (boardId) => {
        // find the local gameBoard by id
        this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
        // update to the proper state
        this.question.questionState = "ask";
        console.log(`GameBoard: ${boardId} questionState: ${this.question.questionState}`);
        this.showQ = true;
        this.showA = this.showGuess = this.showCorrect = this.guessCorrect = false;
      }

    }

    // SignalR methods to update gameBoard state that can be triggered by the server
    public triggerStateChange(boardId, answer: number) {
      if (this.question.questionState == "new") {
        let gameBoard = this.GameService.gameBoards.find(gb => { return gb.id == boardId });
        gameBoard.questionState = "ask";
        this.GameService.updateGameBoard(gameBoard).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.loadQandA(boardId);
          })
      } else {
        this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
        switch (this.question.questionState) {
          case "ask":
            this.question.questionState = "answers";
            this.GameService.updateGameBoard(this.question).$promise
              // TODO - remove .then once SignalR is triggering the method!
              .then((gameBoard) => {
                this.showAllAnswers(gameBoard);
              })
            break;
          case "answers":
            this.question.questionState = "guess";
            this.question.answerOrder = answer;
            this.GameService.updateGameBoard(this.question).$promise
              // TODO - remove .then once SignalR is triggering the method!
              .then((gameBoard) => {
                this.SelectAnswer(gameBoard);
              })
            break;
          case "guess":
            if (answer < 4) {
              this.question.questionState = "correct";
              this.GameService.updateGameBoard(this.question).$promise
                // TODO - remove .then once SignalR is triggering the method!
                .then((gameBoard) => {
                  this.ShowCorrectAnswer(gameBoard);
                })
            }
            break;
          case "correct":
            this.question.questionState = "retired";
            this.GameService.updateGameBoard(this.question).$promise
              // TODO - remove .then once SignalR is triggering the method!
              .then((gameBoard) => {
                this.RetireGameBoard(gameBoard);
              })
            break;
        }
      } 
    }

    public triggerLoadQandA(boardId) {
      let gameBoard = this.GameService.gameBoards.find(gb => { return gb.id == boardId });
      if (gameBoard.questionState == "new") {
        gameBoard.questionState = "ask";
        this.GameService.updateGameBoard(gameBoard).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.loadQandA(boardId);
          })
      }
    }

    public triggerShowAllAnswers(boardId) {
      this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
      if (this.question.questionState == "ask") {
        this.question.questionState = "answers";
        this.GameService.updateGameBoard(this.question).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.showAllAnswers(gameBoard);
          })
      }
    }

    public triggerSelectAnswer(boardId, answer: number) {
      this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
      if (this.question.questionState == "answers") {
        this.question.questionState = "guess";
        this.question.answerOrder = answer;
        this.GameService.updateGameBoard(this.question).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.SelectAnswer(gameBoard);
          })
      }
    }

    public triggerShowCorrectAnswer(boardId) {
      this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
      if (this.question.questionState == "guess") {
        this.question.questionState = "correct";
        this.GameService.updateGameBoard(this.question).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.ShowCorrectAnswer(gameBoard);
          })
      }
    }

    public triggerAddPrizePoints(playerId) {
      let player = this.GameService.gamePlayers.find(p => { return p.id == playerId });
      if (this.guessCorrect) {
        player.prizePoints = player.prizePoints + this.question.prizePoints;
      }
      // Do we want to penalize a player for guessing wrong by subtracting prizePoints?
      this.GameService.updateGamePlayer(player).$promise
        // TODO - remove .then once SignalR is triggering the method!
        .then((gamePlayer) => {
          this.AddPrizePoints(gamePlayer);
        })
    }

    public triggerRetireGameBoard(boardId) {
      this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
      if (this.question.questionState == "correct") {
        this.question.questionState = "retired";
        this.GameService.updateGameBoard(this.question).$promise
          // TODO - remove .then once SignalR is triggering the method!
          .then((gameBoard) => {
            this.RetireGameBoard(gameBoard);
          })
      }
    }

    public loadQandA(boardId) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
      // update to the proper state
      this.question.questionState = "ask";
      console.log(`GameBoard: ${boardId} questionState: ${this.question.questionState}`);
      this.showQ = true;
      this.showA = this.showGuess = this.showCorrect = this.guessCorrect = false;
    }

    public showAllAnswers(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "answers";
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
      this.showQ = this.showA = true;
      this.showGuess = this.showCorrect = this.guessCorrect = false;
    }

    public SelectAnswer(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "guess";
      this.question.answerOrder = gameBoard.answerOrder;
      this.guess = gameBoard.answerOrder;
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`, "ABCD"[this.question.answerOrder]);
      this.showQ = this.showA = this.showGuess = true;
      this.showCorrect = this.guessCorrect = false;
    }

    public ShowCorrectAnswer(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "correct";
      if ("ABCD"[this.guess] == this.question.correctAnswer) {
        this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
        this.guessCorrect = true;
      };
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.correctAnswer} is ${this.question.questionState}`);
      this.showQ = this.showA = this.showGuess = this.showCorrect = true;
    }

    public AddPrizePoints(gamePlayer) {
      // find the local gamePlayer by id
      let player = this.GameService.gamePlayers.find(p => { return p.id == gamePlayer.id });
      // update to the proper state
      player.prizePoints = gamePlayer.prizePoints;
      console.log(`GamePlayer: ${gamePlayer.id} new score is ${player.prizePoints}`);
    }

    public RetireGameBoard(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "retired";
      this.guess = 4;
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
      this.showQ = this.showA = this.showGuess = this.showCorrect = this.guessCorrect = false;
    }


  }
}