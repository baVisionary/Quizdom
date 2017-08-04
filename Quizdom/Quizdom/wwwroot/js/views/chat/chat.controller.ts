namespace Quizdom.Views.Chat {
  export class ChatController {
    public showDate: boolean = false;
    // public posts: Models.MessageViewModel[];
    // public chatroom: string = 'MainChatroom';

    static $inject = [
      '$http',
      '$scope',
      'ChatService',
      'AuthenticationService'
      // 'ChatService'
    ]

    constructor(
      private $http: ng.IHttpService,
      private $scope: any,
      private ChatService: Services.ChatService,
      private AuthenticationService: Services.AuthenticationService
    ) {
      $scope.posts = [];
      $scope.post;
      $scope.chatroom = 'MainChatroom';

      $scope.getPosts = () => {
        this.$http<Models.MessageViewModel[]>({ method: 'GET', url: '/Chatroom' }).then((response) => { $scope.addPostsList(response.data) });
      }

      $scope.addPostsList = (pastPosts: Models.MessageViewModel[]) => {
        pastPosts.forEach(post => {
          $scope.posts.push(post);
        });
        console.log('$scope.posts', $scope.posts);
      }

      $scope.sendMessage = () => {
        console.log($scope);

        $scope.post = { Chatroom: $scope.chatroom, UserName: this.AuthenticationService.User.userName, Content: $("#textInput").val() };

        console.log($scope.post);
        this.$http.post<any>('/chatroom/', JSON.stringify($scope.post))
          .then(() => {
            $("#textInput").val("");
          })
          .catch((e) => {
            console.log(e);
          });
      }

      // the scope of this proxy Method is this.connection.broadcaster
      $scope.addPost = (post: Models.MessageViewModel) => {
        console.log('New post from server: ', post);

        console.log('$scope:', $scope);
        // console.log('this:', this);

        $scope.posts.push(post);
      }


      // Connect to the broadcaster on the server
      this.ChatService.connect();

      // A function we will call from the server
      this.ChatService.connection.broadcaster.client.addChatMessage = $scope.addPost;
      // this.ChatService.connection.broadcaster.client.posts = [];

      // Let's connect to the hub!
      this.ChatService.startConnection(this.ChatService.connection, $scope.chatroom);

      $scope.getPosts($scope);
    }

    //     public getPosts($scope) {
    //   this.$http<Models.MessageViewModel[]>({ method: 'GET', url: '/Chatroom' }).then((response) => { this.addPostsList($scope, response.data) });
    // }

    //     public addPostsList($scope, pastPosts: Models.MessageViewModel[]) {
    //   pastPosts.forEach(post => {
    //     $scope.posts.push(post);
    //   });
    //   console.log('$scope.posts', $scope.posts);
    // }

    //     public sendMessage($scope) {
    //   console.log($scope);

    //   $scope.post = { Chatroom: this.chatroom, UserName: this.AuthenticationService.User.userName, Content: $("#textInput").val() };

    //   console.log($scope.post);
    //   this.$http.post<any>('/chatroom/', JSON.stringify($scope.post))
    //     .then(() => {
    //       $("#textInput").val("");
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // }

    //     // the scope of this proxy Method is this.connection.broadcaster
    //     public addPost(post: Models.MessageViewModel) {
    //   console.log('New post from server: ', post);

    //   // console.log('$scope:', $scope);
    //   console.log('this:', this);

    //   this.$scope.posts.push(post);
    // }


  }
}