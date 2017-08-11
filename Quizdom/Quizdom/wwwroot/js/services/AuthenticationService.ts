namespace Quizdom.Services {

  export class AuthenticationService {
    private authUser: Models.IUser;
    private isUserLoggedIn: boolean = false;

    constructor (

    ) {

    }

    public getUser() {
      return this.authUser;
    }

    public get User() {
      return this.authUser
    }

    public setUser(user: Models.IUser) {
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