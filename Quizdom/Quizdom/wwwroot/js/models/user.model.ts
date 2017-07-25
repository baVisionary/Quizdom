namespace Quizdom.Models {
    export class UserModel {
        public userName: string = '';
        public email: string = ','
        public avatarId: number = 0;
        public avatarUrl: string = "avatar_generic.png";

        public static getAnonymousUser(): Models.UserModel {
            let user = new Models.UserModel();
            user.userName = 'Anonymous';
            return user;
        }
    }
}