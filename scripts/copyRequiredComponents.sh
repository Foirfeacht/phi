#!/bin/bash

#	Common PHI staff 
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/phiContextService.js app/js/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/dataStateHelper.js app/js/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/phiCustomModuleDataService.js app/js/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/dashboardService.js app/js/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/phiItemsList.js app/js/directives/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/phiItemsListBar.js app/js/directives/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/phiItemsListBar.html app/partials/directives/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/phiItemForm.js app/js/directives/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/phiItemForm.html app/partials/directives/phi/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/css/phi.css app/css/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/summary/briefSummaryPanel.js app/js/directives/phi/summary/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/summary/briefSummaryPanel.html app/partials/directives/phi/summary/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/summary/dynamicDashboardContentRenderer.js app/js/directives/phi/summary/

cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/lib/require-2.1.15.js app/lib/

#	Dynamic Directives Bridge 
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/custommodules/phiCustomModulesUtils.js app/js/phi/custommodules
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/custommodules/dynamicDirective.js app/js/directives/phi/custommodules/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/phi/custommodules/bootsrapCustomModule.js app/js/phi/custommodules

#	Vault (do not sync because of they are changed for using test data storage)
#cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/vault/vaultService.js app/js/vault/
#cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/vault/vaultQService.js app/js/vault/

#	Examples
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/custommodules/vitals/customVitals.js data_vault/store/customVitalsStoreId/phi/directives/items/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/custommodules/vitals/customVitals.html data_vault/store/customVitalsStoreId/phi/directives/items/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/custommodules/vitals/customVitalsDashboardPanel.html data_vault/store/customVitalsStoreId/phi/directives/items/

cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/js/directives/phi/custommodules/problems/customProblems.js data_vault/store/customProblemsStoreId/phi/directives/items/
cp ~/workspace/vericle/espoc_app/vericle-gwt/war/lwc/partials/directives/phi/custommodules/problems/customProblems.html data_vault/store/customProblemsStoreId/phi/directives/items/

echo 'Success'