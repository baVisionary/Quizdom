namespace Quizdom.Services {

  export class AuthenticationService {
    private authUser: Models.UserModel;

    public getUser() {
      return this.authUser;
    }

    public setUser(user) {
      this.authUser = user;
    }
    
  }
}