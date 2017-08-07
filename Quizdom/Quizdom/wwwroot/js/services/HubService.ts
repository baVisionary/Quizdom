// Create the connection to SignalR and store the variable for Chat & Game

namespace Quizdom.Services {

  export class HubService {
    public connection: Models.ISignalRBroadcaster;

    static $inject = [
      '$http'
    ]

    constructor(
      private $http: ng.IHttpService
    ) {

    }

    public startHub = () => {
      // Connect to the broadcaster on the server
      this.connection = this.connection || $.connection;

      // This console.logs a lot of helpful debugging info!
      this.connection.hub.logging = true;

    }

    public startGroup = (group) => {
      let connection = this.connection;

      console.log(`connection.hub.state:`, connection.hub.state);

      // Check if connection already active and kill it to maintain only 1 connection
      if (connection.hub && connection.hub.state === $.signalR.connectionState.connected) {
        connection.hub.stop();
      }

      // Let's connect to the hub!
      connection.hub.start()
        .done(function (signalr) {
          console.log('Connected!');
          console.log('SignalR object: ', signalr);
          console.log(`connection.hub.state:`, connection.hub.state);

          // The subscribe method lets you subscribe to a specific method on the server
          // You could use this method to subscribe to a specific chatroom,
          // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
          connection.broadcaster.server.subscribe(group);
        }).fail(function (error) {
          // Just in case we fail to connect
          console.log('Failed to start connection! Error: ', error);
        });

    }

    public disconnect = () => {
      this.connection.hub.stop()
    }

  }
}