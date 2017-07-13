namespace Quizdom.Views.Register {
  let module: ng.IModule = angular.module('View.Register', []);

  module.config(Register.Configuration);
  module.controller('RegisterController', Register.RegisterController);
}