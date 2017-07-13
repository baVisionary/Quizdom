namespace Quizdom.Services {
    let module: ng.IModule = angular.module('Quizdom.Services', []);

    module.service('RegistrationService', Services.RegistrationService);
    module.service('UserService', Services.UserService);
    module.service('QuestionService', Services.QuestionService);
}