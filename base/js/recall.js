var useGoogleMap = true; 
var smartlistscrolltop = 540;
function fixSmartTop() {

    return; // Later we might shrink the height of top nav when scrolling up.


    // Was 'overflow':'hidden'
    //$("#smartTop").css({"width":$('#mainColumn').width(), 'overflow':'visible', 'position':'fixed','top':'0px','border-radius':'0px'});

    // Adding 'left':'0px' causes wide-screen version to be at far left.
    //$("#smartTop").css({'width':$('#mainColumn').width(), 'position':'fixed', 'top':'0px', 'border-radius':'0px', 'z-index':'9999999'});
    $("#headerNav").css({'width':$('#mainColumn').width(), 'position':'fixed', 'top':'0px', 'border-radius':'0px', 'z-index':'9999999'});

    // position:fixed; z-index:9999999; top:0; left:0; right:0; border-radius:0px;    
    //console.log($("#smartTop"));
    //alert('done fixSmartTop');
}
function unfixSmartTop() {

    return; // Later we might shrink the height of top nav when scrolling up.

    //$("#smartTop").css({"margin-top":"0px","width":"100%","position":'relative','border-radius':'8px 8px 0px 0px'});
    $("#headerNav").css({"margin-top":"0px","width":"100%","position":'relative','border-radius':'8px 8px 0px 0px'});
}
function feedScroll(){
	var scrolledDistance = $(window).scrollTop();
	//var topScrollable = $("#scrolleranchor").offset({scroll:false}).top;
	//var topScrollable = $("#scrolleranchor").offset({"scroll":false}).top;


	//var topScrollable = $("#scrolleranchor").offset().top;
    var topScrollable = $("#headerNav").outerHeight();

    var headerNav=$("#headerNav");
    var smartGallery=$("#smartGallery");
    var smartSlideshow=$("#smartSlideshow");
	var smartMap=$("#smartMap");

    var bottomFixed = headerNav.outerHeight() + smartMap.outerHeight(); // Change to allow for fixed slideshow.


    // When top of map meets bottom of headerNav, afix map to top.
    if (smartMap.css('position') != 'fixed' && (smartMap.offset().top - scrolledDistance) <= (0 + headerNav.outerHeight())) {

        // Make header opaque so list slides behind.
        $("#headerNav").removeClass("headerNavTransparent");
        $("#headerNav").addClass("headerNavOpaque");

        //console.log("scrolledDistance: " + scrolledDistance + " > " + topScrollable);
        if ($(window).width() > 800) { // Fixed position map
            //alert('Fixed position map');
            // "margin-top":"10px",
            var display_results = $.cookie('display_results');
            if(typeof(display_results) != 'undefined' && display_results["selected"] == "below") {
                // Lock map as header
                smartMap.css({"width":"100%", "position":'fixed', "top":"80px","bottom":"380px","left":"0px","right":"0px","min-height":"300px"});
            
                // Set after map is resized
                bottomFixed = headerNav.outerHeight() + smartMap.outerHeight();

                //alert("headerNav.outerHeight() " + headerNav.outerHeight());
                //alert("smartMap.outerHeight() " + smartMap.outerHeight());
                //alert("Set scrolleranchor margin-top " + bottomFixed + "px");
                $("#scrolleranchor").css("margin-top", bottomFixed + "px");

            } else {
                // $('#mapColumn').width()
                smartMap.css({"width":"100%", "position":'fixed',"top":"80px","bottom":"0px","left":"0px","right":"0px"});
                
                // Start smartlist entry from bottom of map
                $("#listContainer").css("margin-top", smartlistscrolltop + "px");

                //$("#smartList").css("margin-top", headerNav.outerHeight() + "px");
            }
        }
	} else if (smartGallery.is(":visible") && smartMap.css('position') == 'fixed' && ($("#smartGallery").offset().top + $("#smartGallery").outerHeight() - scrolledDistance) > headerNav.outerHeight()) {
        // When bottom of gallery meets bottom of headerNav.
        smartMap.css({"position":'relative', "top":"0px", "min-height":"400px"});
        $("#scrolleranchor").css("margin-top", "0px");
    } else if (smartSlideshow.is(":visible") && smartMap.css('position') == 'fixed' && ($("#smartSlideshow").offset().top + $("#smartSlideshow").outerHeight() - scrolledDistance) > headerNav.outerHeight()) {
        // When bottom of slideshow meets bottom of headerNav.
        smartMap.css({"position":'relative', "top":"0px", "min-height":"400px"});
        $("#scrolleranchor").css("margin-top", "0px");
    } else {
	  if (scrolledDistance <= topScrollable) {

        /*
        alert("now");
        smartMap.css({"margin-top":"0px","width":"100%","position":'relative',"top":"80px","height":"400px"});
        if ($(window).width() > 800) {
            unfixSmartTop();
        }
        */

	  }
	}
}

$(window).load(function(){
	$(function() {
	  var a = function() {
		 if($(".closeList:visible").length >= 1) {
			feedScroll();
		 }
		
	  };
	  $(window).scroll(a);a()
	});
});

function getHomeHistoryFeed(params) {

    var feed = null;
    var headerText = 'Home Histories';

    var feedUrl = '/smart/api/itemfeed?dynamic=1';
    var feedType = 'homeHistory';
    var detailsUrl = '/info/{0}?mode=a';
    var detailsSelector = '#ItemInfoContentDiv';

    // create a copy of the params so it can be customized while leaving the params unchanged.
    var homeHistoryParams = $.extend({}, params);

     homeHistoryParams.show = 'images';
     if(typeof(homeHistoryParams.tid) != 'undefined') {
         delete homeHistoryParams.tid; // clear for now so that searches for buildings, mfg, etc. aren't included.
     }

    if (location.host == 'localhost' || location.host == 'big-data-labs.github.io') {
        feedUrl = getLocalhostFeedUrl(feedUrl, 'http://grantpark.org', homeHistoryParams);
        detailsUrl = getLocalhostDetailsUrl(detailsUrl, 'http://grantpark.org', homeHistoryParams);
    }
    else if ($.isEmptyObject(homeHistoryParams) == false) {
        feedUrl += feedUrl.indexOf('?') > 0 ? '&' : '?';
        feedUrl += $.param(homeHistoryParams);
    }

    feed = {
        url: feedUrl,
        type: feedType,
        provider: '',
        headerText: headerText,
        className: '',
        detailsUrl: detailsUrl,
        detailsSelector: detailsSelector
    };

    return feed;
}

function getStateParkFeed(params) {

    var feed = null;
    var headerText = 'State Parks';

    var feedUrl = '/smart/api/itemfeed?dynamic=1';
    var feedType = 'statePark';
    var detailsUrl = '/info/{0}?mode=a';
    var detailsSelector = '#ItemInfoContentDiv';

    // create a copy of the params so it can be customized while leaving the params unchanged.
    var stateParkParams = $.extend({}, params);

    //stateParkParams.show = 'images';
    stateParkParams.tid = 12620;
    console.log(location.host);
    if (location.host == 'localhost' || location.host == 'big-data-labs.github.io') {
        console.log(location.host);
        feedUrl = getLocalhostFeedUrl(feedUrl, 'http://gastateparks.org', stateParkParams);
        detailsUrl = getLocalhostDetailsUrl(detailsUrl, 'http://gastateparks.org', stateParkParams);
    }
    else if ($.isEmptyObject(stateParkParams) == false) {
        feedUrl += feedUrl.indexOf('?') > 0 ? '&' : '?';
        feedUrl += $.param(stateParkParams);
    }

    feed = {
        url: feedUrl,
        type: feedType,
        provider: '',
        headerText: headerText,
        className: '',
        detailsUrl: detailsUrl,
        detailsSelector: detailsSelector
    };
    console.log(feed);

    return feed;
}

function getAllForGoodFeed(params) {

    var feed = {
        url: '/smart/api/allforgood',
        type: 'good',
        provider: 'AllForGood',
        className: ''
    };

    var afgParams = {};

    if(typeof params.lat !== 'undefined' && typeof params.lon !== 'undefined' 
        && !isNaN(params.lat) && !isNaN(params.lon)) {
        afgParams.lat = params.lat;
        afgParams.lon = params.lon;
    }
    else if(typeof params.zip !== 'undefined' && params.zip !== null && params.zip.length === 5 && !isNaN(params.zip)) {
        afgParams.location = params.zip;
    }
    else if(typeof(params.county) != 'undefined') {
        afgParams.location = params.county + ',GA';
    }
    else if(typeof(params.city) != 'undefined') {
        afgParams.location = params.city + ',GA';
    }
    else {
        afgParams.location = 'GA';
    }

    if(typeof params.distance !== 'undefined' && params.distance !== null && !isNaN(params.distance)) {
        afgParams.distance = params.distance;
        if(afgParams.distance > 100) {
            afgParams.distance = 99;
        }
    }
    else if(afgParams.location != 'GA') {
        afgParams.distance = 10; // don't specify a distance for the entire state
    }

    if(typeof(params.keywords) != 'undefined' && params.keywords != '') {
        afgParams.search = params.keywords;
    }

    if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io' && typeof(params.localhost) != 'undefined' && params.localhost == '1') {
        if(typeof(params.s) != 'undefined') {
           afgParams.s = params.s;
        }
        if(typeof(params.db) != 'undefined') {
           afgParams.db = params.db;
        }

        afgParams.localhost = params.localhost;
    }

    if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io') {
        feed.url = getLocalhostFeedUrl(feed.url, 'http://review.grantpark.org', afgParams);
    }
    else if ($.isEmptyObject(afgParams) == false) {
        feed.url += feed.url.indexOf('?') > 0 ? '&' : '?';
        feed.url += $.param(afgParams);
    }

    return feed;
}
function getFacebookFeed(params) {
    var feed = null;

    if ($('#placesCB').prop('checked')) {

        // if lat not entered default to 33.735
        // if lon not entered default to -84.377
        // if not miles not entered default to 3000 meters else convert miles to meters
        var 
        // Default to Georgia Capital
            fblat = params.lat ? params.lat : '33.749',
            fblon = params.lon ? params.lon : '-84.387',
            fbdistance = params.distance ? +params.distance * 1609.344 : 3000, // if not miles not entered default to 3000 meters else convert miles to meters
            fql_place_page = '{"q1": "SELECT checkin_count, content_age, description, display_subtext, geometry, is_city, is_unclaimed, latitude, longitude, name, page_id, pic, pic_big, pic_crop, pic_large, pic_small, pic_square, search_type, type, distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\') FROM place WHERE distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\') < \'' + (fbdistance > 50000 ? 50000 : fbdistance) + '\' AND type=\'PLACE\' ORDER BY distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\')", "q2": "select page_id, location from page where page_id in (select page_id from #q1)"}';

        feedUrlPlaces = 'https://graph.facebook.com/fql?q=' + encodeURIComponent(fql_place_page) + '&format=json&suppress_http_code=1&access_token=117370968285365%7C5XkqBE8fUp29ZaTRAMTmAAfCFvk',
        console.log(feedUrlPlaces);
        //feedUrlPlaces = 'https://graph.facebook.com/fql?q=SELECT%20checkin_count%2C%20content_age%2C%20description%2C%20display_subtext%2C%20geometry%2C%20is_city%2C%20is_unclaimed%2C%20latitude%2C%20longitude%2C%20name%2C%20page_id%2C%20pic%2C%20pic_big%2C%20pic_crop%2C%20pic_large%2C%20pic_small%2C%20pic_square%2C%20search_type%2C%20type%2C%20distance(latitude%2C%20longitude%2C%20%22' + fblat + '%22%2C%20%22' + fblon + '%22)%0AFROM%20place%0AWHERE%20distance(latitude%2C%20longitude%2C%20%22' + fblat + '%22%2C%20%22' + fblon + '%22)%20%3C%3D%20%22' + (fbdistance > 50000 ? 50000 :  fbdistance )+ '%22%0AAND%20type%3D%22PLACE%22%0AORDER%20BY%20distance(latitude%2C%20longitude%2C%20%22' + fblat + '%22%2C%20%22' + fblon + '%22)&format=json&suppress_http_code=1&access_token=117370968285365%7C5XkqBE8fUp29ZaTRAMTmAAfCFvk',
        feedTypePlaces = 'places',
        //console.log(feedUrlPlaces);


        feed = {
            url: feedUrlPlaces,
            type: feedTypePlaces,
            provider: 'Facebook',
            className: '',
        };
    }

    return feed;
}

function getSearchConsumerProducts(params) {
    var feed = null;
    if ($('#consumerProductsCB').prop( "checked")) {
        feed = {
            url: 'http://georgiafacts.org/smart/api/factualcpg?db=mygeorgia&s=0.0.5.3013&searchvalue=Athenos',
            type: 'consumerproduct',
            provider: 'Consumerproduct',
            className: ''
        };
    }
    return feed;
}

