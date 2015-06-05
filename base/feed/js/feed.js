var app = angular.module('feed', ['jsonFormatter', 'slick']);
/*
app.directive("gfSlickCarousel", function($timeout) {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            $timeout(function() {
                 $(element).slick(scope.$eval(attrs.gfSlickCarousel));
                 console.log("slick initialized");
            });
            
            
        }
    };
});
*/

app.controller('FeePageController', function($scope, $http) {
    $http.jsonp('http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=JSON_CALLBACK&tid=16400').
    success(function (data) {
        $scope.data = data;
        $scope.images = [];
        console.log(data);
        for(item in data.items) {
            for(image in data.items[item].images) {
                $scope.images.push(data.items[item].images[image].large);
            }
        }
        console.log($scope.images);
    }).
    error(function (data) {
        $scope.data = "Request failed";
    });
});

