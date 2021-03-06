/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('adf.widget.map')
  .service('mapService', mapService);

function mapService($q, $http, $sce, argument1, argument2) {

  console.log("Service called with arguments " + argument1 + " " + argument2)

  //   // use sce for angular >= 1.6
  //   function _oneSix(untrusted) {
  //     var url = $sce.trustAsResourceUrl(untrusted);
  //     return $http.jsonp(url, {jsonpCallbackParam: 'callback'});
  //   }

  //   // add callback parameter to angular < 1.6
  //   function _beforeOneSix(incomplete){
  //     var url = incomplete + '&callback=JSON_CALLBACK';
  //     return $http.jsonp(url);
  //   }

  //   // choose jsonp style by angular version
  //   var jsonp;
  //   if (angular.version.major === 1 && angular.version.minor >= 6) {
  //     jsonp = _oneSix;
  //   } else {
  //     jsonp = _beforeOneSix;
  //   }

  //   // exposed functions

  function getColor(size) {
    if (size > 100) {
      size = 100;
    }
    var r = Math.floor((255 * size) / 100),
      g = Math.floor((255 * (100 - size)) / 100),
      b = 0;

    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function get(location) {
    var deferred = $q.defer();
    var url = location;
    console.log("Location of the marker service : " + url);

    //Create dummy vectore of features
    var count = 20000;
    var distance = 80;
    var features = new Array(count);
    var e = 4500000;
    for (var i = 0; i < count; ++i) {
      var coordinates = [101 + 10 * Math.random(), 5 * 2.0 * Math.random() - 2.0];
      features[i] = new ol.Feature(new ol.geom.Point(ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')));
    }

    var source = new ol.source.Vector({
      features: features
    });

    var clusterSource = new ol.source.Cluster({
      distance: distance,
      source: source
    });

    //Optimisation for style cache
    var styleCache = {};

    var clusters = new ol.layer.Vector({
      source: clusterSource,
      style: function (feature) {

        var size = feature.get('features').length;

        var style = styleCache[size];
        if (!style) {
          if (size > 1) {
            style = new ol.style.Style({
              image: new ol.style.Circle({
                radius: Math.min(50, Math.max(15, size / 10)),
                stroke: new ol.style.Stroke({
                  color: '#fff'
                }),
                fill: new ol.style.Fill({
                  color: getColor(size)
                })
              }),
              text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                  color: '#fff'
                }),
                stroke: new ol.style.Stroke({
                  color: 'rgba(0, 0, 0, 0.6)',
                  width: 3
                })
              })
            });
            styleCache[size] = style;
          } else {
            style = new ol.style.Style({
              image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
              }))
            });
            styleCache[size] = style;
          }
        }
        return style;
      }
    });

    deferred.resolve(clusters);




    // jsonp(url, {jsonpCallbackParam: 'callback'})
    //   .then(function(response) {
    //     return response.data;
    //   })
    //   .then(function (data) {
    //     if (data && data.cod === 200) {
    //       deferred.resolve(data);
    //     } else {
    //       deferred.reject('map service returned invalid body');
    //     }
    //   })
    //   .catch(function(e) {
    //     deferred.reject('map service returned ' + e.status);
    //   });

    deferred.reject('map service returned invalid body');

    return deferred.promise;
  }

  return {
    get: get
  };
}