function submitPage(pageLoadParams) {
    //console.log("received");
    //event.preventDefault(); comment bcz event is not defined

    var fieldValue = '';
    var index = 0;
    var params = null;
    
    $(".showOnLoad").show(); // Show map select
    $(".hideOnLoad").hide(); // Hide large image
    $("#mySearch").css({"background":"#fff"});

    // pageLoadParams: url params to use for the initial page load. If not defined,
    // pull from search fields and cookies
    if(typeof(pageLoadParams) == 'undefined') {

        params = loadUrlValues();

        // Clear any values from the querystring so that they aren't included in the updated search.
        for(var key in params) {
           if(key != 's' && key != 'db' && key != 'localhost') {
              delete params[key];
           }
        }
        var selectedSearchType = $("#locationDD").val();
        switch(selectedSearchType) {
            case 'zip':
                //if (distanceSearchType == 'zip') {
                    params.zip = $('#zip').val();
                    params.distance = $("#distance").val();
                //}
                break;

            case 'current':
            case 'custom':
                //if (distanceSearchType == 'latlon') {
                    //params.lat = Number($("#lat").val()).toFixed(3).toString();
                    //params.lon = Number($("#lon").val()).toFixed(3).toString();
                    if (selectedSearchType == 'custom') {
                        if ($.trim($("#lat").val()) == '' || $.trim($("#lon").val()) == '') {
                            $("#lat").val('34.397');
                            $("#lon").val('-83.644');
                        }
                    }
                    params.lat = $("#lat").val();
                    params.lon = $("#lon").val();
                    params.distance = $("#distance").val();
                //}
                break;

            case 'county':
                if ($("#county option:selected").length > 1) {
                    $("#county option:first").prop("selected", false);
                }
                fieldValue = $('#county').val(); // multi-select
                if (fieldValue != null) {
                    index = fieldValue.indexOf("0");
                    if (index >= 0) {
                        fieldValue.splice(index, 1); // remove the default value if selected
                    }
                    if (fieldValue.length > 0) {
                        params.countyid = fieldValue.join(',');
                    }
                    if(useCookies) {
                        var cokSearchParam = $.cookie('searchParams');
                        cokSearchParam.county = params.countyid;
                        $.cookie('searchParams', cokSearchParam);
                    }
                }
                break;

            case 'city':
                if ($("#city option:selected").length > 1) {
                    $("#city option:first").prop("selected", false);
                }
                fieldValue = $('#city').val(); // multi-select
                if (fieldValue != null) {
                    index = fieldValue.indexOf("");
                    if (index >= 0) {
                        fieldValue.splice(index, 1); // remove the default value if selected
                    }
                    if (fieldValue.length > 0) {
                        params.city = fieldValue.join(',');
                    }
                    if(useCookies) {
                        var cokSearchParam = $.cookie('searchParams');
                        cokSearchParam.city = params.city;
                        $.cookie('searchParams', cokSearchParam);
                    }
                }
                break;

            default:

        } // end locationSearchType switch

        params.tid = '';
        if ($('#consumerProductsCB').prop('checked')) {
            params.tid += '16469,';
        }
        if ($('#shovelReadyCB').prop('checked')) {
            params.tid += '16470,';
        }
        if ($('#buildingsCB').prop('checked')) {
            params.tid += '16400,';
        }
        if ($('#manufacturersCB').prop('checked')) {
            params.tid += '31030,';
        }
        if ($('#internationalCB').prop('checked')) {
            params.tid += '30080,';
        }

        if (params.tid.length > 0) {
            params.tid = params.tid.substr(0, params.tid.length - 1); // remove trailing comma
        }
        else if (!$('#placesCB').prop('checked') 
        && !$('#allforgoodCB').prop('checked')
        && !$('#homeHistoryCB').prop('checked')
        && !$('#stateParkCB').prop('checked')
        && !$('#consumerProductsCB').prop('checked')) { // Nothing checked
            // If images tab is active, search for Available Buildings
            if ($('.slideshowLink').hasClass("active")) {
                $('#buildingsCB').prop('checked', true);
                params.tid += "16400";
            } else {
                // Search for mfg companies.
                $('#manufacturersCB').prop('checked', true);
                $("#sectionManufacturers").show();
                params.tid = "31030";
            }
        }

        if(params.tid.length == 0) {
           delete params.tid;
        }

        if ($('#latLonOnlyCB').prop('checked')) {
            params.latlononly = '1';
        }

        if ($('#buildingsCB').prop('checked')) {
            fieldValue = $('#minsize').val();
            if (fieldValue != '') {
                params.minsize = fieldValue;
            }
            fieldValue = $('#maxsize').val();
            if (fieldValue != '') {
                params.maxsize = fieldValue;
            }
            fieldValue = $('#ceiling').val();
            if (fieldValue != '') {
                params.ceiling = fieldValue;
            }
        }
        
        if ($('#manufacturersCB').prop('checked') || $('#internationalCB').prop('checked')) {
            $('#sectionManufacturers input[type="checkbox"]:checked').each(function (index, item) {
                if (typeof (params.naics) == 'undefined') {
                    params.naics = '';
                }
                params.naics += $(this).val() + ',';
            });
            var naicsTBValues = $('#naicsTB').val().split(/[\s;,]/);
            if(naicsTBValues.length > 0) {
                $.each(naicsTBValues, function(index, naics) {
                    naics = naics.trim();
                    var pattern = /^[0-9]{1,6}$/;
                    if(naics.length > 0 && pattern.test(naics)) {
                        params.naics += naics + ',';
                    }
                });
            }
            if(typeof(params.naics) != 'undefined' && params.naics.length > 1) {
                params.naics = params.naics.substr(0, params.naics.length - 1); // remove trailing comma
            }

        }

        fieldValue = $('#keywordsTB').val();
        if (fieldValue == 'Search') {
            fieldValue = '';
        }
        if (fieldValue != '') {
            params.keywords = fieldValue;
        }

        var searchTitle = displayLocText();

        // create a copy of the params for the history so the history version can be customized while
        // leaving the params unchanged.
        var historyParams = $.extend({}, params);
        var go = '';
        if(typeof(historyParams.tid) != 'undefined' && historyParams.tid.indexOf(',') == -1) {
            switch(historyParams.tid) {
                case '16469':
                    go = 'products';
                    break;
                case '16470':
                    go = 'shovel-ready';
                    break;
                case '16400':
                    go = 'buildings';
                    break;
                case '31030':
                    go = 'manufacturers';
                    break;
                case '30080':
                    go = 'international';
                    break;
            }
            if(go.length > 0) {
                historyParams.go = go;
                delete historyParams.tid;
            }
        }
        if(go.length == 0) {
           var numChecked = 0;
           $('#allforgoodCB, #placesCB').each(function(index, element) {
              if($(element).prop('checked')) {
                 numChecked++;
              }
           });
           if(numChecked == 1) {
               if($('#allforgoodCB').prop('checked')) {
                  go = 'allforgood';
               }
               else if($('#placesCB').prop('checked')) {
                  go = 'places';
               }

               if(go.length > 0) {
                   historyParams.go = go;
               }
           }
        }

        var querystring = '';
        if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io') {
            queryString = buildLocalhostQueryString(historyParams);
        }
        else {
            queryString = "?" + paramNoEncode(historyParams);
        }
        ignoreHistoryStateChange = true;
        History.pushState(historyParams, searchTitle, queryString);
        ignoreHistoryStateChange = false;

    } // end if - pageLoadParams is undefined
    else {
       params = pageLoadParams; // url params from the initial page load
       displayLocText();
    }

    var feeds = [];
    var feed = null;

    var searchPlaces = $('#placesCB').prop( "checked");
    var searchAllForGood = $('#allforgoodCB').prop( "checked");
    var searchConsumerProducts = $('#consumerProductsCB').prop( "checked");
    var searchHomeHistory = $('#homeHistoryCB').prop( "checked");
    var searchStatePark = $('#stateParkCB').prop( "checked");

    if(!searchPlaces && !searchAllForGood && !searchConsumerProducts && !searchHomeHistory && !searchStatePark) {
        feed = getLocationAndBuildingFeed(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }

    if (searchPlaces) {
        feed = getFacebookFeed(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }
    
    if (searchAllForGood) {
        feed = getAllForGoodFeed(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }

    if (searchHomeHistory) {
        feed = getHomeHistoryFeed(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }

    if (searchStatePark) {
        feed = getStateParkFeed(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }
    
    if (searchConsumerProducts) {
        console.log('consumer products');
        feed = getSearchConsumerProducts(params);
        if (feed != null) {
            feeds.push(feed);
        }
    }
    

    $("#mySearch").hide();
    //$('#mainColumn').css('margin-top', '40px');
    $("#contentHolder").hide();
    $('#twoColumns').css('background', 'transparent');

    $("#searchTextHolder").show();
    checkedItems.length = 0;
    checkedItemIDs.length = 0;
    $('.pdfLink').hide().html('<div class="fa fa-file-pdf-o" style=""></div> PDF');
    loadWidget(feeds);
}

function loadWidget(feeds) {
    if (feeds == null || feeds.length == 0) {
        return;
    }

    var browserHeight = $(window).height();
    // Allows map to reach bottom of screen.
    $('#smartWidget').css('min-height',browserHeight - 90);
    $('.mapHeight').css('min-height',browserHeight); // Setting 100% here does not work.

    var hasImages = false;
    var locationFeedCount = 0;
    var locationID = 0;

    var lat = parseFloat($("#lat").val());
    var lon = parseFloat($("#lon").val());
    if (isNaN(lat) || isNaN(lon) || lat < 0 || lon > 0) {
        lat = 33.7490;  // default "206 Washington St Sw Atlanta, GA 30334, USA" location assumed
        lon = -84.3892;
    }
    
    var showPositionIconOnMapLoad = false;
    if(useCookies) {
        var searchParams = $.cookie('searchParams');
        showPositionIconOnMapLoad = ((searchParams["locationDD"] == "current" || searchParams["locationDD"] == "custom") ? true : false)
    }

    var viewOptions = {};
    var viewOptionsScope = $('#viewOptionsCtrl').scope();
    if(typeof(viewOptionsScope) != 'undefined') {
        $.each(viewOptionsScope.viewOptionsList, function(index, item) {
            viewOptions[item.id] = item.checked; // the id matches the smartwidget property name
        });
    }


    var options = {
        //showMenuIcon: false,
        showVerticalMenu: false,
        showListThumbnail: false,
        showListSummary: true,
        updateBrowserHash: true,
        bingMapPointX: 300,
        googleMapPanbyX: 250,
        latitude: lat != 0 ? lat : 34.397,
        longitude: lon != 0 ? lon : -83.644,
        useGoogleMap: useGoogleMap,
        showPositionIconOnMapLoad: showPositionIconOnMapLoad,
        showList: viewOptions.showList,
        showImages: viewOptions.showImages, // slideshow
        showMap: viewOptions.showMap,
        showGallery: viewOptions.showGallery,
        showCalendar: viewOptions.showCalendar,

        // Handle addedListItem event

        addingListItem: function (event, data) {
            //console.log(data);
            var leftBorderColor = '';
            var feedType = data.feed.type;
            var rowMappointImg = null;
            if (feedType == 'locations') {
                locationFeedCount++;
                locationID = data.item.id;
                rowMappointImg = "../img/icons/mappoint.png";
                var isManufacturer = false;
                var isInternational = false;
                if (data.item.categories != null) {
                    $.each(data.item.categories, function (index, category) {
                        switch (category.id) {
                            case 16470:
                                leftBorderColor = 'purple'; //  #9ccd51'; // Shovel Ready
                                break;
                            case 16400:
                                leftBorderColor = '#7cbd41'; // Buildings
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
                }
            }
            else if (feedType == 'places') {
                rowMappointImg = '../img/icons/blue-dot1.png';
                leftBorderColor = 'blue'; // Facebook
            }

            if (leftBorderColor != '') {
                data.html = $(data.html).first().css('border-left', '3px solid ' + leftBorderColor).end();
                /*
                if(data.item.venue.latitude != null && data.item.venue.longitude != null) {
                    data.html = $(data.html).prepend("<div style='float:left;margin-right:4px;padding: 0 4px 0 4px;' ><a class='gmapDirectionLink' data-location='{\"lat\" : \""+data.item.venue.latitude+"\", \"lang\":\""+data.item.venue.longitude+"\"}'><img src='"+rowMappointImg+"'/></a></div>");
                }
                data.html = $(data.html).prepend("<div style='background:"+leftBorderColor+";float:left;margin-right:4px;padding: 0 4px 0 4px;color:#fff;'>"+ ++data.index +"</div>");
                */
            }
        },


        // Handle addedListItem event
        addedListItem: function (event, data) {
            if (data.item.images != null) {
                hasImages = true;
            }
        },

        // Handle addedListItemDetail event
        addedListItemDetail: function (event, data) {
            if(userObj != null) {
                userObj.done(function (userState) {
                    loadUserAccess(userState); // util.js
                    var $eventTarget = $(event.target);

                    if(userState.userAccess >= 4) {
                        $('#manageSuite', $eventTarget).click( function (event) {
                            showManagmentSuite($eventTarget);
                            event.preventDefault();
                        });
                        $('#manageSuiteHide', $eventTarget).click( function (event) {
                            hideManagementSuite($eventTarget);
                            event.preventDefault();
                        });

                        $('#manageSuite', $eventTarget).hover( function () {
                            if( $('#manageSuite', $eventTarget).is(':visible') ) { // Because button hover fires twice.
                                showManagmentSuite($eventTarget);
                            }
                        }, function() { //the handlerOut
                            if( $('#manageSuite', $eventTarget).is(':visible') ) {
                                hideManagementSuite($eventTarget);
                            }
                        });
                        $('#managementSuite', $eventTarget).hover( function () {
                            // Already open.
                        }, function() { //the handlerOut
                            hideManagementSuite($eventTarget);
                        });

                    }
                });
            }
        },

        displayingItemDetails: function(event, data) {
            if(!data.showHideAll) { // indicates whether showing/hiding this row or all of them.
                var historyState = History.getState();
                if(typeof(historyState.data.id) == 'undefined' || 
                   (typeof(historyState.data.id) != 'undefined' && historyState.data.id != data.item.id)) {
                    /*
                        18 When clicking a "Details" link, have the triggered event append the id to the URL.  Use the format: ?id=[id] by using history.js. You'll need to append the id to the link.  You can see the id in the "Page" link.
                    */
                    var queryString = '';
                    //var params = {id: $link.data("id")};
                    var params = {id: data.item.id};
                    if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io') {
                        queryString = buildLocalhostQueryString(params);
                    }
                    else {
                        queryString = "?" + $.param(params);
                    }
                    ignoreHistoryStateChange = true;
                    History.pushState({id: data.item.id}, data.item.title, queryString);
                    ignoreHistoryStateChange = false;
                }
                //console.log(data);
                $("meta[property='og:title']").attr("content", data.item.title);
                $("meta[property='og:url']").attr("content", window.location.href);
                
                if (data.item.images != null) {
                    $("meta[property='og:image']").attr("content", data.item.images[0]["large"]);
                }

                // Project 7.13 When "Details" is clicked, hide the other listing rows and show only the current row.
                                
                $(".eventRow").hide();
                $(".listHeader, #searchTextHolder").hide();
                if(locationFeedCount > 1) {
                    $(".showAllResults").show();
                }
                $(event.target).closest(".eventRow").show();

                data.scrollOffset = $("#smartTop").css('position') == 'fixed' ? 104 : 194;
            }
        },

        displayingAllResults: function(event, data) {
            $('#searchTextHolder').show();
        },

        displayingDirections: function(event, data) {
            $(".infoDisplay").hide();
            $("#settingControls").hide();
            $("#smartDirections").show();

            if ($(window).width() <= 800) {
                //$("#smartMap").hide();
            }

            $("#smartDirectionsMap").show();
            $("#smartDirectionsDisplay").show();
            $("#widgetTabs").find('li').removeClass("active");
            $(".directionsLink").addClass("active").show();

            scrollToTop($('#mainColumn'), offsetTop);
            $("#smartSlideshow").hide();
        },

        displayedDirections: function(event, data) {
            var miles = data.totalDistance * 0.621371192;
            miles = miles.toFixed(1);
            $('#total').html(miles.toString() + ' miles');
        }, 

        listItemChecked: function(event, data) {
           // alert('index: ' + data.item.index + ' checked: ' + data.checked);
           var checkedItemIndex = checkedItemIDs.indexOf(data.item.id);
           if(checkedItemIndex >= 0 && data.checked == false) {
              checkedItemIDs.splice(checkedItemIndex, 1); // remove from the array
              checkedItems.splice(checkedItemIndex, 1); // remove from the array
           }
           else if(checkedItemIndex < 0 && data.checked == true) {
              checkedItemIDs.push(data.item.id); // add to the array
              checkedItems.push(data.item); // add to the array
           }

           if(checkedItems.length > 0) {
                $('.pdfLink').html('Download PDF').css('background-color', 'green');
           }
           else {
                $('.pdfLink').html('PDF').css('background-color', '');
           }
        },

        beginLoadingFeeds: function (event, data) {
            //$('#overlay').show().css('height', $('document').height()).html("Loading Items...<br><br><br><img src='../img/icons/loading.gif' alt='' style='border:1px solid #fff; padding:4px' />"); // http://preloaders.net/
            /*
            $.mobile.loading( 'show', {
              text: "Loading Items...",
              textVisible: true,
              theme: "b",
            });
            */
            
        },
        loadedFeed: function (event, data) {
            var feed = data.feed;
            if (feed.headerText != '') {
                //$('#overlay').html("Loading " + feed.headerText + "...");
                //$.mobile.loading({ text: "Loading " + feed.headerText + "..." });
            }
            else {
                if (feed.type == 'locations') {
                    //$('#overlay').html("Loading Locations...");
                    //$.mobile.loading({ text: "Loading Locations..." });
                    $('.pdfLink').show();
                } else if (feed.type == 'events') {
                    //$('#overlay').html("Loading Events...");
                    //$.mobile.loading({ text: "Loading Events..." });
                } else if (feed.type == 'organizations') {
                    //$('#overlay').html("Loading Organizations...");
                    //$.mobile.loading({ text: "Loading Organizations..." });
                } else if (feed.type == 'places') {
                    //$('#overlay').html("Loading Places...");
                    //$.mobile.loading({ text: "Loading Places..." });
                }
                else {
                    //$('#overlay').html("Loading Items...");
                    //$.mobile.loading({ text: "Loading Items..." });
                }
            }

            if (feed.type == 'locations') {
                $('.pdfLink').show();
            }
        },
        endLoadingFeeds: function (event, data) {
            //$('#overlay').hide();
            //$.mobile.loading( "hide" );
            $('.slideshowLink').toggle(hasImages);
            if (hasImages) {
                $("#widgetTabs li").removeClass("active");
                $("li.slideshowLink").addClass("active");
                if ($(window).width() <= 800) { // Always show on mobile
                    //$slideshowContainer.find('.prev').show();
                    //$slideshowContainer.find('.next').show();
                    $('#slideshowContainer .prev').show();
                    $('#slideshowContainer .next').show();
                }
            } else {
                //$("li.mapLink").addClass("active"); // Caused 2 tabs to appear, Details is also active.
            }
            setTimeout(function() {
                /*
                if (ClickDetailsLink) {
                    console.log($(".detailsLink[data-id='"+ClickDetailsLink+"']").html());
                    $(".detailsLink[data-id='"+ClickDetailsLink+"']").click();
                }
                */
                // Give the maps time to load before displaying the details.
                if(feeds.length == 1 && locationFeedCount == 1 && locationID > 0) {
                     $('#smartWidget').smartWidget('detail', locationID, 'locations');
                }

            }, 1000);
            
            //angular.bootstrap(document.getElementById("smartCalendar"), ['calendarApp']);
        }
    };

    options.feeds = feeds;

    widget = $('#smartWidget').smartWidget(options);

    /*
    8. If the feed takes more than 10 seconds to load, append "Initiating App." below the "Loading Data Feed..." text.  If another 10 seconds passes, append "Almost Done." on the same line.  If an additional 15 seconds passes, display "Sorry for the delay. Requesting feed again."  Wait 2 seconds then reinitiate that feed.
    */
    setTimeout(function () {
        if (flgFeedLoaded == false) {
            //$("#overlay").append('<br/>Initiating App. ');
            //$.mobile.loading({ text: "Initiating App. " });
        }
    }, 11000);

    setTimeout(function () {
        if (flgFeedLoaded == false) {
            //$("#overlay").append('Almost Done. ');
            //$.mobile.loading({ text: "Almost Done. '" });
        }
    }, 21000);

    setTimeout(function () {
        if (flgFeedLoaded == false) {
            //$("#overlay").html('Sorry for the delay. Requesting feed again. ');
            //$.mobile.loading({ text: "Sorry for the delay. Requesting feed again.  "});
        }

        setTimeout(function () {
            if (flgFeedLoaded == false) {
                //$("#overlay").html('Loading Data Feed...');
                //$.mobile.loading({ text: "Loading Data Feed..." });
                submitPage();
            }
        }, 2000);
    }, 36000);
}


// KickStarter slider setting style dropdown code;
function setMapPosition(display_results)
{
    console.log(display_results);
    $.cookie('display_results', display_results);
    if (display_results["selected"] == "below") {
        //alert("below");
        console.log(display_results["selected"]);
        
        //$("#mapColumn").addClass("below_mapColumn");
        //$("#smartMap").addClass("smartMapAboveList");
        $(".resultsBackground").removeClass("besideMap");
        $(".basicSearch").removeClass("besideMapLeft");
        //$("#mainColumn").addClass("below_mainColumn");
        //$("#widgetTabs li span").addClass("below_widgetTabs_li_span"); // No effect, attempt to move tab logo beside text.
    } else {
        //alert("beside");
        $("#smartMap").removeClass("smartMapAboveList");
        
        $("#smartList").addClass("besideMap");
        $(".resultsBackground").addClass("besideMap");
        $("#mySearch").addClass("besideMapLeft");
        //$("#mapColumn").removeClass("below_mapColumn");
        //$("#smartMap").removeClass("smartMapAboveList");
        //$("#mainColumn").removeClass("below_mainColumn");
        //$("#widgetTabs li span").removeClass("below_widgetTabs_li_span"); // No effect, attempt to move tab logo beside text.
    }
}
// Global variables
var sliderValues;
// var defaultSliderValues = { 'adminLevel': 0, 'distanceLevel': 0, 'verboseLevel': 0, 'place': 'off' };
var defaultSliderValues = { 'adminLevel': 0, 'distanceLevel': 0, 'place': 'off' };
var userObj = null;
var historyHash = null, flgLoadAboutData = true, ClickDetailsLink = false;
var ignoreHistoryStateChange = false;
var chkGeoPosition = true;


var searchParams;
var defaultSearchParams = { 'useCurrent': null, 'locationDD': 'all' };
var defaultViewOptions = { 'showImages': true, 'showMap': true, 'showList': true, 'showGallery': false, 'showCalendar': false };
var offsetTop = 90;
var useCookies = true;

// Functions
function activateMyLocation() {
    $('#latLonFields').show();
    getLatLonFromBrowser();
}
function geoSelected() {
    $('#distanceField').insertAfter($('#distanceInNear'));
}
function activateOtherLocation() {
    $('#latLonFields').show();
    
    //$('#currentLoc .active').removeClass("active");
    //$('#useCustomLatLon').addClass("active");
}
function zipSelected() {
    $('#distanceField').insertAfter($('#distanceInZip'));
}
function activateEntireState() {
    $('#latLonFields').hide();
    //$('#currentLoc .active').removeClass("active");
    //$('#entireState').addClass("active");
}


$(function () {    // document.ready event handler

$.when(
    $.get("../location/select.html", function(data) {
        $("#locationSectionBox").html(data);
    }),
    $.get("../state/filter.html", function(data) {
        $("#filterSection").html(data);
    })
    
).done(function() {

// Variables
var urlValues = loadUrlValues();
var urlValue;
var distanceSearchType = '';

var previousWidth = 1000;
var $smartList = $('#smartList');
// End Variables

//$("#mainColumn").draggable({handle: "#mySearchHandle", refreshPositions: false, delay: 0});

function closeMenu() {
    $('#menuHolder').hide();
    $('.menuLink').css('color', '#fff');
    $('.menuLink').css('background', 'transparent');
    $('#widgetTabsHolder').insertAfter($('#widgetTabsPosition'));
    $('body').css('margin-top', '90px');
}
function restoreIcons() {
    $('#showWidgetTabs').hide();
    $('#rightCornerIcons').appendTo($('#rightIconsPosition'));
    if ($(window).width() > 800) {
        $('#closeSmartSearch').show();
    }
    $("#smallIconLI").hide();
    $(".siteTabs ul li").css({ "width": "20%" });
    $('#widgetTabsHolder').insertAfter($('#mySearchTop'));
    //$('body').css('margin-top', '58px');
    scrollToTop($('#mainColumn'), offsetTop);
    $("#mainColumn").show();
}

function showAbout() {
    $('#contentHolder').show();
    $('#contentHolder').load('about.html', function () { 
        if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io' || location.host.indexOf('review.') >= 0) {
            $("#shovelReadyLink").show();
        }
    });
}
function showGeorgiaMenu(urlValues) {
    if ((location.host.toLowerCase().indexOf("georgia") >= 0 || 
            (typeof(urlValues.localhost) != "undefined" && urlValues.localhost == '1'))
        && $(window).width() > 800) {
        $('#wrapHolder').load('wrap.html', function () {
            userObj = new userInfo();
            userObj.done(function (userState) {
                loadUserAccess(userState); // util.js
                if (userState.userAccess == 9) {
                    //Show based on access level
                    
                }
            });
        });
        $('#headerHolder').load('../../facts/assets/header.htm', function () { });
        $('#georgiaMenu').show();
        //$('#georgiaMenu').load('../../facts/assets/menu.htm', function () { });
    }
}

function hideMain() {
    // Retains map for background
    $("#settingsHolder").hide();
    $(".infoDisplay").hide();
    $("#mySearch").hide();
    $("#contentHolder").hide();
    $("#smartList").hide();
    $("#smartSlideshow").hide();
    //$("#smartGallery").hide();
    $("#smartDirections").hide();
}
function hideOthers() {
    $("#smartDirections").hide();
    $(".infoDisplay").hide();
    $("#settingsHolder").hide();
    $("#searchTextHolder").hide();
    $("#smartSlideshow").hide();
    //$("#smartGallery").hide();
    if ($(window).width() <= 800) {
        //alert("hideOthers");
        $("#mySearch").hide();
        $("#contentHolder").hide();
        //$("#smartMap").hide();
    }
}

function updateLayout() {
    var browserWidth = $(window).width();
    if (browserWidth <= 800 && previousWidth > 800) {
        fixSmartTop();
        $("#smartTop").css({ 'width': '100%' });
        $('#smartMap').insertAfter($('#mapInMain'));
        $('#mapColumn').hide();
        $('#mapColumn').css('min-height','0px');
        // Force size since not visible - no effect here
        $('#smartMap').css('min-width',browserWidth,'min-height',$(window).height());

        $('#closeSmartSearch').hide(); /* since shown using script */
        $('#mainColumn').show();
        if (!$('.mapLink').hasClass("active")) {
            // Neither
            //$(".smartMap").hide();
            //$("#smartMap").hide();
        }
        //$('.desktopText').html("Desktop Version");
    } else if (browserWidth > 800 && previousWidth <= 800) {
        //$('.desktopText').html("More Options");
        //$("body").css({'margin-top':'0px'});
        $("#smartMap").show();
        $('#mapColumn').show();
        $('#smartMap').insertAfter($('#scrolleranchor'));
        feedScroll(); // Also checks up-down position.
    }
    previousWidth = $(window).width();

    // Limit to when height changes.
    // Prevents white gap under map
    //$('.mapHeight').css('min-height',browserHeight-90);
}

function loadSearchFields(urlValues) {
    var searchShovelReady = false
        , searchBuildings = false
        , searchInternational = false
        , searchManufacturers = false
        , searchPlaces = false
        , searchAllForGood = false
        , searchHomeHistory = false
        , searchStatePark = false
        , searchConsumerProducts = false
        , lat = 0
        , lon = 0
        , $checkbox = null
        , loadedField = false;

    // Disable loading and saving of cookies so cookie values won't be used together with url values.
    // The combination of the two could prevent rows from being returned. This also protects the
    // cookie values from being overwritten by the url values.
    useCookies = false;

    var typeIDs = [];
    if (typeof(urlValues.tid) != 'undefined' && urlValues.tid.length > 0) {
        typeIDs = urlValues.tid.split(',');
        for (var index in typeIDs) {
            if (typeIDs[index] == '16470') {
                searchShovelReady = true;
                loadedField = true;
            }
            else if (typeIDs[index] == '16400') {
                searchBuildings = true;
                loadedField = true;
            }
            else if (typeIDs[index] == '31030') {
                searchManufacturers = true;
                loadedField = true;
            }
            else if (typeIDs[index] == '30080') {
                searchInternational = true;
                loadedField = true;
            }
        }
    }

    if (typeof(urlValues.naics) != 'undefined' && urlValues.naics.length > 0) {
        var urlNaicsArray = urlValues.naics.split(/[\s;,]/);
        var naicsTBValue = '';
        $('#sectionManufacturers input[type="checkbox"]').each(function(index, element) {
            var $checkbox = $(element);
            var checkboxNaicsArray = $checkbox.val().split(','); // checkbox values could be a comma separated list of naics codes
            var naicsIndex = -1;
            $.each(checkboxNaicsArray, function(j, naics) {
               // see if the naics code in the url matches the checkbox values. If so, then check the checkbox.
               naicsIndex = $.inArray(naics, urlNaicsArray);
               if(naicsIndex >= 0) {
                   if($checkbox.prop('checked') == false) {
                       $checkbox.prop('checked', true);
                       loadedField = true;
                   }
                   urlNaicsArray.splice(naicsIndex, 1); // remove from url array
               }
            });
        });

        // if anything is left in the url array, add it to the naics textbox
        if(urlNaicsArray.length > 0) {
            $.each(urlNaicsArray, function(index, naics) {
                var pattern = /^[0-9]{1,6}$/;
                if(naics.length > 0 && pattern.test(naics)) {
                    naicsTBValue += naics + ', ';
                }
            });

            if(naicsTBValue.length > 0) {
                 naicsTBValue = naicsTBValue.trim().substr(0, naicsTBValue.length - 1); // remove trailing comma
                $('#naicsTB').val(naicsTBValue);
                loadedField = true;
            }
        }
    }

    if (typeof (urlValues.keywords) != 'undefined' && urlValues.keywords.length > 0) {
       urlValue = urlValues.keywords;
       $('#keywordsTB').val(urlValue);
       loadedField = true;
    }

    if (typeof (urlValues.minsize) != 'undefined' && urlValues.minsize.length > 0) {
        urlValue = parseInt(urlValues.minsize, 10);
        if (urlValue >= 0) {
            $('#minsize').val(urlValue);
            searchBuildings = true;
            loadedField = true;
        }
    }
    if (typeof (urlValues.maxsize) != 'undefined' && urlValues.maxsize.length > 0) {
        urlValue = parseInt(urlValues.maxsize, 10);
        if (urlValue >= 0) {
            $('#maxsize').val(urlValue);
            searchBuildings = true;
            loadedField = true;
        }
    }
    if (typeof (urlValues.ceiling) != 'undefined' && urlValues.ceiling.length > 0) {
        urlValue = parseInt(urlValues.ceiling, 10);
        if (urlValue >= 0) {
            $('#ceiling').val(urlValue);
            searchBuildings = true;
            loadedField = true;
        }
    }

    if (typeof (urlValues.countyid) != 'undefined' && urlValues.countyid.length > 0) {
        urlValue = urlValues.countyid.split(','); // multi-select
        for (var i in urlValue) {
            urlValue[i] = urlValue[i].trim();
        }
        $('#county').val(urlValue);
        loadedField = true;
        $(".filterUL li[data-id='county']").trigger("click");
    }

    if (typeof (urlValues.city) != 'undefined' && urlValues.city.length > 0) {
        urlValue = urlValues.city.split(','); // multi-select
        for (var i in urlValue) {
            urlValue[i] = urlValue[i].trim();
        }
        $('#city').val(urlValue);
        loadedField = true;
        $(".filterUL li[data-id='city']").trigger("click");
    }

    if (typeof (urlValues.zip) != 'undefined' && urlValues.zip.length > 0) {
        urlValue = parseInt(urlValues.zip, 10);
        if (urlValue >= 0) {
            $('#zip').val(urlValue);
            loadedField = true;
            $(".filterUL li[data-id='zip']").trigger("click");
        }
    }

    if (typeof (urlValues.distance) != 'undefined' && urlValues.distance.length > 0) {
        urlValue = parseInt(urlValues.distance, 10);
        if (urlValue >= 0) {
            $('#distance').val(urlValue);
            loadedField = true;
        }
    }

    if (typeof (urlValues.lat) != 'undefined' && urlValues.lat.length > 0 
        && typeof (urlValues.lon) != 'undefined' && urlValues.lon > 0) {
        lat = parseFloat(urlValues.lat);
        lon = parseFloat(urlValues.lon);
        if (!isNAN(lat) && !isNAN(lon)) {
            $('#lat').val(lat);
            $('#lon').val(lon);
            loadedField = true;
            $(".filterUL li[data-id='custom']").trigger("click");
        }
    }

   if (typeof (urlValues.latlononly) != 'undefined' && urlValues.latlononly.length > 0) {
        urlValue = urlValues.latlononly;
        $checkbox = $('#latLonOnlyCB');
        loadedField = true;
        // Using click() doesn't work due to ionic trapping the event, so trigger the handler itself.
        // See the comments below for more info.
        $checkbox.prop('checked', (urlValue == '1')).triggerHandler('click');
    }
    if(typeof(urlValues.go) != 'undefined' && urlValues.go.length > 0) {
       var go = urlValues.go.toLowerCase();
       if(go == 'all') {
            searchBuildings = true;
            searchManufacturers = true;
            searchInternational = true;
            loadedField = true;
       }
       if(go == 'shovel-ready') {
            searchShovelReady = true;
            if($.inArray('16470', typeIDs) < 0) {
                typeIDs.push('16470');
            }
            loadedField = true;
       }
       if(go == 'buildings') {
            searchBuildings = true;
            if($.inArray('16400', typeIDs) < 0) {
                typeIDs.push('16400');
            }
            loadedField = true;
       }
       if(go == 'manufacturers') {
            searchManufacturers = true;
            if($.inArray('31030', typeIDs) < 0) {
                typeIDs.push('31030');
            }
            loadedField = true;
       }
       if(go == 'international') {
            searchInternational = true;
            if($.inArray('30080', typeIDs) < 0) {
                typeIDs.push('30080');
            }
            loadedField = true;
       }
       if(go == 'places') {
            searchPlaces = true;
            loadedField = true;
       }
       if(go == 'allforgood') {
            searchAllForGood = true;
            loadedField = true;
       }
       if(go == 'historic') {
            searchHomeHistory = true;
            loadedField = true;
       }
       if(go == 'parks') {
            searchStatePark = true;
            loadedField = true;
       }
       if(go == 'local') {
            searchConsumerProducts = true;
            loadedField = true;
       }

       delete urlValues.go; // no need to pass this on to the feed since it doesn't use it.
    }

    // Set or update the typeids. Note that this does NOT update the actual url but just updates the
    // urlValues object. This object should then be passed to submitPage to load the feeds.
    urlValues.tid = typeIDs.join(',');

    if(loadedField
        && urlValues.tid.length == 0
        && !searchPlaces
        && !searchAllForGood
        && !searchConsumerProducts
        && !searchHomeHistory
        && !searchStatePark) {
       searchManufacturers = true;
       urlValues.tid = '31030';  // Set a default typeid if nothing is set.
    }

    if (typeof (urlValues.id) != 'undefined' && urlValues.id.length > 0) {
        loadedField = true; // no actual field load but submit the page to fetch the item with this id.
    }

    // Only trigger the handlers if we loaded something from the url. If not, then use the cookie values
    if(loadedField) {
        // Using click() doesn't work since the ionic framework traps the event.
        // So, call the event handler directly using triggerHandler().
        // If adding additional click handlers, be sure to add them to the elements directly rather than
        // using delegated events. The handler won't be called if using delegated events since ionic prevents propagation.
        // Do this:
        // $("#manufacturersCB, #internationalCB").click(function () {
        // Not this:
        //$(document).on("click", "#manufacturersCB, #internationalCB", function () {
        $checkbox = $('#shovelReadyCB');
        $checkbox.prop('checked', searchShovelReady).triggerHandler('click');

        $checkbox = $('#buildingsCB');
        $checkbox.prop('checked', searchBuildings).triggerHandler('click');

        $checkbox = $('#internationalCB');
        $checkbox.prop('checked', searchInternational).triggerHandler('click');

        $checkbox = $('#manufacturersCB');
        $checkbox.prop('checked', searchManufacturers).triggerHandler('click');

        $checkbox = $('#consumerProductsCB');
        $checkbox.prop('checked', searchConsumerProducts).triggerHandler('click');
    
        $('#fbSettings .slider-button').toggleClass('on', !searchPlaces).html(searchPlaces ? 'OFF' : 'ON'); // Toggle slider to opposite state
        $('#fbSettings .slider-frame').trigger("click"); // Toggle it back on or off to fire related event handlers
    
        $('#allforgoodSettings .slider-button').toggleClass('on', !searchAllForGood).html(searchAllForGood ? 'OFF' : 'ON'); // Toggle slider to opposite state
        $('#allforgoodSettings .slider-frame').trigger("click"); // Toggle it back on or off to fire related event handlers

        $('#homeHistorySettings .slider-button').toggleClass('on', !searchHomeHistory).html(searchHomeHistory ? 'OFF' : 'ON'); // Toggle slider to opposite state
        $('#homeHistorySettings .slider-frame').trigger("click"); // Toggle it back on or off to fire related event handlers

        $('#stateParkSettings .slider-button').toggleClass('on', !searchStatePark).html(searchStatePark ? 'OFF' : 'ON'); // Toggle slider to opposite state
        $('#stateParkSettings .slider-frame').trigger("click"); // Toggle it back on or off to fire related event handlers
    }

    useCookies = true; // Enable loading and saving of cookies

    return loadedField;

} // End loadSearchFields

function buildPDF(items) {

   var sortedItems =  [];

   for(var i = 0; i < items.length; i++) {
      sortedItems.push(items[i]);
   }

   sortedItems.sort(function(item1, item2) {
      return (item1.index > item2.index); // sort based on the index in the item array.
   });

   // Use point "pt" when specifying coordinates.
   var pdfDoc = new jsPDF("portrait", "pt", "a4");
   
   // starting values for each page (unit is point).
   var leftMargin = 60;
   var topMargin = 45;
   var bottomMargin = 12;

   var settings = {
       xPos: leftMargin,
       yPos: topMargin,
       linespace: 12
   };

   var maxPointSize = 840; // based on "a4" page format
   var pointSizeTotal = topMargin + bottomMargin; // top and bottom margin - vertical point size used to determine when to create a new page
   var itemIndex = 0; // page-specific index, reset to 0 for each page.

   $.each(sortedItems, function(index, item) {

        if(itemIndex > 0) {
            settings.yPos += settings.linespace * 2; // add extra spacing between each item
            pointSizeTotal += settings.linespace * 2;
        }
        
        // See if this item will fit on the current page
        pointSizeTotal += buildPDFItem(pdfDoc, item, settings, false);

        if(pointSizeTotal > maxPointSize) {
            // Not enough room, need to put it on the next page
            pdfDoc.addPage();
            settings.xPos = leftMargin;
            settings.yPos = topMargin;
            pointSizeTotal = topMargin + bottomMargin;
            itemIndex = 0;
        }

        // render the item to the pdf doc
        buildPDFItem(pdfDoc, item, settings, true);
        itemIndex++;
   });

   pdfDoc.save('smart.pdf');
}

function buildPDFItem(pdfDoc, item, settings, outputToPDF) {
    var i = 0;
    var textArray = [];
    var pointSizeTotal = 0;
    var currentFontSize = 0;
    
    // create local variables of the setting object for easier use.
    var xPos = settings.xPos;
    var yPos = settings.yPos;
    var linespace = settings.linespace;

    pdfDoc.setFontSize(14);
    currentFontSize = 14;

    if(outputToPDF) {
        pdfDoc.text(xPos, yPos, item.title);
    }
    pointSizeTotal += currentFontSize;

    yPos += Math.ceil(linespace / 2);
    pointSizeTotal += Math.ceil(linespace / 2);

    pdfDoc.setFontSize(10);
    currentFontSize = 10;

    if (item.venue != null) {

        if(item.venue.street != null && item.venue.street != '' && item.title.indexOf(item.venue.street) < 0) {
            // Google Places used formatted_address for all fields - allows for differing international syntax
                if(outputToPDF) {
                    pdfDoc.text(xPos, yPos += linespace, item.venue.street);
                }
                pointSizeTotal += linespace;
        }
        if(item.venue.city != null && item.venue.city != '' && item.venue.state != null && item.venue.state != '') {
            if(textArray.length > 0) {
                textArray[i++] = ', ';
            }
            textArray[i++] = item.venue.city + ', ' + item.venue.state; 
        }

        if (item.venue.zip != null && item.venue.zip != '') {
            textArray[i++] = ' ' + item.venue.zip.substr(0, 5);
        }

        if(item.venue.county != null && item.venue.county != '') {
            if(textArray.length > 0) {
                textArray[i++] = ', ';
            }
            textArray[i++] = item.venue.county + ' County';
        }

        if(item.venue.country != null && item.venue.country != '') {
            if(textArray.length > 0) {
                textArray[i++] = ', ';
            }
            textArray[i++] = item.venue.country;
        }

        if(outputToPDF) {
            pdfDoc.text(xPos, yPos += linespace, textArray.join(''));
        }
        pointSizeTotal += linespace;
    }

    if(item.keyDetails != null && item.keyDetails != '') {
        if(outputToPDF) {
            pdfDoc.text(xPos, yPos += linespace, item.keyDetails);
        }
        pointSizeTotal += linespace;
    }

    if(item.contacts != null) {
        if(outputToPDF){
            pdfDoc.text(xPos, yPos += linespace, 'Contact' + (item.contacts.length > 1 ? 's:' : ':'));
        }
        pointSizeTotal += linespace;

        var contactMargin = xPos + 15;
        $.each(item.contacts, function(i, contact) {
            if(i > 0) {
                yPos += Math.ceil(linespace / 2);
                pointSizeTotal += Math.ceil(linespace / 2);
            }

            if(contact.displayName != null && contact.displayName != '') {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.displayName);
                }
                pointSizeTotal += linespace;
            }
            var hasJobTitle = contact.jobTitle != null && contact.jobTitle != '';
            var hasCompanyName = contact.companyName != null && contact.companyName != '';

            if(hasJobTitle && hasCompanyName)
            {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.jobTitle + ', ' + contact.companyName);
                }
                pointSizeTotal += linespace;
            }
            else if(hasJobTitle) {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.jobTitle);
                }
                pointSizeTotal += linespace;
            }
            else if(hasCompanyName) {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.companyName);
                }
                pointSizeTotal += linespace;
            }

            if(contact.phone != null && contact.phone != '') {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.phone);
                }
                pointSizeTotal += linespace;
            }
            if(contact.email != null && contact.email != '') {
                if(outputToPDF) {
                    pdfDoc.text(contactMargin, yPos += linespace, contact.email);
                }
                pointSizeTotal += linespace;
            }
        });
    }

    if(outputToPDF) {
        settings.yPos = yPos; // update the yPos in order to render the next item
    }

    return pointSizeTotal;
}

