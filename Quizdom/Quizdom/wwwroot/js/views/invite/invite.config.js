var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Invite;
        (function (Invite) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('Invite', {
                    url: '/invite',
                    templateUrl: 'js/views/invite/invite.html',
                    controller: 'InviteController',
                    controllerAs: 'vm'
                });
            }
            Invite.Configuration = Configuration;
        })(Invite = Views.Invite || (Views.Invite = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
