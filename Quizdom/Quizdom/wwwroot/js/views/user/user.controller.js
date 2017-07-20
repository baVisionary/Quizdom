var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController(UserService, $state) {
                    this.UserService = UserService;
                    this.$state = $state;
                    console.log(this.UserService.user);
                }
                return UserController;
            }());
            UserController.$inject = [
                'UserService',
                '$state'
            ];
            User.UserController = UserController;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
