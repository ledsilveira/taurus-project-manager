var app = angular.module('app',[
    'ngRoute','angular-oauth2','app.controllers','app.services','app.filters','app.directives',
    'ui.bootstrap.typeahead', // importa do angular bootstrap o autocomplete, as outras funcionalidade nao sao importadas
    'ui.bootstrap.datepicker', // carrega o datepicker ui
    'ui.bootstrap.tpls', // importa templates do auto complete (typeahead)
    'ngFileUpload', // importa a lib de upload de arquivo
    'mgcrea.ngStrap.navbar','ui.bootstrap.dropdown','ui.bootstrap.modal',
    'http-auth-interceptor'
]);

angular.module('app.controllers',['ngMessages','angular-oauth2']);
angular.module('app.filters',[]);
angular.module('app.directives',[]);
angular.module('app.services',['ngResource']);

//provider para setar configura��es da app
app.provider('appConfig',['$httpParamSerializerProvider',function($httpParamSerializerProvider){
   var config = {
      baseUrl: 'http://localhost:8080/taurus-project-manager/public',
      project: {
            status:[
                {value:1,label:'N�o Iniciado'},
                {value:2,label:'Iniciado'},
                {value:3,label:'Conclu�do'}
            ]
      },
      projectTask:{
        status:[
            {value:1,label:'Incompleta'},
            {value:2,label:'Completa'}
        ]
      },
      urls: {
        projectFile: '/project/{{project_id}}/file/{{idFile}}'
      },
      utils: {
           transformRequest: function(data){
                if(angular.isObject(data)){
                    return $httpParamSerializerProvider.$get()(data);
                }
               return data;
           },
           //somente quando for retorno em json e com o objeto data
           transformResponse: function(data,headers){
               //pega o conteudo que esta em data e retorna
               //verifica se o header � json
               var headresGetter = headers();
               if(headresGetter['content-type'] == 'application/json' ||
                   headresGetter['content-type'] == 'text/json')
               {
                   var dataJson = JSON.parse(data);
                   //verifica se veio propriedade data
                   if( dataJson.hasOwnProperty('data')){
                       dataJson = dataJson.data;
                   }
                   return dataJson;
               }
               return data;
           }
       }
   };
    return {
        config:config,
        $get: function(){
            return config;
        }
    }
}]);
/**
 * Dentro do config soh pode receber rotas, aqui serao definidas as rotas
 */
