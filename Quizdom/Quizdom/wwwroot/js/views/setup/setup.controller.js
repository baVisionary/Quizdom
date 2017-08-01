var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Setup;
        (function (Setup) {
            var SetupController = (function () {
                function SetupController(AuthenticationService) {
                    this.AuthenticationService = AuthenticationService;
                }
                SetupController.$inject = [
                    'AuthenticationService'
                ];
                return SetupController;
            }());
            Setup.SetupController = SetupController;
        })(Setup = Views.Setup || (Views.Setup = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
