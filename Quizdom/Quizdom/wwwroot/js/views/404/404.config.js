var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Error404;
        (function (Error404) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Error404', {
                    url: '/404',
                    templateUrl: 'js/views/404/404.html',
                });
            }
            Error404.Configuration = Configuration;
        })(Error404 = Views.Error404 || (Views.Error404 = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
