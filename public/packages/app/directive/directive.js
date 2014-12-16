"use strict"

var bloggerAppDirective = angular.module("bloggerApp.directive",[]);

bloggerAppDirective.directive('holder', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$set('data-src', attrs.holder);
      Holder.run({images:element[0]});
    }
  };
});

bloggerAppDirective.directive("marked",[
  "$sanitize",
  function ($sanitize) {
	marked.setOptions({
		renderer: new marked.Renderer(),
		highlight: function (code) {
			return hljs.highlightAuto(code).value;
		},
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: true
	});

    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.marked) {
          scope.$watch(attrs.marked, function (newVal) {
            var html = newVal ? $sanitize(marked(newVal)) : '';
            element.html(html);
          });
        } else {
          var html = $sanitize(marked(element.text()));
          element.html(html);
        }
      }
    };
}]);