angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, EntityService) => {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Employee Details',
			create: 'Create Employee',
			update: 'Update Employee'
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-sample-hyperion-employee-onboarding-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Employee' && e.view === 'Employee' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsDepartment = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				$scope.entity = data.entity;
				$scope.optionsDepartment = data.optionsDepartment;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsDepartment = data.optionsDepartment;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				$scope.entity = data.entity;
				$scope.optionsDepartment = data.optionsDepartment;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceDepartment = '/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Settings/DepartmentService.ts';
		$scope.serviceStatus = '/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Settings/OnboardingStatusService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.clearDetails' , data: response.data });
				Dialogs.showAlert({
					title: 'Employee',
					message: 'Employee successfully created',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Employee',
					message: `Unable to create Employee: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.clearDetails', data: response.data });
				Dialogs.showAlert({
					title: 'Employee',
					message: 'Employee successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Employee',
					message: `Unable to create Employee: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-sample-hyperion-employee-onboarding.Employee.Employee.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createDepartment = () => {
			Dialogs.showWindow({
				id: 'Department-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'OnboardingStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshDepartment = () => {
			$scope.optionsDepartment = [];
			$http.get('/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Settings/DepartmentService.ts').then((response) => {
				$scope.optionsDepartment = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Department',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshStatus = () => {
			$scope.optionsStatus = [];
			$http.get('/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Settings/OnboardingStatusService.ts').then((response) => {
				$scope.optionsStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Status',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});