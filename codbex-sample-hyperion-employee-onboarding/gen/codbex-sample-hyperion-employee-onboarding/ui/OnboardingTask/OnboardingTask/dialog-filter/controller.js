angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.CompletedAtFrom) {
			params.entity.CompletedAtFrom = new Date(params.entity.CompletedAtFrom);
		}
		if (params?.entity?.CompletedAtTo) {
			params.entity.CompletedAtTo = new Date(params.entity.CompletedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsEmployee = params.optionsEmployee;
		$scope.optionsAssignee = params.optionsAssignee;
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
		if (entity.Employee !== undefined) {
			filter.$filter.equals.Employee = entity.Employee;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
		}
		if (entity.Assignee !== undefined) {
			filter.$filter.equals.Assignee = entity.Assignee;
		}
		if (entity.Description) {
			filter.$filter.contains.Description = entity.Description;
		}
		if (entity.Status !== undefined) {
			filter.$filter.equals.Status = entity.Status;
		}
		if (entity.CompletedAtFrom) {
			filter.$filter.greaterThanOrEqual.CompletedAt = entity.CompletedAtFrom;
		}
		if (entity.CompletedAtTo) {
			filter.$filter.lessThanOrEqual.CompletedAt = entity.CompletedAtTo;
		}
		Dialogs.postMessage({ topic: 'codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-sample-hyperion-employee-onboarding.OnboardingTask.OnboardingTask.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'OnboardingTask-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});