
namespace Quizdom.Views.Play {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Play', <ng.ui.IState>{
                url: '/play/{gameId}',
                templateUrl: 'js/views/play/play.html',
                controller: 'PlayController',
                controllerAs: 'vm'
            });
    }
}