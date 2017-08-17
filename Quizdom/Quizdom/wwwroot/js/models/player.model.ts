namespace Quizdom.Models {
    export class PlayerModel {
      public id?: number;
      public gameId: number;
      public userId: string;
      public initiator?: boolean = false;
      public prizePoints?: number = 0;
    }

    export interface IPlayer extends ng.resource.IResource<IPlayer> {
      id?: number;
      gameId: number;
      userId: string;
      initiator?: boolean;
      prizePoints?: number;
    }

    export interface IPlayerResource extends ng.resource.IResourceClass<IPlayer> {
      update({id: number}, any: IPlayer): IPlayer;
    }
}