var Quizdom;
(function (Quizdom) {
    var Directives;
    (function (Directives) {
        var qzPlayerController = (function () {
            function qzPlayerController($scope) {
                $scope.player = {
                    userName: 'daVisionary',
                    isAdmin: true,
                    email: 'dtnathanson@gmail.com',
                    avatarUrl: 'avatar_1.png'
                };
                console.log($scope);
            }
            qzPlayerController.$inject = [
                '$scope'
            ];
            return qzPlayerController;
        }());
        Directives.qzPlayerController = qzPlayerController;
    })(Directives = Quizdom.Directives || (Quizdom.Directives = {}));
})(Quizdom || (Quizdom = {}));
