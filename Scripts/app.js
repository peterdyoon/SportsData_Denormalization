var app = angular.module('MyApp', ['playerRankModule', 'teamRankModule', 'playerDataEditModule', 'firebase', 'emailAuthModule', 'ngRoute', 'customFilterModule', 'customFilterWeekModule', 'customFilterGameModule']);

var config = {
    apiKey: "AIzaSyAVKBHil-peQ1Hjzst25DiFOzX3_Sk7xB0",
    authDomain: "hebronbowling.firebaseapp.com",
    databaseURL: "https://hebronbowling.firebaseio.com",
    projectId: "hebronbowling",
    storageBucket: "hebronbowling.appspot.com",
    messagingSenderId: "62684300592"
};
firebase.initializeApp(config);
var database = firebase.database();

app.config(['$routeProvider', '$locationProvider', function
    ($routeProvider, $locationProvider) {
//        $locationProvider.html5Mode(true);
        $routeProvider.when("/pageMain", {
            templateUrl: "Templates/main.html"
        }).when("/page1", {
            templateUrl: "Templates/playerDataEdit.html"
        }).when("/page11", {
            templateUrl: "Templates/playerProfileEdit.html"
        }).when("/page12", {
            templateUrl: "Templates/teamProfileEdit.html"
        }).when("/page2", {
            templateUrl: "Templates/teamRank.html",
        }).when("/page3", {
            templateUrl: "Templates/playerRank.html"
        }).when("/page4", {
            templateUrl: "Templates/highscoreRank.html"
        }).when("/page5", {
            templateUrl: "Templates/gameSchedule.html"
        }).when("/page10", {
            templateUrl: "Templates/emailAuth.html"
        })
}]);

app.controller('myNavController', function($scope){
    $scope.tab = 0;
    $scope.selectTab = function(newTab){
        $scope.tab = newTab;
    };
});

//BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE BOWLERS MODULE 
app.controller('myBowlersController', function($scope){
    database.ref("/bowlers/").on('value', function(snapshot){
        $scope.bowlerdata = snapshot.val();
        console.log($scope.bowlerdata);
    });
    $scope.atomicprofile = function(bowler){
        delete bowler.$$hashKey;
          var updates = {};
        for (var key in bowler.GameID){
            updates['/scores/' + key + '/Name'] = bowler.Name;
            updates['/scores/' + key + '/Team'] = bowler.Team;
            updates['/scores/' + key + '/Gender'] = bowler.Gender;
        }
          updates['/bowlers/' + bowler.BowlerID] = bowler;
          return database.ref().update(updates);
    }
});

//BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE BRACKETS MODULE
app.controller('myGamesController', function($scope){
    database.ref("/games/").on('value', function(snapshot){
        $scope.gamedata = snapshot.val();
        console.log($scope.gamedata);
    });
});

//TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE TEAMS MODULE 
app.controller('myTeamsController', function($scope){
    database.ref("/teams/").on('value', function(snapshot){
        $scope.teamdata = snapshot.val();
        console.log($scope.teamdata);
    });
    $scope.atomicteamprofile = function(team){
        delete team.$$hashKey;

        var updates = {};
        for (var key in team.PlayerID){
            updates['/bowlers/' + key + '/Team'] = team.Name;
        }
        for (var key in team.GameID){
            updates['/scores/' + key + '/Team'] = team.Name;
        }
        updates['/teams/' + team.TeamID + '/Name'] = team.Name;
        updates['/teams/' + team.TeamID + '/LastUpdated'] = team.LastUpdated;
        return database.ref().update(updates);
    }
});

//SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE SCORES MODULE 
app.controller('myScoresController', function($scope){
    database.ref("/scores/").on('value', function(snapshot){
        $scope.scoredata = snapshot.val();
        console.log($scope.scoredata);
    });
    $scope.atomicbomb = function(score){
        delete score.$$hashKey;
          var updates = {};
          updates['/scores/' + score.GameID] = score;
          updates['/bowlers/' + score.BowlerID + '/GameID/' + score.GameID] = true;
          updates['/bowlers/' + score.BowlerID + '/LastUpdated/'] = score.LastUpdated;
          return database.ref().update(updates);
    }
});

//SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE SCHEDULE 
app.controller('myMainController', function($scope) {
    database.ref("/schedules/").on('value', function(snapshot){
        $scope.scheduledata = snapshot.val();
        console.log($scope.scheduledata);
        $scope.currentweek = $scope.scheduledata.length;
        $scope.currentgame = $scope.scheduledata[$scope.currentweek - 1].length;
        $scope.currentgameID = parseInt($scope.scheduledata[$scope.currentweek - 1][$scope.currentgame - 1]);
    });
    database.ref("/bowlers/").on('value', function(snapshot){
        $scope.bowlerdata = snapshot.val();
    });
    $scope.newGame = function(){
        var counter = $scope.currentgameID;
        for (var bowler in $scope.bowlerdata){
            var updates = {};
            delete $scope.bowlerdata[bowler].$$hashKey
            $scope.bowlerdata[bowler].Score = 0;
            $scope.bowlerdata[bowler].Week = $scope.currentweek;
            $scope.bowlerdata[bowler].Game = $scope.currentgame;
            $scope.bowlerdata[bowler].GameID = counter;
            $scope.bowlerdata[bowler].BowlerID = parseInt(bowler);
            database.ref('scores/' + counter).set($scope.bowlerdata[bowler]);
            updates['/bowlers/' + $scope.bowlerdata[bowler].BowlerID + '/GameID/' + (counter)] = true;
            database.ref().update(updates);
            counter++;
            console.log(counter);
        }
        console.log(counter);
        database.ref('schedules/' + ($scope.currentweek - 1) + '/' + ($scope.currentgame)).set(counter);
        return false;
    };
});
app.controller('myController', ["$scope", function ($scope) {
    
//    Login Information
    $scope.Register = function () {
        firebase.auth().createUserWithEmailAndPassword($scope.email,
            $scope.password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
        return false;
    }
    $scope.Login = function () {
        firebase.auth().signInWithEmailAndPassword($scope.email,
            $scope.password).catch(function (error) {
            alert("Wrong email");
            var errorCode = error.code;
            var errorMessage = error.message;
        });
        return false;
    }
    $scope.Logout = function () {
        firebase.auth().signOut();
        return false;
    }
    $scope.OnAuthStateChanged = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $scope.authenticated = true;
        } else {
            $scope.authenticated = false;
        }
    });

//Create clone on bowler object
    $scope.createClone = function(bowler){
        var newObject = Object.assign({}, bowler);
        return newObject;
    }

//Transfer clone data to bowler object
    $scope.transferClone = function(firebowler, newbowler){
        for (key in firebowler){
            firebowler[key] = newbowler[key];
        }
    }
    
//Time Stamp Functionality
    $scope.timetotimeStamp = function(){
        var timetoday = new Date();
        var doubledigitFormat = function(measure){
            if (measure < 10){
                return "0" + measure;
            } else {
                return measure;
            }
        }
        if (timetoday.getHours() >12){
            var hours = timetoday.getHours() - 12;
            var ampm = "PM";
        } else {
            var hours = doubledigitFormat(timetoday.getHours());
            var ampm = "AM";
        }
        if (timetoday.getSeconds() < 10){
            var seconds = "0" + timetoday.getSeconds();
        } else {
            var seconds = timetoday.getSeconds();
        }
        return (timetoday.getMonth() + 1) + "/" + timetoday.getDate() + "/" + timetoday.getFullYear() + " " + hours + ":" + doubledigitFormat(timetoday.getMinutes()) + ":" + doubledigitFormat(timetoday.getSeconds()) + ampm;
    }
    
//Sorting Functionality
    $scope.myOrder = "";
    $scope.reverse = false;
    $scope.lastFilter = "";
    $scope.myOrderFunc = function(filter){
        if ($scope.lastFilter === filter){
            if($scope.reverse === false){
                $scope.myOrder = filter;
                $scope.reverse = true;
            } else {
                $scope.myOrder = '-' + filter;
                $scope.reverse = false;
            }
        } else {
            $scope.lastFilter = filter;
            $scope.reverse = false;
            $scope.myOrderFunc(filter);
        }
    }
    $scope.myOrderFuncData = function(filter){
        if ($scope.lastFilter === filter){
            if($scope.reverse === false){
                $scope.myOrder = filter;
                $scope.reverse = true;
            } else {
                $scope.myOrder = filter.substring(1, filter.length);
                $scope.reverse = false;
            }
        } else {
            $scope.lastFilter = filter;
            $scope.reverse = false;
            $scope.myOrderFunc(filter);
        }
    }
}]);

