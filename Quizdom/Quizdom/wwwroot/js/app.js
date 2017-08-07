var Quizdom;
(function (Quizdom) {
    var app = angular.module('app', [
        // Dependencies
        'ui.router',
        'ngResource',
        'angularUtils.directives.dirPagination',
        // 'SignalR',
        // Modules
        'Quizdom.Directives',
        'Quizdom.Factories',
        'Quizdom.Services',
        'Quizdom.Views'
    ]);
    app.controller('AppController', Quizdom.AppController);
    app.config(Quizdom.Configuration);
})(Quizdom || (Quizdom = {}));
