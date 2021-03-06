PrepaidPaymentController = function(scope,routeParams,RequestSender,localStorageService,location,modal){
	
	//scope.termsAndConditions = true;
	
	var storageData			= localStorageService.get("storageData");
	var clientData 			= storageData.clientData;
	scope.clientId			= clientData.id;
	scope.planData			= {};
	var encrytionKey 		= selfcareModels.encriptionKey;
	scope.amountEmpty 		= true;
	
	  scope.paymentgatewayDatas = [];
	  RequestSender.paymentGatewayConfigResource.get(function(data) {
		  if(data.globalConfiguration){
			  for(var i in data.globalConfiguration){
				   if(data.globalConfiguration[i].enabled && data.globalConfiguration[i].name != 'is-paypal-for-ios'  
					   && data.globalConfiguration[i].name != 'is-paypal'){
					   scope.paymentgatewayDatas.push(data.globalConfiguration[i]);
				   }
			  }
			  scope.paymentgatewayDatas.length==0 ?scope.paymentGatewayName="" : "";
		  }
	  });
	
	var hostName = selfcareModels.selfcareAppUrl;
	
	//this function calls when comeout from amount field
	scope.amountFieldFun = function(amount){
		if(amount){
			if(amount<=0){
				scope.amountEmpty = true;
				delete scope.planData.price;
				delete scope.planData.planCode;
				delete scope.planData.id;
				delete scope.amount;
				alert("Amount Must be Greater than Zero");
			}else{
				scope.amountEmpty 		= false;
				scope.planData.price 	= amount;
				scope.planData.planCode = 'Pay';
				scope.planData.id 		= 0;
				scope.paymentGatewayName = scope.paymentgatewayDatas.length>=1 ?scope.paymentgatewayDatas[0].name :"";
				scope.paymentGatewayFun(scope.paymentGatewayName);
			}
		}else{
			scope.amountEmpty 		= true;
			delete scope.planData.price;delete scope.planData.planCode;delete scope.planData.id;delete scope.amount;
			if(amount==0) alert("Amount Must be Greater than Zero");
		}
	};
	
	//this fun call when user select a particular PW 
	scope.paymentGWNameFun  = function(paymentGatewayName){
		scope.paymentGatewayName = paymentGatewayName;
	};
	  
	//this fun call when the user click on proceed btn
	scope.paymentGatewayFun  = function(paymentGatewayName){
			  scope.termsAndConditions = false;
			  var paymentGatewayValues = {};
			  for (var i in scope.paymentgatewayDatas){
				  if(scope.paymentgatewayDatas[i].name=='internalPayment'){
					  break;
				  } else if(scope.paymentgatewayDatas[i].name==paymentGatewayName){
					  paymentGatewayValues =  JSON.parse(scope.paymentgatewayDatas[i].value);
					  break;
				  };
				  
			  }
	     switch(paymentGatewayName){
	     
			case 'dalpay' :
					var url = paymentGatewayValues.url+'?mer_id='+paymentGatewayValues.merchantId+'&pageid='+paymentGatewayValues.pageId+'&item1_qty=1&num_items=1';
				scope.paymentURL =  url+"&cust_name="+clientData.displayName+"&cust_phone="+clientData.phone+"&cust_email="+clientData.email+"&cust_state="+clientData.state+""+				
				  	"&cust_address1="+clientData.addressNo+"&cust_zip="+clientData.zip+"&cust_city="+clientData.state+"&item1_desc="+scope.planData.planCode+"&item1_price="+scope.planData.price+"" + 	  				
				  	"&user1="+scope.clientId+"&user2="+hostName+"&user3=orderbookingscreen/payment/"+scope.clientId+"/"+0+"/"+0;
					break;
					
			case 'korta' :
				
			    var kortaStorageData = {clientData :clientData,planId:0,planData : scope.planData,screenName :'payment',paymentGatewayValues:paymentGatewayValues};	
			    var encodeURIComponentData = encodeURIComponent(JSON.stringify(kortaStorageData));
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponentData,encrytionKey).toString();
				
				var token = clientData.selfcare.token;		    		
				if(token != null && token != "") scope.paymentURL = "#/kortatokenintegration?key="+encryptedData;		    		 
				else scope.paymentURL = "#/kortaintegration?key="+encryptedData;	    		
				break;
					
			case 'paypal' :
				var query = {clientId :scope.clientId,locale : "en",returnUrl:hostName,screenName :'payment'};
				
				scope.paymentURL = paymentGatewayValues.paypalUrl+'='+paymentGatewayValues.paypalEmailId+"&item_name="+scope.planData.planCode+"&amount="+scope.planData.price+"" +	  	  				
				  	  "&custom="+JSON.stringify(query);
					break;
					
			case 'globalpay' :
				var globalpayStorageData = {clientData :clientData,planId:0,screenName :'payment',price :scope.planData.price,
											 priceId : 0, globalpayMerchantId:paymentGatewayValues.merchantId};	
			    var encodeURIComponentData = encodeURIComponent(JSON.stringify(globalpayStorageData));
				var encryptedData = CryptoJS.AES.encrypt(encodeURIComponentData,encrytionKey).toString();
				
				scope.paymentURL = "#/globalpayintegration?key="+encryptedData;
				break;
				
			case 'neteller' :
				var nettellerData = {clientId:scope.clientId,currency:"EUR",total_amount:scope.planData.price,
					locale:"en",source:'neteller',screenName:'payment'};
				var encodeURINetellerData = encodeURIComponent(JSON.stringify(nettellerData));
				var encryptedData = CryptoJS.AES.encrypt(encodeURINetellerData,encrytionKey).toString();
				scope.paymentURL = "#/neteller/"+0+"?key="+encryptedData;
				break;
				
			case 'internalPayment' :
				scope.paymentURL =  "#/internalpayment/"+'payment'+"/"+scope.clientId+"/"+0+"/"+0+"/"+scope.planData.price;
				break;
					
			default : break;
			}
		    	  		 	
		  };
    
	//this fun call when the user click on proceed btn
	  scope.proceedFun = function (){
		  scope.paymentGatewayFun(scope.paymentGatewayName);
	  };
	  
    var TermsandConditionsController = function($scope,$modalInstance){
    	$scope.done = function(){
    		$modalInstance.dismiss('cancel');
    	};
    };
   
    scope.termsAndConditionsFun = function(){
		    modal.open({
				 templateUrl: 'termsandconditions.html',
				 controller: TermsandConditionsController,
				 resolve:{}
		    });
    };
    
    
};

selfcareApp.controller("PrepaidPaymentController",['$scope',
                                                   '$routeParams',
                                                   'RequestSender',
                                                   'localStorageService',
                                                   '$location',
                                                   '$modal',
                                                   PrepaidPaymentController]);
