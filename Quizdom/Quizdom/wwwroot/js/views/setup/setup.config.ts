namespace Quizdom.Views.Setup {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Setup', <ng.ui.IState>{
                url: '/setup',
                templateUrl: 'js/views/setup/setup.html',
                controller: 'SetupController',
                controllerAs: 'vm'
            });
    }
}