//Dummy Function for old Gem Data
function updateUserData(){
    database.ref().child('test').push();
}
function writeGameData(){
    for (var i = 0; i < gamearray.length; i++){
        database.ref("games/" + i).set(gamearray[i]);
    }
}
function writeScoresData(){
    var count = 0;
    for (var i = 0; i < bowlingarray.length; i++){
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 1,
            Game : 1, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W1G1
            });
        
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 1,
            Game : 2, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W1G2
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 1,
            Game : 3, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W1G3
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 2,
            Game : 1, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W2G1
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 2,
            Game : 2, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W2G2
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 2,
            Game : 3,
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W2G3
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 3,
            Game : 1, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W3G1
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 3,
            Game : 2, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W3G2
            });
        count++;
        database.ref("scores/" + count).set(
            {
            Name : bowlingarray[i].Name,
            Team : bowlingarray[i].Team,
            Week : 3,
            Game : 3, 
            Gender : bowlingarray[i].Gender,
            Score : bowlingarray[i].W3G3
            });
        count++;
    }
}

function writeUserData() {
    var count = 0;
    var teamcount = 0;
    for (var i = 0; i < bowlingarray.length; i++) {
        database.ref("bowlers/" + (i)).set(
            {
            Name : bowlingarray[i].Name, 
            Team : bowlingarray[i].Team,
            TeamID : teamcount,
            TeamPlayerID : count,
            Gender : bowlingarray[i].Gender,
            GameID: "",
            BowlerID: (i),
            LastUpdated: ""
        });
//        Teams
        database.ref('teams/' + teamcount + '/TeamID/').set(teamcount);
        database.ref('teams/' + teamcount + '/Name/').set(teamarray[i].Team);
        database.ref('teams/' + teamcount + '/LastUpdated/').set("");
        database.ref('teams/' + teamcount + '/Players/' + (count)).set(teamarray[i].Name);
        database.ref('teams/' + teamcount + '/PlayerID/' + i).set('true');
        database.ref('teams/' + teamcount + '/GameID/' + i).set('true');
//        Schedule
        database.ref('schedules/' + 0 + '/' + 0 + '/').set(0);
        if (count === 2){
            count = 0;
            teamcount++;
        } else {
            count++;
        }
    }
}
function deleteUserData() {
    database.ref('bowlers/').remove();
    database.ref('teams/').remove();
    database.ref('scores/').remove();
    database.ref('schedules/').remove();
}

function writeTeams(){
    var count = 0;
    var teamcount = 0;
    for (var i = 0; i < teamarray.length; i++){
        database.ref('teams/' + teamcount + '/TeamID/').set(teamcount);
        database.ref('teams/' + teamcount + '/PlayerID/' + count).set(teamarray[i].Name);
        if (count === 2){
            count = 0;
            teamcount++;
        } else {
            count++;
        }
    }
}

var teamarray = [
{
	"Team": "Flamingos", 
	"Name": "Daniel Moon"}, 
{
	"Team": "Flamingos", 
	"Name": "Eunice Lee"}, 
{
	"Team": "Flamingos", 
	"Name": "Michelle Yoon"}, 
{
	"Team": "Turtles", 
	"Name": "Daniel Kim"}, 
{
	"Team": "Turtles", 
	"Name": "Daniella Shin"}, 
{
	"Team": "Turtles", 
	"Name": "Mike Chang"}, 
{
	"Team": "Penguins", 
	"Name": "Byungsoo Kim"}, 
{
	"Team": "Penguins", 
	"Name": "Daniel Song"}, 
{
	"Team": "Penguins", 
	"Name": "Jon Han"}, 
{
	"Team": "Gamecocks", 
	"Name": "James Jin Park"}, 
{
	"Team": "Gamecocks", 
	"Name": "Justin Kim"}, 
{
	"Team": "Gamecocks", 
	"Name": "Mimi Kim"}, 
{
	"Team": "Little Ponies", 
	"Name": "Ilhwan Hwang"}, 
{
	"Team": "Little Ponies", 
	"Name": "Rob Lee"}, 
{
	"Team": "Little Ponies", 
	"Name": "Steffi Yoon"}, 
{
	"Team": "Bulls", 
	"Name": "Jon Lee"}, 
{
	"Team": "Bulls", 
	"Name": "Josh Cho"}, 
{
	"Team": "Bulls", 
	"Name": "Peter Pak"}, 
{
	"Team": "Cockroaches", 
	"Name": "David Yim"}, 
{
	"Team": "Cockroaches", 
	"Name": "Diane Choe"}, 
{
	"Team": "Cockroaches", 
	"Name": "Greg Cheung"}, 
{
	"Team": "Whales", 
	"Name": "Alex Kim"}, 
{
	"Team": "Whales", 
	"Name": "Matt Choi"}, 
{
	"Team": "Whales", 
	"Name": "Vivian Shin"}
]
    
