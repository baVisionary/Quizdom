namespace Quizdom.Models {
  
    export class GameQuestionModel {

      public questionId: number = 0;
      public questionText: string = "";
      public answers?: {answer: string, correct: boolean}[] = [];
      public questionState: string = "fresh";
      public answeredCorrectlyUserId?: string = "";
      public categoryId?: number = 0;
      public boardColumn?: number = 0;
      public boardRow?: number = 0;
      public boardId?: number = 0;
      public prize?: number = 0;
      public difficulty?: string = "";

    }
    
  }