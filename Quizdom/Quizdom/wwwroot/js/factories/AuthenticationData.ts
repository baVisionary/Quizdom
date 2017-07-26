namespace Quizdom.Factories {

  export interface IAuthenticationData {
    setUser: (authUser) => void,
    getUser: () => Models.UserModel;
  }

  export function AuthenticationData() {

    var User: Models.UserModel;

    return {
      setUser: (authUser: Models.UserModel) => {
        User = authUser;
        console.log(User);
      },
      getUser: () => {
        console.log(User);
        return User;
      }
    }
  }
}