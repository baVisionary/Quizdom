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
                    .state('Questions', {
                    url: '/questions',
                    templateUrl: 'js/views/questions/questions.html',
                    controller: 'QuestionsController',
                    controllerAs: 'vm'
                })
                    .state('Questions.edit', {
                    url: '/edit/:id',
                    views: {
                        'detail': {
                            templateUrl: 'js/views/questions/question-edit.html'
                        }
                    }
                })
                    .state('Questions.new', {
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
