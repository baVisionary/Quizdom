namespace Quizdom.Views.Login {
    export class LoginController {
        public formData: Models.LoginModel = new Models.LoginModel();
        public loginError: boolean = false;

        public get canLogin() {
            return this.formData.email.length > 0 &&
                this.formData.password.length > 0;  
        }

        static $inject = [
            '$state',
            'LoginService',
            'AuthenticationService'
        ];

        constructor(
            private $state: ng.ui.IStateService,
            private LoginService: Services.LoginService,
            private AuthenticationService: Services.AuthenticationService
        ) {

        }

        public loginUser() {
            this.LoginService.loginUser(this.formData)
                .then((result: boolean) => {
                    if (result) {
                        this.loginError = false;
                        this.goToUser();
                    }
                    this.loginError = true;
                });
        }

        public goToUser() {
            this.$state.go('User');
        }
    }
}