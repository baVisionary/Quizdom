namespace Quizdom.Views.Questions {
  export class QuestionsController {
    public title: string;
    // rewrite to remove controller variables for questions & categories
    // public questions;
    // public categories: string[];

    public category: string;
    public difficulty: string;
    public search: string;
    public questionToEdit;
    private preDelete: boolean;
    private deleteText: string;

    static $inject = [
      'QuestionService',
      'AuthenticationService',
      '$state',
      '$q'
    ];

    constructor(
      private QuestionService: Services.QuestionService,
      private AuthenticationService: Services.AuthenticationService,
      private $state,
      private $q
    ) {
      this.title = "Quiz Questions";
      this.QuestionService.getAllQs();
      this.QuestionService.getAllCats();
      this.QuestionService.getAllCatIds();
      this.preDelete = false;
      this.deleteText = "Delete";
    }

    public onViewQuestion() {
      this.preDelete = false;
      this.deleteText = 'Delete';
      this.$state.go('Questions');
    }

    public addQuestion() {
      let i = Math.max.apply(Math, this.QuestionService.questions.map(o => { return o.id; })) + 1;
      this.questionToEdit = this.QuestionService.newQuestion();
      this.questionToEdit.id = i;
      this.questionToEdit.UserId = this.AuthenticationService.User.userName;
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
      console.log(`QuestionToEdit`, this.questionToEdit);
      this.questionToEdit.dateModified = new Date();
      this.questionToEdit.categoryId = this.QuestionService.allCategories.find(cat => { return this.questionToEdit.category == cat.longDescription }).id;
      this.QuestionService.updateOne(this.questionToEdit)
        .then(() => {
          let i = this.QuestionService.questions.findIndex(q => { return q.id == this.questionToEdit.id })
          this.QuestionService.questions[i] = angular.copy(this.questionToEdit);
          this.$state.go('Questions');
        });
    }

    public deleteQuestion(questionId) {
      if (this.preDelete) {
        return this.QuestionService.deleteOne(questionId).then(() => {
          let i = this.QuestionService.questions.findIndex(q => { return q.id == questionId });
          console.log(`questionId: ${questionId} i: ${i}`);
          this.QuestionService.questions.splice(i, 1);
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
      this.questionToEdit.dateModified = new Date();
      this.questionToEdit.categoryId = this.QuestionService.allCategories.find(cat => { return this.questionToEdit.category == cat.longDescription }).id;
      this.QuestionService.createOne(this.questionToEdit).$promise
        .then((newQuestion) => {
          this.QuestionService.questions.push(this.QuestionService.getOneQuestionId(this.questionToEdit.id));
          this.category = this.questionToEdit.category;
          this.$state.go('Questions');
        });
    }
  }
}