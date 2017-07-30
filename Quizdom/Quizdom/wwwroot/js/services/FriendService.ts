namespace Quizdom.Services {

  export class FriendService {

    public friends = [];
    public friendsById = [];
    public newFriend;

    static $inject = [
      '$resource',
      'AvatarService'
    ]

    private _Resource_find_friends = this.$resource('/api/Account/:verb');
    private _Resource_friend = this.$resource('/api/game/friends/:friendId');
    private _Resource_friendsById = this.$resource('/api/game/friends/primaryusername/:userName');

    constructor(
      private $resource: ng.resource.IResourceService,
      private AvatarService: Services.AvatarService
    ) {

    }

    public getMyFriends(userName: string): Array<Models.UserModel> {
      this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
      this.friendsById = this._Resource_friendsById.query({ userName: userName });
      // console.log(this.friends);
      // .$promise.then((friends) => {
      //   this.friends = friends;
      //   this.friends.forEach(friend => {
      //     friend.avatarUrl = this.AvatarService.getAvatarUrl(friend.avatarId);
      //     console.log(friend);
      //   });
      // });
      return this.friends;
    }

    public findByEmail(email: string) {
      this.newFriend = this._Resource_find_friends.get({ verb: 'searchuserbyemail', email: email });
      return this.newFriend.$promise;
    }

    public findByUserName(userName: string) {
      this.newFriend = this._Resource_find_friends.get({ verb: 'searchuserbyname', userName: userName });
      return this.newFriend.$promise
    }
    
    public addFriend(primaryUserName, friendUser) {
      return this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friendUser.userName })      
    }

    public isNewFriend(search: string): any {
      if (this.friends.length > 0) {
        this.friends.findIndex()
      }
    }

    public removeFriend(primaryUserName, friendId: number) {
      console.log(`Deleting friendId: ${friendId}`);
      
      return this._Resource_friend.remove({friendId: friendId});
    }

  }
}