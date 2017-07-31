var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var FriendService = (function () {
            function FriendService(AvatarService, AuthenticationService, $resource) {
                this.AvatarService = AvatarService;
                this.AuthenticationService = AuthenticationService;
                this.$resource = $resource;
                this.friends = [];
                this._Resource_find_friends = this.$resource('/api/Account/:verb');
                this._Resource_friend = this.$resource('/api/game/friends/:friendId');
                this._Resource_friendId = this.$resource('/api/game/friends/primaryusername/:primaryUserName/friendusername/:friendUserName');
            }
            FriendService.prototype.getMyFriends = function (userName) {
                this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
                // this.friendsById = this._Resource_friendsById.query({ userName: userName });
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
            FriendService.prototype.addFriend = function (primaryUserName, friend) {
                return this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friend.userName });
            };
            FriendService.prototype.newFriendId = function (primaryUserName, friend) {
                return this._Resource_friendId.query({ primaryUserName: primaryUserName, friendUserName: friend.userName });
            };
            // check whether newly seaerched friend is already listed
            FriendService.prototype.isNewFriend = function (search) {
                // check if search refers to self
                var upperSearch = search.toUpperCase();
                // console.log(upperSearch);
                var myUserName = this.AuthenticationService.User.userName.toUpperCase() == upperSearch;
                var myEmail = this.AuthenticationService.User.email.toUpperCase() == upperSearch;
                var friendUserName = false;
                var friendEmail = false;
                // check if search is already a friend
                friendUserName = this.friends.findIndex(function (f) {
                    // console.log(f.userName.toUpperCase());
                    return f.userName.toUpperCase() == upperSearch;
                }) >= 0;
                friendEmail = this.friends.findIndex(function (f) {
                    // console.log(`${f.email.toUpperCase()} `);
                    return f.email.toUpperCase() == upperSearch;
                }) >= 0;
                console.log(search + " is myUserName: " + myUserName + " myEmail: " + myEmail + " friendUserName: " + friendUserName + " friendEmail: " + friendEmail);
                if (myUserName || myEmail || friendUserName || friendEmail) {
                    return false;
                }
                return true;
            };
            FriendService.prototype.removeFriend = function (primaryUserName, friendId) {
                return this._Resource_friend.remove({ friendId: friendId });
            };
            FriendService.$inject = [
                'AvatarService',
                'AuthenticationService',
                '$resource'
            ];
            return FriendService;
        }());
        Services.FriendService = FriendService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
