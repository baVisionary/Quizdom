namespace Quizdom.Models {
  export class GameModel {
    public id: number = 0;
    public initiatorUserId: string = '';
    public gameLength?: number = 18;
    public activeUserId?: string = '';
    public lastActiveUserId?: string = '';
    public startDateTime?: Date = new Date();
    // cycles through setup/rules/pick/question/results/summary
    public gameState?: string = "setup";
    public gameBoardId?: number = 0;
  }

  export interface IGame extends ng.resource.IResource<IGame> {
    id: number;
    initiatorUserId: string;
    gameLength?: number;
    activeUserId?: string;
    lastActiveUserId?: string;
    startDateTime?: Date;
    gameState?: string;
    gameBoardId?: number;
  }

  export interface IGameResource extends ng.resource.IResourceClass<IGame> {
    update({ gameId: number }, any: IGame): IGame;
    search(string): IGame;
  }
}