namespace Quizdom {
    export class AppController {

        public get isUserLoggedIn(): boolean {
            return this.UserService.isLoggedIn;
        }

        public get user(): Models.UserModel {
            return this.UserService.user;
        }

        static $inject = [
            'UserService',
            '$state'
        ];

        constructor(
            private UserService: Services.UserService,
            private $state: ng.ui.IStateService
        ) {

        }

        public logOut(): void {
            this.UserService.logOut();
            this.$state.go('welcome');
        }
    }
}