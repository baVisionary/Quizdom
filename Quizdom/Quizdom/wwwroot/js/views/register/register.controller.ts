namespace Quizdom.Views.Register {
    export class RegisterController {
        public formData: Models.RegisterModel = new Models.RegisterModel();
        private authUser: Models.LoginModel = new Models.LoginModel();
        public pattern: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
        public avatars: Models.IAvatar[];
        // public RegistrationServices: angular.IServiceProvider;

        static $inject = [
            'RegistrationService',
            'UserService',
            '$state',
            'AvatarResource'
        ];

        constructor(
            private RegistrationService: Services.RegistrationService,
            private UserService: Services.UserService,
            private $state: ng.ui.IStateService,
            private Avatar: Models.IAvatarResource
        ) {
            this.avatars = Avatar.query();
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
                .then((user) => {
                    console.log(user);
                    this.authUser.email = user.email;
                    this.authUser.password = this.formData.password;
                    this.authUser.rememberMe = true;
                    console.log(this.authUser);
                    this.UserService
                        .loginUser(this.authUser)
                        .then((result: boolean) => {
                            if (result) {
                                this.$state.go('User', {
                                    userName: this.UserService.user.userName
                                });
                            }
                        });
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                    
                });
        }

    }
}