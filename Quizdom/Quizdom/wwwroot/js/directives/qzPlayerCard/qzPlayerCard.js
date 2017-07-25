var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayerCard() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    player: '@'
                },
                templateUrl: 'js/directives/qzPlayerCard/qzPlayerCard.html'
            };
        }
        Directives.qzPlayerCard = qzPlayerCard;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
