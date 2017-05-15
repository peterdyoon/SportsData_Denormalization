angular.module('playerRankModule', []);

angular.module('playerRankModule').directive('playerRankDir', function(){
    return {
        restrict: 'E', 
        templateUrl: 'Templates/playerRank.html'
    }
})