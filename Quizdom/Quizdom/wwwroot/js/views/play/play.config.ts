
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
            })
            .state('Play.rules', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.rules.html'
            })
            .state('Play.pick', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.pick.html'
            })
            .state('Play.prepare', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.prepare.html'
            })
            .state('Play.ask', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.ask.html'
            })
            .state('Play.results', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.results.html'
            })
            .state('Play.summary', <ng.ui.IState>{
                templateUrl: 'js/views/play/play.summary.html'
            })
    }
}