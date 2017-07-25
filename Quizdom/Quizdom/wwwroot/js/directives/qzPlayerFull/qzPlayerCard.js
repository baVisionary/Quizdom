var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayerCard() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    //@ reads the attribute value, = provides two-way binding, & works with functions
                    title: '@'
                },
                templateUrl: 'js/directives/qzPlayerCard/qzPlayerCard.html'
            };
        }
        Directives.qzPlayerCard = qzPlayerCard;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
