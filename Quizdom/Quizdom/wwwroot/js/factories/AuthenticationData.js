var Quizdom;
(function (Quizdom) {
    var Factories;
    (function (Factories) {
        function AuthenticationData() {
            var User;
            return {
                setUser: function (authUser) {
                    User = authUser;
                    console.log(User);
                },
                getUser: function () {
                    console.log(User);
                    return User;
                }
            };
        }
        Factories.AuthenticationData = AuthenticationData;
    })(Factories = Quizdom.Factories || (Quizdom.Factories = {}));
})(Quizdom || (Quizdom = {}));
