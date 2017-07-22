namespace Quizdom.Services {

    export class RegistrationService {

        static $inject = [
            '$http'
        ];

        constructor(
            private $http: ng.IHttpService
        ) {
        }

        public registerUser(user: Models.RegisterModel): any {
            return this.$http.post<boolean>('api/account/register', user, <ng.IRequestShortcutConfig>{
                cache: false
            })
                .then((response) => {
                    console.info('User was succesfully created.');
                    return response.data;
                })
                .catch((error) => {
                    console.info('User was not created');
                    return error;
                });
        }

    }
}