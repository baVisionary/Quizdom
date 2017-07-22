namespace Quizdom.Services {
    let module: ng.IModule = angular.module('Quizdom.Services', []);

    module.service('RegistrationService', Services.RegistrationService);
    module.service('AvatarService', Services.AvatarService);
    module.service('UserService', Services.UserService);
    module.service('QuestionService', Services.QuestionService);
}