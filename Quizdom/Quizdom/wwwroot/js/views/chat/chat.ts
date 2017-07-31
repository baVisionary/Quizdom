namespace Quizdom.Views.Chat {
    let module: ng.IModule = angular.module('View.Chat', []);

    module.config(Chat.Configuration);
    module.controller('ChatController', Chat.ChatController);
}