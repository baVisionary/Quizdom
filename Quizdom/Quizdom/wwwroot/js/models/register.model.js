var Quizdom;
(function (Quizdom) {
    var Models;
    (function (Models) {
        var RegisterModel = (function () {
            function RegisterModel() {
                this.email = '';
                this.password = '';
                this.confirmPassword = '';
            }
            return RegisterModel;
        }());
        Models.RegisterModel = RegisterModel;
    })(Models = Quizdom.Models || (Quizdom.Models = {}));
})(Quizdom || (Quizdom = {}));
