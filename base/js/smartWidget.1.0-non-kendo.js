// SmartWidget - send modifications to loren@dreamstudio.com
// Any script below beginning with three comment slashes, i.e. ///, 
// is commented-out script from the prior data.js file. 
// This code can be removed later (when the plugin updates have been completed) 
// or uncommented (and perhaps updated) if the script is still needed.
var flgFeedLoaded = false, reInitFeed = true, activeLocationMarker = {type:null, marker:null}, globalGmapMapZoomLevel = 8, globalBingMapZoomLevel = 5, GmapPositionMarker = null, BingMapPositionPushpin = null, bingMapPointX = 300, googleMapPanbyX = 250, defaultLocation = {latitude:33.7490, longitude:-84.3892}, flgGmapDragged=false, flgBingDragged=false, changeMarkerColor=true, consoleTime = null;
//var mrkrs = [];
function timeStamp() {
    var mydate = new Date();
    if (consoleTime == null) {
        consoleTime = mydate;
    }
    
    var m = mydate.getMinutes() - consoleTime.getMinutes(),
        s = mydate.getSeconds() - consoleTime.getSeconds();
        //ms = mydate.getMilliseconds() - consoleTime.getMilliseconds();
        
    return (Math.abs(m) > 0 ? Math.abs(m) + ':' : '') + Math.abs(s) + ':' + Math.abs(mydate.getMilliseconds()) + ' - ';
    //return (mydate.getMinutes() + ':' + mydate.getSeconds() + ':' + mydate.getMilliseconds() + ' - ');
    
}
function setGmapPositionMarker(lat, lon)
{
    if ($.trim(lat) == '' && $.trim(lon) == '') {
        getLatLonFromBrowser();
    }
    lat = $("#lat").val();
    lon = $("#lon").val();
    if ($.trim(lat) == '' && $.trim(lon) == '') {
       lat = defaultLocation.latitude;
       lon = defaultLocation.longitude;
       $("#lat").val(lat);
       $("#lon").val(lon);
    }
    if (GmapPositionMarker !== null) {
        GmapPositionMarker.setMap(null);
    }
    console.log("adding location marker on google map.");
    var loc = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
    markerOptions = {
        position: loc,
        icon: '../img/icons/position.png',
        title: 'Current Location'
    }
    GmapPositionMarker = new google.maps.Marker(markerOptions);
    GmapPositionMarker.setMap(googlemap);
    googlemap.setCenter(new google.maps.LatLng(parseFloat(lat),parseFloat(lon)));
    globalGmapMapZoomLevel = 13;
    googlemap.setZoom(globalGmapMapZoomLevel);
    if ($(window).width() > 800) {
        //check if right column is visible or not
        if ($("#closeSmartSearch").is(":visible") || (!$(".mapLink").hasClass("active"))) {
        
            googlemap.panBy(googleMapPanbyX,0);
        } else {
            //console.log(-googleMapPanbyX-100);
            //googlemap.panBy(-googleMapPanbyX-100,0);
        }
    }
    console.log("marker added to lat:" + $("#lat").val() + ", lon:" + $("#lon").val());
    //flgBingDragged = true;
}

function setBingMapPositionMarker(lat, lon, reposition)
{
    
    if ($.trim(lat) == '' && $.trim(lon) == '') {
        //setTimeout(getLatLonFromBrowser(), 1000);
    }
    lat = $("#lat").val();
    lon = $("#lon").val();
    if ($.trim(lat) == '' && $.trim(lon) == '') {
       lat = defaultLocation.latitude;
       lon = defaultLocation.longitude;
       $("#lat").val(lat);
       $("#lon").val(lon);
    }
    console.log("adding location marker on bing map.");
    if (BingMapPositionPushpin !== null) {
        bingmap.entities.remove(BingMapPositionPushpin);
    }
    var loc = new Microsoft.Maps.Location(parseFloat(lat), parseFloat(lon));
    var pinOptions = {
        "title": "Current Location",
        height: 48,
        width:48,
        icon: '../img/icons/position.png'
    };
    console.log(loc);
    BingMapPositionPushpin = new Microsoft.Maps.Pushpin(loc, pinOptions);
    bingmap.entities.push(BingMapPositionPushpin);
    if (reposition) {
        var gpslocation = BingMapPositionPushpin.getLocation();
        //var point2 = bingmap.tryLocationToPixel(gpslocation);
        //point2.x = point2.x + bingMapPointX;
        //gpslocation = bingmap.tryPixelToLocation(point2);
        //bingmap.setView({center:gpslocation});
        globalBingMapZoomLevel = 10;
        bingmap.setView({ center:gpslocation, zoom: globalBingMapZoomLevel});
        /*
        setTimeout(function() {
            var bingcenter = bingmap.getCenter(),
                centerPixel = bingmap.tryLocationToPixel(bingcenter);
            centerPixel.x = centerPixel.x + 300;
            var centerLocation = bingmap.tryPixelToLocation(centerPixel);
            bingmap.setView({ center:centerLocation});
        }, 50);*/
    }
    console.log("bing location marker added to lat:" + $("#lat").val() + ", lon:" + $("#lon").val());
}

