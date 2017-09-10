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
      public playerState?: string = 'ready';
      public questionsRight?: number = 0;
      public questionsRightDelay?: number = 0;
      public questionsWon?: number = 0;

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
        // ready (gameState: pick) prepare/ask/guess/results (gameState: question) winner/loser (gameState: summary)
        this.playerState = gamePlayer.playerState;
        this.questionsRight = gamePlayer.questionsRight;
        this.questionsRightDelay = gamePlayer.questionsRightDelay;
        this.questionsWon = gamePlayer.questionsWon;

      }

    }

    export interface IPlayer extends ng.resource.IResource<IPlayer> {
      userName: string;
      email: string
      avatarId: number;
      avatarUrl?: string;
      isAdmin?: boolean;
      friendId?: number;
      
      // from gamePlayer
      id?: number;
      userId?: string;
      gameId?: number;
      initiator?: boolean;
      prizePoints?: number;
      answer?: number;
      delay?: number;
      playerState?: string;
      questionsRight?: number;
      questionsRightDelay?: number;
      questionsWon?: number;
    }

    export interface IPlayerResource extends ng.resource.IResourceClass<IPlayer> {
      update({id: number}, any: IPlayer): IPlayer;
    }
}