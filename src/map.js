'use strict';

angular.module('adf.widget.map', ['adf.provider'])
  .value('mapApiKey', '2decdac859755da9d25281b20f0dc7a1')
  .value('mapServiceUrl', 'http://api.openmapmap.org/data/2.5/map?units=metric&q=')
  .config(RegisterWidget);

function RegisterWidget(dashboardProvider) {
  dashboardProvider
    .widget('map', {
      title: 'map',
      description: 'Display the current temperature of a city',
      templateUrl: '{widgetsPath}/map/src/view.html',
      controller: 'mapController',
      controllerAs: 'vm',
      reload: true,
      resolve: {
        data: function (mapService, config) {
          if (config.location) {
            return mapService.get(config.location);
          }
        }
      },
      edit: {
        templateUrl: '{widgetsPath}/map/src/edit.html'
      }
    });
}
