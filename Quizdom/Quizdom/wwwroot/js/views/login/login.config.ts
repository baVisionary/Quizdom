namespace Quizdom.Views.Login {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Login', <ng.ui.IState>{
                url: '/login',
                templateUrl: 'js/views/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            });
    }
}