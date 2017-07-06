namespace app.Controllers {

  export class WelcomeController {
    public title;
    public description;

    constructor() {
      this.title = "Welcome to Quizdom";
      this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers."
    }
  }

  angular.module('app').controller('WelcomeController', WelcomeController);

  export class QuestionController {
    public title;
    public questions;
    public category;
    public difficulty;
    public questionToEdit;

    static $inject = ['QuestionService'];

    constructor(private QuestionService) {
      this.title = "Quiz Questions";
      this.questions = this.QuestionService.getAllQs();
    }

    public editQuestion = function (questionId: number): void {
      this.questionToEdit = this.QuestionService.getOneQuestionId(questionId);
      console.log(this.questionToEdit);
    }

    public saveQuestion = function (question: object): void {
      console.log(question);
      this.questionToEdit = this.QuestionService.updateOneQuestion(question);
      console.log(this.questionToEdit);
    }

  }

  angular.module('app').controller('QuestionController', QuestionController);

}