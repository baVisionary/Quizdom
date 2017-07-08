namespace app {

  angular.module('app').config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) => {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/views/welcome.html',
      controller: 'WelcomeController',
      controllerAs: 'vm'
    })
    .state('questions', {
      url: '/questions',
      templateUrl: '/views/questions.html',
      controller: 'QuestionController',
      controllerAs: 'vm'
    })
    .state('questions.view', {
      url: '/view/:id',
      views: {
        'detail': {
          templateUrl: '/views/question-view.html'
        }
      }
    })
    .state('questions.edit', {
      url: '/edit/:id',
      views: {
        'detail': {
          templateUrl: '/views/question-edit.html'
        }
      }
    })
    .state('questions.new', {
      url: '/new/:id',
      views: {
        'detail': {
          templateUrl: '/views/question-new.html'
        }
      }
    })
    .state('404', {
      url: '/404',
      templateUrl: '/views/404.html'
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
  });

}