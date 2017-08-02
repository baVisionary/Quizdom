var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController(FriendService, AuthenticationService, $state) {
                    var _this = this;
                    this.FriendService = FriendService;
                    this.AuthenticationService = AuthenticationService;
                    this.$state = $state;
                    this.friendEdit = false;
                    this.searchTerm = "";
                    this.feedback = "";
                    this.friendError = "";
                    this.friendSuccess = "";
                    this.tempFriend = new Quizdom.Models.UserModel;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
                        .then(function () {
                        console.log(_this.FriendService.friends);
                    })
                        .catch(function (error) {
                        _this.friendError = error.data;
                    });
                }
                UserController.prototype.editFriends = function () {
                    this.friendEdit = !this.friendEdit;
                    console.log("friendEdit: " + this.friendEdit);
                };
                UserController.prototype.findFriend = function (search) {
                    var _this = this;
                    var found = new Quizdom.Models.UserModel;
                    this.feedback = "";
                    if (this.FriendService.isNewFriend(search)) {
                        this.FriendService.findByUserName(search)
                            .then(function (found) {
                            // Need to confirm that 204 not returned or 200 returned
                            console.log(found.hasOwnProperty('userName'));
                            if (found.hasOwnProperty('userName')) {
                                _this.updateFriends(found);
                                return found;
                            }
                            else {
                                _this.FriendService.findByEmail(search)
                                    .then(function (found) {
                                    console.log(found.hasOwnProperty('userName'));
                                    if (found.hasOwnProperty('userName')) {
                                        _this.updateFriends(found);
                                        return found;
                                    }
                                    _this.feedback = search + " not found as Username or Email";
                                    return;
                                });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            _this.feedback = error.status + ": " + error.statusText;
                            return;
                        });
                    }
                    else {
                        this.searchTerm = "";
                        this.feedback = search + " is already a friend";
                        return;
                    }
                };
                UserController.prototype.updateFriends = function (newFriend) {
                    var _this = this;
                    this.searchTerm = "";
                    this.FriendService.addFriend(this.AuthenticationService.User.userName, newFriend)
                        .then(function (response) {
                        console.log(response);
                        newFriend.friendId = response.id;
                        console.log(newFriend);
                        _this.FriendService.friends.push(newFriend);
                        console.log(_this.FriendService.friends);
                    })
                        .catch(function () {
                    });
                };
                UserController.prototype.deleteFriend = function (friendId) {
                    var _this = this;
                    if (this.editFriends) {
                        this.FriendService.removeFriend(this.AuthenticationService.User.userName, friendId).$promise
                            .then(function () {
                            var oldFriendIndex = _this.FriendService.friends.findIndex(function (f) { return f.friendId == friendId; });
                            if (oldFriendIndex >= 0) {
                                console.log(oldFriendIndex);
                                _this.FriendService.friends.splice(oldFriendIndex, 1);
                                console.log("Deleted friendId: " + friendId);
                            }
                        })
                            .catch(function () {
                        });
                    }
                };
                UserController.$inject = [
                    'FriendService',
                    'AuthenticationService',
                    '$state'
                ];
                return UserController;
            }());
            User.UserController = UserController;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
