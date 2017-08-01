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
                this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
                console.log(this.friends);
                // .$promise.then((friends) => {
                //   this.friends = friends;
                //   this.friends.forEach(friend => {
                //     friend.avatarUrl = this.AvatarService.getAvatarUrl(friend.avatarId);
                //     console.log(friend);
                //   });
                // });
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
            FriendService.$inject = [
                '$resource',
                'AvatarService'
            ];
            return FriendService;
        }());
        Services.FriendService = FriendService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