(function($) {

    // default configuration
    var defaultOptions = {
        // typeIDs: null,
        listContainer: '#smartList',
        slideshowContainer: '#smartSlideshow',
        galleryContainer: '#smartGallery',
        mapContainer: '#smartMap',
        directionsMapContainer: '#smartDirectionsMap',
        directionsDisplayContainer: '#smartDirectionsDisplay',
        createContainers: false,
        showNavigationMenu: true,
        showListSummary: false,
        showListThumbnail: true, // If true, show when row is expanded or collapsed. If false, show only when row is expanded
        showMenuIcon: true,
        showVerticalMenu: false,
        bingMapPointX:300,
        googleMapPanbyX:250,
        useGoogleMap: true,
        showGmapCluster: false,
        showPositionIconOnMapLoad: false,
        maxGalleryImageDisplay: 6,
        updateBrowserHash: false, // Update the browser hash to reflect current selections.

        // Events
        addingListItem: function() {
        },
        addingSlideshowItem: function() {
        },
        addingGalleryItem: function() {
        },
        addedListItem: function() {
        },
        addingListItemDetail: function() {
        },
        addedListItemDetail: function() {
        },
        addedSlideshowItem: function() {
        },
        addedGalleryItem: function() {
        },
        displayingItemDetails: function() {
        },
        displayedItemDetails: function() {
        },
        displayingAllResults: function() {
        },
        displayedAllResults: function() {
        },
        displayingDirections: function() {
        },
        displayedDirections: function() {
        },
        listItemChecked: function() {
        },
        beginLoadingFeeds: function() {
        },
        loadedFeed: function() {
        },
        endLoadingFeeds: function() {
        },
        feedDefaults: {
            url: '', // Example: '/smart/api/itemfeed?tid=16000'
            type: '', // Possible values: 'locations', 'events', 'organizations', 'places'
            headerText: '',
            provider: '',
            className: '',
            detailsUrl: '', // '/info/{0}?mode=a'
            detailsSelector: null,
            maxSummaryHeadlineLength: 50,
            maxGallerySummaryLength: 350,
            showCheckBoxes: false
        },
        // feeds: Array of feed objects
        feeds: null,
        // Loren should have more info on the values for these and if they are still needed
        galleryFormat: null,
        thumbnails: null,
        textBesideImage: null,
        largeImage: null,
        state: null, // i.e. 'GA', 'FL', 'NC'
        slide: null, // The Item ID of the slide to display.
        latitude: 33.7490,
        longitude: -84.3892,
        sd: null, // startdate
        ed: null, // enddate
        distance: null,
        zip: null,
        startSlideshow: true,
        slideshowMaxHeight: 350,
        showSlideNumbers: false, // TODO: Needs to be tested or removed if slide numbers are not needed.

        googleMapKey: null,
        bingMapKey: 'Ahupd0DTeWNY6YhKp7y25p1ZT8vTi8DK0LIqt - ScMinEu0x9YhUf5SyFUasJ5cpT'
            
    }; // end defaultOptions

   var settings = $.extend({}, defaultOptions);

   var $listContainer = getWrappedSet(settings.listContainer);
   var $slideshowContainer = getWrappedSet(settings.slideshowContainer);
   var $galleryContainer = getWrappedSet(settings.galleryContainer);
   var $mapContainer = getWrappedSet(settings.mapContainer);
   var $directionsMapContainer = getWrappedSet(settings.directionsMapContainer);
   var $directionsDisplayContainer = getWrappedSet(settings.directionsDisplayContainer);
   
   bingMapPointX = settings.bingMapPointX;
   googleMapPanbyX = settings.googleMapPanbyX;
   defaultLocation.latitude = settings.latitude;
   defaultLocation.longitude = settings.longitude;
   
   var methods = {

     init: function(options) {

       settings = $.extend({}, defaultOptions, options);
        
       var scriptDomain = getScriptDomain();
       function getScriptDomain() {
           var theDomain = ''
           var scriptUrl = $('script[src*="smartWidget"]').attr('src');
           if(scriptUrl.toLowerCase().substr(0, 4) == 'http') {
               var a = $('<a>', { href:scriptUrl } )[0];
               theDomain = a.protocol + '//' + a.hostname;
           }
           return theDomain;
       }

        var initialHashObj = getHashValues(window.location.hash);
        var bingMapEnabled = typeof(Microsoft) != 'undefined' && typeof(Microsoft.Maps) != 'undefined';

        // main function
        function loadList($widgetContainer) {

            $('#noResultsFound', $widgetContainer).remove();

            $('.adminMessage', $widgetContainer).prepend('<div style="font-weight:bold"><a href="http://stackoverflow.com/questions/4743730/what-is-console-log-and-how-do-i-use-it" target="_blank">Console.log</a></div>');
            //$('.staticBingMapsHolder', $smartMap)
            //writeConsole('');

            //writeConsole('loadList');

            var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
            var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
            var previousDateString;
            var mapPinLabelCount = 0;
            var defaultMaxSummaryHeadlineLength = 50;

            // Slideshow variables
            var currentSlideIndex = 0; // 0-based index
            var currentSlide = 1;      // 1-based index
            var slideCount = 0;
            var recentSlideshowMaxHeight = 0;

            // Gallery variables
            var galleryCount = 0;

            // For GET MAPS

            var mrkrs = [];
            var markerCluster = null;
            var previous_highlighted_marker = null
            var reloadMap = false;
            var googleMapScriptLoaded = false;
            var googleMapLoaded = false;
            var bingMapScriptLoaded = false;
            var bingMapLoaded = false;
            var useGoogleMap = settings.useGoogleMap;
            var showGmapCluster = settings.useGoogleMap;
            var googleDirectionsServiceLoaded = false;
            var gettingMapLayout = false;
            //var infowindow = null;
            var bounds = null;

            var istouch = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null; //boolean check for popular mobile browsers
            var geom = {};
            //var hashListener = null;
            //var hashValue = ''; //getHashQuery();
            var hashValue = getHashQuery();
            var map = null;
            var $infoBox = null; // Used for Bing Maps
            var jsonLink = '';
            /// var bingKey = 'Ahupd0DTeWNY6YhKp7y25p1ZT8vTi8DK0LIqt - ScMinEu0x9YhUf5SyFUasJ5cpT';
            var staticLink = '';
            var host = '';
            var jFile = ''; // Holds initial locations json path.

            var thumbnail = '';
            var mediumImage = '';
            var largeImage = '';

            var itemArray = new Array();
            var imageArray = new Array();
            var startIndex = 0;

            var i = 0;      // use to build html strings
            var html = [];  // use to build html strings
            
            //HTML that generates the frame for the custom infobox
            var pushpinFrameHTML = '<div class="infobox"><a class="infobox_close"><img src="../img/bing/close.png"/></a><div class="infobox_content">{content}</div></div><div class="infobox_pointer"><img src="../img/bing/pointer_shadow.png"></div>';

            var ignoreHashChange = false;
            var previousHashObj = {};
            if (settings.updateBrowserHash == true) {
                if (typeof ($.fn.hashchange) == "undefined") {
                    // Get the script and bind the handler
                    var hashchangeUrl = scriptDomain + '/jquery/hash/jquery.ba-hashchange.js';
                    $.getScript(hashchangeUrl, function() {
                        $(window).on('hashchange.smartWidget', hashChange);
                    });
                }
                else {
                    // Already loaded, just bind up the handler
                    $(window).on('hashchange.smartWidget', hashChange);
                }
            }

            if (settings.createContainers == true) {
                // Create any containers that don't already exist
                if ($slideshowContainer == null) {
                    $slideshowContainer = $('<div class="smartSlideshow"></div>');
                    $widgetContainer.append($slideshowContainer);
                }
                if ($galleryContainer == null) {
                    $galleryContainer = $('<div class="smartGallery"></div>');
                    $widgetContainer.append($galleryContainer);
                }
                if ($mapContainer == null) {
                    $mapContainer = $('<div class="smartMap"></div>');
                    $widgetContainer.append($mapContainer);
                }
                if ($directionsMapContainer == null) {
                    $directionsMapContainer = $('<div class="smartDirectionsMap"></div>');
                    $widgetContainer.append($directionsMapContainer);
                }
                if ($directionsDisplayContainer == null) {
                    $directionsDisplayContainer = $('<div class="smartDirectionsDisplay"></div>');
                    $widgetContainer.append($directionsDisplayContainer);
                }
                if ($listContainer == null) {
                    $listContainer = $('<div class="smartList"></div>');
                    $widgetContainer.append($listContainer);
                }
            }

            if($slideshowContainer != null) {
               $slideshowContainer.empty();
            }
            if($galleryContainer != null) {
               $galleryContainer.empty();
            }
            if($mapContainer != null) {
               $mapContainer.empty();
               if(typeof(googlemap) != 'undefined' || typeof(bingmap) != 'undefined') {
                  reloadMap = true;
                  googleMapLoaded = false;
                  bingMapLoaded = false;
               }
               $smartMap = $mapContainer; // used by downloadloadmaps() function
            }
            if($listContainer != null) {
               $listContainer.empty();
            }

            // unbind any previously bound events for the widget and children. Do this after emptying the 
            // containers (the code above) to minimize the number of elements that have to be iterated through.
            $widgetContainer.off('.smartWidget').find('*').off('.smartWidget');
            $(window).off('.smartWidget');

            if ($slideshowContainer != null && !$slideshowContainer.hasClass('smartSlideshow')) {
                $slideshowContainer.addClass('smartSlideshow widgets');
            }
            if ($galleryContainer != null && !$galleryContainer.hasClass('smartGallery')) {
                $galleryContainer.addClass('smartGallery widgets');
            }
            if ($mapContainer != null && !$mapContainer.hasClass('mapContainer')) {
                $mapContainer.addClass('smartMap widgets');
            }
            if ($listContainer != null && !$listContainer.hasClass('smartList')) {
                $listContainer.addClass('smartList widgets');
            }

            var $slide_numbers = null;
            var $thumb_holder = null;

            if ($slideshowContainer != null) {
                createSlideshowControls($slideshowContainer);

                // TODO - retain slide number option
                // Create cached wrapped sets for adding images and other slide numbers.
                $slide_numbers = $slideshowContainer.find('#slide-numbers');
                $thumb_holder = $slideshowContainer.find('#thumb_holder');
            }
            if ($galleryContainer != null) {
                createGalleryControls($galleryContainer);
            }

            // Bind events for handlers added via the options object.
            // ListContainer Events
            $widgetContainer.on('addingListItem.smartWidget', function(event, data) {
                settings.addingListItem.call(this, event, data);
            });
            $widgetContainer.on('addedListItem.smartWidget', function(event, data) {
                settings.addedListItem.call(this, event, data);
            });
            $widgetContainer.on('addingListItemDetail.smartWidget', function(event, data) {
                settings.addingListItemDetail.call(this, event, data);
            });
            $widgetContainer.on('addedListItemDetail.smartWidget', function(event, data) {
                settings.addedListItemDetail.call(this, event, data);
            });
            // SlideshowContainer Events
            $widgetContainer.on('addingSlideshowItem.smartWidget', function(event, data) {
                settings.addingSlideshowItem.call(this, event, data);
            });
            $widgetContainer.on('addedSlideshowItem.smartWidget', function(event, data) {
                settings.addedSlideshowItem.call(this, event, data);
            });
            // GalleryContainer Events
            $widgetContainer.on('addingGalleryItem.smartWidget', function(event, data) {
                settings.addingGalleryItem.call(this, event, data);
            });
            $widgetContainer.on('addedGalleryItem.smartWidget', function(event, data) {
                settings.addedGalleryItem.call(this, event, data);
            });
            $widgetContainer.on('displayingItemDetails.smartWidget', function(event, data) {
                settings.displayingItemDetails.call(this, event, data);
            });
            $widgetContainer.on('displayedItemDetails.smartWidget', function(event, data) {
                settings.displayedItemDetails.call(this, event, data);
            });
            $widgetContainer.on('displayingAllResults.smartWidget', function(event, data) {
                settings.displayingAllResults.call(this, event, data);
            });
            $widgetContainer.on('displayedAllResults.smartWidget', function(event, data) {
                settings.displayedAllResults.call(this, event, data);
            });
            $widgetContainer.on('displayingDirections.smartWidget', function(event, data) {
                settings.displayingDirections.call(this, event, data);
            });
            $widgetContainer.on('displayedDirections.smartWidget', function(event, data) {
                settings.displayedDirections.call(this, event, data);
            });
            $widgetContainer.on('listItemChecked.smartWidget', function(event, data) {
                settings.listItemChecked.call(this, event, data);
            });
            $widgetContainer.on('beginLoadingFeeds.smartWidget', function(event, data) {
                settings.beginLoadingFeeds.call(this, event, data);
            });
            $widgetContainer.on('loadedFeed.smartWidget', function(event, data) {
                settings.loadedFeed.call(this, event, data);
            });
            $widgetContainer.on('endLoadingFeeds.smartWidget', function(event, data) {
                settings.endLoadingFeeds.call(this, event, data);
            });

            removeNavigationMenu($widgetContainer);
            if (settings.showNavigationMenu == true) {
               createNavigationMenu($widgetContainer, $listContainer, $slideshowContainer, $galleryContainer, $mapContainer);
            }

    		addhover(settings);
            $('.widgets').show();

            mapPinLabelCount = 0;
            var feedStatuses = [],
                noOfFeedsType = settings.feeds.length;
            //writeConsole(settings.feeds.length);

            // beginLoadingFeeds Event
            var feedEvent = jQuery.Event('beginLoadingFeeds');
            var feedEventData = {};
            $widgetContainer.trigger(feedEvent, feedEventData);

            $.each(settings.feeds, function(feedIndex, feed) {
                // Update the local feed variable and the settings feed object with the feed defaults.
                feed = $.extend({}, settings.feedDefaults, feed);
                settings.feeds[feedIndex] = feed;
                /*
                 if(feedIndex == 0) {
                 if ($listContainer != null) {
                 $listContainer.empty();
                 }
                 if ($galleryContainer != null) {
                 $galleryContainer.empty();
                 }
                 }
                 */
                 
                
                jsonLink = feed.url;

                if (typeof (feed.maxSummaryHeadlineLength) == "undefined") {
                    feed.maxSummaryHeadlineLength = defaultMaxSummaryHeadlineLength;
                }
                
                var ajaxFunction = $.ajax; // Use jQuery ajax by default.
                if(typeof($.jsonp) == 'function' && jsonLink.indexOf('callback=?') > 0) {
                   ajaxFunction = $.jsonp; // Use the jsonp plugin since jQuery can't detect errors when using jsonp
                }
                ajaxFunction({ url: jsonLink, dataType: "json", success: function(feedData, textStatus, jqXHR) {
                    writeConsole('Processing feed ' + (feedIndex+1) + ': <a href="' + jsonLink + '">View feed</a>');

                    feedStatuses[feedStatuses.length] = true;
                    
                    // loadedFeed Event
                    feedEvent = jQuery.Event('loadedFeed');
                    feedEventData = {feed: feed, feedIndex: feedIndex};
                    $widgetContainer.trigger(feedEvent, feedEventData);

                    var jsonData = null;
                    if (typeof (feed.provider) == 'string' && feed.provider.toLowerCase() == 'google') {
                        jsonData = convertGoogleFeed(feedData);
                    }
                    else if (typeof (feed.provider) == 'string' && feed.provider.toLowerCase() == 'facebook') {
                        jsonData = convertFbFeed(feedData);
                    }
                    else if (typeof (feed.provider) == 'string' && feed.provider.toLowerCase() == 'facebook photos') {
                        jsonData = convertFbPhotosFeed(feedData);
                    }
                    else if (typeof (feed.provider) == 'string' && feed.provider.toLowerCase() == 'facebook events') {
                        jsonData = convertFbEventsFeed(feedData);
                    }
                    else {
                        jsonData = feedData;
                    }

                    startIndex = itemArray.length;
                    $.each(jsonData.items, function(i, item) {
                        //console.log(item);
                        //Ks
                        var startDate = new Date(item.start);
                        var hours = startDate.getHours();
                        var minutes = startDate.getMinutes();
                        var seconds = startDate.getSeconds();
                        var endDate = new Date(item.end);
                        item.displayTime = null;
                        item.feedIndex = feedIndex; // add the feed index to the item property so other functions have access to the feed properties.
                        if (feed.type == 'events'  || feed.type == 'facebookevents') {
                            item.displayTime = new Date(startDate).getTime();
                            item.totalDays = daysBetween(startDate, endDate);
                            if (item.totalDays != 0) {
                                item.totalDays += 1;
                                item.currentDay = 1;
                            }
                        }
                        itemArray.push(item);
                        
                        /* 
                        TODO: Need to add support for patterns or just display the event info once the same way it is
                        returned from the feed. 
                        Comment out the code below since some events only occur once a week for months. The code 
                        below adds an item to the array for every day between the start and end date regardless of the 
                        pattern. This then causes the browser to lockup due to too many items in the array.
                        */
                        /*
                        var currentDay = 1;
                        if ((feed.type == 'events' || feed.type == 'facebookevents') && startDate < endDate) {
                            while (daysBetween(startDate, endDate) != 0) {
                                var copyData = clone(item);
                                copyData.currentDay = ++currentDay;
                                startDate.setDate(startDate.getDate() + 1);
                                startDate.setHours(hours);
                                startDate.setMinutes(minutes);
                                startDate.setSeconds(seconds);
                                copyData.displayTime = new Date(startDate).getTime();
                                itemArray.push(copyData);
                            }
                        }
                        */
                    });
                    
                    if($mapContainer != null) {
                        if(!googleMapLoaded || !bingMapLoaded) {
                            writeConsole("Calling loadMaps");
                            loadMaps();
                        }
                    }

                    staticLink = '';
                    var curHeaderHeading = '', prevHeaderHeading = '';
                    for(var index = startIndex; index < itemArray.length; index++) {
                        var item = itemArray[index];
                        item.index = index; // store the index
                        var startDate = new Date(item.start);
                        var startDateString = days[startDate.getDay()] + ", " + months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + fourdigits(startDate.getYear());
                        var endDate = new Date(item.end);
                        var endDateString = days[endDate.getDay()] + ", " + months[endDate.getMonth()] + ' ' + endDate.getDate() + ', ' + fourdigits(endDate.getYear());
                        displayDate = new Date(item.displayTime);
                        var displayDateString = '';
                        if (!isNaN(displayDate.getTime())) {
                            displayDateString = days[displayDate.getDay()] + ", " + months[displayDate.getMonth()] + ' ' + displayDate.getDate() + ', ' + fourdigits(displayDate.getYear());
                        }

                        var rowTitle = '';
                        var rowImage = '';
                        var rowAttachments = '';
                        var expandInfo = ''; // Information to be displayed when the row is expanded.

                        var iconStr = '';
                        var repeatDaysString = '';
                        var venueAddress = '';
                        var encodedKmz = '';
                        var child = {};
                        var subHeaderText = '';
                        //writeConsole(feed);

                        if(feed.headerText != '') {
                           subHeaderText = feed.headerText;
                        }
                        
                        //writeConsole(feed);
                        //writeConsole('previousDateString : ');
                        //writeConsole(displayDateString);
                        //writeConsole(previousDateString);
                        
                        //if (displayDateString != previousDateString) {
                            if(subHeaderText == '') {
                                //writeConsole(feed.type);
                                /// if (btid == 1) {
                                if (feed.type == 'locations') {
                                    subHeaderText = "Available Buildings";
                                    
                                }
                                /// if (btid == 2) {
                                else if (feed.type == 'events' || feed.type == 'facebookevents') {
                                    subHeaderText = displayDateString;
                                }
                                /// if (btid == 3) {
                                else if (feed.type == 'organizations') {
                                    subHeaderText = "Organizations";
                                }
                                else if (feed.type == 'places') {
                                    subHeaderText = "Places";
                                }
                                else {
                                    subHeaderText = 'Items'; 
                                }
                            }
                            //writeConsole(subHeaderText);
							curHeaderHeading = subHeaderText;

                            var expandClass = 'entypo-right-dir'; // row is collapsed
                            if(settings.showListThumbnail) {
                                expandClass = 'entypo-down-dir'; // row is expanded
                            }
                            var expandRows = '<div data-feedtype="feedtype_'+feed.type+'" class="expandCollapseIcon ' + expandClass + '" style="float:right;font-size:14pt"></div>';
							
                            //var curHeaderHeading = '', prevHeaderHeading = '';
							var subHeader = '';
							
							if(curHeaderHeading != prevHeaderHeading) {
								subHeader = '<div class="showAllResults button">Show All Results</div><div class="listHeader"><div data-feedtype="feedtype_'+feed.type+'" class="closeList closeIcon entypo-cancel-squared"></div>' + expandRows + subHeaderText + '</div>';
                                subHeader += '';
							} else if (feed.type == 'events' || feed.type == 'facebookevents') { // Prevents subHeaderText from repeating when not a date.
								subHeader = '<div class="listHeader" style="margin-top:8px"><div data-feedtype="feedtype_'+feed.type+'" class="closeList closeIcon entypo-cancel-squared"></div>' + expandRows + subHeaderText + '</div>';
							}

							prevHeaderHeading = curHeaderHeading;
							
							/*
                            var subHeader = '';
                            if (index == 0) {
                                subHeader = '<div class="listHeader"><div class="closeList closeIcon entypo-cancel-squared"></div>' + subHeaderText + '</div>';
                            }
                            else if (feed.type == 'events') { // Prevents subHeaderText from repeating when not a date.
                                subHeader = '<div class="listHeader" style="margin-top:8px"><div class="closeList closeIcon entypo-cancel-squared"></div>' + expandRows + subHeaderText + '</div>';
                            }
                            */
                            if ($listContainer != null) {
                                $listContainer.append(subHeader);
                            }

                          //  previousDateString = displayDateString;
                        //}

                        // Build rowImage
                        i = 0;
                        html.length = 0;

                        thumbnail = '';
                        mediumImage = '';
                        largeImage = '';
                        //writeConsole(item.images);
                        if (item.images != null) {
                            //writeConsole(item.images);
                            $.each(item.images, function(imageIndex, image) {
                                //writeConsole(imageIndex +"=>"+image);
                                if (image.thumbnail != null && image.thumbnail != '') {
                                    thumbnail = host + image.thumbnail;
                                }
                                if (image.medium != null && image.medium != '') {
                                    mediumImage = host + image.medium;
                                }
                                if (image.large != null && image.large != '') {
                                    largeImage = host + image.large;
                                }

                                // Just get the first image for now
                                return false;
                            });
                        }

                        // Build content for expandInfo
                        i = 0;
                        html.length = 0;

                        if(item.contacts != null) {
                            html[i++] = '<div style="margin-bottom:4px">';
                            html[i++] = '<b>Contacts</b><br>';
                            $.each(item.contacts, function(index, contact) {
                                 //html[i++] = '<div style="border-top: 1px solid black;">';
                                 html[i++] = contact.displayName + '<br />';
                                 if(contact.phone != null && contact.phone != '') {
                                    html[i++] = contact.phone + ' ';
                                 }
                                 if(contact.jobTitle != null && contact.jobTitle != '') {
                                   html[i++] = contact.jobTitle;
                                   if(contact.companyName != null && contact.companyName != '') {
                                        html[i++] = ', ';
                                   }
                                 }
                                if(contact.companyName != null && contact.companyName != '') {
                                    html[i++] = contact.companyName;
                                }
                                //html[i++] = '</div>';
                            });
                            html[i++] = '</div>';
                        } // item.contacts
                        expandInfo = html.join('');

                        // Build rowAttachments
                        i = 0;
                        html.length = 0;
      
                        if (item.files != null) {
                            $.each(item.files, function(fileIndex, file) {
                                var fileIcon = '';
                                var fileIconTitle = '';
                                var fileTitle = '';
                                var postDate = new Date(file.postDate);

                                if (file.title != '') {
                                    fileTitle = file.title;
                                }
                                else {
                                   fileTitle = file.fileName;
                                }
                                if(file.url.toLowerCase().indexOf(".pdf") > 0) {
                                   fileIcon = '../img/icons/mini-pdf.png';
                                   fileIconTitle = 'PDF Attachment';
                                }
                                else {
                                    fileIcon = '../img/icons/mini-file.png';
                                    fileIconTitle = 'File Attachment';
                                }
                                html[i++] = '<img src="' + fileIcon + '" title="' + fileIconTitle + '" style="width:16px;height:16px" alt="' + fileIconTitle + '" />&nbsp;';
                                html[i++] = '<a href="' + file.url + '" target="_blank" class="attachment">' + fileTitle + '</a>';
                                html[i++] = '&nbsp; <span style="white-space:nowrap">(' + postDate.toLocaleDateString() + ')</span>';
                                html[i++] = '<div style="clear: both;"></div>';
                            });

                            rowAttachments = html.join('');
                        }

                        // Build rowTitle
                        i = 0;
                        html.length = 0;

                        if ($mapContainer != null && item.venue != null) {
                            if (item.venue.latitude != '' && parseFloat(item.venue.latitude) > 0 && item.venue.longitude != '' && parseFloat(item.venue.longitude) < 0) {
                                mapPinLabelCount++;
                                //iconStr += '<div id=' + index + '>' + mapPinLabelCount + '</div>';
                                if (mapPinLabelCount < 19) {
                                    // 38 airport, 39 bus, 40 car, 41 boat, 42 train, 43 hiker, 44 recycling, 45 mauve
                                    staticLink += 'pp=' + item.venue.latitude + ',' + item.venue.longitude + ';2;' + mapPinLabelCount + '&';
                                }
                            }
                        }

                        if (thumbnail != '') {
                            rowImage = '<img src="' + thumbnail + '" alt="" />';
                        }

                        if (feed.type == 'events' && startDateString != endDateString) {
                            repeatDaysString = ' <b> - Day ' + item.currentDay + ' of ' + item.totalDays + '</b>';
                        }

                        i = 0;
                        html.length = 0;

                        if (item.venue != null) {

                            if(item.venue.street != null && item.venue.street != '' && item.title.indexOf(item.venue.street) < 0) {
                                // Google Places used formatted_address for all fields - allows for differing international syntax
                                html[i++] = '<span style="white-space:nowrap">' + item.venue.street + '</span>';
                            }
                            if(item.venue.city != null && item.venue.city != '' && item.venue.state != null && item.venue.state != '') {
                                if(html.length > 0) {
                                   html[i++] = ', ';
                                }
                                html[i++] = item.venue.city + ', ' + item.venue.state; 
                            }

                            if (item.venue.zip != null && item.venue.zip != '') {
                                html[i++] = ' ' + item.venue.zip.substr(0, 5);
                            }

                            if(item.venue.county != null && item.venue.county != '') {
                                if(html.length > 0) {
                                   html[i++] = ', ';
                                }
                                html[i++] = item.venue.county + ' County';
                            }

                            if(item.venue.country != null && item.venue.country != '') {
                                if(html.length > 0) {
                                   html[i++] = ', ';
                                }
                                html[i++] = item.venue.country;
                            }

                            venueAddress = html.join('');
                        }

                        i = 0;
                        html.length = 0;
                        
                        //if(jsonData.)
                        //console.log(jsonData);
                        var leftBorderColor = '',
                            feedType = feed.type,
                            rowMappointImg = null
                        if (feedType == 'locations') {
                            rowMappointImg = "../img/icons/mappoint.png";
                            var isManufacturer = false;
                            var isInternational = false;
                            var isBuilding = false;
                            var isShovelReady = false;
                            if (item.categories != null) {
                                $.each(item.categories, function (index, category) {
                                    switch (category.id) {
                                        case 16470:
                                            isShovelReady = true;
                                            break;
                                        case 16400:
                                            isBuilding = true;
                                            break;
                                        case 31030:
                                            isManufacturer = true;
                                            break;
                                        case 30080:
                                            isInternational = true;
                                            break;
                                    }
                                });
                            }

                            if (leftBorderColor == '') {
                                if (isManufacturer) {
                                    leftBorderColor = '#4b8df7'; // Mfg and Intl/Mfg
                                }
                                //Later we might globe icon when international
                                if (isInternational) {
                                    leftBorderColor = '#f1a350';
                                    if (isManufacturer) { // Darker orange
                                        leftBorderColor = '#d87a14'; // Mfg and Intl/Mfg
                                    }
                                }
                                
                                if(isShovelReady) { // Shovel Ready also contains the building typeid
                                   leftBorderColor = 'purple'; // Shovel Ready
                                }
                                else if(isBuilding) {
                                   leftBorderColor = '#7cbd41'; // Buildings
                                }
                            }
                        }
                        else if (feedType == 'places' || feedType == 'facebookphotos' || feedType == 'facebookevents') {
                            rowMappointImg = '../img/icons/blue-dot1.png';
                            leftBorderColor = 'blue'; // Facebook
                        }
                        
                        
                        
                        html[i++] = '<div class="rowTitleContainer">';

                        if (leftBorderColor != '') {
                            html[i++] = "<span style='background:"+leftBorderColor+";padding: 0 4px 0 4px;color:#fff;'>"+ (+index + 1) +"</span>";
                            //html[i++] = '<div class="countStr" style="float:left;">' + iconStr + '</div>';
                        }

                        //html[i++] = '<div class="countStr" style="float:left;">' + iconStr + '</div>';
                        
                        //html[i++] = '<div>';
                        //html[i++] = '   <a class="rowTitle" href="' + item.htmlLink + '">';
                        html[i++] = '      <span class="rowTitle">' + item.title + '</span>' + repeatDaysString;
                        //html[i++] = '   </a>';
                        //html[i++] = '</div>';

                        if (item.lineOfBusiness != null && item.lineOfBusiness != '') {
                            html[i++] = '<div>';
                            html[i++] = item.lineOfBusiness;
                            html[i++] = '</div>';
                        }

                        if(venueAddress.length > 0) {
                            html[i++] = '<div>';
                            html[i++] = venueAddress;
                            html[i++] = '</div>';
                        }

                        if (item.keyDetails != null && item.keyDetails != '') {
                            html[i++] = '<div>';
                            html[i++] = item.keyDetails;
                            html[i++] = '</div>';
                        }

                        if (item.summary != null && item.summary != '') {
                            html[i++] = '<div>';
                            html[i++] = '<span class="summaryHeadline">' + getSubstringWords(item.summary, feed.maxSummaryHeadlineLength) + '</span>';
                            html[i++] = '</div>';
                        }

                        html[i++] = '</div>'; // end rowTitleContainer

                        ///
                        /*
                         if (item.kmz != '') {
                         encodedKmz = $.URLEncode('http://' + location.host + '/' + item.kmz);
                         html[i++] = ' - <span style="white-space:nowrap"><a href="http://www.google.com/maps?q=' + encodedKmz + '" target="_parent">View trail map</a> (<a href="' + item.kmz + '">kmz</a>)</span>';
                         }
                         */
                        ///

                        rowTitle = html.join('');

                        // Build row
                        if ($listContainer != null) {
                            i = 0;
                            html.length = 0;

                            html[i++] = '<div class="eventRow feedtype_'+feed.type+'" data-id="' + item.id + '">';
                            
                            html[i++] = '<div class="rowCheckBoxContainer" style="' + (feed.showCheckBoxes ? '' : 'display: none;') + '">';
                            html[i++] = '<input type="checkbox" class="rowCheckBox" />';
                            html[i++]= '</div>';

                            //html[i++] = "<i class='fa fa-caret-down' style='font-size:22px;position:absolute;right:6px;bottom:0px;z-index:2'></i>";
                    
                            html[i++] = '   <div style="float:right; display:none">';
                            html[i++] = '      <a href="" class="summaryLink">';
                            if(settings.showListSummary) {
                                html[i++] = '      <img src="../img/icons/circle-down.png">';
                            }
                            else {
                                html[i++] = '      <img src="../img/icons/circle-next.png">';
                            }
                            html[i++] = '      </a>';
                            html[i++] = '    </div>'; // end summaryLink


                            html[i++] = '   <div class="eventRowInfo">';

                            if(item.venue != null && "latitude" in item.venue && item.venue.latitude != null && "longitude" in item.venue && item.venue.longitude != null) {
                                //onclick="loadGmapDirection(this, \''+settings.latitude+'\', \''+settings.longitude+'\');"
                                html[i++] = "<div style='float:right;margin-right:4px;padding: 0 4px 0 4px;' >";
                                if(!isNaN(item.distance)) {
                                    if(item.distance > 0) {
                                      html[i++] = item.distance.toString() + ' mile' + (item.distance > 1 ? 's' : '');
                                    }
                                    else {
                                      html[i++] = 'nearby';
                                    }
                                }
                                html[i++] = "<a class='gmapDirectionLinkIcon' onclick=\"loadGmapDirection(this, '"+settings.latitude+"', '"+settings.longitude+"');\" data-location='{\"lat\" : \""+item.venue.latitude+"\", \"lang\":\""+item.venue.longitude+"\"}'><img src='"+rowMappointImg+"' style='height:20px'/></a>";
                                //html[i++] = "<img src='"+rowMappointImg+"' style='height:20px'/>";
                                html[i++] = "</div>";
                            }
                            html[i++] = rowTitle;

                            html[i++] = '      <div class="summaryInfo">';
                            if (item.summary != null && item.summary != '') {
                                html[i++] = item.summary;
                            }
                            html[i++] = '      </div>'; // end summaryInfo
                            html[i++] = '  </div>'; // end eventRowInfo

                            html[i++] = '   <div class="thumbnailContainer">';
                            html[i++] = rowImage;
                            html[i++] = '   </div>';

                            html[i++] = '      <div class="expandInfo">';
                            html[i++] = expandInfo;
                            html[i++] = '      </div>'; // end expandInfo
                            
                            html[i++] = '      <div class="attachments">';
                            html[i++] = rowAttachments;
                            html[i++] = '      </div>'; // end attachments

                            html[i++] = '  <div class="detailsInfo"></div>';

                            html[i++] = '     <div class="fullDetailLinks">';
                            var maphtml = '';
                            if(item.venue != null && item.venue.longitude != null && item.venue.latitude != null) {
                                html[i++] = '<a style="font-weight: bold;" href="#" class="gmapDirectionLink" onclick="loadGmapDirection(this, \''+settings.latitude+'\', \''+settings.longitude+'\');" data-location=\'{\"lat\":\"'+item.venue.latitude+'\", \"lang\":\"'+item.venue.longitude+'\"}\' >Directions</a> | ';
                                
                                maphtml = '<a href="javascript:void(0);" class="rowMapLink" > | Map</a>';
                                
                            }

                            html[i++] = '<a href="' + item.htmlLink + '"  data-id="'+item.id+'"  target="_blank">Page</a>';

                            if(feed.detailsUrl != '' && feed.detailsUrl != null) {
                                html[i++] = ' | <a href="" data-id="'+item.id+'" class="detailsLink">Details</a>';
                            }
                            html[i++] = maphtml;
                            html[i++] = '     </div>'; // end fullDetailLinks
                            
                            // show profile pictures of friends attending the events
                            //fbevents.push(item);
                            
                            if (item.attending != null) {
                                
                                html[i++] = '<div id="attending"><b>Friends attending to this events</b><br/>';
                                $.each(item.attending.data, function (index, data) {
                                    html[i++] = '<a href="https://facebook.com/'+data.id+'" target="_blank"><img src="'+data.picture.data.url+'" height="32" width="32"></a>';
                                    //console.log(data.picture.data.url);
                                });
                                html[i++] = '</div>';
                            }

                            html[i++] = '</div>'; // end eventRow

                            var rowHtml = html.join('');

                            // addingListItem Event
                            var listItemEvent = jQuery.Event('addingListItem');
                            var listItemEventData = {index: index, item: item, feed: feed, html: rowHtml};
                            $widgetContainer.trigger(listItemEvent, listItemEventData);

                            if (!listItemEvent.isDefaultPrevented()) {
                                // Add the row
                                var $rowHtml = $(listItemEventData.html)
                                        .first()
                                        .data('item', listItemEventData.item)
                                        .data('feed', listItemEventData.feed)
                                        .data('itemIndex', index)
                                        .data('leftBorderColor', leftBorderColor)
                                        .data('expanded', settings.showListSummary ? true: false)
                                        .end();

                                $('.detailsInfo').hide();
                                if (settings.showListSummary == true) {
                                    $('.thumbnailContainer > img:first', $rowHtml).css('min-width', '120px');
                                    $('.summaryHeadline', $rowHtml).hide();
                                    $('.summaryInfo', $rowHtml).show();
                                    $('.expandInfo, .attachments, .fullDetailLinks', $rowHtml).show();
                                }
                                else { // One-line display
                                    // Set the thumbnail to a smaller width. The height will be adjusted accordingly
                                    $('.thumbnailContainer > img:first', $rowHtml).css('width', '64px');
                                    $('.summaryHeadline', $rowHtml).show();
                                    $('.summaryInfo', $rowHtml).hide();
                                    $('.expandInfo, .attachments, .fullDetailLinks', $rowHtml).hide();
                                    if(!settings.showListThumbnail) {
                                        $('.thumbnailContainer > img:first', $rowHtml).hide(); // displayed by default
                                    }
                                }

                                $listContainer.append($rowHtml);

                                // addedListItem Event
                                listItemEvent = jQuery.Event('addedListItem');
                                $widgetContainer.trigger(listItemEvent, listItemEventData);
                            }
                        }

                        if (item.images != null) {
                            var addedImageToArray = false;
                            var imageIndex = 0;

                            if ($slideshowContainer != null) {
                                var slideshowItemEvent = jQuery.Event('addingSlideshowItem');
                                var slideshowItemEventData = {index: index, item: item, feed: feed};
                                $widgetContainer.trigger(slideshowItemEvent, slideshowItemEventData);
                                if (!slideshowItemEvent.isDefaultPrevented()) {
                                    imageIndex = imageArray.push(index) - 1; // Add the item index to the image array. This is used by the slideshow and gallery
                                    addedImageToArray = true;
                                    slideCount++;

                                    // addedSlideshowItem Event
                                    slideshowItemEvent = jQuery.Event('addedSlideshowItem');
                                    $widgetContainer.trigger(slideshowItemEvent, slideshowItemEventData);
                                }
                            }
                            else { // The $slideshowContainer is null so add the image to the image array 
                                imageIndex = imageArray.push(index) - 1; // Add the item index to the image array. This is used by the slideshow and gallery
                                addedImageToArray = true;
                            }

                            if ($galleryContainer != null) {
                                i = 0;
                                html.length = 0;
                                var mediumImageHtml = '';

                                function addImageToContainer($imageHtml) {
                                    // This function creates a closure. If setTimeout is not
                                    // called within the closure, then only 1 image per feed is
                                    // added to the image container. The other alternative is to
                                    // append the image html and call unveil without using setTimeout.
                                    setTimeout(function() {
                                        $galleryContainer.append($imageHtml);
                                        $(".lazy").unveil();
                                    }, 200);
                                }

                                // If the image was not added to the array, don't add it to the gallery. Also, the image
                                // is added to the image array in the slideshow and the corresponding index is stored in 
                                // the gallery so that when the gallery image is clicked, the page scrolls up to the 
                                // slideshow.
                                if (mediumImage != '' && addedImageToArray && galleryCount < settings.maxGalleryImageDisplay) {
                                    html[i++] = '<div class="medium-container"><div class="vertical_divider">';
                                    // 
                                    html[i++] = '   <div class="medium-mask" style="background:url(' + mediumImage + ');background-size:cover;">';
                                    // Img tag is not used in page, but retained for SEO indexing of images.
                                    html[i++] = '      <img style="display:none" class="medium-class lazy" src="" data-src="' + mediumImage + '"  alt="..." />';
                                    html[i++] = '   </div>';
                                    html[i++] = '   <div class="medium-title">';
                                    html[i++] = item.title;
                                    html[i++] = '   </div>';
                                    html[i++] = '</div></div>';

                                    mediumImageHtml = html.join('');

                                    // addingGalleryItem Event
                                    var galleryItemEvent = jQuery.Event('addingGalleryItem');
                                    var galleryItemEventData = {index: index, item: item, feed: feed, html: mediumImageHtml};
                                    $widgetContainer.trigger(galleryItemEvent, galleryItemEventData);

                                    if (!galleryItemEvent.isDefaultPrevented()) {
                                        var $mediumImageHtml = $(galleryItemEventData.html)
                                                .first()
                                                .data('imageIndex', imageIndex)
                                                .end();

                                        addImageToContainer($mediumImageHtml);
                                        galleryCount++;

                                        // addedGalleryItem Event
                                        galleryItemEvent = jQuery.Event('addedGalleryItem');
                                        $widgetContainer.trigger(galleryItemEvent, galleryItemEventData);
                                     }
                                }
                            }
                        }
                    } // end for(var index = startIndex; index < itemArray.length; index++) loop
                    
                    if ($slideshowContainer != null) {
                        if(imageArray.length > 0) {
                            $slideshowContainer.show();
                            $('.toggleSlides, .toggleGallery', $widgetContainer).show(); 
                            if (settings.startSlideshow == true) {
                                initiateSlideshow($slideshowContainer);
                            }
                            if (slideCount > 1) {
                                $slideshowContainer
                                        .find(".resume").hide()
                                        .end()
                                        .find(".pauseResume").show();
                            }
                        }
                        else {
                            $slideshowContainer.hide();
                            $('.toggleSlides, .toggleGallery', $widgetContainer).hide(); 
                        }
                    }
                   } // end success handler
                 } // end ajax options object
                )
                .fail(function (jqXHR, textStatus, errorThrown) {
                   feedStatuses[feedStatuses.length] = false;
                })
                .always(function() {
                   if(feedStatuses.length == settings.feeds.length) {

                       // endLoadingFeeds Event
                       feedEvent = jQuery.Event('endLoadingFeeds');
                       feedEventData = {};
                       $widgetContainer.trigger(feedEvent, feedEventData);

                       flgFeedLoaded = true;
                       //writeConsole(flgFeedLoaded);
                      // All feeds have been completed.
                      var rowsFound = false;
                      for(var i in feedStatuses) {
                         if(feedStatuses[i] == true){
                            rowsFound = true;
                            break;
                         }
                      }
                      if(!rowsFound) {

                         //$widgetContainer.prepend('<span id="noResultsFound" style="color: red; font-size: 125%; display:block; padding:15px">No matching results found.</span>');
                         $('.smartMessage').prepend('<span id="noResultsFound" style="color: red; font-size: 125%; display:block; padding:15px">No matching results found.</span>');
                         
                         $('.basicSearch').show();
                        
                         if($slideshowContainer != null) {
                            if($slideshowContainer.data('feature_rotate') != null) {
                                $slideshowContainer.data('feature_rotate').should_stop = true;
                            }
                            $slideshowContainer.empty();
                            $slideshowContainer.hide();
                         }
                         /*
                         if($galleryContainer != null) {
                            if($galleryContainer.data('feature_rotate') != null) {
                                $galleryContainer.data('feature_rotate').should_stop = true;
                            }
                            $galleryContainer.empty();
                            $galleryContainer.hide();
                         }
                         */
                         if($mapContainer != null) {
                            $mapContainer.empty();
                            $mapContainer.hide();
                         }
                         if($listContainer != null) {
                            $listContainer.empty();
                            $listContainer.hide();
                         }
                         reInitFeed = true;
                         //writeConsole(reInitFeed);
                      }
                      else { // rows found
                          addMarkers();
                          LoadStaticMap(staticLink);
                          reInitFeed = false;
                          //writeConsole(reInitFeed);
                          if($slideshowContainer != null) {
                            if(imageArray.length > 1) {
                                $slideshowContainer.find('.prev, .next, .pauseResume').show();   
                            }
                            else {
                                $slideshowContainer.find('.prev, .next, .pauseResume').hide();   
                            }
                          }
                      }
                   }
                }); // end $.getJSON()
                
            }
            ); // end $.each(settings.feeds...
            
            // MAP CODE
            function loadMaps() {
                var venu = false;
                //var mapDivPos = 0;
                $infoBox = $('#infoBox');
                if($mapContainer != null) {
                    //mapDivPos = $mapContainer.offset().top;
                    for (var i = 0; i < itemArray.length; i++) {
                        if (itemArray[i].venue) {
                            venu = true;
                            break;
                        }
                    }
                }

                if (venu) {
                    if($smartMap.is(':empty')) {
                        if(!gettingMapLayout) {
                            gettingMapLayout = true;
                            var smartmaphtml = '<div style="clear:both"></div><div id="staticColumnHolder" style="position:relative;height:100%"><div id="staticColumn" class="bingMapsHolder mapsdiv" style="width:100%"><div id="mapDivHolder"><div id="mapHeader"></div><div id="mapDivLoading" style="display:none"><img src="../img/ajax-loader.gif" alt="Loading" style="margin:10px;margin-top:60px" /><br><br><div id="mapDivLoadingMessage">Hit refresh if map does not appear on initial load.</div></div><div id="smartMap_bing" class="rightBox" style="position:relative; min-height:530px;">Bing</div></div><div id="staticMap" style="display:none"></div><div id="thumb-holder" class="clearfix"></div></div><div id="smartMap_google" class="googleMapsHolder mapsdiv">Google</div><div id="smartMap_staticBingMap" class="staticBingMapsHolder mapsdiv" style="isplay: none;">Static Bing Map</div></div><div class="infobox_wrapper"><div class="infobox"><a class="infobox_close" href="javascript:closeInfobox()"><img src="../img/bing/close.png"/></a><div class="infobox_content"></div></div><div class="infobox_pointer"><img src="../img/bing/pointer_shadow.png"></div></div><div id="buttonToolBar" class="buttonToolBar"><a id="zoomInButton" class="zoomInButton" style="visibility: visible; top: 150px; left: 10px; display: block;" onclick="zoomInMap();"></a><a id="zoomOutButton" class="zoomOutButton" style="visibility: visible; top: 220px; left: 10px; display: block;" onclick="zoomOutMap();"></a><a id="gpsMapButton" class="gpsMapButton" style="visibility: visible; top: 290px; left: 10px; display: block;" onclick="gpsMap();"></a></div>';
                            //$.get('../map/layout.html?time='+Date(), function(data) {
                                //$smartMap.html(data);
                                $smartMap.html(smartmaphtml);

                                if(useGoogleMap) {
                                   $('.googleLink', $widgetContainer).triggerHandler('click');
                                   console.log("gmap clicked");
                                }
                                else {
                                   $('.bingLink', $widgetContainer).triggerHandler('click');
                                }
                            //});
                        }
                    }
                            
                    /*
                    $(document).on('scroll.smartWidget', function() {
                        if (typeof googlemap == 'undefined') {
                            if ($(document).scrollTop() > mapDivPos) {
                                $.fn.loadScript();
                                $(document).off('scroll.smartWidget');
                            }
                        }
                        else if(reloadMap) {
                            reloadMap = false;
                            downloadmaps();
                            $(document).off('scroll.smartWidget');
                        }
                    }); // end $(document).on('scroll.smartWidget'
                    */

                    /*
                    if(reloadMap) {
                        reloadMap = false;
                        $("#smartMap").show(); // Reveal when screensize increased. Also allows map to properly span
                        downloadmaps();
                    }
                    */
                }
                else if($mapContainer != null) {
                    $mapContainer.hide();
                }
            }

            function loadGoogleMapScript() {
                if(!googleMapScriptLoaded && (typeof(google) == 'undefined' || typeof(google.maps) == 'undefined')) { 
                    writeConsole('Loading Google map scripts');
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=downloadmaps';
                    document.body.appendChild(script);
                    googleMapScriptLoaded = true;
                }
            }

            function loadBingMapScript() {
                if(!bingMapScriptLoaded && (typeof(Microsoft) == 'undefined' || typeof(Microsoft.Maps) == 'undefined')) { 
                    // Load the Bing map control in the page to avoid an intermittent error when the
                    // map control isn't fully downloaded.
                    //writeConsole('Loading Bing map scripts');
                    //var script = document.createElement('script');
                    //script.type = 'text/javascript';
                    //script.src = 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0';
                    //document.body.appendChild(script);
                    bingMapScriptLoaded = true;
                }
            }

            //markerCluster = new MarkerClusterer(googlemap, mrkrs);
            $('.googleLink, .googleClusterLink', $widgetContainer).on('click.smartWidget', function(event) {
                writeConsole('Google link clicked');
                useGoogleMap = true;
                loadGoogleMapScript(); // only loads once
                console.log($(event.target));
                googleMapLoaded = false;
                settings.showGmapCluster = false;
                if($(event.target).hasClass("googleClusterLink")) {
                    console.log("show cluster link clicked");
                    settings.showGmapCluster = true;
                }
                if(reloadMap) {
                    reloadMap = false;
                    $("#smartMap").show(); // Reveal when screensize increased. Also allows map to properly span
                    downloadmaps();
                }
                else if(!googleMapLoaded) {
                    downloadmaps(); 
                } 

                //$("#widgetTabs li").removeClass("active");
                
                    $(this).addClass("active");
               
                if ($("#mapColumn:visible").length != 1) {
                    $("#mapColumn").show(); // For narrow screens
                }
                $('.staticBingMapsHolder', $smartMap).hide();
                $('.bingMapsHolder', $smartMap).hide();
                $('.googleMapsHolder', $smartMap).show();
                if (googlemap) {
                    googlemap.setZoom(globalGmapMapZoomLevel);
                }
                //$infoBox.hide();
                $(".infobox_wrapper", $smartMap).hide();
                $(".buttonToolBar", $smartMap).show();
                
                event.preventDefault();
                
            });
            $('.bingLink', $widgetContainer).on('click.smartWidget', function(event) {
                $('.bingMapsHolder', $smartMap).show();
                writeConsole('Bing link clicked');
                console.log(mrkrs);
                useGoogleMap = false;
                loadBingMapScript(); // only loads once
                if(reloadMap) {
                    reloadMap = false;
                    $("#smartMap").show(); // Reveal when screensize increased. Also allows map to properly span
                }
                
                if(!bingMapLoaded) {
                    loadBingMap();
                    addMarkers();
                }
                console.log("markers added.");
                
                                        
                //$("#widgetTabs li").removeClass("active");
                $(this).addClass("active");
                
                if ($("#mapColumn:visible").length != 1) {
                    $('#searchButton').trigger("click");
                }
                $('.staticBingMapsHolder', $smartMap).hide();
                $('.googleMapsHolder', $smartMap).hide();
                $('.bingMapsHolder', $smartMap).show();
                if (bingmap) {
                    bingmap.setView({ zoom: globalBingMapZoomLevel});
                }
                $(".buttonToolBar", $smartMap).show();
                event.preventDefault();
            });
            $('.listingsLink', $widgetContainer).on('click.smartWidget', function(event) {
                    
                //$("#widgetTabs li").removeClass("active");
                $(this).addClass("active");
                $('.basicSearch').hide();

                // BUGBUG - clicking "Listings" does not bring back "Places" section of list.
                $('.widgets').show(); /* no effect */
                $('.smartList').show(); /* no effect */

                $('#smartList').show();
                $('#smartMap').show();
                event.preventDefault();
            });
            
            $('.changeButton', $widgetContainer).on('click.smartWidget', function(event) {
                $('.searchLink').trigger("click");
            });
            $('.searchLink', $widgetContainer).on('click.smartWidget', function(event) {
                //$("#widgetTabs li").removeClass("active");
                $(this).addClass("active");
                
                // Comment out - this should be handled in the page if not already done
                /*
                $("#locationStatus").hide(); // project 5.18
                if (typeof $.cookie('searchParams').locationDD != 'undefined') {
                    if ($.cookie('searchParams').locationDD == 'zip') {
                        $("#zipFields").show();
                        if (typeof $.cookie('searchParams').zip != 'undefined' && $.cookie('searchParams').zip != '') {
                            $("#zip").val($.cookie('searchParams').zip);
                        }
                        
                    }
                    
                    if ($.cookie('searchParams').locationDD == 'county') {
                        $("#countyFields").show();
                        if (typeof $.cookie('searchParams').county != 'undefined' && $.cookie('searchParams').county != '') {
                            $("#countyids").val($.cookie('searchParams').county.split(','));
                        }
                        
                    }
                    
                    if ($.cookie('searchParams').locationDD == 'city') {
                        $("#cityFields").show();
                        if (typeof $.cookie('searchParams').city != 'undefined' && $.cookie('searchParams').city != '') {
                            $("#cities").val($.cookie('searchParams').city.split(','));
                        }
                    }
                    if ($.cookie('searchParams').locationDD == 'current' || $.cookie('searchParams').locationDD == 'custom') {
                        $("#latLonFields").show();
                        
                }
                }
                */
                
                $listContainer.hide();
                $('.basicSearch', $widgetContainer).show();
                event.preventDefault();
            });
            $('.mapLink', $widgetContainer).on('click.smartWidget', function(event) {
                if (panorama) {
                    $(".gpsMapButton", $mapContainer).show();
                    panorama.setVisible(false);
                }
            });
            $('.directionsLink', $widgetContainer).on('click.smartWidget', function(event) {
                $("#widgetTabs li").removeClass("active");
                $(this).addClass("active");
                $('#smartDirections').show();
            });

            $.fn.initiatemaps = function() {
                writeConsole('Processing initiatemaps');
                
                loadGoogleMap();

                addMarkers();

            } // end $.fn.initiatemaps

            function loadGoogleMap() {
                if(googleMapLoaded) {
                    return;
                }

                writeConsole('Loading Google map');

                // BUGBUG - Remove lat lon below
                var mapOptions = {
                    zoom: 8,
                    'scrollwheel': false,
                    center: new google.maps.LatLng(34.397, -83.644),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    //panControl: false,
                    zoomControl: false,
                    //streetViewControl: false,
                }
                if(googlemap != null) {
                    delete googlemap;
                    googlemap = null;
                }
                
                /*function GmapCustomZoomControl(controlDiv, map) {

                    controlDiv.style.padding = '5px';

                    var zoomInUI = document.createElement('div'),
                        ZoomInText = document.createElement('div'),
                        zoomOutUI = document.createElement('div'),
                        zoomOutText = document.createElement('div');
                        gpsUI = document.createElement('div'),
                        gpsText = document.createElement('div');

                    zoomInUI.style.cursor = 'pointer';
                    zoomInUI.style.textAlign = 'center';
                    zoomInUI.title = 'Zoom In';
                    controlDiv.appendChild(zoomInUI);

                    ZoomInText.style.paddingLeft = '4px';
                    ZoomInText.style.paddingRight = '4px';
                    ZoomInText.innerHTML = '<a id="zoomInButton" class="zoomInButton" style="top:40px;"></a>';
                    zoomInUI.appendChild(ZoomInText);


                    zoomOutUI.style.cursor = 'pointer';
                    zoomOutUI.style.textAlign = 'center';
                    zoomOutUI.title = 'Zoom Out';
                    controlDiv.appendChild(zoomOutUI);

                    zoomOutText.style.paddingLeft = '4px';
                    zoomOutText.style.paddingRight = '4px';
                    zoomOutText.innerHTML = '<a id="zoomOutButton" class="zoomOutButton" style="top:120px;"></a>';
                    zoomOutUI.appendChild(zoomOutText);
                    
                    
                    gpsUI.style.cursor = 'pointer';
                    gpsUI.style.textAlign = 'center';
                    gpsUI.title = 'Zoom Out';
                    controlDiv.appendChild(gpsUI);

                    gpsText.style.paddingLeft = '4px';
                    gpsText.style.paddingRight = '4px';
                    gpsText.innerHTML = '<a id="gpsMapButton" class="gpsMapButton" style="top:200px;"></a>';
                    gpsUI.appendChild(gpsText);
                    


                    google.maps.event.addDomListener(zoomInUI, 'click', function() {
                        map.setZoom(googlemap.getZoom() + 1)
                    });

                    google.maps.event.addDomListener(zoomOutUI, 'click', function() {
                        map.setZoom(googlemap.getZoom() - 1)
                    });

                }*/
                
                googlemap = new google.maps.Map(document.getElementById('smartMap_google'), mapOptions);
                panorama = googlemap.getStreetView();
                panorama.setPosition(new google.maps.LatLng(40.729884, -73.990988));
                panorama.setOptions({zoomControl:false});
                panorama.setPov(({
                    heading: 265,
                    pitch: 0
                }));
                /*
                var GmapCustomZoomControlDiv = document.createElement('div'),
                    gmapCustomZoomControl = new GmapCustomZoomControl(GmapCustomZoomControlDiv, googlemap);

                GmapCustomZoomControlDiv.index = 1;
                googlemap.controls[google.maps.ControlPosition.LEFT_TOP].push(GmapCustomZoomControlDiv);
                */

                infowindow = new google.maps.InfoWindow();
                bounds = new google.maps.LatLngBounds();
                if(mrkrs.length > 0) {
                    for (var key in mrkrs ) {
                        delete mrkrs[key];
                    }
                    mrkrs.length = 0;
                }

                if(markerCluster != null) {
                    delete markerCluster;
                    markerCluster = null;
                }

                googleMapLoaded = true;
            }

            $widgetContainer.on('initDirectionsService.smartWidget', function(event) {
                // This is an internal event that is used to initialize the directions service.
                // In order for the directions map to display correctly, the directions map container
                // must be visible before this handler is called.

                if(googleDirectionsServiceLoaded) {
                    return;
                }

                writeConsole('Loading Google Directions Service');

                var rendererOptions = {
                    draggable: true
                };

                if(directionsDisplay != null) {
                    delete directionsDisplay;
                    directionsDisplay = null;
                }
                if(directionsService != null) {
                    delete directionsService;
                    directionsService = null;
                }
                if(directionsMap != null) {
                    delete directionsMap;
                    directionsMap = null;
                }

                directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
                directionsService = new google.maps.DirectionsService();
    
                // BUGBUG - Remove lat lon below
                var mapOptions = {
                    zoom: 4,
                    'scrollwheel': false,
                    center: new google.maps.LatLng(34.397, -83.644)
                };

                directionsDisplay.setPanel(null);
                directionsMap = new google.maps.Map($directionsMapContainer.get(0), mapOptions);
                directionsDisplay.setMap(directionsMap);
                directionsDisplay.setPanel($directionsDisplayContainer.get(0));

                google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
                    var totalDistance = computeTotalDistance(directionsDisplay.getDirections());

                    directionsEvent = jQuery.Event('displayedDirections');
                    directionsEventData = {
                        totalDistance: totalDistance
                    };

                    $widgetContainer.trigger(directionsEvent, directionsEventData);
                });

                function computeTotalDistance(result) {
                    var total = 0;
                    var myroute = result.routes[0];
                    for (var i = 0; i < myroute.legs.length; i++) {
                        total += myroute.legs[i].distance.value; // distance is always expressed as meters
                    }
                    total = total / 1000.0; // convert to kilometers.
                    return total;
                }

                googleDirectionsServiceLoaded = true;
            }); // end initDirectionsService handler

            function loadBingMap() {
                if(!bingMapEnabled) {
                   return;
                }
                if(bingMapLoaded) {
                    return;
                }

                writeConsole('Loading Bing map');

                // Load BING Map
                // To do: Scroll side list when rolling over map pin.
                var latAverage = (latMin + latMax) / 2;
                var lonAverage = (lonMin + lonMax) / 2;
                // 32.93685, -83.73017
                var mapOptions = {
                    credentials: settings.bingMapKey,
                    center: new Microsoft.Maps.Location(latAverage, lonAverage),
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                    zoom: 7,
                    disableZooming: true
                };
                //Create the map
                if (bingmap != null) {
                    /*
                    for (var key in bingmap.entities) {
                        delete bingmap.entities[key];
                    }
                    bingmap.entities.length = 0;
                    */
                    delete bingmap;
                    bingmap = null;
                }
                bingmap = new Microsoft.Maps.Map(document.getElementById('smartMap_bing'), mapOptions);
                bingmap.blur(); // Prevents arrow keys from scrolling map only.
                
                /* changing bing map infobox */
                //Create two layers, one for pushpins, the other for the infobox. This way the infobox will always be above the pushpins.
                pinLayer = new Microsoft.Maps.EntityCollection();
                bingmap.entities.push(pinLayer);

                var infoboxLayer = new Microsoft.Maps.EntityCollection();
                bingmap.entities.push(infoboxLayer);

                // Create the info box for the pushpin
                pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0,0), {visible: false});
                infoboxLayer.push(pinInfobox);
                /* changing bing map infobox */

                Microsoft.Maps.Pushpin.prototype.data = null;
                /*                
                $('#closeInfoBoxButton').on('click.smartWidget', function() {
                    $infoBox.hide();
                });
                */
                                
                bingMapLoaded = true;
            }

            function LoadStaticMap() {
                if (location.host == 'localhost') {
                    $('.bingStaticLink', $widgetContainer).show()
                    .on('click.smartWidget', function(event) {
                        $(this).siblings().removeClass("active").end().addClass("active");
                        var $staticBingHolder = $('.staticBingMapsHolder', $smartMap);
                        if($staticBingHolder.find('img[src^="http://dev.virtualearth.net"]').length == 0) {
                            var now = new Date();
                            $staticBingHolder.html('<img src="http://dev.virtualearth.net/REST/V1/Imagery/Map/road?mapArea=30.31,-85.8,35.1,-81&ms=340,400&' + staticLink + 'ml=TrafficFlow&mapVersion=v1&key=' + settings.bingMapKey + '&timestamp=' + now.getTime() + '" />');
                            $staticBingHolder.append('<br /><span style="color: white;">Bing static maps contain up to 18 points.</span><br />');
                        }
                        $staticBingHolder.show();
                        $('.bingMapsHolder', $smartMap).hide();
                        $('.googleMapsHolder', $smartMap).hide();
                        event.preventDefault();
                    });
                }
            }

            function addMarkers() {
                // Ensure that the map is loaded and the feeds have completed loading before
                // displaying the markers. The map may not be loaded by the time the feeds
                // have been processed or vice-versa or the map be loaded after one feed
                // has been processed but not another feed.
                if((useGoogleMap && !googleMapLoaded) || (!useGoogleMap && !bingMapLoaded) || feedStatuses.length != settings.feeds.length) {
                    return;
                }

                if(useGoogleMap) {
                    addGoogleMarkers();
                }
                else {
                    addBingMarkers();
                }
                
            } // End addMarkers
            
            function getInfoHtml(item, itemIndex, feed, leftBorderColor, index, $listContainer, mode)
            {
                //content
                var infoHtml = '';

                i = 0;
                html.length = 0;
                      
                html[i++] = '<div style="max-width: 205px; min-height: 120px;">'; // wrapper div
                if(item.images != null && item.images[0].medium != null && item.images[0].medium != '') {
                    html[i++] = '<img src="' + item.images[0].medium + '" + title="' + item.title + '" style="width:100%; max-width:220px; max-height:220px; margin-right: 5px;"/>';
                }
                html[i++] = '<div style="overflow: hidden;">'; // text div
                html[i++] = '<span style="background:'+leftBorderColor+';padding: 0 4px 0 4px;color:#fff;">'+(itemIndex + 1)+'</span> ';
                html[i++] = '<span style="font-weight: bold;">' + item.title + '</span><br />';
                if(item.lineOfBusiness != null && item.lineOfBusiness != '') {
                    html[i++] = item.lineOfBusiness + "<br />";
                }
                if(item.title.indexOf(item.venue.street) < 0) {
                    html[i++] = item.venue.street + '<br />';
                }
                html[i++] = item.venue.city + ', ' + item.venue.state;
                if (item.venue.zip != null && item.venue.zip != '') {
                    html[i++] = ' ' + item.venue.zip.substr(0, 5) + ' ';
                }
                if(item.venue.county != null && item.venue.county != '') {
                    html[i++] = '<span style="white-space:nowrap">' + item.venue.county + ' County' + '</span><br />' ;
                }
                if(item.venue.country != null && item.venue.country != '') {
                    html[i++] = item.venue.country + '<br />' ;
                }
                if(item.keyDetails != null && item.keyDetails != '') {
                    html[i++] = item.keyDetails + "<br />";
                }
                html[i++] = '<a style="font-weight: bold;" href="#" class="gmapDirectionLink" data-location=\'{\"lat\":\"'+item.venue.latitude+'\", \"lang\":\"'+item.venue.longitude+'\"}\' >Directions</a> | ';
                html[i++] = '<a style="font-weight: bold;"  data-id="'+item.id+'"  href="' + item.htmlLink + '" target="_blank">Page</a> | ';
                if(feed.detailsUrl != '' && feed.detailsUrl != null) {
                    if(mode == 'gmap') {
                        html[i++] = '<a style="font-weight: bold;" href="" data-id="'+item.id+'" class="detailsLink" data-itemindex="' + index + '">Details</a><br />';
                    } else {
                        html[i++] = '<a style="font-weight: bold;" data-id="'+item.id+'" href="javascript:void(0)" class="detailsLink" onclick="showItemDetails(this, \'' + $listContainer.attr('id') + '\', ' + itemIndex + ');">Details</a><br />';
                    }
                }
                html[i++] = '</div></div>'; // text div
                return html.join('');
            }
            
            function addGoogleMarkers() {
                // Ensure that the map is loaded and the feeds have completed loading before
                // displaying the markers. The map may not be loaded by the time the feeds
                // have been processed or vice-versa or the map be loaded after one feed
                // has been processed but not another feed.
                if(!googleMapLoaded || feedStatuses.length != settings.feeds.length) {
                    return;
                }

                writeConsole('Loading Google markers');

                var mapPinCount = 0;
                if (settings.showPositionIconOnMapLoad) {
                    setGmapPositionMarker($("#lat").val(), $("#lon").val());
                }
                //bounds.extend(loc);
                //mrkrs.push(Static_marker);
                //console.log(settings.feeds);
                $('.eventRow', $listContainer).each(function(index, element) {
                //$.each(itemArray, function(i, item) {
                    var item = $(element).data('item');
                    var feed = $(element).data('feed');
                    var itemIndex = $(element).data('itemIndex');
                    var leftBorderColor = $(element).data('leftBorderColor');
                    //console.log(itemArray[index].id);
                    //console.log(item.id);
                    //console.log(item);
                    //console.log(feed);
                    //console.log(itemIndex);
                    if (item.venue) {
                        if (typeof item.venue.latitude != 'undefined' && typeof item.venue.longitude != 'undefined' &&
                            item.venue.latitude != null && item.venue.longitude != null) {
                            var lat = parseFloat(item.venue.latitude), lng = parseFloat(item.venue.longitude);
                            //Ks
                            mapPinCount++;
                            var loc = new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
                                svgMarker = {
                                    path: 'M 32.00,0.00 M 22.53,8.02 C 20.88,0.47 10.12,0.47 8.47,8.02 7.51,12.42 10.99,15.55 13.01,19.00 13.01,19.00 16.00,25.00 16.00,25.00 18.24,16.06 23.75,13.60 22.53,8.02 Z M 18.00,7.00 C 18.00,7.00 18.00,12.00 18.00,12.00 18.00,12.00 13.00,12.00 13.00,12.00 13.00,12.00 13.00,7.00 13.00,7.00 13.00,7.00 18.00,7.00 18.00,7.00 Z',
                                    fillColor: leftBorderColor,
                                    fillOpacity: 1.0,
                                    scale: 1,
                                    strokeColor: 'black',
                                   
                                };
                            markerOptions = {
                                position: loc,
                                map: googlemap,
                                //icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                icon: svgMarker,
                                //shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
                                title: 'marker: ' + (itemIndex + 1)
                            }
                            /*
                            if(feed.provider.toLowerCase() === 'facebook') {
                                //markerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                markerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            }*/
                            var Static_marker = new google.maps.Marker(markerOptions);
                            bounds.extend(loc);
                            mrkrs.push(Static_marker);
                            //infoHtml = getInfoHtml(item, itemIndex, feed, leftBorderColor, index, $listContainer, 'gmap');
                            
                            

                            //content
                            var infoHtml = '';

                            i = 0;
                            html.length = 0;
                                  
                            //html[i++] = '<div style="min-width: 300px; min-height: 120px;">'; // wrapper div
                            html[i++] = '<div style="max-width: 205px; min-height: 120px;">'; // wrapper div
                            if(item.images != null && item.images[0].medium != null && item.images[0].medium != '') {
                                html[i++] = '<img src="' + item.images[0].medium + '" + title="' + item.title + '" style="width:100%; max-width:220px; max-height:220px; margin-right: 5px;"/>';
                            }
                            html[i++] = '<div style="overflow: hidden;">'; // text div
                            html[i++] = '<span style="background:'+leftBorderColor+';padding: 0 4px 0 4px;color:#fff;">'+(itemIndex + 1)+'</span> ';
                            html[i++] = '<span style="font-weight: bold;">' + item.title + '</span><br />';
                            if(item.lineOfBusiness != null && item.lineOfBusiness != '') {
                                html[i++] = item.lineOfBusiness + "<br />";
                            }
                            if(item.title.indexOf(item.venue.street) < 0) {
                                html[i++] = item.venue.street + '<br />';
                            }
                            html[i++] = item.venue.city + ', ' + item.venue.state;
                            if (item.venue.zip != null && item.venue.zip != '') {
                                html[i++] = ' ' + item.venue.zip.substr(0, 5) + ' ';
                            }
                            if(item.venue.county != null && item.venue.county != '') {
                                html[i++] = '<span style="white-space:nowrap">' + item.venue.county + ' County' + '</span><br />' ;
                            }
                            if(item.venue.country != null && item.venue.country != '') {
                                html[i++] = item.venue.country + '<br />' ;
                            }
                            if(item.keyDetails != null && item.keyDetails != '') {
                                html[i++] = item.keyDetails + "<br />";
                            }
                            html[i++] = '<a style="font-weight: bold;" href="#" class="gmapDirectionLink" data-location=\'{\"lat\":\"'+item.venue.latitude+'\", \"lang\":\"'+item.venue.longitude+'\"}\' >Directions</a> | ';
                            html[i++] = '<a style="font-weight: bold;"  data-id="'+item.id+'"  href="' + item.htmlLink + '" target="_blank">Page</a> | ';
                            if(feed.detailsUrl != '' && feed.detailsUrl != null) {
                                html[i++] = '<a style="font-weight: bold;" href="" data-id="'+item.id+'" class="detailsLink" data-itemindex="' + index + '">Details</a><br />';
                            }
                            html[i++] = '</div>'; // text div
                            html[i++] = '</div>'; // wrapper div
                            infoHtml = html.join('');
                            

                            google.maps.event.addListener(Static_marker, 'click', function() {
                                $mapContainer.off('.smartWidget'); // remove any attached events before resetting the content
                                infowindow.setContent(infoHtml);
                                infowindow.open(googlemap, Static_marker);
                                activeLocationMarker.location = Static_marker.getPosition();
                                googlemap.setCenter(activeLocationMarker.location);
                                if ($(window).width() > 800) {
                                    googlemap.panBy(settings.googleMapPanbyX,0);
                                }
                            });
                            
                            itemArray[index].gmarker = Static_marker;
                            $(element).data('gmarker', Static_marker);
                            //console.log(itemArray[index].gmarker);
                            //End Google Maps
                     
                        }
                    }
                });
                
                google.maps.event.addListener(googlemap, 'dragend', function() {
                    /* set map dragged flag */
                    flgGmapDragged = true;
                });
                google.maps.event.addListener(infowindow,'closeclick',function() {
                   activeLocationMarker.location = null;
                });

                google.maps.event.addListener(infowindow, 'domready', function(e) {
                    // This handler may be called more than once if the infowindow has to be resized. Including
                    // an image in the infowindow can cause a resize to occur if the image is large enough.
                    // To prevent adding multiple event handlers, call the .off() method first to clear any
                    // previously created event handlers.
                    console.log("in gmap infowondow event");
                    console.log(e);
                    $(".gmapDirectionLink", $mapContainer)
                        .off("click.smartWidget")
                        .on("click.smartWidget", function(event) {
                            console.log("in gmapDirectionLink click event");
                            console.log(event);
                            loadGmapDirection(event, settings.latitude, settings.longitude);
                            event.preventDefault();
                        });

                    $('.detailsLink', $mapContainer)
                        .off('click.smartWidget')
                        .on('click.smartWidget', function(event) {
                            event.preventDefault();
                            var $this = $(this);
                            var itemIndex = $this.data('itemindex');
                            
                            var $listRow = $listContainer.find('.eventRow').eq(itemIndex);

                            // displayingItemDetails Event
                            var detailsEvent = jQuery.Event('displayingItemDetails');
                            var eventData = {
                                item: $listRow.data('item'),
                                feed: $listRow.data('feed'),
                                showHideAll: false,
                                scrollOffset: null // should be set by the event handler
                            };

                            // BUGBUG - this causes error when gallery div not used:
                            // TypeError: Cannot read property 'hide' of null
                            //$galleryContainer.hide(); // Quick fix - images were scrolling over fixed map.

                            $listRow.trigger(detailsEvent, eventData);
                            if(!detailsEvent.isDefaultPrevented()) {
                                $listContainer.show();

                                var offset = eventData.scrollOffset;
                                if(!isNaN(offset)) {
                                    scrollToTop($listRow, offset);
                                }

                                if($listRow.data('expanded') == false) {
                                    $listRow.find('.summaryLink').click();
                                }

                                // displayedItemDetails Event
                                detailsEvent = jQuery.Event('displayedItemDetails');
                                $listRow.trigger(detailsEvent, eventData);
                            }
                        });
                });
                
                if(mrkrs.length > 1) { //this is quick fix, need standa
                googlemap.fitBounds(bounds);
                }

                //Adding markerCluster
                if (settings.showGmapCluster == true) {
                    markerCluster = new MarkerClusterer(googlemap, mrkrs);
                }
                if ($(window).width() > 800) {
                    googlemap.panBy(settings.googleMapPanbyX,0);
                }
                //googlemap.fitBounds(bounds);
                console.log(mrkrs.length);
                
                // google.maps.event.addDomListener(window, 'resize', downloadmaps); // Comment out - causes more markers to be added when resized.

            }

            function addBingMarkers() {
                // Ensure that the map is loaded and the feeds have completed loading before
                // displaying the markers. The map may not be loaded by the time the feeds
                // have been processed or vice-versa or the map be loaded after one feed
                // has been processed but not another feed.
                if(!bingMapLoaded || feedStatuses.length != settings.feeds.length) {
                    return;
                }

                writeConsole('Loading Bing markers');
                
                var mapPinCount = 0;
                
                
                $('.eventRow', $listContainer).each(function(i, element) {
                //$.each(itemArray, function(i, item) {
                    var item = $(element).data('item');
                    //console.log(item);
                    var feed = $(element).data('feed');
                    var itemIndex = $(element).data('itemIndex');
                    var leftBorderColor = $(element).data('leftBorderColor');
                    
                    if (item.venue) {
                        if (typeof item.venue.latitude != 'undefined' && typeof item.venue.longitude != 'undefined' &&
                            item.venue.latitude != null && item.venue.longitude != null) {
                            var lat = parseFloat(item.venue.latitude), lng = parseFloat(item.venue.longitude);
                            mapPinCount++;
                            
                            //console.log(itemIndex + 1);

                            if(bingMapEnabled) {
                                //Add pins in Bing Maps
                                var loc = new Microsoft.Maps.Location(lat, lng);
                                var pinOptions = {
                                    //"text": (mapPinCount).toString(),
                                    "text": (itemIndex + 1).toString(),
                                    "title": item.title,
                                    //center: loc.center,
                                    //textOffset: new Microsoft.Maps.Point(200, 100),
                                    //offset: new Microsoft.Maps.Point(-100, 0),
                                    icon: '../img/bing/poi_custom.png'
                                };
                                var pin = new Microsoft.Maps.Pushpin(loc, pinOptions);
                                //pin.data = id;
                                pin.data = { item: item, feed: feed, itemIndex: itemIndex, leftBorderColor:leftBorderColor };
                                bingmap.entities.push(pin);
                                //
                           
                                Microsoft.Maps.Events.addHandler(pin, 'click', displayMapInfoBox);
                                Microsoft.Maps.Events.addHandler(pin, 'mouseover', changeCursor);
                                Microsoft.Maps.Events.addHandler(pin, 'mouseout', revertCursor);
                                // Re-position the info box when the map is moved.
                                Microsoft.Maps.Events.addHandler(bingmap, 'viewchange', rePositionInfobox);
                                
                                Microsoft.Maps.Events.addHandler(bingmap, "mouseout", function (event) {
                                    
                                });
                                /*
                                Microsoft.Maps.Events.addThrottledHandler(bingmap, "viewchangeend", function (event) {
                                    flgBingDragged = true;
                                    console.log("bing map dragged");
                                }, 250);
                                */

                                $(element).data('bmarker', pin);
                                //End Bing Map
                            }

                        }
                    }
                });
                if (settings.showPositionIconOnMapLoad) {
                    setBingMapPositionMarker($("#lat").val(), $("#lon").val(), false);
                    }
                /*
                Microsoft.Maps.Events.addHandler(pinInfobox, "click", function (event) {
                    console.log("in bing map pininfobox click event");
                    console.log(event);
                    console.log(event.target);
                    console.log($(event.target).is('a'));
                    if(event.handled != true) {
                        $(".bingDirectionLink").on("click.smartWidget", function(event) {
                            console.log("in bing map pininfobox gmapDirectionLink click event");
                            console.log(event);
                            loadGmapDirection(event, settings.latitude, settings.longitude);
                            //event.preventDefault();
                        });
                    }
                });*/

                if($(window).width() > 800 && bingMapEnabled) {
                    location1 = bingmap.getCenter();
                    point = bingmap.tryLocationToPixel(location1);
                    point.x = point.x + settings.bingMapPointX;
                    location2 = bingmap.tryPixelToLocation(point);
                    bingmap.setView({center:location2});
                }

            }

            function rePositionInfobox(e)
            {
                //flgBingDragged = true;
                //console.log("bing map view changed.");
                if($infoBox.is(':visible')) {
                    
                  var pix = bingmap.tryLocationToPixel($infoBox.data('location'), Microsoft.Maps.PixelReference.control);
                    $infoBox.css('top', (pix.y) + "px");
                    $infoBox.css('left', (pix.x + 20) + "px");
                }
                
            }
            
            function changeCursor(e) { 
                bingmap.getRootElement().style.cursor = 'pointer';
            }
            function revertCursor(e) { 
                bingmap.getRootElement().style.cursor = 'url("http://ecn.dev.virtualearth.net/mapcontrol/v7.0/cursors/grab.cur"), move';
            }

            // BING MAP
            function displayMapInfoBox(e) {
                console.log(e);
                //console.log(e.getLocation());
                var location = e.targetType == "pushpin" ? e.target.getLocation() : e.getLocation();
               
                //if (e.targetType == "pushpin" || e.getLocation()) {
                    //console.log(e.targetType);

                    var pix = bingmap.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control);

                    var item = e.targetType == "pushpin" ? e.target.data.item : e.data.item;
                    var feed = e.targetType == "pushpin" ? e.target.data.feed : e.data.feed;
                    var itemIndex = e.targetType == "pushpin" ? e.target.data.itemIndex : e.data.itemIndex;
                    var leftBorderColor = e.targetType == "pushpin" ? e.target.data.leftBorderColor : e.data.leftBorderColor;
                    var infoHtml = '';

                    
                    i = 0;
                    html.length = 0;
                    if(item.images != null && item.images[0].medium != null && item.images[0].medium != '') {
                        html[i++] = '<img src="' + item.images[0].medium + '" + title="' + item.title + '" style="float:left; width: 120px; margin-right: 5px;"/>';
                    }
                    html[i++] = '<div style="overflow: hidden;">';
                    html[i++] = '<span style="background:' + leftBorderColor + ';padding: 0 4px 0 4px;color:#fff;">' + (itemIndex + 1) +'</span><br />';
                    html[i++] = '<span style="font-weight: bold;">' + item.title + '</span><br />';
                    if(item.lineOfBusiness != null && item.lineOfBusiness != '') {
                        html[i++] = item.lineOfBusiness + "<br />";
                    }
                    if(item.title.indexOf(item.venue.street) < 0) {
                        html[i++] = item.venue.street + '<br />';
                    }
                    html[i++] = item.venue.city + ', ' + item.venue.state;
                    if (item.venue.zip != null && item.venue.zip != '') {
                        html[i++] = ' ' + item.venue.zip.substr(0, 5);
                    }
                    html[i++] = '<br />';
                    if(item.venue.county != null && item.venue.county != '') {
                        html[i++] = item.venue.county + ' County' + '<br />' ;
                    }
                    if(item.venue.country != null && item.venue.country != '') {
                        html[i++] = item.venue.country + '<br />' ;
                    }
                    if(item.keyDetails != null && item.keyDetails != '') {
                        html[i++] = item.keyDetails + "<br />";
                    }

                    // Use inline script for the links since jQuery click events don't work due to the infobox
                    // being redrawn when clicking on a marker or when the map has been moved.
                    // This also means that the functions called must be external to the plugin
                    html[i++] = '<a style="font-weight: bold;" href="javascript:void(0)" onclick="loadGmapDirection(this, \''+settings.latitude+'\', \''+settings.longitude+'\');" class="bingDirectionLink" data-location=\'{\"lat\":\"'+item.venue.latitude+'\", \"lang\":\"'+item.venue.longitude+'\"}\' >Directions</a><br />';
                    html[i++] = '<a style="font-weight: bold;" href="' + item.htmlLink + '"  data-id="'+item.id+'"  target="_blank">Page</a><br />';
                    if(feed.detailsUrl != '' && feed.detailsUrl != null) {
                        html[i++] = '<a style="font-weight: bold;" data-id="'+item.id+'" href="javascript:void(0)" class="detailsLink" onclick="showItemDetails(this, \'' + $listContainer.attr('id') + '\', ' + itemIndex + ');">Details</a><br />';
                        
                    }

                    html[i++] = '</div>';
                    infoHtml = html.join('');
                    
                    //infoHtml = getInfoHtml(item, itemIndex, feed, leftBorderColor, itemIndex, $listContainer, 'bmap');

                    var yPosAdjust = 260;
                    //$infoBox.hide();
                    
                    //console.log(pix);

                    //$('#infoText').html(infoHtml);
                    //$infoBox.css('top', (pix.y) + "px");
                    //$infoBox.css('left', (pix.x + 20) + "px");
                    //$infoBox.css('cursor', 'pointer');
                    //$infoBox.data('location', location);

                    //$infoBox.show();
                    //$(".infobox_wrapper").show();
                    $(".infobox_content", $mapContainer).html(infoHtml);

                     pinInfobox.setOptions({
                        visible:true,
                        offset: new Microsoft.Maps.Point(-33, 20),
                        //htmlContent: pushpinFrameHTML.replace('{content}',html)
                        htmlContent: $(".infobox_wrapper").html()
                    });
                  

                    //set location of infobox
                    pinInfobox.setLocation(location);
                    
                    //A buffer limit to use to specify the infobox must be away from the edges of the map.
                    var buffer = 25; 
                    
                    var infoboxOffset = pinInfobox.getOffset();
                    var infoboxAnchor = pinInfobox.getAnchor();
                    var infoboxLocation = bingmap.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control);

                    var dx = infoboxLocation.x + infoboxOffset.x - infoboxAnchor.x;
                    var dy = infoboxLocation.y - 25 - infoboxAnchor.y;
                    
                    if(dy < buffer){	//Infobox overlaps with top of map.
                        //Offset in opposite direction.
                        dy *= -1;
                        
                        //add buffer from the top edge of the map.
                        dy += buffer;
                    }else{
                        //If dy is greater than zero than it does not overlap.
                        dy = 0;
                    }
                    
                    if(dx < buffer){	//Check to see if overlapping with left side of map.
                        //Offset in opposite direction.
                        dx *= -1;
                        
                        //add a buffer from the left edge of the map.
                        dx += buffer; 
                    }else{		//Check to see if overlapping with right side of map.
                        dx = bingmap.getWidth() - infoboxLocation.x + infoboxAnchor.x - pinInfobox.getWidth();
                        
                        //If dx is greater than zero then it does not overlap.
                        if(dx > buffer){
                            dx = 0;
                        }else{
                            //add a buffer from the right edge of the map.
                            dx -= buffer;
                        }
                    }

                    //Adjust the map so infobox is in view
                    if(dx != 0 || dy != 0){
                        bingmap.setView({ centerOffset : new Microsoft.Maps.Point(dx,dy), center : bingmap.getCenter()});
                    }
                    location2 = new Microsoft.Maps.Location(item.venue.latitude, item.venue.longitude);
                    point2 = bingmap.tryLocationToPixel(location2);
                    point2.x = point2.x + settings.bingMapPointX;
                    location2 = bingmap.tryPixelToLocation(point2);
                    bingmap.setView({center:location2});
                    
               // }
            }
            
            //End ks

            // END MAP CODE


            if ($listContainer != null) {
                
                $listContainer.on("click.smartWidget", function(event, showHideOnly) {
                    
                    if(event.isDefaultPrevented()) {
                        return false; // click hander called again due to event bubbling. If already handled, just return.
                    }
                    
                    var $eventTarget = $(event.target);

                    if($eventTarget.hasClass("rowCheckBox")) {
                        var isChecked = $eventTarget.prop('checked');

                        var $parent = $eventTarget.closest('div.eventRow');
                        
                        if ($parent.length == 1) {
                            var dataItem = $parent.data('item');
                            var dataItemFeed = $parent.data('feed');

                            // listItemChecked Event
                            var listItemEvent = jQuery.Event('listItemChecked');
                            var listItemEventData = {item: dataItem, feed: dataItemFeed, checked: isChecked};
                            $widgetContainer.trigger(listItemEvent, listItemEventData);
                        }
                    }

                    if($eventTarget.is("a") && $eventTarget.hasClass("morelink")) {
                        event.preventDefault();
                        //return false;
                    }
                    if ($eventTarget.hasClass('showAllResults')) {
                        // displayingAllResults Event
                        var allResultsEvent = jQuery.Event('displayingAllResults');
                        var eventData = {};

                        $listContainer.trigger(allResultsEvent, eventData);
                        if(!allResultsEvent.isDefaultPrevented()) {
                            $(".showAllResults", $widgetContainer).hide();
                            $(".listHeader", $widgetContainer).show();
                            $(".eventRow", $widgetContainer).each(function(index, element) {
                               var $this = $(this);
                               // collapse the row if expanded
                               if($this.data('expanded') == true) {
                                 $this.find('.summaryLink').click();
                               }
                            }).show();
                            if (typeof(panorama) != 'undefined') {
                                $(".gpsMapButton", $mapContainer).show();
                                panorama.setVisible(false);
                            }
                            if(typeof(infowindow) != "undefined") {
                               infowindow.close(); // google map
                            }
                            closeInfobox(); // bing map

                            // displayedAllResults Event
                            allResultsEvent = jQuery.Event('displayedAllResults');
                            $listContainer.trigger(allResultsEvent, eventData);
                        }
                    }
                    if($eventTarget.hasClass('entypo-right-dir') || $eventTarget.hasClass('entypo-down-dir')) {

                        event.preventDefault();
                        var feedType = $eventTarget.data('feedtype');
                        if(typeof(feedType) != 'undefined') {
                        // Expand or collapse all items. Tell the handler to not display the map popup, 
                        // i.e. true means showHideOnly = true in the event handler
                            if($eventTarget.hasClass('entypo-right-dir')) {
                                $eventTarget.removeClass('entypo-right-dir').addClass('entypo-down-dir');
                                $('.eventRow.' + feedType, $listContainer)
                                .find('.summaryLink > img[src*="circle-next"]')
                                .trigger('click', true);
                            }
                            else {
                                $eventTarget.removeClass('entypo-down-dir').addClass('entypo-right-dir');
                                $('.eventRow.' + feedType, $listContainer)
                                .find('.summaryLink > img[src*="circle-down"]')
                                .trigger('click', true);
                            }
                        }
                    }


                    var $link = $eventTarget.closest('a', $listContainer);

                    /*
                    if($eventTarget.hasClass("eventRowInfo")) {
                        $link = $eventTarget.prev().prev().children('a');
                    }
                    */
                    if($eventTarget.is("span, div") && $eventTarget.closest('div.eventRowInfo', $listContainer).length == 1) {
                        $link = $eventTarget.closest('div.eventRow', $listContainer).find('.summaryLink:first');
                    }
                    /*
                    if($eventTarget.is("span")) {
                        $link = $eventTarget.parent().prev().prev().children('a');
                    }
                    */
                    /*
                    // if using shorten plugin
                    if($eventTarget.is("span") && ($eventTarget.hasClass("shortcontent"))) {
                        $link = $eventTarget.parent().parent().prev().prev().children('a');
                    }
                    */
                    if ($link.length == 1) {
                        var eventprocessed = false;
                        var $parent = $link.closest('div.eventRow');
                        
                        if ($parent.length == 1) {
                            var dataItem = $parent.data('item');
                            var dataItemFeed = $parent.data('feed');
                            var gmarker = $parent.data('gmarker');
                            var bmarker = $parent.data('bmarker');

                            var $rowTitleContainer = $parent.find('.rowTitleContainer:first');
                            var $summaryHeadline = $parent.find('.summaryHeadline:first');
                            var $summaryInfo = $parent.find('.summaryInfo:first');
                            var $detailsInfo = $parent.find('.detailsInfo:first');
                            var $thumbnail = $parent.find('.thumbnailContainer > img:first');
                            var $expandInfo = $parent.find('.expandInfo:first');
                            var $attachments = $parent.find('.attachments:first');
                            var $fullDetailLinks = $parent.find('.fullDetailLinks:first');
                            var $detailsLink = $parent.find('.detailsLink:first');
                            
                            if(typeof(showHideOnly) == 'undefined' || typeof(showHideOnly) == 'boolean' && showHideOnly == false) {
                                if(dataItem.venue.latitude && dataItem.venue.longitude) {
                                    writeConsole(dataItem.venue.latitude + "--" + dataItem.venue.longitude);
                                    //event.preventDefault();
                                    if($("#smartMap_google").is(":visible")) {
                                        //set google map location to center
                                        googlemap.setCenter(new google.maps.LatLng(dataItem.venue.latitude,dataItem.venue.longitude));
                                        googlemap.panBy(settings.googleMapPanbyX,0);
                                        google.maps.event.trigger(gmarker,'click');
                                        //console.log('event.preventDefault()');
                                        //event.preventDefault();
                                    }
                                    //event.preventDefault();
                                
                                    if(bingMapEnabled) {
                                        if($("#smartMap_bing").is(":visible")) {
                                            // Set the bingmap center
                                            location2 = new Microsoft.Maps.Location(dataItem.venue.latitude, dataItem.venue.longitude);
                                            point2 = bingmap.tryLocationToPixel(location2);
                                            point2.x = point2.x + settings.bingMapPointX;
                                            location2 = bingmap.tryPixelToLocation(point2);
                                            bingmap.setView({center:location2});
                                            console.log(bmarker);
                                            Microsoft.Maps.Events.invoke(bmarker, 'click', bmarker);
                                            //event.preventDefault();
                                            //Microsoft.Maps.Events.invoke(bingmap.entities.get(1), 'click');
                                    
                                            //bingmap.setView({center:new Microsoft.Maps.Location(dataItem.venue.latitude, dataItem.venue.longitude)});
                                        }
                                    }
                                }
                                // event.preventDefault();
                            }
                            if ($link.hasClass('detailsLink')) {
                                console.log('detailsLink');
                                if($link.text() == 'Details') { // BUGBUG - remove this so we can change the link title.
                                    console.log('$link.text() == Details');
                                    // displayingItemDetails Event
                                    var detailsEvent = jQuery.Event('displayingItemDetails');
                                    var eventData = {
                                        item: dataItem,
                                        feed: dataItemFeed,
                                        showHideAll: false,
                                        scrollOffset: null // should be set by the event handler
                                    };

                                    $parent.trigger(detailsEvent, eventData);
                                    if(!detailsEvent.isDefaultPrevented()) {
                                        console.log('!detailsEvent.isDefaultPrevented()');
                                         
                                        // When "Details" clicked, show the street scene (the equivalent to dragging the person icon to the map).
                                        
                                        if(dataItem.venue.latitude && dataItem.venue.longitude) {
                                            $(".gpsMapButton", $mapContainer).hide();
                                            panorama.setPosition(new google.maps.LatLng(parseFloat(dataItem.venue.latitude), parseFloat(dataItem.venue.longitude)));
                                            panorama.setVisible(true);
                                        }
                                        else {
                                            $(".gpsMapButton", $map).show();
                                            panorama.setVisible(false);
                                        }
                                    
                                        $fullDetailLinks.find('a.detailsLink').html('Loading Details <img src="../img/ajax-loader.gif" alt="Loading Details" title="Loading Details" style="width: 18px;" />');
                                        getDetails($detailsInfo, dataItem, dataItemFeed, function() {
                                            $fullDetailLinks.find('a.detailsLink').html('Details');
                                            if($detailsInfo.is(':empty')) {
                                                $detailsInfo.hide();
                                                $rowTitleContainer.show();
                                                $summaryInfo.show();
                                                $expandInfo.show();
                                                $attachments.show();
                                                $thumbnail.show();
                                                $link.text('Details');
                                            }
                                            else {
                                                $detailsInfo.show();
                                                //$rowTitleContainer.hide();
                                                $summaryInfo.hide();
                                                $expandInfo.hide();
                                                $attachments.hide();
                                                $thumbnail.hide();
                                                $link.text('Hide Details');
                                            }
                                        });

                                        if($slideshowContainer != null) {
                                            var imageIndex = $.inArray(dataItem.index, imageArray);
                                            if(imageIndex >= 0) {
                                                pauseShow();
                                                goIndex(imageIndex);
                                            }
                                        }

                                        // displayedItemDetails Event
                                        detailsEvent = jQuery.Event('displayedItemDetails');
                                        $parent.trigger(detailsEvent, eventData);
                                    }
                                }
                                else {
                                    $detailsInfo.hide();
                                    $rowTitleContainer.show();
                                    $summaryInfo.show();
                                    $expandInfo.show();
                                    $attachments.show();
                                    $thumbnail.show();
                                    $link.text('Details');
                                }
                                event.preventDefault();
                            } // end detailsLink
                            else if ($link.hasClass('summaryLink')) {
                               console.log('summaryLink');
                                // Toggle the thumbnail width. The height will be adjusted accordingly
                                $thumbnail.css('width') == '64px' ? $thumbnail.css('width', '') : $thumbnail.css('width', '64px');
                                var $icon = $link.find('img').first();
                                if($icon.length > 0) {
                                   var iconSrc = $icon.attr('src');
                                   if(iconSrc.indexOf('circle-next') >= 0) {
                                        // displayingItemDetails Event
                                        var detailsEvent = jQuery.Event('displayingItemDetails');
                                        var eventData = {
                                            item: dataItem,
                                            feed: dataItemFeed,
                                            showHideAll: (typeof(showHideOnly) == 'boolean' ? showHideOnly : false),
                                            scrollOffset: null // should be set by the event handler
                                        };

                                        $parent.trigger(detailsEvent, eventData);
                                        if(!detailsEvent.isDefaultPrevented()) {

                                            $icon.attr('src', '../img/icons/circle-down.png');
                                            $parent.data('expanded', true);

                                            // Initially show the info from the feed.
                                            $detailsInfo.hide();
                                            $summaryInfo.show();
                                            $summaryHeadline.hide();
                                            $expandInfo.show();
                                            $attachments.show();
                                            $fullDetailLinks.show();
                                            $thumbnail.show();
                                            if($slideshowContainer != null) {
                                                var imageIndex = $.inArray(dataItem.index, imageArray);
                                                if(imageIndex >= 0) {
                                                   pauseShow();
                                                   goIndex(imageIndex);
                                                }
                                            }
                                        
                                            if($(".googleMapsHolder").is(":visible")
                                             && (typeof(showHideOnly) == 'undefined' || (typeof(showHideOnly) == 'boolean' && showHideOnly == false))) {
                                                if(dataItem.venue.latitude && dataItem.venue.longitude) {
                                                    $(".gpsMapButton", $mapContainer).hide();
                                                    panorama.setPosition(new google.maps.LatLng(parseFloat(dataItem.venue.latitude), parseFloat(dataItem.venue.longitude)));
                                                    panorama.setVisible(true);
                                                }
                                                else {
                                                    $(".gpsMapButton", $mapContainer).show();
                                                    panorama.setVisible(false);
                                                }
                                            }

                                            if(dataItemFeed.detailsUrl != '' && dataItemFeed.detailsUrl != null
                                             && (typeof(showHideOnly) == 'undefined' || (typeof(showHideOnly) == 'boolean' && showHideOnly == false))) {
                                                $fullDetailLinks.find('a.detailsLink').html('Loading Details <img src="../img/ajax-loader.gif" alt="Loading Details" title="Loading Details" style="width: 18px;" />');
                                                getDetails($detailsInfo, dataItem, dataItemFeed, function() {
                                                    $fullDetailLinks.find('a.detailsLink').html('Details');
                                                    if(!$detailsInfo.is(':empty')) {
                                                        $detailsInfo.show();
                                                        //$rowTitleContainer.hide();
                                                        $summaryInfo.hide();
                                                        $summaryHeadline.hide();
                                                        $expandInfo.hide();
                                                        $attachments.hide();
                                                        $thumbnail.hide();
                                                        $detailsLink.text('Hide Details');
                                                    }
                                                });
                                            }
                                            else { // The detailsUrl is empty or showHideOnly == true

                                                // show the full details if available, otherwise show the info from the feed.
                                                if(!$detailsInfo.is(':empty')) {
                                                    $detailsInfo.show();
                                                    //$rowTitleContainer.hide();
                                                    $summaryInfo.hide();
                                                    $summaryHeadline.show();
                                                    $expandInfo.hide();
                                                    $attachments.hide();
                                                    $thumbnail.hide();
                                                    $detailsLink.text('Hide Details');
                                                }
                                            }
                                            // displayedItemDetails Event
                                            detailsEvent = jQuery.Event('displayedItemDetails');
                                            $parent.trigger(detailsEvent, eventData);
                                        }
                                   }
                                   else {
                                      $icon.attr('src', '../img/icons/circle-next.png');
                                      $parent.data('expanded', false);
                                      $detailsInfo.hide();
                                      $rowTitleContainer.show();
                                      $summaryInfo.hide();
                                      $summaryHeadline.show();
                                      $expandInfo.hide();
                                      $attachments.hide();
                                      $fullDetailLinks.hide();
                                      if(!settings.showListThumbnail) {
                                        $thumbnail.hide();
                                      }
                                      $detailsLink.text('Details');
                                   }
                                }
                                event.preventDefault();
                            } // end summaryLink
                            else if ($link.hasClass('rowMapLink')) {
                                changeMarkerColor = false;
                                 // if window width is already < 800 $('#smartMap').show(); doesn't work
                                $(window).trigger("resize");
                                console.log("in rowMapLink");
                                $("#smartList").css({"height":"50%" , "overflow":"hidden"});
                                $("#smartMap").show();
                                if(typeof infowindow != "undefined") {
                                    infowindow.close();
                                }
                                if (previous_highlighted_marker != null) {
                                    console.log(previous_highlighted_marker);
                                    var icon = previous_highlighted_marker.getIcon();
                                    icon.fillColor = previous_highlighted_marker.icon.pfillColor;
                                    previous_highlighted_marker.setIcon(icon);
                                }
                                if(dataItem.venue != null && dataItem.venue.longitude != null && dataItem.venue.latitude != null && typeof google != "undefined") {
                                    
                                    previous_highlighted_marker = dataItem.gmarker;
                                    previous_highlighted_marker.icon.pfillColor = previous_highlighted_marker.icon.fillColor;
                                    var icon = dataItem.gmarker.getIcon();
                                    icon.fillColor = "red";
                                    dataItem.gmarker.setIcon(icon);
                                    googlemap.setCenter(dataItem.gmarker.getPosition());
                                    globalGmapMapZoomLevel = 13;
                                    googlemap.setZoom(globalGmapMapZoomLevel);
                                    
                                }
                                event.preventDefault();
                            }
                            //event.preventDefault();
                        }
                    }
                    //console.log("check if control reaches here");
                    //event.preventDefault();
                });
            }

            if ($slideshowContainer != null) {
                //$slideshowContainer.find('.slideContainer').hover(function () // With this, arrows flicker when rolling over.  Remove this line.
                $slideshowContainer
                .on('mouseenter.smartWidget', function() {
                    if(imageArray.length > 1) {
                        $slideshowContainer.find('.prev, .next').show().css({"opacity":"0.5"});
                    }
                    //$slideshowContainer.find('.menuIcon').show();
                    //$widgetContainer.find('.menuIcon').show();
                    return false;
                })
                .on('mouseleave.smartWidget', function() { //the handlerOut
                    $slideshowContainer.find('.menuList').hide();
                    //$slideshowContainer.find('.prev').hide();
                    //$slideshowContainer.find('.next').hide();
                    if(imageArray.length > 1) {
                        $slideshowContainer.find('.prev, .next').css({"opacity":"0.7"});
                    }
                    //$slideshowContainer.find('.menuIcon').hide();
                    //$widgetContainer.find('.menuIcon').hide();
                    return false;
                });
                // See also: Fade example with two selectors assigned to a handler:
                // http://stackoverflow.com/questions/6645551/how-to-interrupt-a-hovers-handlerout

                if($galleryContainer != null) {
                    $galleryContainer.on('click.smartWidget', function(event) {
                        event.preventDefault();
                        var $imageContainer = $(event.target).closest('.medium-container', $galleryContainer);
                        if ($imageContainer.length == 1) {
                            pauseShow();
                            var imageIndex = $imageContainer.data('imageIndex');
                            goIndex(imageIndex);
                            scrollToTop($slideshowContainer, 0);
                            if (settings.updateBrowserHash == true) {
                                var itemIndex = imageArray[imageIndex];
                                ignoreHashChange = true;
                                updateHash('slide', itemArray[itemIndex].id);
                            }
                        }
                    });
                }

                $slideshowContainer.find('.pause').on('click.smartWidget', function() {
                    pauseShow();
                    return false;
                });

                $slideshowContainer.find('.resume').on('click.smartWidget', function() {
                    $slideshowContainer.data("feature_rotate").should_pause = false;
                    $(this).hide().prev('.pause').show();
                    $('.slideshowContainer').css({'height': ''}); // Clear to force height reset.
                    return false;
                });

                $slideshowContainer.find('.prev').on('click.smartWidget', function() {
                    pauseShow();
                    previousSlide();
                });

                $slideshowContainer.find('.next').on('click.smartWidget', function() {
                    pauseShow();
                    nextSlide();
                });

            } // end if($slideshowContainer != null)

            if (settings.showNavigationMenu == true) {
                $widgetContainer.find('.menuIcon').on('mouseenter.smartWidget', function() {
                    //$widgetContainer.find('.menuList').fadeIn(); // Was this needed for iPad? Added following instead:
                    $widgetContainer.find('.menuList').show();
                    return false;
                });
                $widgetContainer.find('.menuList').on('mouseleave.smartWidget', function() { //the handlerOut
                    //$widgetContainer.find('.menuList').fadeOut(); // Was this needed for iPad? Added following instead:
                    if (settings.showMenuIcon == true) {
                        $widgetContainer.find('.menuList').hide();
                    }
                    return false;
                });

                $('.menuList li').on('click.smartWidget', function() {
					var divcls = $(this).attr('divid');
                    $('.widgets').hide();
                    if (divcls == 'galleryContainer') {
                        $('#smartSlideshow').show();
                        $('#smartGallery').show();
                        $('.slideshowContainer').hide();
                        $(document).trigger('scroll')
                    } else if (divcls == 'slideshowContainer') {
                        $('#smartSlideshow').show();
                        $('#smartGallery').show();
                        $('.galleryContainer').hide();
                    }
                    if (divcls == 'widgets') {
                        $('.' + divcls).show();
                        if(imageArray.length > 0) {
                            $('.slideshowContainer').show();
                            $('.galleryContainer').show();
                        }
                        else {
                            $('.slideshowContainer').hide();
                            $('.galleryContainer').hide();
                        }
                    } else if (divcls == 'newSearch') {
                        $('#smartMap').show();
                        $('.basicSearch').show();
                    } else { // smartList
                        $('.basicSearch').hide();
                        $('#smartMap').show();
                        $('.' + divcls).show();
                    }

                    /*
                    //Loading maps on menu click if it hasn't loaded already
                    if (divcls == "smartMap" && typeof googlemap == 'undefined') {
                        $.fn.loadScript();
                    }
                    else if(reloadMap) {
                        reloadMap = false;
                        downloadmaps();
                    }
                    */

                    if (settings.showMenuIcon == true) {
                        $('.menuList').fadeOut('fast');
                    }
                })
            }

            function hashChange(event) {
                if (!ignoreHashChange) {
                    //alert('new hash: ' + location.hash);
                    var hashObj = getHashValues(window.location.hash);
                    var slideID = -1;
                    if (typeof (hashObj.slide) != 'undefined') {
                        if (typeof (previousHashObj.slide) != 'undefined') {
                            // See if the slide hash value has changed.
                            if (hashObj.slide != previousHashObj.slide) {
                                slideID = hashObj['slide'];
                            }
                        }
                        else {
                            // slide was not present in the previous hash
                            slideID = hashObj['slide'];
                        }
                    }

                    previousHashObj = clone(hashObj);

                    $.each(imageArray, function(index, item) {
                        var itemIndex = imageArray[index];
                        if (itemArray[itemIndex].id == slideID) {
                            goIndex(index);
                            return false; // no need to keep iterating
                        }
                    });
                }
                else {
                    ignoreHashChange = false;
                }
            }

            // Begin slideshow functions
            function initiateSlideshow($slideshowContainer) {
                $widgetContainer.find('.loadingMessage').hide();
                //writeConsole('initiateSlideshow');

                // Create the initial divs to hold the image and text to be cross-faded
                i = 0;
                html.length = 0;
                html[i++] = '<div class="slide-text active">';
                html[i++] = '</div>';
                html[i++] = '<div class="slide-text inactive">';
                html[i++] = '</div>';

                html[i++] = '<div class="slide-class active">';
                html[i++] = '</div>';
                html[i++] = '<div class="slide-class inactive">';
                html[i++] = '</div>';

                var slideContainer = '';
                slideContainer = html.join('');
                $slideshowContainer
                .find('.slideContainer').html(slideContainer) // add the empty divs to the gallery
                .find('.slide-text.inactive, .slide-class.inactive').hide(); // hide the inactive divs

                changeNumber(0);
                load(0, true); // load the first image into the active div
                if(imageArray.length > 1) {
                    load(1); // load the next image into the inactive div.
                }
                var number = 1;

                var tickspeed = 2000 //ticker speed in miliseconds (2000=2 seconds)

                currentSlideIndex = -1; // Allows nextSlide to start with 1st image.

                if(imageArray.length > 1) {
                    $slideshowContainer.at_intervals(function() {
                            nextSlide();
                        },
                        {
                            name: "feature_rotate",
                            delay: 5000
                        }
                    );
                }
                else {
                    if(typeof($slideshowContainer.data("feature_rotate")) != 'undefined') {
                        $slideshowContainer.data("feature_rotate").should_stop = true;
                    }
                }

                // Display the slide if found. If not, then display the slideshow as usual.
                var slideID = '';
                if (settings.updateBrowserHash == true && typeof (initialHashObj.slide) != 'undefined') {
                    slideID = initialHashObj.slide;
                }
                else if (settings.slide != '') {
                    slideID = settings.slide;
                }

                if (slideID != '') {
                    $.each(imageArray, function(index, item) {
                        var itemIndex = imageArray[index];
                        if (itemArray[itemIndex].id == slideID) {
                            pauseShow();
                            goIndex(index);
                            return false; // no need to keep iterating
                        }
                    });
                }
            }

            function pauseShow() {
                if(typeof($slideshowContainer.data("feature_rotate")) != 'undefined') {
                    $slideshowContainer.data("feature_rotate").should_pause = true;
                }
                $slideshowContainer.find('.pause').hide().next('.resume').show();
            }

            function previousSlide() {
                //alert('previousSlide');
                loadPrevious();
                resetHeight();
                showImage();
                //alert('previousSlideDone');
            }

            function nextSlide() {
                if(currentSlideIndex == -1) {
                    currentSlideIndex++; // first time - the first image is already loaded and displayed.
                    return;
                }
                loadNext();
                resetHeight();
                showImage();
            }

            function goSlide(number) {
                // number should be 1-based
                goIndex(number - 1);
            }

            function goIndex(index) {
                // 0 based
                currentSlideIndex = index;
                load(index);
                resetHeight();
                showImage();
            }

            function loadNext() {
                currentSlideIndex++; // 0-based
                if (currentSlideIndex >= slideCount) {
                    currentSlideIndex = 0;
                }

                currentSlide = currentSlideIndex + 1; // 1- based
                load(currentSlideIndex);
            }

            function loadPrevious() {
                currentSlideIndex--; // 0-based
                if (currentSlideIndex < 0) {
                    currentSlideIndex = slideCount - 1;
                }

                currentSlide = currentSlideIndex + 1; // 1- based
                load(currentSlideIndex);
            }

            function load(index, active) {
                var textHtml = '';
                var imageHtml = '';

                var feedIndex = 0;

                // The imageArray serves as a map to the itemArray since not every item will have an image to display.
                var itemIndex = imageArray[index];

                i = 0;
                html.length = 0;

                var item = itemArray[itemIndex];
                feedIndex = item.feedIndex;

                var itemFeed = settings.feeds[feedIndex];

                if (item.title) {
                    html[i++] = '<div class="slide-title">' + item.title + '</div>';
                }
                
                if (itemFeed.type == 'locations' || itemFeed.type == 'places') {
                    var lineOfBusiness = item.lineOfBusiness;
                    var keyDetails = item.keyDetails;
                    var summary = getSubstringWords(item.summary, itemFeed.maxGallerySummaryLength);
                    if (lineOfBusiness == null) {
                        lineOfBusiness = '';
                    }
                    if (keyDetails == null) {
                        keyDetails = '';
                    }
                    if (summary == null) {
                        summary = '';
                    }

                    html[i++] = '<span class="slide-summary">';
                    
                    var htmlSpan = [];
                    var j = 0;

                    if (lineOfBusiness != '') {
                        if(htmlSpan.length > 0) {
                           htmlSpan[j++] = ' &ndash; ';
                        }
                        htmlSpan[j++] = lineOfBusiness;
                    }
                    if (keyDetails != '') {
                        if(htmlSpan.length > 0) {
                           htmlSpan[j++] = ' &ndash; ';
                        }
                        htmlSpan[j++] = keyDetails;
                    }
                    if (summary != '') {
                        if(htmlSpan.length > 0) {
                           htmlSpan[j++] = ' &ndash; ';
                        }
                        if (summary.length > 180) {
                            htmlSpan[j++] = summary.substring(0,180) + "...";
                        } else {
                            htmlSpan[j++] = summary;
                        }
                    }

                    html[i++] = htmlSpan.join('');
                    html[i++] = '</span>';
                }

                html[i++] = '<div class="fullDetailLinks">';
                if(item.venue != null && item.venue.longitude != null && item.venue.latitude != null) {
                    html[i++] = '<a style="font-weight: bold;" href="#" class="gmapDirectionLink" onclick="loadGmapDirection(this, \''+settings.latitude+'\', \''+settings.longitude+'\');" data-location=\'{\"lat\":\"'+item.venue.latitude+'\", \"lang\":\"'+item.venue.longitude+'\"}\' >Directions</a> | ';
                }

                html[i++] = '<a href="' + item.htmlLink + '" data-id="'+item.id+'" target="_blank">Page</a>';

                if(itemFeed.detailsUrl != '' && itemFeed.detailsUrl != null) {
                    html[i++] = ' | <a href="" data-id="'+item.id+'" class="detailsLink">Details</a>';
                }
                html[i++] = '</div>';

                html[i++] = '<div class="detailsInfo"></div>';
                html[i++] = '</div>';

                textHtml = html.join('');
                
                // By default, load the image and text into the inactive div. The showImage function will then
                // cross-fade it into view, making the currently displayed image the inactive one.
                if(active === true) {
                    $slideshowContainer.find('.slide-text.active').html(textHtml)
                    .find('.detailsLink').on('click.smartWidget', function(event) {
                        event.preventDefault();
                        pauseShow();
                        //var $parent = $(this).closest('.slide-text');
                        //var $detailsInfo = $parent.find('.detailsInfo:first');
                        //getItemInfo($detailsInfo, item, itemFeed);
                        $listContainer.show();
                        var $listRow = $listContainer.find('.eventRow').eq(itemIndex);

                        if(typeof(getScrollOffset) == 'function') { // external function defined in page or other script file.
                            var offset = getScrollOffset($listContainer); 
                            if(!isNaN(offset)) {
                                scrollToTop($listRow, offset);
                            }
                        }

                        if($listRow.data('expanded') == false) {
                           $listRow.find('.summaryLink').click();
                        }
                    });
                    
                }
                else {
                    $slideshowContainer.find('.slide-text.inactive').html(textHtml)
                    .find('.detailsLink').on('click.smartWidget', function(event) {
                        event.preventDefault();
                        pauseShow();
                        //var $parent = $(this).closest('.slide-text');
                        //var $detailsInfo = $parent.find('.detailsInfo:first');
                        //getItemInfo($detailsInfo, item, itemFeed);
                        $listContainer.show();
                        var $listRow = $listContainer.find('div.eventRow').eq(itemIndex);

                        if(typeof(getScrollOffset) == 'function') { // external function defined in page or other script file.
                            var offset = getScrollOffset($listContainer); 
                            if(!isNaN(offset)) {
                                scrollToTop($listRow, offset);
                            }
                        }

                        if($listRow.data('expanded') == false) {
                           $listRow.find('.summaryLink').click();
                        }
                    });
                }

                i = 0;
                html.length = 0;

                html[i++] = '<img class="slide-image lazyLarge" src="' + host + item.images[0].large + '"  alt="" />';
                imageHtml = html.join('');

                if(active === true) {
                    $slideshowContainer.find('.slide-class.active').html(imageHtml);
                }
                else {
                    $slideshowContainer.find('.slide-class.inactive').html(imageHtml);
                }
                // #7 As the slideshow rotates to the next image, highlight it's map point in red and center that point on the map.  Revert the point back to the prior color when another map point is clicked, or when the next slide rotates to the next map point.
                /*if(typeof infowindow != "undefined") {
                    infowindow.close();
                }*/
                
                if(changeMarkerColor && $("#smartMap_google").is(":visible")) {
                    if (previous_highlighted_marker != null) {
                        //console.log(previous_highlighted_marker);
                        var icon = previous_highlighted_marker.getIcon();
                        icon.fillColor = previous_highlighted_marker.icon.pfillColor;
                        previous_highlighted_marker.setIcon(icon);
                    }
                    if(mrkrs.length > 1 && item.venue != null && item.venue.longitude != null && item.venue.latitude != null && typeof google != "undefined") {
                        
                        previous_highlighted_marker = item.gmarker;
                        previous_highlighted_marker.icon.pfillColor = previous_highlighted_marker.icon.fillColor;
                        var icon = item.gmarker.getIcon();
                        icon.fillColor = "red";
                        item.gmarker.setIcon(icon);
                        
                    }
                }


                $slideshowContainer.find('.slide-nav-button').show();
            }

            function showImage() {
                // Cross-fade between the active and inactive images (and text). After cross-fading, toggle
                // the inactive classes to active and vice-versa.
                var $fade = $slideshowContainer.find('.slide-class.inactive, .slide-text.inactive');
                var $fadeOut = $slideshowContainer.find('.slide-class.active, .slide-text.active');
                
                
                
                // if the elements are currently being animated
                if ($fade.is(':animated') || $fadeOut.is(':animated')) {
                    $('.slide-image').removeClass("grab-cursor").addClass("grabbing-cursor");
                    // complete the animation now and call the completion functions
                    if($fade.is(':animated')) {
                        $fade.stop(true, true);
                    }
                    if( $fadeOut.is(':animated')) {
                        $fadeOut.stop(true, true);
                    }
                }
                else {
                    //alert('fade');
                    // fade in quickly
                    $fade.fadeIn({
                        duration: 850, 
                        complete: function() {
                            $(this).removeClass('inactive').addClass('active');
                            $(this).find('.slide-image').removeClass("grabbing-cursor").addClass("grab-cursor");
                            //console.log('fadein complete');
                        }
                    }); // fade in the next image and summary text
                        
                    $fadeOut.fadeOut({
                        duration: 850, 
                        queue: false, 
                        complete: function() {
                            $(this).removeClass('active').addClass('inactive');
                            //$(this).find('.slide-image').removeClass("grabbing-cursor").addClass("grab-cursor");
                            //console.log('fadeout complete');
                        }
                    }); // at the same time, fade out the current summary text
                }
                
            }

            function changeNumber(index) {
                $slideshowContainer.find('.slide-numbers a').removeClass('activeNav');
                $slideshowContainer.find('.nav' + index).addClass('activeNav');
                if (settings.showSlideNumbers) {
                    $slideshowContainer.find('.slide-numbers').show();
                }
                $slideshowContainer.find('.slide-number-holder').show();
            }
            // End Slideshow functions

            function resetHeight() {
                // Set the min-height so area does not jump while next slide loads.
                var minHeight = settings.slideshowMaxHeight;
                if ($slideshowContainer.find('.slideshowContainer').height() > 0) {
                    minHeight = $slideshowContainer.find('.slideshowContainer').height();
                    //alert('reset minHeight to ' + minHeight);
                }

                var $slideImage = $slideshowContainer.find('.slide-image');

                if ($slideImage.height() > recentSlideshowMaxHeight && $slideImage.height() < settings.slideshowMaxHeight) {
                    // Prevents jumping of height and arrow positions.
                    recentSlideshowMaxHeight = $slideImage.height()
                    $slideshowContainer.find('.slideshowContainer').css({'min-height': recentSlideshowMaxHeight + 'px'});

                    // BUGBUG
                    //alert('Retain the height of the previous slide.');
                    //$slideshowContainer.find('.slideshowContainer').css({ 'height': recentSlideshowMaxHeight + 'px' }); // Retain the height of the previous slide

                }
            }
            //writeConsole('loadList End');
            
            function writeConsole(text) {
                if (typeof (console) != "undefined") {
                    if(typeof(text) == 'string') {
                        console.log(timeStamp() + text);
                    }
                    else {
                        console.log(timeStamp() + 'Logging an object:');
                        console.log(text); // not a string value
                    }
                }
                //if (location.host == 'localhost' && typeof(text) == 'string') {
                    //$('#showMessage').show();
                    var html = timeStamp() + text + '<br>';
                    var $selector = $('.adminMessage', $widgetContainer);
                    if($selector.length != 0) {
                        $selector.append(html);
                        return;
                    }
                    $selector = $('.smartSearch', $widgetContainer)
                    if($selector.length != 0) {
                        $('<div class="adminMessage"></div>').append(html).prependTo($selector);
                    }
                    else {
                        $('<div class="adminMessage"></div>').append(html).prependTo($widgetContainer);
                    }
                //}
            }
        }
        // End loadList()

        // Helper Functions

        function getDetails($detailsInfo, dataItem, dataItemFeed, callback) {
            if (dataItemFeed.detailsUrl != '' && dataItemFeed.detailsUrl != null
                    && (dataItemFeed.detailsUrl.toLowerCase().substr(0, 4) != 'http' // relative url
                    || dataItemFeed.detailsUrl.toLowerCase().indexOf('http://' + location.host.toLowerCase()) == 0) // url on current domain
                    ) {

                if ($detailsInfo.length == 1) {
                    if (typeof($detailsInfo.data('requested')) == 'undefined') {
                        var detailsUrl = dataItemFeed.detailsUrl.replace(/\{0\}/g, dataItem.id);
                        var detailsSelector = typeof (dataItemFeed.detailsSelector) != 'undefined' ? dataItemFeed.detailsSelector : null;
                        getItemInfo($detailsInfo, dataItem, dataItemFeed, callback);
                        $detailsInfo.data('requested', 1); // Request the url only once whether anything was downloaded or not.
                        return;
                    }
                }
            }

            // Details url is undefined or we've already called it. Either way, call the callback and return;
            if(typeof(callback) == 'function') {
                callback();
                return;
            }
        }

        function getItemInfo($container, item, itemFeed, callback) {
          if(typeof(item.detailsInfoRequested) != 'undefined' && item.detailsInfoRequested == true) {
             if(typeof(item.detailsInfo) != 'undefined') {
                $container.html(item.detailsInfo);
                if(typeof(callback) == 'function') {
                   callback();
                   return;
                }
             }   
          }
          else {
              var detailsUrl = itemFeed.detailsUrl.replace(/\{0\}/g, item.id);
              var detailsSelector = typeof (itemFeed.detailsSelector) != 'undefined' ? itemFeed.detailsSelector : null;
              item.detailsInfoRequested = true;
              getItemInfoAjax(detailsUrl, function (html) {
                var fragment = '';
                if (detailsSelector != null && detailsSelector != '') {
                    fragment = $(html).find(detailsSelector).html();
                }
                else {
                    fragment = html;
                }

                // addingListItemDetail Event
                var listItemEvent = jQuery.Event('addingListItemDetail');
                var listItemEventData = {index: item.index, item: item, feed: itemFeed, html: fragment};
                $container.trigger(listItemEvent, listItemEventData);

                if (!listItemEvent.isDefaultPrevented()) {

                    item.detailsInfo = listItemEventData.html;

                    $container.html(listItemEventData.html);

                    // addedListItemDetail Event
                    listItemEvent = jQuery.Event('addedListItemDetail');
                    $container.trigger(listItemEvent, listItemEventData);
                }

                if(typeof(callback) == 'function') {
                   callback();
                   return;
                }
              });
          }  
        }

        function getItemInfoAjax(url, callback) {
            $.ajax({
                url: url,
                // cache: false,
                success: function(html) {
                    callback(html);
                }
            });
        }

        function updateHash(key, value) {
            var hashObj = getHashValues(window.location.hash);
            hashObj[key] = value;
            window.location.hash = '#' + $.param(hashObj);
        }

        function getHashValues(hash) {
            var hashArray = hash.replace(/^#/, '').substr(0).split('&');
            if (hashArray == "")
                return {};
            var hashObj = {};
            for (var i = 0; i < hashArray.length; ++i) {
                var keyValue = hashArray[i].split('=');
                if (keyValue.length != 2)
                    continue;
                hashObj[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
            }
            return hashObj;
        }

        function fourdigits(number) {
            return (number < 1000) ? number + 1900 : number;
        }

        function daysBetween(date1, date2) {
            // Work with a copy of the dates since the times will be cleared below. This ensures that
            // the dates being passed in are not modified when returning from this function.
            var tmpDate1 = new Date(date1);
            var tmpDate2 = new Date(date2);

            var DSTAdjust = 0;
            // constants used for our calculations below
            oneMinute = 1000 * 60;
            var oneDay = oneMinute * 60 * 24;
            // equalize times in case date objects have them
            tmpDate1.setHours(0);
            tmpDate1.setMinutes(0);
            tmpDate1.setSeconds(0);
            tmpDate2.setHours(0);
            tmpDate2.setMinutes(0);
            tmpDate2.setSeconds(0);
            // take care of spans across Daylight Saving Time changes
            if (date2 > tmpDate1) {
                DSTAdjust =
                        (tmpDate2.getTimezoneOffset() - tmpDate1.getTimezoneOffset()) * oneMinute;
            } else {
                DSTAdjust =
                        (tmpDate1.getTimezoneOffset() - tmpDate2.getTimezoneOffset()) * oneMinute;
            }
            var diff = Math.abs(tmpDate2.getTime() - tmpDate1.getTime()) - DSTAdjust;
            return Math.ceil(diff / oneDay);
        }

        function clone(obj) {
            if (obj == null || typeof (obj) != 'object')
                return obj;
            var temp = new obj.constructor();
            for (var key in obj)
                temp[key] = clone(obj[key]);
            return temp;
        }

        function getHashQuery() {
            return location.hash.replace(/^#/, '');
        }

        function createSlideshowControls($slideshowContainer) {
            // Large images
            var i = 0;
            var html = [];
            html[i++] = '<div class="slideshowContainer" id="slideshowContainer" ontouchstart="touchStart(event,\'slideshowContainer\');"  ontouchend="touchEnd(event);" ontouchmove="touchMove(event);" ontouchcancel="touchCancel(event);">'; // same as slideshow-holder in plugin.html
            html[i++] = '   <div class="pauseResume">';
            html[i++] = '      <div class="pause"></div>';
            html[i++] = '      <div class="resume"></div>';
            html[i++] = '      ';
            html[i++] = '   </div>';
            //html[i++] = '   <div class="prevNext">';
            //html[i++] = '      <div class="prev"></div>';
            //html[i++] = '      <div class="next"></div>';
            html[i++] = '      <div class="fa fa-chevron-left prev"></div>';
            html[i++] = '      <div class="fa fa-chevron-right next"></div>';
            //html[i++] = '   </div>';
            html[i++] = '   <div class="slideNav"></div>';
            html[i++] = '   <div class="slideContainer">';

            html[i++] = '   </div>';
            html[i++] = '</div>';

            $slideshowContainer.append($(html.join('')));
        }
        function createGalleryControls($galleryContainer) {

        }
        function removeNavigationMenu($widgetContainer) {
            $('.menuIcon, .menuList', $widgetContainer).remove();
        }
        function createNavigationMenu($widgetContainer, $listContainer, $slideshowContainer, $galleryContainer, $mapContainer) {

            var i = 0;
            var html = [];

            if ($slideshowContainer != null) {
                html[i++] = '<li class="toggleSlides" divid="slideshowContainer">Slideshow</li>';
            }
            if ($galleryContainer != null) {
                html[i++] = '<li class="toggleGallery" divid="galleryContainer">Gallery</li>';
            }
            if ($mapContainer != null) {
                html[i++] = '<li class="toggleMap" divid="smartMap">Map</li>';
            }
            if ($listContainer != null) {
                html[i++] = '<li class="toggleListings" divid="smartList">Listings</li>';
            }
            html[i++] = '<li class="toggleAll" divid="widgets">Show All</li>';
            html[i++] = '<li class="toggleSearch" divid="newSearch">New Search</li>';
            if (i <= 1) {
                return; // 0 or 1 widget components are displayed, no need to display the menu.
            }

            var liElements = html.join('');

            i = 0;
            html.length = 0;

            html[i++] = '<div class="menuIcon"></div>';
            html[i++] = '<ul class="menuList">'; // create the ul element
            html[i++] = liElements; // add the li elements from above.
            html[i++] = '</ul>'; // close the ul element

            $widgetContainer.append($(html.join('')));
        }

        function convertGoogleFeed(jsonData) {
            var data = {};

            data.kind = '';
            if (jsonData.kind.indexOf('events') >= 0) {
                data.kind = 'Events';
            }
            data.summary = jsonData.summary;

            data.items = [];
            $.each(jsonData.items, function(i, jsonItem) {

                if (jsonItem.status == 'cancelled') {
                    return true; // skip cancelled events.
                }

                var item = {};
                data.items.push(item);

                item.id = jsonItem.id;
                item.kind = '';
                if (jsonItem.kind.indexOf('event') >= 0) {
                    item.kind = 'Event';
                }

                item.title = jsonItem.summary;
                item.summary = jsonItem.summary;
                item.images = null;

                item.status = 0;
                item.statusText = 'Pending';
                if (jsonItem.status == 'confirmed') {
                    item.status = 1;
                    item.satusText = 'Active';
                }

                item.htmlLink = jsonItem.htmlLink;
                item.guid = jsonItem.htmlLink;
                item.created = jsonItem.created;
                item.updated = jsonItem.updated;

                var creator = {};
                item.creator = creator;
                creator.displayName = jsonItem.creator.displayName;
                creator.firstName = null;
                creator.lastName = null;
                creator.email = jsonItem.creator.email;
                creator.phone = null;

                if (typeof (jsonItem.start) != "undefined") {
                    if (typeof (jsonItem.start.dateTime) != "undefined") {
                        item.start = jsonItem.start.dateTime;
                    }
                    if (typeof (jsonItem.start.date) != "undefined") {
                        item.start = jsonItem.start.date;
                    }
                }
                if (typeof (jsonItem.end) != "undefined") {
                    if (typeof (jsonItem.end.dateTime) != "undefined") {
                        item.end = jsonItem.end.dateTime;
                    }
                    if (typeof (jsonItem.end.date) != "undefined") {
                        item.end = jsonItem.end.date;
                    }
                }

                item.location = jsonItem.location;
                item.venue = null;

                var organizer = {};
                item.organizer = organizer;
                organizer.displayName = jsonItem.organizer.displayName;
                organizer.firstName = null;
                organizer.lastName = null;
                organizer.email = jsonItem.organizer.email;
                organizer.phone = null;

                item.recurring = false;
                if (typeof (jsonItem.recurrence) != "undefined") {
                    item.recurring = true;
                }

            }); // end $.each()

            return data;
        }
        
        function convertFbFeed(jsonData) {
            
            //writeConsole(jsonData);
            var page = jsonData.data[0].fql_result_set,
                location = jsonData.data[1].fql_result_set,
                data = {};
            
            data.kind = '';
            data.summary = '';

            data.items = [];
            $.each(page, function(i, jsonItem) {
                
                var item = {};
                data.items.push(item);
                item.id = jsonItem.page_id;
                item.kind = jsonItem.type;
                

                //item.title = jsonItem.display_subtext;
                item.title = jsonItem.name;
                item.summary = jsonItem.description;
                item.images = jsonItem.pic;
                
                //set images in item
                var images = [{}];
                item.images = images;
                images[0].thumbnail = jsonItem.pic;
                images[0].medium = jsonItem.pic_big;
                images[0].large = jsonItem.pic_large;
                /*
                if(jsonItem.pic_big.search("c81") == -1) {
                    images[0].medium = jsonItem.pic_big;
                    images[0].large = jsonItem.pic_large;
                } else {
                    images[0].medium = jsonItem.pic_big;
                    images[0].large = jsonItem.pic_large;
                }*/
                
                
                // status hardcoded as active
                item.status = 1;
                item.statusText = 'Active';
                
                item.htmlLink = 'http://facebook.com/' + jsonItem.page_id;
                item.guid = jsonItem.htmlLink;
                item.created = jsonItem.content_age; //Time when the post was created or -1 if unknown
                item.updated = ''; // Not returned from fb
                
                var organizer = {};
                item.organizer = organizer;
                var creator = {};
                item.creator = creator; // we don't have any items for creator or organizer
                
                // fb feed doesn't return venue object so we need to create our own
                
                //var venue = {};
                //item.venue = venue;
                item.venue = location[i].location;
                item.venue.id = location[i].page_id
                /*
                venue.latitude = jsonItem.latitude;
                venue.longitude = jsonItem.longitude;
                venue.street = 
                venue.city = 
                venue.state = 
                venue.zip = 
                venue.country = 
                */
                item.recurring = false; // default to false from convertgoogleFeed.
                
            }); // end $.each()
            
            return data;
            //return jsonData;
        }
        function convertFbEventsFeed(jsonData) {
            var data = {};
            data.items = [];
            
            // sort the events by start_time
            
            var fbFEvents = [],
                fbFriendsId = [];
            $.each(jsonData.friends.data, function (index, friend) {
                fbFriendsId.push(friend.id);
                if (friend.events && friend.events.data) {
                    $.each(friend.events.data, function(index, event) {
                        var today = new Date();
                        console.log(event);
                        if (typeof event.end_time != "undefined") {
                            var end_time = new Date(event.end_time);
                            if (end_time >= today) {
                                fbFEvents.push(event);
                            }
                        } else {
                            fbFEvents.push(event);
                        }
                        
                    });
                }
            });
            //console.log(fbFriendsId);
            function sort_asc_fbevents(date1, date2) {
              var d1 = new Date(date1.start_time);
              var d2 = new Date(date2.start_time);
              return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
            }
            fbFEvents.sort(sort_asc_fbevents);
            
            //$.each(jsonData.friends.data, function (index, friend) {
            //    if (friend.events && friend.events.data) {
                    $.each(fbFEvents, function(index, event) {
                        
                        var item = {};
                        data.items.push(item);
                        //item.attending = {};
                        /*
                        // fetch all friends attending the events.
                        var url = 'http://localhost/base/where/testdata/' + event.id + '_attending.json';
                        if (location.host != 'localhost') {
                            url = "https://graph.facebook.com/" + event.id + "/attending?access_token="+fbAuthResponse.authResponse.accessToken+"&format=json&fields=id,name,rsvp_status,picture.width(28).height(28)";
                        }
                        
                        $.getJSON( url, function( data ) {
                            item.attending = data;
                            
                        });
                        */
                        
                        
                        item.attending = {data:[]};
                        
                        if ("attending" in event) {
                            $.each(event.attending.data, function(index, attendingFriend) {
                                //console.log(attendingFriend.id);
                                if ($.inArray(attendingFriend.id, fbFriendsId) > -1) {
                                    item.attending.data.push(attendingFriend);
                                }
                            });
                        }
                        
                        
                        item.id = event.id;
                        item.kind = "fbFriendsEvents";
                        item.title = event.name;
                        item.summary = event.description;
                        
                        var images = [{}];
                        item.images = images;
                        images[0].thumbnail = event.picture.data.url;
                        if ("cover" in event) {
                            images[0].medium = event.cover.source;
                            images[0].large = event.cover.source;
                        } else {
                            images[0].medium = event.picture.data.url;
                            images[0].large = event.picture.data.url;
                        }
                        
                        item.status = 1;
                        item.statusText = 'Active';
                        
                        
                        item.htmlLink = 'http://facebook.com/' + event.id;
                        item.guid = item.htmlLink;
                        item.created = event.start_time; //Time when the post was created or -1 if unknown
                        item.updated = ''; // Not returned from fb
                        
                        var organizer = {};
                        item.organizer = event.owner;
                        var creator = {};
                        item.creator = event.owner; // we don't have any items for creator or organizer
                        
                        if (typeof (event.start_time) != "undefined") {
                            item.start = event.start_time;
                        }
                        if (typeof (event.end_time) != "undefined") {
                            item.end = event.end_time;
                        }
                        
                        //var venue = {};
                        //item.venue = venue;
                        item.venue = event.venue;
                        //item.venue.id = event.venue.id;
                        
                        item.recurring = false; // default to false from convertgoogleFeed.
                        
                    });
                //}
            //});
            //console.log(data);
            return data;
            
        }

        function convertFbPhotosFeed(jsonData) {
            var data = {};
            data.items = [];
            $.each(jsonData.friends.data, function (index, friend) {
                if(friend.photos && friend.photos.data) {
                    $.each(friend.photos.data, function(index, photo) {
                        
                        var item = {};
                        data.items.push(item);
                        item.id = photo.id;
                        item.kind = "fbFriendsPhotos";
                        item.title = '';
                        if ("name" in photo) {
                            item.title = photo.name;
                        }
                        item.summary = '';
                        if ('place' in photo && 'name' in photo.place) {
                            item.summary = photo.place.name;
                        }
                        
                        var images = [{}];
                        item.images = images;
                        images[0].thumbnail = photo.picture;
                        images[0].medium = photo.picture;
                        images[0].large = photo.picture;
                        
                        if ("images" in photo) {
                            $.each(images, function(index, image) {
                                if (image.height == '130' && image.width == '193') {
                                    images[0].thumbnail = image.source;
                                }
                                if (image.height == '320' && image.width == '477') {
                                    images[0].medium = image.source;
                                }
                                if (image.height == '429' && image.width == '640') {
                                    images[0].large = image.source;
                                }
                            });
                            
                        }
                        
                        
                        item.status = 1;
                        item.statusText = 'Active';
                        
                        
                        item.htmlLink = photo.link;
                        item.guid = item.htmlLink;
                        item.created = photo.created_time; //Time when the post was created or -1 if unknown
                        item.updated = ''; // Not returned from fb
                        
                        var organizer = {};
                        item.organizer = photo.from;
                        var creator = {};
                        item.creator = photo.from; // we don't have any items for creator or organizer
                        
                        // fb feed doesn't return venue object so we need to create our own
                        
                        //var venue = {};
                        //item.venue = venue;
                        item.venue = {latitude:'', longitude:''};
                        item.venue.id = '';
                        /*
                        if (place in photo) {
                            item.venue = photo.place;
                            item.venue.id = photo.place.id;
                        }*/
                        
                        item.recurring = false; // default to false from convertgoogleFeed.
                        
                    });
                }
            });
            
            return data;
            
        }


        function getSubstringWords(strValue, maxLength) {
            if (strValue == null || typeof (strValue) != 'string' || strValue == '' || strValue.length <= maxLength) {
                return strValue;
            }

            var words = strValue.replace(/\s{2,}/g, ' ').split(' ');
            var returnArray = [];
            var returnValue = '';

            for (var i = 0; i < words.length; i++) {
                returnArray[i] = words[i];
                returnValue = returnArray.join(' ');
                if (returnValue.length >= maxLength - 3) {
                    returnArray.pop();
                    returnValue = returnArray.join(' ') + '...';
                    break;
                }
            }

            return returnValue;
        }

        // End Helper Functions

        // initialize every element
        this.each(function() {
            loadList($(this)); // Passes in #smartWidget (or other surrounding div)
        });

        return this;
    }, // end init

    checkBoxes: function(action, feedType) {
       this.each(function() {
           var $this = $(this);
           var $selector;
           if(feedType != '') {
              $selector = $('.feedtype_' + feedType + ' .rowCheckBoxContainer', $this);
           }
           else {
              $selector = $('.rowCheckBoxContainer', $this);
           }

           switch(action.toLowerCase()) {
              case 'show' :
                  $selector.show();
                  break;
              case 'hide':
                  $selector.hide();
                  break;
              case 'toggle':
                  $selector.toggle();
                  break;
           }
       });

       return this;
    }, // end checkboxes

    detail: function(id, feedType) {
        var foundItem = false;

        var $firstWidget = this.first();

        var $listRow;
        if(feedType != '') {
            $listRow = $('.eventRow.feedtype_' + feedType + '[data-id=' + id + ']', $firstWidget).first();
        }
        else {
            $listRow = $('.eventRow[data-id=' + id + ']', $firstWidget).first();
        }

        if($listRow.length == 1) {
            foundItem = true;

            // displayingItemDetails Event
            var detailsEvent = jQuery.Event('displayingItemDetails');
            var eventData = {
                item: $listRow.data('item'),
                feed: $listRow.data('feed'),
                showHideAll: false,
                scrollOffset: null // should be set by the event handler
            };

            $listRow.trigger(detailsEvent, eventData);
            if(!detailsEvent.isDefaultPrevented()) {
                $listContainer.show();

                var offset = eventData.scrollOffset;
                if(!isNaN(offset)) {
                    scrollToTop($listRow, offset);
                }

                if($listRow.data('expanded') == false) {
                    $listRow.find('.summaryLink').click();
                }
                else {
                    // Already expanded - click twice: once to collapse and again to reopen so marker popup will appear
                    $listRow.find('.summaryLink').click().click();
                }

                // displayedItemDetails Event
                detailsEvent = jQuery.Event('displayedItemDetails');
                $listRow.trigger(detailsEvent, eventData);
            }
        }    
        return foundItem;
    }
   }; // end methods

    function getWrappedSet(selector) {
        var $wrappedSet = null;

        if (selector != null) {
            if (typeof (selector.jquery) != 'undefined') {
                $wrappedSet = selector; // jQuery wrapped set
            }
            else {
                $wrappedSet = $(selector); // string or other selector expression
            }
        }

        if ($wrappedSet.length == 0) {
            $wrappedSet = null;
        }
        return $wrappedSet;
    }

   $.fn.smartWidget = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply(this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments );
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.smartWidget' );
    }    
  };

})(jQuery);

