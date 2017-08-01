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
                    url: '/play',
                    templateUrl: 'js/views/play/play.html',
                    controller: 'PlayController',
                    controllerAs: 'vm'
                });
            }
            Play.Configuration = Configuration;
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
