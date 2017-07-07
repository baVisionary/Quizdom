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
    public categoryToEdit;
    public difficultyToEdit;

    static $inject = ['QuestionService'];

    constructor(private QuestionService) {
      this.title = "Quiz Questions";
      this.questions = this.QuestionService.getAllQs();
    }

    public editQuestion = function (questionId: number): void {
      let i = this.questions.findIndex( q => { return q.id == questionId } );
      if ( i == undefined ) {
        this.questionToEdit = this.QuestionService.getOneQuestion(questionId)
      } else {
        this.questionToEdit = this.questions[i];
      }
      this.categoryToEdit = this.questionToEdit.category;
      this.difficultyToEdit = this.questionToEdit.difficulty;
      console.log(this.questionToEdit);
    }

    public saveQuestion = function (): void {
      console.log(this.questionToEdit);

      this.QuestionService.updateOne(this.questionToEdit);
      let i = this.questions.findIndex( q => { return q.id = this.questionToEdit.id } )
      // .then((data) => {
      //   this.questions.length = 0;
      //   this.QuestionService.getAllQs().$promise.then((data) => {
      //     for (let i = 0; i < data.length; i++ ) {
      //       this.questions.push(data[i]);
      //     }
      //   });
      // });
    }

  }

  angular.module('app').controller('QuestionController', QuestionController);

}