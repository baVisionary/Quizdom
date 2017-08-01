var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Invite;
        (function (Invite) {
            var InviteController = (function () {
                function InviteController(AuthenticationService, FriendService, ActiveService, $state) {
                    var _this = this;
                    this.AuthenticationService = AuthenticationService;
                    this.FriendService = FriendService;
                    this.ActiveService = ActiveService;
                    this.$state = $state;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('Login');
                    }
                    this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
                        .then(function () {
                        console.log(_this.FriendService.friends);
                    })
                        .catch(function (error) {
                        console.log(error);
                    });
                    this.loadActiveUsers();
                }
                InviteController.prototype.loadActiveUsers = function () {
                    var _this = this;
                    this.ActiveService.getActiveUsers()
                        .then(function () {
                        console.log(_this.ActiveService.ActiveUsers);
                    })
                        .catch(function (error) {
                        console.log(error);
                    });
                };
                InviteController.$inject = [
                    'AuthenticationService',
                    'FriendService',
                    'ActiveService',
                    '$state'
                ];
                return InviteController;
            }());
            Invite.InviteController = InviteController;
        })(Invite = Views.Invite || (Views.Invite = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
