
namespace Quizdom.Views.Chat {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Chat', <ng.ui.IState>{
                url: '/chat',
                templateUrl: 'js/views/chat/chat.html',
                controller: 'ChatController',
                controllerAs: 'vm'
            });
    }
}