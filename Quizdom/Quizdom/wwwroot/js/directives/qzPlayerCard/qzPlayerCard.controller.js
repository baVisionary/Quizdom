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
                console.log($scope);
            }
            qzPlayerCardController.$inject = [
                '$scope'
            ];
            return qzPlayerCardController;
        }());
        Directives.qzPlayerCardController = qzPlayerCardController;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
