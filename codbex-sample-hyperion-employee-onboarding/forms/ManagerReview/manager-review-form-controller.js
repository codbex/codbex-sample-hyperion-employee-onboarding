const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();

    $scope.showDialog = true;

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };

    const tasksUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/tasksData/";
    const employeeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/employeeData";
    const newHireUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/api/ManagerReviewFormService.ts/newHireData";

    $http.get(newHireUrl)
        .then(response => {
            $scope.newHireOptions = response.data;
        })
        .catch(function (error) {
            console.error("Error getting new hire data: ", error);
            $scope.closeDialog();
        });

    $scope.logNewHireID = function () {
        console.log($scope.entity.selectedNewHire);

        const newHireId = $scope.entity.selectedNewHire;

        $http.get(tasksUrl + newHireId)
            .then(response => {
                $scope.taskList = response.data;
                console.log(JSON.stringify($scope.taskList));
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
    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("manager-review-navigation");
    };

}]);