namespace Quizdom.Models {
    export class AvatarModel {
        public Id: number = 0;
        public ImageUrl: string = '';
    }

    export interface IAvatar extends ng.resource.IResource<IAvatar> {
        Id : number;
        ImageUrl : string;
    }

    export interface IAvatarResource extends ng.resource.IResourceClass<IAvatar> {
        
    }
}