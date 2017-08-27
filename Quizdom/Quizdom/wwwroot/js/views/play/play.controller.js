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
                    // public question: Models.GameBoardModel = new Models.GameBoardModel;
                    this.guessValue = ['A', 'B', 'C', 'D', 'None'];
                    /* "trigger" methods respond to user action on elements to update the DB via APIs */
                    // send new gameMsg to GameMessage table
                    // clean up UI
                    this.triggerGameMessage = function () {
                        var gameMsg = {
                            content: $("#textInput").val(),
                            userName: _this.myUserName,
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
                        $scope.changeGameData(_this.GameService.gameData);
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
                        _this.GameService.gameData.activeUserId = newGame.activeUserId;
                        _this.GameService.gameData.lastActiveUserId = newGame.lastActiveUserId;
                        _this.GameService.gameData.gameBoardId = newGame.gameBoardId;
                        _this.GameService.gameData.gameState = newGame.gameState;
                        console.log("Game updated from DB", _this.GameService.gameData);
                        // TODO Add other local variables that should be updated
                        switch (_this.GameService.gameData.gameState) {
                            case "prepare":
                                _this.GameService.guess = 4;
                                $scope.countdownTimer(3, 1000).catch(function () {
                                    _this.triggerAnswer(newGame.boardId);
                                });
                                break;
                            case "answer":
                                _this.GameService.startTime = Date.now();
                                $scope.countdownTimer(_this.GameService.duration, 10)
                                    .catch(function () {
                                })
                                    .finally(function () {
                                    console.log("Guess: " + _this.GameService.guess + " Delay: " + (_this.GameService.endTime - _this.GameService.startTime));
                                    console.log("Time ran out");
                                    _this.triggerGuess(4);
                                });
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
                        // 
                        _this.GameService.answerOrder = gameBoardData.answerOrder + 1;
                        // assign gameBoard question to local this.question when questionState = "ask"
                        console.log("questionState includes ask/answer/results", ["ask", "answer", "results"].indexOf(_this.GameService.gameBoards[gbIndex].questionState));
                        if (["ask", "answer", "result"].indexOf(_this.GameService.gameBoards[gbIndex].questionState) > -1) {
                            _this.GameService.question = _this.GameService.gameBoards[gbIndex];
                        }
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
                    $scope.stopTimer = function (name) {
                        $interval.cancel(name);
                    };
                    $scope.countdownTimer = function (duration, tick) {
                        // duration in seconds (* 1000 = millisecs), decrement in milliseconds
                        $scope.timer = duration;
                        var numDigits = Math.max(4 - tick.toString().length, 0);
                        var decreaseTimer = function () {
                            if ($scope.timer == Math.floor($scope.timer)) {
                                console.log("timer", $scope.timer);
                            }
                            $scope.timer = ($scope.timer - (tick / 1000)).toFixed(numDigits);
                            if ($scope.timer <= 0) {
                                $scope.stopTimer(countdown);
                            }
                            ;
                        };
                        var countdown = $interval(decreaseTimer, tick);
                        return countdown;
                    };
                }
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
                    if (index == this.GameService.guess) {
                        classes = 'blue darken-2 white-text';
                    }
                    return classes;
                };
                Object.defineProperty(PlayController.prototype, "myUserName", {
                    get: function () {
                        return this.AuthenticationService.User.userName;
                    },
                    enumerable: true,
                    configurable: true
                });
                // sets the style of gameBoards when used in ng-class
                PlayController.prototype.gameBoardClass = function (gameBoard) {
                    return (gameBoard.questionState == 'new')
                        ? "green darken-4 grey-text text-lighten-2"
                        : "blue darken-1 blue-text";
                };
                Object.defineProperty(PlayController.prototype, "activeIsMe", {
                    // 
                    get: function () {
                        return this.GameService.gameData.activeUserId == this.myUserName;
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
                    this.GameService.updateGamesTable(newGameData);
                    // GameBoard - no change
                    // GamePlayers - no change
                };
                // only the active player can click the rules (or a button) to start the game    
                PlayController.prototype.triggerPlay = function () {
                    // Games - update gameState to "pick"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "pick";
                    this.GameService.updateGamesTable(newGameData);
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
                            this.GameService.updateGameBoardsTable(newGameBoardData);
                            // Games - update gameState to "prepare"
                            var newGameData = this.GameService.gameData;
                            newGameData.gameState = "prepare";
                            this.GameService.updateGamesTable(newGameData);
                            // GamePlayers - update all answer to 4 (always wrong), delay to GameService.duration (max)
                            this.GameService.players.forEach(function (newPlayerData) {
                                newPlayerData.answer = 4;
                                newPlayerData.delay = _this.GameService.duration;
                                _this.GameService.updateGamePlayersTable(newPlayerData);
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
                PlayController.prototype.triggerAnswer = function (boardId) {
                    // Games - update gameState to "answer"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "answer";
                    this.GameService.updateGamesTable(newGameData);
                    // GameBoard - if gameBoard is "new", questionState to "ask", add answerOrder
                    var newGameBoardData = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                    newGameBoardData.questionState = "answer";
                    newGameBoardData.answerOrder = this.GameService.answerOrder;
                    this.GameService.updateGameBoardsTable(newGameBoardData);
                    // GamePlayers - no change
                };
                // every player can select an "answer" to guess - $index stored in GameService.gamePlayers
                // store timeStamp in endTime to calculate delay
                PlayController.prototype.triggerGuess = function (guess) {
                    var _this = this;
                    if (this.GameService.gameState == "answer") {
                        this.GameService.guess = guess;
                        this.GameService.endTime = Date.now();
                        console.log("Guess: " + guess + " Delay: " + (this.GameService.endTime - this.GameService.startTime));
                        // Games - no change
                        // GameBoard - no change
                        // GamePlayers - update answer & delay value
                        var newPlayerData = this.GameService.players.find(function (p) { return p.userName == _this.myUserName; });
                        newPlayerData.answer = guess;
                        newPlayerData.delay = this.GameService.endTime - this.GameService.startTime;
                        // console.log(`newPlayerData`, newPlayerData);
                        this.GameService.updateGamePlayersTable(newPlayerData);
                    }
                };
                // We cannot change the gameState when the current player countdown ends since another player might be running behind
                // We have to check that all players finished before changing states - do we need another field?
                // Games table gameState to "results", lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
                // Select gameBoard questionState to "retired", set answeredCorrectlyUserId
                // All gamePlayers answers & delay are compared correct in shortest time earns prizePoints
                PlayController.prototype.triggerResults = function (boardId) {
                    // Games table gameState to "results", lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "results";
                    this.GameService.updateGamesTable(newGameData);
                    // Select gameBoard questionState to "retired"
                    // GamePlayers - no change
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
