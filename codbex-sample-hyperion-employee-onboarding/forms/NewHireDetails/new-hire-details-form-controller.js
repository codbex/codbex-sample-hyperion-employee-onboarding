angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http) => {

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
        .catch((error) => {
            console.error("Error getting departments data: ", error);
            $scope.resetForm();
        });

    $scope.createNewHire = () => {

        const employeeBody = {
            Name: $scope.entity.Name,
            Email: $scope.entity.Email,
            Department: $scope.entity.Department,
            StartDate: new Date($scope.entity.StartDate),
            Status: 1
        }

        $http.post(employeeUrl, employeeBody)
            .then(response => {
                if (response.status == 201) {
                    $scope.resetForm();
                }
                else {
                    console.error("Error creating Employee: ", response.data);
                }
            })
            .catch((error) => {
                console.error("Error creating Employee: ", error.data);
                $scope.resetForm();
            });
    }

    $scope.resetForm = () => {
        $scope.entity = {};
    };

});

