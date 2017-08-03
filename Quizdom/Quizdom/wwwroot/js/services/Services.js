var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var module = angular.module('Quizdom.Services', []);
        module.service('RegistrationService', Services.RegistrationService);
        module.service('AuthenticationService', Services.AuthenticationService);
        module.service('AvatarService', Services.AvatarService);
        module.service('LoginService', Services.LoginService);
        module.service('FriendService', Services.FriendService);
        module.service('QuestionService', Services.QuestionService);
        module.service('ActiveService', Services.ActiveService);
        module.service('ChatService', Services.ChatService);
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
