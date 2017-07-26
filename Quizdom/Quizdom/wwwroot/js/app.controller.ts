namespace Quizdom {
    export class AppController {

        static $inject = [
            'UserService',
            'AuthenticationService',
            '$state'
        ];

        constructor(
            private UserService: Services.UserService,
            private AuthenticationService: Services.AuthenticationService,
            private $state: ng.ui.IStateService
        ) {

        }

        public get isUserLoggedIn(): boolean {
            return this.AuthenticationService.isLoggedIn;
        }

        public get user(): Models.UserModel {
            return this.AuthenticationService.getUser();
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