var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Questions;
        (function (Questions) {
            var module = angular.module('View.Questions', []);
            module.config(Questions.Configuration);
            module.controller('QuestionsController', Questions.QuestionsController);
        })(Questions = Views.Questions || (Views.Questions = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
