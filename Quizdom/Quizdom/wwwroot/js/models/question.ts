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
    public source: string = 'UserId';
    public dateModified: Date = new Date();
    public userId: string = '';
    public avatarId: number = 0;
    public categoryId: number = 0;

  }
}