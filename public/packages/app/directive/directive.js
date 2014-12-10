"user strict"

var bloggerAppDirective = angular.module("bloggerApp.directive",[]);

bloggerAppDirective.directive('holder', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$set('data-src', attrs.holder);
      Holder.run({images:element[0]});
    }
  };
});