// End Functions

/*
* smartDirections

$(".gmapDirectionLink").on("click", function(e) {
$("#overlay").show().html($("#smartDirections"));
    
e.preventDefault();
});
*/
/*
$(document).on("click", ".filter", function (event) {
    event.stopPropagation();
    console.log("filter clicked");
    $(".filterBubbleHolder").toggle();
    //$(".filter").css({ "background-color": "#f9f9f9" });
});
$(document).click(function () {
    $(".filterBubbleHolder").hide();
});
$(document).on("click", ".filterUL li", function (e) {
    e.preventDefault();
    $(".filterUL li").removeClass("selected");
    $(this).addClass("selected");
    //$(".filterSelected").html($(this).text() + '<i class="entypo-down-open" style="font-size:13pt"></i>');
    $(".filterSelected").html($(this).text()).data('selected', $(this).data('id'));
    $("#locationDD option[value='" + $(this).data('id') + "']").prop("selected", true).trigger("change");
    $(".filterBubbleHolder").hide();
    $("#locationStatus").hide();
});
*/
$(document).on("click", ".closeDirectionMap", function () {
    $("#smartDirections").hide();
    $(".listingsLink").trigger("click");
});
/*
$(document).on("change", "#locationDD", function () {
    //hide all sections
    $('#latLonFields').hide();
    $("#zipFields").hide();
    $("#countyFields").hide();
    $("#cityFields").hide();

    console.log($(this).val());
    var selectedValue = $(this).val();

    if (selectedValue == 'all') { // its entire state
        if(useCookies) {
            $.cookie('searchParams', { 'useCurrent': null, 'locationDD': 'all' });
        }
        activateEntireState();
        $("#zip").val('');
    }

    if (selectedValue == 'current') { // its My Current location, set cookie useCurrent=1 
        activateMyLocation();
        if(useCookies) {
            $.cookie('searchParams', { 'useCurrent': '1', 'currentlat': $("#currentlat").val(), 'currentlon': $("#currentlon").val(), 'locationDD': selectedValue });
        }
        geoSelected();
    }

    if (selectedValue == 'custom') { // its other location, set cookie useCurrent=0
        activateOtherLocation();
        if(useCookies) {
            $.cookie('searchParams', { 'useCurrent': '0', 'currentlat': $("#lat").val(), 'currentlon': $("#lon").val(), 'locationDD': selectedValue });
        }
        geoSelected();
    }

    if (selectedValue == 'zip') {
        $("#zipFields").show();
        if(useCookies) {
            var cokSearchParam = $.cookie('searchParams');
            if (typeof (cokSearchParam.zip) != 'undefined') {
                $("#zip").val(cokSearchParam.zip);
            }
            $.cookie('searchParams', { 'useCurrent': '0', 'currentlat': $("#lat").val(), 'currentlon': $("#lon").val(), 'locationDD': 'zip' });
        }
        zipSelected();
    }
    if (selectedValue == 'county') {
        $("#countyFields").show();
        if(useCookies) {
            var cokSearchParam = $.cookie('searchParams');
            if (typeof (cokSearchParam.county) != 'undefined') {
                console.log(cokSearchParam.county);
                $("#countyids").val(cokSearchParam.county.split(','))
            }
            $.cookie('searchParams', { 'useCurrent': '0', 'currentlat': $("#lat").val(), 'currentlon': $("#lon").val(), 'locationDD': 'county' });
        }
    }
    if (selectedValue == 'city') {
        $("#cityFields").show();
        if(useCookies) {
            var cokSearchParam = $.cookie('searchParams');
            if (typeof (cokSearchParam.city) != 'undefined') {
                console.log(cokSearchParam.city);
                $("#cities").val(cokSearchParam.city.split(','))
            }
            $.cookie('searchParams', { 'useCurrent': '0', 'currentlat': $("#lat").val(), 'currentlon': $("#lon").val(), 'locationDD': 'city' });
        }
    }

});*/


