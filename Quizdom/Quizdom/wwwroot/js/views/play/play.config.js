var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Play', {
                    url: '/play/{gameId}',
                    templateUrl: 'js/views/play/play.html',
                    controller: 'PlayController',
                    controllerAs: 'vm'
                })
                    .state('Play.rules', {
                    templateUrl: 'js/views/play/play.rules.html'
                })
                    .state('Play.pick', {
                    templateUrl: 'js/views/play/play.pick.html'
                })
                    .state('Play.prepare', {
                    templateUrl: 'js/views/play/play.prepare.html'
                })
                    .state('Play.ask', {
                    templateUrl: 'js/views/play/play.ask.html'
                })
                    .state('Play.results', {
                    templateUrl: 'js/views/play/play.results.html'
                })
                    .state('Play.summary', {
                    templateUrl: 'js/views/play/play.summary.html'
                });
            }
            Play.Configuration = Configuration;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
