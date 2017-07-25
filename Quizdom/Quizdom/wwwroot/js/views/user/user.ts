namespace Quizdom.Views.User {
  let module: ng.IModule = angular.module('View.User', []);

  module.config(User.Configuration);
  module.controller('UserController', User.UserController);
}