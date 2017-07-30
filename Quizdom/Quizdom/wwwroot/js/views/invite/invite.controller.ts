namespace Quizdom.Views.Invite {
  export class InviteController {
    static $inject = [
      'AuthenticationService',
      'FriendService',
      '$state'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private FriendService: Services.FriendService,
      private $state: ng.ui.IStateService
    ) {
      if (!this.AuthenticationService.isLoggedIn) { this.$state.go('User') };
      
    }


  }
}