namespace Quizdom.Views.User {
    export class UserController {
        public myAvatar: string;
        public friendEdit: boolean = false;

        static $inject = [
            'UserService',
            'AvatarService',
            'FriendService',
            '$scope',
            '$state'
        ];

        constructor(
            private UserService: Services.UserService,
            private AvatarService: Services.AvatarService,
            private FriendService: Services.FriendService,
            private $scope: ng.IScope,
            private $state: ng.ui.IStateService
        ) {
            if (!this.UserService.isLoggedIn) {
                this.$state.go('Login');
            }
            // this.myAvatar = this.AvatarService.getAvatarUrl(this.UserService.user.avatarId);
            // this.UserService.addAvatarUrl(this.myAvatar);
            // console.log(this.UserService.user);
            this.FriendService.getMyFriends(this.UserService.user.userName);

        }
 
        public editFriends():void {
            this.friendEdit = !this.friendEdit;
            console.log(`friendEdit: ${this.friendEdit}`);
            
        }
    }
}