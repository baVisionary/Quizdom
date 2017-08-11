// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var GameService = (function () {
            function GameService(PlayerService, $resource, $q) {
                this.PlayerService = PlayerService;
                this.$resource = $resource;
                this.$q = $q;
                this.players = [];
                this.gameCategories = [];
                this.allCategories = [];
                this.allGames = [];
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
                this.getAllGames();
                this.getAllCats();
            }
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
                var lastGame = this.findLastGame(user);
                lastGame.$promise
                    .then(function () {
                    // console.log(`lastGame`, lastGame);
                    if (lastGame.hasOwnProperty('initiatorUserId')) {
                        _this.newGameData = lastGame;
                        console.log("newGameData", _this.newGameData);
                        _this.loadPlayers(user)
                            .then(function () {
                        })
                            .catch(function (error) {
                            console.log("Error:", error);
                        });
                        _this.loadGameCategories();
                        return true;
                    }
                    var newGame = _this._Resource_game.save({ initiatorUserId: user.userName });
                    newGame.$promise
                        .then(function (game) {
                        // this.newGameData = newGame;
                        _this.newGameData = _this._Resource_game.get({ gameId: game.id });
                        _this.newGameData.$promise
                            .then(function () {
                            console.log("newGameData", _this.newGameData);
                            _this.loadPlayers(user);
                            return true;
                        });
                    });
                })
                    .catch(function (error) {
                    console.log(error);
                    return false;
                });
                return false;
            };
            GameService.prototype.getAllGames = function () {
                var _this = this;
                this._Resource_game.query().$promise
                    .then(function (games) {
                    _this.allGames = games;
                    console.log("Games:", _this.allGames);
                    return true;
                })
                    .catch(function (error) {
                    console.log(error);
                    return false;
                });
                return false;
            };
            // Show the gamecategories assigned to the current gameId
            GameService.prototype.loadGameCategories = function () {
                var _this = this;
                this._Resource_game_categories.query({ id: this.newGameId }).$promise
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
            // Show the players assigned to the current gameId
            GameService.prototype.loadPlayers = function (user) {
                var _this = this;
                return this._Resource_game_players.query({ id: this.newGameId }).$promise
                    .then(function (players) {
                    // console.log(`players`, players);
                    if (players.length == 0) {
                        _this.addPlayer(_this.newGameId, user, true);
                    }
                    else {
                        players.forEach(function (p, i) {
                            // console.log(`p.userId`, p.userId);
                            _this.PlayerService.findByUserName(p.userId)
                                .then(function (player) {
                                player.playerId = p.id;
                                _this.players[i] = player;
                            });
                        });
                    }
                    console.log("this.players", _this.players);
                });
            };
            // Add player who is registered
            GameService.prototype.addPlayer = function (gameId, user, initiator) {
                var _this = this;
                if (this.players.length < 3 && this.players.findIndex(function (p) { return p.userName == user.userName; }) == -1) {
                    var player = new this._Resource_game_players;
                    player.gameId = gameId;
                    player.userId = user.userName;
                    player.initiator = initiator;
                    player.$save(function (player) {
                        user.playerId = player.id;
                        _this.players.push(user);
                        console.log("players", _this.players);
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
            GameService.$inject = [
                'PlayerService',
                '$resource',
                '$q'
            ];
            return GameService;
        }());
        Services.GameService = GameService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
