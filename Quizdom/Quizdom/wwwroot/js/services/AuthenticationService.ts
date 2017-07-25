namespace Quizdom.Services {

  export class AuthenticationService {
    public authUser: Models.UserModel;

    static $inject = [
      '$window'
      // ,'$http'
    ];

    constructor(
      private $window: ng.IWindowService,
      // private $http: ng.IHttpService
    ) {
      this.getSessionUser();
    }

    public getSessionUser(): Models.UserModel {
      let user = this.$window.sessionStorage.getItem('user');

      if (user) {
        return this.authUser = <Models.UserModel>JSON.parse(user);
      }

      return this.authUser = new Models.UserModel;
      }

  }
}