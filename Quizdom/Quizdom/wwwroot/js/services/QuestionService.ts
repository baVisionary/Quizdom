// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading

namespace app.Services {

  class Question {

    public id: number;
    public category: string;
    public type: string;
    public difficulty: string;
    public question: string;
    public correct_Answer: string;
    public incorrect_Answer1: string;
    public incorrect_Answer2: string;
    public incorrect_Answer3: string;
    public incorrect_Answer4: string;
    public source: string;
    public dateModified: object;
    public userId: number;
    public avatarId: number;
    public categoryId: number;

    constructor() {
      this.id = 0;
      this.category = "User Added";
      this.type = "multiple";
      this.difficulty = "";
      this.question = "";
      this.correct_Answer = "";
      this.incorrect_Answer1 = "";
      this.incorrect_Answer2 = "";
      this.incorrect_Answer3 = "";
      this.incorrect_Answer4 = "";
      this.source = "";
      this.dateModified = new Date();
      this.userId = 0;
      this.avatarId = 0;
      this.categoryId = 0;
    }
  }

  export class QuestionService {
    static $inject = ['$resource'];

    private _Resource_question = this.$resource('/api/quiz/:questionId', null, {
      'update': {
        method: 'PUT'
      }
      // ,
      // 'delete': {
      //   method: 'DELETE'
      //   // , transformRequest: []
      //   , data: {'Content-Type': 'application/json'}
      // }
    });

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
      return this._Resource_question.get({
        questionId: questionId
      });
    }

    public updateOne(q) {
      return this._Resource_question.update({
        questionId: q.id
      }, q).$promise;
    }

    public deleteOne(questionId) {
      return this._Resource_question.delete({
        questionId: questionId
      }).$promise;
    }

    public newQuestion() {
      return new Question();
    }

    public createOne(q) {
      return this._Resource_question.save(q);
    }
  }

  angular.module('app').service('QuestionService', QuestionService);

}