// Function: at_intervals 
// Author: Jacek Becela
// Website: http://github.com/ncr/at_intervals
// License: cc-by-sa
(function($) {
    if (typeof ($.fn.at_intervals) == "function") {
        return;
    }

    $.fn.at_intervals = function(fn, options) {
        var settings = $.extend({}, $.fn.at_intervals.defaults, options);

        return this.each(function() {
            var e = $(this)
            var name = settings.name
            var delay = settings.delay

            var helper = {
                should_stop: function() { // used to completely remove the interval
                    return !this.element_in_dom() || this.user_wants_to_stop()
                },
                should_work: function() { // used to pause/resume the interval
                    return this.element_visible() && !this.user_wants_to_pause()
                },
                user_wants_to_stop: function() {
                    return e.data(name).should_stop == true
                },
                user_wants_to_pause: function() {
                    return e.data(name).should_pause == true
                },
                element_in_dom: function() {
                    return e.parents("html").length > 0
                },
                element_visible: function() {
                    return e.parents("*").andSelf().not(":visible").length == 0
                },
                stop: function(interval_id) {
                    clearInterval(interval_id)
                    e.removeData(name)
                }
            }

            if (e.data(name)) {
                helper.stop(e.data(name).interval_id) // remove previous executer
            }

            e.data(name, {delay: delay}) // initialize data cache

            if (helper.should_work()) {
                fn() // call fn immediately (setInterval applies the delay before calling fn for the first time)
            }

            var interval_id = setInterval(function() {
                if (helper.should_stop()) {
                    helper.stop(interval_id)
                } else {
                    if (helper.should_work()) {
                        fn()
                    }
                }
            }, delay)

            e.data(name).interval_id = interval_id
        })
    };

    $.fn.at_intervals.defaults = {
        name: "at_intervals",
        delay: 1000 // one second
    }

})(jQuery);

