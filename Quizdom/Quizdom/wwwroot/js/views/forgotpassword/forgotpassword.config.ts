namespace Quizdom.Views.ForgotPassword {
    Configuration.$inject = [
        '$stateProvider'
    ];

    export function Configuration(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            .state('ForgotPassword', <ng.ui.IState>{
                url: '/forgotpassword',
                templateUrl: 'js/views/forgotpassword/forgotpassword.view.html',
                controller: 'ForgotPasswordController',
                controllerAs: 'vm'
            });
    }
}