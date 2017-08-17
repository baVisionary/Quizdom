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
    addGameMessage(message: any);
  }

  export class MessageModel {
    content: string = "";
    userName: string = "";
    group: string = "";
    gameId?: number; 
  }

  export interface IMessage extends ng.resource.IResource<IMessage> {
    content: string;
    userName: string;
    group: string;
    gameId?: number;
  }

  export interface IMessageResource extends ng.resource.IResourceClass<IMessage> {
  }
    
}