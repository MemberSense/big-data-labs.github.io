'use strict';

/* Controllers */

var baseAppControllers = angular.module('baseAppControllers', []);

baseAppControllers.controller('LoadingCtrl', function($scope, $timeout, $ionicLoading) {

  
  $scope.showLoading = function() {
      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        template: 'Loading<i class="icon ion-ios7-reloading"></i>',
        animation: 'fade-in',
        showBackdrop: true,
        //maxWidth: 200,
        showDelay: 0
      });
  };
  //$scope.showLoading();
  $scope.hideLoading = function() {
      $ionicLoading.hide();
  };
  
  
});

baseAppControllers.controller('accordionCtrl', function ($scope) {

    // initiate an array to hold all active tabs
    $scope.activeTabs = [];

    // enable/disable tab toggling when clicking
    $scope.enableTabToggle = true;

    // check if the tab is active
    $scope.isOpenTab = function (tab) {
        // check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            // if so, return true
            return true;
        } else {
            // if not, return false
            return false;
        }
    }

    $scope.openTab = function (tab) {
        if ($scope.enableTabToggle) {

            // check if tab is already open
            if ($scope.isOpenTab(tab)) {
                // if it is, remove it
                $scope.closeTab(tab);
            }
            else {
                // if it's not, add it!

                // ensure only 1 tab is open at a time.
                // close any open tabs and perform any tab-closing logic
                $scope.closeAllTabs();

                // add the tab
                $scope.activeTabs.push(tab);

                // Scroll the opened tab to the top. Add a delay so that
                // the previous tab is closed (if any) and the new tab is opened.
                // This allows the scroll position to be correctly calculated.
                // Note: there may be a more elegant way to execute the code below
                // using angular so that a timer doesn't have to be used.
                setTimeout(function () {
                    var $target = $('#' + tab);
                    var offset = 0;

                    // get the offset parent
                    var $contentParent = $target.offsetParent();

                    // get the scroll position for the offset parent
                    var currentScrollVal = $contentParent.scrollTop();

                    // get the position of the target relative to the offset parent, not the document.
                    var target_position = $target.position();
                    var target_top = target_position.top - offset;

                    // adjust the scroll position for the target. target_top may be negative.
                    target_top = currentScrollVal + target_top;

                    //console.log ('currentScrollVal: ' + currentScrollVal + ' target_position.top: ' + target_position.top + ' target_top: ' + target_top);

                    // scroll the offset parent, not the document.
                    $contentParent.scrollTop(target_top);
                }, 100);
            }
        }
        else {
            // check if tab is already open
            if (!$scope.isOpenTab(tab)) {
                // add the tab
                $scope.activeTabs.push(tab);
            }
        }
    };

    $scope.closeTab = function (tab) {
        if ($scope.isOpenTab(tab)) {

            // perform any tab-closing logic
            $scope.tabClosing(tab);

            // remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        }
    };

    $scope.closeAllTabs = function () {
        $.each($scope.activeTabs, function (index, openedTab) {
            // don't call closeTab from here since that function updates the array
            // perform any tab-closing logic
            $scope.tabClosing(openedTab);
        });

        $scope.activeTabs.length = 0;
    };

    $scope.rows = [
        { id: "view", text: "View", style: { display: 'none' } },
        { id: "position", text: "Layout", style: { display: 'none' } },
        { id: "map", text: "Map Type", style: { display: 'none' } },
        { id: "location", text: "Location" },
        { id: "categories", text: "Categories" }
    ];


    $scope.accordionHeader = {
        viewOptionsTitle: 'View Options',
        positionOptionsTitle: 'Position Options',
        mapOptionsTitle: 'Map Options',
        locationOptionsTitle: 'Location Options',
        categoryOptionsTitle: 'Category Options'
    };

    $scope.tabClosing = function (closingTab) {
        if (closingTab == 'locationOptions') {
            $scope.accordionHeader.locationOptionsTitle = displayLocText();
        }
        else if (closingTab == 'positionOptions') {
            $scope.accordionHeader.positionOptionsTitle = getPositionText();
        }
        else if (closingTab == 'categoryOptions') {
            $scope.accordionHeader.categoryOptionsTitle = getCategoriesText();
        }
    };

    $scope.$on('initialLoad', function (event, data) {
        // Use $apply to force the bindings to be updated, otherwise
        // the view isn't updated until the user interacts with the UI.
        $scope.$apply(function () {
            $scope.accordionHeader.locationOptionsTitle = displayLocText();
            $scope.accordionHeader.positionOptionsTitle = getPositionText();
            $scope.accordionHeader.categoryOptionsTitle = getCategoriesText();
        });
    });

    $scope.openTab('locationOptions');
    $scope.openTab('categoryOptions');
});

