namespace app {

  angular.module('app', ['ui.router', 'ngResource']).config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) => {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/views/welcome.html',
      controller: app.Controllers.WelcomeController,
      controllerAs: 'vm'
    })
    .state('questions', {
      url: '/questions',
      templateUrl: '/views/questions.html',
      controller: app.Controllers.QuestionController,
      controllerAs: 'vm'
    })
    .state('404', {
      url: '/404',
      templateUrl: '/views/404.html'
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
  })
}