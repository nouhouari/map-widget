
'use strict';

angular.module('adf.widget.map')
  .controller('mapController', mapController);

function mapController($scope, data, config) {
  this.data = data;


  $scope.center = [0, 0];
  $scope.centerCoord = ol.proj.transform($scope.center, 'EPSG:4326', 'EPSG:3857');

  if (null != config.center) {
    //Map center 
    $scope.center = [config.center.lon, config.center.lat];
    $scope.centerCoord = ol.proj.transform($scope.center, 'EPSG:4326', 'EPSG:3857');
  }

 var zoom = 4;
 if(null == config.zoom){
   
 }

  var divMap = document.getElementById('map');

  console.log("map  centerCoord : " + $scope.centerCoord);
  console.log("Init" + ol);
  console.log(config.center);

  // Create Map instance
  $scope.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    })
  });

  $scope.map.getView().setCenter($scope.centerCoord);
  $scope.map.getView().setZoom(config.zoom);


 


}
