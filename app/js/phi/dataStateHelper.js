app.factory('dataStateHelper', [ '$http', '$q', 'phiContext', function($http, $q, phiContext) {
  return {
    // *** DIRTY HELPERS ***
    "isDirty" : function(obj) {
      var isDirty = false;
      if (obj) {
        // This flag is setting by listening of editing forms or as some kind of cache at the end of this function
        if (obj.$dirty) {
          return true;
        }
        // Sometimes data entries have difficult functions for determining flag (usually if serious nesting)
        if (obj.$dirtyFn) {
          var resultOfDirtyFn = obj.$dirtyFn();
          if (resultOfDirtyFn){
            isDirty = true;
          }
        }
        // Compare with backup
        if (obj.$backup){
          var currentAndBackupAreTheSame = angular.equals(obj, obj.$backup);
          if (!currentAndBackupAreTheSame) {
            isDirty = true;
          }
        }
        if (isDirty) {
          obj.$dirty = true;
        }
      }
      return isDirty;
    },
    "isAnyDirtyInArray" : function(arr) {
      var isDirty = false;
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i];
          if (this.isDirty(el)) {
            isDirty = true;
            return isDirty;
          }
        }
      }
      return isDirty;
    },
    "extractOnlyDirtyFromArray" : function(arr) {
      var onlyDirty = [];
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i];
          if (this.isDirty(el)) {
            onlyDirty.push(el);
          }
        }
      }
      return onlyDirty;
    },

    // *** VALID HELPERS ***
    "isValid" : function(obj) {
      var isValid = true;
      if (obj) {
        // Sometimes data entries have difficult functions for determining flag (usually if serious nesting)
        if (!obj.active) {
          return true;
        }
        if (obj.$invalidFn) {
          isValid = !obj.$invalidFn();
        }
        if (obj.$invalid) {
          isValid = false;
        }
      }
      return isValid;
    },
    "isEverythingValidInArray" : function(arr) {
      var isValid = true;
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i];
          if (!this.isValid(el)) {
            isValid = false;
            return isValid;
          }
        }
      }
      return isValid;
    },
    "markDirty" : function(obj) {
      obj.$dirty = true;
    },
    "markPristine" : function(obj) {
      obj.$dirty = false;
    },

    // *** SELECTED HELPERS ***
    "isSelected" : function(obj) {
      if (obj && obj.$selected) {
        return true;
      }
      return false;
    },
    "isAnySelectedInArray" : function(arr) {
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var isSelected = this.isSelected(arr[i]);
          if (isSelected) {
            return true;
          }
        }
      }
      return false;
    },
    "getSelectedFromArray" : function(arr) {
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var isSelected = this.isSelected(arr[i]);
          if (isSelected) {
            return arr[i];
          }
        }
      }
    },
    "getAllSelectedFromArray" : function(arr) {
      if (arr) {
        var selected = [];
        for (var i = 0; i < arr.length; i++) {
          var isSelected = this.isSelected(arr[i]);
          if (isSelected) {
            selected.push(arr[i]);
          }
        }
        return selected;
      }
    },
    "markSelected" : function(obj) {
      obj.$selected = true;
    },
    "markNotSelected" : function(obj) {
      obj.$selected = false;
    },
    "extractIdOfSelectedItemIfAny" : function(arr) {
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i];
          if (el.$selected) {
            return el.id;
          }
        }
      }
    },
    "markItemWithIdAsSelected" : function(idOfSelectedVital, arr) {
      if (!idOfSelectedVital) {
        return;
      }
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i];
          if (idOfSelectedVital === el.id) {
            el.$selected = true;
          }
        }
      }
    },
    "toggleSelectionOnItem" : function(target, valueset) {
      // Toggle flag for target
      if (target) {
        if (this.isSelected(target)) {
          this.markNotSelected(target);
        } else {
          this.markSelected(target);
        }
      }
      // Reset flag for the rest
      for (var i = 0; i < valueset.length; i++) {
        var el = valueset[i];
        if (el !== target) {
          this.markNotSelected(el);
        }
      }
    },

    // *** BACKUP HELPERS ***
    "backupSingle" : function(obj) {
      obj.$backup = angular.copy(obj);
    },
    "backupAllInArray" : function(arr) {
      arr.forEach(function(el) {
        el.$backup = angular.copy(el);
      });
    }
  };
} ]);