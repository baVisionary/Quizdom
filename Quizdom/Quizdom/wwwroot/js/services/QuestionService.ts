// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
namespace Quizdom.Services {

  export class QuestionService {

    static $inject = ['$resource'];

    private _Resource_question = this.$resource('/api/quiz/:questionId', null, {
      'update': {
        method: 'PUT'
      }
    });
    private _Resource_categories = this.$resource('/api/quiz/categories');


    public questions = [];
    public categories = [];
    // public categories = [
    //   "Animals",
    //   "Art",
    //   "Celebrities",
    //   "General Knowledge",
    //   "Geography",
    //   "History",
    //   "Science & Nature",
    //   "Sports",
    //   "Vehicles",
    //   "User Added"
    // ];
    public difficulty = [
      "easy",
      "medium",
      "hard"
    ];
    private _Question: Models.QuestionModel = new Models.QuestionModel();

    constructor(
      private $resource
    ) {
      this.getAllQs();
      this.getAllCats();
    }

    public getAllQs() {
      if (this.questions.length == 0) {
        return this.questions = this._Resource_question.query();
      } else {
        return this.questions;
      }
    }

    public getAllCats() {
      if (this.categories.length == 0) {
        this._Resource_categories.query().$promise.then((data) => {
          this.categories = data.sort();
          return this.categories;
        });
      } else {
        return this.categories;
      }
    }
    
    public sortCategories(a, b): number {
      return ( a == "User Added" ) ? 1 : a - b;
    }

    public getOneQuestionId(questionId: number) {
      return this._Resource_question.get({
        questionId: questionId
      });
    }

    public updateOne(q: Models.QuestionModel) {
      return this._Resource_question.update({
        questionId: q.id
      }, q).$promise;
    }

    public deleteOne(questionId: number) {
      return this._Resource_question.delete({
        questionId: questionId
      }).$promise;
    }

    public newQuestion() {
      return this._Question;
    }

    public createOne(q: Models.QuestionModel) {
      return this._Resource_question.save(q);
    }
  }
}