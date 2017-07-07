// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    static $inject = ['$resource'];

    private _Resource_question = this.$resource('/api/quiz/:questionId', null, {'update': {method: 'PUT'}});

    public questions = [];
    private _oneQuestion = {};
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


    constructor(private $resource) {
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

    public getOneQuestionId(questionId) {
      return this._Resource_question.get({ questionId: questionId });
    }

    public updateOne(q) {
      return this._Resource_question.update({questionId: q.id}, q).$promise;
    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}