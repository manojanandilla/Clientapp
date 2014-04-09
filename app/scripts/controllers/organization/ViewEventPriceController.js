(function(module) {
  mifosX.controllers = _.extend(module, {
	  ViewEventPriceController: function(scope, routeParams , location,resourceFactory,PermissionService ) {		
        scope.pricedata = [];     
        scope.PermissionService = PermissionService;
        resourceFactory.eventPriceEditResource.geteventpricedetail({id: routeParams.id} , function(data) {
        	scope.eventId=data.eventId;
            scope.pricedata = data;  
        });

        scope.deleteEventPrice = function (id){       	
            resourceFactory.eventpriceResource.delete({eventId: routeParams.id} , {} , function(data) {            	
                  location.path('/viewEventPrices/'+id);              
            });
          };
    
    }
  });
  mifosX.ng.application.controller('ViewEventPriceController', ['$scope', '$routeParams', '$location','ResourceFactory','PermissionService', mifosX.controllers.ViewEventPriceController]).run(function($log) {
    $log.info("ViewEventPriceController initialized");
  });
}(mifosX.controllers || {}));