var googlemap, bingmap, infowindow;
var panorama;
var directionsDisplay = null;
var directionsService = null;
var directionsMap = null;
//34.397, -83.644
var latMin = 34.397;//32.93685;
var lonMin = -83.644;//-83.2;
var latMax = 34.397; //32.93685;
var lonMax = -83.644;//-83.2;
var columns = 2;
function addhover(settings) {
    if (settings.showMenuIcon == true) {
        //detecting touchscreens
        if ('ontouchstart' in document.documentElement) {
            $('.menuIcon').show();
        } else {
            $('.widgets div')
            .on('mouseenter.smartWidget', function(e) {
                $('.menuIcon').show();
                //return false;
            })
            .on('mouseleave.smartWidget', function() {
                $('.menuIcon').hide();
                //return false;
            });
        }
    }
}

var $smartMap;

function downloadmaps() {

    if(typeof(google) != 'undefined' && typeof(google.maps) != 'undefined') { 
        setTimeout(function() {
        $.fn.initiatemaps();
        //writeConsole(googlemap);
        //googlemap.panBy(100,0);
        },300);
    }
}

var i = 0;
function loadGmapDirection(event, fromLat, fromLon)
{
    var directionsEvent = jQuery.Event('displayingDirections');
    var directionsEventData = null;

    if(event.target != '') {
        // event parameter is an event
        $(event.target).trigger(directionsEvent, directionsEventData);
    }
    else {
        // event parameter is an element
        $(event).trigger(directionsEvent, directionsEventData);
    }

    if(!directionsEvent.isDefaultPrevented()) {

       //console.log(event);
       //console.log($(event).data());
       //console.log($(event.target));
        //console.log($(event.target).data());
        console.log("loadGmapDirection()-- called" + ++i);

        // Initalize the directions service if not already initialized.
        // Note: The directions map container must be visible before the directions service is initialized,
        // otherwise the map won't display correctly.
        if(event.target != '') {
            // event parameter is an event
            $(event.target).trigger('initDirectionsService'); // an internal event.
        }
        else {
            // event parameter is an element
            $(event).trigger('initDirectionsService'); // an internal event.
        }

        calcRoute(fromLat, fromLon);

    } // end isDefaultPrevented
   
    function calcRoute(fromLat, fromLon) {
    
        var currentLocation = fromLat.toString() + ',' + fromLon.toString();
        //alert('current location: ' + currentLocation);
        var destinationString = '';
        if($(event.target).data() != null) {
            destinationString = $(event.target).data('location').lat + ',' + $(event.target).data('location').lang;
        }
        else {
            destinationString = $(event).data('location').lat + ',' + $(event).data('location').lang;
        }
        var request = {
            origin: currentLocation,
            destination: destinationString,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                //console.log(response);
                directionsDisplay.setDirections(response);
            }
        });
    }

    return false;
} // end loadGmapDirection

