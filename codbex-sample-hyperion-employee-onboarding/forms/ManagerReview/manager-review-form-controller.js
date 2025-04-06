const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    const employeeId = params.id || new URLSearchParams(window.location.search).get('employeeId');

    $scope.showDialog = true;

    $scope.entity = {
        selectedNewHire: null,
        assignees: {}
    };
    $scope.forms = {
        details: {},
    };

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/tasksData/";
    const employeeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/employeeData";
    const updateAssigneeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/updateAssignee";

    $http.get(tasksUrl + employeeId)
        .then(response => {
            $scope.taskList = response.data;

            $http.get(employeeUrl)
                .then(response => {

                    $scope.assigneeOptions = response.data;
                })
                .catch(function (error) {
                    console.error("Error getting employees data: ", error);
                    $scope.closeDialog();
                });

        })
        .catch(function (error) {
            console.error("Error getting tasks data: ", error);
            $scope.closeDialog();
        });


    $scope.submitAssignees = function () {
        $scope.taskList.forEach(function (task) {

            const assigneeId = $scope.entity.assignees[task.Id];

            if (assigneeId) {
                const updateData = {
                    taskId: task.Id,
                    assigneeId: assigneeId
                };

                console.log("Updating assignee for task: ", task.Id, "to assignee: ", assigneeId);

                $http.post(updateAssigneeUrl, updateData)
                    .then(response => {
                        console.log("Assignee updated successfully for task", task.Id, response.data);
                    })
                    .catch(function (error) {
                        console.error("Error updating assignee for task", task.Id, error);
                    });
            } else {
                console.log("No assignee selected for task with ID: ", task.Id);
            }
        });
    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("manager-review-navigation");
    };

}]);