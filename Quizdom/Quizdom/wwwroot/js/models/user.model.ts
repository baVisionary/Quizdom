namespace Quizdom.Models {
    export class UserModel {
        // public id: number;
        public userName: string = 'Guest';
        public email: string = ',';
        public avatarId: number = 0;
        public avatarUrl?: string = "avatar_generic.png";
        public isAdmin?: boolean = false;
        // to support friends
        public friendId?: number;
        // to support gamePlayer
        // public gameId?: number;
        // public userId?: string;
        // public playerId?: number;
        // public initiator?: boolean;
        // public prizePoints?: number = 0;
        // public answer?: number = 0;

        public static getAnonymousUser(): any {
            let user = new Models.UserModel;
            return user;
        }
    }

    export interface IUser extends ng.resource.IResource<IUser> {
        // id: number;
        userName: string;
        email: string
        avatarId: number;
        avatarUrl?: string;
        isAdmin?: boolean;
        // to support friends
        friendId?: number;
        // to support gamePlayer
        // gameId?: number;
        // userId?: string;
        // playerId?: number;
        // initiator?: boolean;
        // prizePoints?: number;
        // answer?: number;
        // delay?: number;

        getAnonymousUser(): any;
     }

    export interface IUserResource extends ng.resource.IResourceClass<IUser> { }
}