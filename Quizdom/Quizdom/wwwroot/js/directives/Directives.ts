namespace Quizdom.Directives {
    let module: ng.IModule = angular.module('Quizdom.Directives', []);

    module.directive('qzPlayerCard', Directives.qzPlayerCard);
    module.directive('qzPlayerChip', Directives.qzPlayerChip);
}