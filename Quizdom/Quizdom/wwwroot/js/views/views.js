var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        angular.module('Quizdom.Views', [
            // Required SubModules
            'View.Welcome',
            'View.Register',
            'View.Login',
            'View.ForgotPassword',
            'View.Questions'
        ]);
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
