(function(module) {
  mifosX.controllers = _.extend(module, {
	  PaymentGatewayController: function(scope,webStorage,route,$modal,routeParams,location, resourceFactory, paginatorService) {
		  
        scope.paymentgatewaydatas = [];
	        
	      //for All tab

			 scope.paymentGatewayAllData = function(offset, limit, callback) {
	 			 resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit} , callback);
			};
	 		
	 		scope.getPaymentGateway = function () {
	       	scope.paymentgatewaydatas = paginatorService.paginate(scope.paymentGatewayAllData, 14);
	       };
			
			
			scope.searchAllPaymentData = function(offset, limit, callback) { 
		    	  resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, 
		    		  sqlSearch: scope.filterText} , callback);
		          };
		  		
		  	scope.searchPaymentId = function(filterText) {
		  			scope.paymentgatewaydatas = paginatorService.paginate(scope.searchAllPaymentData, 14);
		  		};
	  		
        
	 		//for Failure tab
		  		
	 		 scope.paymentGatewayFailureData = function(offset, limit, callback) {
	  			 resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit,tabType: 'Failure'} , callback);
	 		};
	  		
	  		scope.getPaymentGatewayFailure = function () {
	        	scope.paymentgatewaydatas = paginatorService.paginate(scope.paymentGatewayFailureData, 14);
	        };
	 		
	 		
	 		scope.searchFailedPaymentData = function(offset, limit, callback) { 
		    	  resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, 
		    		  sqlSearch: scope.filterText, tabType: 'Failure'} , callback);
		          };
		  		
		  	scope.searchFailedPaymentId = function(filterText) {
		  			scope.paymentgatewaydatas = paginatorService.paginate(scope.searchFailedPaymentData, 14);
		  		};
		  		
		  		
		  	// for success Tab       
		   
		    scope.paymentGatewaySuccessData = function(offset, limit, callback) {
		  			 resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, tabType: 'Success'} , callback);
		 		};
		 		
		 	scope.getPaymentGatewaySuccess = function () {
			        	scope.paymentgatewaydatas = paginatorService.paginate(scope.paymentGatewaySuccessData, 14);
			        };
			        
		  	scope.searchSuccessPaymentData = function(offset, limit, callback) {
			    	  resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, 
			    		  sqlSearch: scope.filterText, tabType: 'Success'} , callback);
			          };
			  		
		    scope.searchSuccessPaymentId = function(filterText) {
			  			scope.paymentgatewaydatas = paginatorService.paginate(scope.searchSuccessPaymentData, 14);
			  		};		

		   // for Finished Tab
			  		
		    scope.paymentGatewayFinishedData = function(offset, limit, callback) {
			  			 resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, tabType: 'Finished'} , callback);
			 		};
			  		
		    scope.getFinishedPaymentGateway = function () {
			        	scope.paymentgatewaydatas = paginatorService.paginate(scope.paymentGatewayFinishedData, 14);
			        };
			        
			        
			scope.searchFinishedPaymentData = function(offset, limit, callback) { 
				    	  resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, 
				    		  sqlSearch: scope.filterText, tabType: 'Finished'} , callback);
				          };
				  		
			scope.searchFinishedPaymentId = function(filterText) {
				  			scope.paymentgatewaydatas = paginatorService.paginate(scope.searchFinishedPaymentData, 14);
				  		};
			
		  // for Invalid Tab
			        
			scope.paymentGatewayInvalidData = function(offset, limit, callback) {
			  			 resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, tabType: 'Invalid'} , callback);
			 		};  
			 		
			scope.getInvalidPaymentGateway = function () {
			        	scope.paymentgatewaydatas = paginatorService.paginate(scope.paymentGatewayInvalidData, 14);
			        };
			        
			scope.searchInvalidPaymentData = function(offset, limit, callback) { 
				    	  resourceFactory.paymentGatewayResource.get({offset: offset, limit: limit, 
				    		  sqlSearch: scope.filterText, tabType: 'Invalid'} , callback);
				          };
				  		
			scope.searchInvalidPaymentId = function(filterText) {
				  			scope.paymentgatewaydatas = paginatorService.paginate(scope.searchInvalidPaymentData, 14);
				  		};
				  		
		// edit popup
				  		
				  		scope.edit= function(id){
				      	  scope.errorStatus=[];
				      	  scope.errorDetails=[];
				      	  scope.editId=id;
				        	  $modal.open({
				                templateUrl: 'editpaymentgateway.html',
				                controller:editpaymentgatewayController ,
				                resolve:{}
				            });
				        	
				        };
				        
				        
				        var editpaymentgatewayController=function($scope,$modalInstance){
				      	  
				        	$scope.formData = {}; 
				            $scope.statusData=[];
				            $scope.updateData={};
				            //console.log(scope.editId);
				            resourceFactory.paymentGatewayResource.getData({'id': scope.editId},this.formData,function(data){
				            	 $scope.formData=data;
				            	 $scope.statusData=data.statusData;
				            	 $scope.formData.paymentdata=data.statusData[0].code;
				             });
				         	$scope.accept = function(){
				         		$scope.flag=true;
				         		this.updateData.status=this.formData.paymentdata;
				            	this.updateData.remarks=this.formData.remarks;
				         		resourceFactory.paymentGatewayResource.update({'id': scope.editId},this.updateData,function(data){ 
				                  route.reload();
				                 // location.path('/paymentGateway');
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
  mifosX.ng.application.controller('PaymentGatewayController', ['$scope','webStorage','$route','$modal','$routeParams', '$location', 'ResourceFactory','PaginatorService', mifosX.controllers.PaymentGatewayController]).run(function($log) {
    $log.info("PaymentGatewayController initialized");
  });
}(mifosX.controllers || {}));


