var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayerChip() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    'player': '<'
                },
                templateUrl: 'js/directives/qzPlayerChip/qzPlayerChip.html'
            };
        }
        Directives.qzPlayerChip = qzPlayerChip;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
