angular.module('customFilterModule', []);

angular.module('customFilterModule').directive('customFilterDir', function(){
    return {
        restrict: 'E', 
        templateUrl: 'Templates/customFilter.html'
    }
})