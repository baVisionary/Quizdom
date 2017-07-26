namespace Quizdom.Factories {
    let module: ng.IModule = angular.module('Quizdom.Factories', []);

    module.factory('AuthenticationInterceptor', Factories.AuthenticationInterceptor);
    module.factory('AvatarResource', Factories.AvatarResource);
    module.factory('AuthenticationData', Factories.AuthenticationData);
}