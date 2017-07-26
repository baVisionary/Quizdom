namespace Quizdom.Services {

  export class AvatarService {

    public avatars = [];
    private oneAvatar;
    private oneAvatarUrl: string = 'avatar_generic.png';

    static $inject = [
      '$resource'
    ]

    constructor(
      private $resource: ng.resource.IResourceService
      // private AvatarResource: ,
      // private Avatar: Models.IAvatarResource
    ) {
      // this.avatars = this.getAllAvatars();
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
    //     this.oneAvatar = this.Avatar.get({avatarId: avatarId}, function () {
    //       console.log(this.oneAvatar);
    //     }).$promise
    //       .catch((error) => {
    //         console.log(`Unable to retrieve avatar - ${error}`);
    //         return null;
    //       });
    //   } else {
    //     this.oneAvatar = this.avatars.find(avatar => { return avatar.id == avatarId });
    //   }
    //   return this.oneAvatar;
    // }

    private _Resource_avatar = this.$resource('/api/game/avatar/:avatarId');

    public getAllAvatars() {
      if (this.avatars.length == 0) {
        return this.avatars = this._Resource_avatar.query();
      }
      return this.avatars;
    }

    public getAvatarUrl(avatarId: number) {
      if (this.avatars.length > 0) {
        this.avatars.forEach(avatar => {
          if (avatar.id == avatarId) { this.oneAvatar = avatar };
        });
        return this.oneAvatar.imageUrl;
      } else {
        this.oneAvatar = this._Resource_avatar.get({
          avatarId: avatarId
        });
        return this.oneAvatar.imageUrl;
      }
    }

  }
}