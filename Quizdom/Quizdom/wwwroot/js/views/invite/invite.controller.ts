namespace Quizdom.Views.Invite {
  export class InviteController {

    static $inject = [
      'AuthenticationService',
      'FriendService',
      'ActiveService',
      '$state'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private FriendService: Services.FriendService,
      private ActiveService: Services.ActiveService,
      private $state: ng.ui.IStateService
    ) {
      if (!this.AuthenticationService.isLoggedIn) {
        this.$state.go('Login');
      }
      this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
        .then(() => {
          console.log(this.FriendService.friends);
        })
        .catch((error) => {
          console.log(error);

        })
      this.loadActiveUsers();
    }

    public loadActiveUsers() {
      this.ActiveService.getActiveUsers()
        .then(() => {
          console.log(this.ActiveService.ActiveUsers);
        })
        .catch((error) => {
          console.log(error);

        })
    }
  }
}