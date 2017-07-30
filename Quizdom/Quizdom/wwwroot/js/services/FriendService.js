var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var FriendService = (function () {
            function FriendService($resource, AvatarService) {
                this.$resource = $resource;
                this.AvatarService = AvatarService;
                this.friends = [];
                this.friendsById = [];
                this._Resource_find_friends = this.$resource('/api/Account/:verb');
                this._Resource_friend = this.$resource('/api/game/friends/:friendId');
                this._Resource_friendsById = this.$resource('/api/game/friends/primaryusername/:userName');
            }
            FriendService.prototype.getMyFriends = function (userName) {
                this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
                this.friendsById = this._Resource_friendsById.query({ userName: userName });
                // console.log(this.friends);
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
                this.newFriend = this._Resource_find_friends.get({ verb: 'searchuserbyemail', email: email });
                return this.newFriend.$promise;
            };
            FriendService.prototype.findByUserName = function (userName) {
                this.newFriend = this._Resource_find_friends.get({ verb: 'searchuserbyname', userName: userName });
                return this.newFriend.$promise;
            };
            FriendService.prototype.addFriend = function (primaryUserName, friendUser) {
                return this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friendUser.userName });
            };
            FriendService.prototype.isNewFriend = function (search) {
                if (this.friends.length > 0) {
                    this.friends.findIndex();
                }
            };
            FriendService.prototype.removeFriend = function (primaryUserName, friendId) {
                console.log("Deleting friendId: " + friendId);
                return this._Resource_friend.remove({ friendId: friendId });
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
