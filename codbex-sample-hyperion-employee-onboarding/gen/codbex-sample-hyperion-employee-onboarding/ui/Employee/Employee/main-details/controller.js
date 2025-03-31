angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-sample-hyperion-employee-onboarding.Employee.Employee';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Employee Details",
			create: "Create Employee",
			update: "Update Employee"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-sample-hyperion-employee-onboarding-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Employee" && e.view === "Employee" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsDepartment = [];
				$scope.optionsOnboardingStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.StartDate) {
					msg.data.entity.StartDate = new Date(msg.data.entity.StartDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsDepartment = msg.data.optionsDepartment;
				$scope.optionsOnboardingStatus = msg.data.optionsOnboardingStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsDepartment = msg.data.optionsDepartment;
				$scope.optionsOnboardingStatus = msg.data.optionsOnboardingStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.StartDate) {
					msg.data.entity.StartDate = new Date(msg.data.entity.StartDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsDepartment = msg.data.optionsDepartment;
				$scope.optionsOnboardingStatus = msg.data.optionsOnboardingStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceDepartment = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Department/DepartmentService.ts";
		$scope.serviceOnboardingStatus = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Employee", `Unable to create Employee: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Employee", "Employee successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Employee", `Unable to update Employee: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Employee", "Employee successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createDepartment = function () {
			messageHub.showDialogWindow("Department-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createOnboardingStatus = function () {
			messageHub.showDialogWindow("OnboardingStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshDepartment = function () {
			$scope.optionsDepartment = [];
			$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Department/DepartmentService.ts").then(function (response) {
				$scope.optionsDepartment = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshOnboardingStatus = function () {
			$scope.optionsOnboardingStatus = [];
			$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts").then(function (response) {
				$scope.optionsOnboardingStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);