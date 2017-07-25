var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        var qzPlayerCardController = (function () {
            function qzPlayerCardController($scope) {
                $scope.player = {
                    userName: 'daVisionary',
                    isAdmin: true,
                    email: 'dtnathanson@gmail.com',
                    avatarUrl: 'avatar_1.png'
                };
                console.log($scope.player);
            }
            return qzPlayerCardController;
        }());
        qzPlayerCardController.$inject = [
            '$scope'
        ];
        Directives.qzPlayerCardController = qzPlayerCardController;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