app.config([
    '$routeProvider','$httpProvider','OAuthProvider','OAuthTokenProvider',
    'appConfigProvider',
    function($routeProvider,$httpProvider,OAuthProvider,
             OAuthTokenProvider,appConfigProvider){

        //faz o metodo post  e put aceitar o form urlencoded
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        //sobrescrevendo o que exist no resource (transformer dos dados)
        $httpProvider.defaults.transformResponse = appConfigProvider.config.utils.transformResponse;
        $httpProvider.defaults.transformRequest = appConfigProvider.config.utils.transformRequest;

        //removendo os 2 interceptors declarados pelo app para usar somente o nosso
        $httpProvider.interceptors.splice(0,1);
        $httpProvider.interceptors.splice(0,1);
        //intercepta o oauth para ajustar o problmea da lib php para refresh token
        $httpProvider.interceptors.push('oauthFixInterceptor');

        $routeProvider
        .when('/',{
                templateUrl:'build/views/login.html',
                controller:'LoginController'
        })
        .when('/login',{
            templateUrl:'build/views/login.html',
            controller:'LoginController'
        })
        .when('/logout',{
            resolve: {
                logout: ['$location','OAuthToken', function($location, OAuthToken){
                    OAuthToken.removeToken();
                    return $location.path('/login');
                }]
            }
        })
        .when('/home',{
            templateUrl:'build/views/home.html',
            controller:'HomeController'
        })
        .when('/clients',{
            templateUrl:'build/views/client/list.html',
            controller:'ClientListController'
        })
        .when('/client/new',{
            templateUrl:'build/views/client/new.html',
            controller:'ClientNewController'
        })
        .when('/client/:id/show',{
            templateUrl:'build/views/client/listone.html',
            controller:'ClientEditController'
        })
        .when('/client/:id/edit',{
            templateUrl:'build/views/client/edit.html',
            controller:'ClientEditController'
        })
        .when('/client/:id/remove',{
            templateUrl:'build/views/client/remove.html',
            controller:'ClientRemoveController'
        })
        .when('/painel',{
            templateUrl:'build/views/project/painel.html',
            controller:'ProjectListController'
        })
        .when('/projects',{
            templateUrl:'build/views/project/list.html',
            controller:'ProjectListController'
        })
        .when('/project/new',{
            templateUrl:'build/views/project/new.html',
            controller:'ProjectNewController'
        })
        .when('/project/:id/edit',{
            templateUrl:'build/views/project/edit.html',
            controller:'ProjectEditController'
        })
        .when('/project/:id/remove',{
            templateUrl:'build/views/project/remove.html',
            controller:'ProjectRemoveController'
        })
        .when('/project/:project_id/notes',{
            templateUrl:'build/views/project-note/list.html',
            controller:'ProjectNoteCrudController'
        })
        .when('/project/:project_id/notes/:idnote/show',{
            templateUrl:'build/views/project-note/listone.html',
            controller:'ProjectNoteEditController'
        })
        .when('/project/:project_id/notes/new',{
            templateUrl:'build/views/project-note/new.html',
            controller:'ProjectNoteNewController'
        })
        .when('/project/:project_id/notes/:idnote/edit',{
            templateUrl:'build/views/project-note/edit.html',
            controller:'ProjectNoteEditController'
        })
        .when('/project/:project_id/notes/:idnote/remove',{
            templateUrl:'build/views/project-note/remove.html',
            controller:'ProjectNoteRemoveController'
        })
        .when('/project/:project_id/files',{
            templateUrl:'build/views/project-file/list.html',
            controller:'ProjectFileListController'
        })
        .when('/project/:project_id/files/new',{
            templateUrl:'build/views/project-file/new.html',
            controller:'ProjectFileNewController'
        })
        .when('/project/:project_id/files/:idFile/edit',{
            templateUrl:'build/views/project-file/edit.html',
            controller:'ProjectFileEditController'
        })
        .when('/project/:project_id/files/:idFile/remove',{
            templateUrl:'build/views/project-file/remove.html',
            controller:'ProjectFileRemoveController'
        })
        .when('/project/:project_id/tasks',{
            templateUrl:'build/views/project-task/list.html',
            controller:'ProjectTaskListController'
        })
        .when('/project/:project_id/task/new',{
            templateUrl:'build/views/project-task/new.html',
            controller:'ProjectTaskNewController'
        })
        .when('/project/:project_id/task/:idTask/edit',{
            templateUrl:'build/views/project-task/edit.html',
            controller:'ProjectTaskEditController'
        })
        .when('/project/:project_id/task/:idTask/remove',{
            templateUrl:'build/views/project-task/remove.html',
            controller:'ProjectTaskRemoveController'
        })
        .when('/project/:project_id/members',{
            templateUrl:'build/views/project-member/list.html',
            controller:'ProjectMemberListController'
        })
        .when('/project/:project_id/member/:idMember/remove',{
            templateUrl:'build/views/project-member/remove.html',
            controller:'ProjectMemberRemoveController'
        });
    OAuthProvider.configure({
        baseUrl: appConfigProvider.config.baseUrl,
        clientId: '4aea09da27fdc71b8252d08b04c1fc0c6a5c7cd1',
        clientSecret: 'avai',
        grantPath: 'oauth/access_token'
    });

    //permite trabalhar sem https @todo n�o deve ser usado em producao
    OAuthTokenProvider.configure({
        name: 'token',
        options:{
            secure:false
        }
    })
}]);

app.run(['$rootScope','$location','$http', '$modal', 'httpBuffer', 'OAuth',
    function($rootScope, $location, $http,$modal, httpBuffer,OAuth) {

    //autorizacao, quando nao logado volta sempre para pagina de login
    $rootScope.$on('$routeChangeStart',function(event, next,current) {
        if(next.$$route.originalPath !='/login') {
            if(!OAuth.isAuthenticated()){
                $location.path('login');
            }
        }
    });

    $rootScope.$on('oauth:error', function(event, data) {
        // Ignore `invalid_grant` error - should be catched on `LoginController`.
        if ('invalid_grant' === data.rejection.data.error) {
            return;
        }

        // Refresh token when a `invalid_token` error occurs.
        if ('access_denied' === data.rejection.data.error) {
            httpBuffer.append(data.rejection.config, data.deferred);
            if( !$rootScope.loginModalOpened) {
                var modalInstance = $modal.open({
                    templateUrl: 'build/views/templates/loginModal.html',
                    controller: 'LoginModalController'
                });
                $rootScope.loginModalOpened = true;
            }
            return;
        }

        // Redirect to `/login` with the `error_reason`.
        return $location.path('login');
    });
}]);