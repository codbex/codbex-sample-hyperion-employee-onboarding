angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/OnboardingTask/OnboardingTaskService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, ButtonStates) => {
		const Dialogs = new DialogHub();
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-sample-hyperion-employee-onboarding-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'OnboardingTask' && e.view === 'OnboardingTask' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					response.data.forEach(e => {
						if (e.CompletedAt) {
							e.CompletedAt = new Date(e.CompletedAt);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'OnboardingTask',
						message: `Unable to list/filter OnboardingTask: '${message}'`,
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'OnboardingTask',
					message: `Unable to count OnboardingTask: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsEmployee: $scope.optionsEmployee,
				optionsAssignee: $scope.optionsAssignee,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.createEntity', data: {
				entity: {},
				optionsEmployee: $scope.optionsEmployee,
				optionsAssignee: $scope.optionsAssignee,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsEmployee: $scope.optionsEmployee,
				optionsAssignee: $scope.optionsAssignee,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: 'Delete OnboardingTask?',
				message: `Are you sure you want to delete OnboardingTask? This action cannot be undone.`,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: 'Yes',
				}, {
					id: 'delete-btn-no',
					label: 'No',
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'OnboardingTask',
							message: `Unable to delete OnboardingTask: '${message}'`,
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'OnboardingTask-filter',
				params: {
					entity: $scope.filterEntity,
					optionsEmployee: $scope.optionsEmployee,
					optionsAssignee: $scope.optionsAssignee,
					optionsStatus: $scope.optionsStatus,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsEmployee = [];
		$scope.optionsAssignee = [];
		$scope.optionsStatus = [];


		$http.get('/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts').then((response) => {
			$scope.optionsEmployee = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Employee',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/Employee/EmployeeService.ts').then((response) => {
			$scope.optionsAssignee = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Assignee',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

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

		$scope.optionsEmployeeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsEmployee.length; i++) {
				if ($scope.optionsEmployee[i].value === optionKey) {
					return $scope.optionsEmployee[i].text;
				}
			}
			return null;
		};
		$scope.optionsAssigneeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsAssignee.length; i++) {
				if ($scope.optionsAssignee[i].value === optionKey) {
					return $scope.optionsAssignee[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
