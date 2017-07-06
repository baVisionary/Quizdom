var app;
(function (app) {
    angular.module('app', [
        'ui.router',
        'ngResource',
        'angularUtils.directives.dirPagination'
    ]);
})(app || (app = {}));
