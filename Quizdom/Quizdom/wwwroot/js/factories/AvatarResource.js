var Quizdom;
(function (Quizdom) {
    var Factories;
    (function (Factories) {
        AvatarResource.$inject = [
            '$resource'
        ];
        function AvatarResource($resource) {
            return $resource('/api/game/avatar/:avatarId');
        }
        Factories.AvatarResource = AvatarResource;
    })(Factories = Quizdom.Factories || (Quizdom.Factories = {}));
})(Quizdom || (Quizdom = {}));
