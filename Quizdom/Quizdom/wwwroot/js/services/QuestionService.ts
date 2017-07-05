// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    private _question_resource = this.$resource('/api/quiz');
    public questions = [];
    private _data = {};

    static $inject = ['$resource'];

    constructor(private $resource) {
      this.getAllQs();
    }

    public getAllQs() {
      if (this.questions.length == 0) {
        this.questions = this._question_resource.query()
          console.log(this.questions);
          return this.questions;
      } else {
        return this.questions;
      }
    }

    public getQsByCategory(categoryId) {

    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}