var gamearray = [
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 130, 
	"Score2": 125, 
	"Score3": 115, 
	"Total": 370, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 34, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 146, 
	"Score2": 107, 
	"Score3": 139, 
	"Total": 392, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 146, 
	"Score2": 163, 
	"Score3": 123, 
	"Total": 432, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 108, 
	"Score2": 163, 
	"Score3": 110, 
	"Total": 381, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 125, 
	"Score2": 155, 
	"Score3": 99, 
	"Total": 379, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 38, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 110, 
	"Score2": 98, 
	"Score3": 190, 
	"Total": 398, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 137, 
	"Score2": 102, 
	"Score3": 113, 
	"Total": 352, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 40, 
	"Week": 1, 
	"Game": 1, 
	"Score1": 224, 
	"Score2": 129, 
	"Score3": 169, 
	"Total": 522, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 195, 
	"Score2": 215, 
	"Score3": 101, 
	"Total": 511, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 34, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 189, 
	"Score2": 93, 
	"Score3": 143, 
	"Total": 425, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 152, 
	"Score2": 152, 
	"Score3": 114, 
	"Total": 418, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 141, 
	"Score2": 121, 
	"Score3": 132, 
	"Total": 394, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 125, 
	"Score2": 120, 
	"Score3": 93, 
	"Total": 338, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 38, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 110, 
	"Score2": 135, 
	"Score3": 130, 
	"Total": 375, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 119, 
	"Score2": 157, 
	"Score3": 137, 
	"Total": 413, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 40, 
	"Week": 1, 
	"Game": 2, 
	"Score1": 189, 
	"Score2": 149, 
	"Score3": 125, 
	"Total": 463, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 181, 
	"Score2": 185, 
	"Score3": 111, 
	"Total": 477, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 34, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 178, 
	"Score2": 84, 
	"Score3": 155, 
	"Total": 417, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 169, 
	"Score2": 169, 
	"Score3": 105, 
	"Total": 443, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 204, 
	"Score2": 144, 
	"Score3": 132, 
	"Total": 480, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 125, 
	"Score2": 172, 
	"Score3": 128, 
	"Total": 425, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 38, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 110, 
	"Score2": 132, 
	"Score3": 179, 
	"Total": 421, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 139, 
	"Score2": 110, 
	"Score3": 171, 
	"Total": 420, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 40, 
	"Week": 1, 
	"Game": 3, 
	"Score1": 191, 
	"Score2": 148, 
	"Score3": 156, 
	"Total": 495, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 165, 
	"Score2": 159, 
	"Score3": 100, 
	"Total": 424, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 34, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 125, 
	"Score2": 116, 
	"Score3": 168, 
	"Total": 409, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 138, 
	"Score2": 212, 
	"Score3": 111, 
	"Total": 461, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 36, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 122, 
	"Score2": 189, 
	"Score3": 118, 
	"Total": 429, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 153, 
	"Score2": 168, 
	"Score3": 73, 
	"Total": 394, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 38, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 158, 
	"Score2": 107, 
	"Score3": 147, 
	"Total": 412, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 150, 
	"Score2": 100, 
	"Score3": 178, 
	"Total": 428, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 40, 
	"Week": 2, 
	"Game": 1, 
	"Score1": 174, 
	"Score2": 184, 
	"Score3": 142, 
	"Total": 500, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 133, 
	"Score2": 155, 
	"Score3": 99, 
	"Total": 387, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 34, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 145, 
	"Score2": 119, 
	"Score3": 149, 
	"Total": 413, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 110, 
	"Score2": 224, 
	"Score3": 104, 
	"Total": 438, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 36, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 182, 
	"Score2": 127, 
	"Score3": 101, 
	"Total": 410, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 133, 
	"Score2": 159, 
	"Score3": 96, 
	"Total": 388, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 38, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 129, 
	"Score2": 108, 
	"Score3": 116, 
	"Total": 353, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 179, 
	"Score2": 128, 
	"Score3": 137, 
	"Total": 444, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 40, 
	"Week": 2, 
	"Game": 2, 
	"Score1": 149, 
	"Score2": 149, 
	"Score3": 110, 
	"Total": 408, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 33, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 136, 
	"Score2": 135, 
	"Score3": 136, 
	"Total": 407, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 34, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 130, 
	"Score2": 112, 
	"Score3": 120, 
	"Total": 362, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 35, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 110, 
	"Score2": 181, 
	"Score3": 84, 
	"Total": 375, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 36, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 135, 
	"Score2": 113, 
	"Score3": 167, 
	"Total": 415, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 170, 
	"Score2": 168, 
	"Score3": 73, 
	"Total": 411, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 38, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 135, 
	"Score2": 110, 
	"Score3": 125, 
	"Total": 370, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 39, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 114, 
	"Score2": 114, 
	"Score3": 156, 
	"Total": 384, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 40, 
	"Week": 2, 
	"Game": 3, 
	"Score1": 149, 
	"Score2": 161, 
	"Score3": 131, 
	"Total": 441, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 33, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 177, 
	"Score2": 129, 
	"Score3": 120, 
	"Total": 426, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 34, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 160, 
	"Score2": 138, 
	"Score3": 113, 
	"Total": 411, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 35, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 137, 
	"Score2": 89, 
	"Score3": 132, 
	"Total": 358, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 117, 
	"Score2": 140, 
	"Score3": 125, 
	"Total": 382, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 181, 
	"Score2": 121, 
	"Score3": 93, 
	"Total": 395, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 38, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 137, 
	"Score2": 133, 
	"Score3": 106, 
	"Total": 376, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 39, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 142, 
	"Score2": 186, 
	"Score3": 119, 
	"Total": 447, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 40, 
	"Week": 3, 
	"Game": 1, 
	"Score1": 147, 
	"Score2": 135, 
	"Score3": 132, 
	"Total": 414, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 33, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 165, 
	"Score2": 118, 
	"Score3": 130, 
	"Total": 413, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 34, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 192, 
	"Score2": 166, 
	"Score3": 129, 
	"Total": 487, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 35, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 130, 
	"Score2": 100, 
	"Score3": 191, 
	"Total": 421, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 154, 
	"Score2": 134, 
	"Score3": 152, 
	"Total": 440, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 138, 
	"Score2": 190, 
	"Score3": 90, 
	"Total": 418, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 38, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 185, 
	"Score2": 168, 
	"Score3": 140, 
	"Total": 493, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 39, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 127, 
	"Score2": 204, 
	"Score3": 114, 
	"Total": 445, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 40, 
	"Week": 3, 
	"Game": 2, 
	"Score1": 129, 
	"Score2": 137, 
	"Score3": 139, 
	"Total": 405, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Turtles", 
	"Player1": "Daniel Kim", 
	"Player2": "Daniella Shin", 
	"Player3": "Mike Chang", 
	"Lane": 33, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 177, 
	"Score2": 83, 
	"Score3": 122, 
	"Total": 382, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Whales", 
	"Player1": "Alex Kim", 
	"Player2": "Matt Choi", 
	"Player3": "Vivian Shin", 
	"Lane": 34, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 108, 
	"Score2": 134, 
	"Score3": 147, 
	"Total": 389, 
	"Wins": 1, 
	"Bracket": 1}, 
{
	"Team": "Cockroaches", 
	"Player1": "David Yim", 
	"Player2": "Diane Choe", 
	"Player3": "Greg Cheung", 
	"Lane": 35, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 107, 
	"Score2": 94, 
	"Score3": 133, 
	"Total": 334, 
	"Wins": 0, 
	"Bracket": 1}, 
{
	"Team": "Gamecocks", 
	"Player1": "James Jin Park", 
	"Player2": "Justin Kim", 
	"Player3": "Mimi Kim", 
	"Lane": 36, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 142, 
	"Score2": 177, 
	"Score3": 95, 
	"Total": 414, 
	"Wins": 3, 
	"Bracket": 1}, 
{
	"Team": "Little Ponies", 
	"Player1": "Ilhwan Hwang", 
	"Player2": "Rob Lee", 
	"Player3": "Steffi Yoon", 
	"Lane": 37, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 126, 
	"Score2": 156, 
	"Score3": 111, 
	"Total": 393, 
	"Wins": 1, 
	"Bracket": 2}, 
{
	"Team": "Flamingos", 
	"Player1": "Daniel Moon", 
	"Player2": "Eunice Lee", 
	"Player3": "Michelle Yoon", 
	"Lane": 38, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 138, 
	"Score2": 113, 
	"Score3": 93, 
	"Total": 344, 
	"Wins": 0, 
	"Bracket": 2}, 
{
	"Team": "Penguins", 
	"Player1": "Byungsoo Kim", 
	"Player2": "Daniel Song", 
	"Player3": "Jon Han", 
	"Lane": 39, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 167, 
	"Score2": 158, 
	"Score3": 85, 
	"Total": 410, 
	"Wins": 3, 
	"Bracket": 2}, 
{
	"Team": "Bulls", 
	"Player1": "Jon Lee", 
	"Player2": "Josh Cho", 
	"Player3": "Peter Pak", 
	"Lane": 40, 
	"Week": 3, 
	"Game": 3, 
	"Score1": 111, 
	"Score2": 108, 
	"Score3": 179, 
	"Total": 398, 
	"Wins": 1, 
	"Bracket": 2}
]

