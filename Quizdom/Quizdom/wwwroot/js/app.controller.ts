namespace Quizdom {
    export class AppController {

        static $inject = [
            'UserService',
            '$state'
        ];

        constructor(
            private UserService: Services.UserService,
            private $state: ng.ui.IStateService
        ) {
            this.UserService = UserService;
            // if (this.isUserLoggedIn) {
            //     console.log(this.user);
            //     this.$state.go('User', {userName: this.user.userName})
            // }
        }

        public get isUserLoggedIn(): boolean {
            return this.UserService.isLoggedIn;
        }

        public get user(): Models.UserModel {
            return this.UserService.user;
        }

        public logOut(): void {
            this.UserService.logOut();
            this.$state.go('Welcome');
        }

        public myState(current): boolean {
            return this.$state.current.name == current;
        }
    }
}