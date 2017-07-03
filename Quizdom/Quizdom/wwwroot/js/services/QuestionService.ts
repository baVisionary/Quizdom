// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    private _question_resource = this.$resource('/api/quiz');

    static $inject= ['$resource'];

    constructor(private $resource) {}

    public getAllQs() {
      return this._question_resource.get();
    }
  }

  angular.module('app').service('questionService', QuestionService);

}