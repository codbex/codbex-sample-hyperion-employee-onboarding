const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    const employeeId = params.id || new URLSearchParams(window.location.search).get('employeeId');
    const processInstanceId = new URLSearchParams(window.location.search).get('processId');

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
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/completeTask/" + processInstanceId;

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
                    assigneeId: assigneeId,
                };

                console.log("Updating assignee for task: ", task.Id, "to assignee: ", assigneeId);

                console.log("Assignees: ", $scope.entity.assignees);

                $http.post(updateAssigneeUrl, updateData)
                    .then(response => {
                        console.log("Assignee updated successfully for task", task.Id, response.data);
                    })
                    .catch(function (error) {
                        console.error("Error updating assignee for task", task.Id, error);
                    });

                console.log("Assignees: ", $scope.entity.assignees);
            } else {
                console.log("No assignee selected for task with ID: ", task.Id);
            }
        });

        console.log("Assignees: ", $scope.entity.assignees);

        const assigneeIds = Object.values($scope.entity.assignees);

        console.log("AssigneeIds: ", assigneeIds);

        $http.post(completeTaskUrl, assigneeIds)
            .then(response => {
                console.log("Task completed: ", response.data);
            })
            .catch(function (error) {
                console.error("Error completing task: ", error);
            });
    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("manager-review-navigation");
    };

}]);