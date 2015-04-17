$(function () {    // document.ready event handler
    var previousFactsWidth = 1001;
    function updateFactsLayout() {
        var browserWidth = $(window).width();
        if (browserWidth <= 800 && previousFactsWidth > 800) {
            $('.desktopText').html("Desktop Version");
        } else if (browserWidth > 800 && previousFactsWidth <= 800) {
            $('.desktopText').html("More Options");
        }
        if (browserWidth <= 1000 && previousFactsWidth > 1000) {
            $('#headerLinkShovelReady').html("Sites");
            $('#headerLinkBuildings').html("Buildings");
        } else if (browserWidth > 1000 && previousFactsWidth <= 1000) {
            $('#headerLinkShovelReady').html("Shovel Ready Sites");
            $('#headerLinkBuildings').html("Find Buildings");
        }
        previousFactsWidth = $(window).width();
    }

    $(window).resize(function (e) {
        updateFactsLayout();
    });
    updateFactsLayout();
});