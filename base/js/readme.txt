SMARTWIDGET PROGRAMMING GUIDELINES

Avoid the use of jQuery selectors that don’t have a context. Within the widget use a context so that the elements that are selected are only for the current widget and not all the widgets on the page. By default, the context is the entire DOM, so it’s better to use the $...Container variables as the context. Example:
 
Use:
$('.toggleSlides, .toggleGallery', $widgetContainer).show();
 
Rather than this:
$('.toggleSlides, .toggleGallery').show();
 
You can also use $galleryContainer, $listContainer, etc. as the context. The more focused the context, the less work jQuery has to do to find the elements you want to work with.

------------

Note: The following applied as an attempt to fix the error that occurred when Bing map was loaded dynamically in the widget. The error still occurred intermittently so the Bing map code is now loaded from the page. See the following note after this one. The technique below can still be applied for other plugins perhaps.

For pages that need to load the widget when the page loads, 
load the widget in the window load handler: $(window).on('load', function ()
This will prevent errors from occurring if supporting .js files are still loading.
You can still use document.ready for setting up click handlers and showing/hiding UI elements.

------------

Load the Bing Map in the page rather than dynamically in the widget. Intermittent errors can occur when the Bing map code isn't fully loaded. Bing has no 'loaded' callback like google has. The error you will see in Firefox is:

Error: TypeError: Microsoft.Maps.Location is not a constructor

