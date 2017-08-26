var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService, HubService, $http, $q, $scope, $stateParams, $interval, $timeout) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.HubService = HubService;
                    this.$http = $http;
                    this.$q = $q;
                    this.$scope = $scope;
                    this.$stateParams = $stateParams;
                    this.$interval = $interval;
                    this.$timeout = $timeout;
                    /* "trigger" methods respond to user action on elements to update the DB via APIs */
                    // send new gameMsg to GameMessage table
                    // clean up UI
                    this.triggerGameMessage = function () {
                        var gameMsg = {
                            content: $("#textInput").val(),
                            userName: _this.AuthenticationService.User.userName,
                            group: _this.GameService.groupName,
                            gameId: _this.GameService.gameId
                        };
                        _this.GameService.postGameMsg(gameMsg).$promise
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    // console.log(`this.$stateParams`, this.$stateParams);
                    this.GameService.loadGame(this.$stateParams.gameId)
                        .then(function () {
                        _this.GameService.createGroup('game' + _this.$stateParams.gameId);
                        _this.HubService.startHub();
                        // A function we will call from the server
                        _this.HubService.connection.broadcaster.client.addGameMessage = $scope.addGameMsg;
                        _this.HubService.connection.broadcaster.client.changeGameData = $scope.changeGameData;
                        _this.HubService.connection.broadcaster.client.changeGameBoardData = $scope.changeGameBoardData;
                        _this.HubService.connection.broadcaster.client.changeGamePlayerData = $scope.changeGamePlayerData;
                        // this.HubService.addConnect($scope.group);
                        _this.HubService.startGroup(_this.GameService.groupName);
                        _this.GameService.getGameMessages();
                    });
                    // confirming how to relocate onto $scope if necessary for SignalR async
                    $scope.addGameMsg = function (gameMsg) {
                        console.log('New post from server: ', gameMsg);
                        _this.GameService.gameChats.push(gameMsg);
                        $scope.$applyAsync();
                        console.log("Game messages", _this.GameService.gameChats);
                    };
                    // newGameState is triggered by a change to the Games table
                    $scope.changeGameData = function (newGame) {
                        // update the values that can change over time
                        _this.GameService.gameData = newGame;
                        console.log("Game updated from DB", _this.GameService.gameData);
                        // TODO Add other local variables that should be updated
                        switch (_this.GameService.gameData.gameState) {
                            case "prepare":
                                $scope.countdownTimer(3).catch(function () {
                                    _this.triggerAnswer();
                                });
                                break;
                            default:
                                break;
                        }
                        $scope.$applyAsync();
                    };
                    // newGameBoardState is triggered by a change to the GameBoard table
                    $scope.changeGameBoardData = function (gameBoardData) {
                        // find the local gameBoard data in the array
                        var gbIndex = _this.GameService.gameBoards.findIndex(function (gb) { return gb.id == gameBoardData.id; });
                        // update the values that can change over time
                        _this.GameService.gameBoards[gbIndex].questionState = gameBoardData.questionState;
                        _this.GameService.gameBoards[gbIndex].answerOrder = gameBoardData.answerOrder;
                        _this.GameService.gameBoards[gbIndex].answeredCorrectlyUserId = gameBoardData.answeredCorrectlyUserId;
                        console.log("Game Board updated from DB", _this.GameService.gameBoards[gbIndex]);
                        // TODO Add other local variables that should be updated
                        // assign gameBoard question to local this.question when questionState = "ask"
                        _this.GameService.question = _this.GameService.gameBoards[gbIndex];
                        $scope.$applyAsync();
                    };
                    // newGamePlayerState is triggered by a change to the GamePlayer table
                    $scope.changeGamePlayerData = function (gamePlayerData) {
                        // find the local gamePlayer data in the array
                        var pIndex = _this.GameService.players.findIndex(function (p) { return p.playerId == gamePlayerData.id; });
                        // update the values that can change over time
                        _this.GameService.players[pIndex].prizePoints = gamePlayerData.prizePoints;
                        _this.GameService.players[pIndex].answer = gamePlayerData.answer;
                        _this.GameService.players[pIndex].delay = gamePlayerData.delay;
                        console.log("Game Player updated from DB", _this.GameService.players[pIndex]);
                        // TODO Add other local variables that should be updated
                        // Should we track when all players guess so we can cancel the countdown?
                        $scope.$applyAsync();
                    };
                    $scope.timer = 0;
                    $scope.countdownTimer = function (duration) {
                        var decreaseTimer = function () {
                            $scope.timer = duration;
                            console.log("duration", duration, "timer", $scope.timer);
                            duration--;
                            if (duration <= 0) {
                                $interval.cancel(countdown);
                            }
                            ;
                        };
                        var countdown = $interval(decreaseTimer, 1000);
                        return countdown;
                    };
                    console.log("$scope", $scope);
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
                PlayController.prototype.showMe = function (section) {
                    var show = false;
                    show = (this.GameService.gameState == section) ? true : false;
                    return show;
                };
                // old method to color answers based on player selection
                PlayController.prototype.answerClass = function (index) {
                    var classes = "blue lighten-2 black-text";
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
                };
                // sets the style of gameBoards when used in ng-class
                PlayController.prototype.gameBoardClass = function (gameBoard) {
                    return (gameBoard.questionState == 'new')
                        ? "green darken-4 grey-text text-lighten-2"
                        : "blue darken-1 blue-text";
                };
                Object.defineProperty(PlayController.prototype, "activeIsMe", {
                    // 
                    get: function () {
                        return this.GameService.gameData.activeUserId == this.AuthenticationService.User.userName;
                    },
                    enumerable: true,
                    configurable: true
                });
                // initial state of game shows How to play
                // randomly select the first active player
                PlayController.prototype.triggerWelcome = function () {
                    // Games - update gameState to "welcome"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "welcome";
                    this.GameService.updateGame(newGameData);
                    // GameBoard - no change
                    // GamePlayers - no change
                };
                // only the active player can click the rules (or a button) to start the game    
                PlayController.prototype.triggerPlay = function () {
                    // Games - update gameState to "pick"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "pick";
                    this.GameService.updateGame(newGameData);
                    // GameBoard - no change
                    // GamePlayers - no change
                };
                //  active player can click on "new" gameBoard element to pick question
                PlayController.prototype.triggerPrepare = function (boardId) {
                    var _this = this;
                    if (this.activeIsMe) {
                        // GameBoard - if gameBoard is "new", questionState to "ask", add answerOrder
                        var newGameBoardData = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                        // this has to be checked before changing the other tables
                        if (newGameBoardData.questionState == "new") {
                            newGameBoardData.questionState = "ask";
                            newGameBoardData.answerOrder = this.GameService.answerOrder;
                            this.GameService.updateGameBoard(newGameBoardData);
                            // TODO move this to GameService.newGameBoardData method
                            // this.GameService.answerOrder++;
                            // Games - update gameState to "prepare"
                            var newGameData = this.GameService.gameData;
                            newGameData.gameState = "prepare";
                            this.GameService.updateGame(newGameData);
                            // GamePlayers - update all answer to null and delay to null (always wrong)
                            this.GameService.players.forEach(function (newPlayerData) {
                                newPlayerData.answer = 0;
                                newPlayerData.delay = 0;
                                _this.GameService.updateGamePlayer(newPlayerData);
                            });
                        }
                        else {
                            console.log("Game Board retired");
                        }
                    }
                    else {
                        console.log("Only active player " + this.GameService.gameData.activeUserId + " can pick");
                    }
                };
                // show Q&A to all players
                PlayController.prototype.triggerAnswer = function () {
                    // Games - update gameState to "answer"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "answer";
                    this.GameService.updateGame(newGameData);
                    // GameBoard - update selected gameBoard to questionState "asked", add answerOrder
                    // GamePlayers - update answer & delay value
                };
                // every player can click on "answer" element to guess - stored in this.guess
                // store timeStamp in endTime to calculate delay
                PlayController.prototype.triggerGuess = function (guess) {
                    // Games - no change
                    // GameBoard - no change
                    // GamePlayers - update all answer to 4 (always wrong) and delay to max
                };
                PlayController.$inject = [
                    'AuthenticationService',
                    'GameService',
                    'HubService',
                    '$http',
                    '$q',
                    '$scope',
                    '$stateParams',
                    '$interval',
                    '$timeout',
                ];
                return PlayController;
            }());
            Play.PlayController = PlayController;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
