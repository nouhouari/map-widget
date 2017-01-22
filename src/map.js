'use strict';

angular.module('adf.widget.map', ['adf.provider'])
  .value('argument1', 'value arg1')
  .value('argument2', 'value arg2')
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