$(document).on("click", '.addShovelReady', function (event) {
    event.preventDefault();
    location.href = '/core/item/add.aspx?tid=16470&golast=%2fdirectory%2fstate%2f';
});
$(document).on("click", '.addBuilding', function (event) {
    event.preventDefault();
    location.href = '/buildings/add';
});
$(document).on("click", '.addManufacturer', function (event) {
    event.preventDefault();
    location.href = '/net/org/add.aspx?glid=139731&typeid=30000&sectortypeid=31000&selecttypeids=31030,31007&titletypeid=31030';
});
$(document).on("click", '.addInternational', function (event) {
    event.preventDefault();
    location.href = '/international/add';
});

$(document).on("click", '.headerLogo', function (event) {
    alert("headerLogo");
});
$(document).on("click", '.fullWebsiteLink', function (event) {
    event.preventDefault();
    if ($(window).width() <= 800) {
        $('#modalPopupBkgd').show();
        $('#moreOptions').show();
    } else {
        $('#fullWebsiteContinueLink').trigger("click", ["ce"]);
    }
});

$(document).on("click", '#fullWebsiteContinueLink', function (event) {
    event.preventDefault();
    var params = loadUrlValues();
    var $checkboxes = $('#buildingsCB, #manufacturersCB, #internationalCB').filter(':checked');
    var url = '/buildings';
    if ($checkboxes.length == 1) {
        if ($checkboxes[0].id == 'shovelReadyCB') {
            url = '/grad';
        }
        else if ($checkboxes[0].id == 'manufacturersCB') {
            url = '/manufacturers';
        }
        else if ($checkboxes[0].id == 'internationalCB') {
            url = '/international';
        }
    }
    else { // none are checked or more than one are checked.
        url = '/manufacturers';
    }
    if (location.host == 'localhost' || location.host == 'big-data-labs.github.io') {
        location.href = getLocalhostUrl(url, 'http://georgiafacts.org', params, false);
    }
    else {
        // $(this).attr('href', url); // Doesn't work when "More Options" link bypasses dialogue popup.
        location.href = url;
    }
});

