var buildingmap = null, buildingsfeed = [];
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
function setMarkers() {
    var len = buildingsfeed.length;
    for(var i = 0; i < len; i++) {
        var building = buildingsfeed[i],
            latlng = new google.maps.LatLng(building.lat, building.lng),
            marker = new google.maps.Marker({
                position: latlng,
                map: buildingmap,
                icon: building.thumbnail,
                title: building.heading,
            });
    }
    // $("#map-canvas").css("height", "1000px");
}
function setMarker() {
    
}
$.ajax({
    url: "../feed/json/buildings.json",
    // url: "http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=?&tid=16400",
    // jsonp: "callback",
    // Tell jQuery we're expecting JSONP
    // dataType: "jsonp",
    // Work with the response
    success: function( data ) {
        console.log( data ); // server response
        var items = data.items;
        var images = [];
        var feeds = [];
        
        for(item in items) {
            
            var feed = {};
            feed["heading"] = items[item].title;
            feed["thumbnail"] = "";
            feed["alt"] = "";
            
            if(_.isArray(items[item].images)) {
                for(image in items[item].images) {
                    
                    var lat=_.isNull(items[item].venue) ? "" : _.isNull(items[item].venue.latitude) ? "" : items[item].venue.latitude,
                        lng=_.isNull(items[item].venue) ? "" : _.isNull(items[item].venue.longitude) ? "" : items[item].venue.longitude;
                        
                    feed["lat"] = lat;
                    feed["lng"] = lng;
                    
                    images.push('<div class="wrapper"><img data-lazy="' + items[item].images[image].large + '"/><div class="more-info-overlay"><h3 class="margin-5px">' + items[item].images[image].title + ' <a href="#" class="sfmap" data-lat="' + lat +'" data-lng="' + lng +'"> <span class="label label-primary">Map</span></a></h3></div>');
                    feed["thumbnail"] = _.isUndefined(items[item].images[image].thumbnail) ? "" : items[item].images[image].thumbnail;
                    feed["alt"] = items[item].images[image].title;
                }
            }
            
            feeds.push('<div class="media"><div class="media-left media-middle"><a href="#"><img class="media-object" src="' + feed["thumbnail"] +'" alt="' + feed["alt"] +'"></a></div><div class="media-body"><h4 class="media-heading">' + feed["heading"] +'</h4></div></div>');
            
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
        
        $(".feedlist").append(feeds);
    }
});

$("body").on("click", ".sfmap", function(e) {
    e.preventDefault();
    alert("map - lat:" + $(this).data("lat") + ", lng:" + $(this).data("lng"));
    // load gmap script if not already loaded.
    
    if (!(typeof google === 'object' && typeof google.maps === 'object')) {
        loadScript();
    }
});

$("body").on("click", ".ffmap", function(e) {
    e.preventDefault();
    if (!(typeof google === 'object' && typeof google.maps === 'object')) {
        loadScript();
    }
    setTimeout(function() {
        setMarkers();
    }, 1000);
});