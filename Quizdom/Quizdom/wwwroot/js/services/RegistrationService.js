var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var RegistrationService = (function () {
            function RegistrationService($http) {
                this.$http = $http;
            }
            RegistrationService.prototype.registerUser = function (user) {
                return this.$http.post('api/account/register', user, {
                    cache: false
                })
                    .then(function () {
                    console.info('User was succesfully created.');
                    return true;
                })
                    .catch(function () {
                    console.info('User was not created');
                    return false;
                });
            };
            return RegistrationService;
        }());
        RegistrationService.$inject = [
            '$http'
        ];
        Services.RegistrationService = RegistrationService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
