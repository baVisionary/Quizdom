namespace Quizdom.Factories {

    AuthenticationInterceptor.$inject = [
        '$q',
        '$location',
        'AuthenticationService'
    ];

    export function AuthenticationInterceptor(
        $q: ng.IQService,
        $location: ng.ILocationService,
        AuthenticationService: Services.AuthenticationService
    ): ng.IHttpInterceptor {

        return <ng.IHttpInterceptor>{
            request: (config: ng.IRequestConfig) => {
                config.headers = config.headers || {};
                let newUser = this.AuthenticationService.User || new Models.AuthUserModel;
                config.headers['Username'] = newUser.userName;
                config.headers['Role'] = (newUser.isAdmin) ? 'Admin' : (newUser.userName == 'Guest') ? 'Guest' : 'Normal';

                return config;
            },
            responseError: (rejection: any) => {
                if (rejection.status === 401 || rejection.status === 403) {
                    $location.path('/login');
                }

                return $q.reject(rejection);
            }            ,
            response: (response: any) => {
                // console.log(response);
                if (response.status === 201) {
                    response.data = { id: angular.fromJson(response.data) }
                }
                return response;
            }
        };
    }
}