$(document).on("click", '#fullWebsiteCancelLink', function (event) {
    $('#moreOptions').hide();
    $('#modalPopupBkgd').hide();
    event.preventDefault();
});

// Stick map on scroll
//var itemsTop = $('#mapColumn').position().top;
//var itemTypeHeight = $('#smartMap').height();
//var itemTypeBottom = itemsTop + itemTypeHeight;
$(document).on("click", '#closeSmartSearch', function (event) {

    $("#mainColumn").hide();
    $("#closeSmartSearch").hide();
    $("#showWidgetTabs").show();
    $(".siteTabs ul li").css({ "width": "16.66%" });
    $("#smallIconLI").show();
    $('#rightCornerIcons').appendTo($('#rightIconsTop'));
    event.preventDefault();
});

$(document).on("click", '.closeList', function (event) {
    var $this = $(this), closeFeedType = $this.data('feedtype');

    if ($(".closeList:visible").length == 1) {
        $smartList.hide();
    }
    else {
        $('.' + closeFeedType).hide();
        $this.parent().hide();
    }

    feedScroll();

    //if($(this).scrollTop() > itemsTop) {
    //$('#smartMap').css({position:'fixed',top:10,width:$('#mapColumn').width()});
    //} else {
    //$('#smartMap').removeAttr('style');
    //}

});

//start here

/*
$(document).click(function (e) {

if (e.target.class != 'menuLink' && !$('#menuHolder').find(e.target).length) {
$("#menuHolder").hide();
$('.menuLink').css('color', '#fff');
scrollToTop($('#mainColumn'), offsetTop); // Prevents search fields from going offscreen when menu is automatically hidden.
// To Do: When more form fields are added, adjust scroll to avoid going all the way to top.
}

});*/

$(document).on('click', '.optionSide', function () {

    setTabBackgroudColor();

});

//end here bade lal

$(document).on("click", '.homeLink', function (event) {
    if ($('#menuHolder').is(':visible')) {
        closeMenu();
    } else {
        //restoreIcons();
        hideOthers();
        showAbout();
        //$('#menuHolder').show();
        $("#mainColumn").show();
        $('.menuLink').css('color', '#ccc');
        $('#settingsHolder').hide();
        $('#modalPopupBkgd').hide();
    }
    event.preventDefault();
});
$(document).on("click", "#printPage", function(e) {
    w = window.open(window.location.href);
    w.print();
});
$(document).on("click", '.toggleSearchText', function (event) {
    if ($('#searchTextHolder').is(':visible')) {
        $('#searchTextHolder').hide();
    } else {
        $('#searchTextHolder').show();
    }
    event.preventDefault();
});
$(document).on("click", '#showMessage', function (event) {
    //restoreIcons();
    scrollToTop($('#listContainer'), offsetTop);
    if ($('.infoDisplay').is(':visible')) {
        $('.infoDisplay').hide();
    } else {
        $('.infoDisplay').show();
    }
    event.preventDefault();
});
$(document).on("click", '#showWidgetTabs', function (event) {
    restoreIcons();
});

$(document).on("click", '#showAboutText', function (event) {
    hideOthers();
    $("#smartMap").hide();
    showAbout();
    closeMenu();
    event.preventDefault();
});

$(document).on("click", '#nearTab', function (event) {
    geoSelected();
    event.preventDefault();
});

$(document).on("click", '#lat, #lon', function (event) {
    $('#currentLoc .active').removeClass("active");
    //$('#useCustomLatLon').addClass("active").show();
    event.preventDefault();
});
$(document).on("change", "#lat, #lon", function() {
    $(".filterUL li[data-id='custom']").trigger("click");
});
$(document).on("focusout", "#lat, #lon", function() {
    if ($.trim($("#lat").val()) != '' && $.trim($("#lon").val())) {
        
        if($(".googleMapsHolder").is(":visible")) {
            setGmapPositionMarker($("#lat").val(), $("#lon").val());
        }
        if ($('.bingMapsHolder').is(":visible")) {
            setBingMapPositionMarker($("#lat").val(), $("#lon").val());
        }
    }
});
$(document).on("click", '#newSearchLink', function (event) {
    $('.basicSearch').show();
    $('#newSearchLink').hide();
    event.preventDefault();
});


