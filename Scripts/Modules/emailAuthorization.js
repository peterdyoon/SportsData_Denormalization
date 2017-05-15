angular.module('emailAuthModule', []);

angular.module('emailAuthModule').directive('emailAuthDir', function(){
    return {
        restrict: 'E', 
        templateUrl: 'Templates/emailAuth.html'
    }
})