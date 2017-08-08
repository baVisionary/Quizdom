namespace Quizdom.Services {

  export class FriendService {

    public friends = [];
    private newFriend;

    private _Resource_find_friends = this.$resource('/api/Account/:verb');
    private _Resource_friend = this.$resource('/api/game/friends/:friendId'
      // , null, { create: {
      //     method: 'POST',
      //     responseType: 'text',
      //     transformResponse: (data, getHeaders) => {
      //       var obj = { id: angular.fromJson(data) }
      //       return obj;
      //     }
      //   }
      // }
    );
    private _Resource_friendId = this.$resource('/api/game/friends/primaryusername/:primaryUserName/friendusername/:friendUserName');

    static $inject = [
      'AvatarService',
      'AuthenticationService',
      '$resource'

    ]

    constructor(
      private AvatarService: Services.AvatarService,
      private AuthenticationService: Services.AuthenticationService,
      private $resource: ng.resource.IResourceService
    ) {

    }

    public getMyFriends(userName: string): Array<Models.UserModel> {
      this.friends = this._Resource_find_friends.query({ verb: 'getfriendsbyprimaryusername', userName: userName });
      // this.friendsById = this._Resource_friendsById.query({ userName: userName });
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
      return this.newFriend.$promise;
    }

    public addFriend(primaryUserName, friend) {
      this.newFriend = this._Resource_friend.save({ primaryUserName: primaryUserName, friendUserName: friend.userName });
      return this.newFriend.$promise;
    }

    public newFriendId(primaryUserName, friend) {
      return this._Resource_friendId.query({ primaryUserName: primaryUserName, friendUserName: friend.userName });
    }

    // check whether search is logged in user info
    public isMe(search: string): boolean {
      // Normalize search case for smarter comparisons
      let upperSearch = search.toUpperCase();
      // check against username & email
      let myUserName = this.AuthenticationService.User.userName.toUpperCase() == upperSearch;
      let myEmail = this.AuthenticationService.User.email.toUpperCase() == upperSearch;
      // display results of search
      console.log(`${search} is myUserName: ${myUserName} myEmail: ${myEmail}`);
      return (myUserName || myEmail);
    }

    // check whether newly seaerched friend is already listed
    public isNewFriend(search: string): boolean {
      // Normalize search case for smarter comparisons
      let upperSearch = search.toUpperCase();

      let friendUserName = false;
      let friendEmail = false;
      // check if search is already a friend
      friendUserName = this.friends.findIndex(f => {
        return f.userName.toUpperCase() == upperSearch
      }) >= 0;
      friendEmail = this.friends.findIndex(f => {
        return f.email.toUpperCase() == upperSearch
      }) >= 0;
      // display results of search
      console.log(`${search} is friendUserName: ${friendUserName} friendEmail: ${friendEmail}`);

      if (friendUserName || friendEmail) {
        return false;
      }
      return true;
    }

    public removeFriend(primaryUserName, friendId: number) {
      return this._Resource_friend.remove({ friendId: friendId });
    }

  }
}