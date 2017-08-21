namespace Quizdom.Views.Register {
    export class RegisterController {
        public formData: Models.RegisterModel = new Models.RegisterModel();
        private newUser: Models.LoginModel = new Models.LoginModel();
        public pattern: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';

        static $inject = [
            'RegistrationService',
            'LoginService',
            '$state',
            'AvatarService',
            'AuthenticationService'
        ];

        constructor(
            private RegistrationService: Services.RegistrationService,
            private LoginService: Services.LoginService,
            private $state: ng.ui.IStateService,
            private AvatarService: Services.AvatarService,
            private AuthenticationService: Services.AuthenticationService
        ) {
            this.AvatarService.getAllAvatars();
        }

        public checkRegExp(reg: string, str: string): boolean {
            // console.log(str);

            let regTest = new RegExp('');
            switch (reg) {
                case 'Number':
                    regTest = new RegExp('(?=.*[0-9]).*');
                    break;
                case 'Symbol':
                    regTest = new RegExp('(?=.*[!@#\$%\^&\*]).*');
                    break;
                case 'Upper':
                    regTest = new RegExp('(?=.*[A-Z]).*');
                    break;
                case 'Lower':
                    regTest = new RegExp('(?=.*[a-z]).*')
                    break;
                default:
                    regTest = new RegExp('(?=.{8,}).*')
                    break;
            }
            // console.log(`Regexp: ${reg}: ${regTest.test(str)}`);
            return regTest.test(str);
        }

        public registerUser(): any {

            this.RegistrationService
                .registerUser(this.formData)
                .then((user: Models.AuthUserModel) => {
                    console.log(user);
                    this.newUser.email = user.email;
                    this.newUser.password = this.formData.password;
                    
                    console.log(this.newUser);
                    this.LoginService.loginUser(this.newUser)
                        .then((result: boolean) => {
                            console.log(`Login process result: ${result}`);
                            if (result) {
                                this.goToUser();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return error;
                        });
                });
        }

        public goToUser() {
            this.$state.go('User');
        }
    }
}