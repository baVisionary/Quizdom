var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var ForgotPassword;
        (function (ForgotPassword) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('ForgotPassword', {
                    url: '/forgotpassword',
                    templateUrl: 'js/views/forgotpassword/forgotpassword.view.html',
                    controller: 'ForgotPasswordController',
                    controllerAs: 'vm'
                });
            }
            ForgotPassword.Configuration = Configuration;
        })(ForgotPassword = Views.ForgotPassword || (Views.ForgotPassword = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
