namespace Quizdom.Views.Chat {
  export class ChatController {
    public showDate: boolean = false;
    
    static $inject = [
      '$http',
      '$scope',
      'ChatService'
      // 'ChatService'
    ]

    constructor(
      private $http: ng.IHttpService,
      private $scope: ng.IScope,
      private ChatService: Services.ChatService
    ) {
      this.ChatService.getPosts();
    }

    public sendMessage() {
      this.ChatService.sendMessage( $("#textInput").val() )
        .then(() => {
          $("#textInput").val("");
        })
        .catch((e) => {
          console.log(e);
        });

    }

  }
}