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

    public questions = [];
    public categories = [
      "Animals",
      "Art",
      "Celebrities",
      "General Knowledge",
      "Geography",
      "History",
      "Science & Nature",
      "Sports",
      "Vehicles",
      "User Added"
    ];
    public difficulty = [
      "easy",
      "medium",
      "hard"
    ];
    private _Question: Models.QuestionModel = new Models.QuestionModel();

    constructor(
      private $resource,
    ) {
      this.getAllQs();
    }

    public getAllQs() {
      if (this.questions.length == 0) {
        this.questions = this._Resource_question.query();
        return this.questions;
      } else {
        return this.questions;
      }
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