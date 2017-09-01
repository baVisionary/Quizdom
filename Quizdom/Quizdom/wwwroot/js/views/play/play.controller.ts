namespace Quizdom.Views.Play {
  export class PlayController {
    private guessValue = ['A', 'B', 'C', 'D', 'None'];
    public pIndex: number;
    public timer: string = "0";

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
      private $q: ng.IQService,
      private $scope: ng.IScope,
      private $stateParams: ng.ui.IStateParamsService,
      private $interval: ng.IIntervalService,
      private $timeout: ng.ITimeoutService,

    ) {
      this.GameService.loadGame(this.$stateParams.gameId, this.myUserName).then(() => {

        // grab the gameId from the $stateParams url
        this.GameService.createGroup('game' + this.$stateParams.gameId);

        // startup the SignalR server
        this.HubService.startHub();

        // Function we will call from the server to update the game, gameBoard, and gamePlayer states
        this.HubService.connection.broadcaster.client.addGameMessage = $scope.addGameMsg;
        this.HubService.connection.broadcaster.client.changeGameData = $scope.changeGameData;
        this.HubService.connection.broadcaster.client.changeGameBoardData = $scope.changeGameBoardData;
        this.HubService.connection.broadcaster.client.changeGamePlayerData = $scope.changeGamePlayerData;

        this.HubService.startGroup(this.GameService.groupName).then(() => {
          this.GameService.getGameMessages();
          this.triggerRefresh();
          // this.GameService.updateGamesTable(this.GameService.gameData);
          // this.GameService.updateGamePlayersTable(this.GameService.players.find(p => { return p.playerId == this.GameService.myGamePlayerId }));
          // this.GameService.updateGameBoardsTable(this.GameService.gameBoards.find(gb => { return gb.id == this.GameService.gameData.boardId }));
          console.log(`showSection`, this.GameService.showSection);
          console.log(`question`, this.GameService.question);
        })
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
        if (this.GameService.gameState == "welcome") {
          this.GameService.answerOrder = 0;
        }

        if (this.GameService.gameState == "pick") {
          this.GameService.guess = 4;
          this.GameService.delay = this.GameService.duration;
        }

        if (this.GameService.gameState != "question") {
          this.GameService.showSection = this.GameService.gameState;
          console.log(`Show section`, this.GameService.showSection);
        }    

        $scope.$applyAsync();
      }

      // newGameBoardState is triggered by a change to the GameBoard table
      $scope.changeGameBoardData = (gameBoardData) => {
        // console.log(`gameBoardData`, gameBoardData);

        // update the answerOrder to highest gameBoard.answerOrder for accidental refreshes
        this.GameService.answerOrder = Math.max(this.GameService.answerOrder, gameBoardData.answerOrder);

        // find the local gameBoard data in the array
        let gbIndex = this.GameService.gameBoards.findIndex(gb => { return gb.id == gameBoardData.id });

        // update the values that can change over time
        this.GameService.gameBoards[gbIndex].questionState = gameBoardData.questionState;
        this.GameService.gameBoards[gbIndex].answerOrder = gameBoardData.answerOrder;
        this.GameService.gameBoards[gbIndex].answeredCorrectlyUserId = gameBoardData.answeredCorrectlyUserId;
        console.log(`GameBoard updated from DB`, this.GameService.gameBoards[gbIndex]);

        // assign gameBoard question to local question if questionState = "asking"
        if (gameBoardData.questionState == "asking") {
          this.GameService.question = this.GameService.gameBoards[gbIndex];
        }

        $scope.$applyAsync();
      }

      // newGamePlayerState is triggered by a change to the GamePlayer table
      $scope.changeGamePlayerData = (gamePlayerData) => {

        // find the local gamePlayer data in the array
        this.pIndex = this.GameService.players.findIndex(p => { return p.playerId == gamePlayerData.id });

        // update the values that can change over time
        this.GameService.players[this.pIndex].prizePoints = gamePlayerData.prizePoints;
        this.GameService.players[this.pIndex].answer = gamePlayerData.answer;
        this.GameService.players[this.pIndex].delay = gamePlayerData.delay;
        this.GameService.players[this.pIndex].playerState = gamePlayerData.playerState;
        console.log(`Player updated from DB`, this.GameService.players[this.pIndex]);

        // Set visual state based on playerState
        if (this.GameService.gameState == "question") {
          this.GameService.showSection = gamePlayerData.playerState;
          console.log(`Show section`, this.GameService.showSection);
        }

        // Should we track when all players guess so we can cancel the countdown?
        if (this.GameService.gameState == "question") {
          this.checkPlayersInGuess();
        }
        
        if (gamePlayerData.playerState == "prepare") {
          this.triggerPrepareTimer();
        }
        $scope.$applyAsync();
      }
    }

    public stopTimer(name) {
      this.$interval.cancel(name)
    }

    // duration in seconds (* 1000 = millisecs), tick in milliseconds (+ counts up, - counts down)
    public showTimer(duration: number, tick: number) {
      console.log(`Timer started for ${duration} seconds`);
      let counter = 0;

      // calculates number of meaningful digits based on tick value (1000+ ms = 0 digits)
      let numDigits = Math.max(4 - Math.abs(tick).toString().length, 0);
      this.timer = counter.toFixed(numDigits);

      // timer always counts up then adjusts output based on tick +/-
      let changeTimer = () => {
        if (tick > 0) {
          this.timer = counter.toFixed(numDigits);
        } else {
          this.timer = (duration - counter).toFixed(numDigits);
        }
        // prints timer value to console every second (when it is integer)
        if (counter == Math.floor(counter)) {
          console.log(`timer`, this.timer, `numDigits`, numDigits);
        }
        // inc/decrements timer value and cleans up result to meaningful digits
        counter += (Math.abs(tick) / 1000);

        // checks whether duration has expired and cancels activeTimer promise
        if (counter >= duration) { this.stopTimer(activeTimer) };
      }

      let activeTimer = this.$interval(changeTimer, tick);
      return activeTimer;
    }

    // method to identify which sections to display based on gameState
    // result is boolean used as the value for ng-show
    public showMe(section): boolean {
      return (section == this.GameService.showSection);
    }

    // old method to color answers based on player selection
    public answerClass(index: number): string {
      let classes = "blue lighten-2 black-text";
      if (index == this.GameService.guess) {
        classes = 'blue darken-2 white-text';
      }
      return classes;
    }

    // change the results button class based on winner
    public resultsClass(): string {
      return (this.GameService.winner != 'No player') ? 'green darken-2 white-text' : 'yellow lighten-2 black-text';
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

    public playersInState(state: string): number {
      return this.GameService.players.filter(p => {
        return p.playerState == state
      }).length;
    }

    // calculates the winner once duration timer ends and all playerState = "guess"
    public questionWinner(): string {
      this.GameService.winner = "No player";
      let correctPlayers = this.GameService.players.filter(p => { return p.answer == this.GameService.question.correctAnswer })
      console.log(`correctPlayers`, correctPlayers);
      if (correctPlayers.length > 0) {
        let fastest = this.GameService.duration * 1000;
        correctPlayers.forEach(p => {
          fastest = Math.min(fastest, p.delay);
        })
        console.log(`fastest`, fastest);
        let winningPlayer = correctPlayers.find(p => { return p.delay == fastest });
        this.GameService.winner = winningPlayer.userName;
      }
      console.log(`Winner`, this.GameService.winner);
      return this.GameService.winner;
    }

    /* "trigger" methods respond to user action on DOM elements to update the DB via APIs */

    // send new gameMsg to GameMessage table
    public triggerGameMessage() {
      var gameMsg = {
        content: $("#textInput").val(),
        userName: this.myUserName,
        group: this.GameService.groupName,
        gameId: this.GameService.gameId
      };
      this.GameService.postGameMsg(gameMsg).$promise
        .then(function () {
          // clean up UI
          $("#textInput").val("");
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    // Keeps the game flowing when a user acccidentally refreshes the page
    public triggerRefresh() {
      let playerData = this.GameService.players.find(p => { return p.userName == this.myUserName });

      if (this.GameService.gameState == "question") {
        switch (playerData.playerState) {
          case "prepare":
            this.triggerPrepareTimer();
            break;
          case "ask":
            this.triggerAsk();
            break;
          case "guess":
            this.checkPlayersInGuess();
            break;
        }

      }

    }

    // initial state of game shows How to play
    public triggerWelcome() {
      // Games - update gameState to "welcome"
      let newGameData = this.GameService.gameData;
      newGameData.gameState = "welcome";
      this.GameService.updateGamesTable(newGameData);
      // GameBoard - no change

      // GamePlayers - no change

    }

    // only the active player can click a button to display the gameboard    
    public triggerPlay() {

      // Games - update gameState to "pick"
      let newGameData = angular.copy(this.GameService.gameData);
      newGameData.gameState = "pick";
      newGameData.gameBoardId = 0;
      this.GameService.updateGamesTable(newGameData)

    }

    //  Only the active player can select a GameBoard (questionState = "new")
    public triggerPrepare(boardId) {
      if (this.activeIsMe) {

        // GameBoard - if gameBoard is "new", questionState to "asking", add answerOrder
        let newGameBoardData = angular.copy(this.GameService.gameBoards.find(gb => { return gb.id == boardId }));

        // this has to be checked before changing the other tables
        if (newGameBoardData.questionState == "new") {
          newGameBoardData.questionState = "asking";
          this.GameService.answerOrder += 1;
          newGameBoardData.answerOrder = this.GameService.answerOrder;
          this.GameService.updateGameBoardsTable(newGameBoardData)

          // Games - update gameState to "question"
          let newGameData = angular.copy(this.GameService.gameData);
          newGameData.gameState = "question";
          newGameData.gameBoardId = boardId;
          this.GameService.updateGamesTable(newGameData)

          // GamePlayers - update all answer to 4 (always wrong), delay to GameService.duration (max)
          this.GameService.guess = 4;
          this.GameService.players.forEach(playerData => {

            let newPlayerData = angular.copy(playerData);
            // valid answers are 0-3 so 4 = "None" as in no answer selected
            newPlayerData.answer = this.GameService.guess;
            // duration = total time allowed in Sec * 1000 to get millisecs 
            newPlayerData.delay = this.GameService.duration * 1000;
            newPlayerData.playerState = "prepare";
            this.GameService.updateGamePlayersTable(newPlayerData)
          })

          // this.triggerPrepareTimer();

        } else {
          console.log(`Game Board retired`);
        }

      } else {
        console.log(`Only active player ${this.GameService.gameData.activeUserId} can pick`);
      }
    }

    public triggerPrepareTimer() {
      // Start a countdown from 3 secs
      this.showTimer(3, -1000).finally(() => {
        console.log(`Reveal question`);
        this.triggerAsk();
      })
    }

    // Updating only this GamePlayer playerState to "ask"  and local variables
    public triggerAsk() {
      // Games - no change
      // GameBoard - no change

      // GamePlayers - update only this playerState to "ask"
      let newPlayerData = angular.copy(this.GameService.players.find(p => { return p.userName == this.myUserName }));
      newPlayerData.playerState = 'ask';
      this.GameService.updateGamePlayersTable(newPlayerData);

      // Set other local variables to track player's guess
      this.GameService.startTime = Date.now();
      this.GameService.endTime = this.GameService.startTime;

      // Start a countdown timer from the stored duration (we could add this to Games table)
      this.showTimer(this.GameService.duration, -10).finally(() => {
        console.log(`Guess: ${this.GameService.guess} Delay: ${this.GameService.endTime - this.GameService.startTime}`);
        this.triggerSaveGuess();
      })

    }

    public checkPlayersInGuess() {
      // Should we track when all players guess so we can cancel the countdown?
      console.log(`Players in 'Guess'`, this.playersInState("guess") + this.playersInState("results"));
      if (this.playersInState("guess") + this.playersInState("results") == this.GameService.players.length) {
        this.triggerResults();
      }
    }

    // Available only when questionState = "ask" - All actions stored in local model until duration timer expires
    // each player selects an "answer" to store in GameService.guess
    // store timeStamp in endTime to calculate delay
    public triggerGuess(guess) {

      let playerData = this.GameService.players.find(p => { return p.userName == this.myUserName });

      if (playerData.playerState == "ask") {
        this.GameService.guess = guess;
        this.GameService.endTime = Date.now();
        this.GameService.delay = this.GameService.endTime - this.GameService.startTime;
        console.log(`Current - Guess: ${guess} Delay: ${this.GameService.delay}`);

        // Games - no change
        // GameBoard - no change
        // GamePlayers - wait to update GamePlayers until duration is up to allow player to switch answers
      }
    }

    // Triggered by duration timer expiring
    // This does not change gameState since other players with slow connections might still be within duration timer
    // Update only this gamePlayer with locally stored guess & calculated delay
    public triggerSaveGuess() {
      console.log(`Saved - Guess: ${this.GameService.guess} Delay: ${this.GameService.delay}`);

      // Games - no change
      // GameBoard - no change

      // GamePlayers - update answer & calculate delay value, playerState to "guess"
      let newPlayerData = angular.copy(this.GameService.players.find(p => { return p.userName == this.myUserName }));
      newPlayerData.answer = this.GameService.guess;
      newPlayerData.delay = this.GameService.delay;
      newPlayerData.playerState = 'guess';
      this.GameService.updateGamePlayersTable(newPlayerData);

    }

    // We cannot change the gameState when the current player countdown ends since another player might be running behind
    // We have to check that all players finished before changing states - using playerState
    // Games table lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
    // Set gameBoard answeredCorrectlyUserId to winner
    public triggerResults() {

      // figure out the winner
      this.GameService.winner = this.questionWinner();

      // copy the current gameBoard data
      let newGameBoardData = angular.copy(this.GameService.gameBoards.find(gb => { return gb.id == this.GameService.gameData.gameBoardId }));

      // Check to see if results already reported
      if (this.GameService.gameState == "question") {

        // Only the game inititor updates gameState & gameBoard questionState
        if (this.GameService.gameData.initiatorUserId == this.myUserName) {

          // copy the current game data
          let newGameData = angular.copy(this.GameService.gameData);

          if (this.GameService.winner != "No player") {
            // Games - player who earned prizePoints set to activeUserId
            newGameData.lastActiveUserId = newGameData.activeUserId;
            newGameData.activeUserId = this.GameService.winner
          }
          newGameData.gameState = "results";
          this.GameService.updateGamesTable(newGameData);

          // GameBoard - update answeredCorrectlyUserId with the winning player's username
          newGameBoardData.answeredCorrectlyUserId = this.GameService.winner;
          // newGameBoardData.questionState = "results"
          this.GameService.updateGameBoardsTable(newGameBoardData)
        }
      }

      // GamePlayers - update playerState to "results"
      // let myNewPlayerData = angular.copy(this.GameService.players.find(p => { return p.userName == this.myUserName }));
      // myNewPlayerData.playerState = "results";
      // this.GameService.updateGamePlayersTable(myNewPlayerData);

    }

    // update gamePlayer prizePoints, gameBoard questionsState to "retired", check for end of game
    public triggerReview() {

      console.log(`AnswerOrder:`, this.GameService.answerOrder);

      // GameBoards - retire gameBoard listed in gameData
        
      // copy the current gameBoard data
      let newGameBoardData = angular.copy(this.GameService.gameBoards.find(gb => { return gb.id == this.GameService.gameData.gameBoardId }));

      newGameBoardData.questionState = "retired"
      this.GameService.updateGameBoardsTable(newGameBoardData)

      // GamePlayers - update each player's playerState to "ready"
      this.GameService.players.forEach(playerData => {

        // copy each player's data
        let newPlayerData = angular.copy(playerData);

        if (newPlayerData.userName == this.GameService.winner) {
          newPlayerData.prizePoints += this.GameService.question.prizePoints;
          console.log(`Adding ${this.GameService.question.prizePoints} to ${this.GameService.winner}`);
        }

        // valid answers are 0-3 so 4 = "None" as in no answer selected
        newPlayerData.answer = 4;
        // duration = total time allowed in Sec * 1000 to get millisecs 
        newPlayerData.delay = this.GameService.duration * 1000;
        newPlayerData.playerState = "ready";
        this.GameService.updateGamePlayersTable(newPlayerData)
      })

      this.triggerPlay();
    }

    public triggerSummary() {

    }

  }
}