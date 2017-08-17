namespace Quizdom.Views.Play {
  export class PlayController {
    public question: Models.GameBoardModel = new Models.GameBoardModel;
    private guess: number = 4;
    public posts = [];
    private group = '';

    static $inject = [
      'AuthenticationService',
      'GameService',
      'HubService',
      '$http',
      '$q',
      '$scope',
      '$stateParams',
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService,
      private HubService: Services.HubService,
      private $http: ng.IHttpService,
      private $q: ng.IQProvider,
      private $scope: ng.IScope,
      private $stateParams: ng.ui.IStateParamsService,
    ) {
      console.log(`this.$stateParams`, this.$stateParams);
      this.GameService.loadGame(this.$stateParams.gameId)
        .then(() => {
          this.group = 'game' + this.$stateParams.gameId;
          this.HubService.startHub();

          // A function we will call from the server
          this.HubService.connection.broadcaster.client.addGameMessage = $scope.addPost;

          // this.HubService.addConnect($scope.group);
          this.HubService.startGroup(this.group)

          this.getGameMessages();
        })


      // confirming how to relocate onto $scope if necessary for SignalR async
      $scope.loadQandA = (gameBoard) => {
        console.log(`loadQandA given gameBoard`, gameBoard);
        // find the local gameBoard by id
        this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
        console.log(`this.question`, this.question);
        // update to the proper state
        this.question.questionState = "ask";
        console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
      }

      $scope.addPost = (post) => {
        console.log('New post from server: ', post);
        this.posts.push(post);
        $scope.$applyAsync();

        console.log(`$scope.vm.posts`, $scope.vm.posts);
      }

    }

    // public getPosts() {
    //   this.$http<any[]>({ method: 'GET', url: '/api/game/gamechat' })
    //     .then((response) => {
    //       this.addPostsList(response.data)
    //     });
    // }

    public getGameMessages() {
      this.GameService.getAllGameMsgs().$promise
        .then((messages) => {
          // console.log(`messages`, messages);
          this.addPostsList(messages)
        });
    }

    public addPostsList(posts: Models.IMessage[] ) {
      this.posts.length = 0;
      posts.forEach(post => {
        this.posts.push(post);
      });
      this.posts.sort((a, b) => { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1 })
      console.log(this.posts);

    }

    public sendMessage = () => {
      var post = {
        content: $("#textInput").val(),
        userName: this.AuthenticationService.User.userName,
        group: this.group,
        gameId: this.GameService.gameId
      };
      this.$http.post<any>('/api/game/gamechat', JSON.stringify(post))
        .then(function () {
          $("#textInput").val("");
        })
        .catch(function (e) {
          console.log(e);
        });

    }

    public sendGameMessage = () => {
      var post = {
        content: $("#textInput").val(),
        userName: this.AuthenticationService.User.userName,
        group: this.group,
        gameId: this.GameService.gameId
      };
      this.GameService.postGameMsg(post).$promise
        .then(function () {
          $("#textInput").val("");
        })
        .catch(function (e) {
          console.log(e);
        });

    }

    public answerClass(index: number): string {
      let classes = "blue lighten-2 black-text";
      if (index == this.guess) {
        classes = 'blue darken-2 white-text';
      }
      if (this.showCorrect) {
        if (index == this.guess) {
          classes = 'red lighten-2 grey-text text-darken-1';
        }
        if ('ABCD'[index] == this.question.correctAnswer) {
          classes = 'green darken-3 green-text text-lighten-3';
        }
      }
      return classes;
    }

    public gameBoardClass(gameBoard): string {
      let classes = "green darken-4 grey-text text-lighten-2";
      if (gameBoard.questionState == 'retired') {
        classes = 'blue darken-1 blue-text';
      }
      return classes;
    }

    // SignalR methods to update gameBoard state that can be triggered by the server
    public triggerStateChange(boardId, answer: number) {
      let gameBoard = this.GameService.gameBoards.find(gb => { return gb.id == boardId });
      if (gameBoard.questionState == "new") {
        // console.log(`gameBoard`, gameBoard);
        gameBoard.questionState = "ask";
        this.GameService.updateGameBoard(gameBoard)
          // TODO - remove .then once SignalR is triggering the method!
          .$promise.then((ask) => {
            this.loadQandA(ask);
          })
      } else {
        this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
        // console.log(`this.question`, this.question);
        switch (this.question.questionState) {
          case "ask":
            this.question.questionState = "answers";
            this.GameService.updateGameBoard(this.question)
              // TODO - remove .then once SignalR is triggering the method!
              .$promise.then((gameBoard) => {
                this.showAllAnswers(gameBoard);
              })
            break;
          case "answers":
            if (answer >= 0 && answer < 4) {
              this.question.questionState = "guess";
              this.question.answerOrder = answer;
              this.GameService.updateGameBoard(this.question)
                // TODO - remove .then once SignalR is triggering the method!
                .$promise.then((gameBoard) => {
                  this.SelectAnswer(gameBoard);
                })
            }
            break;
          case "guess":
            if (answer < 4) {
              this.question.questionState = "correct";
              this.GameService.updateGameBoard(this.question)
                // TODO - remove .then once SignalR is triggering the method!
                .$promise.then((gameBoard) => {
                  this.ShowCorrectAnswer(gameBoard);
                })
            }
            break;
          case "correct":
            // get
            let player = this.GameService.gamePlayers.find(p => { return p.userName == this.AuthenticationService.User.userName });
            // console.log(`player from gamePlayers`, player);
            let gamePlayer = new Models.UserModel;
            gamePlayer.id = player.playerId;
            gamePlayer.prizePoints = player.prizePoints;
            gamePlayer.initiator = player.initiator;
            gamePlayer.gameId = this.GameService.gameId;
            gamePlayer.userId = this.AuthenticationService.User.userName;
            console.log(`Gameplayer`, gamePlayer);
            console.log(`Question prizePoints`, this.question.prizePoints);
            console.log(`answer`, answer, `answer`, this.question.correctAnswer);
            if ('ABCD'[answer] == this.question.correctAnswer) {
              gamePlayer.prizePoints += this.question.prizePoints;
              this.question.answeredCorrectlyUserId = this.AuthenticationService.User.userName;
            }
            console.log(`Gameplayer prizePoints`, gamePlayer.prizePoints);
            // Do we want to penalize a player for guessing wrong by subtracting prizePoints?
            this.GameService.updateGamePlayer(gamePlayer)
              // TODO - remove .then once SignalR is triggering the method!
              .$promise.then((gamePlayer) => {
                this.AddPrizePoints(gamePlayer);
              })
            this.question.questionState = "retired";
            this.GameService.updateGameBoard(this.question)
              // TODO - remove .then once SignalR is triggering the method!
              .$promise.then((gameBoard) => {
                this.RetireGameBoard(gameBoard);
              })
            break;
        }
      }
    }

    public get showQ() {
      return (this.question.questionState != 'new' && this.question.questionState != 'retired')
    }

    public get showA() {
      return (this.question.questionState != 'ask')
    }
    public get showGuess() {
      return (this.question.questionState == 'guess' || this.question.questionState == 'correct')
    }

    private get showCorrect() {
      return (this.question.questionState == 'correct')
    }

    public loadQandA(gameBoard) {
      console.log(`loadQandA given gameBoard`, gameBoard);
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      console.log(`this.question`, this.question);
      // update to the proper state
      this.question.questionState = "ask";
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
    }

    public showAllAnswers(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "answers";
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
    }

    public SelectAnswer(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "guess";
      this.question.answerOrder = gameBoard.answerOrder;
      this.guess = gameBoard.answerOrder;
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`, "ABCD"[this.question.answerOrder]);
    }

    public ShowCorrectAnswer(gameBoard) {
      // find the local gameBoard by id
      this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
      // update to the proper state
      this.question.questionState = "correct";
      if ("ABCD"[this.guess] == this.question.correctAnswer) {
        this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
      };
      console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.correctAnswer} is ${this.question.questionState}`);
    }

    public AddPrizePoints(gamePlayer) {
      // find the local gamePlayer by id
      let player = this.GameService.gamePlayers.find(p => { return p.playerId == gamePlayer.id });
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
    }


  }
}