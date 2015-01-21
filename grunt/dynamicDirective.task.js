module.exports = function(grunt) {
  
  var usage = 'Usage: "grunt dynamicDirective:storeId:directiveName"';
  
  grunt.registerTask("dynamicDirective", "Creates a skeleton for new dynamic directive", function(storeId, directiveName){
    if (!storeId || !directiveName){
      grunt.fail.fatal(usage);
    }
    
    // Add js file
    var jsTmpl = grunt.file.read('grunt/dynamicDirective/directive.js.tmpl');
    var jsContent = grunt.template.process(jsTmpl, {data: {"storeId":storeId, "directiveName":directiveName}});
    var jsPath = '/store/'+storeId+'/phi/directives/items/'+directiveName+'.js';
    grunt.file.write('data_vault'+jsPath, jsContent);
    
    // Add config file
    var configTmpl = grunt.file.read('grunt/dynamicDirective/directive.config.json.tmpl');
    var configContent = grunt.template.process(configTmpl, {data: {}});
    var configPath = '/store/'+storeId+'/phi/directives/items/'+directiveName+'.config.json'
    grunt.file.write('data_vault'+configPath, configContent);
    
    // Add template file
    var htmlTmpl = grunt.file.read('grunt/dynamicDirective/directive.html.tmpl');
    var htmlContent = grunt.template.process(htmlTmpl, {data: {}});
    var htmlPath = '/store/'+storeId+'/phi/directives/items/'+directiveName+'.html'
    grunt.file.write('data_vault'+htmlPath, htmlContent);
    
    // Modify a manifest (add resourcesPaths)
    var moduleManifestPath = '/store/'+storeId+'/phi/directives/manifest.json';
    var moduleManifest = grunt.file.readJSON('data_vaultq'+moduleManifestPath);
    moduleManifest.resourcesPaths.push(jsPath);
    moduleManifest.resourcesPaths.push(configPath);
    moduleManifest.resourcesPaths.push(htmlPath);
    grunt.file.write('data_vaultq'+moduleManifestPath, JSON.stringify(moduleManifest, null, 2));
  });  
}