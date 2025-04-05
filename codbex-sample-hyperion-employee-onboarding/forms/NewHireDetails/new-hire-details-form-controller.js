const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();

    $scope.showDialog = true;

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };

    const departmentsUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/NewHireDetails/api/NewHireDetailsFormService.ts/departmentData";
    const employeeUrl =
        "/services/ts/codbex-sample-hyperion-employee-onboarding/forms/NewHireDetails/api/NewHireDetailsFormService.ts/createEmployee";

    $http.get(departmentsUrl)
        .then(response => {
            $scope.optionsDepartment = response.data;
        })
        .catch(function (error) {
            console.error("Error getting departments data: ", error);
            $scope.closeDialog();
        });

    $scope.createNewHire = () => {

        console.log("eee");

        const employeeBody = {
            Name: $scope.entity.Name,
            Email: $scope.entity.Email,
            Department: $scope.entity.Department,
            StartDate: new Date($scope.entity.StartDate),
            OnboardingStatus: 1
        }

        console.log(JSON.stringify(employeeBody));

        $http.post(employeeUrl, employeeBody)
            .then(response => {
                if (response.status == 201) {
                    $scope.closeDialog();
                }
                else {
                    console.error("Error creating Employee: ", response.data);
                }
            })
            .catch(function (error) {
                console.error("Error creating Employee: ", error.data);
                $scope.closeDialog();
            });
    }

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("employee-onboarding-sample-navigation");
    };

}]);

