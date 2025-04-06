const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/api/TaskCompletionFormService.ts/tasksData/1";
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/api/TaskCompletionFormService.ts/completeTask";

    $http.get(tasksUrl)
        .then(response => {
            $scope.taskList = response.data;
        })
        .catch(function (error) {
            console.error("Error getting task data: ", error);
            $scope.closeDialog();
        });

    $scope.completeTask = function (task) {

        $http.post(completeTaskUrl, task)
            .then(response => {
                console.log("Task updated successfully", task.Id, response.data);
            })
            .catch(function (error) {
                console.error("Error updating task", task.Id, error);
            });

    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("task-completion-navigation");
    };

}]);