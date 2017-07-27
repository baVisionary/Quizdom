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
                    this.FriendService = FriendService;
                    this.AuthenticationService = AuthenticationService;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.friendEdit = false;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName);
                }
                UserController.prototype.editFriends = function () {
                    this.friendEdit = !this.friendEdit;
                    console.log("friendEdit: " + this.friendEdit);
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
