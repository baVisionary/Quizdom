var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            var module = angular.module('View.Setup', []);
            module.config(Setup.Configuration);
            module.controller('SetupController', Setup.SetupController);
        })(Setup = Views.Setup || (Views.Setup = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
