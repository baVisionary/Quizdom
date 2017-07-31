namespace Quizdom.Services {
    let module: ng.IModule = angular.module('Quizdom.Services', []);

    module.service('RegistrationService', Services.RegistrationService);
    module.service('AuthenticationService', Services.AuthenticationService);
    module.service('AvatarService', Services.AvatarService);
    module.service('LoginService', Services.LoginService);
    module.service('FriendService', Services.FriendService);
    module.service('QuestionService', Services.QuestionService);
    module.service('ActiveService', Services.ActiveService);
}