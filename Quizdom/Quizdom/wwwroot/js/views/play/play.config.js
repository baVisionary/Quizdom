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
                    .state('play.welcome', {
                    url: '@',
                    templateUrl: 'js/views/play/play.welcome.html'
                })
                    .state('play.pick', {
                    url: '@',
                    templateUrl: 'js/views/play/play.pick.html'
                })
                    .state('play.prepare', {
                    url: '@',
                    templateUrl: 'js/views/play/play.prepare.html'
                })
                    .state('play.answer', {
                    url: '@',
                    templateUrl: 'js/views/play/play.answer.html'
                })
                    .state('play.results', {
                    url: '@',
                    templateUrl: 'js/views/play/play.results.html'
                });
            }
            Play.Configuration = Configuration;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
