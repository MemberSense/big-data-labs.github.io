'use strict';

/* App Module */

var baseApp = angular.module('baseApp', [
/* 'ngRoute', */
  'ionic',
  'baseAppControllers',
/* 'baseAppServices' */
  'oc.lazyLoad'
  
]);
/*
config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    console.log("lazy loading ui.calendar");
		// We configure ocLazyLoad to use the lib script.js as the async loader
		$ocLazyLoadProvider.config({
			debug: true,
			events: true,
			modules: [{
				name: 'ui.calendar',
				files: [
					'http://localhost/base/bower_components/bootstrap-css/css/bootstrap.css',
                    'http://localhost/base/bower_components/fullcalendar/dist/fullcalendar.css',
                    'http://localhost/base/bower_components/jquery-ui/ui/jquery-ui.js',
                    'http://localhost/base/bower_components/moment/moment.js',
                    'http://localhost/base/bower_components/angular-ui-calendar/src/calendar.js',
                    'http://localhost/base/bower_components/fullcalendar/dist/fullcalendar.js',
                    'http://localhost/base/bower_components/fullcalendar/dist/gcal.js'
				]
			}]
		});
	}]);
*/
