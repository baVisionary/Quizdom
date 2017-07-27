namespace Quizdom.Views.Welcome {

  export class WelcomeController {
    public title;
    public description;

    static $inject = [
      'AvatarService',
      'QuestionService',
      'FriendService'
    ]

    constructor(
      private AvatarService: Services.AvatarService,
      private QuestionService: Services.QuestionService,
      private FriendService: Services.FriendService
    ) {
      this.title = "Welcome to Quizdom";
      this.description = "Play to learn your favorite topics in a gameshow with your friends or total strangers.";

      this.AvatarService.getAllAvatars();
      this.QuestionService.getAllQs();
      this.QuestionService.getAllCats();
    }
  }
}