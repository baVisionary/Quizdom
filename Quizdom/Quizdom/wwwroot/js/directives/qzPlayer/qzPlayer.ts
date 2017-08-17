namespace Quizdom.Directives {

  export function qzPlayer(
  ) {

    return {
      restrict: 'AE',
      replace: true,
      // controller: 'qzPlayerController',
      scope: {
        'player': '<'
        },
      templateUrl: 'js/directives/qzPlayer/qzPlayer.html'
    }

  }

}