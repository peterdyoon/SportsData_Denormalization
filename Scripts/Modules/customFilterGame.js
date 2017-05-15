angular.module('customFilterGameModule', []);

angular.module('customFilterGameModule').directive('customFilterGameDir', function(){
    return {
        restrict: 'E', 
        templateUrl: 'Templates/customFilterGame.html'
    }
})