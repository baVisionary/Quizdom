namespace Quizdom.Factories {

    AvatarResource.$inject = [
        '$resource'
    ];

    export function AvatarResource(
        $resource: ng.resource.IResourceService
    ): Models.IAvatarResource {
        return <Models.IAvatarResource> $resource('/api/game/avatar/:avatarId');
    }

    
}
