// import * as angular from '../../lib/angular/angular.min'

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

    public onViewQuestion(questionId: number, event) {
      // let i = this.questions.findIndex( q => {return q.id == questionId} );
      // console.log(event);
      this.$state.go('questions.view', { id: questionId });
    
    }

    public onHideQuestion() {
    }

    public onEditQuestion(questionId: number) {
      this.$state.go('questions.edit', { id: questionId });
      this.questionToEdit = this.questions[this.questions.findIndex( q => { return q.id == questionId })];
      this.categoryToEdit = this.questions.find( q => { return q.id == questionId }).category;
      this.difficultyToEdit = this.questions.find( q => { return q.id == questionId }).difficulty;
    }

    public addQuestion() {
      let i = Math.max.apply(Math,this.questions.map( o => {return o.id;})) + 1;
      // i = Math.max( 5000, i+1 );
      // console.log(`max id: ${i}`);
      this.questionToEdit = this.QuestionService.newQuestion();
      this.questionToEdit.id = i;
      this.questionToEdit.UserId = "Quizdom User";
      console.log(this.questionToEdit);
      this.$state.go('questions.new');
    }

    public saveNewQuestion() {
      this.QuestionService.createOne(this.questionToEdit).$promise.then(() => {
        this.questions.push(this.QuestionService.getOneQuestionId(this.questionToEdit.id));
      });
      this.$state.go('questions');
    }

    public saveQuestion() {
      console.log(this.questionToEdit);
      this.QuestionService.updateOne(this.questionToEdit);
      this.$state.go('questions.view', { id: this.questionToEdit.id});
    }

    public deleteQuestion(questionId) {
      let i = this.questions.findIndex( q => {return q.id == questionId});
      console.log(`questionId: ${questionId} i: ${i}`);
      this.questions.splice(i, 1);
      // $('.collapsible').collapsible('close', i % 10);
      return this.QuestionService.deleteOne(questionId).then(() => {
        this.$state.go('questions');
      });

    }
  }

  angular.module('app').controller('QuestionController', QuestionController);

    export class QuestionViewController {
      static $inject = ['QuestionService', '$state', '$stateParams'];

      
    }

    angular.module('app').controller('QuestionViewController', QuestionViewController);


}