/**
 * @ngdoc directive
 * @name directives.phiItemsListBar
 * @author
 * @description
 * 
 * <p>
 * </p>
 * 
 * <p>
 * see phiItemsListBarExperiment.js for an example of usage
 * </p>
 */
app.directive('phiItemsListBar', [ '$timeout', '$parse', '$http', '$q', function($timeout, $parse, $http, $q) {
  return {
    restrict : 'E',
    replace : true,
    transclude : true,
    require : "^phiItemsList",
    templateUrl : "partials/directives/phi/phiItemsListBar.html",
    scope : false,
    link : function(scope, element, attrs, controller) {
      scope.attrs = {
        displayNewBtn : true
      };
      if (attrs.hideNewBtn) {
        scope.attrs.displayNewBtn = false;
      }

      scope.showRemoveConfirmation = function() {
        element.find('#removeConfirmModal').modal('show');
      };

      scope.hideRemoveConfirmation = function() {
        element.find('#removeConfirmModal').modal('hide');
      };
    }
  };
} ]);
