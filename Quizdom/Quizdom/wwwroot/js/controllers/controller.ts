namespace app.Controllers {

  export class WelcomeController {
    public title;
    public description;
    
    constructor() {
      this.title = "Welcome to Quizdom";
      this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers."
    }
  }

  export class QuestionController {
    public questions;
    public title;

    static $inject = ['questionService'];

    constructor(private questionService) {
      this.title =  "Question form";
      this.questions = this.questionService.getAllQs();
    }


  }

}