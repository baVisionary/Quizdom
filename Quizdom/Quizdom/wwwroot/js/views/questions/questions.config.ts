namespace Quizdom.Views.Questions {
  Configuration.$inject = [
    '$stateProvider'
  ];

  export function Configuration(
    $stateProvider: ng.ui.IStateProvider
  ) {
    $stateProvider
      .state('questions', {
        url: '/questions',
        templateUrl: 'js/views/questions/questions.html',
        controller: 'QuestionsController',
        controllerAs: 'vm'

      })
      .state('questions.edit', {
        url: '/edit/:id',
        views: {
          'detail': {
            templateUrl: 'js/views/questions/question-edit.html'
          }
        }
      })
      .state('questions.new', {
        url: '/new',
        views: {
          'new': {
            templateUrl: 'js/views/questions/question-new.html'
          }
        }
      })
  }
}