angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http) => {

    const employeeId = new URLSearchParams(window.location.search).get('employeeId');
    const processInstanceId = new URLSearchParams(window.location.search).get('processId');

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };
    $scope.checkboxes = {
        model: false
    };
    $scope.isCompleted = false;

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/api/HRConfirmationFormService.ts/tasksData/" + employeeId;
    const completeTaskUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/api/HRConfirmationFormService.ts/completeTask/" + processInstanceId;

    $http.get(tasksUrl)
        .then(response => {
            $scope.taskList = response.data.Tasks;
            $scope.isEmpty = $scope.taskList.length == 0;
        })
        .catch((error) => {
            console.error("Error getting task data: ", error);
        });

    $scope.completeOnboarding = () => {
        $http.post(completeTaskUrl)
            .then(response => {
                console.log(response);
                $scope.isCompleted = true;
            })
            .catch((error) => {
                console.error("Error completing tasks or refreshing task list", error);
            });
    }

});