function showItemDetails(event, listContainerID, itemIndex) {
    var $listContainer = $('#' + listContainerID);
    var $listRow = $listContainer.find('.eventRow').eq(itemIndex);
    
    // displayingItemDetails Event
    var detailsEvent = jQuery.Event('displayingItemDetails');
    var eventData = {
        item: $listRow.data('item'),
        feed: $listRow.data('feed'),
        showHideAll: false,
        scrollOffset: null // should be set by the event handler
    };

    $listRow.trigger(detailsEvent, eventData);
    if(!detailsEvent.isDefaultPrevented()) {
        $listContainer.show();

        var offset = eventData.scrollOffset;
        if(!isNaN(offset)) {
            scrollToTop($listRow, offset);
        }

        if($listRow.data('expanded') == false) {
            $listRow.find('.summaryLink').click();
        }

        // displayedItemDetails Event
        detailsEvent = jQuery.Event('displayedItemDetails');
        $listRow.trigger(detailsEvent, eventData);
    }

    return false;
}

function getLocalhostFeedUrl(feedUrl, defaultDomain, params) {
   return getLocalhostUrl(feedUrl, defaultDomain, params, true);
}

function getLocalhostDetailsUrl(detailsUrl, defaultDomain, params) {
    return getLocalhostUrl(detailsUrl, defaultDomain, params, false);
}

