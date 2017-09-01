var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var AuthenticationService = (function () {
            function AuthenticationService() {
                this.isUserLoggedIn = false;
            }
            Object.defineProperty(AuthenticationService.prototype, "User", {
                // public getUser() {
                //   return this.authUser;
                // }
                get: function () {
                    return this.authUser;
                },
                enumerable: true,
                configurable: true
            });
            AuthenticationService.prototype.setUser = function (user) {
                this.authUser = user;
                if (user.userName == 'Guest') {
                    this.isUserLoggedIn = false;
                }
                else {
                    this.isUserLoggedIn = true;
                }
            };
            Object.defineProperty(AuthenticationService.prototype, "isLoggedIn", {
                get: function () {
                    return this.isUserLoggedIn;
                },
                enumerable: true,
                configurable: true
            });
            return AuthenticationService;
        }());
        Services.AuthenticationService = AuthenticationService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
