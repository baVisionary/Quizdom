var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayer() {
            return {
                restrict: 'AE',
                replace: true,
                // controller: 'qzPlayerController',
                scope: {
                    'player': '<'
                },
                templateUrl: 'js/directives/qzPlayer/qzPlayer.html'
            };
        }
        Directives.qzPlayer = qzPlayer;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
