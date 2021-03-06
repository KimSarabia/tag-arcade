'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $window, $rootScope, $location) {
   $rootScope.$on('$stateChangeStart', function() { $window.scrollTo(0,0) });
   $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
});

app.controller('homeCtrl', function($scope, $state) {
});
app.controller('allvideosCtrl', ['$scope', '$state','$http','VideoService','$sce',function($scope, $state, $http, VideoService,$sce){
  $scope.videos = [];
  $scope.ready = false;
  VideoService.getVideos().then(function(res){
      $scope.videos = res.data;
      $scope.ready = true;
  }).catch(function(err){
  });
  $scope.goToVideos = function(event,vidTitle){
      event.preventDefault();
      VideoService.setTitle(vidTitle);
      $state.go('video-page');
  }
}]);

app.controller('videopageCtrl', ['$scope','$state','$http','VideoService','$sce',function($scope, $state, $http,VideoService,$sce){
  $scope.videos = [];
  $scope.ready = false;
  $scope.vidLink = null;
  $scope.vidCode = null;
  VideoService.getVideos().then(function(res){
      $scope.videos = res.data;
      var vidTitle = VideoService.getTitle();
      var videoObject = $scope.videos.find(function(i){
            return i.vidTitle === vidTitle;
      });
      $scope.ready = true;
      if(videoObject){
        $scope.vidTitle = videoObject.vidTitle;
          $scope.vidLink = $sce.trustAsResourceUrl(videoObject.vidLink);
          $scope.vidCode = $sce.trustAsResourceUrl(videoObject.vidCode);
          $scope.heading = videoObject.heading;
          $scope.imgUrl = videoObject.imgUrl;
          $scope.category = videoObject.category;
          $scope.post = videoObject.post;
        }
  }).catch(function(err){
    console.log(err);
  });

  $scope.newVid = function(event,vidTitle){
      event.preventDefault();
      VideoService.setTitle(vidTitle);
      $state.reload();
  }
}]);
