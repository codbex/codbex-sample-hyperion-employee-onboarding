angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http) => {

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };

    const employeeId = new URLSearchParams(window.location.search).get('employeeId');
    const processInstanceId = new URLSearchParams(window.location.search).get('processId');

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/api/TaskCompletionFormService.ts/tasksData/" + employeeId;
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/api/TaskCompletionFormService.ts/completeTask/" + processInstanceId;

    $http.get(tasksUrl)
        .then(response => {
            $scope.taskList = response.data;
            $scope.completed = response.data.length === 0;
        })
        .catch(function (error) {
            console.error("Error getting task data: ", error);
        });

    $scope.completeTask = function (task) {
        $http.post(completeTaskUrl, task)
            .then(response => {
                console.log("Task updated successfully", task.Id, response.data);
                return $http.get(tasksUrl);
            })
            .then(response => {
                $scope.taskList = response.data;
                $scope.completed = response.data.length === 0;
            })
            .catch(function (error) {
                console.error("Error completing or refreshing task", error);
            });
    };


});