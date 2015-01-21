/**
 * @ngdoc directive
 * @name directives.phiItemForm
 * @author 
 * @description
 * 
 * <p>
 * </p>
 * 
 * <p>
 * see phiItemFormExperiment.js for an example of usage
 * </p>
 */
app.directive('phiItemForm', [ 'dataStateHelper', function(dataStateHelper) {
  return {
    restrict : 'E',
    replace : true,
    transclude : true,
    templateUrl : "partials/directives/phi/phiItemForm.html",
    scope : {
      "item":"="
    },
    link : function(scope, element, attrs, controller) {
      scope.$watch("item.$$hashKey+'_'+itemForm.$invalid", function() {
        if (scope.item) {
          scope.item.$invalid = scope.itemForm.$invalid;
        }
      });
      scope.$watch("itemForm.$dirty", function(isFormDirty) {
        if (scope.item) {
          if (isFormDirty){
            dataStateHelper.markDirty(scope.item);
          } else {
            dataStateHelper.markPristine(scope.item);
          }
        }
      });
      scope.$watch("item", function(item) {
        if (item) {
          if (dataStateHelper.isDirty(item)) {
            scope.itemForm.$setDirty();
          } else {
            scope.itemForm.$setPristine();
          }
        }
      });
    }
  };
} ]);
