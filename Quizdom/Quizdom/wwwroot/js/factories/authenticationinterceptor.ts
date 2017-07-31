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
                let authUser = AuthenticationService.getUser() || new Models.UserModel;                
                config.headers['Username'] = authUser.userName;
                config.headers['Role'] = (authUser.isAdmin) ? 'Admin' : (authUser.userName == 'Guest') ? 'Guest' : 'Normal';

                return config;
            },
            // response: (response) => {
            //     if (response.status === 204) {
            //         response.data = {status: 204};
            //     }

            //     return $q.resolve(response);
            // },
            responseError: (rejection: any) => {
                if (rejection.status === 401 || rejection.status === 403) {
                    $location.path('/login');
                }

                return $q.reject(rejection);
            }
        };
    }
}
