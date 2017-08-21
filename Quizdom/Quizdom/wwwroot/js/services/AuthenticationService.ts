namespace Quizdom.Services {

  export class AuthenticationService {
    private authUser: Models.IAuthUser;
    private isUserLoggedIn: boolean = false;
    public rememberMe: boolean = false;

    constructor (

    ) {

    }

    public getUser() {
      return this.authUser;
    }

    public get User() {
      return this.authUser
    }

    public get Username() {
      return this.authUser.userName;
    }

    public setUser(user: Models.IAuthUser) {
      this.authUser = user;
      if (user.userName == 'Guest') {
        this.isUserLoggedIn = false;
      } else {
        this.isUserLoggedIn = true;
      }
    }

    public get isLoggedIn(): boolean {
      return this.isUserLoggedIn;
    }

    


  }
}