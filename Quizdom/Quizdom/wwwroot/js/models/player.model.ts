namespace Quizdom.Models {
    export class PlayerModel extends UserModel {
      // from userModel
      // public userName: string = 'Guest';
      // public email: string = ',';
      // public avatarId: number = 0;
      // public avatarUrl?: string = "avatar_generic.png";
      // public isAdmin?: boolean = false;
      // public friendId?: number;
      // from gamePlayer
      public playerId?: number; // = gamePlayerId
      public userId?: string; // = userName
      public gameId?: number;
      public initiator?: boolean = false;
      public prizePoints?: number = 0;
      public answer?: number = 0;
      public delay?: number = 0;

      constructor(user, gamePlayer?) {
        super();
        this.userName = user.userName;
        this.email = user.email;
        this.avatarId = user.avatarId;
        this.avatarUrl = user.avatarUrl;
        this.isAdmin = user.isAdmin;
        this.friendId = user.friendId;
        this.playerId = gamePlayer.id;
        this.gameId = gamePlayer.gameId;
        this.initiator = gamePlayer.initiator;
        this.prizePoints = gamePlayer.prizePoints;
        this.answer = gamePlayer.answer;
        this.delay = gamePlayer.delay;

      }

    }

    export interface IPlayer extends ng.resource.IResource<PlayerModel> {
      // userName: string;
      // email: string
      // avatarId: number;
      // avatarUrl?: string;
      // isAdmin?: boolean;
      // friendId?: number;
      // from gamePlayer
      id?: number;
      userId?: string;
      gameId?: number;
      initiator?: boolean;
      prizePoints?: number;
      answer?: number;
      delay?: number;

    }

    export interface IPlayerResource extends ng.resource.IResourceClass<IPlayer> {
      update({id: number}, any: IPlayer): IPlayer;
    }
}