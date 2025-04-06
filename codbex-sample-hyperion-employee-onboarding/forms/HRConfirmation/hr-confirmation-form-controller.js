const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    const employeeId = params.id || new URLSearchParams(window.location.search).get('employeeId');

    $scope.showDialog = true;

    $scope.entity = {

    };

    $scope.forms = {
        details: {},
    };

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/api/HRConfirmationFormService.ts/tasksData/" + employeeId;

    $scope.checkboxChecked = false;


    $http.get(tasksUrl)
        .then(response => {
            $scope.taskList = response.data;
        })
        .catch(function (error) {
            console.error("Error getting task data: ", error);
            $scope.closeDialog();
        });


    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("hr-confirmation-navigation");
    };

}]);