var Quizdom;
(function (Quizdom) {
    var Factories;
    (function (Factories) {
        AuthenticationInterceptor.$inject = [
            '$q',
            '$location'
        ];
        function AuthenticationInterceptor($q, $location) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                    return config;
                },
                responseError: function (rejection) {
                    if (rejection.status === 401 || rejection.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        }
        Factories.AuthenticationInterceptor = AuthenticationInterceptor;
    })(Factories = Quizdom.Factories || (Quizdom.Factories = {}));
})(Quizdom || (Quizdom = {}));
