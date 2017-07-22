namespace Quizdom.Services {

  export class AvatarService {

    public avatars = [];
    public myAvatar;

    static $inject = [
      '$resource'
    ]

    constructor(
      private $resource: ng.resource.IResourceService
      // private AvatarResource: ,
      // private Avatar: Models.IAvatarResource
    ) {

    }

    /**
     * get array of avatars
     */
    // public loadAvatars() {
    //   if (this.avatars.length == 0) {
    //     this.avatars = this.Avatar.query(function () {
    //       console.log(this.avatars);
    //     }).$promise
    //       .catch((error) => {
    //         console.log(`Unable to get avatars - ${error}`);
    //         return [];
    //       });
    //   }
    //   return this.avatars;
    // }

    // public loadMyAvatar(avatarId: number) {
    //   if (this.avatars.length == 0) {
    //     this.myAvatar = this.Avatar.get({avatarId: avatarId}, function () {
    //       console.log(this.myAvatar);
    //     }).$promise
    //       .catch((error) => {
    //         console.log(`Unable to retrieve avatar - ${error}`);
    //         return null;
    //       });
    //   } else {
    //     this.myAvatar = this.avatars.find(avatar => { return avatar.id == avatarId });
    //   }
    //   return this.myAvatar;
    // }

    private _Resource_avatar = this.$resource('/api/game/avatar/:avatarId');

    public getAllAvatars() {
      if (this.avatars.length == 0) {
        this.avatars = this._Resource_avatar.query();
        this.avatars.$promise.then(() => {
          console.log(this.avatars);
        })
        .catch((error) => {
          console.log(`Avatars not retrieved database`);
          return error
        });
      }
      return this.avatars;
    }

    public getOneAvatar(avatarId: number) {
      if (this.avatars.length > 0) {
        this.myAvatar = this.avatars.find(avatar => {return avatar.id == avatarId});
      } else {
        this.myAvatar = this._Resource_avatar.get({
          avatarId: avatarId
        });
        this.myAvatar.$promise.then(() => {
          console.log(this.myAvatar);
        })
        .catch((error) => {          
          console.log(`${error.status}: ${error.data}`);
          return error;
        });
      }
      return this.myAvatar;
    }

  }
}