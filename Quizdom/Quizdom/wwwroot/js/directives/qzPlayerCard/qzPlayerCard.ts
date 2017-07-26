namespace Quizdom.Directives {

  export function qzPlayerCard(
  ) {

    return {
      restrict: 'AE',
      replace: true,
      // controller: 'qzPlayerCardController',
      scope: {
        'player': '<'
        },
      templateUrl: 'js/directives/qzPlayerCard/qzPlayerCard.html'
    }

  }

}