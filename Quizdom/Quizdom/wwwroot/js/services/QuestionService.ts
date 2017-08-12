// Accessing questions
// All CRUD on questions - searching, displaying, and pre-loading
namespace Quizdom.Services {

  export class QuestionService {

    public questions = [];
    public categories = [];
    public difficulty = [
      "easy",
      "medium",
      "hard"
    ];
    private _Question: Models.QuestionModel = new Models.QuestionModel();

    static $inject = [
      '$resource',
      '$q'
    ];

    constructor(
      private $resource: ng.resource.IResourceService,
      private $q: ng.IQService
    ) {
      // this.getAllQs();
      // this.getAllCats();
    }

    private _Resource_question = <Models.IQuestionResource> this.$resource('/api/quiz/:questionId', null, {
      'update': {
        method: 'PUT'
      }
    });
    private _Resource_categories = <ng.resource.IResourceClass<ng.resource.IResource<string>>> this.$resource('/api/quiz/categories');

    private _Resource_Qs_by_category = <Models.IQuestionResource> this.$resource('api/quiz/category/:category', null, {
      'diff': {
        method: 'GET',
        isArray: true,
        url: 'api/quiz/category/:category/difficulty/:difficulty',
        // params: {category: '@longDescription', difficulty: '@difficulty'}
      }
    })

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

    public getQsByCategory(cat: string) {
      return this._Resource_Qs_by_category.query({ category: cat });
    }

    public getQsByCatAndDiff(cat: string, diff: string) {
      return this._Resource_Qs_by_category.diff({ category: cat, difficulty: diff });
    }

    public sortCategories(a, b): number {
      return (a == "User Added") ? 1 : 0;
    }

    public getOneQuestionId(questionId: number) {
      return this._Resource_question.get({
        questionId: questionId
      });
    }

    public updateOne(question: Models.IQuestion) {
      return this._Resource_question.update({
        questionId: question.id
      }, question).$promise;
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