module.exports = function(grunt) {
  
  var usage = 'Usage: "grunt restoreDefaultPhiPayloadData"';
  
  grunt.registerTask("restoreDefaultPhiPayloadData", "Restore Default Phi Payload Data", function(){
    grunt.file.delete("data_vaultq/phi/data");
    grunt.file.mkdir("data_vaultq/phi/data");
    grunt.file.recurse("data_phi_payload_default", function (abspath, rootdir, subdir, filename) {
      grunt.file.copy(abspath, "data_vaultq/phi/data/"+subdir+"/"+filename);
    });
    
    grunt.log.write("Default PHI payload data were restored");
  });
}