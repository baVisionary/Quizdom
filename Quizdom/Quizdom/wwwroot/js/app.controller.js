var Quizdom;
(function (Quizdom) {
    var AppController = (function () {
        function AppController(UserService, AuthenticationService, $state) {
            this.UserService = UserService;
            this.AuthenticationService = AuthenticationService;
            this.$state = $state;
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
            this.UserService.logOut();
            this.$state.go('Welcome');
        };
        AppController.prototype.myState = function (current) {
            return this.$state.current.name == current;
        };
        return AppController;
    }());
    AppController.$inject = [
        'UserService',
        'AuthenticationService',
        '$state'
    ];
    Quizdom.AppController = AppController;
})(Quizdom || (Quizdom = {}));
