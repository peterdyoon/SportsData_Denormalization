angular.module('customFilterWeekModule', []);

angular.module('customFilterWeekModule').directive('customFilterWeekDir', function(){
    return {
        restrict: 'E', 
        templateUrl: 'Templates/customFilterWeek.html'
    }
})