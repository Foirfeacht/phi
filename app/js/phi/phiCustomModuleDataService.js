app.factory('phiCustomModuleDataService', [ '$http', '$q', 'phiContext', 'dataStateHelper', 'vaultQ',
    function($http, $q, phiContext, dataStateHelper, vaultQ) {
      function getPathForDataType(dataType) {
        var path = "/phi/data/" + dataType + "/" + phiContext.providerId + "/" + phiContext.patientId + ".json";
        return path;
      }

      return {
        "data" : {},

        "getData" : function(dataType) {
          var deferred = $q.defer();
          var that = this;

          var path = getPathForDataType(dataType);

          if (that.data[path]) {
            deferred.resolve(that.data[path]);
          } else {
            that.loadData(path).then(function(data) {
              deferred.resolve(data);
            }, function(error) {
              console.log(error.data);
              deferred.reject(error);
            });
          }
          return deferred.promise;
        },

        "initData" : function(dataType, initialData) {
          var that = this;
          var path = getPathForDataType(dataType);
          var dataRecord = {
            'obj' : initialData,
            'cnt' : 0
          }
          var data = that.storeInInternalDataCache(path, dataRecord);
          return data;
        },

        // /phi/data/{{dataType}}/{{providerId}}/{{patientId}}
        "loadData" : function(path) {
          var deferred = $q.defer();
          var that = this;

          vaultQ.getLatest(path).then(function(dataRecord) {
            var data = that.storeInInternalDataCache(path, dataRecord);
            deferred.resolve(data);
          }, function(error) {
            console.log(error.data);
            deferred.reject(error);
          })
          return deferred.promise;
        },

        "storeInInternalDataCache" : function(path, dataRecord) {
          var that = this;

          // Clear previous data in cache or init
          if (that.data[path]) {
            if (Array.isArray(that.data[path])) {
              that.data[path].splice(0, that.data[path].length);
            } else {
              that.data[path] = {};
            }
          }

          // Put data got from the server
          if (dataRecord && dataRecord.obj) {
            var obj = dataRecord.obj;
            if (Array.isArray(obj)) {
              if (!that.data[path]) {
                // First init
                that.data[path] = [];
              }
              // if array
              for (var i = 0; i < obj.length; i++) {
                var singleItem = obj[i];
                // Backup data
                that.backupSingle(singleItem)
                // Put to the cache
                that.data[path].push(singleItem);
              }
            } else {
              // if single plain object
              that.backupSingle(obj)
              // Backup data
              // Put to the cache
              that.data[path] = obj;
            }
          }

          if (that.data[path]) {
            // Put current counter
            if (dataRecord && dataRecord.cnt) {
              that.data[path].$currentCnt = dataRecord.cnt;
            } else {
              that.data[path].$currentCnt = 0;
            }
            // Update timestamp for thiggering client watches on this data
            that.data[path].timestamp = new Date();
          }
          return that.data[path];
        },

        "reloadAllData" : function() {
          var deferred = $q.defer();
          var that = this;

          var paths = _.keys(that.data);
          if (paths && paths.length) {
            vaultQ.getLatestBatch(paths).then(function(dataRecords) {
              for (var i = 0; i < dataRecords.length; i++) {
                var dataRecord = dataRecords[i];
                that.storeInInternalDataCache(dataRecord.path, dataRecord);
              }
              deferred.resolve(that.data);
            }, function(error) {
              console.log(error.data);
              deferred.reject(error);
            })
          } else {
            deferred.resolve(that.data);
          }

          return deferred.promise;
        },

        "saveAllData" : function() {
          var that = this;
          for ( var path in that.data) {
            if (that.data.hasOwnProperty(path)) {
              var isAnyDirtyDataForPath = that.isAnyDirtyDataForPath(path);
              if (isAnyDirtyDataForPath) {
                vaultQ.putRaw(path, angular.toJson(that.data[path], true), that.data[path].$currentCnt).then(function(res) {
                  that.loadData(path);
                }, function(error) {
                  console.log(error.data);
                });
              }
            }
          }
        },

        "discardAllChanges" : function() {
          var that = this;
          for ( var dataType in that.data) {
            if (Array.isArray(that.data[dataType])) {

              var data = that.data[dataType];
              var dataCopy = data.concat();

              for (var i = 0; i < dataCopy.length; i++) {
                var el = dataCopy[i];
                var backup = el.$backup;
                if (backup) {
                  var restoredEl = angular.copy(backup);
                  that.backupSingle(restoredEl);
                  // Replace with backup
                  data.splice(data.indexOf(el), 1, restoredEl);
                } else {
                  // No backup - means it is newly added - just remove
                  data.splice(data.indexOf(el), 1);
                }
              }

              // Update timestamp for thiggering client watches on this data
              data.timestamp = new Date();
            }
          }
        },

        // *** BACKUP HELPERS ***
        "backupSingle" : function(obj) {
          dataStateHelper.backupSingle(obj);
        },

        // *** DIRTY HELPERS ***
        "isDirty" : function(obj) {
          return dataStateHelper.isDirty(obj);
        },
        "isAnyDirtyData" : function() {
          var that = this;

          for ( var path in that.data) {
            if (that.data.hasOwnProperty(path)) {
              var isAnyDirtyDataForPath = that.isAnyDirtyDataForPath(path);
              if (isAnyDirtyDataForPath) {
                return true;
              }
            }
          }
          return false;
        },
        "isAnyDirtyDataForPath" : function(path) {
          var that = this;

          if (that.data.hasOwnProperty(path)) {
            if (Array.isArray(that.data[path])) {
              var data = that.data[path];
              for (var i = 0; i < data.length; i++) {
                var dataEntry = data[i];
                if (that.isDirty(dataEntry)) {
                  return true;
                }
              }
            } else {
              return that.isDirty(that.data[path]);
            }
          }
          return false;
        },

        // *** SELECTION HELPERS ***
        "selectItemWithId" : function(itemId) {
          var that = this;
          for ( var path in that.data) {
            if (that.data.hasOwnProperty(path)) {
              // Any array inside "data" object intended as list if PHI items
              if (Array.isArray(this.data[path])) {
                var arr = this.data[path];

                var targetEl;

                for (var i = 0; i < arr.length; i++) {
                  var el = arr[i];
                  var elId = el.id;
                  if (elId === itemId) {
                    targetEl = el;
                    break;
                  }
                }

                if (targetEl) {
                  dataStateHelper.markSelected(targetEl);
                  for (var j = 0; j < arr.length; j++) {
                    var elToUnselect = arr[j];
                    if (elToUnselect !== targetEl) {
                      dataStateHelper.markNotSelected(elToUnselect);
                    }
                  }
                  arr.timestamp = Date.now();
                }
              }
            }
          }
        },
      };
    } ]);