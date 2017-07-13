namespace Quizdom.Services {
    
    export class RegistrationService {
        
        static $inject = [
            '$http'
        ];

        constructor(
            private $http: ng.IHttpService
        ) {

        }

        public registerUser(user: Models.RegisterModel): ng.IPromise<boolean> {
            return this.$http.post<boolean>('api/account/register', user, <ng.IRequestShortcutConfig>{
                cache: false
            })
                .then(() => {
                    console.info('User was succesfully created.');
                    return true;
                })
                .catch(() => {
                    console.info('User was not created');
                    return false;
                });
        }
    }
}