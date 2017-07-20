namespace Quizdom.Views.Register {
    export class RegisterController {
        public formData: Models.RegisterModel = new Models.RegisterModel();
        public user: Models.UserModel = new Models.UserModel();
        public pattern: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}).*';
        public avatars: object = [];
        public RegistrationServices: angular.IServiceProvider;

        static $inject = [
            'RegistrationService',
            'UserService',
            '$state',
            '$resource'
        ];


        constructor(
            private RegistrationService: Services.RegistrationService,
            private UserService: Services.UserService,
            private $state: ng.ui.IStateService,
            private $resource: ng.resource.IResourceService
        ) {
            this.avatars = this.RegistrationService.getAvatars();
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

        public registerUser(): void {

            this.RegistrationService
                .registerUser(this.formData)
                .then((result: boolean) => {
                    if (result) {
                        
                        
                    }
                })
                .catch(() => {
                    
                });
        }


    }
}