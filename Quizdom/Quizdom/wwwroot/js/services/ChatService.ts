namespace Quizdom.Services {

  export class ChatService {
    public connection;

    static $inject = [
      '$http'
    ]

    constructor(
      private $http: ng.IHttpService
    ) {

    }

    // Connect to the broadcaster on the server
    public connect() {
      this.connection = (<any>($.connection));
      console.log(this.connection);


      // This console.logs a lot of helpful debugging info!
      this.connection.hub.logging = true;
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

  }
}