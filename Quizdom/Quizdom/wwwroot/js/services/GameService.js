// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var GameService = (function () {
            function GameService(PlayerService, QuestionService, $resource, $q) {
                this.PlayerService = PlayerService;
                this.QuestionService = QuestionService;
                this.$resource = $resource;
                this.$q = $q;
                this.allGames = [];
                this.allCategories = [];
                this.questionsByCatDiff = [];
                this.difficulty = [
                    { label: 'Easy', value: 'easy' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Hard', value: 'hard' }
                ];
                this.gamePlayers = [];
                this.gameCategories = [];
                this.gameCatClass = 'col s12';
                this.gameDifficulty = 'all';
                this.gameSource = "";
                this.gameBoards = [];
                this.numQuestions = 0;
                this.row = 0;
                this.column = 0;
                this.perRow = 6;
                // manage 'Games' table
                this._Resource_game = this.$resource('/api/game/:gameId', null, {
                    'update': {
                        method: 'PUT'
                    },
                    'search': {
                        method: 'GET',
                        url: '/api/game/gameinitiator/:username',
                    }
                });
                // manage 'GameCategories' table - lists the categories selected for each gameId
                this._Resource_game_categories = this.$resource('/api/game/gamecategories/:id', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                // manage 'GamePlayers' table
                this._Resource_game_players = this.$resource('/api/game/players/:id', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                // access 'Categories' to correlate categoryId to short & long name
                this._Resource_categories = this.$resource('/api/game/categories/:id', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                // manage 'GameBoard' table throughout game
                this._Resource_gameBoard = this.$resource('api/game/board/:gameId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                // this.getAllGames();
                this.getAllCats();
            }
            // // 
            // private getAllGames(): boolean {
            //   this._Resource_game.query().$promise
            //     .then((games) => {
            //       this.allGames = games;
            //       console.log(`Games:`, this.allGames);
            //       return true;
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       return false;
            //     })
            //   return false;
            // }
            // simple random function
            GameService.prototype.randomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            // load all categories
            GameService.prototype.getAllCats = function () {
                if (this.allCategories.length == 0) {
                    this.allCategories = this._Resource_categories.query();
                    return this.allCategories.$promise;
                }
                else {
                    var categories = this.$q.defer();
                    categories.resolve(this.allCategories);
                    return categories;
                }
            };
            // Should we limit each user to initiating only one game (and replace any other games?)
            GameService.prototype.findLastGame = function (user) {
                return this._Resource_game.search({ username: user.userName });
            };
            Object.defineProperty(GameService.prototype, "newGameId", {
                get: function () {
                    return this.newGameData.id;
                },
                enumerable: true,
                configurable: true
            });
            // Create new gameId
            // Check if user already has active game
            // YES - use last gameId again
            // NO - create new game resource
            GameService.prototype.loadGame = function (user) {
                var _this = this;
                var gameLoaded = new Promise(function (res, er) {
                    _this.findLastGame(user).$promise
                        .then(function (lastGame) {
                        // console.log(`lastGame`, lastGame);
                        if (lastGame.hasOwnProperty('initiatorUserId')) {
                            _this.newGameData = lastGame;
                            console.log("newGameData", _this.newGameData);
                            _this.$q.all([_this.loadGameCategories(), _this.loadPlayers(user), _this.loadGameBoards()])
                                .then(function () {
                                console.log("Game Player length:", _this.gamePlayers.length);
                                console.log("Game Category length:", _this.gameCategories.length);
                                console.log("Game Boards:", _this.gameBoards.length);
                                res(true);
                            })
                                .catch(function (error) {
                                console.log("Unable to load players/categories/gameboard");
                                console.log("error", error);
                            });
                        }
                        else {
                            _this._Resource_game.save({ initiatorUserId: user.userName }).$promise
                                .then(function (newGame) {
                                console.log("newGame", newGame);
                                _this.newGameData.id = newGame.id;
                                _this.newGameData.initiatorUserId = user;
                                console.log("newGameData", _this.newGameData);
                                _this.loadPlayers(user);
                                res(true);
                            })
                                .catch(function (error) {
                                console.log(error);
                            });
                        }
                    });
                });
                return gameLoaded;
            };
            GameService.prototype.destroyGame = function () {
                var _this = this;
                this._Resource_game.remove({ gameId: this.newGameId }).$promise
                    .then(function (gameData) {
                    _this.newGameData = {};
                    _this.gamePlayers = [];
                    _this.gameCategories = [];
                    _this.gameDifficulty = 'all';
                    _this.gameBoards.length = 0;
                })
                    .catch(function (error) {
                    console.log("error", error);
                });
            };
            // Show the players assigned to the current gameId
            GameService.prototype.loadPlayers = function (user) {
                var _this = this;
                return this._Resource_game_players.query({ id: this.newGameId }).$promise
                    .then(function (players) {
                    // console.log(`players`, players);
                    if (players.length == 0) {
                        _this.addPlayer(_this.newGameId, user, true);
                        console.log("Game Players", _this.gamePlayers);
                    }
                    else {
                        players.forEach(function (p, i) {
                            // console.log(`p.userId`, p.userId);
                            return _this.PlayerService.findByUserName(p.userId)
                                .then(function (player) {
                                player.playerId = p.id;
                                _this.gamePlayers[i] = player;
                            });
                        });
                        console.log("Game Players", _this.gamePlayers);
                    }
                })
                    .catch(function (error) {
                    console.log("error", error);
                });
            };
            // Show the gamecategories assigned to the current gameId
            GameService.prototype.loadGameCategories = function () {
                var _this = this;
                return this._Resource_game_categories.query({ id: this.newGameId }).$promise
                    .then(function (gameCategories) {
                    gameCategories.forEach(function (gameCategory, i) {
                        var category = _this.allCategories.find(function (c) { return c.id == gameCategory.categoryId; });
                        category.categoryId = gameCategory.id;
                        _this.gameCategories[i] = category;
                    });
                    console.log("Game Categories", _this.gameCategories);
                });
            };
            // Show the gameBoards assigned to the current gameId
            GameService.prototype.loadGameBoards = function () {
                var _this = this;
                this.gameBoards.length = 0;
                return this._Resource_gameBoard.query({ id: this.newGameId }).$promise
                    .then(function (gameBoards) {
                    gameBoards.forEach(function (gameBoard) {
                        _this.gameBoards.push(gameBoard);
                    });
                    console.log("Game Boards", _this.gameBoards);
                });
            };
            // Add player who is registered
            GameService.prototype.addPlayer = function (gameId, user, initiator) {
                var _this = this;
                if (this.gamePlayers.length < 3 && this.gamePlayers.findIndex(function (p) { return p.userName == user.userName; }) == -1) {
                    var player = new this._Resource_game_players;
                    player.gameId = gameId;
                    player.userId = user.userName;
                    player.initiator = initiator;
                    player.$save(function (player) {
                        user.playerId = player.id;
                        _this.gamePlayers.push(user);
                        console.log("players", _this.gamePlayers);
                        return true;
                    })
                        .catch(function (error) {
                        console.log("Error:", error);
                    });
                }
                return false;
            };
            GameService.prototype.removePlayer = function (playerId) {
                var _this = this;
                if (this.gamePlayers.length > 1) {
                    console.log("Deleting playerId:", playerId);
                    this._Resource_game_players.delete({ id: playerId }).$promise
                        .then(function () {
                        _this.gamePlayers.splice(_this.gamePlayers.findIndex(function (p) { return p.playerId == playerId; }), 1);
                    });
                }
            };
            GameService.prototype.addCategory = function (category) {
                var _this = this;
                if (this.gameCategories.length < 3 && this.gameCategories.findIndex(function (c) { return c.shortDescription == category.shortDescription; }) == -1) {
                    var newGameCat = new this._Resource_game_categories;
                    newGameCat.gameId = this.newGameId;
                    newGameCat.categoryId = category.id;
                    console.log("newGameCat", newGameCat);
                    newGameCat.$save(function (cat) {
                        console.log("cat", cat);
                        category.categoryId = cat.id;
                        console.log("category", category);
                        _this.gameCategories.push(category);
                        console.log("selectCategories", _this.gameCategories);
                        return true;
                    })
                        .catch(function (error) {
                        console.log("Error:", error);
                    });
                }
                return false;
            };
            GameService.prototype.removeCategory = function (categoryId) {
                var _this = this;
                if (this.gameCategories.length > 0) {
                    console.log("Deleting game category:", categoryId);
                    this._Resource_game_categories.delete({ id: categoryId }).$promise
                        .then(function () {
                        _this.gameCategories.splice(_this.gameCategories.findIndex(function (c) { return c.categoryId == categoryId; }), 1);
                    });
                }
            };
            // select random items from arraySelect and add to arrayToAdd
            GameService.prototype.addInRandomOrder = function (arrayToAdd, arraySelect, wanted) {
                var _this = this;
                var shuffling = new Promise(function (res, err) {
                    // might be nice to support if fewer in list than amount
                    // if arraySelect.length < amount then randomize arraySelect.length repeatedly until amount reached
                    var assigned = 0;
                    do {
                        var avail = Math.min(arraySelect.length, wanted - assigned);
                        for (var i = 0; i < avail; i++) {
                            var last = arraySelect.length - 1 - i;
                            var randomOne = _this.randomInt(0, last);
                            arrayToAdd.push(arraySelect[randomOne]);
                            var temp = arraySelect[randomOne];
                            arraySelect[randomOne] = arraySelect[last];
                            arraySelect[last] = temp;
                        }
                        assigned += avail;
                    } while (assigned < wanted);
                    res(arrayToAdd);
                });
                return shuffling;
            };
            // parse questions into GameBoardQuestions
            GameService.prototype.parseQuizToGameBoard = function (cat, questions, prizePoints) {
                var _this = this;
                var gameBoardPromise = new Promise(function (res, err) {
                    var randomizedQs = [];
                    _this.addInRandomOrder(randomizedQs, questions, _this.numQuestions);
                    var randomizedGameBoards = [];
                    randomizedQs.forEach(function (q) {
                        var gameBoard = new Quizdom.Models.GameBoardModel;
                        gameBoard.gameId = _this.newGameId;
                        gameBoard.categoryId = cat.id;
                        gameBoard.difficulty = q.difficulty;
                        gameBoard.boardRow = _this.row;
                        gameBoard.boardColumn = _this.column;
                        gameBoard.questionId = q.id;
                        gameBoard.questionText = q.question;
                        gameBoard.prizePoints = prizePoints;
                        var answers = [];
                        _this.addInRandomOrder(answers, [
                            { answer: q.correct_Answer, correct: true },
                            { answer: q.incorrect_Answer1, correct: false },
                            { answer: q.incorrect_Answer2, correct: false },
                            { answer: q.incorrect_Answer3, correct: false }
                        ], 4);
                        answers.forEach(function (a, i) {
                            var parameter = 'answer' + 'ABCD'[i];
                            gameBoard[parameter] = a.answer;
                            if (a.correct) {
                                gameBoard.correctAnswer = 'ABCD'[i];
                            }
                            ;
                        });
                        _this.column++;
                        if (_this.column == _this.perRow) {
                            _this.column = 0;
                            _this.row++;
                        }
                        if (_this.row >= 3) {
                            _this.row = 0;
                        }
                        _this._Resource_gameBoard.save(gameBoard).$promise
                            .then(function (data) {
                            // console.log(`data`, data);
                            gameBoard.id = data.id;
                            _this.gameBoards.push(gameBoard);
                            res(true);
                        });
                    });
                    return gameBoardPromise;
                });
            };
            GameService.prototype.loadNewGameBoards = function (cat, diff) {
                var _this = this;
                var promiseGameBoard = new Promise(function (res, err) {
                    _this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
                        .then(function (questions) {
                        console.log(cat.shortDescription + " " + diff.value + " Qs: " + questions.length);
                        var prizePoints = [100, 200, 300][_this.difficulty.findIndex(function (d) { return d.value == diff.value; })];
                        _this.parseQuizToGameBoard(cat, questions, prizePoints);
                        // console.log(`gameBoards:`, this.gameBoards);
                        res(true);
                    });
                });
                return promiseGameBoard;
            };
            // Build the game board using the categories
            GameService.prototype.setupGameBoard = function () {
                var _this = this;
                console.log("Creating GameBoards");
                this.gameBoards.length = 0;
                if (this.gamePlayers.length < 2 || this.gameCategories.length < 1) {
                    console.log("Unable to setup game - invite players & select categories");
                    return false;
                }
                // set the proper width of the category labels using ng-class "col sX"
                this.gameCatClass = 'col s' + (12 / this.gameCategories.length).toString();
                // assign random question to each row & column based on
                // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
                // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
                this.numQuestions = 18 / this.gameCategories.length / (this.gameDifficulty == 'all' ? 3 : 1);
                this.row = 0;
                this.column = 0;
                this.perRow = 6 / this.gameCategories.length;
                // line up all the promises to fill the gameBoard
                var gamePromises = this.$q.when();
                this.gameCategories.forEach(function (cat) {
                    _this.difficulty.forEach(function (diff) {
                        if (_this.gameDifficulty == 'all' || _this.gameDifficulty == diff.value) {
                            gamePromises = gamePromises.then(function () {
                                _this.loadNewGameBoards(cat, diff);
                            });
                        }
                    });
                });
                // line up all the promises to save the gameBoard
                // this.gameBoards.forEach(gameBoard => {
                //   gamePromises = gamePromises.then(() => {
                //     this._Resource_gameBoard.save(this.newGameId, gameBoard);
                //   })
                this.$q.when(gamePromises)
                    .then(function () {
                    console.log("this.gameBoards", _this.gameBoards);
                });
            };
            GameService.$inject = [
                'PlayerService',
                'QuestionService',
                '$resource',
                '$q'
            ];
            return GameService;
        }());
        Services.GameService = GameService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
