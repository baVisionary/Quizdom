var Quizdom;
(function (Quizdom) {
    var AppController = (function () {
        function AppController(UserService, $state) {
            this.UserService = UserService;
            this.$state = $state;
        }
        Object.defineProperty(AppController.prototype, "isUserLoggedIn", {
            get: function () {
                return this.UserService.isLoggedIn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppController.prototype, "user", {
            get: function () {
                return this.UserService.user;
            },
            enumerable: true,
            configurable: true
        });
        AppController.prototype.logOut = function () {
            this.UserService.logOut();
            this.$state.go('welcome');
        };
        return AppController;
    }());
    AppController.$inject = [
        'UserService',
        '$state'
    ];
    Quizdom.AppController = AppController;
})(Quizdom || (Quizdom = {}));
