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
                // private allGames: any[] = [];
                // private questionsByCatDiff: Models.GameBoardModel[] = [];
                this.allCategories = [];
                this.difficulty = [
                    { label: 'Casual', value: 'easy' },
                    { label: 'Engaging', value: 'medium' },
                    { label: 'Brain bending!', value: 'hard' }
                ];
                this.newGameData = new Quizdom.Models.GameModel;
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
                this._Resource_gameBoard = this.$resource('api/game/board/:id', null, {
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
                var _this = this;
                if (this.allCategories.length == 0) {
                    this.allCategories = this._Resource_categories.query();
                    return this.allCategories.$promise;
                }
                else {
                    var categories = new Promise(function (res) {
                        res(_this.allCategories);
                    });
                    return categories;
                }
            };
            // Should we limit each user to initiating only one game (and replace any other games?)
            GameService.prototype.findLastGame = function (user) {
                return this._Resource_game.search({ username: user.userName });
            };
            Object.defineProperty(GameService.prototype, "gameId", {
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
            GameService.prototype.loadMyGameData = function (user) {
                var _this = this;
                var myGameLoaded = new Promise(function (res, err) {
                    _this.findLastGame(user).$promise
                        .then(function (lastGame) {
                        // console.log(`lastGame`, lastGame);
                        if (lastGame.hasOwnProperty('initiatorUserId')) {
                            _this.newGameData = lastGame;
                            console.log("newGameData", _this.newGameData);
                            res(_this.newGameData);
                        }
                        else {
                            var newGame = new Quizdom.Models.GameModel;
                            newGame.initiatorUserId = user.userName;
                            _this._Resource_game.save(newGame).$promise
                                .then(function (newGame) {
                                // console.log(`newGame`, newGame);
                                _this.newGameData.id = newGame.id;
                                console.log("newGameData", _this.newGameData);
                                res(true);
                            })
                                .catch(function (error) {
                                console.log(error);
                            });
                        }
                    });
                });
                return myGameLoaded;
            };
            GameService.prototype.loadGame = function (gameId) {
                var _this = this;
                var gameLoaded = this.$q.when();
                gameLoaded = gameLoaded.then(function () {
                    _this.newGameData = _this._Resource_game.get({ gameId: gameId });
                    _this.newGameData.$promise
                        .then;
                });
                var gamePromises = [];
                gamePromises.push(this.gamePlayers.length = this.gameCategories.length = this.gameBoards.length = 0);
                gamePromises.push(this.loadGamePlayers(Quizdom.Models.UserModel.getAnonymousUser()));
                gamePromises.push(this.loadGameCategories(gameId));
                gamePromises.push(this.loadGameBoards(gameId));
                gameLoaded = gameLoaded.then(function () {
                    gamePromises;
                });
                this.$q.when(gameLoaded).then(function () {
                    console.log("Game loaded");
                });
            };
            GameService.prototype.destroyGame = function () {
                var _this = this;
                this._Resource_game.remove({ gameId: this.gameId }).$promise
                    .then(function (gameData) {
                    _this.newGameData = new Quizdom.Models.GameModel;
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
            GameService.prototype.loadGamePlayers = function (user) {
                var _this = this;
                var gamePlayersLoaded = new Promise(function (res, err) {
                    _this.gamePlayers.length = 0;
                    _this._Resource_game_players.query({ id: _this.gameId }).$promise
                        .then(function (players) {
                        // console.log(`players`, players);
                        if (players.length == 0) {
                            _this.addPlayer(_this.gameId, user, true);
                            console.log("Game Players", _this.gamePlayers);
                        }
                        else {
                            players.forEach(function (p, i) {
                                // console.log(`p.userId`, p.userId);
                                _this.PlayerService.findByUserName(p.userId)
                                    .then(function (player) {
                                    player.playerId = p.id;
                                    _this.gamePlayers.push(player);
                                });
                            });
                            console.log("Game Players", _this.gamePlayers);
                            res(_this.gamePlayers);
                        }
                    })
                        .catch(function (error) {
                        console.log("error", error);
                        err(error);
                    });
                });
                return gamePlayersLoaded;
            };
            // Show the gamecategories assigned to the current gameId
            GameService.prototype.loadGameCategories = function (gameId) {
                var _this = this;
                console.log("gameId", gameId);
                var gameCategoriesLoaded = new Promise(function (res, err) {
                    // this.gameCategories = [];
                    // console.log(`Set gameCategories to []`);
                    _this._Resource_game_categories.query({ id: gameId }).$promise
                        .then(function (gameCategories) {
                        gameCategories.forEach(function (gameCategory, i) {
                            var category = _this.allCategories.find(function (c) { return c.id == gameCategory.categoryId; });
                            category.categoryId = gameCategory.id;
                            _this.gameCategories.push(category);
                        });
                        console.log("Game Categories", _this.gameCategories);
                        // set the proper width of the category labels using ng-class "col sX"
                        _this.gameCatClass = 'col s' + (12 / _this.gameCategories.length).toString();
                        res(_this.gameCategories);
                    });
                });
                return gameCategoriesLoaded;
            };
            // Show the gameBoards assigned to the current gameId
            GameService.prototype.loadGameBoards = function (gameId) {
                var _this = this;
                var gameBoardsLoaded = new Promise(function (res, err) {
                    _this._Resource_gameBoard.query({ id: gameId }).$promise
                        .then(function (gameBoards) {
                        gameBoards.forEach(function (gameBoard) {
                            _this.gameBoards.push(gameBoard);
                        });
                        console.log("Game Boards", _this.gameBoards);
                        res(_this.gameBoards);
                    })
                        .catch(function (error) {
                        console.log("Unable to load Gameboard");
                        err(error);
                    });
                });
                return gameBoardsLoaded;
            };
            // Add player who is registered
            GameService.prototype.addPlayer = function (gameId, user, initiator) {
                var _this = this;
                var playerAdded = new Promise(function (res, err) {
                    if (_this.gamePlayers.length < 3 && _this.gamePlayers.findIndex(function (p) { return p.userName == user.userName; }) == -1) {
                        var player = new _this._Resource_game_players;
                        player.gameId = gameId;
                        player.userId = user.userName;
                        player.initiator = initiator;
                        player.$save(function (player) {
                            user.id = player.id;
                            _this.gamePlayers.push(user);
                            console.log("players", _this.gamePlayers);
                            res(true);
                        })
                            .catch(function (error) {
                            console.log("Player not saved to database");
                            err(error);
                        });
                    }
                });
                return playerAdded;
            };
            GameService.prototype.saveGamePlayers = function (gameId) {
                var _this = this;
                var gamePlayersSaved = new Promise(function (res, err) {
                    _this.gamePlayers.forEach(function (player) {
                    });
                });
                return gamePlayersSaved;
            };
            GameService.prototype.removePlayer = function (playerId) {
                var _this = this;
                if (this.gamePlayers.length > 1) {
                    console.log("Deleting playerId:", playerId);
                    this._Resource_game_players.delete({ id: playerId }).$promise
                        .then(function () {
                        _this.gamePlayers.splice(_this.gamePlayers.findIndex(function (p) { return p.id == playerId; }), 1);
                    });
                }
            };
            GameService.prototype.addCategory = function (category) {
                var _this = this;
                var categoryAdded = new Promise(function (res, err) {
                    if (_this.gameCategories.length < 3 && _this.gameCategories.findIndex(function (c) { return c.shortDescription == category.shortDescription; }) == -1) {
                        var newGameCat = new _this._Resource_game_categories;
                        newGameCat.gameId = _this.gameId;
                        newGameCat.categoryId = category.id;
                        console.log("newGameCat", newGameCat);
                        newGameCat.$save(function (cat) {
                            category.categoryId = cat.id;
                            _this.gameCategories.push(category);
                            console.log("Categories", _this.gameCategories);
                            res(_this.gameCategories);
                        });
                    }
                });
                return categoryAdded;
            };
            GameService.prototype.removeCategory = function (categoryId) {
                var _this = this;
                var categoryRemoved = new Promise(function (res, err) {
                    if (_this.gameCategories.length > 0) {
                        console.log("Deleting game category:", categoryId);
                        _this._Resource_game_categories.delete({ id: categoryId }).$promise
                            .then(function () {
                            _this.gameCategories.splice(_this.gameCategories.findIndex(function (c) { return c.categoryId == categoryId; }), 1);
                            res(_this.gameCategories);
                        });
                    }
                });
                return categoryRemoved;
            };
            // select random items from arraySelect and add to arrayToAdd
            GameService.prototype.addInRandomOrder = function (arrayToAdd, arraySelect, wanted) {
                var _this = this;
                var arrayShuffled = new Promise(function (res, err) {
                    // might be nice to support if fewer in list than amount
                    // if arraySelect.length < amount then randomize arraySelect.length repeatedly until amount reached
                    if (arraySelect.length == 0) {
                        var error = "No items to shuffle";
                        console.log(error);
                        err(error);
                    }
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
                return arrayShuffled;
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
                        gameBoard.gameId = _this.gameId;
                        gameBoard.categoryId = q.categoryId;
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
                        return _this._Resource_gameBoard.save(gameBoard).$promise
                            .then(function (data) {
                            // console.log(`data`, data);
                            gameBoard.id = data.id;
                            _this.gameBoards.push(gameBoard);
                        });
                    });
                    res(_this.gameBoards);
                });
                return gameBoardPromise;
            };
            GameService.prototype.loadNewGameBoards = function (cat, diff) {
                var _this = this;
                var promiseGameBoard = new Promise(function (res, err) {
                    _this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
                        .then(function (questions) {
                        console.log(cat.shortDescription + " " + diff.value + " Qs: " + questions.length);
                        if (questions.length > 0) {
                            var prizePoints = [100, 200, 300][_this.difficulty.findIndex(function (d) { return d.value == diff.value; })];
                            _this.parseQuizToGameBoard(cat, questions, prizePoints)
                                .then();
                            // console.log(`gameBoards:`, this.gameBoards);
                            res(true);
                        }
                        else {
                            var error = "No questions in " + cat.longDescription + " - " + diff.title;
                            console.log("error");
                            err();
                        }
                    });
                });
                return promiseGameBoard;
            };
            // ensure all old GameBoards are 
            GameService.prototype.removeAllGameBoards = function (gameId) {
                var _this = this;
                var gameBoardsRemoved = new Promise(function (res, err) {
                    var allGameBoards = _this._Resource_gameBoard.query();
                    allGameBoards.$promise
                        .then(function () {
                        var gameBoards = allGameBoards.filter(function (g) { return g.gameId == gameId; });
                        gameBoards.forEach(function (g) {
                            _this._Resource_gameBoard.remove({ id: g.id });
                        });
                        console.log("Removed old Gameboards");
                        res(true);
                    });
                });
                return gameBoardsRemoved;
            };
            // Build the game board using the categories
            GameService.prototype.setupGameBoards = function () {
                var _this = this;
                console.log("Creating GameBoards");
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
                gamePromises = gamePromises.then(function () {
                    return _this.removeAllGameBoards(_this.gameId);
                });
                this.gameCategories.forEach(function (cat) {
                    _this.difficulty.forEach(function (diff) {
                        if (_this.gameDifficulty == 'all' || _this.gameDifficulty == diff.value) {
                            gamePromises = gamePromises.then(function () {
                                console.log("Loading new Gameboards...");
                                return _this.loadNewGameBoards(cat, diff);
                            });
                        }
                    });
                });
                this.$q.when(gamePromises)
                    .then(function () {
                    console.log("this.gameBoards", _this.gameBoards);
                })
                    .catch(function (error) {
                    console.log("Failed to load Gameboard");
                });
                return gamePromises;
            };
            // SignalR methods update gameBoard to trigger server
            GameService.prototype.updateGameBoard = function (gameBoard) {
                return this._Resource_gameBoard.update({ id: gameBoard.id }, gameBoard);
            };
            // SignalR methods update gameBoard to trigger server
            GameService.prototype.updateGamePlayer = function (gamePlayer) {
                return this._Resource_game_players.update({ id: gamePlayer.id }, gamePlayer);
            };
            // research into how to use promise resolution to delay for loop action - SUCCESS!
            GameService.prototype.testLoopPromise = function (loops) {
                var _this = this;
                var loopPromises = this.$q.when();
                var _loop_1 = function () {
                    // values that are dependent on the loop
                    var loop = 'Loop ' + i;
                    // the stuff that will take time
                    loopPromises = loopPromises.then(function () {
                        return new Promise(function (res) {
                            console.log(loop);
                            // just to visibly count the seconds
                            var tick = 0;
                            var timer = setInterval(function () {
                                tick++;
                                console.log("..." + tick);
                            }, 1000);
                            // mimics API delay
                            var delay = _this.randomInt(1, 5);
                            setTimeout(function () {
                                clearInterval(timer);
                                console.log("Complete after " + delay + " seconds");
                                res("Success");
                            }, delay * 1000);
                        });
                    });
                };
                // setup the looping behavior
                for (var i = 0; i < loops; i++) {
                    _loop_1();
                }
                // stasting the action
                console.log("Starting loop");
                this.$q.when(loopPromises)
                    .then(function () {
                    // when all are complete!
                    console.log("All loops complete!");
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
