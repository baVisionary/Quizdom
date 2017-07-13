namespace Quizdom {
    Configuration.$inject = [
        '$urlRouterProvider',
        '$locationProvider',
        '$httpProvider',
        '$stateProvider'
    ];

    export function Configuration(
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider,
        $httpProvider: ng.IHttpProvider,
        $stateProvider: ng.ui.IStateProvider
    ) {

        // Add Custom Interceptors
        $httpProvider.interceptors.push('AuthenticationInterceptor');

        // Handle Default Route
        $urlRouterProvider.otherwise('/404');

        // Set HTML5 Mode
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    }
}