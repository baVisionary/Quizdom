var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController(UserService, AvatarService, $state) {
                    this.UserService = UserService;
                    this.AvatarService = AvatarService;
                    this.$state = $state;
                    if (!this.UserService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.avatars = this.AvatarService.getAllAvatars();
                    this.myAvatar = this.AvatarService.getOneAvatar(this.UserService.user.avatarId);
                }
                return UserController;
            }());
            UserController.$inject = [
                'UserService',
                'AvatarService',
                '$state'
            ];
            User.UserController = UserController;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
