var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var module = angular.module('Quizdom.Services', []);
        module.service('RegistrationService', Services.RegistrationService);
        module.service('AvatarService', Services.AvatarService);
        module.service('UserService', Services.UserService);
        module.service('FriendService', Services.FriendService);
        module.service('QuestionService', Services.QuestionService);
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
