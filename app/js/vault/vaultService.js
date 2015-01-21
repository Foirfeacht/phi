app.factory('vault', [ '$http', '$q', function($http, $q) {
  return {
    "get" : function(path) {
      var that = this;
      var deferred = $q.defer();

      that.getRaw(path).then(function(rawObj) {
        var obj = rawObj ? JSON.parse(rawObj) : rawObj;
        deferred.resolve(obj);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "getBatch" : function(paths) {
      var that = this;

      var deferred = $q.defer();
      that.getRawBatch(paths).then(function(rawRecords) {
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

    "getRaw" : function(path) {
      var that = this;

      var deferred = $q.defer();
      $http.get('/data_vault' + path, {
        transformResponse : []
      }).then(function(res) {
        var rawObj = res.data;
        deferred.resolve(rawObj);
      }, function(error) {
        console.log(error.data);
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "getRawBatch" : function(paths) {
      var that = this;
      var deferred = $q.defer();

      var promices = [];
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var promise = $http.get('/data_vault' + path, {
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
            "obj" : responce
          }
          batchPortionResults.push(batchPortionResult);
        }
        deferred.resolve(batchPortionResults);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    "put" : function(path, obj) {
      var that = this;

      var objAsJson = JSON.stringify(obj);
      return that.putRaw(path, objAsJson);
    },

    "putBatch" : function(pathsAndObjects) {
      var that = this;

      for (var i = 0; i < pathsAndObjects.length; i++) {
        var pathAndObject = pathsAndObjects[i];
        pathAndObject.obj = JSON.stringify(pathAndObject.obj);
      }

      return that.putRawBatch(pathsAndObjects);
    },

    "putRaw" : function(path, rawObj) {
      var that = this;

      var deferred = $q.defer();
      $http.post('/data_vault' + path, stringifiedObj, {
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
    },
    // [{path, obj}]
    "putRawBatch" : function(pathsAndRawObjects) {
      var that = this;
      
      var promices = [];
      for (var i = 0; i < pathsAndObjects.length; i++) {
        var pathAndObject = pathsAndObjects[i];
        var promise = that.putRaw(pathAndObject.path, pathAndObject.obj);
        promices.push(promise);
      }
      var deferred = $q.defer();
      $q.all(promices).then(function(responces) {
        deferred.resolve();
      }, function(error) {
        deferred.reject(error);
      });      
      return deferred.promise;
    },

    "remove" : function(path) {
      console.log("REMOVE doesn't supported");
      return $q.when();
    }
  }
} ]);