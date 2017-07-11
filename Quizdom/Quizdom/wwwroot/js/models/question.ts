class Question {

  public Id: number;
  public Category: string;
  public Difficulty: string;
  public Question: string;
  public Correct_Answer: string;
  public Incorrect_Answer1: string;
  public Incorrect_Answer2: string;
  public Incorrect_Answer3: string;
  public Incorrect_Answer4: string;
  public Source: string;
  public DateModified: object;
  public UserId: number;

  constructor (Id) {
   this.Id = Id;
   this.Category = "";
   this.Difficulty = "";
   this.Question = "";
   this.Correct_Answer = "";
   this.Incorrect_Answer1 = "";
   this.Incorrect_Answer2 = "";
   this.Incorrect_Answer3 = "";
   this.Incorrect_Answer4 = "";
   this.Source = "";
   this.DateModified = new Date();
   this.UserId = 0;
 }
}