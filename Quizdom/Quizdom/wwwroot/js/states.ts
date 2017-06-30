namespace app {

  angular.module('app', ['ui.router', 'ngResource', 'materialize']).config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) => {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../views/welcome.html',
      controller: app.Controllers.WelcomeController,
      controllerAs: 'controller'
    })
    .state('404', {
      url: '/404',
      templateUrl: '../views/404.html'
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
  })
}