namespace Quizdom.Services {

  export class PlayerService {

    public friends = [];
    private newFriend;

    private _Resource_find_player = <Models.IPlayerResource>this.$resource('/api/Account/:verb');

    static $inject = [
      '$resource'
    ]

    constructor(
      private $resource: ng.resource.IResourceService
    ) {

    }

    private _Resource_player_stats = <Models.IPlayerStatsResource>this.$resource('/api/game/:gameId', null, {
      'update': {
        method: 'PUT'
      }
    });

    public findByEmail(email: string) {
      this.newFriend = this._Resource_find_player.get({ verb: 'searchuserbyemail', email: email });
      return this.newFriend.$promise;
    }  

    public findByUserName(userName: string) {
      this.newFriend = this._Resource_find_player.get({ verb: 'searchuserbyname', userName: userName });
      return this.newFriend.$promise;
    }  

  }
}