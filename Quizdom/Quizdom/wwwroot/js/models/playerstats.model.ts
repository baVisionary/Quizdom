namespace Quizdom.Models {
    export class PlayerStatsModel {
      public Id?: number;
      public userName?: string; // = userName
      public questionsRight?: number = 0;
      public questionsRightDelay?: number = 0;
      public questionsWon?: number = 0;
      public gamesPlayed?: number = 0;
      public gamesWon?: number = 0;
    }

    export interface IPlayerStats extends ng.resource.IResource<IPlayerStats> {
      Id?: number;
      userName?: string;
      questionsRight?: number;
      questionsRightDelay?: number;
      questionsWon?: number;
      gamesPlayed?: number;
      gamesWon?: number;
    }

    export interface IPlayerStatsResource extends ng.resource.IResourceClass<IPlayerStats> {
      update({id: number}, any: IPlayer): IPlayer;
    }
}