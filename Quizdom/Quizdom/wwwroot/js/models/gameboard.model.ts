namespace Quizdom.Models {
  
    export class GameBoardModel {

      public id?: number = 0;
      public gameId: number = 0;
      public categoryId: number = 0;
      public difficulty: string = "";
      public questionId: number = 0;
      public boardColumn?: number = 0;
      public boardRow?: number = 0;
      public prizePoints?: number = 0;
      public questionText: string = "";
      public answerA?: string = "";
      public answerB?: string = "";
      public answerC?: string = "";
      public answerD?: string = "";
      //  values: A/B/C/D
      public correctAnswer: string = "";
      // possible states: new/ask/answers/guess/correct/old
      public questionState: string = "new";
      public answeredCorrectlyUserId?: string = "";
      public answerOrder?: number = 0;
  
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
      correctAnswer: string;
      // possible states: new/ask/answers/guess/correct/old
      questionState: string;
      answeredCorrectlyUserId?: string;
      answerOrder?: number;

    }
  
    export interface IGameBoardResource extends ng.resource.IResourceClass<IGameBoard> {
      update(id, IGameBoard): IGameBoard;
    }
  
  }