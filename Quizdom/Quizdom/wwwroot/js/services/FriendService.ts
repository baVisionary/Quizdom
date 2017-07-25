namespace Quizdom.Services {

  export class FriendService {

    public friends = [];

    static $inject = [
      '$resource',
      'AvatarService'
    ]

    private _Resource_find_friends = this.$resource('/api/Account/:verb');
    private _Resource_friend = this.$resource('/api/game/friends');

    constructor(
      private $resource: ng.resource.IResourceService,
      private AvatarService: Services.AvatarService
    ) {

    }

    public getMyFriends(userName: string): Array<Models.UserModel> {
      if (this.friends.length == 0) {
        this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
        this.friends.$promise.then(() => {
          this.friends.forEach(friend => {
            friend.avatarUrl = this.AvatarService.getAvatarUrl(friend.avatarId);
            console.log(friend);
          });
        })
        .catch((error) => {
          console.log(`Error ${error.status}: ${error.data}`);
        })
      }
      return this.friends;
    }

    public findByEmail(email: string) {

    }

    public findByUserName(userName: string) {

    }

    public addFriend(primaryUserName, friendUserName) {
      
    }

  }
}