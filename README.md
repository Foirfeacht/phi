#phi-dynamic-directives-seed project

## Getting Started
This is a lightweight project for developing PHI custom directive modules independently from huge Vericle project and without any dependency to it.   

## Prerequisites
You must have node.js and its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).  
Also you must have an Eclipce IDE for editing directives JS/HTML/JSON source code. You can get it by rsync'ing from `cvs.espoc.com` or by downloading from [Eclipse IDE official site](https://www.eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/lunasr1)

## Get the project
Clone the repository using mercurial

    hg clone ssh://cvs.espoc.com//home/dynaui/hg/dynadoc
    
## Open in IDE
1.   Start up Eclipse
2.   File - Import - Existing Projects Into Workspace
3.   Select root directory: Choose cloned repository folder
4.   Check `phi-dynamic-directives-seed` project
5.   Finish

## Install Dependencies

* We get the tools we depend upon via `npm`
* We get the angular and third-party libraries (e.g. Bootstrap, jQuery) code via `bower`

We have preconfigured `npm` to automatically run `bower` so we can simply do in terminal:

    npm install

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/lib_bower` - contains the angular framework files

Note that the `lib_bower` folder would normally be installed in the root folder but
project changes this location through the `.bowerrc` file.  Putting it in the `app` folder makes
it easier to serve the files by a webserver.

## Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

	npm start

Now browse to the app at

	http://localhost:8000/app/index.html

You can kill the web server by pressing `CTRL-C`

Notice, that every restart of the web server restore payload domain data to its original state.

## Directory Layout

	app/                           - all of the source files for "emulating" PHI environment    
	
	data_phi_payload_default/      - default domain data are coping to 'data_vaultq/phi/data' on every server startup for consistency keeping  
	    {dataType}/{providerId}/{patientId}.json           - single data file   
	
	data_vault/                    - emulates Vault storage
	    store/  
	        {storeId}/             - contains code resources for every single module
	
	data_vaultq/                   - emulates VaultQ storage
	    phi/
	        data/                  - contains domain data using by custom directives  
	            {dataType}/{providerId}/{patientId}.json   - single data file  
	    store/  
	        {storeId}/             - contains metadata (settings) file for every custom module
	        manifest.json          - holds a list of store IDs that assigned with a custom module
	
	grunt                          - source code for automated tasks  
	
	node_modules                   - npm packages for the tools we need
	
## Automated Actions

You can execute following commands in a terminal (from projet's root) for automating of some routine operations

##### `grunt dynamicModule:{storeId}:{mainDirectiveName}`
Creates a skeleton for a new custom module

*  Adds `{storeId}` to `data_vaultq/store/manifest.json`  
*  Creates module's metadata file at `data_vaultq/store/{storeId}/phi/directives/manifest.json`  
*  Creates directive's JS source at `data_vault/store/{storeId}/phi/directives/items/{mainDirectiveName}.js`  
*  Creates directive's HTML template at `data_vault/store/{storeId}/phi/directives/items/{mainDirectiveName}.html`  
*  Creates directive's config file at `data_vault/store/{storeId}/phi/directives/items/{mainDirectiveName}.config.json`  

##### `TODO:grunt packModule:{storeId}`
Pack developed custom module in a zip file ready to be exported to Vericle Admin UI. Not written yet.

## Available angular services API
Project already have a couple of services ready to be injected into your custom directives:

##### `phiContext`
Gives you access to various parameters of outer PHI environment

*  `patientId():String`
*  `providerId():String`
*  `getServiceDate():String` - Service Date from Superbill control panel
*  `getRenderingPhysicianId():String`	- Physician Id from Superbill control panel

##### `phiCustomModuleDataService`
Service for retrieving and operating on domain data (in JSON format). Have internal caching system for common PHI logic maintenance (Reload/Save/Dirty checking/Discard changes). In the project these data are storing at `data_vaultq/phi/data` in JSON format

*  `getData(dataType:String):Promise{JSONObject/JSONArray}` - returns data by a key for current provider-patient combination. If it is first invoking for particular `dataType`, it performs initial loading and storing in internal cache. Example: `customVitals.js`
*  `initData(dataType:String, initialData:JSONObject/JSONArray):JSONObject/JSONArray` - Using for data initiating in case of `getData` returned empty result (means there is no any data in VaultQ for these params). Example: `customVitals.js`
*  `reloadAllData():Promise{void}` - reloading from the server all the data stored in the internal cache. Typically invoking on PHI 'Reload' button clicking
*  `saveAllData():Promise{void}` - push to the server all the data stored in the internal cache. Typically invoking on PHI 'Save' button clicking
*  `discardAllChanges():Promise{void}` - restore all the data stored in the internal cache to their original state. Typically invoking on PHI 'Discard Changes' button clicking

##### `dashboardService`
Service for exposing data to PHI dashboard

*  `addDynamicPanel(id:String, title:String, renderTmpl:String, data:JSONObject/JSONArray):void` - export info to the dashboard and render it with `renderTmpl`. Example: `customVitals.js` and `customVitalsDashboardPanel.html`

##### `vault`
Service for getting(putting) data from(to) Vault storage

*  `get(path:String)                          :Promise{JSONObject/JSONArray}`  
*  `getBatch(paths:String[])                  :Promise{ [{path:String, obj:JSONObject/JSONArray}] }`  
*  `getRaw(path:String)                       :Promise{String}` 
*  `getRawBatch(paths:String[])               :Promise{ [{path:String, obj:String}] }` 
*  `put(path:String, obj:JSONObject/JSONArray):Promise{void}`  
*  `putBatch( [{path:String, obj:JSONObject/JSONArray}] ):Promise{void}`  
*  `putRaw(path:String, obj:String)           :Promise{void}`  
*  `putRawBatch( [{path:String, obj:String}] ):Promise{void}`  
*  `remove(path:String)                       :Promise{void}` 

##### `vaultQ`
Service for getting(putting) data from(to) versioned VaultQ storage. In a normal case it is prefferable to use `phiCustomModuleDataService` because it also gives you automatic saving/reloading on common PHI buttons clicking. Use `vaultQ` directly only if you understand what are you doing.

*  `getLatest(path:String)                    :Promise{obj:JSONObject/JSONArray, cnt:String}`  
*  `getLatestBatch(paths:String[])            :Promise{ [{path:String, obj:JSONObject/JSONArray, cnt:String}] }`  
*  `getLatestRaw(path:String)                 :Promise{obj:String, cnt:String}` 
*  `getLatestRawBatch(paths:String[])         :Promise{ [{path:String, obj:String, cnt:String}] }` 
*  `put(path:String, obj:JSONObject/JSONArray, currentCnt:String)           :Promise{void}`  
*  `putRaw(path:String, obj:String, currentCnt:String)           :Promise{void}`  

##### `phiStandardDataService`
Service for specific actions related with standard PHI Data (e.g. Vitals, Problems, Encounters)

*  `putEncounterNote(encounterCriteria, vaultPath) Promice{JSONObject/JSONArray}`

## Custom Module Examples
Project already have a couple of example modules written for most general use-cases

*  `customVitalsStoreId`  - Example of classic two-side editor with common PHI buttons (Load/Save/Discard) support and adding panel to the PHI Dashboard
*  `customProblemsStoreId`  - Example of operating on standard PHI data (passing to directive with `phiData` isolated scope member) with common PHI buttons (Load/Save/Discard) support