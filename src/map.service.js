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

function mapService($q, $http, $sce, mapServiceUrl, mapApiKey) {

  // use sce for angular >= 1.6
  function _oneSix(untrusted) {
    var url = $sce.trustAsResourceUrl(untrusted);
    return $http.jsonp(url, {jsonpCallbackParam: 'callback'});
  }

  // add callback parameter to angular < 1.6
  function _beforeOneSix(incomplete){
    var url = incomplete + '&callback=JSON_CALLBACK';
    return $http.jsonp(url);
  }

  // choose jsonp style by angular version
  var jsonp;
  if (angular.version.major === 1 && angular.version.minor >= 6) {
    jsonp = _oneSix;
  } else {
    jsonp = _beforeOneSix;
  }

  // exposed functions

  function get(location) {
    var deferred = $q.defer();
    var url = mapServiceUrl + location + '&appid=' + mapApiKey;
    jsonp(url, {jsonpCallbackParam: 'callback'})
      .then(function(response) {
        return response.data;
      })
      .then(function (data) {
        if (data && data.cod === 200) {
          deferred.resolve(data);
        } else {
          deferred.reject('map service returned invalid body');
        }
      })
      .catch(function(e) {
        deferred.reject('map service returned ' + e.status);
      });

    return deferred.promise;
  }

  return {
    get: get
  };
}
