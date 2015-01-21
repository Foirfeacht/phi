'use strict';

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/dyndirective', {
		templateUrl : 'partials/dyndirectivesList.html',
		controller : 'DyndirectivesListCtrl'
	});
} ])

app.controller('DyndirectivesListCtrl', [
		"$scope",
		"phiContext",
		"vaultQ",
		"phiCustomModulesUtils",
		function($scope, phiContext, vaultQ, phiCustomModulesUtils) {
			phiContext.init("samplePatientId", "sampleProviderId");
			
			var allModulesManifestPath = phiCustomModulesUtils.getAllModulesManifestPath();
			
			vaultQ.getLatest(allModulesManifestPath).then(function(manifestRec){
				var manifest = manifestRec.obj;
				var storeIds = manifest.storeIds;
				$scope.storeIds = storeIds;
			}, function(error){
				console.log();
			});
		} ]);