namespace Quizdom.Models {
    export class UserModel {
        public userName: string = 'Guest';
        public email: string = ','
        public avatarId: number = 0;
        public avatarUrl?: string = "avatar_generic.png";
        public isAdmin?: boolean = false;
        public friendId?: number = 0;

        public static getAnonymousUser(): Models.UserModel {
            let user = new Models.UserModel();
            return user;
        }
    }

    export interface IUser extends ng.resource.IResource<IUser> {
        userName: string;
        email: string;
        avatarId: number;
        avatarUrl?: string;
        isAdmin?: boolean;
        friendId?: number;

        getAnonymousUser();
    }

    export interface IUserResource extends ng.resource.IResource<IUser> {
        
    }
}