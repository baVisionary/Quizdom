var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var FriendService = (function () {
            function FriendService($resource, AvatarService) {
                this.$resource = $resource;
                this.AvatarService = AvatarService;
                this.friends = [];
                this.friendsId = [];
                this._Resource_find_friends = this.$resource('/api/Account/:verb');
                this._Resource_friend = this.$resource('/api/game/friends');
            }
            FriendService.prototype.getMyFriends = function (userName) {
                var _this = this;
                if (this.friends.length == 0) {
                    this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName }).$promise.then(function (data) {
                        _this.friends = data;
                        _this.friends.forEach(function (friend) {
                            friend.avatarUrl = _this.AvatarService.getAvatarUrl(friend.avatarId);
                            console.log(friend);
                        });
                    })
                        .catch(function (error) {
                        console.log("Error " + error.status + ": " + error.data);
                    });
                }
                return this.friends;
            };
            FriendService.prototype.findByEmail = function (email) {
                this._Resource_find_friends.query({ verb: 'searchuserbyemail', email: email });
            };
            FriendService.prototype.findByUserName = function (userName) {
                this._Resource_find_friends.query({ verb: 'searchuserbyname', userName: userName });
            };
            FriendService.prototype.addFriend = function (primaryUserName, friendUserName) {
                this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friendUserName });
            };
            return FriendService;
        }());
        FriendService.$inject = [
            '$resource',
            'AvatarService'
        ];
        Services.FriendService = FriendService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
