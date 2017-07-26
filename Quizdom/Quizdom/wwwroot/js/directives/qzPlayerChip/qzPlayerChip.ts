namespace Quizdom.Directives {

  export function qzPlayerChip(
  ) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        'player': '<'
        },
      templateUrl: 'js/directives/qzPlayerChip/qzPlayerChip.html'
    }

  }

}