KortaTokenController = function(scope, routeParams, location, localStorageService,$timeout) {
		  
		  //values getting form constants.js file
		  var kortaServer 			= selfcareModels.kortaServer;
		  var kortaAmountField 		= selfcareModels.kortaAmountField;
		  var kortaclientId			= selfcareModels.kortaclientId;
		  var kortaTokenValue 		= selfcareModels.kortaTokenValue;
		  var encrytionKey 			= selfcareModels.encriptionKey;
		  scope.currency 			= selfcareModels.kortaCurrencyType;
		  var langs 				= Langs;
		  var temp 					= localStorageService.get('Language')||"";
		  scope.optlang 			= temp.code || langs[0].code;
		  
		  var encryptedData 		= location.search().key;
		  
		  var decryptedData 		= CryptoJS.AES.decrypt(encryptedData, encrytionKey).toString(CryptoJS.enc.Utf8);
      	  var kortaStorageData 		= JSON.parse(decodeURIComponent(decryptedData));
      	  var clientData 			= kortaStorageData.clientData || "";
      	  var paymentGatewayValues 	= kortaStorageData.paymentGatewayValues || "";
      	  var planData 				= kortaStorageData.planData || "";
		  
		  var clientId 				= clientData.id;
		  scope.fullName 			= clientData.displayName;
		  scope.address 			= clientData.addressNo;
		  scope.emailId 			= clientData.email;
		  clientData.zip 			== "" ? scope.zipcode = clientData.city : scope.zipcode = clientData.zip;
		  scope.city 				= clientData.city;
		  scope.country 			= clientData.country;
		  scope.mobileNo 			= clientData.phone;
		  
		  scope.amount 				= planData.price;
		  scope.description 		= planData.planCode;
		  scope.kortaMerchantId 	= paymentGatewayValues.merchantId;
		  scope.kortaTerminalId 	= paymentGatewayValues.terminalId;
		  
		  var token 				= clientData.selfcare.token || "";
		  scope.tokenVal			= CryptoJS.AES.decrypt(token, encrytionKey).toString(CryptoJS.enc.Utf8);
		  var encryptedToken 		= CryptoJS.AES.encrypt(scope.tokenVal, encrytionKey).toString();
		  
			  localStorageService.add("secretCode",paymentGatewayValues.secretCode);
			  var encryptData = {};
			  encryptData[kortaAmountField]     = scope.amount;   	encryptData[kortaTokenValue] 	= encryptedToken;	
			  encryptData[kortaclientId] 		= clientId;			encryptData.locale 				= scope.optlang; 
			  encryptData.email 				= scope.emailId;
			  
			  var encodeURIComponentData = encodeURIComponent(JSON.stringify(encryptData));
			  
			  var encrytedSearchStr = CryptoJS.AES.encrypt(encodeURIComponentData, encrytionKey).toString();
			  
			  scope.downloadurl = selfcareModels.additionalKortaUrl+"/"+kortaStorageData.screenName+"/"+kortaStorageData.planId+"/"+planData.id+"" +
			  						"?key="+encrytedSearchStr+"&";
			  
			  if(kortaServer == 'TEST'){
				  scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
				  + scope.kortaTerminalId + scope.description + "//1/" 
				  +scope.tokenVal + paymentGatewayValues.secretCode +kortaServer;
			  }else if(kortaServer == 'LIVE'){
				  scope.md5data = scope.amount + scope.currency + scope.kortaMerchantId
				  + scope.kortaTerminalId + scope.description + "//1/" 
				  +scope.tokenVal + paymentGatewayValues.secretCode;
			  }else{
				  alert("Please Configure the Server Type Properly. Either 'TEST' or 'LIVE'");
				  location.path('/profile');
			  }

			  scope.md5value=md5(scope.md5data);
			 
			  $timeout(function() {
				  $("#submitKortaTokenIntegration").click();
			    }, 1000);
    };
    
selfcareApp.controller('KortaTokenController', ['$scope', 
                                                '$routeParams', 
                                                '$location', 
                                                'localStorageService', 
                                                '$timeout', 
                                                KortaTokenController]);
