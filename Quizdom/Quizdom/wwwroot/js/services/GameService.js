// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var GameService = (function () {
            function GameService(PlayerService, QuestionService, $resource, $q, $interval, $timeout) {
                this.PlayerService = PlayerService;
                this.QuestionService = QuestionService;
                this.$resource = $resource;
                this.$q = $q;
                this.$interval = $interval;
                this.$timeout = $timeout;
                // variables to setup new game
                this.allCategories = [];
                this.difficulty = [
                    { label: 'Casual', value: 'easy' },
                    { label: 'Engaging', value: 'medium' },
                    { label: 'Brain bending!', value: 'hard' }
                ];
                this.gameDifficulty = 'all';
                this.numQuestions = 0;
                this.row = 0;
                this.column = 0;
                this.perRow = 6;
                /* variables that define the initial game state */
                this.gameData = new Quizdom.Models.GameModel;
                this.gamePlayerId = 0;
                this.duration = 6 * 1000;
                this.players = [];
                this.gameCategories = [];
                this.gameCatClass = 'col s12';
                this.gameBoards = [];
                /* variables used during gameplay */
                // in game chat support
                this.group = '';
                this.gameChats = [];
                // the order in which questions are selected
                this.answerOrder = 0;
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
                // manage 'GameMessage' using SignalR during game
                this._Resource_gameMessage = this.$resource('/api/game/gamechat/:gameId');
            }
            GameService.prototype.createGroup = function (group) {
                this.group = group;
            };
            Object.defineProperty(GameService.prototype, "groupName", {
                get: function () {
                    return this.group;
                },
                enumerable: true,
                configurable: true
            });
            // SignalR game chat support
            GameService.prototype.getAllGameMsgs = function () {
                return this._Resource_gameMessage.query({ gameId: this.gameId });
            };
            GameService.prototype.postGameMsg = function (gameMsg) {
                return this._Resource_gameMessage.save(gameMsg);
            };
            // simple random function
            GameService.prototype.randomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            // load all categories from DB if empty or local if available
            GameService.prototype.getAllCats = function () {
                var _this = this;
                var allCatLoaded = new Promise(function (res) {
                    if (_this.allCategories.length == 0) {
                        _this._Resource_categories.query().$promise
                            .then(function (categories) {
                            _this.allCategories = categories;
                            // console.log(`All categories`, categories);
                            console.log("All categories loaded");
                            res("All categories loaded");
                        });
                    }
                    else {
                        console.log("All categories already loaded");
                        res("All categories already loaded");
                    }
                    ;
                });
                return allCatLoaded;
            };
            Object.defineProperty(GameService.prototype, "gameId", {
                // shorthand to access gameId
                get: function () {
                    return this.gameData.id;
                },
                enumerable: true,
                configurable: true
            });
            GameService.prototype.isActive = function (userName) {
                return userName == this.gameData.activeUserId;
            };
            GameService.prototype.getGameMessages = function () {
                var _this = this;
                this.getAllGameMsgs().$promise
                    .then(function (messages) {
                    // console.log(`messages`, messages);
                    _this.addGameMsgList(messages);
                });
            };
            GameService.prototype.addGameMsgList = function (posts) {
                var _this = this;
                this.gameChats.length = 0;
                posts.forEach(function (post) {
                    _this.gameChats.push(post);
                });
                this.gameChats.sort(function (a, b) { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1; });
                // console.log(this.posts);
            };
            // Should we limit each user to initiating only one game (and replace any other games?)
            GameService.prototype.findLastGame = function (user) {
                return this._Resource_game.search({ username: user.userName });
            };
            GameService.prototype.loadNewGameData = function (gameId) {
                var _this = this;
                var newGameLoaded = new Promise(function (res) {
                    _this.gameData = _this._Resource_game.get({ gameId: gameId });
                    _this.gameData.$promise
                        .then(function () {
                        _this.gameData.gameState = "welcome";
                        _this.gameData.$update;
                        res('New game loaded to local model');
                    });
                });
                return newGameLoaded;
            };
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
                            _this.gameData = lastGame;
                            res("Previous game loaded");
                        }
                        else {
                            var newGame = new Quizdom.Models.GameModel;
                            newGame.initiatorUserId = user.userName;
                            _this._Resource_game.save(newGame).$promise
                                .then(function (newGame) {
                                // console.log(`newGame`, newGame);
                                _this.gameData.id = newGame.id;
                                res('New game created');
                            })
                                .catch(function (error) {
                                console.log(error);
                            });
                        }
                    });
                });
                return myGameLoaded;
            };
            Object.defineProperty(GameService.prototype, "myGamePlayerId", {
                get: function () {
                    return this.gamePlayerId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameService.prototype, "gameState", {
                get: function () {
                    return this.gameData.gameState;
                },
                enumerable: true,
                configurable: true
            });
            // Load all game data from DB based on given gameId (allows other players to load new game)
            GameService.prototype.loadGame = function (gameId) {
                var _this = this;
                var gameLoaded = this.$q.when();
                gameLoaded = gameLoaded.then(function () {
                    return new Promise(function (resCats) {
                        _this.getAllCats().then(function (message) {
                            resCats(message);
                        });
                    });
                });
                var gameTablesLoaded = [];
                gameTablesLoaded.push(this.loadNewGameData(gameId));
                gameTablesLoaded.push(this.loadGameCategories(gameId));
                gameTablesLoaded.push(this.loadPlayers(gameId));
                gameTablesLoaded.push(this.loadGameBoards(gameId));
                gameLoaded = gameLoaded.then(function () {
                    return _this.$q.all(gameTablesLoaded);
                });
                this.$q.when(gameLoaded).then(function () {
                    // console.log(`Game`, this.newGameData);
                    console.log("Game " + _this.gameId + " fully loaded", _this.gameData);
                })
                    .catch(function (errors) {
                    console.log("It was bad, dude");
                    console.log("errors", errors);
                });
                return gameLoaded;
            };
            GameService.prototype.destroyGame = function () {
                var _this = this;
                this._Resource_game.remove({ gameId: this.gameId }).$promise
                    .then(function (gameData) {
                    _this.gameData = new Quizdom.Models.GameModel;
                    _this.players = [];
                    _this.gameCategories = [];
                    _this.gameDifficulty = 'all';
                    _this.gameBoards.length = 0;
                })
                    .catch(function (error) {
                    console.log("error", error);
                });
            };
            // Show the players assigned to the current gameId
            GameService.prototype.loadPlayers = function (gameId) {
                var _this = this;
                var gamePlayersLoaded = new Promise(function (resAll) {
                    _this.players.length = 0;
                    var gamePlayersPromises = _this.$q.when();
                    gamePlayersPromises = gamePlayersPromises.then(function () {
                        return new Promise(function (resPlayers) {
                            _this._Resource_game_players.query({ id: gameId }).$promise
                                .then(function (gameplayers) {
                                resPlayers('Players loaded from DB');
                                gameplayers.forEach(function (gp) {
                                    gamePlayersPromises = gamePlayersPromises.then(function () {
                                        return new Promise(function (resLoop) {
                                            _this.PlayerService.findByUserName(gp.userId)
                                                .then(function (p) {
                                                var player = new Quizdom.Models.PlayerModel(p, gp);
                                                // console.log(`Player ${p.userName} added`);
                                                _this.players.push(player);
                                                resLoop('Player added');
                                            });
                                        });
                                    });
                                });
                                _this.$q.when(gamePlayersPromises)
                                    .then(function () {
                                    console.log("Game Players", _this.players);
                                    resAll("Game players loaded to local model");
                                });
                            });
                        });
                    });
                    return gamePlayersPromises;
                });
                return gamePlayersLoaded;
            };
            // Show the gamecategories assigned to the current gameId
            GameService.prototype.loadGameCategories = function (gameId) {
                var _this = this;
                var gameCategoriesLoaded = new Promise(function (resAll) {
                    var gameCategoriesPromises = _this.$q.when();
                    gameCategoriesPromises = gameCategoriesPromises.then(function () {
                        return new Promise(function (resDelete, err) {
                            _this.gameCategories.length = 0;
                            resDelete("Local Game Categories deleted");
                        });
                    });
                    gameCategoriesPromises = gameCategoriesPromises.then(function () {
                        return new Promise(function (resData, err) {
                            _this._Resource_game_categories.query({ id: gameId }).$promise
                                .then(function (gameCats) {
                                resData("Game category data loaded from table");
                                gameCats.forEach(function (oneCat) {
                                    gameCategoriesPromises = gameCategoriesPromises.then(function () {
                                        return new Promise(function (resGameCat, err) {
                                            var gameCategory = _this.allCategories.find(function (cat) { return cat.id == oneCat.categoryId; });
                                            gameCategory.gameCategoryId = oneCat.id;
                                            gameCategory.categoryId = oneCat.categoryId;
                                            _this.gameCategories.push(gameCategory);
                                            resGameCat("Another game category loaded");
                                        });
                                    });
                                });
                                _this.$q.when(gameCategoriesPromises).then(function () {
                                    // set the proper width of the category labels using ng-class "col sX"
                                    _this.gameCatClass = 'col s' + (12 / _this.gameCategories.length).toString();
                                    console.log("Game Categories", _this.gameCategories);
                                    resAll("Game Categories loaded");
                                });
                            });
                        });
                    });
                    return gameCategoriesPromises;
                });
                return gameCategoriesLoaded;
            };
            // Show the gameBoards assigned to the current gameId
            GameService.prototype.loadGameBoards = function (gameId) {
                var _this = this;
                var gameBoardsLoaded = new Promise(function (resAll) {
                    var gameBoardsPromises = _this.$q.when();
                    gameBoardsPromises = gameBoardsPromises.then(function () {
                        return new Promise(function (resData, err) {
                            _this._Resource_gameBoard.query({ id: gameId }).$promise
                                .then(function (gameBoards) {
                                resData("Game board data loaded from table");
                                gameBoards.forEach(function (gameBoard) {
                                    gameBoardsPromises = gameBoardsPromises.then(function () {
                                        return new Promise(function (resBoard, err) {
                                            var cat = _this.allCategories.find(function (cat) { return cat.id == gameBoard.categoryId; });
                                            gameBoard.catLong = cat.longDescription;
                                            _this.gameBoards.push(gameBoard);
                                            resBoard("Another gameBoard loaded");
                                        });
                                    });
                                });
                                _this.gameBoards.length = 0;
                                console.log("Local Game Boards deleted");
                                _this.$q.when(gameBoardsPromises)
                                    .then(function () {
                                    console.log("Game Boards", _this.gameBoards);
                                    resAll("Game Boards loaded");
                                })
                                    .catch(function (error) {
                                    console.log("Unable to load Gameboard");
                                    err(error);
                                });
                            });
                        });
                    });
                    return gameBoardsPromises;
                });
                return gameBoardsLoaded;
            };
            // Add player who is registered
            GameService.prototype.addPlayer = function (gameId, user, initiator) {
                var _this = this;
                var playerAdded = new Promise(function (res, err) {
                    var gamePlayer = new Quizdom.Models.GamePlayerModel;
                    if (_this.players.length < 3 && _this.players.findIndex(function (p) { return p.userName == user.userName; }) == -1) {
                        gamePlayer.gameId = gameId;
                        gamePlayer.userId = user.userName;
                        gamePlayer.initiator = initiator;
                        // player.prizePoints = 0;
                        _this._Resource_game_players.save(gamePlayer).$promise
                            .then(function (gp) {
                            // console.log(`data`, gp);
                            gamePlayer.id = gp.id;
                            var player = new Quizdom.Models.PlayerModel(user, gamePlayer);
                            console.log("Player " + player.userName + " added", player);
                            _this.players.push(player);
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
                    _this.players.forEach(function (player) {
                    });
                });
                return gamePlayersSaved;
            };
            GameService.prototype.removePlayer = function (playerId) {
                var _this = this;
                if (this.players.length > 1) {
                    console.log("Deleting playerId:", playerId);
                    this._Resource_game_players.delete({ id: playerId }).$promise
                        .then(function () {
                        _this.players.splice(_this.players.findIndex(function (p) { return p.playerId == playerId; }), 1);
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
                        // console.log(`newGameCat`, newGameCat);
                        newGameCat.$save(function (cat) {
                            category.gameCategoryId = cat.id;
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
                            _this.gameCategories.splice(_this.gameCategories.findIndex(function (c) { return c.gameCategoryId == categoryId; }), 1);
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
                var gameBoardParsed = new Promise(function (resAll, err) {
                    var randomizedQs = [];
                    var gameBoardPromises = _this.$q.when();
                    gameBoardPromises = gameBoardPromises.then(function () {
                        return new Promise(function (resSave) {
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
                                        gameBoard.correctAnswer = i;
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
                                    resSave(_this.gameBoards);
                                });
                            });
                        });
                    });
                    _this.$q.when(gameBoardPromises).then(function () {
                        console.log("Cat & Diff Game Boards selected");
                        resAll("Cat & Diff Game Boards selected");
                    });
                });
                return gameBoardParsed;
            };
            // 
            GameService.prototype.loadNewGameBoards = function (cat, diff) {
                var _this = this;
                var newGameBoardsLoaded = new Promise(function (resAll, err) {
                    var newGameBoardsPromises = _this.$q.when();
                    newGameBoardsPromises = newGameBoardsPromises.then(function () {
                        return new Promise(function (resGet) {
                            _this.QuestionService.getQsByCatAndDiff(cat.longDescription, diff.value).$promise
                                .then(function (questions) {
                                console.log(cat.shortDescription + " " + diff.value + " Qs: " + questions.length);
                                resGet("Found Qs by Cat & Diff");
                                if (questions.length > 0) {
                                    var prizePoints_1 = [100, 200, 300][_this.difficulty.findIndex(function (d) { return d.value == diff.value; })];
                                    newGameBoardsPromises = newGameBoardsPromises.then(function () {
                                        return new Promise(function (resParse) {
                                            _this.parseQuizToGameBoard(cat, questions, prizePoints_1).then(function () {
                                                // console.log(`gameBoards:`, this.gameBoards);
                                                resParse("Cat & Diff Qs assigned to Game Boards");
                                            });
                                        });
                                    });
                                }
                                else {
                                    var error = "No questions in " + cat.longDescription + " - " + diff.title;
                                    console.log("error");
                                    err("No questions to load");
                                }
                            });
                        });
                    });
                    _this.$q.when(newGameBoardsPromises).then(function () {
                        // console.log(`New Game Boards loaded`, );
                        resAll("New Game Boards loaded");
                    });
                });
                return newGameBoardsLoaded;
            };
            // ensure all old GameBoards are deleted from table
            GameService.prototype.removeAllGameBoards = function (gameId) {
                var _this = this;
                var gameBoardsRemoved = new Promise(function (resAll) {
                    // this.gameBoards.length = 0;        
                    var gameBoardsPromises = _this.$q.when();
                    gameBoardsPromises = gameBoardsPromises.then(function () {
                        return new Promise(function (resData, err) {
                            _this._Resource_gameBoard.query({ id: gameId }).$promise
                                .then(function (gameBoards) {
                                resData("Game Boards loaded from DB");
                                gameBoards.forEach(function (g) {
                                    gameBoardsPromises = gameBoardsPromises.then(function () {
                                        return new Promise(function (resDelete, err) {
                                            _this._Resource_gameBoard.remove({ id: g.id }).$promise
                                                .then(function () {
                                                resDelete("Another Game Board deleted.");
                                            });
                                        });
                                    });
                                });
                                _this.$q.when(gameBoardsPromises)
                                    .then(function () {
                                    console.log("DB Game Boards Deleted");
                                    resAll("DB Game Boards Deleted");
                                });
                            });
                        });
                    });
                    return gameBoardsPromises;
                });
                return gameBoardsRemoved;
            };
            // Build the game board using the categories
            GameService.prototype.setupGameBoards = function () {
                var _this = this;
                console.log("Creating GameBoards...");
                this.gameBoards.length = 0;
                console.log("Local Game Boards deleted");
                var gameBoardsSetup = new Promise(function (resAll, err) {
                    if (_this.players.length < 2 || _this.gameCategories.length < 1) {
                        console.log("Unable to setup game - invite players & select categories");
                        err("Unable to setup game");
                    }
                    // line up all the promises to fill the gameBoard
                    var gameBoardPromises = _this.$q.when();
                    gameBoardPromises = gameBoardPromises.then(function () {
                        return new Promise(function (resRemove) {
                            _this.removeAllGameBoards(_this.gameId).then(function () {
                                resRemove("removeAllGameBoards complete");
                            });
                        });
                    });
                    // set the proper width of the category labels using ng-class "col sX"
                    _this.gameCatClass = 'col s' + (12 / _this.gameCategories.length).toString();
                    // assign random question to each row & column based on
                    // categories picked (1 = 18 Qs, 2 = 9 Qs, 3 = 6 Qs)
                    // difficulty (all = 1/3 Qs each, easy/medium/hard = total Qs)
                    _this.numQuestions = 18 / _this.gameCategories.length / (_this.gameDifficulty == 'all' ? 3 : 1);
                    _this.row = 0;
                    _this.column = 0;
                    _this.perRow = 6 / _this.gameCategories.length;
                    _this.gameCategories.forEach(function (cat) {
                        _this.difficulty.forEach(function (diff) {
                            if (_this.gameDifficulty == 'all' || _this.gameDifficulty == diff.value) {
                                gameBoardPromises = gameBoardPromises.then(function () {
                                    return new Promise(function (resLoad) {
                                        _this.loadNewGameBoards(cat, diff).then(function () {
                                            resLoad("Another Game Board loaded");
                                        });
                                    });
                                });
                            }
                        });
                    });
                    _this.$q.when(gameBoardPromises).then(function () {
                        console.log("Game Boards setup", _this.gameBoards);
                        resAll("Game Boards setup");
                    });
                });
                return gameBoardsSetup;
            };
            // SignalR methods to update the tables
            GameService.prototype.updateGame = function (newGameData) {
                var _this = this;
                var gameUpdated = new Promise(function (res) {
                    console.log("Updating Game...", newGameData);
                    _this._Resource_game.update({ gameId: newGameData.id }, newGameData).$promise.then(function (gameData) {
                        // TODO - remove once SignalR is triggering the method!
                        // this.changeGameData(gameData);
                        res("Game update sent to DB");
                    });
                });
                return gameUpdated;
            };
            GameService.prototype.updateGameBoard = function (newGameBoardData) {
                var _this = this;
                var gameBoardUpdated = new Promise(function (res) {
                    console.log("Updating Game Board...", newGameBoardData);
                    _this._Resource_gameBoard.update({ id: newGameBoardData.id }, newGameBoardData).$promise.then(function (gameBoardData) {
                        // TODO - remove once SignalR is triggering the method!
                        _this.changeGameBoardData(gameBoardData);
                        res("Game Board update sent to DB");
                    });
                });
                return gameBoardUpdated;
            };
            GameService.prototype.updateGamePlayer = function (newPlayerData) {
                var _this = this;
                var gamePlayerUpdated = new Promise(function (res) {
                    //  we have to whittle player down to gamePlayer properties
                    var newGamePlayer = new _this._Resource_game_players;
                    newGamePlayer.gameId = newPlayerData.gameId;
                    newGamePlayer.id = newPlayerData.playerId;
                    newGamePlayer.initiator = newPlayerData.initiator;
                    newGamePlayer.userId = newPlayerData.userName;
                    newGamePlayer.prizePoints = newPlayerData.prizePoints;
                    newGamePlayer.answer = newPlayerData.answer;
                    newGamePlayer.delay = newPlayerData.delay;
                    console.log("Updating Game Player...", newGamePlayer);
                    _this._Resource_game_players.update({ id: newGamePlayer.id }, newGamePlayer).$promise.then(function (gamePlayerData) {
                        // TODO - remove once SignalR is triggering the method!
                        _this.changeGamePlayerData(gamePlayerData);
                        res("Game Player update sent to DB");
                    });
                });
                return gamePlayerUpdated;
            };
            GameService.prototype.setGameActiveUserId = function (userName) {
                this.gameData.lastActiveUserId = this.gameData.activeUserId;
                this.gameData.activeUserId = userName;
                return this.updateGame(this.gameData);
            };
            // newGameState is triggered by a change to the Games table
            GameService.prototype.changeGameData = function (newGame) {
                // update the values that can change over time
                this.gameData = newGame;
                console.log("Game updated from DB", this.gameData);
                // TODO Add other local variables that should be updated
                switch (this.gameData.gameState) {
                    case "prepare":
                        this.countdownTimer(3).then(function () {
                        });
                        break;
                    default:
                        break;
                }
            };
            // newGameBoardState is triggered by a change to the GameBoard table
            GameService.prototype.changeGameBoardData = function (gameBoardData) {
                // find the local gameBoard data in the array
                var gbIndex = this.gameBoards.findIndex(function (gb) { return gb.id == gameBoardData.id; });
                // update the values that can change over time
                this.gameBoards[gbIndex].questionState = gameBoardData.questionState;
                this.gameBoards[gbIndex].answerOrder = gameBoardData.answerOrder;
                this.gameBoards[gbIndex].answeredCorrectlyUserId = gameBoardData.answeredCorrectlyUserId;
                console.log("Game Board updated from DB", this.gameBoards[gbIndex]);
                // TODO Add other local variables that should be updated
                // assign gameBoard question to local this.question when questionState = "ask"
                this.question = this.gameBoards[gbIndex];
            };
            // newGamePlayerState is triggered by a change to the GamePlayer table
            GameService.prototype.changeGamePlayerData = function (gamePlayerData) {
                // find the local gamePlayer data in the array
                var pIndex = this.players.findIndex(function (p) { return p.playerId == gamePlayerData.id; });
                // update the values that can change over time
                this.players[pIndex].prizePoints = gamePlayerData.prizePoints;
                this.players[pIndex].answer = gamePlayerData.answer;
                this.players[pIndex].delay = gamePlayerData.delay;
                console.log("Game Player updated from DB", this.players[pIndex]);
                // TODO Add other local variables that should be updated
                // Should we track when all players guess so we can cancel the countdown?
            };
            GameService.prototype.countdownTimer = function (duration) {
                var _this = this;
                var decreaseTimer = function () {
                    _this.timer = duration;
                    console.log("duration", duration, "this.timer", _this.timer);
                    duration--;
                    if (duration <= 0) {
                        _this.$interval.cancel(countdown);
                    }
                    ;
                };
                var countdown = this.$interval(decreaseTimer, 1000);
                return countdown;
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
                // starting the action
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
                '$q',
                '$interval',
                '$timeout',
            ];
            return GameService;
        }());
        Services.GameService = GameService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