baseAppControllers.controller('viewOptionCtrl', function ($scope) {
    var viewOptions = defaultViewOptions;
    var viewOptionsCookie = $.cookie('viewOptions');
    if (typeof (viewOptionsCookie) != 'undefined') {
        viewOptions = viewOptionsCookie;
    }

    // The id values in viewOptionsList correspond to property names in smartWidget
    $scope.viewOptionsList = [
        { text: "Images", checked: viewOptions.showImages, id: "showImages", class: "viewOptionSlideshow" },
        { text: "Map", checked: viewOptions.showMap, id: "showMap", class: "viewOptionMap" },
        { text: "List", checked: viewOptions.showList, id: "showList", class: "viewOptionList" },
        { text: "Gallery", checked: viewOptions.showGallery, id: "showGallery", class: "viewOptionGallery" },
        { text: "Calendar", checked: viewOptions.showCalendar, id: "showCalendar", class: "viewOptionCalendar" },
    ];

    $scope.selectionChanged = function (item) {
        if (typeof (console) != 'undefined') {
            console.log("View option changed: ", item.text, ", checked: ", item.checked);
        }
        var viewOptionsCookie = $.cookie('viewOptions');
        viewOptionsCookie[item.id] = item.checked;
        $.cookie('viewOptions', viewOptionsCookie);
        updateSelectedText();
    };

    function updateSelectedText() {
        var selectedText = '';
        $.each($scope.viewOptionsList, function (index, item) {
            if (item.checked == true) {
                selectedText += item.text + ', ';
            }
        });
        if (selectedText.length > 0) {
            selectedText = selectedText.substring(0, selectedText.length - 2); // remove trailing comma and space.
            $scope.accordionHeader.viewOptionsTitle = selectedText;
        }
        else {
            $scope.accordionHeader.viewOptionsTitle = 'No view selected';
        }
    }

    updateSelectedText();
});

baseAppControllers.controller('mapOptionCtrl', function ($scope) {
    $scope.mapOptionsList = [
        { text: "Google Map", value: "googleLink", class: "googleLink" },
        { text: "Google Cluster", value: "googleClusterLink", class: "googleClusterLink" },
        { text: "Bing Map", value: "bingLink", class: "bingLink" },
        //{ text: "JPEG", value: "jpegMap", class: "user-9 jpegMap", style: { 'display': 'none'} },
        //{ text: "ESRI Map", value: "esriMap", class: "user-9 esriMap", style: { 'display': 'none'} },
        { text: "Static Map", value: "staticMap", class: "staticMap" }
    ];

    // An object must be used for the selected value in order for two-way
    // binding to take effect. Trying to use a string value such as
    // the following will only work on the initial load:
    // $scope.selection = 'googleLink'; 
    $scope.selection = { optionValue: 'googleLink' };

    $scope.selectionChanged = function (item) {
        if (typeof (console) != 'undefined') {
            console.log("Map option selected value: ", item.value, ", text: ", item.text);
        }

        $scope.accordionHeader.mapOptionsTitle = item.text;
    };

    $scope.selectionChanged($scope.mapOptionsList[0]);
});

