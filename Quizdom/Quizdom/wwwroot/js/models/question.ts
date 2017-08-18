namespace Quizdom.Models {

  export class QuestionModel {

    public id: number = 0;
    public category: string = 'User Added';
    public type: string = 'multiple';
    public difficulty: string = '';
    public question: string = '';
    public correct_Answer: string = '';
    public incorrect_Answer1: string = '';
    public incorrect_Answer2: string = '';
    public incorrect_Answer3: string = '';
    public incorrect_Answer4: string = '';
    public source: string = '';
    public dateModified: Date = new Date();
    public userId: string = '';
    public avatarId: number = 0;
    public categoryId: number = 0;

  }

  export interface IQuestion extends ng.resource.IResource<IQuestion> {

    id: number;
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_Answer: string;
    incorrect_Answer1: string;
    incorrect_Answer2: string;
    incorrect_Answer3: string;
    incorrect_Answer4: string;
    source: string;
    dateModified: Date;
    userId: string;
    avatarId: number;
    categoryId: number;
  }

  export interface IQuestionResource extends ng.resource.IResourceClass<IQuestion> {
    update(questionId, IQuestion): IQuestion;
    diff({category, difficulty}): IQuestion[]; 
  }

}