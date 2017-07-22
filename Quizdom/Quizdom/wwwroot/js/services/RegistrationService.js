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
                    .then(function (response) {
                    console.info('User was succesfully created.');
                    return response.data;
                })
                    .catch(function (error) {
                    console.info('User was not created');
                    return error;
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
