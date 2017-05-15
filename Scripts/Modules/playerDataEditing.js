angular.module('playerDataEditModule', []);

angular.module('playerDataEditModule').directive('playerDataEditDir', function () {
    return {
        restrict: 'E',
        controller: ["$scope", function ($scope) {
        }],
        templateUrl: 'Templates/playerDataEdit.html'
    }
})
