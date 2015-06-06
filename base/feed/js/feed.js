$.ajax({
    url: "../feed/json/buildings.json",
    // url: "http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=?&tid=16400",
    // jsonp: "callback",
    // Tell jQuery we're expecting JSONP
    // dataType: "jsonp",
    // Work with the response
    success: function( data ) {
        console.log( data ); // server response
        var images = [];
        for(item in data.items) {
            
            for(image in data.items[item].images) {
                
                images.push('<div class="wrapper"><img data-lazy="' + data.items[item].images[image].large + '"/><div class="more-info-overlay"><h3 class="margin-5px">' + data.items[item].title + '</h3></div>');
            }
        }
        $("#imgGallery").html(images).slick({
          lazyLoad: 'ondemand',
          slidesToShow: 1,
          slidesToScroll: 1
        });
    }
});