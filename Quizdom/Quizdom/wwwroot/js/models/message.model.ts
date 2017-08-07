namespace Quizdom.Models {
  export interface ISignalRBroadcaster extends SignalR {
    broadcaster?: IBroadcaster;
  }

  export interface IBroadcaster {
    client: IClient;
    server: any;
  }

  export interface IClient {
    addChatMessage(message: any);
  }

  export class MessageModel {
    content: string = "";
    userName: string = "";
    group: string = "MainChatroom";
  }
}