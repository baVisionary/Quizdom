var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Register;
        (function (Register) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Register', {
                    url: '/register',
                    templateUrl: 'js/views/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                });
            }
            Register.Configuration = Configuration;
        })(Register = Views.Register || (Views.Register = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