baseAppControllers.controller('SlideContainerCtrl', function($scope,$ionicScrollDelegate,filterFilter) {
      
      $scope.isde = $ionicScrollDelegate.$getByHandle('isde');
      $scope.reverseElement = 0;    
      $scope.scrollposition = 0;
      $scope.toscroll = 1200;
      //$scope.feed = data;
      $scope.items = [];
      $scope.noMoreItemsAvailable = false;
      $scope.number = 5;
      $scope.totalElement = 10;
      $scope.settings = {"play" : false,"direction" : "x" ,"currentItemsPerPage" : 1};
      var letters = $scope.letters = [];
      var contacts = $scope.contacts = [];
      var currentCharCode = 'A'.charCodeAt(0) - 1;
      
      
       
      var locitems = $scope.items.length;
      for(var i=0;i<5;i++)
      {
          //$scope.items.push($scope.feed.data.items[locitems + i]);
      }
      
      $scope.items
      .sort(function(a, b) {
        return a.last_name > b.last_name ? 1 : -1;
      })
      .forEach(function(location) {
        //Get the first letter of the last name, and if the last name changes
        //put the letter in the array
        var locationCharCode = location.title.toUpperCase().charCodeAt(0);
        //We may jump two letters, be sure to put both in
        //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
        var difference = locationCharCode - currentCharCode;
        for (var i = 1; i <= difference; i++) {
          addLetter(currentCharCode + i);
        }
        currentCharCode = locationCharCode;
        $scope.items.push(location);
      });

      //If names ended before Z, add everything up to Z
      for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
        addLetter(i);
      }

      function addLetter(code) {
        var letter = String.fromCharCode(code);
        $scope.items.push({
          isLetter: true,
          letter: letter
        });
        letters.push(letter);
      }
      
      var letterHasMatch = {};
      $scope.getLocations = function() {
        letterHasMatch = {};
        //Filter contacts by $scope.search.
        //Additionally, filter letters so that they only show if there
        //is one or more matching contact
        return $scope.items.filter(function(item) {
          if (typeof item.title != 'undefined') {
              var itemDoesMatch = !$scope.search || item.isLetter ||
                item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

              //Mark this person's last name letter as 'has a match'
              if (!item.isLetter && itemDoesMatch) {
                var letter = item.title.charAt(0).toUpperCase();
                letterHasMatch[letter] = true;
              }

              return itemDoesMatch;
          }
        }).filter(function(item) {
          //Finally, re-filter all of the letters and take out ones that don't
          //have a match
          if (item.isLetter && !letterHasMatch[item.letter]) {
            return false;
          }
          return true;
        });
      };
 
      $scope.clearSearch = function() {
        $scope.search = '';
      };
      //Letters are shorter, everything else is 52 pixels
      $scope.getItemHeight = function(item) {
        return item.isLetter ? 40 : 100;
      };
      $scope.getItemWidth = function(item) {
        return '100%';
      };
      $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBottom(true);
      };
      $scope.getScrollPosition = function()
      {
        console.log($scope.isde.getScrollPosition());
        console.log($scope.isde.getScrollView());
      }
      
      $scope.scrollTop = function()
      {
          $ionicScrollDelegate.scrollTop();
      }

      $scope.swipeRight = function()
      {
           if($scope.scrollposition == 0)
            {
              $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
              $scope.items.unshift($scope.feed.data.items[$index]);
              $scope.reverseElement++;
            }
          
      }

      $scope.swipeLeft = function()
      {
        alert("Swipe Left");
      }
    
      $scope.scrollPrev = function()
      {
          if($scope.scrollposition == 0)
          {
            $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
            $scope.items.unshift($scope.feed.data.items[$index]);
            $scope.reverseElement++;
          }
          else
          {
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition - $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true);
          }
          
        
      }

      $scope.scrollNext = function()
      {
        $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
        $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
        $scope.isde.scrollTo($scope.scrollposition,0,true);
      }
     
      //  It is called when there is need of more feed
     

        /*
      $scope.loadMore = function()
      {
        
        locitems = $scope.items.length % $scope.totalElement;
        
        if((($scope.totalElement - locitems) < 10) && (($scope.totalElement - locitems) != 0))
        {
          var newitems = $scope.totalElement - locitems;
          for(var i=0;i<newitems;i++)
          {
            $scope.items.push($scope.feed.data.items[locitems + i]);
          }
        }
        else
        { 
          for(var i=0;i<$scope.number;i++)
          {
             $scope.items.push($scope.feed.data.items[locitems + i]);
          }
        }
        /* apply filter again */
        /*
        $scope.items.filter(function(item) {
          if (typeof item.title != 'undefined') {
              var itemDoesMatch = !$scope.search || item.isLetter ||
                item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

              //Mark this person's last name letter as 'has a match'
              if (!item.isLetter && itemDoesMatch) {
                var letter = item.title.charAt(0).toUpperCase();
                letterHasMatch[letter] = true;
              }

              return itemDoesMatch;
          }
        }).filter(function(item) {
          //Finally, re-filter all of the letters and take out ones that don't
          //have a match
          if (item.isLetter && !letterHasMatch[item.letter]) {
            return false;
          }
          return true;
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');
  
      } */

      // Change the number of Items Displayed on screen
      $scope.settings.currentItemsPerPage =  1;
      $scope.itemWidth = 100/$scope.settings.currentItemsPerPage + "%"; 


      $scope.changeItems = function()
      {
        $scope.itemWidth = 100/$scope.settings.currentItemsPerPage + "%";
        console.log($scope.isde.resize());
      }

      // Function for Auto Scroll
      // Default Set to True
      var scroll;
      $scope.autoScroll = function(value)
      {
        console.log($scope.settings.play);
        if($scope.settings.play == true)
        { 
            scroll = $interval(function(){
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true);
            },2200); 
        }
        else if($scope.settings.play == false)
        {
          console.log(angular.isDefined(scroll));
          $interval.cancel(scroll);
        }
        

      }

      

     

});
baseAppControllers.controller('CalendarCtrl', function($scope, $ocLazyLoad, $compile, $timeout) {
    
        var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    /* event source that pulls from google.com */
    /*$scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };*/
    /* event source that contains custom events on the scope */
    $scope.events = [
      /*{title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
      */
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };
    
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function( event, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped on ' + event.start.format());
    };
    /* alert on Resize */
    $scope.alertOnResize = function( event, jsEvent, ui, view){
       $scope.alertMessage = ('Event end date was moved to ' + event.end.format());
    };
    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        eventLimit: 9, // If you set a number it will hide the itens
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    
    $scope.eventSources = [$scope.events];

    $scope.onDragUp = function () {
        console.log("onDragUp: " + $ionicScrollDelegate.getScrollPosition().top);
        $ionicScrollDelegate.scrollBy(0,20);
    };
    $scope.onDragDown = function () {
        console.log("onDragDown: " + $ionicScrollDelegate.getScrollPosition().top);
        $ionicScrollDelegate.scrollBy(0,-20);
    };
    
    
        $scope.loadCalendar = function() {
        $ocLazyLoad.load({
			name: 'ui.calendar',
			files: [
				'../bower_components/bootstrap-css/css/bootstrap.css',
				'../bower_components/fullcalendar/dist/fullcalendar.css',
				'../bower_components/jquery-ui/ui/jquery-ui.js',
				'../bower_components/moment/moment.js',
				'../bower_components/angular-ui-calendar/src/calendar.js',
				'../bower_components/fullcalendar/dist/fullcalendar.js'
				//'../bower_components/fullcalendar/dist/gcal.js'
			]
		}).then(function success(data) {
			console.log('loaded calendar', data);
            
            var script = document.createElement('script');
            script.type = 'text/javascript';
            //script.async = true;
            script.src = '../bower_components/fullcalendar/dist/gcal.js';
            document.body.appendChild(script);
            
            $('#smartList').show();
            
            var html = '<div id="smartCalendar" class="angularCompile"  ng-controller="CalendarCtrl" ><div class="calendar" ui-calendar="uiConfig.calendar"  ng-model="eventSources"></div></div>';
            //$("#smartCalendarHolder").append($(html));

            $('#smartCalendarHolder').html($compile(html)($scope));
            
            
            
            var calendarScope = angular.element(document.getElementById("smartCalendar")).scope();
            
            $.each(calendardata.items, function(i, jsonItem) {

                if (jsonItem.status == 'cancelled') {
                    return true; // skip cancelled events.
                }
                if (!(jsonItem.startDate.length < 8 || jsonItem.endDate < 8)) {
                    var startDate = new Date(jsonItem.startDate);
                    var endDate = new Date(jsonItem.endDate);
                     $timeout(function() {
                    if (days_between(endDate, startDate) <= 14) {
                    /*console.log({
                            title: jsonItem.title,
                            start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                            end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                            //className: ['openSesame']
                          });
                        $scope.events.push({
                            title: jsonItem.title,
                            start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                            end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                            //className: ['openSesame']
                          });*/
                        
                        calendarScope.$apply(function () {
                            calendarScope.events.push({
                            title: jsonItem.title,
                            start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                            end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
                            //className: ['openSesame']
                          });
                        });
                        
                    }
                    }, 0, false);
                }
            });
            
            
            
		}, function error(err) {
			console.log(err);
		});
    };
    
});

