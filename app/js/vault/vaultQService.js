app.factory('vaultQ', [ '$http', '$q', '$resource', function($http, $q, $resource) {
  return {
    "getLatest" : function(path) {
      var that = this;

      var deferred = $q.defer();
      that.getLatestRaw(path).then(function(rawRecord) {
        if (rawRecord && rawRecord.obj) {
          rawRecord.obj = JSON.parse(rawRecord.obj);
        }
        deferred.resolve(rawRecord);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "getLatestBatch" : function(paths) {
      var that = this;

      var deferred = $q.defer();
      that.getLatestRawBatch(paths).then(function(rawRecords) {
        for (var i = 0; i < rawRecords.length; i++) {
          var rawRecord = rawRecords[i];
          if (rawRecord && rawRecord.obj) {
            rawRecord.obj = JSON.parse(rawRecord.obj);
          }
        }
        deferred.resolve(rawRecords);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "getLatestRaw" : function(path) {
      var that = this;

      var deferred = $q.defer();

      $http.get('/data_vaultq' + path, {
        transformResponse : []
      }).then(function(res) {
        var rawObj = res.data;
        var cnt = 0;

        var record = {
          "obj" : rawObj,
          "cnt" : cnt
        }
        deferred.resolve(record);
      }, function(error) {
        console.log(error.data);
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "getLatestRawBatch" : function(paths) {
      var that = this;

      var deferred = $q.defer();

      var promices = [];
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var promise = $http.get('/data_vaultq' + path, {
          transformResponse : []
        });
        promices.push(promise);
      }

      $q.all(promices).then(function(responces) {
        var batchPortionResults = [];
        for (var j = 0; j < responces.length; j++) {
          var responce = responces[j].data;

          var path = paths[j]

          var batchPortionResult = {
            "path" : path,
            "obj" : responce,
            "cnt" : 0,
          }
          batchPortionResults.push(batchPortionResult);
        }
        deferred.resolve(batchPortionResults);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "put" : function(path, obj, currentCnt) {
      var that = this;
      var stringifiedObj = angular.toJson(obj, true);
      return that.putRaw(path, stringifiedObj, currentCnt);
    },

    "putRaw" : function(path, stringifiedObj, currentCnt) {
      var that = this;

      var deferred = $q.defer();
      $http.post('/data_vaultq' + path, stringifiedObj, {
        transformRequest : [],
        headers : {
          'Content-Type' : 'application/octet-stream'
        }
      }).then(function(res) {
        deferred.resolve();
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }
} ]);