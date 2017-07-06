// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  export class QuestionService {
    private _question_resource = this.$resource('/api/quiz/:questionId');
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
    private _new_question;

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

    public getOneQuestionId(questionId) {
      this._new_question = this._question_resource.get({questionId: questionId});
      return this._new_question;
    }

    public updateOneQuestion(question) {
      this._new_question = this.$resource('/api/quiz/:questionId', {questionId: question.id}, question);
      this._new_question.$save();
      return this._new_question;
    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}