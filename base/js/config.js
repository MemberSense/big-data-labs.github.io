// Sample configuration options for removing hard-coded values from recall.js (and possibly smartWidget.js)

// Use different config.js for localhost settings or include here?

// feed-related options

var 
// Default to Georgia Capital
    fblat = '33.749',
    fblon = '-84.387',
    fbdistance = 3000, // if not miles not entered default to 3000 meters else convert miles to meters
    fql_place_page = '{"q1": "SELECT checkin_count, content_age, description, display_subtext, geometry, is_city, is_unclaimed, latitude, longitude, name, page_id, pic, pic_big, pic_crop, pic_large, pic_small, pic_square, search_type, type, distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\') FROM place WHERE distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\') < \'' + (fbdistance > 50000 ? 50000 : fbdistance) + '\' AND type=\'PLACE\' ORDER BY distance(latitude, longitude, \'' + fblat + '\', \'' + fblon + '\')", "q2": "select page_id, location from page where page_id in (select page_id from #q1)"}';

feedUrlPlaces = 'https://graph.facebook.com/fql?q=' + encodeURIComponent(fql_place_page) + '&format=json&suppress_http_code=1&access_token=117370968285365%7C5XkqBE8fUp29ZaTRAMTmAAfCFvk',
feedTypePlaces = 'places';

var feedOptions = [
/*{
    className: "",
    detailsSelector: "#ItemInfoContentDiv",
    detailsUrl: "http://georgiafacts.org/info/{0}?mode=a&tid=16400",
    headerText: "Available Buildings",
    maxGallerySummaryLength: 350,
    maxSummaryHeadlineLength: 50,
    provider: "georgia",
    showCheckBoxes: false,
    type: "locations",
    url: "http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=?"
},

{
    className: "",
    detailsSelector: "#ItemInfoContentDiv",
    detailsUrl: "http://georgiafacts.org/info/{0}?mode=a&tid=31030",
    headerText: "Manufacturers",
    maxGallerySummaryLength: 350,
    maxSummaryHeadlineLength: 50,
    provider: "",
    showCheckBoxes: false,
    type: "locations",
    url: "http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=31030&callback=?"
},*/
{
    className: "",
    detailsSelector: "#ItemInfoContentDiv",
    detailsUrl: "https://groups.google.com/forum/feed/npu-w-agendas--minutes/msgs/rss_v2_0.xml?num=50&callback=?",
    headerText: "Google Agendas Feed",
    maxGallerySummaryLength: 350,
    maxSummaryHeadlineLength: 50,
    provider: "google",
    showCheckBoxes: false,
    type: "googlefeed",
    url: "../nearby/npu-w-agendas--minutes.xml",
    dataType: "xml",
    slickdiv:"#agendas"
},
{
    className: "",
    detailsSelector: "#ItemInfoContentDiv",
    detailsUrl: "https://groups.google.com/forum/feed/nput_members/msgs/rss_v2_0.xml?num=50&callback=?",
    headerText: "Google Members Feed",
    maxGallerySummaryLength: 350,
    maxSummaryHeadlineLength: 50,
    provider: "google",
    showCheckBoxes: false,
    type: "googlefeed",
    url: "../nearby/nput_members.xml",
    dataType: "xml",
    slickdiv:"#members"
}/*,
{
    url: feedUrlPlaces,
    type: feedTypePlaces,
    provider: 'Facebook',
    className: '',
}*/
];

// general options (initial display - no feeds loaded)
var configOptions = {
    "background": "http://georgiafacts.org/facts/images/bkgd/buildings.jpg"
};

// can also define feed options within config options
var configOptions1 = {
    background: "http://georgiafacts.org/facts/images/bkgd/buildings.jpg",
    feeds: [{
    // feed 1 options
    },
    {
    // feed 2 options
    }]
};

/*
feed = {
    url: feedUrl,
    type: feedType,
    provider: '',
    headerText: headerText,
    className: '',
    detailsUrl: detailsUrl,
    detailsSelector: detailsSelector
};
*/