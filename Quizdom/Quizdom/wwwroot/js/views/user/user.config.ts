namespace Quizdom.Views.User {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('User', <ng.ui.IState>{
                url: '/:userName',
                templateUrl: 'js/views/user/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
    }
}