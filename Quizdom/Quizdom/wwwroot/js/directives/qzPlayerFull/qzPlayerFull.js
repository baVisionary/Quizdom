var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        function qzPlayerDirective() {
            return {
                restrict: 'E',
                templateUrl: 'js/directives/qzPlayerFull/qzPlayerFull.html'
            };
        }
        Directives.qzPlayerDirective = qzPlayerDirective;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
