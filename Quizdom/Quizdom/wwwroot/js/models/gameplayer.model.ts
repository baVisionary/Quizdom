namespace Quizdom.Models {
    export class GamePlayerModel {
      public id?: number;
      public gameId: number;
      public userId: string;
      public initiator?: boolean = false;
      public prizePoints?: number = 0;
      public answer?: number = 0;
      public delay?: number = 0;
    }

    export interface IGamePlayer extends ng.resource.IResource<IGamePlayer> {
      id?: number;
      gameId: number;
      userId: string;
      initiator?: boolean;
      prizePoints?: number;
      answer?: number;
      delay?: number;

    }

    export interface IGamePlayerResource extends ng.resource.IResourceClass<IGamePlayer> {
      update({id: number}, any: IGamePlayer): IGamePlayer;
    }
}