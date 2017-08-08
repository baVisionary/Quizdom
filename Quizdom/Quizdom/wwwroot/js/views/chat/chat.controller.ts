namespace Quizdom.Views.Chat {

  export class ChatController {
    public posts = [];
    private group = 'MainChatroom';
    // private connection;

    static $inject = [
      'AuthenticationService',
      'HubService',
      '$http',
      '$scope',
    ]

    constructor(
      private AuthenticationService: Services.AuthenticationService,
      private HubService: Services.HubService,
      private $http: ng.IHttpService,
      private $scope: ng.IScope,
    ) {
      // $scope.vm.posts = [];
      // $scope.vm.group = 'MainChatroom';


      $scope.addPost = (post) => {
        console.log('New post from server: ', post);
        this.posts.push(post);
        $scope.$applyAsync();

        console.log(`$scope.vm.posts`, $scope.vm.posts);
        // console.log(`this`, this);        
      }

      this.HubService.startHub();

      // A function we will call from the server
      this.HubService.connection.broadcaster.client.addChatMessage = $scope.addPost;

      // this.HubService.addConnect($scope.group);
      this.HubService.startGroup(this.group)

      this.getPosts();

      // $scope.$on('$destroy', () => {
      //   console.log(`Destroying controller`);
      //   this.HubService.disconnect();
      // })
    }

    public getPosts = () => {
      this.$http<any[]>({ method: 'GET', url: '/Chatroom' })
        .then((response) => {
          this.addPostsList(response.data)
        });
    }

    public addPostsList = (posts: any[]) => {
      this.posts.length = 0;
      posts.forEach(post => {
        this.posts.push(post);
      });
      this.posts.sort((a, b) => { return new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1 })
      // console.log(`$scope`, $scope);
      console.log(this.posts);

    }

    public sendMessage = () => {
      var post = {
        content: $("#textInput").val(),
        userName: this.AuthenticationService.User.userName,
        group: this.group
      };
      this.$http.post<any>('/chatroom/', JSON.stringify(post))
        .then(function () {
          $("#textInput").val("");
        })
        .catch(function (e) {
          console.log(e);
        });

    }

  }
}