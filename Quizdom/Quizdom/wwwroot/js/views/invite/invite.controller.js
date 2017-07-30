var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Invite;
        (function (Invite) {
            var InviteController = (function () {
                function InviteController(AuthenticationService, FriendService, $state) {
                    this.AuthenticationService = AuthenticationService;
                    this.FriendService = FriendService;
                    this.$state = $state;
                    if (!this.AuthenticationService.isLoggedIn) {
                        this.$state.go('User');
                    }
                    ;
                }
                return InviteController;
            }());
            InviteController.$inject = [
                'AuthenticationService',
                'FriendService',
                '$state'
            ];
            Invite.InviteController = InviteController;
        })(Invite = Views.Invite || (Views.Invite = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
