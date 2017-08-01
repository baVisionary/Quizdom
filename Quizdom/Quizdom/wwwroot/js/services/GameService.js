// Game setup and status
// Gathering the game options, managing the game statuas, updating user stats?
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var GameService = (function () {
            function GameService($resource) {
                this.$resource = $resource;
                this._Resource_game = this.$resource('/api/quiz/:gameId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
            }
            GameService.$inject = [
                '$resource'
            ];
            return GameService;
        }());
        Services.GameService = GameService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
