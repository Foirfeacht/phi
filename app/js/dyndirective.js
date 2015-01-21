'use strict';

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/dyndirective/:storeId/', {
		templateUrl : 'partials/dyndirective.html',
		controller : 'DyndirectiveCtrl'
	});
} ])

app.controller('DyndirectiveCtrl', [
		"$scope",
		"$routeParams",
		"phiContext",
		"bootsrapCustomModule",
		"phiCustomModuleDataService",
		"dashboardService",
		"vaultQ",
		function($scope, $routeParams,
				phiContext, bootsrapCustomModule,
				phiCustomModuleDataService, dashboardService, vaultQ) {
		  
		  // Tabs driver
		  $('#phiEmulatorTabs li a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
		  
		  $scope.dynamicDashboardPanels = dashboardService.dynamicDashboardPanels;
		  
			phiContext.init("samplePatientId", "sampleProviderId");

			var storeId = $routeParams.storeId;
			$scope.storeId = storeId;

			$scope.phiData = {};

			$scope.$watch("storeId", function(storeId) {
				bootsrapCustomModule(storeId, $scope).then(
						function(manifestObj) {
							$scope.customModuleManifest = manifestObj;
						}, function(error) {
						  console.log(error);
						})
			});
			
			// Load standard PHI body data
			
			$scope.reloadPhiBodyData = function() {
			  vaultQ.getLatest("/phi/data/phibody/sampleProviderId/samplePatientId.json").then(function(phiDataRec){
			    $scope.phiData = phiDataRec.obj;
        }, function(error){
          
        });
			};
			$scope.reloadPhiBodyData();
			
			$scope.savePhiBodyData = function(phiData){
			  vaultQ.put("/phi/data/phibody/sampleProviderId/samplePatientId.json", phiData).then(function(phiDataRec){
			    $scope.reloadPhiBodyData();
        }, function(error){
          console.log(error);
        });
			}

			$scope.reload = function() {
				$scope.reloadPhiBodyData();
				phiCustomModuleDataService.reloadAllData();
			};
			
			$scope.saveChanges = function() {
			  $scope.savePhiBodyData($scope.phiData);
				phiCustomModuleDataService.saveAllData();
			};

			$scope.discardChanges = function() {
				phiCustomModuleDataService.discardAllChanges();
			};
			
			$scope.moveToItem = function(storeId, itemId){
			  $("#phiEmulatorTabs li a[href=#directiveTab]").tab('show');
			  phiCustomModuleDataService.selectItemWithId(itemId);
			}
} ]);

function defineDynamicDirective(dynDirectiveObjFactory) {
	requirejs.define([], function() {
		return dynDirectiveObjFactory();
	});
}