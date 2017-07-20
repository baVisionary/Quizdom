var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var RegistrationService = (function () {
            function RegistrationService($http, $resource) {
                this.$http = $http;
                this.$resource = $resource;
                this.avatars = [];
                this._Resource_avatars = this.$resource('api/game/avatar');
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
            /**
             * get array of avatars
             */
            RegistrationService.prototype.getAvatars = function () {
                if (this.avatars.length == 0) {
                    this.avatars = this._Resource_avatars.query();
                    this.avatars.$promise.then(function (data) {
                        console.log(data);
                    })
                        .catch(function (error) {
                        console.log("Unable to get avatars - " + error);
                        return [];
                    });
                }
                return this.avatars;
            };
            return RegistrationService;
        }());
        RegistrationService.$inject = [
            '$http',
            '$resource'
        ];
        Services.RegistrationService = RegistrationService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
