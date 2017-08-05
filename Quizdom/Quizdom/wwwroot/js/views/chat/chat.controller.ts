namespace Quizdom.Views.Chat {
  export class ChatController {

    static $inject = [
      'AuthenticationService',
      '$http',
      '$scope'
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private $http: ng.IHttpService,
      private $scope: ng.IScope
    ) {
      $scope.posts = [];
      $scope.post;

      $scope.connect = (connection, chatroom) => {
        // Let's connect to the hub!
        connection.hub.start().done(function (signalr) {
          console.log('Connected!');
          console.log('SignalR object: ', signalr);
          // The subscribe method lets you subscribe to a specific method on the server
          // You could use this method to subscribe to a specific chatroom,
          // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
          connection.broadcaster.server.subscribe(chatroom);
        }).fail(function (error) {
          // Just in case we fail to connect
          console.log('Failed to start connection! Error: ', error);
        });
      }

      $scope.getPosts = () => {
        this.$http<any[]>({ method: 'GET', url: '/Chatroom' }).then((response) => { $scope.addPostsList(response.data) });
      }

      $scope.addPostsList = (posts: any[]) => {
        posts.forEach(post => {
          // $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
          $scope.posts.push(post);
        });
        $scope.posts.sort((a, b) => { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1 })
        console.log($scope.posts);
      }

      $scope.addPost = (post) => {
        console.log('New post from server: ', post);
        // $("#postsList").append('<li>' + '(' + post.timestamp + ') ' + post.author + ': ' + post.content + '</li>');
        $scope.posts.push(post);
        $scope.$applyAsync();
      }

      $scope.sendMessage = () => {
        var post = {
          content: $("#textInput").val(),
          userName: this.AuthenticationService.User.userName,
          group: 'MainChatroom'
        };
        this.$http.post<any>('/chatroom/', JSON.stringify(post))
          .then(function () {
            $("#textInput").val("");
          })
          .catch(function (e) {
            console.log(e);
          });
      }

      // Connect to the broadcaster on the server
      $scope.connection = (<any>($.connection));

      // A function we will call from the server
      $scope.connection.broadcaster.client.addChatMessage = $scope.addPost;

      // This console.logs a lot of helpful debugging info!
      $scope.connection.hub.logging = true;

      $scope.connect($scope.connection, "MainChatroom");

      $scope.getPosts();
    }

  }
}