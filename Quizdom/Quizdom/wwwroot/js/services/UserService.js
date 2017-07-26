// Managing account logged in status
var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var UserService = (function () {
            function UserService($http, $window, AvatarService, AuthenticationService) {
                this.$http = $http;
                this.$window = $window;
                this.AvatarService = AvatarService;
                this.AuthenticationService = AuthenticationService;
                this.isUserLoggedIn = false;
                this.authUser = new Quizdom.Models.UserModel();
            }
            // public get isLoggedIn(): boolean {
            //     return this.isUserLoggedIn;
            // }
            // public get user(): Models.UserModel {
            //     return this.authUser;
            // }
            UserService.prototype.getSessionData = function () {
                var user = this.$window.sessionStorage.getItem('user');
                if (user) {
                    this.AuthenticationService.setUser(JSON.parse(user));
                    return;
                }
                this.AuthenticationService.setUser(Quizdom.Models.UserModel.getAnonymousUser());
                return;
            };
            UserService.prototype.updateSession = function (user) {
                var encodedUser = JSON.stringify(user);
                console.info(encodedUser);
                if (encodedUser) {
                    this.$window.sessionStorage.setItem('user', encodedUser);
                    this.$window.localStorage.setItem('user', encodedUser);
                    this.AuthenticationService.setUser(user);
                    return true;
                }
                this.clearSession();
                return false;
            };
            UserService.prototype.clearSession = function () {
                this.$window.sessionStorage.clear();
                this.AuthenticationService.setUser(Quizdom.Models.UserModel.getAnonymousUser());
            };
            UserService.prototype.loginUser = function (user) {
                var _this = this;
                return this.$http.post('api/Account/Login', user, {
                    cache: false
                })
                    .then(function (response) {
                    console.info('User login was successful.');
                    response.data.avatarUrl = _this.AvatarService.getAvatarUrl(response.data.avatarId);
                    return _this.updateSession(response.data);
                })
                    .catch(function () {
                    console.info('User was not logged in.');
                    return _this.updateSession(null);
                });
            };
            UserService.prototype.addAvatarUrl = function (avatarUrl) {
                this.authUser.avatarUrl = avatarUrl;
            };
            UserService.prototype.logOut = function () {
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
            return UserService;
        }());
        UserService.$inject = [
            '$http',
            '$window',
            'AvatarService',
            'AuthenticationService'
        ];
        Services.UserService = UserService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
