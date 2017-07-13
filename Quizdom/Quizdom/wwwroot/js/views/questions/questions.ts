namespace Quizdom.Views.Questions {
    let module: ng.IModule = angular.module('View.Questions', []);

    module.config(Questions.Configuration);
    module.controller('QuestionsController', Questions.QuestionsController);
}