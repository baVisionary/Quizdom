namespace Quizdom.Views.Play {
  export class PlayController {
    // public question: Models.GameBoardModel = new Models.GameBoardModel;
    private guess: number;

    static $inject = [
      'AuthenticationService',
      'GameService',
      'HubService',
      '$http',
      '$q',
      '$scope',
      '$stateParams',
      '$interval',
      '$timeout',
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private GameService: Services.GameService,
      private HubService: Services.HubService,
      private $http: ng.IHttpService,
      private $q: ng.IQProvider,
      private $scope: ng.IScope,
      private $stateParams: ng.ui.IStateParamsService,
      private $interval: ng.IIntervalService,
      private $timeout: ng.ITimeoutService,

    ) {
      // console.log(`this.$stateParams`, this.$stateParams);
      this.GameService.loadGame(this.$stateParams.gameId)
        .then(() => {
          this.GameService.createGroup('game' + this.$stateParams.gameId);
          this.HubService.startHub();

          // A function we will call from the server
          this.HubService.connection.broadcaster.client.addGameMessage = $scope.addGameMsg;
          this.HubService.connection.broadcaster.client.changeGameData = $scope.changeGameData;
          this.HubService.connection.broadcaster.client.changeGameBoardData = $scope.changeGameBoardData;
          this.HubService.connection.broadcaster.client.changeGamePlayerData = $scope.changeGamePlayerData;

          // this.HubService.addConnect($scope.group);
          this.HubService.startGroup(this.GameService.groupName)

          this.GameService.getGameMessages();
        })


      // confirming how to relocate onto $scope if necessary for SignalR async

      $scope.addGameMsg = (gameMsg) => {
        console.log('New post from server: ', gameMsg);
        this.GameService.gameChats.push(gameMsg);
        $scope.$applyAsync();

        console.log(`Game messages`, this.GameService.gameChats);
      }

      // newGameState is triggered by a change to the Games table
      $scope.changeGameData = (newGame) => {
        // update the values that can change over time
        this.GameService.gameData = newGame;
        console.log(`Game updated from DB`, this.GameService.gameData);

        // TODO Add other local variables that should be updated
        switch (this.GameService.gameData.gameState) {
          case "prepare":
            $scope.countdownTimer(3).catch(() => {
              this.triggerAnswer();
            })
            break;

          default:
            break;
        }
        $scope.$applyAsync();

      }

      // newGameBoardState is triggered by a change to the GameBoard table
      $scope.changeGameBoardData = (gameBoardData) => {

        // find the local gameBoard data in the array
        let gbIndex = this.GameService.gameBoards.findIndex(gb => { return gb.id == gameBoardData.id });

        // update the values that can change over time
        this.GameService.gameBoards[gbIndex].questionState = gameBoardData.questionState;
        this.GameService.gameBoards[gbIndex].answerOrder = gameBoardData.answerOrder;
        this.GameService.gameBoards[gbIndex].answeredCorrectlyUserId = gameBoardData.answeredCorrectlyUserId;
        console.log(`Game Board updated from DB`, this.GameService.gameBoards[gbIndex]);

        // TODO Add other local variables that should be updated
        // assign gameBoard question to local this.question when questionState = "ask"
        this.GameService.question = this.GameService.gameBoards[gbIndex];

        $scope.$applyAsync();

      }

      // newGamePlayerState is triggered by a change to the GamePlayer table
      $scope.changeGamePlayerData = (gamePlayerData) => {

        // find the local gamePlayer data in the array
        let pIndex = this.GameService.players.findIndex(p => { return p.playerId == gamePlayerData.id });

        // update the values that can change over time
        this.GameService.players[pIndex].prizePoints = gamePlayerData.prizePoints;
        this.GameService.players[pIndex].answer = gamePlayerData.answer;
        this.GameService.players[pIndex].delay = gamePlayerData.delay;
        console.log(`Game Player updated from DB`, this.GameService.players[pIndex]);

        // TODO Add other local variables that should be updated
        // Should we track when all players guess so we can cancel the countdown?
        $scope.$applyAsync();

      }

      $scope.timer = 0;

      $scope.countdownTimer = (duration: number) => {
        let decreaseTimer = () => {
          $scope.timer = duration
          console.log(`duration`, duration, `timer`, $scope.timer);
          duration--;
          if (duration <= 0) { $interval.cancel(countdown) };
        }

        let countdown = $interval(decreaseTimer, 1000);
        return countdown;
      }

      console.log(`$scope`, $scope);
    }

    // public getGameMessages() {
    //   this.GameService.getAllGameMsgs().$promise
    //     .then((messages) => {
    //       // console.log(`messages`, messages);
    //       this.addPostsList(messages)
    //     });
    // }

    // public addPostsList(posts: Models.IMessage[]) {
    //   this.gameChats.length = 0;
    //   posts.forEach(post => {
    //     this.gameChats.push(post);
    //   });
    //   this.gameChats.sort((a, b) => { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1 })
    //   // console.log(this.posts);
    // }

    // method to identify which sections to display based on gameState
    // result is boolean used as the value for ng-show
    public showMe(section): boolean {
      let show = false
      show = (this.GameService.gameState == section) ? true : false;
      return show;
    }

    // old method to color answers based on player selection
    public answerClass(index: number): string {
      let classes = "blue lighten-2 black-text";
      if (index == this.guess) {
        classes = 'blue darken-2 white-text';
      }
      // if (this.showCorrect) {
      //   if (index == this.guess) {
      //     classes = 'red lighten-2 grey-text text-darken-1';
      //   }
      //   if (index == this.question.correctAnswer) {
      //     classes = 'green darken-3 green-text text-lighten-3';
      //   }
      // }
      return classes;
    }

    // sets the style of gameBoards when used in ng-class
    public gameBoardClass(gameBoard): string {
      return (gameBoard.questionState == 'new')
        ? "green darken-4 grey-text text-lighten-2"
        : "blue darken-1 blue-text";
    }

    // 
    public get activeIsMe() {
      return this.GameService.gameData.activeUserId == this.AuthenticationService.User.userName;
    }

    /* "trigger" methods respond to user action on elements to update the DB via APIs */

    // send new gameMsg to GameMessage table
    // clean up UI
    public triggerGameMessage = () => {
      var gameMsg = {
        content: $("#textInput").val(),
        userName: this.AuthenticationService.User.userName,
        group: this.GameService.groupName,
        gameId: this.GameService.gameId
      };
      this.GameService.postGameMsg(gameMsg).$promise
        .then(function () {
          $("#textInput").val("");
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    // initial state of game shows How to play
    // randomly select the first active player
    public triggerWelcome() {
      // Games - update gameState to "welcome"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "welcome";
      this.GameService.updateGame(newGameData);
      // GameBoard - no change
      // GamePlayers - no change
    }

    // only the active player can click the rules (or a button) to start the game    
    public triggerPlay() {
      // Games - update gameState to "pick"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "pick";
      this.GameService.updateGame(newGameData)

      // GameBoard - no change
      // GamePlayers - no change
    }

    //  active player can click on "new" gameBoard element to pick question
    public triggerPrepare(boardId) {
      if (this.activeIsMe) {

        // GameBoard - if gameBoard is "new", questionState to "ask", add answerOrder
        let newGameBoardData = this.GameService.gameBoards.find(gb => { return gb.id == boardId });

        // this has to be checked before changing the other tables
        if (newGameBoardData.questionState == "new") {
          newGameBoardData.questionState = "ask";
          newGameBoardData.answerOrder = this.GameService.answerOrder;
          this.GameService.updateGameBoard(newGameBoardData)
          // TODO move this to GameService.newGameBoardData method
          // this.GameService.answerOrder++;

          // Games - update gameState to "prepare"
          let newGameData = this.GameService.gameData;
          newGameData.gameState = "prepare";
          this.GameService.updateGame(newGameData)

          // GamePlayers - update all answer to null and delay to null (always wrong)
          this.GameService.players.forEach(newPlayerData => {
            newPlayerData.answer = 0;
            newPlayerData.delay = 0;
            this.GameService.updateGamePlayer(newPlayerData)
          })
        } else {
          console.log(`Game Board retired`);
        }

      } else {
        console.log(`Only active player ${this.GameService.gameData.activeUserId} can pick`);
      }
    }

    // show Q&A to all players
    public triggerAnswer() {
      // Games - update gameState to "answer"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "answer";
      this.GameService.updateGame(newGameData);

      // GameBoard - update selected gameBoard to questionState "asked", add answerOrder

      // GamePlayers - update answer & delay value

    }

    // every player can click on "answer" element to guess - stored in this.guess
    // store timeStamp in endTime to calculate delay
    public triggerGuess(guess) {
      // Games - no change
      // GameBoard - no change
      // GamePlayers - update all answer to 4 (always wrong) and delay to max

    }


    // public ShowCorrectAnswer(gameBoard) {
    //   // find the local gameBoard by id
    //   this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
    //   // update to the proper state
    //   this.question.questionState = "correct";
    //   if (this.guess == this.question.correctAnswer) {
    //     this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
    //   };
    //   console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.correctAnswer} is ${this.question.questionState}`);
    // }

    // public AddPrizePoints(gamePlayer) {
    //   // find the local gamePlayer by id
    //   let player = this.GameService.players.find(p => { return p.playerId == gamePlayer.id });
    //   // update to the proper state
    //   player.prizePoints = gamePlayer.prizePoints;
    //   console.log(`GamePlayer: ${gamePlayer.id} new score is ${player.prizePoints}`);
    // }

    // public RetireGameBoard(gameBoard) {
    //   // find the local gameBoard by id
    //   this.question = this.GameService.gameBoards.find(q => { return q.id == gameBoard.id });
    //   // update to the proper state
    //   this.question.questionState = "retired";
    //   this.guess = 4;
    //   console.log(`GameBoard: ${gameBoard.id} questionState: ${this.question.questionState}`);
    // }


  }
}