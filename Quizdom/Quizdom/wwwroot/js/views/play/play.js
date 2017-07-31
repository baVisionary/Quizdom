var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Play;
        (function (Play) {
            var module = angular.module('View.Play', []);
            module.config(Play.Configuration);
            module.controller('PlayController', Play.PlayController);
        })(Play = Views.Play || (Views.Play = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
