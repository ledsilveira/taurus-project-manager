angular.module('app.controllers')
    .controller('ProjectTaskNewController',[
        '$scope','$location','$routeParams','ProjectTask','appConfig',
            function($scope,$location,$routeParams,ProjectTask,appConfig){
            $scope.task = new ProjectTask();
            $scope.status = appConfig.projectTask.status;

            $scope.start_date = {
                status: {
                    opened: false
                }
            };
            $scope.due_date = {
                status: {
                    opened: false
                }
            };

            $scope.openStartDatePicker = function($event) {
                $scope.start_date.status.opened = true;
            };

            $scope.openDueDatePicker = function($event) {
                $scope.due_date.status.opened = true;
            };

            //poderia fazer assim pra usar referÍncia indireta
            $scope.task.project_id = $routeParams.project_id;
            $scope.save = function() {
                if($scope.form.$valid)
                {
                    $scope.task.$save().then(function(){
                        $location.path('/project/'+$routeParams.project_id+'/tasks');
                    });
                }
            }

        }]);