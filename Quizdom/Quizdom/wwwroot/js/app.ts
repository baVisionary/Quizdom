namespace Quizdom {

  let app: ng.IModule = angular.module('app', [
    // Dependencies
    'ui.router',
    'ngResource',
    'angularUtils.directives.dirPagination',
    // 'SignalR',

    // Modules
    'Quizdom.Directives',
    'Quizdom.Factories',
    'Quizdom.Services',
    'Quizdom.Views'
  ]);

  // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
  app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);

  app.controller('AppController', Quizdom.AppController);
  app.config(Quizdom.Configuration);
}