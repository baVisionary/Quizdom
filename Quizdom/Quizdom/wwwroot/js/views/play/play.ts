namespace Quizdom.Views.Play {
    let module: ng.IModule = angular.module('View.Play', []);

    module.config(Play.Configuration);
    module.controller('PlayController', Play.PlayController);
}