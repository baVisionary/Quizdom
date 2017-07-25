var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController(UserService, AvatarService, FriendService, $scope, $state) {
                    this.UserService = UserService;
                    this.AvatarService = AvatarService;
                    this.FriendService = FriendService;
                    this.$scope = $scope;
                    this.$state = $state;
                    if (!this.UserService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    // this.myAvatar = this.AvatarService.getAvatarUrl(this.UserService.user.avatarId);
                    // this.UserService.addAvatarUrl(this.myAvatar);
                    // console.log(this.UserService.user);
                    this.FriendService.getMyFriends(this.UserService.user.userName);
                }
                return UserController;
            }());
            UserController.$inject = [
                'UserService',
                'AvatarService',
                'FriendService',
                '$scope',
                '$state'
            ];
            User.UserController = UserController;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
