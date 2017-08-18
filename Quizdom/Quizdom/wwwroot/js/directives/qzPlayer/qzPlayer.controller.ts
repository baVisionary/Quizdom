namespace Quizdom.Directives {
  export class qzPlayerController {
    public player: Models.UserModel;

    static $inject = [
      '$scope'
    ];

    constructor(
      $scope: ng.IScope
    ) {      
      $scope.player = {
        userName: 'daVisionary',
        isAdmin: true,
        email: 'dtnathanson@gmail.com',
        avatarUrl: 'avatar_1.png'
      }
      console.log($scope);
      
    }

  }
}