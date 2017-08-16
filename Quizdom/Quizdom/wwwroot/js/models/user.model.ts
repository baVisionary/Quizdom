namespace Quizdom.Models {
    export class UserModel {
        public id: number;
        public userName: string = 'Guest';
        public email: string = ',';
        public avatarId: number = 0;
        public avatarUrl?: string = "avatar_generic.png";
        public isAdmin?: boolean = false;
        public friendId?: number;
        public prizePoints?: number = 0;

        public static getAnonymousUser(): any {
            let user = new Models.UserModel;
            return user;
        }
    }

    export interface IUser extends ng.resource.IResource<IUser> {
        id: number;
        userName: string;
        email: string
        avatarId: number;
        avatarUrl?: string;
        isAdmin?: boolean;
        friendId?: number;
        prizePoints?: number;

        getAnonymousUser(): any;
     }

    export interface IUserResource extends ng.resource.IResourceClass<IUser> { }
}