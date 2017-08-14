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
                this.gameDifficulty = 'all';
                this.gameSource = "";
                this.gameBoards = [];
                this.numQuestions = 0;
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
                return this.findLastGame(user).$promise
                    .then(function (lastGame) {
                    // console.log(`lastGame`, lastGame);
                    if (lastGame.hasOwnProperty('initiatorUserId')) {
                        _this.newGameData = lastGame;
                        console.log("newGameData", _this.newGameData);
                        return _this.$q.all([_this.loadGameCategories(), _this.loadPlayers(user)])
                            .then(function () {
                            console.log("Game Player length:", _this.gamePlayers.length);
                            console.log("Game Category length:", _this.gameCategories.length);
                        })
                            .catch(function (error) {
                            console.log("Unable to load players & categories");
                            console.log("error", error);
                        });
                    }
                    else {
                        var newGame = _this._Resource_game.save({ initiatorUserId: user.userName });
                        return newGame.$promise
                            .then(function (game) {
                            // this.newGameData = newGame;
                            return _this._Resource_game.get({ gameId: game.id }).$promise
                                .then(function (newGame) {
                                _this.newGameData = newGame;
                                console.log("newGameData", _this.newGameData);
                                // return this.loadPlayers(user);
                                return true;
                            })
                                .catch(function (error) {
                                console.log(error);
                            });
                        })
                            .catch(function (error) {
                            console.log(error);
                        });
                    }
                });
            };
            GameService.prototype.destroyGame = function (gameId) {
                var _this = this;
                this._Resource_game.delete({ id: gameId }).$promise
                    .then(function (gameData) {
                    _this.newGameData = {};
                    _this.gamePlayers = [];
                    _this.gameCategories = [];
                    _this.gameDifficulty = 'all';
                    _this.gameBoards = [];
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
                    // let gameCategories = allGameCategories.filter(c => { return c.gameId == this.newGameId});
                    gameCategories.forEach(function (gameCategory, i) {
                        var category = _this.allCategories.find(function (c) { return c.id == gameCategory.categoryId; });
                        category.categoryId = gameCategory.id;
                        _this.gameCategories[i] = category;
                    });
                    console.log("Game Categories", _this.gameCategories);
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
            GameService.prototype.addInRandomOrder = function (arrayToAdd, arraySelect, amount) {
                // might be nice to support if fewer in list than amount
                for (var i = 0; i < amount; i++) {
                    var last = arraySelect.length - 1 - i;
                    var randomOne = this.randomInt(0, last);
                    arrayToAdd.push(arraySelect[randomOne]);
                    var temp = arraySelect[randomOne];
                    arraySelect[randomOne] = arraySelect[last];
                    arraySelect[last] = temp;
                }
            };
            // Load all the Qs with a specific Category and Difficulty
            // Store only the question data to play the game
            // Randomize the answer order
            GameService.prototype.loadQsByCatAndDiff = function (cat, diff) {
                return this.QuestionService.getQsByCatAndDiff(cat, diff);
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
                // assign random question to each row & column based on
                // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
                // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
                var numQuestions = 18 / this.gameCategories.length / (this.gameDifficulty == 'all' ? 3 : 1);
                var QsByCatAndDiff = [];
                this.gameCategories.forEach(function (cat) {
                    _this.difficulty.forEach(function (diff) {
                        _this.loadQsByCatAndDiff(cat.longDescription, diff.value).$promise
                            .then(function (questions) {
                            // console.log(`questions`, questions);
                            QsByCatAndDiff.length = 0;
                            questions.forEach(function (q) {
                                var gameQ = new Quizdom.Models.GameBoardModel;
                                gameQ.categoryId = cat.id;
                                gameQ.difficulty = q.difficulty;
                                gameQ.questionId = q.id;
                                gameQ.questionText = q.question;
                                var answers = [];
                                _this.addInRandomOrder(answers, [
                                    { answer: q.correct_Answer, correct: true },
                                    { answer: q.incorrect_Answer1, correct: false },
                                    { answer: q.incorrect_Answer2, correct: false },
                                    { answer: q.incorrect_Answer3, correct: false }
                                ], 4);
                                answers.forEach(function (a, i) {
                                    var parameter = 'answer' + 'ABCD'[i];
                                    gameQ[parameter] = a.answer;
                                    if (a.correct) {
                                        gameQ.correctAnswer = 'ABCD'[i];
                                    }
                                    ;
                                });
                                // console.log(`gameQ`, gameQ);
                                QsByCatAndDiff.push(gameQ);
                            });
                            // console.log(`QsByCatAndDiff`, QsByCatAndDiff);
                            var numQs = (_this.gameDifficulty == 'all' || _this.gameDifficulty == diff.value ? numQuestions : 0);
                            _this.addInRandomOrder(_this.gameBoards, QsByCatAndDiff, numQs);
                        })
                            .catch(function (error) {
                            console.log("error:", error);
                        });
                    });
                });
                console.log("gameBoards:", this.gameBoards);
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
