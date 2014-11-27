(function(selfcare_module) {
  selfcare.controllers = _.extend(selfcare_module, {
	  RenewalOrderController: function(scope,RequestSender,rootScope,routeParams,modal,
			  							webStorage,HttpService,authenticationService,sessionManager,location) {
		  
		  	scope.isOrderPage = true;
		  	scope.isPaymentPage = false;
		  	scope.isRedirectToGateway = false;
		  	scope.isAmountZero = false;
		    scope.paymentGatewayName = 'korta';
		  	scope.orderData = [];
		  	scope.plansData = {};
			scope.clientData = {};
			scope.clientOrdersData = [];
			scope.pricingData = [];
			var selfcareUserData ={};
			scope.paymentgatewayData = [];
			scope.kortaDisplay = false;
			scope.dalpayDisplay = false;
			scope.globalpayDisplay = false;
			scope.paypalDisplay = false;
			
			RequestSender.paymentGatewayConfigResource.get(function(data) {
				  scope.paymentgatewayData = data.globalConfiguration;
				  
				  for(var i=0;i<scope.paymentgatewayData.length;i++){	
					  
	                	if(scope.paymentgatewayData[i].name == 'korta'){
	                		scope.kortaDisplay = scope.paymentgatewayData[i].enabled;
	                	}else if(scope.paymentgatewayData[i].name == 'dalpay'){
	                		scope.dalpayDisplay = scope.paymentgatewayData[i].enabled;
	                		scope.dalpayURL = scope.paymentgatewayData[i].value;
	                	}else if(scope.paymentgatewayData[i].name == 'globalpay'){
	                		scope.globalpayDisplay = scope.paymentgatewayData[i].enabled;       
	                	}else if(scope.paymentgatewayData[i].name == 'paypal'){
	                		scope.paypalDisplay = scope.paymentgatewayData[i].enabled;
	                		var value = scope.paymentgatewayData[i].value;
	                		var arr = value.split(",");
	    					var paypalUrl = arr[0].split('"');
	    					var paypalEmailId = arr[1].split('"');
	                		scope.paypalUrl = paypalUrl[3] + '=' + paypalEmailId[3] ;
	                		
	                	}else{
	                		alert('nothing');
	                	}
	               }
				 
			 });
			
			
		  	
		  //declaration of formData
			  scope.formData = {};
			  
		  //getting dalpay Url
		 // scope.dalpayURL = selfcare.models.dalpayURL;
		  
		  scope.orderId = routeParams.orderId;
		  	
		  
    	  
			  if(scope.isOrderPage == true){
				  var clientDatas = webStorage.get("clientTotalData");
				  if(clientDatas){
					  RequestSender.clientResource.get({clientId: clientDatas.clientId} , function(data) {
						  scope.formData = data;
						  selfcareUserData = data.selfcare;
						  console.log(scope.formData);
						  scope.formData.clientId = data.id;
						  
						  RequestSender.getSingleOrderResource.get({orderId: routeParams.orderId},function(data){
							  scope.orderData=data.orderData;
							  RequestSender.clientResource.get({clientId: scope.formData.clientId} , function(data) {
								  
								  RequestSender.orderTemplateResource.query({region : data.state},function(data){
									  
									  for(var i in data){
										  if(scope.orderData.planCode == data[i].planCode){
											  scope.plansData = data[i];
											  console.log(scope.plansData);
										  }
									  }
									  
								  });
							  });
						  });
					  });
				  }
				  
			  }
		  
			  var hostName = selfcare.models.selfcareAppUrl;
			  
			  scope.paymentGatewayFun  = function(paymentGatewayName){
				  	
				  console.log(paymentGatewayName);	
				  scope.paymentGatewayName = paymentGatewayName;
			    	  		 	
				  if(paymentGatewayName == 'dalpay'){	    		  
					  scope.paymentURL = scope.dalpayURL+"&cust_name="+scope.formData.lastname+"&cust_phone="+scope.formData.phone+"&cust_email="+scope.formData.email+"&cust_state="+scope.formData.state+""+
  	  				  "&cust_address1="+scope.formData.addressNo+"&cust_zip="+scope.formData.zip+"&cust_city="+scope.formData.state+"&item1_desc="+scope.formData.planName+"&item1_price="+scope.formData.planAmount+"" +
	  				  "&user1="+scope.formData.id+"&user2="+hostName+"&user3=renewalorderpreviewscreen/"+routeParams.orderId+"/"+routeParams.clientId; 
			    	  		     	 
				  }else if(paymentGatewayName == 'korta'){
		    		  var token = selfcareUserData.token;
		    		  if(token != null && token != ""){
		    			  scope.paymentDalpayURL = "#/kortatokenpayment/"+routeParams.orderId+"/"+routeParams.clientId;
		    		  }else{
		    			  scope.paymentDalpayURL = "#/kortaIntegration/"+routeParams.orderId+"/"+routeParams.clientId;
		    		  }
		    	  }else if(paymentGatewayName == 'paypal'){ 	  	    		  
					  scope.paymentURL = scope.paypalUrl+"&item_name="+scope.formData.planName+"&amount="+scope.formData.planAmount+"" +	  	  				
					  "&custom="+scope.formData.clientId;  
					  
				  }else if(paymentGatewayName == 'globalpay'){	    		 		    			
					  scope.paymentURL = "#/globalpayIntegration/" + scope.formData.clientId+"/" + scope.formData.planAmount;		    
				  };
			      
			  };
			  
				/*scope.paymentGatewayFun  = function(paymentGatewayName){
			    	  console.log(paymentGatewayName);
			    	  scope.paymentGatewayName = paymentGatewayName;
			    	  
			    	  if(paymentGatewayName == 'dalpay'){
			    		  scope.paymentDalpayURL = scope.dalpayURL+"&cust_name="+scope.formData.lastname+"&cust_phone="+scope.formData.phone+"&cust_email="+scope.formData.email+"&cust_state="+scope.formData.state+""+
	    	  				"&cust_address1="+scope.formData.addressNo+"&cust_zip="+scope.formData.zip+"&cust_city="+scope.formData.state+"&item1_desc="+scope.formData.planName+"&item1_price="+scope.formData.planAmount+"" +
	    	  				"&user1="+scope.formData.id+"&user2="+hostName+"&user3=renewalorderpreviewscreen/"+routeParams.orderId+"/"+routeParams.clientId; 
			    	  }else if(paymentGatewayName == 'korta'){
			    		  var token = selfcareUserData.token;
			    		  if(token != null && token != ""){
			    			  scope.paymentDalpayURL = "#/kortatokenpayment/"+routeParams.orderId+"/"+routeParams.clientId;
			    		  }else{
			    			  scope.paymentDalpayURL = "#/kortaIntegration/"+routeParams.orderId+"/"+routeParams.clientId;
			    		  }
			    	  };
			      };*/
		  
		  scope.selectedPLandAm = function(contractId,planId,chargeCode,price,planCode,duration){
		    	 
			  scope.isOrderPage = false;
			 // scope.isPaymentPage = true;
			  scope.formData.planAmount = price;
			  scope.duration = duration;
	    	  scope.formData.contractperiod = contractId;
	    	  scope.formData.planCode = planId;
	    	  scope.formData.paytermCode = chargeCode;
	    	  scope.formData.planName = planCode;
	    	  if(price==0){
	    		  scope.isAmountZero = true;
	    		  scope.isPaymentPage = false;
	    	  }else{
	    		  scope.isAmountZero = false;
	    		  scope.isPaymentPage = true;
	    	  }
	    	  //	var host = window.location.hostname;
	    		//var portNo = window.location.port;
	    	  scope.paymentGatewayFun('korta');
	    	  /*scope.paymentDalpayURL = scope.dalpayURL+"&cust_name="+scope.formData.lastname+"&cust_phone="+scope.formData.phone+"&cust_email="+scope.formData.email+"&cust_state="+scope.formData.state+""+
	    	  				"&cust_address1="+scope.formData.addressNo+"&cust_zip="+scope.formData.zip+"&cust_city="+scope.formData.city+"&num_items=1&item1_desc="+scope.formData.planName+"&item1_price="+scope.formData.planAmount+"" +
	    	  				"&item1_qty=1&user1="+scope.formData.id+"&user2="+hostName+"&user3=renewalorderpreviewscreen/"+routeParams.orderId+"/"+routeParams.clientId;*/
	    	  
	      };
	      
	      scope.makePaymentFun =function(){
	    	  webStorage.add("renewalOrderFormData",scope.formData);
	    	  scope.isRedirectToDalpay = true;
	      };
	      
	      scope.cancelPaymentFun = function(){
	    	  scope.isOrderPage = true;
			  	scope.isPaymentPage = false;
			  	scope.isRedirectToDalpay = false;
			  	scope.isAmountZero = false;
	      };
	      
	      scope.finishBtnFun =function(){
	    	  
	    	  webStorage.add("renewalOrderFormData",scope.formData);
    		  location.path("/renewalorderpreviewscreen/"+routeParams.orderId+"/"+routeParams.clientId);
	      };
  		
    }
  });
  selfcare.ng.application.controller('RenewalOrderController', 
 ['$scope','RequestSender','$rootScope','$routeParams','$modal','webStorage','HttpService','AuthenticationService',
  'SessionManager','$location',selfcare.controllers.RenewalOrderController]).run(function($log) {
      $log.info("RenewalOrderController initialized");
  });
}(selfcare.controllers || {}));
