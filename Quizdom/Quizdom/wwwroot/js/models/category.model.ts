namespace Quizdom.Models {
    export class Category {
      public id: number = 0;
      public shortDescription: string;
      public longDescription: string;
    }

    export interface ICategory extends ng.resource.IResource<ICategory> {
      id?: number;
      shortDescription: string;
      longDescription: string;
      categoryId?: number;
    }

    export interface ICategoryResource extends ng.resource.IResourceClass<ICategory> {
      update(IGame): IGame; 
    }
}