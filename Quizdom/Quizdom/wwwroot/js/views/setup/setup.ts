namespace Quizdom.Views.Setup {
    let module: ng.IModule = angular.module('View.Setup', []);

    module.config(Setup.Configuration);
    module.controller('SetupController', Setup.SetupController);
}