var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Login;
        (function (Login) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Login', {
                    url: '/login',
                    templateUrl: 'js/views/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                });
            }
            Login.Configuration = Configuration;
        })(Login = Views.Login || (Views.Login = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
