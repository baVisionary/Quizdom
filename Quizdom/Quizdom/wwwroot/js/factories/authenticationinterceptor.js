var Quizdom;
(function (Quizdom) {
    var Factories;
    (function (Factories) {
        AuthenticationInterceptor.$inject = [
            '$q',
            '$location',
            'AuthenticationService'
        ];
        function AuthenticationInterceptor($q, $location, AuthenticationService) {
            var _this = this;
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    var newUser = _this.AuthenticationService.User || new Quizdom.Models.AuthUserModel;
                    config.headers['Username'] = newUser.userName;
                    config.headers['Role'] = (newUser.isAdmin) ? 'Admin' : (newUser.userName == 'Guest') ? 'Guest' : 'Normal';
                    return config;
                },
                responseError: function (rejection) {
                    if (rejection.status === 401 || rejection.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                },
                response: function (response) {
                    // console.log(response);
                    if (response.status === 201) {
                        response.data = { id: angular.fromJson(response.data) };
                    }
                    return response;
                }
            };
        }
        Factories.AuthenticationInterceptor = AuthenticationInterceptor;
    })(Factories = Quizdom.Factories || (Quizdom.Factories = {}));
})(Quizdom || (Quizdom = {}));