baseAppControllers.controller('AngularCarouselCtrl', function($scope, $ocLazyLoad, $compile, $timeout) {
    $scope.loadngcarousel = function() {
        $ocLazyLoad.load({
			name: 'angular-carousel',
			files: [
				'../bower_components/angular-carousel/dist/angular-carousel.min.css',
				'../bower_components/angular-touch/angular-touch.min.js',
				// '../bower_components/angular-carousel/dist/angular-carousel.min.js'
				'../js/angular/angular-carousel.js'
			]
		}).then(function success(data) {
            var html = [], i=0;
            html[++i] = '<div id="angular-carousel-slideshow" style="height:600px"><ul style="height:600px" rn-carousel rn-carousel-controls rn-carousel-index="carouselIndex" rn-carousel-auto-slide rn-carousel-pause-on-hover rn-carousel-buffered class="image" >';
            html[++i] = '<li ng-repeat="image in images">';
            html[++i] = '<div class="slide-text active" style="display: block;">';
            html[++i] = '<div class="buttons"><a href="javascript:void(0);" class="btn-icon expander"><i class="fa fa-plus"></i>More</a></div>';
            html[++i] = '<div ng-if="image.title" class="slide-title">{{image.title}}</div>';
            html[++i] = '<span ng-if="image.slide_summary" class="slide-summary">{{image.slide_summary}} </span>';
            html[++i] = '<div class="fullDetailLinks" style="margin-left:0px">';
            html[++i] = '<a ng-if="image.venue != null && image.venue.longitude != null && image.venue.latitude != null" style="font-weight: bold;" href="javascript(void);" class="gmapDirectionLink" ng-click="loadGmapDirection(this, \'{{ image.settings.latitude }}\', \'{{ image.settings.longitude }}\')" data-location=\'{"lat":"{{ image.venue.latitude }}", "lang":"{{ image.venue.longitude }}"}\' >Directions</a>';
            html[++i] = '<a href="{{image.htmlLink }}" data-id="{{image.id}} " target="_blank">Page</a>';
            html[++i] = '<a ng-if="image.itemFeed.detailsUrl != null" href="" data-id="{{ image.id }}" class="detailsLink">Details</a> ';
            html[++i] = '<span>{{carouselIndex}} of {{images.length}}</span>'
            html[++i] = '</div>';
    
            html[++i] = '<div class="detailsInfo"></div>';
            html[++i] = '</div>';


            // html[++i] = '<div class="slide-class active" image-loader loading-indicator-image="../img/ajax-loader.gif"  style="background:url({{image.host}}{{image.images[0].large }});background-size:cover;">';
            // html[++i] = '<img image-loader loading-indicator-image="../img/ajax-loader.gif" class="slide-image lazyLarge grab-cursor" src="{{image.host}}{{image.images[0].large }}" alt="">';
            // html[++i] = '</div>';
            html[++i] = '<img image-loader loading-indicator-image="../img/ajax-loader.gif" ng-src="{{image.host}}{{image.images[0].large }}" style="background-size:cover;width: 100%;height: 100%;"/>';
            html[++i] = '</li></ul><div style="position:relative;top:-25px;" rn-carousel-indicators ng-if="images.length > 1" slides="images" rn-carousel-index="carouselIndex"></div></div>';
            $("#carousel-ctrl").append($compile(html.join(''))($scope));
            var angularCarouselScope = angular.element(document.querySelector('[ng-controller=AngularCarouselCtrl]')).scope();
            //console.log(carouselData);
            $timeout(function() {
            // $.each(carouselData, function(i, jsonitem) {
                angularCarouselScope.$apply(function() {
                    angularCarouselScope.images = carouselData;
                    $("#carousel-ctrl").removeClass("loader");
                    angularCarouselScope.carouselIndex = 1;
                    
                    /*
                    angularCarouselScope.mpaused = false;
                    angularCarouselScope.pauseSlide = function() {
                        console.log("pause");
                        angularCarouselScope.mpaused = true;
                        $(".pause").hide();
                        $(".resume").show();
                        console.log(angularCarouselScope.mpaused);
                    };
                    angularCarouselScope.playSlide = function() {
                        console.log("play");
                        angularCarouselScope.mpaused = false;
                        $(".pause").hide();
                        $(".resume").show();
                        console.log(angularCarouselScope.mpaused);
                    }
                    */
                });
            // });
            }, 0, false);
            
            
        }, function error(err) {
            
        });
        
    };
}).directive('imageLoader', [function() {
  return {
    restrict: 'A',
    scope: {
      loadingIndicatorImage: '@',
      errorImage: '@',
      backgroundImage: '@'
    },
    link: function(scope, element, attrs) {
      console.log("Inside Image Directive");
      element.css("background", "url(" + scope.loadingIndicatorImage + ") center no-repeat");
      element.bind("load", function() {
         console.log("Loaded Image");
         element.css("background-image", "");
      });

      element.bind("error", function() {
        console.log("On Error");
        element.attr("src", scope.errorImage);
      });
    }
  };
}]);




