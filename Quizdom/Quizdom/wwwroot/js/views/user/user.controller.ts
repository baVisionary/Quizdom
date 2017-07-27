namespace Quizdom.Views.User {
    export class UserController {
        public friendEdit: boolean = false;

        static $inject = [
            // 'LoginService',
            // 'AvatarService',
            'FriendService',
            'AuthenticationService',
            '$scope',
            '$state'
        ];

        constructor(
            // private LoginService: Services.LoginService,
            // private AvatarService: Services.AvatarService,
            private FriendService: Services.FriendService,
            private AuthenticationService: Services.AuthenticationService,
            private $scope: ng.IScope,
            private $state: ng.ui.IStateService
        ) {
            if (!this.AuthenticationService.isLoggedIn) {
                this.$state.go('Login');
            }
            this.FriendService.getMyFriends(this.AuthenticationService.User.userName);

        }
 
        public editFriends():void {
            this.friendEdit = !this.friendEdit;
            console.log(`friendEdit: ${this.friendEdit}`);
            
        }
    }
}