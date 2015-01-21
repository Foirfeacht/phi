defineDynamicDirective(function() {
  return {
    name : 'customVitals',
    directive : [ '$q', '$filter', 'phiCustomModuleDataService', 'dashboardService', 'vault',
        function($q, $filter, phiCustomModuleDataService, dashboardService, vault) {
          return {
            restrict : 'E',
            scope : {
              'phiData' : '='
            },
            templateUrl : '../data_vault/store/customVitalsStoreId/phi/directives/items/customVitals.html',
            link : function(scope, element, attrs, controller) {
              // Load render template
              var dashboardRenderTmplPath = "/store/customVitalsStoreId/phi/directives/items/customVitalsDashboardPanel.html";
              vault.getRaw(dashboardRenderTmplPath).then(function(dashboardRenderTmpl) {
                scope.dashboardRenderTmpl = dashboardRenderTmpl;
                // Initial loading of data
                return phiCustomModuleDataService.getData('customVitalSignItems');
              }).then(function(data) {
                if (!data) {
                  // Start from empty array
                  data = phiCustomModuleDataService.initData('customVitalSignItems', []);
                }
                scope.items = data;
                dashboardService.addDynamicPanel('customVitalsDashboardPanel', 'Custom Vitals', scope.dashboardRenderTmpl, data);
              });

              // Should return a promise with 'newly constructed' entry
              scope.addNewItem = function() {
                var newVital = {
                  'id' : UUID.generate(),
                  'date' : new Date(),
                  'active' : true
                };
                return $q.when(newVital);
              };

              // Vitals-specific functions
              scope.isRelevant = function(vitalSign) {
                return vitalSign.status !== 'NotEntered';
              };
              scope.notEnteredCheckboxTouched = function(vitalSign) {
                if (vitalSign && vitalSign.notEntered) {
                  if (!vitalSign.notEnteredReason) {
                    vitalSign.notEnteredReason = 'NoReasonIdentified';
                  }
                }
              };
              scope.onHeightOutOfScopeChanged = function(vitalSign) {
                if (vitalSign.heightOutOfScope) {
                  vitalSign.height = undefined;
                  vitalSign.bmi = undefined;
                }
              };
              scope.onWeightOutOfScopeChanged = function(vitalSign) {
                if (vitalSign.weightOutOfScope) {
                  vitalSign.weight = undefined;
                  vitalSign.bmi = undefined;
                }
              };
              scope.initHeightUnits = function(vitalSign) {
                if (vitalSign.height && vitalSign.height.value && !vitalSign.height.units) {
                  vitalSign.height.units = 'in';
                }
              };
              scope.initWeightUnits = function(vitalSign) {
                if (vitalSign.weight && vitalSign.weight.value && !vitalSign.weight.units) {
                  vitalSign.weight.units = 'lbs';
                }
              };
              scope.initBpUnits = function(bp) {
                if (bp && bp.value && !bp.units) {
                  bp.units = 'mmHg';
                }
              };
              scope.recalculateBmi = function(vitalSign) {
                var heightInInches = convertHeightToInches(vitalSign.height);
                var weightInLbs = convertWeightToLbs(vitalSign.weight);
                if (heightInInches && weightInLbs) {
                  var bmi = weightInLbs * 703.0695796 / (heightInInches * heightInInches);
                  bmi = Math.round(bmi * 100) / 100;
                  vitalSign.bmi = bmi;

                } else {
                  vitalSign.bmi = undefined;
                }
              };

              function convertHeightToInches(height) {
                if (!height || !height.value) {
                  return undefined;
                }
                switch (height.units) {
                case 'in':
                  return height.value;
                case 'cm':
                  return height.value * 0.393700787;
                default:
                  break;
                }
              }

              function convertWeightToLbs(weight) {
                if (!weight || !weight.value) {
                  return undefined;
                }
                switch (weight.units) {
                case 'lbs':
                  return weight.value;
                case 'kg':
                  return weight.value * 2.20462262;
                default:
                  break;
                }
              }
            }
          };
        } ]
  }
});