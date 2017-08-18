var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var module = angular.module('Quizdom.Services', []);
        module.service('ActiveService', Services.ActiveService);
        module.service('AuthenticationService', Services.AuthenticationService);
        module.service('AvatarService', Services.AvatarService);
        module.service('ChatService', Services.ChatService);
        module.service('FriendService', Services.FriendService);
        module.service('GameService', Services.GameService);
        module.service('HubService', Services.HubService);
        module.service('LoginService', Services.LoginService);
        module.service('PlayerService', Services.PlayerService);
        module.service('QuestionService', Services.QuestionService);
        module.service('RegistrationService', Services.RegistrationService);
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
