app.factory('bootsrapCustomModule', [ "$location", "$q", "phiCustomModulesUtils", "vault", "vaultQ", "dynamicDirectiveManager",
    function($location, $q, phiCustomModulesUtils, vault, vaultQ, dynamicDirectiveManager) {

      function getDirectiveNames(manifestObj) {
        var directiveNames = [];
        if (!manifestObj) {
          return directiveNames;
        }
        if (!manifestObj.resourcesPaths) {
          return directiveNames;
        }

        var storeId = manifestObj.storeId;

        var jsFileNameRegexp = /.*\/(\w+)\.js/;

        for (var i = 0; i < manifestObj.resourcesPaths.length; i++) {
          var resourcePath = manifestObj.resourcesPaths[i];

          var jsMatch = jsFileNameRegexp.exec(resourcePath);
          if (jsMatch) {
            var fileNameWithoutExt = jsMatch[1];

            var correspondingConfigPath = phiCustomModulesUtils.getDynamicDirectiveConfigPath(storeId, fileNameWithoutExt);

            var correspondingConfigExists = _.indexOf(manifestObj.resourcesPaths, correspondingConfigPath) >= 0;
            if (correspondingConfigExists) {
              directiveNames.push(fileNameWithoutExt);
            }
          }
        }
        return directiveNames;
      }

      function toDash(str) {
        return str.replace(/([A-Z])/g, function($1) {
          return "-" + $1.toLowerCase();
        });
      }

      // returns a promise with a fully prepared manifest object

      /*
       * { storeId:String, title:String, navigationPriority:Number,
       * resourcesPaths: String[], mainDirective: String }
       */
      return function bootsrapCustomModule(storeId, scope) {
        var deferred = $q.defer();

        // Get manifest for this module
        var moduleManifestPath = phiCustomModulesUtils.getCustomModuleManifestPath(storeId);
        vaultQ.getLatest(moduleManifestPath).then(function(record) {
          // Extract module manifest object
          var manifestObj = record.obj;

          // Extract dynamic directives names for this module
          var directivesNames = getDirectiveNames(manifestObj);

          // Directives Configs promises
          var directiveConfigsPromices = [];
          for (var i = 0; i < directivesNames.length; i++) {
            var directiveName = directivesNames[i];

            // Load config for dynamic directive
            var directiveConfigPath = phiCustomModulesUtils.getDynamicDirectiveConfigPath(storeId, directiveName);

            // Build promise and store it into temp array
            var directiveConfigsPromice = vault.get(directiveConfigPath);
            directiveConfigsPromices.push(directiveConfigsPromice);
          }

          // Wait for all dyndirective configs promices
          $q.all(directiveConfigsPromices).then(function(dirConfigs) {
            var jsFilesCntExpecting = 0;
            var jsFilesCntProcessed = 0

            for (var i = 0; i < dirConfigs.length; i++) {
              var dirConfig = dirConfigs[i];
              var directiveName = directivesNames[i];

              if (!dirConfig.isActive) {
                // Skip inactive directives
                return;
              }

              jsFilesCntExpecting++;

              // Load JS resource
              var jsFilePath = phiCustomModulesUtils.asResource(phiCustomModulesUtils.getDynamicDirectiveJsPath(storeId, directiveName));
              requirejs.require([ jsFilePath ], function(directiveModule) {
                // If directive is top-level
                if (dirConfig.isTopLevel) {
                  // Set-up bootstrap of dynamic directive
                  manifestObj.mainDirective = toDash(directiveModule.name);
                }
                // Compile dynamic directive
                scope.$apply(function() {
                  dynamicDirectiveManager.registerDirective(directiveModule.name, directiveModule.directive);

                  jsFilesCntProcessed++;

                  if (jsFilesCntProcessed == jsFilesCntExpecting) {
                    // it is time to resolve promise
                    deferred.resolve(manifestObj);
                  }
                });
              });
            }
          }, function(error) {
            // Error on getting dyndirective configs
            deferred.reject(error);
          });
        }, function(error) {
          // Error on getting module manifest configs
          deferred.reject(error);
        })
        return deferred.promise;
      }
    } ]);