namespace Quizdom.Services {
    let module: ng.IModule = angular.module('Quizdom.Services', []);

    module.service('RegistrationService', Services.RegistrationService);
    module.service('AuthenticationService', Services.AuthenticationService);
    module.service('AvatarService', Services.AvatarService);
    module.service('UserService', Services.UserService);
    module.service('FriendService', Services.FriendService);
    module.service('QuestionService', Services.QuestionService);
}