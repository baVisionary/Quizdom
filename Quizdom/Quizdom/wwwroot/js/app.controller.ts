namespace Quizdom {
    export class AppController {

        static $inject = [
            'LoginService',
            'AuthenticationService',
            'FriendService',
            '$state'
        ];

        constructor(
            private LoginService: Services.LoginService,
            private AuthenticationService: Services.AuthenticationService,
            private FriendService: Services.FriendService,
            private $state: ng.ui.IStateService
        ) {
            this.LoginService.getSessionData();
            if (this.isUserLoggedIn) {
                this.FriendService.getMyFriends(this.user.userName);
            }
        }

        public get isUserLoggedIn(): boolean {
            return this.AuthenticationService.isLoggedIn;
        }

        public get user(): Models.UserModel {
            return this.AuthenticationService.getUser();
        }

        public logOut(): void {
            this.LoginService.logOut();
            this.$state.go('Welcome');
        }

        public myState(current): boolean {
            return this.$state.current.name == current;
        }
    }
}