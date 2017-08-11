// Managing account logged in status
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var LoginService = (function () {
            function LoginService($http, $window, AvatarService, AuthenticationService) {
                this.$http = $http;
                this.$window = $window;
                this.AvatarService = AvatarService;
                this.AuthenticationService = AuthenticationService;
                this.isUserLoggedIn = false;
            }
            // public get isLoggedIn(): boolean {
            //     return this.isUserLoggedIn;
            // }
            // public get user(): Models.UserModel {
            //     return this.authUser;
            // }
            LoginService.prototype.getSessionData = function () {
                var user = this.$window.sessionStorage.getItem('user');
                if (user) {
                    this.AuthenticationService.setUser(JSON.parse(user));
                    return;
                }
                this.AuthenticationService.setUser(Quizdom.Models.UserModel.getAnonymousUser());
                return;
            };
            LoginService.prototype.updateSession = function (user) {
                var encodedUser = JSON.stringify(user);
                console.log(user);
                if (encodedUser) {
                    this.$window.sessionStorage.setItem('user', encodedUser);
                    this.$window.localStorage.setItem('user', encodedUser);
                    this.AuthenticationService.setUser(user);
                    return true;
                }
                this.clearSession();
                return false;
            };
            LoginService.prototype.clearSession = function () {
                this.$window.sessionStorage.clear();
                this.$window.localStorage.clear();
                this.AuthenticationService.setUser(Quizdom.Models.UserModel.getAnonymousUser());
            };
            LoginService.prototype.loginUser = function (user) {
                var _this = this;
                return this.$http.post('api/Account/Login', user, {
                    cache: false
                })
                    .then(function (response) {
                    console.info('User login was successful.');
                    _this.AuthenticationService.setUser(response.data);
                    return _this.updateSession(response.data);
                })
                    .catch(function () {
                    console.info('User was not logged in.');
                    return _this.updateSession(null);
                });
            };
            LoginService.prototype.addAvatarUrl = function (avatarUrl) {
                this.authUser.avatarUrl = avatarUrl;
            };
            LoginService.prototype.logOut = function () {
                var _this = this;
                this.$http.post('api/Account/Logout', {
                    cache: false
                })
                    .then(function () {
                    console.info('User was logged out.');
                    _this.clearSession();
                })
                    .catch(function () {
                    console.info('User was not logged out.');
                });
            };
            LoginService.$inject = [
                '$http',
                '$window',
                'AvatarService',
                'AuthenticationService'
            ];
            return LoginService;
        }());
        Services.LoginService = LoginService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
