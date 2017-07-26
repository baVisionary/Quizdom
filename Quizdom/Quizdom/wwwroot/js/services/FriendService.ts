namespace Quizdom.Services {

  export class FriendService {

    public friends = [];
    public friendsId = [];

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
        this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName }).$promise.then((data) => {
          this.friends = data;
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
      this._Resource_find_friends.query({ verb: 'searchuserbyemail', email: email });

    }

    public findByUserName(userName: string) {
      this._Resource_find_friends.query({ verb: 'searchuserbyname', userName: userName });
    }

    public addFriend(primaryUserName, friendUserName) {
      this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friendUserName });
    }

  }
}