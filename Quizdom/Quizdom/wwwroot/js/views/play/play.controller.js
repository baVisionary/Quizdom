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
                    this.guessValue = ['A', 'B', 'C', 'D', 'None'];
                    this.timer = "0";
                    this.GameService.loadGame(this.$stateParams.gameId, this.myUserName).then(function () {
                        // grab the gameId from the $stateParams url
                        _this.GameService.createGroup('game' + _this.$stateParams.gameId);
                        // startup the SignalR server
                        _this.HubService.startHub();
                        // Function we will call from the server to update the game, gameBoard, and gamePlayer states
                        _this.HubService.connection.broadcaster.client.addGameMessage = $scope.addGameMsg;
                        _this.HubService.connection.broadcaster.client.changeGameData = $scope.changeGameData;
                        _this.HubService.connection.broadcaster.client.changeGameBoardData = $scope.changeGameBoardData;
                        _this.HubService.connection.broadcaster.client.changeGamePlayerData = $scope.changeGamePlayerData;
                        _this.HubService.startGroup(_this.GameService.groupName).then(function () {
                            _this.GameService.getGameMessages();
                            // checks the gameState and playerState to ensure the gmae progresses properly after a refresh
                            _this.triggerRefresh();
                            console.log("showSection", _this.GameService.showSection);
                            // console.log(`question`, this.GameService.question);
                        });
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
                        if (_this.GameService.gameState == "welcome") {
                            _this.GameService.answerOrder = 0;
                        }
                        if (_this.GameService.gameState == "pick") {
                            _this.GameService.guess = 4;
                            _this.GameService.delay = _this.GameService.duration;
                        }
                        if (_this.GameService.gameState != "question") {
                            _this.GameService.showSection = _this.GameService.gameState;
                            console.log("Show section", _this.GameService.showSection);
                        }
                        $scope.$applyAsync();
                    };
                    // newGameBoardState is triggered by a change to the GameBoard table
                    $scope.changeGameBoardData = function (gameBoardData) {
                        // console.log(`gameBoardData`, gameBoardData);
                        // update the answerOrder to highest gameBoard.answerOrder for accidental refreshes
                        _this.GameService.answerOrder = Math.max(_this.GameService.answerOrder, gameBoardData.answerOrder);
                        // find the local gameBoard data in the array
                        var gbIndex = _this.GameService.gameBoards.findIndex(function (gb) { return gb.id == gameBoardData.id; });
                        // update the values that can change over time
                        _this.GameService.gameBoards[gbIndex].questionState = gameBoardData.questionState;
                        _this.GameService.gameBoards[gbIndex].answerOrder = gameBoardData.answerOrder;
                        _this.GameService.gameBoards[gbIndex].answeredCorrectlyUserId = gameBoardData.answeredCorrectlyUserId || "";
                        _this.GameService.gameBoards[gbIndex].answeredCorrectlyDelay = gameBoardData.answeredCorrectlyDelay || 0;
                        console.log("GameBoard updated from DB", _this.GameService.gameBoards[gbIndex]);
                        // assign gameBoard question to local question if questionState = "asking"
                        if (gameBoardData.questionState == "asking") {
                            _this.GameService.question = _this.GameService.gameBoards[gbIndex];
                            _this.GameService.winner = gameBoardData.answeredCorrectlyUserId;
                        }
                        $scope.$applyAsync();
                    };
                    // newGamePlayerState is triggered by a change to the GamePlayer table
                    $scope.changeGamePlayerData = function (gamePlayerData) {
                        // find the local gamePlayer data in the array
                        _this.pIndex = _this.GameService.players.findIndex(function (p) { return p.playerId == gamePlayerData.id; });
                        // update the values that can change over time
                        _this.GameService.players[_this.pIndex].prizePoints = gamePlayerData.prizePoints;
                        _this.GameService.players[_this.pIndex].answer = gamePlayerData.answer;
                        _this.GameService.players[_this.pIndex].delay = gamePlayerData.delay;
                        _this.GameService.players[_this.pIndex].playerState = gamePlayerData.playerState;
                        _this.GameService.players[_this.pIndex].questionsRight = gamePlayerData.questionsRight;
                        _this.GameService.players[_this.pIndex].questionsRightDelay = gamePlayerData.questionsRightDelay;
                        _this.GameService.players[_this.pIndex].questionsWon = gamePlayerData.questionsWon;
                        console.log("Player updated from DB", _this.GameService.players[_this.pIndex]);
                        // Set visual state based on playerState
                        if (_this.GameService.gameState == "question") {
                            if (gamePlayerData.userId == _this.myUserName) {
                                _this.GameService.showSection = gamePlayerData.playerState;
                                console.log("Show section", _this.GameService.showSection);
                                if (gamePlayerData.playerState == "prepare") {
                                    _this.triggerPrepareTimer();
                                }
                                else if (gamePlayerData.playerState == "ask") {
                                    _this.triggerAskTimer();
                                }
                            }
                            if (gamePlayerData.playerState == "guess") {
                                _this.checkPlayersInGuess();
                            }
                        }
                        $scope.$applyAsync();
                    };
                }
                PlayController.prototype.stopTimer = function (name) {
                    this.$interval.cancel(name);
                };
                // duration in seconds (* 1000 = millisecs), tick in milliseconds (+ counts up, - counts down)
                PlayController.prototype.showTimer = function (duration, tick) {
                    var _this = this;
                    console.log("Timer started for " + duration + " seconds");
                    // calculates number of meaningful digits based on tick value (1000+ ms = 0 digits)
                    var numDigits = Math.max(4 - Math.abs(tick).toString().length, 0);
                    var counter = 0;
                    // showing value based on timer direction using tick +/-
                    if (tick > 0) {
                        this.timer = counter.toFixed(numDigits);
                    }
                    else {
                        this.timer = (duration - counter).toFixed(numDigits);
                    }
                    var tickTock = this.$interval(function () {
                        // inc/decrements timer value and cleans up result to meaningful digits
                        counter += (Math.abs(tick) / 1000);
                        // prints timer value to console every second (when it is integer)
                        if (counter == Math.floor(counter)) {
                            console.log("Timer:", _this.timer);
                        }
                        // showing value based on timer direction using tick +/-
                        if (tick > 0) {
                            _this.timer = counter.toFixed(numDigits);
                        }
                        else {
                            _this.timer = (duration - counter).toFixed(numDigits);
                        }
                    }, Math.abs(tick));
                    var activeTimer = this.$timeout(function () {
                        _this.$interval.cancel(tickTock);
                        console.log("Timer finished after " + duration + " s");
                    }, duration * 1000);
                    return activeTimer;
                };
                // method to identify which sections to display based on gameState
                // result is boolean used as the value for ng-show
                PlayController.prototype.showMe = function (section) {
                    return (section == this.GameService.showSection);
                };
                // old method to color answers based on player selection
                PlayController.prototype.answerClass = function (index) {
                    var classes = "blue lighten-2 black-text";
                    if (index == this.GameService.guess) {
                        classes = 'blue darken-2 white-text';
                    }
                    return classes;
                };
                // change the results button class based on winner
                PlayController.prototype.resultsClass = function () {
                    return (this.GameService.winner != 'No player') ? 'green darken-2 white-text' : 'yellow lighten-2 black-text';
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
                PlayController.prototype.playersInState = function (state) {
                    return this.GameService.players.filter(function (p) {
                        return p.playerState == state;
                    }).length;
                };
                // calculates the winner once duration timer ends and all playerState = "guess"
                PlayController.prototype.questionWinner = function () {
                    var _this = this;
                    this.GameService.winner = "No player";
                    var correctPlayers = this.GameService.players.filter(function (p) { return p.answer == _this.GameService.question.correctAnswer; });
                    console.log("correctPlayers", correctPlayers);
                    if (correctPlayers.length > 0) {
                        var fastest_1 = this.GameService.duration * 1000;
                        correctPlayers.forEach(function (p) {
                            fastest_1 = Math.min(fastest_1, p.delay);
                        });
                        console.log("fastest", fastest_1);
                        var winningPlayer = correctPlayers.find(function (p) { return p.delay == fastest_1; });
                        this.GameService.winner = winningPlayer.userName;
                    }
                    console.log("Winner", this.GameService.winner);
                    return this.GameService.winner;
                };
                // calculates the game winner based on prizePoints using questions answered correctly then average answerDelay as tie-breakers
                PlayController.prototype.gameWinner = function () {
                    var _this = this;
                    this.GameService.winner = "Tie";
                    this.GameService.players.forEach(function (playerData) {
                        var player = {
                            userName: playerData.userName,
                            prizePoints: playerData.prizePoints,
                            answerCorrect: 0,
                            answerDelay: 0
                        };
                        // tally the number of questions answered correctly
                        var myCorrect = _this.GameService.gameBoards.filter(function (gb) { return gb.answeredCorrectlyUserId == playerData.userName; });
                        player.answerCorrect = myCorrect.length;
                        // player.answerDelay = myCorrect.reduce((a, b) => {
                        //   return a.answeredCorrectlyDelay + b.answeredCorrectlyDelay;
                        // }, 0)
                        _this.GameService.playerResults.push(player);
                    });
                    this.GameService.playerResults.sort(function (a, b) {
                        if (a.prizePoints != b.prizePoints) {
                            return (a.prizePoints > b.prizePoints) ? -1 : 1;
                        }
                        if (a.answerCorrect != b.answerCorrect) {
                            return (a.answerCorrect > b.answerCorrect) ? -1 : 1;
                        }
                        return (a.answerDelay < b.answerDelay) ? -1 : 1;
                    });
                    return this.GameService.playerResults[0].userName;
                };
                /* "trigger" methods respond to user action on DOM elements to update the DB via APIs */
                // send new gameMsg to GameMessage table
                PlayController.prototype.triggerGameMessage = function () {
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
                };
                // Keeps the game flowing when a user acccidentally refreshes the page
                PlayController.prototype.triggerRefresh = function () {
                    var _this = this;
                    var playerData = this.GameService.players.find(function (p) { return p.userName == _this.myUserName; });
                    if (this.GameService.gameState == "question") {
                        switch (playerData.playerState) {
                            case "prepare":
                                this.triggerPrepareTimer();
                                break;
                            case "ask":
                                this.triggerAskTimer();
                                break;
                            case "guess":
                                this.checkPlayersInGuess();
                                break;
                        }
                    }
                };
                // initial state of game shows How to play
                PlayController.prototype.triggerWelcome = function () {
                    // Games - update gameState to "welcome"
                    var newGameData = this.GameService.gameData;
                    newGameData.gameState = "welcome";
                    this.GameService.updateGamesTable(newGameData);
                    // GameBoard - no change
                    // GamePlayers - no change
                };
                // Any player clicking "How to play" starts the game
                PlayController.prototype.triggerPlay = function () {
                    // Games - update gameState to "pick"
                    var newGameData = angular.copy(this.GameService.gameData);
                    newGameData.gameState = "pick";
                    newGameData.gameBoardId = 0;
                    this.GameService.updateGamesTable(newGameData);
                };
                //  Only the active player can select a GameBoard (questionState = "new")
                PlayController.prototype.triggerPrepare = function (boardId) {
                    var _this = this;
                    if (this.activeIsMe) {
                        // GameBoard - if gameBoard is "new", questionState to "asking", add answerOrder
                        var newGameBoardData = angular.copy(this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; }));
                        // this has to be checked before changing the other tables
                        if (newGameBoardData.questionState == "new") {
                            newGameBoardData.questionState = "asking";
                            this.GameService.answerOrder += 1;
                            newGameBoardData.answerOrder = this.GameService.answerOrder;
                            this.GameService.updateGameBoardsTable(newGameBoardData);
                            // Games - update gameState to "question"
                            var newGameData = angular.copy(this.GameService.gameData);
                            newGameData.gameState = "question";
                            newGameData.gameBoardId = boardId;
                            this.GameService.updateGamesTable(newGameData);
                            // GamePlayers - all playerState to "prepare", answer to 4 (always wrong), delay to GameService.duration (max)
                            this.GameService.guess = 4;
                            this.GameService.players.forEach(function (playerData) {
                                // copy each player to update values
                                var newPlayerData = angular.copy(playerData);
                                // valid answers are 0-3 so 4 = "None" as in no answer selected
                                newPlayerData.answer = _this.GameService.guess;
                                // duration = total time allowed in Sec * 1000 to get millisecs 
                                newPlayerData.delay = _this.GameService.duration * 1000;
                                newPlayerData.playerState = "prepare";
                                _this.GameService.updateGamePlayersTable(newPlayerData);
                            });
                            // this.triggerPrepareTimer();
                        }
                        else {
                            console.log("Game Board retired");
                        }
                    }
                    else {
                        console.log("Only active player " + this.GameService.gameData.activeUserId + " can pick");
                    }
                };
                // Triggered by playerState changing to "prepare"
                PlayController.prototype.triggerPrepareTimer = function () {
                    var _this = this;
                    // Start a countdown from 3 secs
                    this.showTimer(3, -1000).then(function () {
                        // Games - no change
                        // GameBoard - no change
                        // GamePlayers - update only this playerState to "ask"
                        var newPlayerData = angular.copy(_this.GameService.players.find(function (p) { return p.userName == _this.myUserName; }));
                        newPlayerData.playerState = 'ask';
                        _this.GameService.updateGamePlayersTable(newPlayerData);
                    });
                };
                // Triggered by playerState changing to "ask"
                PlayController.prototype.triggerAskTimer = function () {
                    var _this = this;
                    // Set other local variables to track player's guess
                    this.GameService.startTime = Date.now();
                    this.GameService.endTime = this.GameService.startTime;
                    // start a countdown from duration with a tick value of 10 ms
                    this.showTimer(this.GameService.duration, -10).then(function () {
                        console.log("Saved - Guess: " + _this.GameService.guess + " Delay: " + _this.GameService.delay);
                        // Triggered by duration timer expiring
                        // This does not change gameState since other players with slow connections might still be within duration timer
                        // Update only this gamePlayer with locally stored guess & calculated delay
                        // Games - no change
                        // GameBoard - no change
                        // GamePlayers - update answer & calculate delay value, playerState to "guess"
                        var newPlayerData = angular.copy(_this.GameService.players.find(function (p) { return p.userName == _this.myUserName; }));
                        newPlayerData.answer = _this.GameService.guess;
                        newPlayerData.delay = _this.GameService.delay;
                        newPlayerData.playerState = 'guess';
                        _this.GameService.updateGamePlayersTable(newPlayerData);
                    });
                };
                // Available only when playerState = "guess" - All actions stored in local model until duration timer expires
                // each player selects an "answer" to store in GameService.guess
                // store timeStamp in endTime to calculate delay
                PlayController.prototype.triggerGuess = function (guess) {
                    var _this = this;
                    var playerData = this.GameService.players.find(function (p) { return p.userName == _this.myUserName; });
                    if (playerData.playerState == "ask") {
                        this.GameService.guess = guess;
                        this.GameService.endTime = Date.now();
                        this.GameService.delay = this.GameService.endTime - this.GameService.startTime;
                        console.log("Current - Guess: " + guess + " Delay: " + this.GameService.delay);
                        // Games - no change
                        // GameBoard - no change
                        // GamePlayers - wait to update GamePlayers until duration is up to allow player to switch answers
                    }
                };
                // This does not change gameState since other players with slow connections might still be within duration timer
                // Update only this gamePlayer with locally stored guess & calculated delay
                PlayController.prototype.triggerSaveGuess = function () {
                    var _this = this;
                    console.log("Saved - Guess: " + this.GameService.guess + " Delay: " + this.GameService.delay);
                    // Games - no change
                    // GameBoard - no change
                    // GamePlayers - update only this player answer & delay value, playerState to "results"
                    var newPlayerData = angular.copy(this.GameService.players.find(function (p) { return p.userName == _this.myUserName; }));
                    newPlayerData.answer = this.GameService.guess;
                    newPlayerData.delay = this.GameService.delay;
                    newPlayerData.playerState = 'guess';
                    this.GameService.updateGamePlayersTable(newPlayerData);
                };
                PlayController.prototype.checkPlayersInGuess = function () {
                    // Should we track when all players guess so we can cancel the countdown?
                    console.log("Players in 'guess'", this.playersInState("guess"));
                    // Check to see results not yet reported (gameState "question") and if all players submitted a guess (poss by timing out) 
                    if (this.GameService.gameState == "question" && this.playersInState("guess") == this.GameService.players.length) {
                        this.triggerResults();
                    }
                };
                // We cannot change the gameState when the current player countdown ends since another player might be running behind
                // We have to check that all players finished before changing states - using playerState
                // Games table lastActiveUserId = activeUserId, player who earned prizePoints set to activeUserId
                // Set gameBoard answeredCorrectlyUserId to winner
                PlayController.prototype.triggerResults = function () {
                    var _this = this;
                    // Only the game inititor updates the tables
                    if (this.GameService.gameData.initiatorUserId == this.myUserName) {
                        // figure out the winner
                        this.GameService.winner = "No player";
                        var fastest_2 = this.GameService.duration * 1000;
                        var correctPlayers_1 = 0;
                        this.GameService.players.forEach(function (playerData) {
                            var newPlayerData = angular.copy(playerData);
                            if (newPlayerData.answer == _this.GameService.question.correctAnswer) {
                                correctPlayers_1++;
                                // update playerState to reflect whether player answered correctly
                                newPlayerData.playerState = "right";
                                // store the fastest (lowest) correct answer delay
                                fastest_2 = Math.min(fastest_2, newPlayerData.delay);
                            }
                            else {
                                // update playerState to reflect whether player answered correctly
                                newPlayerData.playerState = "wrong";
                            }
                            _this.GameService.updateGamePlayersTable(newPlayerData);
                        });
                        // check if any  player answered correctly and note the fastest correct guess
                        if (correctPlayers_1 > 0) {
                            console.log("fastest", fastest_2);
                            this.GameService.winner = this.GameService.players.find(function (p) { return p.delay == fastest_2; }).userName;
                        }
                        // copy the current game data
                        var newGameData = angular.copy(this.GameService.gameData);
                        if (this.GameService.winner != "No player") {
                            // Games - player who earned prizePoints set to activeUserId
                            newGameData.lastActiveUserId = newGameData.activeUserId;
                            newGameData.activeUserId = this.GameService.winner;
                        }
                        newGameData.gameState = "results";
                        this.GameService.updateGamesTable(newGameData);
                        // copy the current gameBoard data
                        var newGameBoardData = angular.copy(this.GameService.gameBoards.find(function (gb) { return gb.id == _this.GameService.gameData.gameBoardId; }));
                        // GameBoard - update answeredCorrectlyUserId with the winning player's username
                        newGameBoardData.answeredCorrectlyUserId = this.GameService.winner;
                        newGameBoardData.answeredCorrectlyDelay = this.GameService.delay;
                        // newGameBoardData.questionState = "results"
                        this.GameService.updateGameBoardsTable(newGameBoardData);
                    }
                };
                // update gamePlayer prizePoints, gameBoard questionsState to "retired", check for end of game
                PlayController.prototype.triggerReview = function () {
                    var _this = this;
                    console.log("AnswerOrder:", this.GameService.answerOrder);
                    // GameBoards - retire gameBoard listed in gameData
                    // copy the current gameBoard data
                    var newGameBoardData = angular.copy(this.GameService.gameBoards.find(function (gb) { return gb.id == _this.GameService.gameData.gameBoardId; }));
                    newGameBoardData.questionState = "retired";
                    this.GameService.updateGameBoardsTable(newGameBoardData);
                    // GamePlayers - first player to click increments questionsRight, questionsRightDelay, questionsWon, updates every playerState to "ready"
                    this.GameService.players.forEach(function (playerData) {
                        // copy each player's data
                        var newPlayerData = angular.copy(playerData);
                        if (newPlayerData.playerState == "right") {
                            newPlayerData.prizePoints += _this.GameService.question.prizePoints;
                            console.log("Adding " + _this.GameService.question.prizePoints + " to " + newPlayerData.userName);
                            newPlayerData.questionsRight += 1;
                            newPlayerData.questionsRightDelay += newPlayerData.delay;
                            if (newPlayerData.userName == _this.GameService.winner) {
                                newPlayerData.questionsWon += 1;
                            }
                        }
                        // valid answers are 0-3 so 4 = "None" as in no answer selected
                        newPlayerData.answer = 4;
                        // duration = total time allowed in Sec * 1000 to get millisecs 
                        newPlayerData.delay = _this.GameService.duration * 1000;
                        newPlayerData.playerState = "ready";
                        _this.GameService.updateGamePlayersTable(newPlayerData);
                    });
                    if (this.GameService.answerOrder < 18) {
                        this.triggerPlay();
                    }
                    else {
                        this.triggerSummary();
                    }
                };
                PlayController.prototype.triggerSummary = function () {
                    var _this = this;
                    // figure out the winner
                    this.GameService.winner = this.gameWinner();
                    // Only the game inititor updates gameState & gameBoard questionState
                    if (this.GameService.gameData.initiatorUserId == this.myUserName) {
                        // copy the current game data
                        var newGameData = angular.copy(this.GameService.gameData);
                        newGameData.gameState = "summary";
                        this.GameService.updateGamesTable(newGameData);
                        // 
                        var newGameBoardData = angular.copy(this.GameService.gameBoards.find(function (gb) { return gb.id == _this.GameService.gameData.gameBoardId; }));
                        // this.GameService.updateGameBoardsTable(newGameBoardData)
                    }
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
