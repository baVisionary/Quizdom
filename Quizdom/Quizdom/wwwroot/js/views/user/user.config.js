var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var User;
        (function (User) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('User', {
                    url: '/player',
                    templateUrl: 'js/views/user/user.html',
                    controller: 'UserController',
                    controllerAs: 'vm'
                });
            }
            User.Configuration = Configuration;
        })(User = Views.User || (Views.User = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
