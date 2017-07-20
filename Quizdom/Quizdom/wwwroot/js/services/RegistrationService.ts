namespace Quizdom.Services {

    export class RegistrationService {

        static $inject = [
            '$http',
            '$resource'
        ];
        public avatars = [];
        private _Resource_avatars = this.$resource('api/game/avatar');

        constructor(
            private $http: ng.IHttpService,
            private $resource: ng.resource.IResourceService
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

        /**
         * get array of avatars
         */
        public getAvatars(): object {
            if (this.avatars.length == 0) {
                this.avatars = this._Resource_avatars.query()
                this.avatars.$promise.then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(`Unable to get avatars - ${error}`);
                    return [];
                });
            }
            return this.avatars;
        }
    }
}