/*
$('#zipTab').click(function (event) {
zipSelected();
event.preventDefault();
});*/

$(document).on("click", '#locationStatus', function (event) {
    if ($('#locationSectionBox').is(':visible')) {
        $('#locationArrow').attr("src", "../img/icons/circle-next.png");
        $('#locationStatus').hide();
        $(".filterUL li.selected").trigger("click");
    } else {
        $('#locationArrow').attr("src", "../img/icons/circle-down.png");
        //$('#locationSectionBox').show();
    }
    //return false;
    event.preventDefault();
});

$(document).on("blur", "#zip", function() {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.zip = $('#zip').val();
        $.cookie('searchParams', cokSearchParam);
    }
});
$(document).on("click", '#doneZip, #doneLatLng, #doneCounty, #doneCity', function (event) {

    var $this = $(this);
    var $distance = $('#distance');
    distanceSearchType = '';
    if ($distance.val() != '') {
        if ($this.attr('id') == 'doneZip') {
            var zipValue = $('#zip').val();
            // var pattern = /^\d{5}$/;
            // if (pattern.test(zipValue)) {
                distanceSearchType = 'zip';
            // } else {
            //     alert("Enter zip.");
            //     return false;
            // }
        }
        else if ($this.attr('id') == 'doneCounty') {
            distanceSearchType = 'county';
        }
        else if ($this.attr('id') == 'doneCity') {
            distanceSearchType = 'city';
        }
        else {
            var latValue = $('#lat').val();
            var lonValue = $('#lon').val();
            if (!isNaN(parseFloat(latValue)) && !isNaN(parseFloat(lonValue))) {
                distanceSearchType = 'latlon';
            }
        }
    }
    displayLocText();
    $('#locationArrow').attr("src", "../img/icons/circle-next.png");
    $('#locationStatus').show();
    $('#latLonFields,#zipFields,#cityFields,#countyFields').hide();
    event.preventDefault();
});



$(document).on("click", "li#welcomeTab", function (e) {
    // Project List 4.3
    $("#smartDirections").hide();
    $(".directionsLink").removeClass("active");
});
$(document).on("click", "li#shovelReadyTab, li#buildingsTab, li#manufacturersTab, li#internationalTab", function (e) {
    e.preventDefault();
    $($("li#shovelReadyTab").data("checkbox")).prop('checked', false);
    $($("li#buildingsTab").data("checkbox")).prop('checked', false);
    $($("li#manufacturersTab").data("checkbox")).prop('checked', false);
    $($("li#internationalTab").data("checkbox")).prop('checked', false);
    $($(this).data("checkbox")).prop('checked', true);
    setTabBackgroudColor();
    // Project List 4.3 - starts
    $("#smartDirections").hide();
    $(".directionsLink").removeClass("active");
    // Project List 4.3 - ends
    $('#searchButton').trigger("click", ["ce"]);
});

$(document).on('click', '.menuLink', function (event) {
    $("#widgetTabs li").removeClass("active");
    $(this).addClass("active");
    //restoreIcons();
    hideOthers();
    showAbout();
    
    //$("#mainColumn").show();
    //$('.menuLink').css('color', '#ccc');
    $('#settingsHolder').hide();
    $('#modalPopupBkgd').hide();
    scrollToTop($('#contentHolder'), offsetTop);
    event.preventDefault();
});

$(document).on("click", "li.listingsLink, li.slideshowLink, a.menuLinkListings", function (e) {
    $("#smartDirections").hide();
    if ($(this).is('li')) {
        $("#widgetTabs li").removeClass("active");
    }
    $("#widgetTabs li").removeClass("active");
    $(this).addClass("active");

    if (flgFeedLoaded == false) {
        e.preventDefault();
        $('#searchButton').trigger("click", ["ce"]); // calls hideOthers
    } else {
        scrollToTop($('#mainColumn'), offsetTop);
    }
});
$(document).on("click", "li.listingsLink, a.menuLinkListings", function (e) {
    //alert('listingsLink');
    //$("#smartSlideshow").hide(); // Didn't work
    // $("#mapColumn").hide(); // Causes map to be too narrow.
    // $("#smartMap").hide(); // Causes map to be too narrow.
    if ($(window).width() <= 800) {
        $('#smartMap').insertAfter($('#mapInMain')); // To render tiles correctly.
        //$("#smartMap").hide();
    }

    $(".slideshowContainer").hide();
});
$(document).on("click", "li.slideshowLink", function (e) {
    hideMain(); // Includes hiding mySearch when wide, but omits hiding map.
    if ($(window).width() <= 800) {
        // hideOthers(); // No effect on hiding map at present.  To use later.
        //$('#smartMap').insertAfter($('#mapInMain')); // To render tiles correctly.
        $('#smartMap').show(); // Always show so rotating location is visible.
        //alert('map insertAfter');
        // Hide map because it scrolls on mobile. Also seems to lock screen.
        // Didn't work, 3000 too soon
        //setTimeout(function () { $('#smartMap').hide() }, 3000); // Allow time to load tiles
    }
    $(".slideshowContainer").show();
    $(".smartSlideshow").show();
});

$(document).on("click", "li.mapLink", function (e) {
    e.preventDefault();

    $("#widgetTabs li").removeClass("active");
    $(this).addClass("active");
    hideOthers();

    // No effect on displaying tiles after resize.
    //$('.mapHeight').css('min-height',$(window).height()-90);
    //$('.mapHeight').css('height',$(window).height()-90);

    $("#searchTextHolder").show();
    if ($("#smartMap").children().length > 0) {
        hideMain();
    } else {
        if (!$("#overlay").is(':visible')) {
            //$("li.searchLink, li.listingsLink, li.slideshowLink, a.menuLinkListings").removeClass("active");
            $("#widgetTabs li").removeClass("active");
            //$(this).addClass("active");
            $('#searchButton').trigger("click", ["ce"]);
        }
    }
    if ($(window).width() <= 800) {
        $('#mainColumn').css('height', '1px'); // HACK to close 2000px height gap when internal div's (like smartList) are hidden. 0px did not fix.
        // Alterative solution will likely be to insert smartMap into mainColumn.
    }
    $("#smartMap").show();

    if ($(window).width() <= 800) {
        $("#smartList").hide();
        //$('#smartMap').insertAfter($('#mapInMain')); // Since map needs to rendered to correctly span 
    }
});
$(document).on("click", "li.googleLinkHideOthers", function (e) {
    // Since googleLink is called by smartWidget.cs
    if ($(window).width() <= 800) {
        hideOthers();
    }
});
$(document).on("click", "input[type='radio'][value='googleLink'], input[type='radio'][value='googleClusterLink']", function (e) {
    
    // To Fix: Triggered by loadMaps() regardless of if map is needed.
    //alert("googleLink");
    //e.preventDefault();
    useGoogleMap = true;
    if(typeof(console) != 'undefined') {
        console.log('Google/GoogleCluster radio clicked');
    }
    
    $("#mapToggle li").removeClass("active");
    $("#smartMap").show(); // This causes map to always appear on mobile, which user can not scroll beyond.
    // But it's needed, or map tiles don't load.

    if ($("#smartMap").children().length > 0) {
    } else {
        if (!$("#overlay").is(':visible')) {
            //$("li.searchLink, li.googleLink, li.listingsLink, li.slideshowLink, a.menuLinkListings").removeClass("active");
            $("#widgetTabs li").removeClass("active");
            $(this).addClass("active");
            $('#searchButton').trigger("click", ["ce"]);
        }
    }
    
});
$(document).on("click", "input[type='radio'][value='bingLink']", function (e) {
    //e.preventDefault();
    useGoogleMap = false;
    if(typeof(console) != 'undefined') {
        console.log('Bing radio clicked');
    }

    $("#mapToggle li").removeClass("active");
    $("#smartMap").show();
    if ($(window).width() <= 800) {
        hideMain();
    }
    if ($("#smartMap").children().length > 0) {
        //alert('smartMap div already populated.');
    } else {
        if (!$("#overlay").is(':visible')) {
            // li.mapLink instead of li.googleLink?
            //$("li.searchLink, li.googleLink, li.listingsLink, li.slideshowLink, a.menuLinkListings").removeClass("active");
            $("#widgetTabs li").removeClass("active");
            $(this).addClass("active");
            $('#searchButton').trigger("click", ["ce"]);
        }
    }
});
$(document).on("click", "li.pdfLink", function(event) {
    var $this = $(this);
    if($this.text().trim() == 'PDF') {
        if(typeof(jsPDF) == 'undefined') {
            $.cachedScript("../js/jspdf.min.js")
            .success(function() {
                $('#smartWidget').smartWidget('checkBoxes', 'show', 'locations');
            });
        }
        else {
           $('#smartWidget').smartWidget('checkBoxes', 'show', 'locations');
        }
        hideOthers();
        scrollToTop($('#smartList'), offsetTop);
    }
    else {

        buildPDF(checkedItems);

        /*
        var targetUrl = '/info/{0}?mode=p&pdf=1';
        var params = loadUrlValues();
        for(var x in params) {
           if(x != 's' && x != 'db' && x != 'localhost') {
              delete params[x];
           }
        }

        if (location.host == 'localhost') {
            targetUrl = getLocalhostUrl(targetUrl, 'http://georgiafacts.org', params, false);
        }
        else if ($.isEmptyObject(params) == false) {
            targetUrl += targetUrl.indexOf('?') > 0 ? '&' : '?';
            targetUrl += $.param(params);
        }
        params.u = targetUrl;
        params.ids = checkedItems.join(',');

        var pdfUrl = '/net/content/pdf.aspx';

        if (location.host == 'localhost') {
            pdfUrl = getLocalhostUrl(pdfUrl, 'http://georgiafacts.org', params, false);
        }
        else if ($.isEmptyObject(params) == false) {
            pdfUrl += pdfUrl.indexOf('?') > 0 ? '&' : '?';
            pdfUrl += $.param(params);
        }

        window.open(pdfUrl, 'smartPDF');
        */
    }
});


$(document).on("click", '.searchLink', function (e) {
    e.preventDefault();
    //$("#smartDirections").hide();
    //$("#smartSlideshow").hide();
    hideOthers();
    $("#widgetTabs li").removeClass("active");
    $(this).addClass("active");
    $("#mySearch").show();
    scrollToTop($('#mainColumn'), offsetTop);
});

$("#placesCB").click(function () {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includePlaces = $(this).is(':checked');
        $.cookie('searchParams', cokSearchParam);
    }
});

$("#consumerProductsCB").click(function () {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeConsumerProducts = $(this).is(':checked');
        $.cookie('searchParams', cokSearchParam);
    }
});

$("#allforgoodCB").click(function () {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeAllForGood = $(this).is(':checked');
        $.cookie('searchParams', cokSearchParam);
    }
});

$("#homeHistoryCB").click(function () {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeHomeHistory = $(this).is(':checked');
        $.cookie('searchParams', cokSearchParam);
    }
});

$("#stateParkCB").click(function () {
    if(useCookies) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeStatePark = $(this).is(':checked');
        $.cookie('searchParams', cokSearchParam);
    }
});

$("#buildingsCB").click(function () {
    if ($(this).is(':checked')) {
        $("#sectionDimension").show();
        $("#availBuildDiv").addClass("expandedDiv");
    } else {
        $("#sectionDimension").hide();
        $("#availBuildDiv").removeClass("expandedDiv");
    }
    setTabBackgroudColor();
});

$("#manufacturersCB, #internationalCB").click(function () {
    if ($("#manufacturersCB").is(':checked') || $("#internationalCB").is(':checked')) {
        $("#sectionManufacturers").show();
        $("#internationalCB").is(':checked') ? $("#sectionInternational").show() : $("#sectionInternational").hide();
    } else {
        $("#sectionManufacturers").hide();
        $("#sectionInternational").hide();
    }
    setTabBackgroudColor();
});

$(window).resize(function (e) {
    updateLayout();
});

$(document).on("click", ".gmapDirectionLinkIcon", function() {
    if($(window).width() <= 800) {
        hideOthers();
        $("#smartMap").show();
    }
});
// End Event Handlers

// Initial Load Code - This is executed after the functions and event handlers are set up.

/*
if (typeof (historyState.data.id) != 'undefined') {
    console.log("id in url exist.");
    ClickDetailsLink = historyState.data.id;
    setTimeout(function () {
        $("#searchButton").click();
    }, 1000);

} else {
    //
}
*/

if (typeof ($.cookie('sliderValues')) === 'undefined' || $.cookie('sliderValues') === null) {
    $.cookie('sliderValues', defaultSliderValues);
}

sliderValues = $.cookie('sliderValues');
if (typeof (sliderValues) === 'undefined' || sliderValues === null) {
    sliderValues = defaultSliderValues; // if cookies are not enabled or are corrupted, use the default
}

if (typeof ($.cookie('viewOptions')) === 'undefined' || $.cookie('viewOptions') === null) {
    $.cookie('viewOptions', defaultViewOptions);
}

if (typeof ($.cookie('searchParams')) === 'undefined' || $.cookie('searchParams') === null) {
    $.cookie('searchParams', defaultSearchParams);
}