baseAppControllers.controller('InfoDialog', function ($scope, $ionicModal) {

    $scope.contentContainer = null;
    $scope.contentSourceContainer = null;

    $ionicModal.fromTemplateUrl('infoDialogScript', {
        scope: $scope,
        animation: 'slide-in-up'
    })
    .then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        //console.log('close modal');
        $scope.modal.hide();
    };

    $scope.isModalShown = function () {
        return $scope.modal.isShown();
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        // console.log('destroy modal');
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {

    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
        // console.log('model removed event');
    });

    $scope.showHideDialogControls = function () {
        
    };

});






baseAppControllers.controller('SettingsDialog', function ($scope, $ionicModal) {

    $scope.contentContainer = null;
    $scope.contentSourceContainer = null;

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    })
    .then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
        // move the dialog content into the dialog.
        if ($scope.contentContainer != null) {
            $scope.contentContainer.appendTo('#settingsDialogForm');
            var accordionScope = $('#accordionCtrl').scope();

            if (accordionScope != null) {
                // display the view, position, and map tabs
                $.each(accordionScope.rows, function (i, item) {
                    if (item.id == 'view' || item.id == 'position' || item.id == 'map') {
                        item.style = {};
                    }
                });

                /*
                accordionScope.enableTabToggle = true;
                accordionScope.closeAllTabs();
                accordionScope.openTab('categoryOptions'); // open the categories tab
                */
            }

            $scope.showHideDialogControls();
        }
    };

    $scope.closeModal = function () {
        //console.log('close modal');
        $scope.modal.hide();
    };

    $scope.isModalShown = function () {
        return $scope.modal.isShown();
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        // console.log('destroy modal');
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
        // console.log('model hidden event');

        // move the dialog content back to the source container
        if ($scope.contentContainer != null && $scope.contentSourceContainer != null) {
            $scope.contentContainer.appendTo($scope.contentSourceContainer);

            var accordionScope = $('#accordionCtrl').scope();
            if (accordionScope != null) {
                $.each(accordionScope.rows, function (i, item) {
                    // hide the view, position, and map tabs
                    if (item.id == 'view' || item.id == 'position' || item.id == 'map') {
                        item.style = { display: 'none' };
                    }
                });

                // close all the tabs
                // perform any tab-closing logic
                accordionScope.closeAllTabs();

                //accordionScope.enableTabToggle = false;
                //accordionScope.openTab('locationOptions'); // open the locations tab
                accordionScope.openTab('categoryOptions'); // open the categories tab

                $scope.showHideDialogControls();
            }
        }
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
        // console.log('model removed event');
    });

    $scope.showHideDialogControls = function () {
        var inDialog = $scope.isModalShown();

        var $fbSettings = $('#fbSettings');
        var $fbSlider = $fbSettings.find('.slider-frame');

        var $allForGoodSettings = $('#allforgoodSettings');
        var $allForGoodSlider = $allForGoodSettings.find('.slider-frame');

        var $homeHistorySettings = $('#homeHistorySettings');
        var $homeHistorySlider = $homeHistorySettings.find('.slider-frame');

        var $stateParkSettings = $('#stateParkSettings');
        var $stateParkSlider = $stateParkSettings.find('.slider-frame');

        var placesEnabled = $.cookie('sliderValues').place == 'on';
        var allForGoodEnabled = $.cookie('sliderValues').allforgood == 'on';
        var homeHistoryEnabled = $.cookie('sliderValues').homeHistory == 'on';
        var stateParkEnabled = $.cookie('sliderValues').statePark == 'on';

        if (inDialog) {
            // dialog displayed, always show sliders and settings
            $fbSlider.show();
            $fbSettings.show();

            $allForGoodSlider.show();
            $allForGoodSettings.show();

            $homeHistorySlider.show();
            $homeHistorySettings.show();

            $stateParkSlider.show();
            $stateParkSettings.show();
        }
        else {
            // dialog hidden, always hide sliders. Show settings if enabled.
            $fbSlider.hide();
            if (placesEnabled) {
                $fbSettings.show();
            }
            else {
                $fbSettings.hide();
            }

            $allForGoodSlider.hide();
            if (allForGoodEnabled) {
                $allForGoodSettings.show();
            }
            else {
                $allForGoodSettings.hide();
            }

            $homeHistorySlider.hide();
            if (homeHistoryEnabled) {
                $homeHistorySettings.show();
            }
            else {
                $homeHistorySettings.hide();
            }

            $stateParkSlider.hide();
            if (stateParkEnabled) {
                $stateParkSettings.show();
            }
            else {
                $stateParkSettings.hide();
            }
        }
    };

});
