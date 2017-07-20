namespace Quizdom.Views.Questions {
  export class QuestionsController {
    static $inject = [
      'QuestionService',
      '$state',
      '$stateParams'
    ];

    public title: string;
    public questions;
    public categories;
    public category: string;
    public difficulty: string;
    public search: string;
    public questionToEdit;
    private preDelete: boolean;
    private deleteText: string;
    

    constructor(
      private QuestionService: Services.QuestionService,
      private $state
    ) {
      this.title = "Quiz Questions";
      this.questions = this.QuestionService.getAllQs();
      this.categories = this.QuestionService.getAllCats();
      this.preDelete = false;
      this.deleteText = "Delete";
    }

    public onViewQuestion() {
      this.preDelete = false;
      this.deleteText = 'Delete';
      this.$state.go('Questions');
    }

    public addQuestion() {
      let i = Math.max.apply(Math, this.questions.map(o => { return o.id; })) + 1;
      this.questionToEdit = this.QuestionService.newQuestion();
      this.questionToEdit.id = i;
      this.questionToEdit.UserId = "Quizdom User";
      console.log(this.questionToEdit);
      this.$state.go('Questions.new');
    }

    public onEditQuestion(q: object) {
      this.questionToEdit = angular.copy(q);
      this.preDelete = false;
      console.log(this.questionToEdit);
      this.$state.go('Questions.edit', { id: this.questionToEdit.id });
    }

    public saveQuestion() {
      console.log(this.questionToEdit);
      this.questionToEdit.dateModified = new Date();
      this.QuestionService.updateOne(this.questionToEdit).then(() => {
        let i = this.questions.findIndex(q => { return q.id == this.questionToEdit.id })
        this.questions[i] = angular.copy(this.questionToEdit);
        this.$state.go('Questions');
      });
    }

    public deleteQuestion(questionId) {
      if (this.preDelete) {
        return this.QuestionService.deleteOne(questionId).then(() => {
          let i = this.questions.findIndex(q => { return q.id == questionId });
          console.log(`questionId: ${questionId} i: ${i}`);
          this.questions.splice(i, 1);
          this.preDelete = false;
          this.$state.go('Questions');
        });
      } else {
        this.preDelete = true;
        this.deleteText = 'Really Delete';
      }
    }

    public doNotDelete() {
      this.preDelete = false;
      this.deleteText = "Delete";
    }

    public saveNewQuestion() {
      this.QuestionService.createOne(this.questionToEdit).$promise.then(() => {
        this.questions.push(this.QuestionService.getOneQuestionId(this.questionToEdit.id));
        this.search = this.questionToEdit.id;
        this.$state.go('Questions');
      });
    }
  }
}