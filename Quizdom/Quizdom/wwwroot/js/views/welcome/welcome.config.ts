namespace Quizdom.Views.Welcome {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('welcome', <ng.ui.IState>{
                url: '/',
                templateUrl: 'js/views/welcome/welcome.html',
                controller: 'WelcomeController',
                controllerAs: 'vm'
            });
    }
}