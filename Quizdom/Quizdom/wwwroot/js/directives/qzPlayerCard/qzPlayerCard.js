var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayerCard() {
            return {
                restrict: 'AE',
                replace: true,
                // controller: 'qzPlayerCardController',
                scope: {
                    'player': '<'
                },
                templateUrl: 'js/directives/qzPlayerCard/qzPlayerCard.html'
            };
        }
        Directives.qzPlayerCard = qzPlayerCard;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
