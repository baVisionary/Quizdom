namespace Quizdom.Services {

  export class ChatService {
    public connection;
    public posts: Models.MessageViewModel[] = [];

    static $inject = [
      '$http'
    ]

    constructor(
      private $http: ng.IHttpService
    ) {
      // Connect to the broadcaster on the server
      this.connection = (<any>($.connection));

      // A function we will call from the server
      this.connection.broadcaster.client.addChatMessage = this.addPost;
      this.connection.broadcaster.client.posts = [];

      // This console.logs a lot of helpful debugging info!
      this.connection.hub.logging = true;

      // Let's connect to the hub!
      this.startConnection(this.connection, 'MainChatroom');
    }

    public startConnection(connection, group: string) {

      // Let's connect to the hub!
      connection.hub.start().done(function (signalr) {
        console.log('Connected!');
        console.log('SignalR object: ', signalr);
        // The subscribe method lets you subscribe to a specific method on the server
        // You could use this method to subscribe to a specific chatroom,
        // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
        connection.broadcaster.server.subscribe(group);
      }).fail(function (error) {
        // Just in case we fail to connect
        console.log('Failed to start connection! Error: ', error);
      });
    }

    public getPosts() {
      this.$http<Models.MessageViewModel[]>({ method: 'GET', url: '/Chatroom' }).then((response) => { this.addPostsList(response.data) });
    }

    public addPostsList(pastPosts: Array<Models.MessageViewModel>) {
      pastPosts.forEach(post => {
        this.connection.broadcaster.client.posts.push(post);
      });
      this.posts = this.connection.broadcaster.client.posts;
      console.log(this.posts);
    }

    // the scope of this proxy Method is this.connection.broadcaster
    public addPost(post: Models.MessageViewModel) {
      console.log('New post from server: ', post);
      console.log(this);

      this.client.posts.push(post);
    }

    public sendMessage(messageText) {
      var post = { content: messageText };
      return this.$http.post<any>('/chatroom/', JSON.stringify(post))
    }

  }
}