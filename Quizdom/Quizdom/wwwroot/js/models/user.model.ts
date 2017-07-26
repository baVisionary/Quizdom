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
}