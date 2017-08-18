var Quizdom;
(function (Quizdom) {
    var AppController = (function () {
        function AppController(
            // private HubService: Services.HubService,
            LoginService, AuthenticationService, FriendService, $state) {
            this.LoginService = LoginService;
            this.AuthenticationService = AuthenticationService;
            this.FriendService = FriendService;
            this.$state = $state;
            this.LoginService.getSessionData();
            if (this.isUserLoggedIn) {
                this.FriendService.getMyFriends(this.user.userName);
            }
            // this.HubService.firstConnect();
        }
        Object.defineProperty(AppController.prototype, "isUserLoggedIn", {
            get: function () {
                return this.AuthenticationService.isLoggedIn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppController.prototype, "user", {
            get: function () {
                return this.AuthenticationService.getUser();
            },
            enumerable: true,
            configurable: true
        });
        AppController.prototype.logOut = function () {
            this.LoginService.logOut();
            this.$state.go('Welcome');
        };
        AppController.prototype.myState = function (current) {
            return this.$state.current.name == current;
        };
        AppController.$inject = [
            // 'HubService',
            'LoginService',
            'AuthenticationService',
            'FriendService',
            '$state'
        ];
        return AppController;
    }());
    Quizdom.AppController = AppController;
})(Quizdom || (Quizdom = {}));
