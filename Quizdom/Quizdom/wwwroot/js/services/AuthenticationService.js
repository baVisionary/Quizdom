var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var AuthenticationService = (function () {
            function AuthenticationService() {
            }
            AuthenticationService.prototype.getUser = function () {
                return this.authUser;
            };
            AuthenticationService.prototype.setUser = function (user) {
                this.authUser = user;
            };
            return AuthenticationService;
        }());
        Services.AuthenticationService = AuthenticationService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
