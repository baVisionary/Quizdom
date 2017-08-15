// Managing account logged in status

namespace Quizdom.Services {
    export class LoginService {
        private isUserLoggedIn: boolean = false;
        private authUser: Models.IUser;

        static $inject = [
            '$http',
            '$window',
            'AvatarService',
            'AuthenticationService',
            'GameService'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $window: ng.IWindowService,
            private AvatarService: Services.AvatarService,
            private AuthenticationService: Services.AuthenticationService,
            private GameService: Services.GameService
        ) {

        }

        // public get isLoggedIn(): boolean {
        //     return this.isUserLoggedIn;
        // }

        // public get user(): Models.UserModel {
        //     return this.authUser;
        // }

        public getSessionData(): void {
            let user = this.$window.sessionStorage.getItem('user');

            if (user) {
                this.AuthenticationService.setUser(<Models.IUser>JSON.parse(user));
                return;
            }

            this.AuthenticationService.setUser(Models.UserModel.getAnonymousUser());
            return;
        }

        private updateSession(user: Models.IUser | null): boolean {
            var encodedUser = JSON.stringify(user);
            console.log(user);

            if (encodedUser) {
                this.$window.sessionStorage.setItem('user', encodedUser);
                this.$window.localStorage.setItem('user', encodedUser);
                this.AuthenticationService.setUser(user);
                return true;
            }

            this.clearSession();
            return false;
        }

        private clearSession(): void {
            this.$window.sessionStorage.clear();
            this.$window.localStorage.clear();
            this.AuthenticationService.setUser(Models.UserModel.getAnonymousUser());
            this.GameService.destroyGame();
        }

        public loginUser(user: Models.LoginModel): ng.IPromise<boolean> {
            return this.$http.post<Models.UserModel>('api/Account/Login', user, <ng.IRequestShortcutConfig>{
                cache: false
            })
                .then((response: ng.IRequestShortcutConfig) => {
                    console.info('User login was successful.');
                    this.AuthenticationService.setUser(response.data);
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