searchParams = $.cookie('searchParams');
if (typeof (searchParams) === 'undefined' || searchParams === null) {
    searchParams = defaultSearchParams; // if cookies are not enabled or are corrupted, use the default
}
        var adminLevel = document.getElementById('adminLevel');
        if(typeof(adminLevel.value) == 'undefined') {
            adminLevel.value = sliderValues.adminLevel;
        }
        var slider1 = new MobileRangeSlider('adminLevelCt', {
            value: sliderValues.adminLevel,
            min: 0,
            max: 10,
            change: function (percentage) {
                if(typeof(adminLevel.value) != 'undefined' && adminLevel.value != percentage) {
                    sliderValues['adminLevel'] = adminLevel.value = percentage;
                    if(useCookies) {
                        $.cookie('sliderValues', sliderValues);
                    }
                }
            }
        });

          
    var html = [];
    //for (var key in sliderValues) {

    hs = '<a href="javascript:void(0)" id="cookieConsole">Loaded Cookie</a><br><div style="display:none;" id=viewCookie>'+JSON.stringify(sliderValues)+'</div>';
    html.push(timeStamp() + hs);
    //html.push(timeStamp() + JSON.stringify(searchParams) + '<br>');
    //html.push(timeStamp() + String(sliderValues) + '<br>');
    //}
    //var html = timeStamp() + text + '<br>';
    var $selector = $('.adminMessage');
    if ($selector.length != 0) {
        $('#showMessage').show();
        $selector.append(html.join(''));
        //return;
    }


//if (sliderValues['place'] == 'on') {
//    $("#placesCB").attr("checked", "true");
//}
//hidding Facebook Places checkbox if place value is off
/*
$.cookie.json = true;
if(typeof($.cookie('sliderValues')) !== 'undefined') {
sliderValues = JSON.parse($.cookie('sliderValues'));
console.log(sliderValues);
console.log(sliderValues['place']);
if(sliderValues['place'] == 'off') {
$(".placesSelect").hide();
}
}
*/

//checkUncheckPlacesCB(sliderValues.place);

//if (sliderValues['allforgood'] == 'on') {
//    $("#allforgoodCB").attr("checked", "true");
//}
//checkUncheckAllForGoodCB(sliderValues.allforgood);
checkUncheckFeed();
$('#settingsDialog').scope().showHideDialogControls();
showSearch(true);


if (sliderValues.place === 'on') {
    //$(".placesSelect").show();
    $('#fbSettings .slider-button').addClass('on').html('ON');
} else {
    //$(".placesSelect").hide();
    $('#fbSettings .slider-button').removeClass('on').html('OFF');
}
//$('#fbSettings .slider-frame').trigger("click"); // comment out since the click handler will toggle the state

$('#fbSettings .slider-frame').click(function () {
    if ($(this).find('.slider-button').hasClass('on')) {
        $(this).find('.slider-button').removeClass('on').html('OFF');
        sliderValues['place'] = 'off';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    } else {
        $(this).find('.slider-button').addClass('on').html('ON');
        sliderValues['place'] = 'on';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    }
    checkUncheckPlacesCB(sliderValues['place'], sliderValues['place'] == 'on' ? true : false, useCookies);
    showSearch(true);
});


if (sliderValues.allforgood === 'on') {
    $('#allforgoodSettings .slider-button').addClass('on').html('ON');
} else {
    $('#allforgoodSettings .slider-button').removeClass('on').html('OFF');
}
//$('#allforgoodSettings .slider-frame').trigger("click");  // comment out since the click handler will toggle the state

$('#allforgoodSettings .slider-frame').click(function () {
    if ($(this).find('.slider-button').hasClass('on')) {
        $(this).find('.slider-button').removeClass('on').html('OFF');
        sliderValues['allforgood'] = 'off';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    } else {
        $(this).find('.slider-button').addClass('on').html('ON');
        sliderValues['allforgood'] = 'on';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    }
    checkUncheckAllForGoodCB(sliderValues['allforgood'], sliderValues['allforgood'] == 'on' ? true : false, useCookies);
    showSearch(true);
});

if (sliderValues.homeHistory === 'on') {
    $('#homeHistorySettings .slider-button').addClass('on').html('ON');
} else {
    $('#homeHistorySettings .slider-button').removeClass('on').html('OFF');
}
//$('#homeHistorySettings .slider-frame').trigger("click");  // comment out since the click handler will toggle the state

$('#homeHistorySettings .slider-frame').click(function () {
    if ($(this).find('.slider-button').hasClass('on')) {
        $(this).find('.slider-button').removeClass('on').html('OFF');
        sliderValues['homeHistory'] = 'off';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    } else {
        $(this).find('.slider-button').addClass('on').html('ON');
        sliderValues['homeHistory'] = 'on';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    }
    checkUncheckHomeHistoryCB(sliderValues['homeHistory'], sliderValues['homeHistory'] == 'on' ? true : false, useCookies);
    showSearch(true);
});

if (sliderValues.statePark === 'on') {
    $('#stateParkSettings .slider-button').addClass('on').html('ON');
} else {
    $('#stateParkSettings .slider-button').removeClass('on').html('OFF');
}
//$('#stateParkSettings .slider-frame').trigger("click");  // comment out since the click handler will toggle the state

$('#stateParkSettings .slider-frame').click(function () {
    if ($(this).find('.slider-button').hasClass('on')) {
        $(this).find('.slider-button').removeClass('on').html('OFF');
        sliderValues['statePark'] = 'off';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    } else {
        $(this).find('.slider-button').addClass('on').html('ON');
        sliderValues['statePark'] = 'on';
        if(useCookies) {
            $.cookie('sliderValues', sliderValues);
        }
    }
    checkUncheckStateParkCB(sliderValues['statePark'], sliderValues['statePark'] == 'on' ? true : false, useCookies);
    showSearch(true);
});

$("#locationDD").val(searchParams['locationDD']);
/* smart filter code starts */
//$(".filterSelected").data("selected", $("#locationDD").val()).html($("#locationDD option:selected").text());
$(".filterUL li").removeClass("selected");
//alert($("#locationDD").val());
$(".filterUL li[data-id='" + $("#locationDD").val() + "']").addClass("selected");
/* smart filter code ends */
if (searchParams['useCurrent'] == '1') {
    activateMyLocation();
    if(useCookies) {
        $.cookie('searchParams', { 'useCurrent': '1', 'currentlat': $("#currentlat").val(), 'currentlon': $("#currentlon").val(), 'locationDD': 'current' });
    }
    geoSelected();
}
//else if (searchParams['useCurrent'] == '0') { // Wanted this to work with '3', but it didn't.
//else if ($.cookie('locationDD') == 'custom') { // Not working
else if ($("#locationDD").val() == 'custom') {
    activateOtherLocation();
    $("#lat").val(searchParams['currentlat']);
    $("#lon").val(searchParams['currentlon']);
    geoSelected();
}
else if (searchParams['useCurrent'] == '0' && $("#lat").val() != '' && $("#lon").val() != '') {
    activateOtherLocation();
    geoSelected();
} else if(searchParams['locationDD'] == 'zip') {
    zipSelected();
    $("#zipFields").show();
    if (typeof (searchParams.zip) != 'undefined') {
        $("#zip").val(searchParams.zip);
    }

} else if(searchParams['locationDD'] == 'county') {
    $("#countyFields").show();
    if (typeof (searchParams.county) != 'undefined') {
        $("#county").val(searchParams.county.split(','));
    }

} else if(searchParams['locationDD'] == 'city') {
    $("#cityFields").show();
    if (typeof (searchParams.city) != 'undefined') {
        $("#city").val(searchParams.city.split(','));
    }
}

$('#headerLogo').attr("src", "img/header-title.png");
/*
if (location.host == 'georgiafacts.org' || location.host == 'locations.georgia.org') {
$('#headerLogo').attr("src", "img/facts.png");
} else {
$('#headerLogo').attr("src", "../img/logo/SmartWidgetLogo.png");
$('#headerLogo').css('width', '200px');
// src="" width="200"
}
*/

$smartList.hide();

/*
$(window).scroll(function(){

//if ($('#smartMap').position().top <= 0) {
//$('#smartMap').css({position:'fixed',top:itemsTop,width:$('#mapColumn').width()});
//$('#smartMap').css({ top:$('#typeTabHolder').height(), width:$('#mapColumn').width()});
if($('#mainColumn').is(':visible')) {
        
if($(this).scrollTop() > itemsTop) {
$('#smartMap').css({position:'fixed',top:10,width:$('#mapColumn').width()});
} else {
$('#smartMap').removeAttr('style');
}
}
        
        
//}
});
*/
if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io') {
    $(".localhost").show();
}
if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io' || location.host.toLowerCase().indexOf('review.') >= 0) {
    $(".adminMessage").show(); // Since user-4 class is not available without local database.
    $("#shovelReadyDiv").show();
    $("#shovelReadyTab").show();
    //$(".addButton").show();
}
// Populate input fields from the querystring values if there are any.
var loadedField = loadSearchFields(urlValues); // returns true if a field was loaded from the url, otherwise false
setTabBackgroudColor(); // function depends on the states of the checkboxes

// After populating the search fields from the url (if there is anything to populate), submit the page
// with those url values.
if (loadedField) {
    flgLoadAboutData = false;
    $("#widgetTabs li").removeClass("active");
    $("li.listingsLink").addClass("active");
    submitPage(urlValues); // initial page load - load the feeds from url values only.
} else {
    // Show the images tab. Search has not run yet.
    $("li.slideshowLink").show();
    $(".hideOnLoad").show(); // Show large image
}
showGeorgiaMenu(urlValues); // Initial load
if (flgLoadAboutData) {
    showAbout(); // Initial load
}
updateLayout();
//loadWidget(urlValues);
//$("#sectionManufacturers").hide();

// notify the accordion that we have loaded the initial values from the cookies.
var accordionScope = $('#accordionCtrl').scope();
if(typeof(accordionScope) != 'undefined') {
    accordionScope.$broadcast('initialLoad');        
}

// End Initial Load Code

$("#cookieConsole").click(function(e) {
    if ($('#viewCookie').is(':visible')) {
        $("#viewCookie").hide();
    } else {
        $("#viewCookie").show();
    }
});

var display_results = $.cookie('display_results');

if (typeof(display_results) != 'undefined') {
    $("#display_results_selected").data("selected", display_results["selected"]);
    $("#display_results_selected").html(display_results["html"]);
    setMapPosition(display_results);
} else {
    display_results = {"selected" : "", "html" : ""};
}

/*
$(document).on("click", "#display_results_drpdown", function(e) {
    e.stopPropagation();
    $("#display_results_drpdown > .filterBubbleHolder").toggle();
});

$(document).on("click", "#settingControls-filterUL li", function(e) {
    e.stopPropagation();
    var $this = $(this);
    display_results["selected"] = $this.data("value");
    display_results["html"] = $this.children().html();
    $.cookie('display_results', display_results);
    $("#display_results_selected").data("selected", display_results["selected"]);
    $("#display_results_selected").html(display_results["html"]);
    setMapPosition(display_results);
    $("#display_results_drpdown").click();
});
*/


// Bind to StateChange Event
History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
    if(!ignoreHistoryStateChange) {
        var historyState = History.getState(); // Note: We are using History.getState() instead of event.state
        if(typeof(historyState.data.id) != 'undefined' ) {
           var foundID = $('#smartWidget').smartWidget('detail', historyState.data.id, 'locations');
           if(foundID == false) {
              location.href = historyState.url;
           }
        }
        else {
           if(typeof(historyState.data) != 'undefined' && $.isEmptyObject(historyState.data) == false) {
                loadSearchFields(historyState.data);
           }
           $('.searchLink').click();
        }
    }
});

});

}); // end document.ready event handler

function showManagmentSuite($context) {
$('#manageSuite', $context).hide();
$('#manageSuiteHide, #managementSuite', $context).show();
return false;
}
function hideManagementSuite($context) {
$('#manageSuiteHide, #managementSuite', $context).hide();
$('#manageSuite', $context).show();
}

function DOMoptionsToJSArray(selector, valType) {
var optionArray = [];
selector.each(function () {

    if (valType == 'text') {
        optionArray.push($(this).text());
    }
    if (valType == 'val') {
        optionArray.push($(this).val());
    }

});
return optionArray;
}

function buildLocText(selector, type) {
var locText = '';
if (selector.length == 1) {
    if (selector.val() == '0' || selector.val() == '') {
        //locText = 'Search limited to ' + type.singular + '.'; // Was commented out.
    } else if (type.singular == '') {
        locText = selector.text();
    } else {
        locText = selector.text() + ' ' + type.singular;
    }
} else {

    if (type.plural == '') {
        locText = DOMoptionsToJSArray(selector, 'text').join(', ');
    } else {
        locText = DOMoptionsToJSArray(selector, 'text').join(', ') + ' ' + type.plural;
    }
}
return locText;
}


