var buildingmap = null, markers = [], buildingsfeed = [];
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initMap';
  document.body.appendChild(script);
}

function initMap() {
    $("#map-canvas").show();
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
    buildingmap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
}
// Sets the map on all markers in the array.
function setAllMap(map) {
    var len = markers.length;
    for (var i = 0; i < len; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
// Add a marker to the map and push to the array.
function addMarker(map, location) {
    var latlng = new google.maps.LatLng(location.lat, location.lng),
    marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: location.thumbnail,
        title: location.heading,
    });
    markers.push(marker);
    return marker;
}

function addMarkers(map, buildingsfeed) {
    var len = buildingsfeed.length;
    for(var i = 0; i < len; i++) {
        var building = buildingsfeed[i];
        addMarker(map, building);
    }
    // $("#map-canvas").css("height", "1000px");
}
function setMarker(data) {
    
}
$.ajax({
    url: "../feed/json/buildings.json",
    // url: "http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=?&tid=16400",
    // jsonp: "callback",
    // Tell jQuery we're expecting JSONP
    // dataType: "jsonp",
    // Work with the response
    success: function( data ) {
        // console.log( data ); // server response
        var items = _.sortBy(data.items, 'id');
        var images = [];
        var feeds = [];
        
        for(item in items) {
            
            var feed = {};
            feed["heading"] = items[item].title;
            feed["thumbnail"] = "";
            feed["alt"] = "";
            feed["keyDetails"] = items[item].keyDetails;
            feed["start"] = items[item].start;
            feed["htmlLink"] = items[item].htmlLink;
            
            var lat=_.isNull(items[item].venue) ? "" : _.isNull(items[item].venue.latitude) ? "" : items[item].venue.latitude,
                        lng=_.isNull(items[item].venue) ? "" : _.isNull(items[item].venue.longitude) ? "" : items[item].venue.longitude;
                        
            feed["lat"] = lat;
            feed["lng"] = lng;
            
            if(_.isArray(items[item].images)) {
                for(image in items[item].images) {
                    
                    feed["thumbnail"] = _.isUndefined(items[item].images[image].thumbnail) ? "" : items[item].images[image].thumbnail;
                    feed["alt"] = items[item].images[image].title;
                    // console.log(JSON.stringify(feed));
                    
                    images.push('<div class="wrapper"><img data-lazy="' + items[item].images[image].large + '"/><div class="more-info-overlay"><h3 class="margin-5px">' + items[item].images[image].title + ' <a href="#" class="sfmap" data-location=\'' + JSON.stringify(feed) +'\'> <span class="label label-primary icon-map-marker"> Map</span></a></h3></div>');
                    
                }
            }
            var filelink = "";
            if(_.isArray(items[item].files)) {
                var file = items[item].files[0];
                filelink = '<div><a href="' + file["url"] +'" class="icon-download"> ' + file["title"] +'</a></div>';
            }
            
            var creatortxt = "";
            if(_.isArray(items[item].creator)) {
                var creator = items[item].creator;
                
                creatortxt = '<div class="icon-user">' + creator["displayName"] + '</div>';
                console.log(creatortxt);
            }
         
            feeds.push('<div class="panel panel-default"><div class="panel-body"><div class="media"><div class="media-left media-middle"><a href="#"><img class="media-object" src="' + feed["thumbnail"] +'" alt="' + feed["alt"] +'"></a></div><div class="media-body"><h4 class="media-heading">' + feed["heading"] +'</h4><div class="badge badge-info">' + (_.isNull(feed["keyDetails"]) ? "" : feed["keyDetails"])  + '</div><div><i class="icon-calendar"></i> ' + feed["start"] + '</div>' + filelink +'<div class="icon-external-link"><a href="' + feed["htmlLink"] + '">' + feed["htmlLink"] + '</a></div>' + creatortxt +'</div></div></div>');
            
            buildingsfeed.push(feed);
        }
        // feeds.push('</div>');
        $("#imgGallery").html(images).slick({
          lazyLoad: 'ondemand',
          slidesToShow: 1,
          slidesToScroll: 1
          // vertical:1,
          // verticalSwiping:1
        });
        
        $("#feedlist").html(feeds).slick({
          lazyLoad: 'ondemand',
          slidesToShow: 4,
          slidesToScroll: 4,
          vertical:true,
          verticalSwiping:true
        });
        
        /*
        $('#imgGallery').on('swipe', function(event, slick, direction){
          console.log(direction);
          console.log(slick);
          console.log(event);
          // left
        });
        */
    }
});

$("body").on("click", ".sfmap", function(e) {
    e.preventDefault();
    console.log($(this).data('location'));
    // load gmap script if not already loaded.
    
    if (!(typeof google === 'object' && typeof google.maps === 'object')) {
        loadScript();
    }
    loc = $(this).data('location');
    setTimeout(function() {
        clearMarkers();
        console.log(loc);
        var marker = addMarker(buildingmap, loc);
        buildingmap.setCenter(marker.getPosition());
    }, 1000);
});

$("body").on("click", ".ffmap", function(e) {
    e.preventDefault();
    if (!(typeof google === 'object' && typeof google.maps === 'object')) {
        loadScript();
    }
    setTimeout(function() {
        clearMarkers();
        addMarkers(buildingmap, buildingsfeed);
        buildingmap.setCenter(new google.maps.LatLng(34.397, -83.644));
    }, 1000);
});