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
    static $inject = ['QuestionService', '$state', '$stateParams'];

    public title;
    public questions;
    public category;
    public difficulty;
    public search;
    public questionToEdit;
    public categoryToEdit;
    public difficultyToEdit;

    constructor(private QuestionService, private $state) {
      this.title = "Quiz Questions";
      this.questions = this.QuestionService.getAllQs();
    }

    public onHideQuestion() {
      this.$state.go('questions.view', { id: this.questionToEdit.id});
    }

    public onViewQuestion(questionId: number) {
      this.$state.go('questions.view', { id: questionId });
    }

    public addQuestion() {
      let i = Math.max.apply(Math,this.questions.map( o => {return o.id;}))
      console.log(`max id: ${i}`)
      this.$state.go('questions.new', { id: i+1 });
    }

    public onEditQuestion(questionId: number) {
      this.$state.go('questions.edit', { id: questionId });
      this.questionToEdit = this.questions[this.questions.findIndex( q => { return q.id == questionId })];
      this.categoryToEdit = this.questions.find( q => { return q.id == questionId }).category;
      this.difficultyToEdit = this.questions.find( q => { return q.id == questionId }).difficulty;
    }

    public saveQuestion() {
      this.QuestionService.updateOne(this.questionToEdit);
      this.$state.go('questions.view', { id: this.questionToEdit.id});
    }

    public deleteQuestion(questionId: number) {
      this.QuestionService.deleteOne(questionId);
    }

  }

  angular.module('app').controller('QuestionController', QuestionController);

}