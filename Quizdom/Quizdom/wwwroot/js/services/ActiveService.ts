namespace Quizdom.Services {

  export class ActiveService {
    private _activeUsers = [];
    private _Resource_active = this.$resource('/api/Account/getactiveusers');

    static $inject = [
      '$resource'
    ]

    constructor (
      private $resource: ng.resource.IResourceService,
    ) {

    }

    public getActiveUsers() {
      this._activeUsers = this._Resource_active.query();
      return this._activeUsers.$promise;
    }

    public get ActiveUsers() {
      return this._activeUsers;
    }


  }
}