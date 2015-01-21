app.factory('phiCustomModulesUtils', [ function() {
  return {
    'getAllModulesManifestPath' : function() {
      return "/store/manifest.json";
    },

    'getCustomModuleManifestPath' : function(storeId) {
      return "/store/" + storeId + "/phi/directives/manifest.json";
    },

    'getDynamicDirectiveConfigPath' : function(storeId, directiveName) {
      return "/store/" + storeId + "/phi/directives/items/" + directiveName + ".config.json";
    },

    'getDynamicDirectiveJsPath' : function(storeId, directiveName) {
      return "/store/" + storeId + "/phi/directives/items/" + directiveName + ".js";
    },

    'getDynamicDirectiveResourcePath' : function(storeId, resourceName) {
      return "/store/" + storeId + "/phi/directives/items/" + resourceName;
    },

    'asResource' : function(path) {
      return "../data_vault" + path;
    }
  }
} ]);