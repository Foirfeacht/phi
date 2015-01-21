app.factory("dashboardService", [ function() {
  return {
    "dynamicDashboardPanels" : [],
    "addDynamicPanel" : function(id, title, renderTmpl, data) {
      var that = this;

      // Remove existing duplicates with same id
      var existingPanelsWithSameId = _.filter(that.dynamicDashboardPanels, function(item) {
        return item.id === id;
      });
      _.each(existingPanelsWithSameId, function(panel) {
        that.dynamicDashboardPanels.splice(that.dynamicDashboardPanels.indexOf(panel), 1);
      })

      // Construct panel definition object and store to array
      var panelDef = {
        'id' : id,
        'title' : title,
        'renderTmpl' : renderTmpl,
        'data' : data
      }
      that.dynamicDashboardPanels.push(panelDef);
    }
  }
} ]);