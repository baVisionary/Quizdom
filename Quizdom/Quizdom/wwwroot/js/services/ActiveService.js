var Quizdom;
(function (Quizdom) {
    var Services;
    (function (Services) {
        var ActiveService = (function () {
            function ActiveService($resource) {
                this.$resource = $resource;
                this._activeUsers = [];
                this._Resource_active = this.$resource('/api/Account/getactiveusers');
            }
            ActiveService.prototype.getActiveUsers = function () {
                this._activeUsers = this._Resource_active.query();
                return this._activeUsers.$promise;
            };
            Object.defineProperty(ActiveService.prototype, "ActiveUsers", {
                get: function () {
                    return this._activeUsers;
                },
                enumerable: true,
                configurable: true
            });
            return ActiveService;
        }());
        ActiveService.$inject = [
            '$resource'
        ];
        Services.ActiveService = ActiveService;
    })(Services = Quizdom.Services || (Quizdom.Services = {}));
})(Quizdom || (Quizdom = {}));
