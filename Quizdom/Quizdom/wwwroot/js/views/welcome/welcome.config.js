var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Welcome;
        (function (Welcome) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Welcome', {
                    url: '/',
                    templateUrl: 'js/views/welcome/welcome.html',
                    controller: 'WelcomeController',
                    controllerAs: 'vm'
                });
            }
            Welcome.Configuration = Configuration;
        })(Welcome = Views.Welcome || (Views.Welcome = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
