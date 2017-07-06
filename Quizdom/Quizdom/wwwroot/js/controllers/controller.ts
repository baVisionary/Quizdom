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

    static $inject = ['QuestionService'];

    constructor(private QuestionService) {
      this.title = "Quiz Questions";
      this.questions = this.QuestionService.getAllQs();
      // this.categories = this.QuestionService.categories;
    }

  }

  angular.module('app').controller('QuestionController', QuestionController);

}