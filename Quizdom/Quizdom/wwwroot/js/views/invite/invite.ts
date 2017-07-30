namespace Quizdom.Views.Invite {
    let module: ng.IModule = angular.module('View.Invite', []);

    module.config(Invite.Configuration);
    module.controller('InviteController', Invite.InviteController);
}