angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/OnboardingTask/OnboardingTaskService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "OnboardingTask Details",
			create: "Create OnboardingTask",
			update: "Update OnboardingTask"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-sample-hyperion-employee-onboarding-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "OnboardingTask" && e.view === "OnboardingTask" && e.type === "entity");
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
				$scope.optionsEmployee = [];
				$scope.optionsAssignee = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.CompletedAt) {
					msg.data.entity.CompletedAt = new Date(msg.data.entity.CompletedAt);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsAssignee = msg.data.optionsAssignee;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsAssignee = msg.data.optionsAssignee;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.CompletedAt) {
					msg.data.entity.CompletedAt = new Date(msg.data.entity.CompletedAt);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployee = msg.data.optionsEmployee;
				$scope.optionsAssignee = msg.data.optionsAssignee;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceEmployee = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts";
		$scope.serviceAssignee = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts";
		$scope.serviceStatus = "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("OnboardingTask", `Unable to create OnboardingTask: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("OnboardingTask", "OnboardingTask successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("OnboardingTask", `Unable to update OnboardingTask: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("OnboardingTask", "OnboardingTask successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createEmployee = function () {
			messageHub.showDialogWindow("Employee-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createAssignee = function () {
			messageHub.showDialogWindow("Employee-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("OnboardingStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshEmployee = function () {
			$scope.optionsEmployee = [];
			$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts").then(function (response) {
				$scope.optionsEmployee = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshAssignee = function () {
			$scope.optionsAssignee = [];
			$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts").then(function (response) {
				$scope.optionsAssignee = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/entities/OnboardingStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);