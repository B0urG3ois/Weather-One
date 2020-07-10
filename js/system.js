var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'view/login.html',
        controller: 'login'
    })
    .when('/home', {
        resolve: {
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn){
                    $location.path('/');
                }
            }
        },
		templateUrl: 'view/home.html',
		controller: 'home'
    })
    .when('/about', {
        resolve: {
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn){
                    $location.path('/');
                }
            }
        },
    	templateUrl: 'view/about.html',
		controller: 'aboutme'
    })
    .when('/detail', {
        resolve: {
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn){
                    $location.path('/');
                }
            }
        },
    	templateUrl: 'view/detail.html',
		controller: 'detailCtrl'
    })
});


app.controller('login', function($scope, $location, $interval, $rootScope){
	$scope.user = {
		'userName':'', 
		'passWord':''
	};

    var tick = function() {
        $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);

	var UserName = localStorage.getItem('userName');
	var UserPass = localStorage.getItem('passWord');

	$scope.authLogin = function(){
		if($scope.user.userName == UserName && $scope.user.passWord == UserPass) {
			$rootScope.loggedIn = true;
			$location.path('/home');
		} else {
            $scope.error = true;
            $location.path('/');
        }
	}
})

app.controller('home', function($scope, $http, $location, $rootScope){
	$http({
        method : "GET",
        url : "https://api.openweathermap.org/data/2.5/box/city?bbox=106.442365,-6.328343,106.700696,-6.032327,10&appid=4a021deb6d6e51ba620abe955ea81654"
    }).then(function (response) {
    	$scope.cuaca = response.data.list;
    }, function (response) {
        console.log("Unstable Network");
    });

    $scope.logOut = function(){
		$location.path('/');
		$rootScope.loggedIn = false;
	}

    $scope.detail = function(xId) {
    	$rootScope.idKota = xId;
    	$location.path('/detail');
    }
});

app.controller('detailCtrl', function($scope, $http, $interval, $location, $rootScope){
	$scope.Today = new Date();

	var tick = function() {
    	$scope.clock = Date.now();
  	}
  	tick();
  	$interval(tick, 1000);


	$http({
        method : "GET",
        url : "https://api.openweathermap.org/data/2.5/weather?id="+ $rootScope.idKota +"&appid=4a021deb6d6e51ba620abe955ea81654"
    }).then(function (response) {
    	console.log(response);
    	$scope.Nama = response.data.name;
    	$scope.Country = response.data.sys.country;

    	$scope.Pressure = response.data.main.pressure;
    	$scope.Desc = response.data.weather[0].description;

    	$scope.Lat = response.data.coord.lat;
    	$scope.Lon = response.data.coord.lon;

    	$scope.Humidity = response.data.main.humidity;
    	$scope.Speed = response.data.wind.speed;
    	$scope.Cloud = response.data.clouds.all;

    	$scope.CelciusMax = (response.data.main.temp_max-273).toFixed(1);
    	$scope.CelciusMin = (response.data.main.temp_min-273).toFixed(1);
    	$scope.Celcius = (response.data.main.temp-273).toFixed(1);

    	$scope.Icon = response.data.weather[0].icon;
    }, function (response) {
        console.log("Unstable Network");
    });

    $scope.logOut = function(){
		$location.path('/');
		$rootScope.loggedIn = false;
	}
});

app.controller('aboutme', function($scope, $location, $rootScope){
    $scope.logOut = function(){
        $location.path('/');
        $rootScope.loggedIn = false;
    }

    $scope.mores = function() {
        $scope.banyak = true;
    }
});