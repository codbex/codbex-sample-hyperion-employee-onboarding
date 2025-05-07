angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.StartDateFrom) {
			params.entity.StartDateFrom = new Date(params.entity.StartDateFrom);
		}
		if (params?.entity?.StartDateTo) {
			params.entity.StartDateTo = new Date(params.entity.StartDateTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsDepartment = params.optionsDepartment;
		$scope.optionsStatus = params.optionsStatus;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
		}
		if (entity.Email) {
			filter.$filter.contains.Email = entity.Email;
		}
		if (entity.Department !== undefined) {
			filter.$filter.equals.Department = entity.Department;
		}
		if (entity.StartDateFrom) {
			filter.$filter.greaterThanOrEqual.StartDate = entity.StartDateFrom;
		}
		if (entity.StartDateTo) {
			filter.$filter.lessThanOrEqual.StartDate = entity.StartDateTo;
		}
		if (entity.Status !== undefined) {
			filter.$filter.equals.Status = entity.Status;
		}
		Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.Employee.Employee.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-sample-hyperion-employee-onboarding.Employee.Employee.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Employee-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});