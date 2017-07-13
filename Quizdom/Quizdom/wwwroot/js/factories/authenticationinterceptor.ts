namespace Quizdom.Factories {

    AuthenticationInterceptor.$inject = [
        '$q',
        '$location'
    ];

    export function AuthenticationInterceptor(
        $q: ng.IQService,
        $location: ng.ILocationService
    ): ng.IHttpInterceptor {
        
        return <ng.IHttpInterceptor>{
            request: (config: ng.IRequestConfig) => {
                config.headers = config.headers || {};
                config.headers['X-Requested-With'] = 'XMLHttpRequest';

                return config;
            },
            responseError: (rejection: any) => {
                if (rejection.status === 401 || rejection.status === 403) {
                    $location.path('/login');
                }

                return $q.reject(rejection);
            }
        };
    }
}