function getLocalhostUrl(url, defaultDomain, params, useJsonp) {
    
    if (location.host != 'localhost' && location.host != 'messycoders.com') {
        return url;
    }

    if (defaultDomain == null) {
        defaultDomain = '';
    }

    if(url == null || url == '' || url.indexOf('/') != 0) {
       return url; // expecting relative url
    }

    if (!$.isEmptyObject(params) && typeof (params.localhost) != "undefined" && params.localhost == '1') {

        var tmpParams = $.extend({}, params);
        delete tmpParams.localhost;

        if (typeof (tmpParams.s) != "undefined") {
            var sArray = tmpParams.s.split('.');
            if (sArray.length == 4) {
                sArray[0] = '0'; // reset the itemid to 0 since it can be specified as part of the url
                tmpParams.s = sArray.join('.');
            }
        }

        if(!$.isEmptyObject(tmpParams)) {
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += $.param(tmpParams);
        }
    }
    else {
        url = defaultDomain + url;
        if(!$.isEmptyObject(params)) {
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += $.param(params);
        }
        if(useJsonp && url.indexOf('callback') < 0) {
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'callback=?'; // make jsonp request
        }
    }

    return url;
}


function buildLocalhostQueryString(params) {
    var currentParams = loadUrlValues(); 
    var tmpParams = $.extend({}, params);

    if (!$.isEmptyObject(currentParams) && typeof (currentParams.localhost) != "undefined" && currentParams.localhost == '1') {
        if (typeof (currentParams.s) != "undefined") {
            var sArray = currentParams.s.split('.');
            if (sArray.length == 4) {
                sArray[0] = '0'; // reset the itemid to 0 since it can be specified as part of the url
                tmpParams.s = sArray.join('.');
            }
        }

        if (typeof (currentParams.db) != "undefined") {
           tmpParams.db = currentParams.db;
        }

        tmpParams.localhost = currentParams.localhost;
    }

    var queryString = "?" + paramNoEncode(tmpParams);
    return queryString;
}

