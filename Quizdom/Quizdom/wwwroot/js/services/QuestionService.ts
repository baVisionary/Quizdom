// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    private _question_resource = this.$resource('/api/quiz');
    public questions = [];

    static $inject = ['$resource'];

    constructor(private $resource) {
      this.getAllQs();
    }

    public getAllQs() {
      this._question_resource.get();
      if (this.questions.length == 0) {
        this._question_resource.get().then((data) => {
          console.log(data);
          return this.questions = data;
        });
      } else {
        return this.questions;
      }
    }

    public getQsByCategory(categoryId) {

    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}