// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
namespace Quizdom.Services {

  export class QuestionService {

    static $inject = [
      '$resource',
      '$q'
    ];

    constructor(
      private $resource,
      private $q
    ) {
      // this.getAllQs();
      // this.getAllCats();
    }

    private _Resource_question = this.$resource('/api/quiz/:questionId', null, {
      'update': {
        method: 'PUT'
      }
    });
    private _Resource_categories = this.$resource('/api/quiz/categories');

    public questions = [];
    public categories = [];
    public difficulty = [
      "easy",
      "medium",
      "hard"
    ];
    private _Question: Models.QuestionModel = new Models.QuestionModel();

    public getAllQs() {
      if (this.questions.length == 0) {
        this.questions = this._Resource_question.query();
        return this.questions.$promise;
      } else {
        let questions = this.$q.defer();
        questions.resolve(this.questions);
        return questions;
      }
    }

    public getAllCats() {
      if (this.categories.length == 0) {
        this.categories = this._Resource_categories.query();
        return this.categories.$promise;
      } else {
        let categories = this.$q.defer();
        categories.resolve(this.categories);
        console.log(categories);
        return categories;
        
      }
    }

    public sortCategories(a, b): number {
      return (a == "User Added") ? 1 : 0;
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