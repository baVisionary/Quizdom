var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController(
                    // private LoginService: Services.LoginService,
                    // private AvatarService: Services.AvatarService,
                    FriendService, AuthenticationService, $scope, $state) {
                    var _this = this;
                    this.FriendService = FriendService;
                    this.AuthenticationService = AuthenticationService;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.friendEdit = false;
                    this.searchTerm = "";
                    this.feedback = "";
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
                        .then(function () {
                        console.log(_this.FriendService.friends);
                    })
                        .catch(function (error) {
                        _this.feedback = error.data;
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
                    this.FriendService.findByUserName(search)
                        .then(function (found) {
                        console.log(found);
                        if (found) {
                            _this.updateFriends(found);
                        }
                        else {
                            _this.feedback = search + " not found as Username ";
                        }
                    })
                        .catch(function (error) {
                        console.log(error.data);
                        _this.feedback = error.data;
                    });
                    this.FriendService.findByEmail(search)
                        .then(function (found) {
                        console.log(found);
                        if (found) {
                            _this.updateFriends(found);
                        }
                        else {
                            _this.feedback += search + " not found as Email";
                        }
                    })
                        .catch(function (error) {
                        console.log(error.data);
                        _this.feedback += error.data;
                    });
                };
                UserController.prototype.updateFriends = function (newFriend) {
                    var _this = this;
                    this.searchTerm = "";
                    this.FriendService.addFriend(this.AuthenticationService.User.userName, newFriend).$promise
                        .then(function () {
                        _this.FriendService.getMyFriends(_this.AuthenticationService.User.userName);
                    });
                };
                UserController.prototype.deleteFriend = function (friendId) {
                    var _this = this;
                    if (this.editFriends) {
                        this.FriendService.removeFriend(this.AuthenticationService.User.userName, friendId).$promise
                            .then(function () {
                            _this.FriendService.getMyFriends(_this.AuthenticationService.User.userName);
                        });
                    }
                };
                return UserController;
            }());
            UserController.$inject = [
                // 'LoginService',
                // 'AvatarService',
                'FriendService',
                'AuthenticationService',
                '$scope',
                '$state'
            ];
            User.UserController = UserController;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
