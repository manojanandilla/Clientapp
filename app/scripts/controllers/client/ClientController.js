(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientController: function(scope, resourceFactory , paginatorService,location,PermissionService) {
        
      scope.clients = [];
      scope.PermissionService = PermissionService;
      scope.pageNo = 1;
      scope.newClients = 0;
      scope.activeClients = 0;
      scope.InActiveClients = 0;
      scope.PendingClients = 0;
      scope.totalPages = 1;
      scope.status="ACTIVE";	/**Change to DEACTIVE OR CLOSED OR NEW, When do you want to displays list of clients that particular status*/
      
      var fetchFunction = function(offset, limit, callback) {
        resourceFactory.clientResource.getAllClients({offset: offset, limit: limit,status: scope.status} , function(data){
        	scope.totalClients = data.totalFilteredRecords;
        	if(scope.totalClients%15 == 0)	
        		scope.totalPages = scope.totalClients/15;
        	else
        		scope.totalPages = Math.floor(scope.totalClients/15)+1;
        	
        	callback(data);
        });
      };
      
      resourceFactory.runReportsResource.get({reportSource: 'ClientCounts',genericResultSet:false} , function(data) {
    	  for(var i in data){
    		  if(data[i].status == 'New')
    			  scope.newClients = data[i].ccounts;
    		  if(data[i].status == 'Active')
    			  scope.activeClients = data[i].ccounts;
    		  if(data[i].status == 'Inactive')
    			  scope.InActiveClients = data[i].ccounts;
    		  if(data[i].status == 'Pending')
    			  scope.PendingClients = data[i].ccounts;
    	  }
    	  /*scope.totalClients = scope.newClients+scope.activeClients
    	  					   +scope.InActiveClients+scope.PendingClients;
    	  if(scope.totalClients%15 == 0)
    		  scope.totalPages = scope.totalClients/15;
    	  else
    		  scope.totalPages = Math.floor(scope.totalClients/15)+1;*/
      });
      
      scope.nextPageNo = function(){
    	  if(scope.pageNo < scope.totalPages)
    	   scope.pageNo +=1;
      };
      
      scope.previousPageNo = function(){
    	  if(scope.pageNo >1)
    	  scope.pageNo -=1;
      };
      
      scope.lastPageNo = function(){
    	  scope.pageNo =scope.totalPages;
      };
      
      scope.firstPageNo = function(){
    	  scope.pageNo =1;
      };
      
      scope.routeTo = function(id){
          location.path('/viewclient/'+ id);
        };
        
    	scope.routeToGroup = function(name){
            location.path('/viewgroupdetails/'+ name);
       };
       
      if(PermissionService.showMenu('READ_CLIENT'))
    	  scope.clients = paginatorService.paginate(fetchFunction, 14);
      
      
      
      scope.search123 = function(offset, limit, callback) {
          resourceFactory.clientResource.getAllClients({offset: offset, limit: limit , sqlSearch: scope.filterText } , callback); 
         };
       
       scope.search = function(filterText) {
        scope.clients = paginatorService.paginate(scope.search123, 14);
       };
       
       /**
        * @ Changing status
        * */
        scope.searchSource=function(sourceStatus){
        	
            scope.searchSources123 = function(offset, limit, callback) {
            	resourceFactory.clientResource.getAllClients({offset: offset, limit: limit , status: sourceStatus } , callback); 
            };
            scope.clients = paginatorService.paginate(scope.searchSources123, 14);
        };
    }
  });
  mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', 'PaginatorService','$location','PermissionService',mifosX.controllers.ClientController]).run(function($log) {
    $log.info("ClientController initialized");
  });
}(mifosX.controllers || {}));
