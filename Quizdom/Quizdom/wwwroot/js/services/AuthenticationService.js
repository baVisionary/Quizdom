var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var AuthenticationService = (function () {
            function AuthenticationService($window) {
                this.$window = $window;
                this.getSessionUser();
            }
            AuthenticationService.prototype.getSessionUser = function () {
                var user = this.$window.sessionStorage.getItem('user');
                if (user) {
                    return this.authUser = JSON.parse(user);
                }
                return this.authUser = new Quizdom.Models.UserModel;
            };
            return AuthenticationService;
        }());
        AuthenticationService.$inject = [
            '$window'
            // ,'$http'
        ];
        Services.AuthenticationService = AuthenticationService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
