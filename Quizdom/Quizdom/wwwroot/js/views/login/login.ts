namespace Quizdom.Views.Login {
    let module: ng.IModule = angular.module('View.Login', []);

    module.config(Login.Configuration);
    module.controller('LoginController', Login.LoginController);
}