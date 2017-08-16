var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService, HubService, $q, $scope) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.HubService = HubService;
                    this.$q = $q;
                    this.$scope = $scope;
                    this.question = new Quizdom.Models.GameBoardModel;
                    this.questionOrder = 0;
                    this.guess = 4;
                    this.showQ = false;
                    this.showA = false;
                    this.showGuess = false;
                    this.showCorrect = false;
                    this.guessCorrect = false;
                    this.GameService.loadMyGameData(this.AuthenticationService.User)
                        .then(function () {
                        _this.GameService.loadGame(_this.GameService.gameId);
                    });
                    // confirming how to relocate onto $scope if necessary for SignalR async
                    $scope.loadQandA = function (boardId) {
                        // find the local gameBoard by id
                        _this.question = _this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                        // update to the proper state
                        _this.question.questionState = "ask";
                        console.log("GameBoard: " + boardId + " questionState: " + _this.question.questionState);
                        _this.showQ = true;
                        _this.showA = _this.showGuess = _this.showCorrect = _this.guessCorrect = false;
                    };
                }
                // SignalR methods to update gameBoard state that can be triggered by the server
                PlayController.prototype.triggerStateChange = function (boardId, answer) {
                    var _this = this;
                    if (this.question.questionState == "new") {
                        var gameBoard = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                        gameBoard.questionState = "ask";
                        this.GameService.updateGameBoard(gameBoard).$promise
                            .then(function (gameBoard) {
                            _this.loadQandA(boardId);
                        });
                    }
                    else {
                        this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                        switch (this.question.questionState) {
                            case "ask":
                                this.question.questionState = "answers";
                                this.GameService.updateGameBoard(this.question).$promise
                                    .then(function (gameBoard) {
                                    _this.showAllAnswers(gameBoard);
                                });
                                break;
                            case "answers":
                                this.question.questionState = "guess";
                                this.question.answerOrder = answer;
                                this.GameService.updateGameBoard(this.question).$promise
                                    .then(function (gameBoard) {
                                    _this.SelectAnswer(gameBoard);
                                });
                                break;
                            case "guess":
                                if (answer < 4) {
                                    this.question.questionState = "correct";
                                    this.GameService.updateGameBoard(this.question).$promise
                                        .then(function (gameBoard) {
                                        _this.ShowCorrectAnswer(gameBoard);
                                    });
                                }
                                break;
                            case "correct":
                                this.question.questionState = "retired";
                                this.GameService.updateGameBoard(this.question).$promise
                                    .then(function (gameBoard) {
                                    _this.RetireGameBoard(gameBoard);
                                });
                                break;
                        }
                    }
                };
                PlayController.prototype.triggerLoadQandA = function (boardId) {
                    var _this = this;
                    var gameBoard = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                    if (gameBoard.questionState == "new") {
                        gameBoard.questionState = "ask";
                        this.GameService.updateGameBoard(gameBoard).$promise
                            .then(function (gameBoard) {
                            _this.loadQandA(boardId);
                        });
                    }
                };
                PlayController.prototype.triggerShowAllAnswers = function (boardId) {
                    var _this = this;
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                    if (this.question.questionState == "ask") {
                        this.question.questionState = "answers";
                        this.GameService.updateGameBoard(this.question).$promise
                            .then(function (gameBoard) {
                            _this.showAllAnswers(gameBoard);
                        });
                    }
                };
                PlayController.prototype.triggerSelectAnswer = function (boardId, answer) {
                    var _this = this;
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                    if (this.question.questionState == "answers") {
                        this.question.questionState = "guess";
                        this.question.answerOrder = answer;
                        this.GameService.updateGameBoard(this.question).$promise
                            .then(function (gameBoard) {
                            _this.SelectAnswer(gameBoard);
                        });
                    }
                };
                PlayController.prototype.triggerShowCorrectAnswer = function (boardId) {
                    var _this = this;
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                    if (this.question.questionState == "guess") {
                        this.question.questionState = "correct";
                        this.GameService.updateGameBoard(this.question).$promise
                            .then(function (gameBoard) {
                            _this.ShowCorrectAnswer(gameBoard);
                        });
                    }
                };
                PlayController.prototype.triggerAddPrizePoints = function (playerId) {
                    var _this = this;
                    var player = this.GameService.gamePlayers.find(function (p) { return p.id == playerId; });
                    if (this.guessCorrect) {
                        player.prizePoints = player.prizePoints + this.question.prizePoints;
                    }
                    // Do we want to penalize a player for guessing wrong by subtracting prizePoints?
                    this.GameService.updateGamePlayer(player).$promise
                        .then(function (gamePlayer) {
                        _this.AddPrizePoints(gamePlayer);
                    });
                };
                PlayController.prototype.triggerRetireGameBoard = function (boardId) {
                    var _this = this;
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                    if (this.question.questionState == "correct") {
                        this.question.questionState = "retired";
                        this.GameService.updateGameBoard(this.question).$promise
                            .then(function (gameBoard) {
                            _this.RetireGameBoard(gameBoard);
                        });
                    }
                };
                PlayController.prototype.loadQandA = function (boardId) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                    // update to the proper state
                    this.question.questionState = "ask";
                    console.log("GameBoard: " + boardId + " questionState: " + this.question.questionState);
                    this.showQ = true;
                    this.showA = this.showGuess = this.showCorrect = this.guessCorrect = false;
                };
                PlayController.prototype.showAllAnswers = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "answers";
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                    this.showQ = this.showA = true;
                    this.showGuess = this.showCorrect = this.guessCorrect = false;
                };
                PlayController.prototype.SelectAnswer = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "guess";
                    this.question.answerOrder = gameBoard.answerOrder;
                    this.guess = gameBoard.answerOrder;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState, "ABCD"[this.question.answerOrder]);
                    this.showQ = this.showA = this.showGuess = true;
                    this.showCorrect = this.guessCorrect = false;
                };
                PlayController.prototype.ShowCorrectAnswer = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "correct";
                    if ("ABCD"[this.guess] == this.question.correctAnswer) {
                        this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
                        this.guessCorrect = true;
                    }
                    ;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.correctAnswer + " is " + this.question.questionState);
                    this.showQ = this.showA = this.showGuess = this.showCorrect = true;
                };
                PlayController.prototype.AddPrizePoints = function (gamePlayer) {
                    // find the local gamePlayer by id
                    var player = this.GameService.gamePlayers.find(function (p) { return p.id == gamePlayer.id; });
                    // update to the proper state
                    player.prizePoints = gamePlayer.prizePoints;
                    console.log("GamePlayer: " + gamePlayer.id + " new score is " + player.prizePoints);
                };
                PlayController.prototype.RetireGameBoard = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "retired";
                    this.guess = 4;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                    this.showQ = this.showA = this.showGuess = this.showCorrect = this.guessCorrect = false;
                };
                PlayController.$inject = [
                    'AuthenticationService',
                    'GameService',
                    'HubService',
                    '$q',
                    '$scope'
                ];
                return PlayController;
            }());
            Play.PlayController = PlayController;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
