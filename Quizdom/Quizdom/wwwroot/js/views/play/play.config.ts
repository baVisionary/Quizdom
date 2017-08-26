
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
            .state('play.welcome', <ng.ui.IState>{
                url: '@',
                templateUrl: 'js/views/play/play.welcome.html'
            })
            .state('play.pick', <ng.ui.IState>{
                url: '@',
                templateUrl: 'js/views/play/play.pick.html'
            })
            .state('play.prepare', <ng.ui.IState>{
                url: '@',
                templateUrl: 'js/views/play/play.prepare.html'
            })
            .state('play.answer', <ng.ui.IState>{
                url: '@',
                templateUrl: 'js/views/play/play.answer.html'
            })
            .state('play.results', <ng.ui.IState>{
                url: '@',
                templateUrl: 'js/views/play/play.results.html'
            })
    }
}