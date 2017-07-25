namespace Quizdom.Directives {

  export function qzPlayerCard(
  ) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        player: '@'
        },
      templateUrl: 'js/directives/qzPlayerCard/qzPlayerCard.html'
    }

  }

}