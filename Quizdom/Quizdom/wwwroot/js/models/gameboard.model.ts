namespace Quizdom.Models {
  
    export class GameBoardModel {

      public id: number = 0;
      public gameId: number = 0;
      public categoryId: number = 0;
      public difficulty: string = "";
      public questionId: number = 0;
      public boardColumn?: number = 0;
      public boardRow?: number = 0;
      public prizePoints?: number = 0;
      public questionText: string = "";
      public answerA?: string = "A";
      public answerB?: string = "B";
      public answerC?: string = "C";
      public answerD?: string = "D";
      //  values: 0-3
      public correctAnswer: number = 0;
      // possible states: new/ask/answers/guess/correct/retired
      public questionState: string = "new";
      public answeredCorrectlyUserId?: string = "";
      public answerOrder?: number = 0;
      public catLong?: string;
  
    }
  
    export interface IGameBoard extends ng.resource.IResource<IGameBoard> {
  
      id: number;
      gameId: number;
      categoryId: number;
      difficulty: string;
      questionId: number;
      boardColumn?: number;
      boardRow?: number;
      prizePoints?: number;
      questionText: string;
      answerA?: string;
      answerB?: string;
      answerC?: string;
      answerD?: string;
      //  values: A/B/C/D
      correctAnswer: number;
      // possible states: new/ask/retired (previous states: answer/guess now stored in gamePlayers)
      questionState: string;
      answeredCorrectlyUserId?: string;
      answerOrder?: number;
      catLong?: string;
    }
  
    export interface IGameBoardResource extends ng.resource.IResourceClass<IGameBoard> {
      update(id: {id: number}, any: IGameBoard): IGameBoard;
    }
  
  }