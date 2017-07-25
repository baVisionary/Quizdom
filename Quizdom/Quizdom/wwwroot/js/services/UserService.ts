// Managing account logged in status

namespace Quizdom.Services {
    export class UserService {
        private isUserLoggedIn: boolean = false;
        private authUser: Models.UserModel = new Models.UserModel();

        static $inject = [
            '$http',
            '$window',
            'AvatarService'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $window: ng.IWindowService,
            private AvatarService: Services.AvatarService
        ) {
            this.getSessionData();
        }

        public get isLoggedIn(): boolean {
            return this.isUserLoggedIn;
        }

        public get user(): Models.UserModel {
            return this.authUser;
        }

        private getSessionData(): void {
            let user = this.$window.sessionStorage.getItem('user');

            if (user) {
                this.authUser = <Models.UserModel>JSON.parse(user);
                this.isUserLoggedIn = true;
                return;
            }

            this.authUser = Models.UserModel.getAnonymousUser();
            this.isUserLoggedIn = false;
            return;
        }

        private updateSession(user: Models.UserModel|null): boolean {
            var encodedUser = JSON.stringify(user);
            console.info(encodedUser);

            if (encodedUser) {
                this.$window.sessionStorage.setItem('user', encodedUser);
                this.authUser = user;
                this.isUserLoggedIn = true;
                
                return true;
            }

            this.clearSession();
            return false;
        }

        private clearSession(): void {
            this.$window.sessionStorage.clear();
            this.authUser = Models.UserModel.getAnonymousUser();
            this.isUserLoggedIn = false;
        }

        public loginUser(user: Models.LoginModel): ng.IPromise<boolean> {
            return this.$http.post<Models.UserModel>('api/Account/Login', user, <ng.IRequestShortcutConfig>{
                cache: false
            })
                .then((response: ng.IRequestShortcutConfig) => {
                    console.info('User login was successful.');
                    response.data.avatarUrl = this.AvatarService.getAvatarUrl(response.data.avatarId);
                    return this.updateSession(response.data);
                })
                .catch(() => {
                    console.info('User was not logged in.');
                    return this.updateSession(null);
                });
        }
        
        public addAvatarUrl(avatarUrl) {
            this.authUser.avatarUrl = avatarUrl;
        }

        public logOut(): void {
            this.$http.post<Models.UserModel>('api/Account/Logout', <ng.IRequestShortcutConfig>{
                cache: false
            })
                .then(() => {
                    console.info('User was logged out.');
                    this.clearSession();
                })
                .catch(() => {
                    console.info('User was not logged out.');
                });
        }
    }
}