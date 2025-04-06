const app = angular.module('templateApp', ['ideUI', 'ideView'])
app.controller('templateController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.showDialog = true;

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };

    $scope.closeDialog = () => {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("task-completion-navigation");
    };

}]);