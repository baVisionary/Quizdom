namespace Quizdom.Views.ForgotPassword {
    let module: ng.IModule = angular.module('View.ForgotPassword', []);

    module.config(ForgotPassword.Configuration);
    module.controller('ForgotPasswordController', ForgotPassword.ForgotPasswordController);
}