/*
 * Mobile Range Slider 
 * A Touch Slider for Webkit / Mobile Safari
 *
 * https://github.com/ubilabs/mobile-range-slider
 *
 * Full rewrite of https://github.com/alexgibson/WKSlider
 *
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License http://www.opensource.org/licenses/mit-license.php
 */

// function.bind() polyfill
// taken from: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
      fToBind = this, 
      fNOP = function() { },
      fBound = function() {
        return fToBind.apply(
          this instanceof fNOP ? this : oThis || window,
          aArgs.concat( Array.prototype.slice.call(arguments) )
        );
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


(function(undefined) {
  
  // mapping of event handlers
  var events = {
    start: ['touchstart', 'mousedown'],
    move: ['touchmove', 'mousemove'],
    end: ['touchend', 'touchcancel', 'mouseup']
  };

  // constructor
  function MobileRangeSlider(element, options) {

    this.element = element;
    
    this.options = {};
    
    options = options || {};
    
    var property;
    
    for (property in this.defaultOptions){
      if (options[property] !== undefined){
        // set options passed to constructor
        this.options[property] = options[property];
      } else {
        // set default options
        this.options[property] = this.defaultOptions[property];
      }
    }
 
    // detect support for Webkit CSS 3d transforms
    this.supportsWebkit3dTransform = (
      'WebKitCSSMatrix' in window && 
      'm11' in new WebKitCSSMatrix()
    );
    
    // store references to DOM elements
    if (typeof element === 'string'){
      this.element = document.getElementById(element);
    }
        
    this.knob = this.element.getElementsByClassName('knob')[0];
    this.track = this.element.getElementsByClassName('track')[0];
    
    // set context for event handlers
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    
    // set the inital value
    this.addEvents("start");
    this.setValue(this.options.value);
    
    // update postion on page resize
    window.addEventListener("resize", this.update.bind(this));
  }
  
  // default options
  MobileRangeSlider.prototype.defaultOptions = {
    value: 0, // initial value
    min: 0, // minimum value
    max: 100, // maximum value
    change: null // change callback
  };

  // add event handlers for a given name
  MobileRangeSlider.prototype.addEvents = function(name){
    var list = events[name], 
      handler = this[name],
      all;
    
    for (all in list){
      this.element.addEventListener(list[all], handler, false);
    }
  };
  
  // remove event handlers for a given name
  MobileRangeSlider.prototype.removeEvents = function(name){ 
    var list = events[name], 
      handler = this[name],
      all;
      
    for (all in list){
      this.element.removeEventListener(list[all], handler, false);
    }
  };
  
  // start to listen for move events
  MobileRangeSlider.prototype.start = function(event) {
    this.addEvents("move");
    this.addEvents("end");
    this.handle(event);
  };
  
  // handle move events
  MobileRangeSlider.prototype.move = function(event) {
    this.handle(event);
  }; 

  // stop listening for move events
  MobileRangeSlider.prototype.end = function() {
    this.removeEvents("move");
    this.removeEvents("end");
  };
  
  // update the knob position
  MobileRangeSlider.prototype.update = function() {
    this.setValue(this.value);
  };
  
  // set the new value of the slider
  MobileRangeSlider.prototype.setValue = function(value) {
    
    if (value === undefined){ value = this.options.min; }
    
    value = Math.min(value, this.options.max);
    value = Math.max(value, this.options.min);
    
    var 
      knobWidth = this.knob.offsetWidth,
      trackWidth = this.track.offsetWidth,
      range = this.options.max - this.options.min,
      width = trackWidth - knobWidth,
      position = Math.round((value - this.options.min) * width / range);
    
    this.setKnobPosition(position);
    
    this.value = value;
    this.callback(value);
  };
  
  MobileRangeSlider.prototype.setKnobPosition = function(x){
    // use Webkit CSS 3d transforms for hardware acceleration if available 
    if (this.supportsWebkit3dTransform) {
      this.knob.style.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
    } else {
      this.knob.style.webkitTransform = 
      this.knob.style.MozTransform = 
      this.knob.style.msTransform = 
      this.knob.style.OTransform = 
      this.knob.style.transform = 'translateX(' + x + 'px)';
    }
  };

  // handle a mouse event
  MobileRangeSlider.prototype.handle = function(event){
    event.preventDefault();
    if (event.targetTouches){ event = event.targetTouches[0]; }
  
    var position = event.pageX, 
      element,
      knobWidth = this.knob.offsetWidth,
      trackWidth = this.track.offsetWidth,
      width = trackWidth - knobWidth,
      range = this.options.max - this.options.min,
      value;
      
    for (element = this.element; element; element = element.offsetParent){
      position -= element.offsetLeft;
    }
    
    // keep knob in the bounds
    position += knobWidth / 2;
    position = Math.min(position, trackWidth);
    position = Math.max(position - knobWidth, 0);
  
    this.setKnobPosition(position);
  
    // update
    value = this.options.min + Math.round(position * range / width);
    this.setValue(value);
  };

  // call callback with new value
  MobileRangeSlider.prototype.callback = function(value) { 
    if (this.options.change){
      this.options.change(value);
    }
  };

  //public function
  window.MobileRangeSlider = MobileRangeSlider;
})();
/* End Mobile Range Slider */

/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));
/* End jQuery Cookie Plugin v1.4.0 */

