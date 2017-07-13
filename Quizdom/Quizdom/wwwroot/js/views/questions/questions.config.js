var Quizdom;
(function (Quizdom) {
    var Views;
    (function (Views) {
        var Questions;
        (function (Questions) {
            Configuration.$inject = [
                '$stateProvider'
            ];
            function Configuration($stateProvider) {
                $stateProvider
                    .state('questions', {
                    url: '/questions',
                    templateUrl: 'js/views/questions/questions.html',
                    controller: 'QuestionsController',
                    controllerAs: 'vm'
                })
                    .state('questions.edit', {
                    url: '/edit/:id',
                    views: {
                        'detail': {
                            templateUrl: 'js/views/questions/question-edit.html'
                        }
                    }
                })
                    .state('questions.new', {
                    url: '/new',
                    views: {
                        'new': {
                            templateUrl: 'js/views/questions/question-new.html'
                        }
                    }
                });
            }
            Questions.Configuration = Configuration;
        })(Questions = Views.Questions || (Views.Questions = {}));
    })(Views = Quizdom.Views || (Quizdom.Views = {}));
})(Quizdom || (Quizdom = {}));
