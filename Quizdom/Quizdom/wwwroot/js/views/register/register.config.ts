namespace Quizdom.Views.Register {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Register', <ng.ui.IState>{
                url: '/register',
                templateUrl: 'js/views/register/register.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            });
    }
}