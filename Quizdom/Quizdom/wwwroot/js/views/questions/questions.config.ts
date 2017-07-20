namespace Quizdom.Views.Questions {
  Configuration.$inject = [
    '$stateProvider'
  ];

  export function Configuration(
    $stateProvider: ng.ui.IStateProvider
  ) {
    $stateProvider
      .state('Questions', {
        url: '/questions',
        templateUrl: 'js/views/questions/questions.html',
        controller: 'QuestionsController',
        controllerAs: 'vm'

      })
      .state('Questions.edit', {
        url: '/edit/:id',
        views: {
          'detail': {
            templateUrl: 'js/views/questions/question-edit.html'
          }
        }
      })
      .state('Questions.new', {
        url: '/new',
        views: {
          'new': {
            templateUrl: 'js/views/questions/question-new.html'
          }
        }
      })
  }
}