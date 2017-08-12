namespace Quizdom.Models {
  
    export class GameBoardModel {

      public id: number = 0;
      public gameId: number = 0;
      public boardColumn: number;
      public boardRow: number;
      public questionId: number;
      public questionState?: string;
      public answeredCorrectlyUserId?: string;
  
    }
  
    export interface IGameBoard extends ng.resource.IResource<IGameBoard> {
  
      id: number;
      gameId: number;
      boardColumn: number;
      boardRow: number;
      questionId: number;
      questionState?: string;
      answeredCorrectlyUserId?: string;

    }
  
    export interface IGameBoardResource extends ng.resource.IResourceClass<IGameBoard> {
      update(id, IGameBoard): IGameBoard;
    }
  
  }