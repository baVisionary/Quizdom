var Quizdom;
(function (Quizdom) {
    var Factories;
    (function (Factories) {
        var module = angular.module('Quizdom.Factories', []);
        module.factory('AuthenticationInterceptor', Factories.AuthenticationInterceptor);
        module.factory('AvatarResource', Factories.AvatarResource);
        module.factory('AuthenticationData', Factories.AuthenticationData);
    })(Factories = Quizdom.Factories || (Quizdom.Factories = {}));
})(Quizdom || (Quizdom = {}));
