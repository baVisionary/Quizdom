// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var GameService = (function () {
            function GameService(AuthenticationService, $resource) {
                this.AuthenticationService = AuthenticationService;
                this.$resource = $resource;
                // manage 'Games' table
                this._Resource_game = this.$resource('/api/game/:gameId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
                // manage 'GameCategories' - lists the categories selected for each gameId
                this._Resource_game_categories = this.$resource('/api/gamecategories/:id', null, {
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
            }
            GameService.$inject = [
                'AuthenticationService',
                '$resource'
            ];
            return GameService;
        }());

        Services.GameService = GameService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
