namespace Quizdom.Views.Invite {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('Invite', <ng.ui.IState>{
                url: '/invite',
                templateUrl: 'js/views/invite/invite.html',
                controller: 'InviteController',
                controllerAs: 'vm'
            });
    }
}