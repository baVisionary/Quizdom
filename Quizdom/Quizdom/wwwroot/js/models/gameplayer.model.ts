namespace Quizdom.Models {
  export class GamePlayerModel {
    public id?: number;
    public gameId: number = 0;
    public userId: string = "";
    public initiator?: boolean = false;
    public prizePoints?: number = 0;
    public answer?: number = 0;
    public delay?: number = 0;
    // playing (gameState: pick) prepare/ask/guess/right/winner/wrong (gameState: question) winner/loser (gameState: summary)
    public playerState?: string = "ready";
    public questionsRight?: number = 0;
    public questionsRightDelay?: number = 0;
    public questionsWon?: number = 0;
  }

  export interface IGamePlayer extends ng.resource.IResource<IGamePlayer> {
    id?: number;
    gameId: number;
    userId: string;
    initiator?: boolean;
    prizePoints?: number;
    answer?: number;
    delay?: number;
    playerState?: string;
    questionsRight?: number;
    questionsRightDelay?: number;
    questionsWon?: number;
  }

  export interface IGamePlayerResource extends ng.resource.IResourceClass<IGamePlayer> {
    update({ id: number }, any: IGamePlayer): IGamePlayer;
  }
}