// jquery.jsonp 2.4.0 (c)2012 Julian Aubourg | MIT License
// https://github.com/jaubourg/jquery-jsonp
(function(e){function t(){}function n(e){C=[e]}function r(e,t,n){return e&&e.apply&&e.apply(t.context||t,n)}function i(e){return/\?/.test(e)?"&":"?"}function O(c){function Y(e){z++||(W(),j&&(T[I]={s:[e]}),D&&(e=D.apply(c,[e])),r(O,c,[e,b,c]),r(_,c,[c,b]))}function Z(e){z++||(W(),j&&e!=w&&(T[I]=e),r(M,c,[c,e]),r(_,c,[c,e]))}c=e.extend({},k,c);var O=c.success,M=c.error,_=c.complete,D=c.dataFilter,P=c.callbackParameter,H=c.callback,B=c.cache,j=c.pageCache,F=c.charset,I=c.url,q=c.data,R=c.timeout,U,z=0,W=t,X,V,J,K,Q,G;return S&&S(function(e){e.done(O).fail(M),O=e.resolve,M=e.reject}).promise(c),c.abort=function(){!(z++)&&W()},r(c.beforeSend,c,[c])===!1||z?c:(I=I||u,q=q?typeof q=="string"?q:e.param(q,c.traditional):u,I+=q?i(I)+q:u,P&&(I+=i(I)+encodeURIComponent(P)+"=?"),!B&&!j&&(I+=i(I)+"_"+(new Date).getTime()+"="),I=I.replace(/=\?(&|$)/,"="+H+"$1"),j&&(U=T[I])?U.s?Y(U.s[0]):Z(U):(E[H]=n,K=e(y)[0],K.id=l+N++,F&&(K[o]=F),L&&L.version()<11.6?(Q=e(y)[0]).text="document.getElementById('"+K.id+"')."+p+"()":K[s]=s,A&&(K.htmlFor=K.id,K.event=h),K[d]=K[p]=K[v]=function(e){if(!K[m]||!/i/.test(K[m])){try{K[h]&&K[h]()}catch(t){}e=C,C=0,e?Y(e[0]):Z(a)}},K.src=I,W=function(e){G&&clearTimeout(G),K[v]=K[d]=K[p]=null,x[g](K),Q&&x[g](Q)},x[f](K,J=x.firstChild),Q&&x[f](Q,J),G=R>0&&setTimeout(function(){Z(w)},R)),c)}var s="async",o="charset",u="",a="error",f="insertBefore",l="_jqjsp",c="on",h=c+"click",p=c+a,d=c+"load",v=c+"readystatechange",m="readyState",g="removeChild",y="<script>",b="success",w="timeout",E=window,S=e.Deferred,x=e("head")[0]||document.documentElement,T={},N=0,C,k={callback:l,url:location.href},L=E.opera,A=!!e("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;O.setup=function(t){e.extend(k,t)},e.jsonp=O})(jQuery)
// end jquery.jsonp 2.4.0

/* map layout */
function closeInfobox(){
    if(typeof(pinInfobox) != 'undefined' && pinInfobox != null) {
        pinInfobox.setOptions({visible:false});
        //$(".infobox_wrapper").hide();
    }
}
function zoomInMap()
{
    
    if ($('.bingMapsHolder').is(":visible")) {
        globalBingMapZoomLevel = +bingmap.getZoom() + 1;
        //bingmap.setView({ zoom: globalBingMapZoomLevel});
        ++globalGmapMapZoomLevel;
        setCenterToMarkerBingMap(bingMapPointX);
    } else {
        if (panorama.getVisible()) {
            var panoramazoom = panorama.getZoom();
            if (typeof(panoramazoom) == 'undefined') {
                panoramazoom = 1;
            }
            panorama.setZoom(panoramazoom + 1);
            return;
        }
        globalGmapMapZoomLevel = googlemap.getZoom() + 1;
        googlemap.setZoom(globalGmapMapZoomLevel);
        console.log("gmap zoomed by " + globalGmapMapZoomLevel);
        setCenterToMarkerGoogleMap(googleMapPanbyX);
        ++globalBingMapZoomLevel;
    }
}
function zoomOutMap()
{
    
    if ($('.bingMapsHolder').is(":visible")) {
        globalBingMapZoomLevel = +bingmap.getZoom() - 1;
        bingmap.setView({ zoom: globalBingMapZoomLevel});
        setCenterToMarkerBingMap(bingMapPointX);
        --globalGmapMapZoomLevel;
    } else {
        if (panorama.getVisible()) {
            var panoramazoom = panorama.getZoom();
            if (typeof(panoramazoom) == 'undefined') {
                panoramazoom = 1;
            }
            panorama.setZoom(panoramazoom - 1);
            return;
        }
        globalGmapMapZoomLevel = googlemap.getZoom() - 1;
        googlemap.setZoom(globalGmapMapZoomLevel);
        console.log("gmap zoomed by " + globalGmapMapZoomLevel);
        setCenterToMarkerGoogleMap(googleMapPanbyX);
        --globalBingMapZoomLevel;
    }
}
function setCenterToMarkerGoogleMap(byx) {
    if (typeof activeLocationMarker.location != "undefined" && activeLocationMarker.location != null) {
        console.log("gmap centered to active location marker");
        googlemap.setCenter(activeLocationMarker.location);
    }/* else if(GmapPositionMarker != null) {
        googlemap.setCenter(GmapPositionMarker.getPosition())
    }*/ else if (flgGmapDragged) {
        console.log("gmap centered to dragged location");
        var googlemapCenter = googlemap.getCenter();
        defaultLocation.latitude = googlemapCenter.lat();
        defaultLocation.longitude = googlemapCenter.lng();
        //flgGmapDragged = false;
        googlemap.setCenter(googlemapCenter);
    } else {
        console.log("gmap centered to default location");
        googlemap.setCenter(new google.maps.LatLng(defaultLocation.latitude, defaultLocation.longitude));
    }
    
    //check if right column is visible or not
    if (!flgGmapDragged && $("#closeSmartSearch").is(":visible") || (!$(".mapLink").hasClass("active"))) {
        if ($(window).width() > 800) {
            console.log("gmap paned by " + byx)
            googlemap.panBy(byx,0);
        } else {
            console.log("gmap paned by " + (-byx));
            googlemap.panBy(-byx,0);
        }
    }
}
function setCenterToMarkerBingMap(byx) {
    var location1 = pinInfobox.getLocation();
    if (pinInfobox.getVisible() == true) {
        location1 = pinInfobox.getLocation();
        if (BingMapPositionPushpin !== null) {
            bingmap.entities.remove(BingMapPositionPushpin);
            BingMapPositionPushpin = null;
        }
    }/* else if (BingMapPositionPushpin !== null) {
        location1 = defaultLocation = BingMapPositionPushpin.getLocation();
    }*/ else {
        location1 = defaultLocation = bingmap.getCenter();
    }
    //var location2 = new Microsoft.Maps.Location(location1);
    var point2 = bingmap.tryLocationToPixel(location1);
    console.log("apply x : " + byx + " to "  + point2.x);
    if ($("#closeSmartSearch").is(":visible") || (!$(".mapLink").hasClass("active"))) {
        point2.x = point2.x + byx;
    } else {
        point2.x = point2.x + -byx;
    }
    console.log("point2.x is " + point2.x );
    location2 = bingmap.tryPixelToLocation(point2);
    bingmap.setView({center:location1, zoom: globalBingMapZoomLevel});
    /*
    setTimeout(function() {
        var bingcenter = bingmap.getCenter(),
            centerPixel = bingmap.tryLocationToPixel(bingcenter);
        centerPixel.x = centerPixel.x + 300;
        var centerLocation = bingmap.tryPixelToLocation(centerPixel);
        bingmap.setView({ center:centerLocation});
    }, 50);
    */
    
}
function gpsMap()
{
    console.log("gpsMAp");
    if ($('.bingMapsHolder').is(":visible")) {
        
        setBingMapPositionMarker($("#lat").val(), $("#lon").val(), true);
        
        
    } else {
        setGmapPositionMarker($("#lat").val(), $("#lon").val());
    }
}
/* end map layout */