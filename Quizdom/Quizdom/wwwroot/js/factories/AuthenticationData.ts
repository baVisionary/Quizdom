namespace Quizdom.Factories {

  export function AuthenticationData() {

    var User: Models.IAuthUser;

    return {
      setUser: (userData: Models.IAuthUser) => {
        User = userData;
        console.log(User);
      },
      getUser: () => {
        console.log(User);
        return User;
      }
    }
  }

  export interface IAuthenticationData {
    setUser: (authUser) => void,
    getUser: () => Models.AuthUserModel;
  }

}