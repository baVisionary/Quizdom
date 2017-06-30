var app;
(function (app) {
    var Controllers;
    (function (Controllers) {
        var WelcomeController = (function () {
            function WelcomeController() {
                this.title = "Welcome to Quizdom (Angular)";
            }
            return WelcomeController;
        }());
        Controllers.WelcomeController = WelcomeController;
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
