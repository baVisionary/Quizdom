namespace Quizdom.Models {

  export class PlayerModel {
    public id?: number;
    public userName: string = 'Guest';
    public email: string = '';
    public isAdmin?: boolean = false;
    public avatarId: number = 0;
    public avatarUrl?: string = "avatar_generic.png";
    // to support friends
    public friendId?: number;
    // to support gamePlayer
    public gameId: number;
    public gamePlayerId?: number = 0;
    public initiator?: boolean = false;
    public prizePoints?: number = 0;
    public answer?: number;
    public delay?: number;

    constructor(user, gamePlayer?) {
      this.gameId = gamePlayer.gameId;
      this.gamePlayerId = gamePlayer.id;
      this.initiator = gamePlayer.initiator;
      this.prizePoints = gamePlayer.prizePoints;
      this.answer = gamePlayer.answer;
      this.delay = gamePlayer.delay;
    }
  }

  export interface IPlayer extends ng.resource.IResource<IPlayer> {
    // I
    userName: string;
    email: string
    isAdmin?: boolean;
    avatarId: number;
    avatarUrl?: string;
    // to support friends
    friendId?: number;
    // to support gamePlayer
    gameId?: number;
    userId?: string;
    playerId?: number;
    initiator?: boolean;
    prizePoints?: number;
    answer?: number;
    delay?: number;

    getAnonymousUser(): any;
  }

  export interface IPlayerResource extends ng.resource.IResourceClass<IPlayer> {
    update({ id: number }, any: IPlayer): IPlayer;
  }
}