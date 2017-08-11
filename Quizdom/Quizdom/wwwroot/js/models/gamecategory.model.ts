namespace Quizdom.Models {
    export class GameCategory {
      public id: number = 0;
      public gameId: number;
      public categoryId: number;
    }

    export interface IGameCategory extends ng.resource.IResource<IGameCategory> {
      id?: number;
      gameId: number;
      categoryId: number;
    }

    export interface IGameCategoryResource extends ng.resource.IResourceClass<IGameCategory> {
      update(IGame): IGame; 
    }
}