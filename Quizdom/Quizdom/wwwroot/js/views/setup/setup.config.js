var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Setup', {
                    url: '/setup',
                    templateUrl: 'js/views/setup/setup.html',
                    controller: 'SetupController',
                    controllerAs: 'vm'
                });
            }
            Setup.Configuration = Configuration;
        })(Setup = Views.Setup || (Views.Setup = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
