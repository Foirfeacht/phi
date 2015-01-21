app.factory('phiContext', [ function() {
  function generateRandomAppointmentId() {
    var rndString = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
      rndString += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return rndString;
  }

  function nowInMMDDYYYY() {
    function pad(s) {
      return (s < 10) ? '0' + s : s;
    }
    var d = new Date();
    return [ pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear() ].join('/');
  }

  var phiContext = {
    patientId : "",
    providerId : "",
    appointmentId : undefined,
    emergencyModeOn : false,

    isInitiated : function() {
      return this.patientId;
    },

    init : function(patientId, providerId) {
      this.patientId = patientId;
      this.providerId = providerId;
      this.appointmentId = generateRandomAppointmentId();
      this.emergencyModeOn = false;
    },

    getPatientId : function() {
      return this.patientId;
    },

    getProviderId : function() {
      return this.providerId;
    },

    getServiceDate : function() {
      if (window.parent) {
        if (window.parent.gwt) {
          if (window.parent.gwt.superbillParamsHolder) {
            var superbillParams = new window.parent.gwt.superbillParamsHolder();
            var serviceDate = superbillParams.getServiceDate();
            console.log("serviceDate: " + serviceDate);
            return serviceDate;
          }
        } else {
          return nowInMMDDYYYY();
        }
      }
    },

    getRenderingPhysicianId : function() {
      if (window.parent) {
        if (window.parent.gwt) {
          if (window.parent.gwt.superbillParamsHolder) {
            var superbillParams = new window.parent.gwt.superbillParamsHolder();
            var renderingPhysicianId = superbillParams.getRenderingPhysicianId();
            console.log("renderingPhysicianId: " + renderingPhysicianId);
            return renderingPhysicianId;
          }
        }
      }
    }
  };
  return phiContext;
} ]);