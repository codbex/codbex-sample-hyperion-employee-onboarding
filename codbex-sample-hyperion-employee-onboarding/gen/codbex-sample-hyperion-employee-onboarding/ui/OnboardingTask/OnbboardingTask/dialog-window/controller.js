angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnbboardingTask';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/OnboardingTask/OnbboardingTaskService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "OnbboardingTask Details",
			create: "Create OnbboardingTask",
			update: "Update OnbboardingTask"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.CompletedAt) {
				params.entity.CompletedAt = new Date(params.entity.CompletedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsAssignee = params.optionsAssignee;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create OnbboardingTask: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("OnbboardingTask", "OnbboardingTask successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update OnbboardingTask: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("OnbboardingTask", "OnbboardingTask successfully updated");
			});
		};

		$scope.serviceEmployee = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts";
		
		$scope.optionsEmployee = [];
		
		$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts").then(function (response) {
			$scope.optionsEmployee = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceAssignee = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts";
		
		$scope.optionsAssignee = [];
		
		$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts").then(function (response) {
			$scope.optionsAssignee = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStatus = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("OnbboardingTask-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);