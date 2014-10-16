(function(module) {
  mifosX.controllers = _.extend(module, {
    InventoryController: function(scope,webStorage, routeParams, location,$modal, resourceFactory, paginatorService,PermissionService,route) {
        scope.items = [];
        scope.grn = [];
        scope.itemdetails = [];
        scope.mrn = [];
        scope.itemhistory = [];
        scope.supplier = [];
        scope.call={status:""}; 
        scope.PermissionService = PermissionService;
        
        var callingTab = webStorage.get('callingTab',null);
        if(callingTab == null){
        	callingTab="";
        }else{
		  scope.displayTab=callingTab.someString;
		 
		  if( scope.displayTab == "items"){
			 
			  scope.itemsTab = true;
			  webStorage.remove('callingTab');
		  }
		  else if(scope.displayTab == "itemDetails"){
			 
			  scope.itemDetailsTab =  true;
			  webStorage.remove('callingTab');
		  }
		  else if(scope.displayTab == "supplier"){
			  scope.supplierTab =  true;
			  webStorage.remove('callingTab');
		  }
		  else if(scope.displayTab == "grn"){
			  scope.grnTab = true;
			  webStorage.remove('callingTab');
		  }
		  else if(scope.displayTab == "mrn"){
			  scope.mrnTab =  true;
			  webStorage.remove('callingTab');
		  }else
		  {
			  webStorage.remove('callingTab');
		  };
		 
        }
        
        scope.routeTo = function(id){
        	if(id != 0){
        		if(PermissionService.showMenu('READ_CLIENT'))
        			location.path('/viewclient/'+ parseInt(id));
        	}else{
        		if(PermissionService.showMenu('CREATE_CLIENT')&&PermissionService.showMenu('READ_ADDRESS'))
        				location.path('/createclient');
        	}
          };
        scope.routeTogrn = function(id){
              location.path('/viewgrn/'+ parseInt(id));
           };
         scope.routeTomrn = function(id){
        	 scope.val=id.split(" ");
             location.path('/viewmrn/'+ scope.val[1]);
           };
        scope.routeToitem = function(id){
            location.path('/viewitem/'+ parseInt(id));
          };
         
        
        scope.itemFetchFunction = function(offset, limit, callback) {
			resourceFactory.itemResource.getAllItems({offset: offset, limit: limit} , callback);
		};
		
        
        scope.itemDetailsFetchFunction = function(offset, limit, callback) {
			resourceFactory.itemDetailsResource.getAlldetails({offset: offset, limit: limit} , callback);
		};
               
		scope.mrnDetailsFetchFunction = function(offset, limit, callback) {
			resourceFactory.viewMrnResource.getAlldetails({offset: offset, limit: limit} , callback);
		};
		
		scope.itemHistoryFetchFunction = function(offset, limit, callback) {
			resourceFactory.itemhistoryResource.getAlldetails({offset: offset, limit: limit} , callback);
		};
        
		scope.supplierFetchFunction = function(offset, limit, callback) {
			resourceFactory.supplierResource.getAlldetails({offset: offset, limit: limit} , callback);
		};
        
		//scope.items = paginatorService.paginate(scope.itemFetchFunction, 14);

        scope.grnDetailsFetchFunction = function(offset, limit, callback) {
			resourceFactory.grnResource.getAlldetails({offset: offset, limit: limit} , callback);
		};
		
		scope.getItems = function(){
			scope.items = paginatorService.paginate(scope.itemFetchFunction, 14);
		};
		
        scope.getGRNdetails = function () {
        	scope.grn = paginatorService.paginate(scope.grnDetailsFetchFunction, 14);
        };
        
        
        scope.getItemdetails = function () {
        		scope.itemdetails = paginatorService.paginate(scope.itemDetailsFetchFunction, 14);
        };
                
        scope.getMRNdetails = function () {
        	if(PermissionService.showMenu('READ_MRN'))
        		scope.mrn = paginatorService.paginate(scope.mrnDetailsFetchFunction, 14);
        };
        
        /*scope.getitemhistorydetails = function () {
            scope.itemhistory = paginatorService.paginate(scope.itemHistoryFetchFunction, 14);
        };*/
        
        scope.getsupplierdetails = function () {
        	if(PermissionService.showMenu('READ_SUPPLIER'))
                scope.supplier = paginatorService.paginate(scope.supplierFetchFunction, 14);          
        };

       
        
        
        
        scope.whatClassIsIt = function(someValue){
             if(someValue>0)
                 scope.call={status:"Yes"};
            else
                 scope.call={status:"No"};
        };
        
        
        scope.searchItems123 = function(offset, limit, callback) {
	    	  resourceFactory.itemResource.getAllItems({offset: offset, limit: limit , 
	    		  sqlSearch: scope.filterText } , callback); 
	          };
	  		
	  		scope.searchItems = function(filterText) {
	  			scope.items = paginatorService.paginate(scope.searchItems123, 14);
	  		};
      
      scope.searchItemDetails123 = function(offset, limit, callback) {
	    	  resourceFactory.itemDetailsResource.getAlldetails({offset: offset, limit: limit , 
	    		  sqlSearch: scope.filterText } , callback); 
	          };
	  		
	  		scope.searchItemDetails = function(filterText) {
	  			scope.itemdetails = paginatorService.paginate(scope.searchItemDetails123, 14);
	  		};
	  		
	  	scope.searchGRN123 = function(offset, limit, callback) {
		    	  resourceFactory.grnResource.getAlldetails({offset: offset, limit: limit , 
		    		  sqlSearch: scope.filterText } , callback); 
		          };
		  		
		  		scope.searchGRN = function(filterText) {
		  			scope.grn = paginatorService.paginate(scope.searchGRN123, 14);
		  		};
      
		scope.searchMRN123 = function(offset, limit, callback) {
			    	  resourceFactory.viewMrnResource.getAlldetails({offset: offset, limit: limit , 
			    		  sqlSearch:  scope.filterText } , callback); 
			          };
			  		
			  		scope.searchMRN = function(filterText) {
			  			scope.mrn = paginatorService.paginate(scope.searchMRN123, 14);
			  		};
			  		
	    scope.searchSupplier123 = function(offset, limit, callback) {
				    	  resourceFactory.supplierResource.getAlldetails({offset: offset, limit: limit , 
				    		  sqlSearch:  scope.filterText } , callback); 
				          };
				  		
				  		scope.searchSupplier = function(filterText) {
				  			scope.supplier = paginatorService.paginate(scope.searchSupplier123, 14);
				  		};
				  		
		scope.searchHistory123 = function(offset, limit, callback) {
					    	  resourceFactory.itemhistoryResource.getAlldetails({offset: offset, limit: limit , 
					    		  sqlSearch:  scope.filterText } , callback); 
					          };
					  		
					  		scope.searchHistory = function(filterText) {
					  			
					  			if(filterText=undefined || filterText==""){
					  				
					  			}else{
					  				
					  				scope.itemhistory = paginatorService.paginate(scope.searchHistory123, 14);
					  			}
					  		};
							scope.editQuality = function(itemId,valueQuality,provisionalserialNum){
					            scope.itemid=itemId;
					            scope.valueQuality=valueQuality;
					            scope.provisionalserialNum=provisionalserialNum;
					        	  scope.errorStatus=[];scope.errorDetails=[];
					        	  $modal.open({
					                  templateUrl: 'EditQuality.html',
					                  controller: EditQualityController,
					                  resolve:{}
					              });
					          };
					          scope.editProvSerial= function(itemId,valueQuality,provisionalserialNum){
						            scope.itemid=itemId;
						            scope.valueQuality=valueQuality;
						            scope.provisionalserialNum=provisionalserialNum;
						        	  scope.errorStatus=[];scope.errorDetails=[];
						        	  $modal.open({
						                  templateUrl: 'EditProvSerial.html',
						                  controller: EditQualityController,
						                  resolve:{}
						              });
						          };
					          var EditQualityController = function ($scope, $modalInstance) {

					          	resourceFactory.itemQualityResource.get(function(data) {
					                  $scope.qualityData = data.quality;
					                  $scope.quality=scope.valueQuality;
					                  $scope.provserialnum=scope.provisionalserialNum;
					              });
					        	  $scope.approveQuality = function (value,provserialnum) {
					        		//  alert(value);
					        		  $scope.flagEditQuality=true;
					        		  //if(this.formData == undefined || this.formData == null){
					        			  this.formData = {"quality":value};
					        			  this.formData = {"quality":value,"provisioningSerialNumber":provserialnum};
					        		  //}
					        		  resourceFactory.itemDetailsResource.update({'itemId': scope.itemid},this.formData,function(data){
					        	      
					        	          $modalInstance.close('delete');
								location.path("/viewitemdetails/"+data.resourceId);
					        	        },function(errData){
							        		$scope.flagEditQuality = false;
							          });
					              };
					              $scope.cancelQuality = function () {
					                  $modalInstance.dismiss('cancel');
					              };
					              
					              
					          };
					          
					          /**
					           * @ Changing Status
					           * */
					          scope.searchStatusDetails = function(offset, limit, callback) {
					        	  	resourceFactory.itemDetailsResource.getAlldetails({offset: offset, limit: limit ,sqlSearch: scope.source } , callback); 
					          };
					        	  						  		
					          scope.searchSource = function(source) {
					        	  	scope.itemdetails = paginatorService.paginate(scope.searchStatusDetails, 14);
					          };
					          
					          /**
					           * popup for edit supplier
					           * */
					          scope.editSupplier= function(id){
						      	  scope.errorStatus=[];
						      	  scope.errorDetails=[];
						      	  scope.supplierId=id;
						        	  $modal.open({
						                templateUrl: 'editsuppliers.html',
						                controller:editSupplierController ,
						                resolve:{}
						            });
						        };
						        var editSupplierController=function($scope,$modalInstance){
							      	  
						        	$scope.formData = {}; 
						            $scope.statusData=[];
						            resourceFactory.supplierResource.get({'id': scope.supplierId},function(data) {
						                $scope.formData= data[0];
						               
						            });
						            
						         	$scope.accept = function(){
						         		$scope.flag=true;
						         		delete $scope.formData.id;
						         		resourceFactory.supplierResource.update({'id': scope.supplierId},$scope.formData,function(data){ 
						                  route.reload();
						                  webStorage.add("callingTab", {someString: "supplier" });
						                  $modalInstance.close('delete');
						                 },function(errData){
						                  $scope.flag = false;
						                   });
						         	};  
						    		$scope.reject = function(){
						    			$modalInstance.dismiss('cancel');
						    		};
						        };
        
       
    }
  });
  mifosX.ng.application.controller('InventoryController', ['$scope','webStorage', '$routeParams', '$location','$modal', 'ResourceFactory','PaginatorService','PermissionService','$route', mifosX.controllers.InventoryController]).run(function($log) {
    $log.info("InventoryController initialized");
  });
}(mifosX.controllers || {}));


	
