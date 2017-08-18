namespace Quizdom.Directives {
    let module: ng.IModule = angular.module('Quizdom.Directives', []);

    module.directive('qzPlayer', Directives.qzPlayer);
    module.directive('qzPlayerChip', Directives.qzPlayerChip);
}