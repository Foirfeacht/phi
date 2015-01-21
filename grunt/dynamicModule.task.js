module.exports = function(grunt) {
  
  var usage = 'Usage: "grunt dynamicModule:storeId:directiveName"';
  
  grunt.registerTask("dynamicModule", "Creates a skeleton for new dynamic module", function(storeId, directiveName){
    if (!storeId || !directiveName){
      grunt.fail.fatal(usage);
    }  
    
    // Modify a manifest with a list of available dyn modules
    var modulesListManifest = grunt.file.readJSON('data_vaultq/store/manifest.json');
    modulesListManifest.storeIds.push(storeId);
    grunt.file.write('data_vaultq/store/manifest.json', JSON.stringify(modulesListManifest, null, 2));
    
    // Add modules manifest
    var moduleManifestTmpl = grunt.file.read('grunt/dynamicModule/moduleMainfest.json.tmpl');
    var moduleManifest = grunt.template.process(moduleManifestTmpl, {data: {"storeId":storeId}}); 
    grunt.file.write('data_vaultq/store/'+storeId+'/phi/directives/manifest.json', moduleManifest);
    
    // Add a directive to the created module
    grunt.task.run("dynamicDirective:"+storeId+":"+directiveName);
  });
}