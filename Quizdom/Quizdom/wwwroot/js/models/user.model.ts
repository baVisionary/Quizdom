namespace Quizdom.Models {
    export class UserModel {
        public userName: string = '';

        public static getAnonymousUser(): Models.UserModel {
            let user = new Models.UserModel();
            user.userName = 'Anonymous';

            return user;
        }
    }
}