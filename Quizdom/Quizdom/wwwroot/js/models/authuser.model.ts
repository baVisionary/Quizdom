namespace Quizdom.Models {
    export class AuthUserModel {
        public id: number;
        public userName: string = 'Guest';
        public email: string = '';
        public isAdmin?: boolean = false;
        public avatarId: number = 0;
        public avatarUrl?: string = "avatar_generic.png";
        public rememberMe?: boolean;
        // to support friends
        public friendId?: number;

        // constructor(user?) {
        //     this.userName = user.userName || 'Guest';
        //     this.email = user.email || '';
        //     this.isAdmin = user.isAdmin || false;
        //     this.avatarId = user.avatarId || 0;
        //     this.avatarUrl = user.avatarUrl || "avatar_generic.png";
        //     this.friendId = user.friendId || 0;
        // }

        public static getAnonymousUser(): any {
            let user = new Models.AuthUserModel;
            console.log(`user`, user);
            return user;
        }
    }

    export interface IAuthUser extends ng.resource.IResource<IAuthUser> {
        id: number;
        userName: string;
        email: string
        avatarId: number;
        avatarUrl?: string;
        isAdmin?: boolean;
        // to support friends
        friendId?: number;

        getAnonymousUser(): any;
     }

    export interface IAuthUserResource extends ng.resource.IResourceClass<IAuthUser> {
        
    }
}