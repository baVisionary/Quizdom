var Quizdom;
(function (Quizdom) {
    Configuration.$inject = [
        '$urlRouterProvider',
        '$locationProvider',
        '$httpProvider',
        '$stateProvider'
    ];
    function Configuration($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider) {
        // Add Custom Interceptors
        $httpProvider.interceptors.push('AuthenticationInterceptor');
        // Handle Default Route
        $urlRouterProvider.otherwise('/');
        // Set HTML5 Mode
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    }
    Quizdom.Configuration = Configuration;
})(Quizdom || (Quizdom = {}));
