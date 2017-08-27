namespace Quizdom.Views.Play {
  export class PlayController {
    // public question: Models.GameBoardModel = new Models.GameBoardModel;
    private guessValue = ['A','B','C','D','None'];

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
          $scope.changeGameData(this.GameService.gameData);
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
        this.GameService.gameData.activeUserId = newGame.activeUserId;
        this.GameService.gameData.lastActiveUserId = newGame.lastActiveUserId;
        this.GameService.gameData.gameBoardId = newGame.gameBoardId;
        this.GameService.gameData.gameState = newGame.gameState;
        console.log(`Game updated from DB`, this.GameService.gameData);

        // TODO Add other local variables that should be updated
        switch (this.GameService.gameData.gameState) {
          case "prepare":
            this.GameService.guess = 4;
            $scope.countdownTimer(3, 1000).catch(() => {
              this.triggerAnswer(newGame.boardId);
            })
            break;
          case "answer":
            this.GameService.startTime = Date.now();
            $scope.countdownTimer(this.GameService.duration, 10)
              // required since $interval sends error upon cancel
              .catch(() => {
                
              })
              .finally(() => {
                console.log(`Guess: ${this.GameService.guess} Delay: ${this.GameService.endTime - this.GameService.startTime}`) ; 
                console.log(`Time ran out`);
                this.triggerGuess(4);
              })
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

        // 
        this.GameService.answerOrder = gameBoardData.answerOrder + 1;

        // assign gameBoard question to local this.question when questionState = "ask"
        console.log(`questionState includes ask/answer/results`,
          ["ask", "answer", "results"].indexOf(this.GameService.gameBoards[gbIndex].questionState));
        if (["ask", "answer", "result"].indexOf(this.GameService.gameBoards[gbIndex].questionState) > -1) {
          this.GameService.question = this.GameService.gameBoards[gbIndex];
        }

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

      $scope.stopTimer = (name) => {
        $interval.cancel(name)
      }

      $scope.countdownTimer = (duration: number, tick: number) => {
        // duration in seconds (* 1000 = millisecs), decrement in milliseconds
        $scope.timer = duration
        let numDigits = Math.max(4 - tick.toString().length, 0);
        let decreaseTimer = () => {
          if ($scope.timer == Math.floor($scope.timer)) {
            console.log(`timer`, $scope.timer);
          }
          $scope.timer = ($scope.timer - (tick / 1000)).toFixed(numDigits);
          if ($scope.timer <= 0) { $scope.stopTimer(countdown) };
        }

        let countdown = $interval(decreaseTimer, tick);
        return countdown;
      }
    }

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
      if (index == this.GameService.guess) {
        classes = 'blue darken-2 white-text';
      }
      return classes;
    }

    public get myUserName() {
      return this.AuthenticationService.User.userName;
    }

    // sets the style of gameBoards when used in ng-class
    public gameBoardClass(gameBoard): string {
      return (gameBoard.questionState == 'new')
        ? "green darken-4 grey-text text-lighten-2"
        : "blue darken-1 blue-text";
    }

    // 
    public get activeIsMe() {
      return this.GameService.gameData.activeUserId == this.myUserName;
    }

    /* "trigger" methods respond to user action on elements to update the DB via APIs */

    // send new gameMsg to GameMessage table
    // clean up UI
    public triggerGameMessage = () => {
      var gameMsg = {
        content: $("#textInput").val(),
        userName: this.myUserName,
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
      this.GameService.updateGamesTable(newGameData);
      // GameBoard - no change
      // GamePlayers - no change
    }

    // only the active player can click the rules (or a button) to start the game    
    public triggerPlay() {
      // Games - update gameState to "pick"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "pick";
      this.GameService.updateGamesTable(newGameData)

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
          this.GameService.updateGameBoardsTable(newGameBoardData)

          // Games - update gameState to "prepare"
          let newGameData = this.GameService.gameData;
          newGameData.gameState = "prepare";
          this.GameService.updateGamesTable(newGameData)

          // GamePlayers - update all answer to 4 (always wrong), delay to GameService.duration (max)
          this.GameService.players.forEach(newPlayerData => {
            newPlayerData.answer = 4;
            newPlayerData.delay = this.GameService.duration;
            this.GameService.updateGamePlayersTable(newPlayerData)
          })
        } else {
          console.log(`Game Board retired`);
        }

      } else {
        console.log(`Only active player ${this.GameService.gameData.activeUserId} can pick`);
      }
    }

    // show Q&A to all players
    public triggerAnswer(boardId) {

      // Games - update gameState to "answer"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "answer";
      this.GameService.updateGamesTable(newGameData);

      // GameBoard - if gameBoard is "new", questionState to "ask", add answerOrder
      let newGameBoardData = this.GameService.gameBoards.find(gb => { return gb.id == boardId });
      newGameBoardData.questionState = "answer";
      newGameBoardData.answerOrder = this.GameService.answerOrder;
      this.GameService.updateGameBoardsTable(newGameBoardData)

      // GamePlayers - no change
    }

    // every player can select an "answer" to guess - $index stored in GameService.gamePlayers
    // store timeStamp in endTime to calculate delay
    public triggerGuess(guess) {
      if (this.GameService.gameState == "answer") {
        this.GameService.guess = guess;
        this.GameService.endTime = Date.now();
        console.log(`Guess: ${guess} Delay: ${this.GameService.endTime - this.GameService.startTime}`);
        
        // Games - no change
        // GameBoard - no change
  
        // GamePlayers - update answer & delay value
        let newPlayerData = this.GameService.players.find(p => { return p.userName == this.myUserName });
        newPlayerData.answer = guess;
        newPlayerData.delay = this.GameService.endTime - this.GameService.startTime;
        // console.log(`newPlayerData`, newPlayerData);
        this.GameService.updateGamePlayersTable(newPlayerData);
      }

    }

    // We cannot change the gameState when the current player countdown ends since another player might be running behind
    // We have to check that all players finished before changing states - do we need another field?
    // Games table gameState to "results", lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
    // Select gameBoard questionState to "retired", set answeredCorrectlyUserId
    // All gamePlayers answers & delay are compared correct in shortest time earns prizePoints
    public triggerResults(boardId) {
      
      
      // Games table gameState to "results", lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "results";
      this.GameService.updateGamesTable(newGameData);
      
      // Select gameBoard questionState to "retired"

      // GamePlayers - no change

    }

  }
}