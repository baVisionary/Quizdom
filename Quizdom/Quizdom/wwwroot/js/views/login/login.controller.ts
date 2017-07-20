namespace Quizdom.Views.Login {
    export class LoginController {
        public formData: Models.LoginModel = new Models.LoginModel();
        public loginError: boolean = false;

        public get canLogin() {
            return this.formData.email.length > 0 &&
                this.formData.password.length > 0;  
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

        public loginUser() {
            this.UserService
                .loginUser(this.formData)
                .then((result: boolean) => {
                    if (result) {
                        this.loginError = false;
                        this.$state.go('User', {userName: this.UserService.user.userName});
                    }
                    this.loginError = true;
                });
        }
    }
}