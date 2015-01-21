app.directive('renderDynamicPanel', [ '$compile', function($compile) {
  return {
    restrict : 'A',
    replace : true,
    scope : true,
    link : function(scope, element, attrs, controller) {
      var dynamicPanelDef = scope.dynamicPanel;
      scope.data = dynamicPanelDef.data;
      var renderTmpl = dynamicPanelDef.renderTmpl;
      $compile(renderTmpl)(scope).appendTo(element);
    }
  }
} ]);
