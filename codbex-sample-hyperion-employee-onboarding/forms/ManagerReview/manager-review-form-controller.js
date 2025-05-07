angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http) => {

    const employeeId = new URLSearchParams(window.location.search).get('employeeId');
    const processInstanceId = new URLSearchParams(window.location.search).get('processId');

    $scope.entity = {
        assignees: {}
    };
    $scope.forms = {
        details: {},
    };

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/tasksData/" + employeeId;
    const employeeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/employeeData";
    const updateAssigneeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/updateAssignee";
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/completeTask/" + processInstanceId;

    $scope.hasAvailableTasks = false;

    $http.get(tasksUrl).then(response => {
        $scope.taskList = response.data;
        $scope.hasAvailableTasks = response.data.length > 0;
        $http.get(employeeUrl).then(response => {
            $scope.assigneeOptions = response.data;
        }).catch((error) => {
            console.error("Error getting employees data: ", error);
        });

    }).catch((error) => {
        console.error("Error getting tasks data: ", error);
    });

    $scope.submitAssignees = () => {
        $scope.taskList.forEach((task) => {

            const assigneeId = $scope.entity.assignees[task.Id];

            if (assigneeId) {
                const updateData = {
                    taskId: task.Id,
                    assigneeId: assigneeId,
                };

                $http.post(updateAssigneeUrl, updateData).then(response => {
                    console.log("Assignee updated successfully for task", task.Id, response.data);
                }).catch(function (error) {
                    console.error("Error updating assignee for task", task.Id, error);
                });
            } else {
                console.log("No assignee selected for task with ID: ", task.Id);
            }
        });

        const assigneeIds = Object.values($scope.entity.assignees);

        $http.post(completeTaskUrl, assigneeIds).then(response => {
            console.log("Tasks completed: ", response.data);
            $http.get(tasksUrl).then(response => {
                $scope.taskList = response.data;
                $scope.entity.assignees = {};
                $scope.hasAvailableTasks = response.data.length > 0;
            }).catch((error) => {
                console.error("Error refreshing task list", error);
            });
        }).catch((error) => {
            console.error("Error completing tasks list", error);
        });
    };

});