var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var PlayController = (function () {
                function PlayController(AuthenticationService, GameService, HubService, $http, $q, $scope, $stateParams) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.GameService = GameService;
                    this.HubService = HubService;
                    this.$http = $http;
                    this.$q = $q;
                    this.$scope = $scope;
                    this.$stateParams = $stateParams;
                    this.question = new Quizdom.Models.GameBoardModel;
                    this.guess = 4;
                    this.posts = [];
                    this.group = '';
                    // the order in which questions are selected
                    this.answerOrder = 0;
                    // countdown duration (6 sec) and timer for answering question
                    this.duration = 6 * 1000;
                    // public sendMessage = () => {
                    //   var post = {
                    //     content: $("#textInput").val(),
                    //     userName: this.AuthenticationService.User.userName,
                    //     group: this.group,
                    //     gameId: this.GameService.gameId
                    //   };
                    //   this.$http.post<any>('/api/game/gamechat', JSON.stringify(post))
                    //     .then(function () {
                    //       $("#textInput").val("");
                    //     })
                    //     .catch(function (e) {
                    //       console.log(e);
                    //     });
                    // }
                    this.sendGameMessage = function () {
                        var post = {
                            content: $("#textInput").val(),
                            userName: _this.AuthenticationService.User.userName,
                            group: _this.group,
                            gameId: _this.GameService.gameId
                        };
                        _this.GameService.postGameMsg(post).$promise
                            .then(function () {
                            $("#textInput").val("");
                        })
                            .catch(function (e) {
                            console.log(e);
                        });
                    };
                    // console.log(`User`, this.AuthenticationService.User);
                    // console.log(`this.$stateParams`, this.$stateParams);
                    this.GameService.loadGame(this.$stateParams.gameId)
                        .then(function () {
                        var player = _this.GameService.players.find(function (p) { return p.userName == _this.AuthenticationService.User.userName; });
                        _this.GameService.myGamePlayerId = player.id;
                        _this.answerOrder = Math.max.apply(Math, _this.GameService.gameBoards.map(function (gb) { return gb.answerOrder; }));
                        console.log("My playerId", _this.GameService.myGamePlayerId);
                        _this.group = 'game' + _this.$stateParams.gameId;
                        _this.HubService.startHub();
                        // A function we will call from the server
                        _this.HubService.connection.broadcaster.client.addGameMessage = $scope.addPost;
                        // this.HubService.addConnect($scope.group);
                        _this.HubService.startGroup(_this.group);
                        _this.getGameMessages();
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
                    // this.GameService.testLoopPromise(5);      
                }
                // public getPosts() {
                //   this.$http<any[]>({ method: 'GET', url: '/api/game/gamechat' })
                //     .then((response) => {
                //       this.addPostsList(response.data)
                //     });
                // }
                PlayController.prototype.getGameMessages = function () {
                    var _this = this;
                    this.GameService.getAllGameMsgs().$promise
                        .then(function (messages) {
                        // console.log(`messages`, messages);
                        _this.addPostsList(messages);
                    });
                };
                PlayController.prototype.addPostsList = function (posts) {
                    var _this = this;
                    this.posts.length = 0;
                    posts.forEach(function (post) {
                        _this.posts.push(post);
                    });
                    this.posts.sort(function (a, b) { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1; });
                    // console.log(this.posts);
                };
                // Sets the style of answers when called by ng-class
                PlayController.prototype.answerClass = function (index) {
                    var classes = "blue lighten-2 black-text";
                    if (index == this.guess) {
                        classes = 'blue darken-2 white-text';
                    }
                    if (this.showCorrect) {
                        if (index == this.guess) {
                            classes = 'red lighten-2 grey-text text-darken-1';
                        }
                        if (index == this.question.correctAnswer) {
                            classes = 'green darken-3 green-text text-lighten-3';
                        }
                    }
                    return classes;
                };
                // Sets the style of gameBoards when called by ng-class
                PlayController.prototype.gameBoardClass = function (gameBoard) {
                    var classes = "green darken-4 grey-text text-lighten-2";
                    if (gameBoard.questionState == 'retired') {
                        classes = 'blue darken-1 blue-text';
                    }
                    return classes;
                };
                PlayController.prototype.catLong = function (categoryId) {
                    console.log("categoryId", categoryId);
                    console.log("allCategories", this.GameService.allCategories);
                    var cat = this.GameService.allCategories.find(function (cat) { return cat.id == categoryId; });
                    console.log("cat", cat);
                    return cat.longDescription;
                };
                // "trigger" methods respond to user action on elements to update the DB via APIs
                //  click on "new" gameBoard element to answer question
                PlayController.prototype.triggerLoadQandA = function (boardId) {
                    var _this = this;
                    var gameBoard = this.GameService.gameBoards.find(function (gb) { return gb.id == boardId; });
                    if (gameBoard.questionState == "new") {
                        // console.log(`gameBoard`, gameBoard);
                        gameBoard.questionState = "ask";
                        gameBoard.answerOrder = this.answerOrder;
                        this.answerOrder++;
                        this.GameService.updateGameBoard(gameBoard)
                            .$promise.then(function (ask) {
                            _this.loadQandA(ask);
                        });
                    }
                };
                //  click on "ask" big question element to show answer Q&A
                PlayController.prototype.triggerShowAllAnswers = function () {
                    var _this = this;
                    // console.log(`this.question`, this.question);
                    if (this.question.questionState == "ask") {
                        this.question.questionState = "answers";
                        this.GameService.updateGameBoard(this.question)
                            .$promise.then(function (gameBoard) {
                            _this.showAllAnswers(gameBoard);
                        });
                    }
                };
                //  click on specific "answers" to enter your selection
                PlayController.prototype.triggerSelectAnswer = function (answer) {
                    var _this = this;
                    if (this.question.questionState == 'answers') {
                        this.endTime = Date.now();
                        this.question.questionState = "guess";
                        this.GameService.updateGameBoard(this.question)
                            .$promise.then(function (gameBoard) {
                            _this.selectAnswerGB(gameBoard);
                        });
                        this.GameService.getGamePlayers(this.GameService.gameId)
                            .$promise.then(function (gamePlayers) {
                            // find the local gameBoard by id
                            var playerIndex = gamePlayers.findIndex(function (g) { return g.id == _this.GameService.myGamePlayerId; });
                            gamePlayers[playerIndex].answer = answer;
                            gamePlayers[playerIndex].delay = _this.endTime - _this.startTime;
                            _this.GameService.updateGamePlayer(gamePlayers[playerIndex])
                                .$promise.then;
                            _this.selectAnswerGP(gamePlayers[playerIndex]);
                        });
                    }
                };
                Object.defineProperty(PlayController.prototype, "showQ", {
                    // public triggerStateChange(boardId, answer: number) {
                    //   let gameBoard = this.GameService.gameBoards.find(gb => { return gb.id == boardId });
                    //   if (gameBoard.questionState == "new") {
                    //     // console.log(`gameBoard`, gameBoard);
                    //     gameBoard.questionState = "ask";
                    //     this.GameService.updateGameBoard(gameBoard)
                    //       // TODO - remove .then once SignalR is triggering the method!
                    //       .$promise.then((ask) => {
                    //         this.loadQandA(ask);
                    //       })
                    //   } else {
                    //     this.question = this.GameService.gameBoards.find(q => { return q.id == boardId });
                    //     // console.log(`this.question`, this.question);
                    //     switch (this.question.questionState) {
                    //       case "ask":
                    //         this.question.questionState = "answers";
                    //         this.GameService.updateGameBoard(this.question)
                    //           // TODO - remove .then once SignalR is triggering the method!
                    //           .$promise.then((gameBoard) => {
                    //             this.showAllAnswers(gameBoard);
                    //           })
                    //         break;
                    //       case "answers":
                    //         if (answer >= 0 && answer < 4) {
                    //           this.question.questionState = "guess";
                    //           this.question.answerOrder = answer;
                    //           this.GameService.updateGameBoard(this.question)
                    //             // TODO - remove .then once SignalR is triggering the method!
                    //             .$promise.then((gameBoard) => {
                    //               this.selectAnswerGB(gameBoard);
                    //             })
                    //         }
                    //         break;
                    //       case "guess":
                    //         this.question.questionState = "correct";
                    //         this.GameService.updateGameBoard(this.question)
                    //           // TODO - remove .then once SignalR is triggering the method!
                    //           .$promise.then((gameBoard) => {
                    //             this.showCorrectAnswer(gameBoard);
                    //           })
                    //         break;
                    //       case "correct":
                    //         // get
                    //         let player = this.GameService.players.find(p => { return p.userName == this.AuthenticationService.User.userName });
                    //         // console.log(`player from gamePlayers`, player);
                    //         let gamePlayer = new Models.GamePlayerModel;
                    //         gamePlayer.id = player.gamePlayerId;
                    //         gamePlayer.prizePoints = player.prizePoints;
                    //         gamePlayer.initiator = player.initiator;
                    //         gamePlayer.gameId = this.GameService.gameId;
                    //         gamePlayer.userName = this.AuthenticationService.User.userName;
                    //         console.log(`Gameplayer`, gamePlayer);
                    //         console.log(`Question prizePoints`, this.question.prizePoints);
                    //         console.log(`answer`, answer, `answer`, this.question.correctAnswer);
                    //         if (answer == this.question.correctAnswer) {
                    //           gamePlayer.prizePoints += this.question.prizePoints;
                    //           this.question.answeredCorrectlyUserId = this.AuthenticationService.User.userName;
                    //         }
                    //         console.log(`Gameplayer prizePoints`, gamePlayer.prizePoints);
                    //         // Do we want to penalize a player for guessing wrong by subtracting prizePoints?
                    //         this.GameService.updateGamePlayer(gamePlayer)
                    //           // TODO - remove .then once SignalR is triggering the method!
                    //           .$promise.then((gamePlayer) => {
                    //             this.addPrizePoints(gamePlayer);
                    //           })
                    //         this.question.questionState = "retired";
                    //         this.GameService.updateGameBoard(this.question)
                    //           // TODO - remove .then once SignalR is triggering the method!
                    //           .$promise.then((gameBoard) => {
                    //             this.retireGameBoard(gameBoard);
                    //           })
                    //         break;
                    //     }
                    //   }
                    // }
                    get: function () {
                        return (this.question.questionState != 'new' && this.question.questionState != 'retired');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayController.prototype, "showAnswers", {
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
                // SignalR methods to update gameBoard state that can be triggered by the server
                // when player selects a gameBoard to answer the question
                PlayController.prototype.loadQandA = function (gameBoard) {
                    // find the local gameBoard by id
                    var gbIndex = this.GameService.gameBoards.findIndex(function (gb) { return gb.id == gameBoard.id; });
                    // update to the proper state
                    this.GameService.gameBoards[gbIndex] = gameBoard;
                    this.question.questionState = gameBoard.questionState;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                    // countdown 3 secs then show answers
                    // this.countdown = 3
                    // let delay = this.countdown * 1000;
                    // let timer = setInterval(() => {
                    //   this.countdown--;
                    // }, 1000);
                    // setTimeout(() => {
                    //   clearInterval(timer);
                    this.triggerShowAllAnswers();
                    // }, delay * 1000);
                };
                PlayController.prototype.showAllAnswers = function (gameBoard) {
                    // find the local gameBoard by id
                    var boardIndex = this.GameService.gameBoards.findIndex(function (g) { return g.id == gameBoard.id; });
                    // update to the proper state
                    this.GameService.gameBoards[boardIndex] = gameBoard;
                    this.question.questionState = gameBoard.questionState;
                    this.startTime = Date.now();
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState);
                };
                PlayController.prototype.selectAnswerGP = function (gamePlayer) {
                    // find the local gameBoard by id
                    var playerIndex = this.GameService.players.findIndex(function (g) { return g.id == gamePlayer.playerId; });
                    // update to the proper state
                    this.GameService.players[playerIndex].answer = gamePlayer.answer;
                    this.GameService.players[playerIndex].delay = gamePlayer.delay;
                    console.log("GamePlayer: " + gamePlayer.id + " answer: " + gamePlayer.answer + " delay: " + gamePlayer.delay);
                };
                PlayController.prototype.selectAnswerGB = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "guess";
                    this.question.answerOrder = gameBoard.answerOrder;
                    this.guess = gameBoard.answerOrder;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.questionState, "ABCD"[this.question.answerOrder]);
                };
                PlayController.prototype.showCorrectAnswer = function (gameBoard) {
                    // find the local gameBoard by id
                    this.question = this.GameService.gameBoards.find(function (q) { return q.id == gameBoard.id; });
                    // update to the proper state
                    this.question.questionState = "correct";
                    if (this.guess == this.question.correctAnswer) {
                        this.question.answeredCorrectlyUserId = gameBoard.answeredCorrectlyUserId;
                    }
                    ;
                    console.log("GameBoard: " + gameBoard.id + " questionState: " + this.question.correctAnswer + " is " + this.question.questionState);
                };
                PlayController.prototype.addPrizePoints = function (gamePlayer) {
                    // find the local gamePlayer by id
                    var player = this.GameService.players.find(function (p) { return p.gamePlayerId == gamePlayer.id; });
                    // update to the proper state
                    player.prizePoints = gamePlayer.prizePoints;
                    console.log("GamePlayer: " + gamePlayer.id + " new score is " + player.prizePoints);
                };
                PlayController.prototype.retireGameBoard = function (gameBoard) {
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
                    '$stateParams',
                ];
                return PlayController;
            }());
            Play.PlayController = PlayController;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
