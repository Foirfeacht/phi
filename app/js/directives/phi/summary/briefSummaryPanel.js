/**
 * @ngdoc directive
 * @name directives.briefSummaryPanel
 * @author
 * @description
 * 
 * <p>
 * </p>
 * 
 * <p>
 * see briefSummaryPanelExperiment.js for an example of usage
 * </p>
 */
app.directive('briefSummaryPanel', [ '$timeout', '$parse', '$http', '$q', function($timeout, $parse, $http, $q) {
  return {
    restrict : 'E',
    replace : true,
    transclude : true,
    templateUrl : "partials/directives/phi/summary/briefSummaryPanel.html",
    scope : {
      'title' : '@',
      'id' : '@',
      'panelState' : "="
    },
    link : function(scope, element, attrs, controller) {
      if (!scope.panelState) {
        scope.panelState = {};
      }
      if (scope.panelState.isCollapsed === undefined) {
        scope.panelState.isCollapsed = false;
      }
      if (scope.panelState.color === undefined) {
        scope.panelState.color = "#bce8f1";
      }

      scope.$watch("panelState", function(newVal) {
        scope.applyPanelSettings();
      });

      function calculateFontColor(backgroundColor) {
        var r = parseInt(backgroundColor.substr(1, 2), 16);
        var g = parseInt(backgroundColor.substr(3, 2), 16);
        var b = parseInt(backgroundColor.substr(5, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
      }

      scope.applyPanelSettings = function() {
        element.css('border-color', scope.panelState.color);
        element.find("div.panel-heading").css('background-color', scope.panelState.color);
        element.find("div.panel-heading").css('color', calculateFontColor(scope.panelState.color));
      };
      scope.applyPanelSettings();

      scope.toggleCollapseStatus = function() {
        scope.panelState.isCollapsed = !scope.panelState.isCollapsed;
      };

      element.find(".dashboardPanelColorBtn").colorpicker({
        color : scope.panelState.color
      }).on('changeColor', function(ev) {
        var color = ev.color.toHex();
        scope.$apply(function() {
          scope.panelState.color = color;
        })
        scope.applyPanelSettings();
      });
    }
  };
} ]);
