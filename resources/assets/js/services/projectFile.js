angular.module('app.services')
    .service('ProjectFile',['$resource','appConfig','Url',function($resource,appConfig,Url){
        var url = appConfig.baseUrl + Url.getUrlResource(appConfig.urls.projectFile);
        return $resource(url,{
                project_id:'@project_id',
                idfile:'@idFile'}
            ,{
            update: {
                method: 'PUT'
            },
            download: {
                url: appConfig.baseUrl + Url.getUrlResource(appConfig.urls.projectFile) + '/download',
                method: 'GET'
            }
        });
    }])