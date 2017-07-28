namespace Quizdom.Views.Login {
    let module: ng.IModule = angular.module('View.Invite', []);

    module.config(Invite.Configuration);
    module.controller('InviteController', Invite.InviteController);
}