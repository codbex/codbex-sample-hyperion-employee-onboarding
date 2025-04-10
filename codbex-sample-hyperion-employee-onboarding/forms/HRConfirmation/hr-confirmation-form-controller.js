const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', function ($scope, $http) {
    const employeeId = new URLSearchParams(window.location.search).get('employeeId');
    const processInstanceId = new URLSearchParams(window.location.search).get('processId');

    $scope.showDialog = true;

    $scope.entity = {

    };

    $scope.forms = {
        details: {},
    };

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/api/HRConfirmationFormService.ts/tasksData/" + employeeId;
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/api/HRConfirmationFormService.ts/completeTask/" + processInstanceId;

    $scope.checkboxChecked = false;

    $http.get(tasksUrl)
        .then(response => {
            $scope.taskList = response.data.Tasks;
            $scope.isCompleted = response.data.Employee === 3;
            $scope.hasAvailableTasks = response.data.Tasks.length > 0;
        })
        .catch(function (error) {
            console.error("Error getting task data: ", error);
        });

    $scope.completeOnboarding = function () {
        $http.post(completeTaskUrl)
            .then(response => {
                console.log("Task updated successfully", response.data);
                return $http.get(tasksUrl);
            })
            .then(response => {
                $scope.taskList = response.data;
                $scope.hasAvailableTasks = response.data.length > 0;
                console.log("Task list refreshed:", response.data);
            })
            .catch(function (error) {
                console.error("Error completing tasks or refreshing task list", error);
            });
    }

}]);