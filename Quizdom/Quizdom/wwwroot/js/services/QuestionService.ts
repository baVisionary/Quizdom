// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    private _question_resource = this.$resource('/api/quiz');
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
    private _category = 0;
    private _new_question = {};

    static $inject = ['$resource'];

    constructor(private $resource) {
      this.getAllQs();
    }

    public getAllQs() {
      if (this.questions.length == 0) {
        this.questions = this._question_resource.query();
        return this.questions;
      } else {
        return this.questions;
      }
    }

    public getQsByCategory(categoryId) {
      if (this._category != categoryId) {
        this._category = categoryId;
        this._question_resource += `/category/${categoryId}`;
        this.questions = this._question_resource.query();
        return this.questions;
      } else {
        return this.questions;
      }
    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}