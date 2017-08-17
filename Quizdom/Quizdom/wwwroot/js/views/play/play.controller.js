var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService, HubService, $http, $q, $scope) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.HubService = HubService;
                    this.$http = $http;
                    this.$q = $q;
                    this.$scope = $scope;
                    this.question = new Quizdom.Models.GameBoardModel;
                    this.guess = 4;
                    this.posts = [];
                    this.group = '';
                    this.getPosts = function () {
                        _this.$http({ method: 'GET', url: '/Chatroom' })
                            .then(function (response) {
                            _this.addPostsList(response.data);
                        });
                    };
                    this.addPostsList = function (posts) {
                        _this.posts.length = 0;
                        posts.forEach(function (post) {
                            _this.posts.push(post);
                        });
                        _this.posts.sort(function (a, b) { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1; });
                        // console.log(`$scope`, $scope);
                        console.log(_this.posts);
                    };
                    this.sendMessage = function () {
                        var post = {
                            content: $("#textInput").val(),
                            userName: _this.AuthenticationService.User.userName,
                            group: _this.group
                        };
                        _this.$http.post('/chatroom/', JSON.stringify(post))
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    this.GameService.loadMyGameData(this.AuthenticationService.User)
                        .then(function () {
                        _this.GameService.loadGame(_this.GameService.gameId);
                        _this.group = 'game' + _this.GameService.gameId;
                        _this.HubService.startHub();
                        // A function we will call from the server
                        _this.HubService.connection.broadcaster.client.addChatMessage = $scope.addPost;
                        // this.HubService.addConnect($scope.group);
                        _this.HubService.startGroup(_this.group);
                        _this.getPosts();
                    });
                    // confirming how to relocate onto $scope if necessary for SignalR async
                    $scope.loadQandA = function (gameBoard) {
                        console.log("loadQandA given gameBoard", gameBoard);
                        // find the local gameBoard by id
                        _this.question = _this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                        console.log("this.question", _this.question);
                        // update to the proper state
                        _this.question.questionState = "ask";
                        console.log("GameBoard: " + gameBoard.id + " questionState: " + _this.question.questionState);
                    };
                    $scope.addPost = function (post) {
                        console.log('New post from server: ', post);
                        _this.posts.push(post);
                        $scope.$applyAsync();
                        console.log("$scope.vm.posts", $scope.vm.posts);
                    };
                }
                PlayController.prototype.answerClass = function (index) {
                    var classes = "blue lighten-2 black-text";
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
                };
                PlayController.prototype.gameBoardClass = function (gameBoard) {
                    var classes = "green darken-4 grey-text text-lighten-2";
                    if (gameBoard.questionState == 'retired') {
                        classes = 'blue darken-1 blue-text';
                    }
                    return classes;
                };
                // SignalR methods to update gameBoard state that can be triggered by the server
                PlayController.prototype.triggerStateChange = function (boardId, answer) {
                    var _this = this;
                    var gameBoard = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                    if (gameBoard.questionState == "new") {
                        // console.log(`gameBoard`, gameBoard);
                        gameBoard.questionState = "ask";
                        this.GameService.updateGameBoard(gameBoard)
                            .$promise.then(function (ask) {
                            _this.loadQandA(ask);
                        });
                    }
                    else {
                        this.question = this.GameService.gameBoards.find(function (q) { return q.id == boardId; });
                        // console.log(`this.question`, this.question);
                        switch (this.question.questionState) {
                            case "ask":
                                this.question.questionState = "answers";
                                this.GameService.updateGameBoard(this.question)
                                    .$promise.then(function (gameBoard) {
                                    _this.showAllAnswers(gameBoard);
                                });
                                break;
                            case "answers":
                                if (answer >= 0 && answer < 4) {
                                    this.question.questionState = "guess";
                                    this.question.answerOrder = answer;
                                    this.GameService.updateGameBoard(this.question)
                                        .$promise.then(function (gameBoard) {
                                        _this.SelectAnswer(gameBoard);
                                    });
                                }
                                break;
                            case "guess":
                                if (answer < 4) {
                                    this.question.questionState = "correct";
                                    this.GameService.updateGameBoard(this.question)
                                        .$promise.then(function (gameBoard) {
                                        _this.ShowCorrectAnswer(gameBoard);
                                    });
                                }
                                break;
                            case "correct":
                                // get
                                var player = this.GameService.gamePlayers.find(function (p) { return p.userName == _this.AuthenticationService.User.userName; });
                                // console.log(`player from gamePlayers`, player);
                                var gamePlayer = new Quizdom.Models.UserModel;
                                gamePlayer.id = player.playerId;
                                gamePlayer.prizePoints = player.prizePoints;
                                gamePlayer.initiator = player.initiator;
                                gamePlayer.gameId = this.GameService.gameId;
                                gamePlayer.userId = this.AuthenticationService.User.userName;
                                console.log("Gameplayer", gamePlayer);
                                console.log("Question prizePoints", this.question.prizePoints);
                                console.log("answer", answer, "answer", this.question.correctAnswer);
                                if ('ABCD'[answer] == this.question.correctAnswer) {
                                    gamePlayer.prizePoints += this.question.prizePoints;
                                    this.question.answeredCorrectlyUserId = this.AuthenticationService.User.userName;
                                }
                                console.log("Gameplayer prizePoints", gamePlayer.prizePoints);
                                // Do we want to penalize a player for guessing wrong by subtracting prizePoints?
                                this.GameService.updateGamePlayer(gamePlayer)
                                    .$promise.then(function (gamePlayer) {
                                    _this.AddPrizePoints(gamePlayer);
                                });
                                this.question.questionState = "retired";
                                this.GameService.updateGameBoard(this.question)
                                    .$promise.then(function (gameBoard) {
                                    _this.RetireGameBoard(gameBoard);
                                });
                                break;
                        }
                    }
                };
                Object.defineProperty(PlayController.prototype, "showQ", {
                    get: function () {
                        return (this.question.questionState != 'new' && this.question.questionState != 'retired');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayController.prototype, "showA", {
                    get: function () {
                        return (this.question.questionState != 'ask');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayController.prototype, "showGuess", {
                    get: function () {
                        return (this.question.questionState == 'guess' || this.question.questionState == 'correct');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayController.prototype, "showCorrect", {
                    get: function () {
                        return (this.question.questionState == 'correct');
                    },
                    enumerable: true,
                    configurable: true
                });
                PlayController.prototype.loadQandA = function (gameBoard) {
                    console.log("loadQandA given gameBoard", gameBoard);
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    console.log("this.question", this.question);
                    // update to the proper state
                    this.question.questionState = "ask";
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                };
                PlayController.prototype.showAllAnswers = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "answers";
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                };
                PlayController.prototype.SelectAnswer = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "guess";
                    this.question.answerOrder = gameBoard.answerOrder;
                    this.guess = gameBoard.answerOrder;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState, "ABCD"[this.question.answerOrder]);
                };
                PlayController.prototype.ShowCorrectAnswer = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "correct";
                    if ("ABCD"[this.guess] == this.question.correctAnswer) {
                        this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
                    }
                    ;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.correctAnswer + " is " + this.question.questionState);
                };
                PlayController.prototype.AddPrizePoints = function (gamePlayer) {
                    // find the local gamePlayer by id
                    var player = this.GameService.gamePlayers.find(function (p) { return p.playerId == gamePlayer.id; });
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
                };
                PlayController.$inject = [
                    'AuthenticationService',
                    'GameService',
                    'HubService',
                    '$http',
                    '$q',
                    '$scope',
                ];
                return PlayController;
            }());
            Play.PlayController = PlayController;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
