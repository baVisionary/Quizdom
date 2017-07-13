namespace Quizdom.Views.Welcome {
    let module: ng.IModule = angular.module('View.Welcome', []);

    module.config(Welcome.Configuration);
    module.controller('WelcomeController', Welcome.WelcomeController);
}