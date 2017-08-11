namespace Quizdom.Models {
    export class PlayerModel {
      public id?: number;
      public gameId: number;
      public userId: string;
      public initiator?: boolean = false;
    }

    export interface IPlayer extends ng.resource.IResource<IPlayer> {
      id?: number;
      gameId: number;
      userId: string;
      initiator?: boolean;
    }

    export interface IPlayerResource extends ng.resource.IResourceClass<IPlayer> {
      update(IPlayer): IPlayer;
    }
}