function getLatLonFromBrowser() {
if (chkGeoPosition) {
    // Get latitude and longitude
    $("#currentButtons").hide();
    if (navigator.geolocation) { // Browser supports lookup
        //Show loading icon
        $("#loadingLatLon").html('<span style="white-space:nowrap"><img src="../img/ajax-loader.gif" alt="Geo Loading" title="Geo Loading" style="width: 18px;float:left" />&nbsp; Loading your current GeoLocation</span>');
        $("#loadingLatLon").show();

        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.coords.latitude.toFixed(3));
            $("#lat").val(position.coords.latitude.toFixed(3));
            $("#lon").val(position.coords.longitude.toFixed(3));
            $("#currentlat").val(position.coords.latitude.toFixed(3));
            $("#currentlon").val(position.coords.longitude.toFixed(3));
            distanceSearchType = 'latlon';
            displayLocText();
            $("#loadingLatLon").hide();
            $("#currentButtons").show();
        }, function (error) {
            console.log(error);
            $('#smartMessage').append('geolocation error occurred. Error code: ' + error.code);
            $("#loadingLatLon").html('Unable to fetch your geolocation (' + error.code + ')');
            // error.code 2 occured when disconnected.
            //alert(error.code);
            //loadPageAsync(jsonFile);       
        });
        //alert('Break page'); // CAUTION - Putting an alert here breaks page.
    }
    if (!$("#lat").val()) {
        //alert("Approve geocoding at the top of your browser.");
    }
    chkGeoPosition = false;
}
}


function checkUncheckPlacesCB(flag, checked, updateCookie) {
    //console.log(flag);
    var $placesCB = $('#placesCB');
    if(flag === 'on') {
        //$(".placesSelect").show();
        $placesCB.prop({checked: checked, disabled: false});
        
    } else {
        //$(".placesSelect").hide();
        $placesCB.prop( {checked: false, disabled: true});
    }

    if(updateCookie) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includePlaces = $placesCB.prop('checked');
        $.cookie('searchParams', cokSearchParam);
    }
}
function checkUncheckAllForGoodCB(flag, checked, updateCookie) {
    //console.log(flag);
    var $allForGoodCB = $('#allforgoodCB');
    if(flag === 'on') {
        //$(".allforgoodSelect").show();
        $allForGoodCB.prop({checked: checked, disabled: false});
    } else {
        //$(".allforgoodSelect").hide();
        $allForGoodCB.prop({checked: false, disabled: true});
    }

    if(updateCookie) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeAllForGood = $allForGoodCB.prop('checked');
        $.cookie('searchParams', cokSearchParam);
    }
}
function checkUncheckHomeHistoryCB(flag, checked, updateCookie) {
    //console.log(flag);
    var $homeHistoryCB = $('#homeHistoryCB');
    if(flag === 'on') {
        $homeHistoryCB.prop({checked: checked, disabled: false});
    } else {
        $homeHistoryCB.prop({checked: false, disabled: true});
    }

    if(updateCookie) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeHomeHistory = $homeHistoryCB.prop('checked');
        $.cookie('searchParams', cokSearchParam);
    }
}

function checkUncheckStateParkCB(flag, checked, updateCookie) {
    //console.log(flag);
    var $stateParkCB = $('#stateParkCB');
    if(flag === 'on') {
        $stateParkCB.prop({checked: checked, disabled: false});
    } else {
        $stateParkCB.prop({checked: false, disabled: true});
    }

    if(updateCookie) {
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.includeStatePark = $stateParkCB.prop('checked');
        $.cookie('searchParams', cokSearchParam);
    }
}

function checkUncheckFeed() {
    var placesEnabled = $.cookie('sliderValues').place;
    var placesChecked = $.cookie('searchParams').includePlaces;
    if(typeof(placesChecked) == 'undefined') {
        placesChecked = false;
    }
    
    var allForGoodEnabled = $.cookie('sliderValues').allforgood;
    var allForGoodChecked = $.cookie('searchParams').includeAllForGood;
    if(typeof(allForGoodChecked) == 'undefined') {
        allForGoodChecked = false;
    }

    var homeHistoryEnabled = $.cookie('sliderValues').homeHistory;
    var homeHistoryChecked = $.cookie('searchParams').includeHomeHistory;
    if(typeof(homeHistoryChecked) == 'undefined') {
        homeHistoryChecked = false;
    }

    var stateParkEnabled = $.cookie('sliderValues').statePark;
    var stateParkChecked = $.cookie('searchParams').includeStatePark;
    if(typeof(stateParkChecked) == 'undefined') {
        stateParkChecked = false;
    }

    checkUncheckPlacesCB(placesEnabled, placesChecked, false);  
    checkUncheckAllForGoodCB(allForGoodEnabled, allForGoodChecked, false);  
    checkUncheckHomeHistoryCB(homeHistoryEnabled, homeHistoryChecked, false);
    checkUncheckStateParkCB(stateParkEnabled, stateParkChecked, false);
}

function showSearch(show) {
    if(show) { 
        $("#mySearch").show()
    }
    else {
        $("#mySearch").hide();
   }
}
            
function setTabBackgroudColor(onload) {
    
    var cnt = 0;
    //alert('setTabBackgroudColor'); // Does this need to occur 4 times?
    if($('#shovelReadyCB').is(':checked')) {
        $('#shovelReadyTab').addClass('menuTabBgColor');
        cnt++;
    } else {
        $('#shovelReadyTab').removeClass('menuTabBgColor');
         
    }
    if($('#buildingsCB').is(':checked')) {
        $('#buildingsTab').addClass('menuTabBgColor');
        cnt++;
    } else {
        $('#buildingsTab').removeClass('menuTabBgColor');
         
    }
    if($('#manufacturersCB').is(':checked')) {
        $('#manufacturersTab').addClass('menuTabBgColor');
        cnt++;
    } else {
        $('#manufacturersTab').removeClass('menuTabBgColor');
    }
    
    if($('#internationalCB').is(':checked')) {
        $('#internationalTab').addClass('menuTabBgColor');
        cnt++;
    } else {
        $('#internationalTab').removeClass('menuTabBgColor');
    }
    if(cnt > 1) {
        $('#shovelReadyTab').removeClass('menuTabBgColor');
        $('#buildingsTab').removeClass('menuTabBgColor');
        $('#manufacturersTab').removeClass('menuTabBgColor');
        $('#internationalTab').removeClass('menuTabBgColor');
    }
}

var checkedItems = [];
var checkedItemIDs = [];




function displayLocText() {

    var locText = '';

    var $distance = $("#distance");
    var selectedSearchType = $("#locationDD").val();

    if(selectedSearchType == 'all') {
        locText = 'Results from entire state';
    }
    else if (selectedSearchType == 'county') {
        locText = buildLocText($("#county option:selected"), { singular: 'County', plural: 'Counties' });
    }
    else if (selectedSearchType == 'city') {
        // singular: 'City', plural: 'Cities'
        locText = buildLocText($("#city option:selected"), {singular: '', plural: ''});
    }
    else if ((selectedSearchType == 'zip' || 
        selectedSearchType == 'custom' || 
        selectedSearchType == 'current') &&
        $distance.val() != '') {
            
        if (selectedSearchType == 'zip' && $('#zip').val() != '') {
            locText = 'Within ' + $("#distance").val() + ' Miles ';
            locText += ' of zip code ' + $('#zip').val();
        }
        else if (selectedSearchType == 'current' || selectedSearchType == 'custom') {
            locText = 'Within ' + $("#distance").val() + ' Miles ';
            if ($("#lat").val() == $("#currentlat").val() && $("#lon").val() == $("#currentlon").val()) {
                locText += ' of your <span style="white-space:nowrap">current location</span>';
            } else {
                locText += ' of <span style="white-space:nowrap">' + $("#lat").val() + ' ' + $("#lon").val() + '</span>';
            }
        }
    }
    var textOnlyLocation = $('#locText').html(locText).text();
    $('#searchText').html(locText);
    return textOnlyLocation;
}

function getPositionText() {
      var selectedPosition = $("#display_results_drpdown").data('text');
      return selectedPosition;
}

function getCategoriesText() {
    var categoriesText = '';
    var $selectedCategories = $('#filterSection input[type="checkbox"]:checked').siblings('label');
    if($selectedCategories.length > 0) {
        $selectedCategories.each(function(index, item) {
            categoriesText += $(item).text() + ', ';
        });
        if(categoriesText.length > 0) {
           categoriesText = categoriesText.substring(0, categoriesText.length - 2); // remove trailing comma and space.
        }
    }
    else {
        categoriesText = 'No categories selected';
    }

    return categoriesText;
}

function getLocationAndBuildingFeed(params) {
    var feed = null;
    var headerText = '';
    if (typeof(params.tid) != 'undefined' && params.tid.length > 0) {
        var typeIDs = params.tid.split(',');
        var joinText = '';
        if (typeIDs.length <= 2) {
            if (typeIDs.length == 2) {
                joinText = ' and ';
            }
            for (var index in typeIDs) {
                if (typeIDs[index] == '16470') {
                    headerText += 'Shovel Ready Sites';
                }
                else if (typeIDs[index] == '16400') {
                    headerText += 'Available Buildings';
                }
                else if (typeIDs[index] == '31030') {
                    headerText += 'Manufacturers';
                }
                else if (typeIDs[index] == '30080') {
                    headerText += 'International Companies';
                }
                if (index < typeIDs.length - 1) {
                    headerText += joinText;
                }
            }
        }
        else {
            // All 3 or 4 types are checked.
            headerText = 'Search Results';
        }
    } else {
        return; // Avoid calling with no tid.
    }
    var feedUrl = '/smart/api/itemfeed?dynamic=1';
    var feedType = 'locations';
    var detailsUrl = '/info/{0}?mode=a';
    var detailsSelector = '#ItemInfoContentDiv';

    //var feedUrl2 = 'calendar/json/google.txt';
    //var feedType2 = 'events';
    if (location.host == 'localhost'  || location.host == 'big-data-labs.github.io') {
        feedUrl = getLocalhostFeedUrl(feedUrl, 'http://georgiafacts.org', params);
        detailsUrl = getLocalhostDetailsUrl(detailsUrl, 'http://georgiafacts.org', params);
    }
    else if ($.isEmptyObject(params) == false) {
        feedUrl += feedUrl.indexOf('?') > 0 ? '&' : '?';
        feedUrl += $.param(params);
    }
    //alert(feedUrl);
    
    feed = {
        url: feedUrl,
        type: feedType,
        provider: '',
        headerText: headerText,
        className: '',
        detailsUrl: detailsUrl,
        detailsSelector: detailsSelector
    };

    return feed;
}
//$('.searchButton').click(function (event, ce) {
$(document).on('click', '.searchButton', function (event, ce) {
    console.log("GO button clicked");
    // Pause the slide show if search button is clicked.
    !!$('.pause').length && $('.pause').trigger("click");
    
    showHideOptionsDialog(false);

    //alert('.searchButton');
    event.preventDefault();
    //$('#doneZip, #doneLatLng, #doneCounty, #doneCity')
    
    if($("#locationDD").val() == 'zip') {
        $('#doneZip').trigger("click");
        
    }
    if($("#locationDD").val() == 'county') {
        $('#doneCounty').trigger("click");
    }
    if($("#locationDD").val() == 'city') {
        $('#doneCity').trigger("click");
    }
    if($("#locationDD").val() == 'custom' || $("#locationDD").val() == 'current') {
        $('#doneLatLng').trigger("click");
    }
    //return false;
    if (ce != "ce") {

        /*
        if($("#county option:selected").length > 1) {
        $("#county option:first").prop("selected", false);
        }
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.county = DOMoptionsToJSArray($("#county option:selected"), 'val').join(', ');
        $.cookie('searchParams', cokSearchParam);
        
        if($("#city option:selected").length > 1) {
        $("#city option:first").prop("selected", false);
        }
        var cokSearchParam = $.cookie('searchParams');
        cokSearchParam.city = DOMoptionsToJSArray($("#city option:selected"), 'val').join(', ');
        $.cookie('searchParams', cokSearchParam);
        */
        //$("li.searchLink, li.mapLink, li.listingsLink, li.slideshowLink, a.menuLinkListings").removeClass("active");
        $("#widgetTabs li").removeClass("active");
        if ($(window).width() <= 800) {
            //$("li.mapLink").addClass("active"); // We're forced to default to the map tab so tiles load.  Mobile users can't have the map on the same page with list because map scrolls instead of page, even when scroll turned off.
        } else {
            $("li.listingsLink").addClass("active");
        }
    }
    $("#widgetTabs").show();
    
    submitPage();

    if ($(window).width() <= 800) {
        // No effect because smartMap is shown again later when click is sent asynchronously to li.googleLink.  It's needed there to load the tiles.
        $("#smartMap").hide();
    }

});

$('#smartOptionsDialog').on('click.smartWidget', function(event) {
    toggleOptionsDialog();
});

function toggleOptionsDialog() {
    var scope = $('#settingsDialog').scope();
    if(typeof(scope) != 'undefined') {
        scope.contentSourceContainer = $('#mySearch form'); // move the modal content back to here when modal is hidden.
        scope.contentContainer = $('#modalContent'); // content to move

        if(scope.isModalShown()) {
            scope.closeModal();
        }
        else {
            scope.openModal();
        }
    }
}

function showHideOptionsDialog(show) {
    var scope = $('#settingsDialog').scope();
    if(typeof(scope) != 'undefined') {
        scope.contentSourceContainer = $('#mySearch form'); // move the modal content back to here when modal is hidden.
        scope.contentContainer = $('#modalContent'); // content to move

        if(show && !scope.isModalShown()) {
            scope.openModal();
        }
        else if(!show && scope.isModalShown()) {
            scope.closeModal();
        }
    }
}
