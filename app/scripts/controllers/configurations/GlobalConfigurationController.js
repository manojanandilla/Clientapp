(function(module) {
    mifosX.controllers = _.extend(module, {
        GlobalConfigurationController: function(scope,webStorage, $modal,routeParams,resourceFactory , location,route,filter,webStorage) {
            scope.configs = [];
            scope.clientConfigs = {};
            scope.temp = [];
            scope.myData = [];
            scope.showSmtp = true;
            
        	scope.paymentConfigs = [];
        	
        	   var callingTab = webStorage.get('callingTab',null);
               if(callingTab == null){
               	callingTab="";
               }else{
       		  scope.displayTab=callingTab.someString;
       		 
                if( scope.displayTab === "clientConfigTab"){
       			  
       			  scope.clientConfigTab =  true;
       			  webStorage.remove('callingTab');
       			  
                }else if( scope.displayTab === "paymentConfigTab"){
       			  
       			  scope.paymentConfigTab =  true;
       			  webStorage.remove('callingTab');
       			  
                }else{
       			  webStorage.remove('callingTab');
                }
               }
        
            function configurationResourceData(){
            	resourceFactory.configurationResource.get(function(data) {
            		for(var i in data.globalConfiguration){
            			if(data.globalConfiguration[i].name == 'smtp'){
            				scope.showSmtp = false;
            			}
            			scope.configs.push(data.globalConfiguration[i]);
            		}
            		webStorage.add("client_configuration",JSON.parse(data.clientConfiguration)); 
            	});
            }
            configurationResourceData();
            function cacheResouceData(){
            	resourceFactory.cacheResource.get(function(data) {
            		for(var i=0;i<data.length;i++ ){
            			if(data[i].cacheType.id==2){
                        var cache = {};
                        cache.name = 'Is Cache Enabled';
                        cache.enabled =  data[i].enabled;
            		}
                }
                scope.configs.push(cache);
            	});
            }
            cacheResouceData();
            
               
            scope.getpaymentgatewayData = function(){
            	
            	resourceFactory.paymentGatewayConfigurationResource.get(function(data) {
    				for ( var i in data.globalConfiguration) {
    					scope.paymentConfigs.push(data.globalConfiguration[i]);
    				}
    			});
            }
            
            scope.editpaymentgatewayConfig = function(id,name) {
				scope.errorStatus = [];
				scope.errorDetails = [];
				scope.editId = id;
				
				if(name == 'korta'){
					$modal.open({
						templateUrl : 'editKorta.html',
						controller : editKortaController,
						resolve : {}
					});
				} 
				
				if(name == 'paypal'){
					$modal.open({
						templateUrl : 'editPaypal.html',
						controller : editPaypalController,
						resolve : {}
					});
				} 
				
				if(name == 'dalpay'){
					$modal.open({
						templateUrl : 'editdalpay.html',
						controller : editDalpayController,
						resolve : {}
					});
				}
				
				if(name == 'globalpay'){
					$modal.open({
						templateUrl : 'editGlobalpay.html',
						controller : editGlobalpayController,
						resolve : {}
					});

				}

			};
			
            scope.edit= function(id){
		      	  scope.errorStatus=[];
		      	  scope.errorDetails=[];
		      	  scope.editId=id;
		        	  $modal.open({
		                templateUrl: 'editglobal.html',
		                controller:editGlobalController ,
		                resolve:{}
		            });
		        	
		        };
		        
		        var editGlobalController=function($scope,$modalInstance){
			      	  
		        	$scope.formData = {}; 
		            $scope.statusData=[];
		            $scope.updateData={};
		            //console.log(scope.editId);
		            
		            
		           // DATA GET
		            resourceFactory.configurationResource.get({configId: scope.editId}, function (data) {
		                $scope.formData = data;//{value: data.value};
		                $scope.formData.value=data.value;
		            });
		            
		         	$scope.accept = function(){
		         		$scope.flag=true;
		         		this.updateData.value=this.formData.value;
		         		resourceFactory.configurationResource.update({configId: scope.editId},this.updateData,function(data){ 
		                  route.reload();
		                  $modalInstance.close('delete');
		                  },function(errData){
		                  $scope.flag = false;
		                });
		         	};  
		    		$scope.reject = function(){
		    			$modalInstance.dismiss('cancel');
		    		};
		        };
		        
		        scope.getClientConfiguration = function(){
		        	 scope.myData = [];
          			 scope.mainObject = webStorage.get("client_configuration");
          			 scope.clientListObject = webStorage.get("client_configuration").clientListing;
          			 
          	    	  for (var key in scope.mainObject) {
          	    		  if(key != "clientListing"){
          	    			  scope.myData.push({
      		  					"name" : key,
      		  					"value" :scope.mainObject[key],
          	    			  });
          	    		  }else{
          	    			 scope.value = {};
          	    			 for (var keyClientList in scope.clientListObject){
          	    				 if(scope.clientListObject[keyClientList] == 'true'){
          	    					scope.value[keyClientList] = scope.clientListObject[keyClientList]; 
          	    				 }
         	    			 }
          	    			 scope.myData.push({
     		  					"name" : key,
     		  					"value" :scope.value,
     	    				 }); 
          	    		  }
          	    	  }
		        };
            
		        scope.enable = function (id, name) {
		        	
	                if (name == 'Is Cache Enabled') {
	                    var temp = {};
	                    temp.cacheType = 2;
	                    resourceFactory.cacheResource.update(temp, function (data) {
	                        route.reload();
	                    });
	                }
	                else {
	                    var temp = {'enabled': 'true'};
	                    resourceFactory.configurationResource.update({'configId': id}, temp, function (data) {
	                        route.reload();
	                    });
	                }
	            };
	            
	            scope.disable = function (id, name) {
	                if (name == 'Is Cache Enabled') {
	                    var temp = {};
	                    temp.cacheType = 1;
	                    resourceFactory.cacheResource.update(temp, function (data) {
	                        route.reload();
	                    });
	                }
	                else {
	                    var temp = {'enabled': 'false'};
	                    resourceFactory.configurationResource.update({'configId': id}, temp, function (data) {
	                        route.reload();
	                    });
	                }
	            };
	            
	            //client Configuration
	            
	            scope.getConfigLookUp = function(){
	            	scope.configLookupsdata = filter('ConfigLookup')('jsonData');
	            	
	            };
	            
	            scope.clientConfigChange = function(name,value,fromClientListing){
	            	
	            	if(value == 'true'){
	            		scope.oldValue = value;
	            		scope.newValue = false;
	            	}else{
	            		scope.oldValue = value;
	            		scope.newValue = true;
	            	}
	            	var tempclient = {"name":name,"newValue":scope.newValue,"oldValue":scope.oldValue};
	            	resourceFactory.clientConfigurationResource.update(tempclient, function (data) {
	            		webStorage.add("client_configuration",data);
                        route.reload();
                        if(fromClientListing == 'true'){scope.editClientListing();};
                    });
	            };
	            
	            scope.editClientConfigs = function(name,value){
	          	  scope.oldValue = value;
	          	  scope.clientConfigName = name;
	                $modal.open({
	                    templateUrl: 'editClientConfig.html',
	                    controller: Approve,
	                    resolve:{}
	                });
	            };
	            
	    		var editGlobalpayController = function($scope, $modalInstance) {

					$scope.formData = {};
					$scope.statusData = [];
					$scope.updateData = {};

					// DATA GET
					resourceFactory.paymentGatewayConfigurationResource.get({ configId : scope.editId }, function(data) {
						var value = data.value;
						var arr = value.split(",");
						var merchantId = arr[0].split('"');
						var userName = arr[1].split('"');
						var password = arr[2].split('"');

						$scope.formData.merchantId = merchantId[3];
						$scope.formData.userName = userName[3];
						$scope.formData.password = password[3];
					});

					$scope.submit = function() {
						
						$scope.kortaData = {
							"value" : '{"merchantId" : "' + $scope.formData.merchantId
									+ '","userName" : "' + $scope.formData.userName
									+ '","password" : "' + $scope.formData.password
									+ '"}'
						};
						$scope.updateData.value = $scope.kortaData.value;
						//console.log(this.updateData);
						resourceFactory.paymentGatewayConfigurationResource.update({configId : scope.editId}, $scope.updateData, function(data) {
							$modalInstance.close('delete');
							route.reload();
						}, function(errData) {
							$scope.paypalFlag = false;
						});
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				};
				
				var editKortaController = function($scope, $modalInstance) {

					$scope.formData = {};
					$scope.statusData = [];
					$scope.updateData = {};

					// DATA GET
					resourceFactory.paymentGatewayConfigurationResource.get({ configId : scope.editId }, function(data) {
						var value = data.value;
						var arr = value.split(",");
						var merchantId = arr[0].split('"');
						var terminalId = arr[1].split('"');
						var secretCode = arr[2].split('"');

						$scope.formData.merchantId = merchantId[3];
						$scope.formData.terminalId = terminalId[3];
						$scope.formData.secretCode = secretCode[3];
					});

					$scope.submit = function() {
						
						$scope.kortaData = {
							"value" : '{"merchantId" : "' + $scope.formData.merchantId
									+ '","terminalId" : "' + $scope.formData.terminalId
									+ '","secretCode" : "' + $scope.formData.secretCode
									+ '"}'
						};
						$scope.updateData.value = $scope.kortaData.value;
						//console.log(this.updateData);
						resourceFactory.paymentGatewayConfigurationResource.update({configId : scope.editId}, $scope.updateData, function(data) {
							$modalInstance.close('delete');
							route.reload();
						}, function(errData) {
							$scope.paypalFlag = false;
						});
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				};

				var editDalpayController = function($scope, $modalInstance) {

					$scope.formData = {};
					$scope.statusData = [];
					$scope.updateData = {};
					//console.log(scope.editId);

					// DATA GET
					resourceFactory.paymentGatewayConfigurationResource.get({configId : scope.editId}, function(data) {
						var value = data.value;
						var arr = value.split(",");
						var url = arr[0].split('"');
						var merchantId = arr[1].split('"');
						var pageId = arr[2].split('"');

						$scope.formData.url = url[3];
						$scope.formData.merchantId = merchantId[3];
						$scope.formData.pageId = pageId[3];
					});
					
					$scope.submit = function() {
						
						$scope.dalpayData = {
							"value" : '{"url" : "' + $scope.formData.url
									+ '","merchantId" : "' + $scope.formData.merchantId
									+ '","pageId" : "' + $scope.formData.pageId
									+ '"}'
						};
						$scope.updateData.value = $scope.dalpayData.value;

						resourceFactory.paymentGatewayConfigurationResource.update({configId : scope.editId}, $scope.updateData, function(data) {
							$modalInstance.close('delete');
							route.reload();
						}, function(errData) {
							$scope.paypalFlag = false;
						});
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				};

				var editPaypalController = function($scope, $modalInstance) {

					$scope.formData = {};
					$scope.statusData = [];
					$scope.updateData = {};

					// DATA GET
					resourceFactory.paymentGatewayConfigurationResource.get({ configId : scope.editId }, function(data) {
						var value = data.value;
						var arr = value.split(",");
						var paypalUrl = arr[0].split('"');
						var paypalEmailId = arr[1].split('"');

						$scope.formData.url = paypalUrl[3];
						$scope.formData.emailId = paypalEmailId[3];
					});

					$scope.submit = function() {
						$scope.paypalFlag = true;
						//consoe.log($scope.clientId);
						$scope.paypalData = {
							"value" : '{"paypalUrl" : "' + $scope.formData.url
									+ '","paypalEmailId" : "' + $scope.formData.emailId
									+ '"}'
						};
						$scope.updateData.value = $scope.paypalData.value;
						//console.log(this.updateData);
						resourceFactory.paymentGatewayConfigurationResource.update({configId : scope.editId}, $scope.updateData, function(data) {
							$modalInstance.close('delete');
							route.reload();
						}, function(errData) {
							$scope.paypalFlag = false;
						});
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				};

				scope.paymentConfigenable = function(id) {

					var temp = {'enabled' : 'true'};
					resourceFactory.paymentGatewayConfigurationResource.update({ 'configId' : id }, temp, function(data) {
						route.reload();
					});
				};

				scope.paymentConfigdisable = function(id) {

					var temp = {'enabled' : 'false'};
					resourceFactory.paymentGatewayConfigurationResource.update({ 'configId' : id }, temp, function(data) {
						route.reload();
					});
				};
	            
	            function Approve($scope, $modalInstance) {
	            	$scope.data = {};
	            	$scope.dates = [
		                      	        'dd MMM yyyy',
		                                'dd MMMM yyyy',
		                                'dd/MMM/yyyy',
		                                'dd/MMMM/yyyy',
		                                'dd-MMM-yyyy',
		                                'dd-MMMM-yyyy',
		                                'MMM-dd-yyyy',
		                                'MMMM-dd-yyyy',
		                                'MMM dd yyyy',
		                                'MMMM dd yyyy',
		                                'MMM/dd/yyyy',
		                                'MMMM/dd/yyyy'
		                                  
		                           ];
	            	$scope.data.value = scope.oldValue;
	            	$scope.data.name = scope.clientConfigName;
	                $scope.approve = function (newValue) {
	                	var tempclientConfig = {"name":scope.clientConfigName,"newValue":newValue,"oldValue":scope.oldValue};
	                    scope.approveData = {};
	                    resourceFactory.clientConfigurationResource.update(tempclientConfig, function (data) {
	                    	webStorage.add("client_configuration",data);
	                        route.reload();
	                    });
	                    $modalInstance.close('delete');
	                };
	                $scope.cancel = function () {
	                    $modalInstance.dismiss('cancel');
	                };
	            }
	            
	            scope.editClientListing=function(name, value){
	                $modal.open({
	                    templateUrl: 'editclientlisting.html',
	                    controller: ApproveClientListing,
	                    resolve:{}
	                });
	            };
	           function ApproveClientListing($scope, $modalInstance) {
	        	   
	          	  	$scope.clientListData = [];
	          	  	$scope.tempData = [];
	          	  	$scope.tempData = webStorage.get("client_configuration").clientListing;
	          	  	for (var key in $scope.tempData) {
      	    			  $scope.clientListData.push({
  		  					"name" : key,
  		  					"value" :$scope.tempData[key].toString(),
      	    			  });
	          	  	}
	                $scope.approve = function (name, value) {
	                    scope.approveData = {};
	                    scope.clientConfigChange(name, value , 'true');
	                    $modalInstance.close('delete');
	                };
	                $scope.cancel = function () {
	                    $modalInstance.dismiss('cancel');
	                };
	            }
	            
	        }
	    });

       
   
    mifosX.ng.application.controller('GlobalConfigurationController', ['$scope', 'webStorage', '$modal', '$routeParams', 'ResourceFactory', '$location','$route','$filter','webStorage', mifosX.controllers.GlobalConfigurationController]).run(function($log) {
        $log.info("GlobalConfigurationController initialized");
    });
}(mifosX.controllers || {}));
