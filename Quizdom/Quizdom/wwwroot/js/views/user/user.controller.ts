namespace Quizdom.Views.User {
    export class UserController {
        public avatars;
        public myAvatar;

        static $inject = [
            'UserService',
            'AvatarService',
            '$state'
        ];

        constructor(
            private UserService: Services.UserService,
            private AvatarService: Services.AvatarService,
            private $state: ng.ui.IStateService
        ) {
            if (!this.UserService.isLoggedIn) {
                this.$state.go('Login');
            }
            this.avatars = this.AvatarService.getAllAvatars();
            this.myAvatar = this.AvatarService.getOneAvatar(this.UserService.user.avatarId);
            
        }

        


    }
}