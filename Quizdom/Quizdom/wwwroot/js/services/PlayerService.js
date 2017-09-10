var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var PlayerService = (function () {
            function PlayerService($resource) {
                this.$resource = $resource;
                this.friends = [];
                this._Resource_find_player = this.$resource('/api/Account/:verb');
                this._Resource_player_stats = this.$resource('/api/game/:gameId', null, {
                    'update': {
                        method: 'PUT'
                    }
                });
            }
            PlayerService.prototype.findByEmail = function (email) {
                this.newFriend = this._Resource_find_player.get({ verb: 'searchuserbyemail', email: email });
                return this.newFriend.$promise;
            };
            PlayerService.prototype.findByUserName = function (userName) {
                this.newFriend = this._Resource_find_player.get({ verb: 'searchuserbyname', userName: userName });
                return this.newFriend.$promise;
            };
            PlayerService.$inject = [
                '$resource'
            ];
            return PlayerService;
        }());
        Services.PlayerService = PlayerService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