var bowlingarray = [
{
	"Name": "Daniel Moon", 
	"Team": "Flamingos", 
	"Gender": "Male", 
	"W1G1": 130, 
	"W1G2": 195, 
	"W1G3": 181, 
	"W1Ave": 169, 
	"W2G1": 165, 
	"W2G2": 133, 
	"W2G3": 136, 
	"W2Ave": 145, 
	"W2Overall": 157, 
	"W3G1": 137, 
	"W3G2": 185, 
	"W3G3": 138, 
	"W3Ave": 153, 
	"W3Overall": 156}, 
{
	"Name": "Eunice Lee", 
	"Team": "Flamingos", 
	"Gender": "Female", 
	"W1G1": 125, 
	"W1G2": 215, 
	"W1G3": 185, 
	"W1Ave": 175, 
	"W2G1": 159, 
	"W2G2": 155, 
	"W2G3": 135, 
	"W2Ave": 150, 
	"W2Overall": 162, 
	"W3G1": 133, 
	"W3G2": 168, 
	"W3G3": 113, 
	"W3Ave": 138, 
	"W3Overall": 154}, 
{
	"Name": "Michelle Yoon", 
	"Team": "Flamingos", 
	"Gender": "Female", 
	"W1G1": 115, 
	"W1G2": 101, 
	"W1G3": 111, 
	"W1Ave": 109, 
	"W2G1": 100, 
	"W2G2": 99, 
	"W2G3": 136, 
	"W2Ave": 112, 
	"W2Overall": 110, 
	"W3G1": 106, 
	"W3G2": 140, 
	"W3G3": 93, 
	"W3Ave": 113, 
	"W3Overall": 111}, 
{
	"Name": "Daniel Kim", 
	"Team": "Turtles", 
	"Gender": "Male", 
	"W1G1": 146, 
	"W1G2": 189, 
	"W1G3": 178, 
	"W1Ave": 171, 
	"W2G1": 158, 
	"W2G2": 129, 
	"W2G3": 135, 
	"W2Ave": 141, 
	"W2Overall": 156, 
	"W3G1": 177, 
	"W3G2": 165, 
	"W3G3": 177, 
	"W3Ave": 173, 
	"W3Overall": 162}, 
{
	"Name": "Daniella Shin", 
	"Team": "Turtles", 
	"Gender": "Female", 
	"W1G1": 107, 
	"W1G2": 93, 
	"W1G3": 84, 
	"W1Ave": 95, 
	"W2G1": 107, 
	"W2G2": 108, 
	"W2G3": 110, 
	"W2Ave": 108, 
	"W2Overall": 102, 
	"W3G1": 129, 
	"W3G2": 118, 
	"W3G3": 83, 
	"W3Ave": 110, 
	"W3Overall": 104}, 
{
	"Name": "Mike Chang", 
	"Team": "Turtles", 
	"Gender": "Male", 
	"W1G1": 139, 
	"W1G2": 143, 
	"W1G3": 155, 
	"W1Ave": 146, 
	"W2G1": 147, 
	"W2G2": 116, 
	"W2G3": 125, 
	"W2Ave": 129, 
	"W2Overall": 138, 
	"W3G1": 120, 
	"W3G2": 130, 
	"W3G3": 122, 
	"W3Ave": 124, 
	"W3Overall": 133}, 
{
	"Name": "Byungsoo Kim", 
	"Team": "Penguins", 
	"Gender": "Male", 
	"W1G1": 146, 
	"W1G2": 152, 
	"W1G3": 169, 
	"W1Ave": 156, 
	"W2G1": 138, 
	"W2G2": 110, 
	"W2G3": 110, 
	"W2Ave": 119, 
	"W2Overall": 138, 
	"W3G1": 142, 
	"W3G2": 127, 
	"W3G3": 167, 
	"W3Ave": 145, 
	"W3Overall": 140}, 
{
	"Name": "Daniel Song", 
	"Team": "Penguins", 
	"Gender": "Male", 
	"W1G1": 163, 
	"W1G2": 152, 
	"W1G3": 169, 
	"W1Ave": 161, 
	"W2G1": 212, 
	"W2G2": 224, 
	"W2G3": 181, 
	"W2Ave": 206, 
	"W2Overall": 184, 
	"W3G1": 186, 
	"W3G2": 204, 
	"W3G3": 158, 
	"W3Ave": 183, 
	"W3Overall": 183}, 
{
	"Name": "Jon Han", 
	"Team": "Penguins", 
	"Gender": "Male", 
	"W1G1": 123, 
	"W1G2": 114, 
	"W1G3": 105, 
	"W1Ave": 114, 
	"W2G1": 111, 
	"W2G2": 104, 
	"W2G3": 84, 
	"W2Ave": 100, 
	"W2Overall": 107, 
	"W3G1": 119, 
	"W3G2": 114, 
	"W3G3": 85, 
	"W3Ave": 106, 
	"W3Overall": 107}, 
{
	"Name": "James Jin Park", 
	"Team": "Gamecocks", 
	"Gender": "Male", 
	"W1G1": 108, 
	"W1G2": 141, 
	"W1G3": 204, 
	"W1Ave": 151, 
	"W2G1": 174, 
	"W2G2": 149, 
	"W2G3": 149, 
	"W2Ave": 157, 
	"W2Overall": 154, 
	"W3G1": 117, 
	"W3G2": 154, 
	"W3G3": 142, 
	"W3Ave": 138, 
	"W3Overall": 149}, 
{
	"Name": "Justin Kim", 
	"Team": "Gamecocks", 
	"Gender": "Male", 
	"W1G1": 163, 
	"W1G2": 121, 
	"W1G3": 144, 
	"W1Ave": 143, 
	"W2G1": 184, 
	"W2G2": 149, 
	"W2G3": 161, 
	"W2Ave": 165, 
	"W2Overall": 154, 
	"W3G1": 140, 
	"W3G2": 134, 
	"W3G3": 177, 
	"W3Ave": 150, 
	"W3Overall": 153}, 
{
	"Name": "Mimi Kim", 
	"Team": "Gamecocks", 
	"Gender": "Female", 
	"W1G1": 110, 
	"W1G2": 132, 
	"W1G3": 132, 
	"W1Ave": 125, 
	"W2G1": 142, 
	"W2G2": 110, 
	"W2G3": 131, 
	"W2Ave": 128, 
	"W2Overall": 126, 
	"W3G1": 125, 
	"W3G2": 152, 
	"W3G3": 95, 
	"W3Ave": 124, 
	"W3Overall": 125}, 
{
	"Name": "Ilhwan Hwang", 
	"Team": "Little Ponies", 
	"Gender": "Male", 
	"W1G1": 125, 
	"W1G2": 125, 
	"W1G3": 125, 
	"W1Ave": 125, 
	"W2G1": 153, 
	"W2G2": 133, 
	"W2G3": 170, 
	"W2Ave": 152, 
	"W2Overall": 139, 
	"W3G1": 181, 
	"W3G2": 138, 
	"W3G3": 126, 
	"W3Ave": 148, 
	"W3Overall": 142}, 
{
	"Name": "Rob Lee", 
	"Team": "Little Ponies", 
	"Gender": "Male", 
	"W1G1": 155, 
	"W1G2": 120, 
	"W1G3": 172, 
	"W1Ave": 149, 
	"W2G1": 168, 
	"W2G2": 159, 
	"W2G3": 168, 
	"W2Ave": 165, 
	"W2Overall": 157, 
	"W3G1": 121, 
	"W3G2": 190, 
	"W3G3": 156, 
	"W3Ave": 156, 
	"W3Overall": 157}, 
{
	"Name": "Steffi Yoon", 
	"Team": "Little Ponies", 
	"Gender": "Female", 
	"W1G1": 99, 
	"W1G2": 93, 
	"W1G3": 128, 
	"W1Ave": 107, 
	"W2G1": 73, 
	"W2G2": 96, 
	"W2G3": 73, 
	"W2Ave": 81, 
	"W2Overall": 94, 
	"W3G1": 93, 
	"W3G2": 90, 
	"W3G3": 111, 
	"W3Ave": 98, 
	"W3Overall": 95}, 
{
	"Name": "Jon Lee", 
	"Team": "Bulls", 
	"Gender": "Male", 
	"W1G1": 110, 
	"W1G2": 110, 
	"W1G3": 110, 
	"W1Ave": 110, 
	"W2G1": 125, 
	"W2G2": 145, 
	"W2G3": 130, 
	"W2Ave": 133, 
	"W2Overall": 122, 
	"W3G1": 147, 
	"W3G2": 129, 
	"W3G3": 111, 
	"W3Ave": 129, 
	"W3Overall": 124}, 
{
	"Name": "Josh Cho", 
	"Team": "Bulls", 
	"Gender": "Male", 
	"W1G1": 98, 
	"W1G2": 135, 
	"W1G3": 132, 
	"W1Ave": 122, 
	"W2G1": 116, 
	"W2G2": 119, 
	"W2G3": 112, 
	"W2Ave": 116, 
	"W2Overall": 119, 
	"W3G1": 135, 
	"W3G2": 137, 
	"W3G3": 108, 
	"W3Ave": 127, 
	"W3Overall": 121}, 
{
	"Name": "Peter Pak", 
	"Team": "Bulls", 
	"Gender": "Male", 
	"W1G1": 190, 
	"W1G2": 130, 
	"W1G3": 179, 
	"W1Ave": 166, 
	"W2G1": 168, 
	"W2G2": 149, 
	"W2G3": 120, 
	"W2Ave": 146, 
	"W2Overall": 156, 
	"W3G1": 132, 
	"W3G2": 139, 
	"W3G3": 179, 
	"W3Ave": 150, 
	"W3Overall": 154}, 
{
	"Name": "David Yim", 
	"Team": "Cockroaches", 
	"Gender": "Male", 
	"W1G1": 137, 
	"W1G2": 119, 
	"W1G3": 139, 
	"W1Ave": 132, 
	"W2G1": 150, 
	"W2G2": 179, 
	"W2G3": 114, 
	"W2Ave": 148, 
	"W2Overall": 140, 
	"W3G1": 137, 
	"W3G2": 130, 
	"W3G3": 107, 
	"W3Ave": 125, 
	"W3Overall": 135}, 
{
	"Name": "Diane Choe", 
	"Team": "Cockroaches", 
	"Gender": "Female", 
	"W1G1": 102, 
	"W1G2": 157, 
	"W1G3": 110, 
	"W1Ave": 123, 
	"W2G1": 100, 
	"W2G2": 128, 
	"W2G3": 114, 
	"W2Ave": 114, 
	"W2Overall": 119, 
	"W3G1": 89, 
	"W3G2": 100, 
	"W3G3": 94, 
	"W3Ave": 94, 
	"W3Overall": 110}, 
{
	"Name": "Greg Cheung", 
	"Team": "Cockroaches", 
	"Gender": "Male", 
	"W1G1": 113, 
	"W1G2": 137, 
	"W1G3": 171, 
	"W1Ave": 140, 
	"W2G1": 178, 
	"W2G2": 137, 
	"W2G3": 156, 
	"W2Ave": 157, 
	"W2Overall": 149, 
	"W3G1": 132, 
	"W3G2": 191, 
	"W3G3": 133, 
	"W3Ave": 152, 
	"W3Overall": 150}, 
{
	"Name": "Alex Kim", 
	"Team": "Whales", 
	"Gender": "Male", 
	"W1G1": 224, 
	"W1G2": 189, 
	"W1G3": 191, 
	"W1Ave": 201, 
	"W2G1": 122, 
	"W2G2": 182, 
	"W2G3": 135, 
	"W2Ave": 146, 
	"W2Overall": 174, 
	"W3G1": 160, 
	"W3G2": 192, 
	"W3G3": 108, 
	"W3Ave": 153, 
	"W3Overall": 167}, 
{
	"Name": "Matt Choi", 
	"Team": "Whales", 
	"Gender": "Male", 
	"W1G1": 129, 
	"W1G2": 149, 
	"W1G3": 148, 
	"W1Ave": 142, 
	"W2G1": 189, 
	"W2G2": 127, 
	"W2G3": 113, 
	"W2Ave": 143, 
	"W2Overall": 143, 
	"W3G1": 138, 
	"W3G2": 166, 
	"W3G3": 134, 
	"W3Ave": 146, 
	"W3Overall": 144}, 
{
	"Name": "Vivian Shin", 
	"Team": "Whales", 
	"Gender": "Female", 
	"W1G1": 169, 
	"W1G2": 125, 
	"W1G3": 156, 
	"W1Ave": 150, 
	"W2G1": 118, 
	"W2G2": 101, 
	"W2G3": 167, 
	"W2Ave": 129, 
	"W2Overall": 139, 
	"W3G1": 113, 
	"W3G2": 129, 
	"W3G3": 147, 
	"W3Ave": 130, 
	"W3Overall": 136}
]