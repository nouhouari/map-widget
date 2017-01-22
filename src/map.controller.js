
'use strict';

angular.module('adf.widget.map')
  .controller('mapController', mapController);

function mapController($scope, data, config) {
  $scope.clusters = data;

  console.log(data);


  //Set the map center and projection
  $scope.center = [0, 0];
  $scope.centerCoord = ol.proj.transform($scope.center, 'EPSG:4326', 'EPSG:3857');

  if (null != config.center) {
    //Map center 
    $scope.center = [config.center.lon, config.center.lat];
    $scope.centerCoord = ol.proj.transform($scope.center, 'EPSG:4326', 'EPSG:3857');
  }

  //Default zoom level
  var zoom = 4;
  if (null == config.zoom) {

  }

  // Create Map instance
  $scope.map = new ol.Map({
    controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
    ]),
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

  // Set center and Zoom from configuration values
  $scope.map.getView().setCenter($scope.centerCoord);
  $scope.map.getView().setZoom(config.zoom);

  //Add cluster layer
  if (null != $scope.clusters) {
    console.log("Add layer.");
    console.log("$scope.clusters.visible : " + $scope.clusters.getVisible());
    $scope.map.addLayer($scope.clusters);
  }


}
