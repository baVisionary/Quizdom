namespace Quizdom.Views.Error404 {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Error404', <ng.ui.IState>{
                url: '/404',
                templateUrl: 'js/views/404/404.html'
            });
    }
}