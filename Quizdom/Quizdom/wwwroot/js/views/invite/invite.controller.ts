namespace Quizdom.Views.Invite {
  export class InviteController {
    public player: string = "";
    public feedback: string = "";
    public chipFriends = [];
    public chipActive = [];

    static $inject = [
      'AuthenticationService',
      'PlayerService',
      'FriendService',
      'ActiveService',
      'GameService',
      '$state'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private PlayerService: Services.PlayerService,
      private FriendService: Services.FriendService,
      private ActiveService: Services.ActiveService,
      private GameService: Services.GameService,
      private $state: ng.ui.IStateService
    ) {
      if (!this.AuthenticationService.isLoggedIn) {
        this.$state.go('Login');
      }

      this.loadMyFriends().then(() => {
        this.FriendService.friends.forEach(friend => {
          this.chipFriends.push({tag: friend.userName})
        })
      });
      this.loadActiveUsers().then(() => {
        this.ActiveService.ActiveUsers.forEach(user => {
          this.chipFriends.push({tag: user.userName})
        })
      });
      this.GameService.gameData = new Models.GameModel;
      this.GameService.loadMyGameData(this.AuthenticationService.User.userName)
        .then(() => {
          console.log(`Loading Game ${this.GameService.gameId} Players from DB...`);
          this.GameService.loadPlayers(this.GameService.gameId, this.AuthenticationService.User.userName)
            .then(() => {
              if (this.GameService.players.length == 0) {
                this.GameService.addPlayer(this.GameService.gameId, this.AuthenticationService.User, true)
              }
            })
        })
    }


    public loadActiveUsers() {
      let activeUsersLoaded = new Promise((res) => {
        this.ActiveService.getActiveUsers()
          .then(() => {
            console.log(`Active:`, this.ActiveService.ActiveUsers);
            res(`Active users loaded`);
          })
          .catch((error) => {
            console.log(error);
          })
      })
      return activeUsersLoaded;
    }

    private loadMyFriends() {
      let friendsLoaded = new Promise((res) => {
        this.FriendService.getMyFriends(this.AuthenticationService.User.userName).$promise
          .then(() => {
            console.log(`Friends:`, this.FriendService.friends);
            res(`Friends loaded`)
          })
          .catch((error) => {
            console.log(error);
          })
      })
      return friendsLoaded;
    }

    public findPlayer(search: string): any {
      let found: Models.UserModel = new Models.UserModel;
      this.feedback = "";
      if (this.FriendService.isMe(search)) {
        this.player = "";
        this.feedback = `${search} is you, ya bonehead!`
        return;
      }
      this.PlayerService.findByUserName(search)
        .then((found) => {
          // Need to confirm that 204 not returned or 200 returned
          // console.log(found.hasOwnProperty('userName'));
          if (found.hasOwnProperty('userName')) {
            this.player = "";
            this.GameService.addPlayer(this.GameService.gameId, found, false);
            return found;
          } else {
            this.PlayerService.findByEmail(search)
              .then((found) => {
                console.log(found.hasOwnProperty('userName'));
                if (found.hasOwnProperty('userName')) {
                  this.player = "";
                  this.GameService.addPlayer(this.GameService.gameId, found, false);
                  return found;
                }
                // Check if search is formatted as email
                // YES - offer to send email invite
                // NO - feedback "User not found - Enter email to send Quizdom invitation" 
                this.feedback = `${search} not found as Username or Email`;
                return;
              })

          }
        })
        .catch((error) => {
          console.log(error);
          this.feedback = `${error.status}: ${error.statusText}`;
          return;
        });
    }

    public addPlayer(user: Models.IUser) {
      console.log(`Add player requested:`, user.userName);
      this.GameService.addPlayer(this.GameService.gameId, user, false);
    }

    public removePlayer(playerId: number) {
      this.GameService.removePlayer(playerId);
    }

    public goToSetup() {
      this.$state.go(`Setup`);
    }

    // public sendFriendEmail(friendEmail) {
    //   if (this.FriendService.isNewFriend(friendEmail)) {
    //     this.PlayerService.findByEmail(friendEmail)
    //       .then((friend) => {
    //         this.GameService.addPlayers(this.GameService.gameId, friend);

    //       })
    //   }
    //   return
    // }

  }
}