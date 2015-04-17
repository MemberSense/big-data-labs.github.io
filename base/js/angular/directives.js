angular.module('contactsApp.directives',['ionic'])
.directive('imScroll',function(){

	return {
		restrict : 'A',
		link:function(scope,element,attrs)
		{
			element.on('scroll',function(e){
				console.log(e.detail.scrollTop, e.detail.scrollLeft);
			})
		}
	}
})

/*global define:false */
angular.module('imgLoader', []).directive('imageLoader', [function() {
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


