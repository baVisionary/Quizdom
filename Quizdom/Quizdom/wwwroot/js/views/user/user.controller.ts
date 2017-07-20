namespace Quizdom.Views.User {
    export class UserController {
        public RegistrationServices: angular.IServiceProvider;

        static $inject = [
            'UserService',
            '$state'
        ];

        

        constructor(
            private UserService: Services.UserService,
            private $state: ng.ui.IStateService,
        ) {
            console.log(this.UserService.user);
            
        }

        


    }
}