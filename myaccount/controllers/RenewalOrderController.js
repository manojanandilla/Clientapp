RenewalOrderController = function(scope,RequestSender,routeParams,localStorageService) {
		  
	scope.clientId = routeParams.clientId || "";
	var planId	   = routeParams.planId || "";
  	scope.planselectionTab = true;
  	
  scope.singlePlanPricingDatas = function(singlePlanData,isPlanActive){
	  var isActive = isPlanActive;
	  if(isActive == true){
		  scope.planId = singlePlanData.planId;
		  scope.selectedPlanId = singlePlanData.planId;
		  scope.pricingDatas = singlePlanData.pricingData || [];
	  }
	  else{
		  scope.pricingDatas = [];
		  scope.selectedPlanId = "";
	  }
	  
  };
	
  if(localStorageService.get("clientTotalData")){
	RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
	  var clientData = data || {};
	  var totalOrdersData = [];
	  RequestSender.orderTemplateResource.query({region : clientData.state},function(data){
		  totalOrdersData = data;
		  
		  scope.plansData = [];
		  scope.clientOrdersData = [];
		  for(var j in totalOrdersData){
				if((totalOrdersData[j].planId == planId) && (totalOrdersData[j].isPrepaid == 'Y')){
					scope.plansData.push(totalOrdersData[j]); 
					scope.singlePlanPricingDatas(scope.plansData[0],true);
					localStorageService.add("storageData",{clientData:clientData,totalOrdersData:totalOrdersData});
					break;
				}
			  }
	  });
   });
  }
  		
};

selfcareApp.controller('RenewalOrderController',['$scope',
                                                'RequestSender',
                                                '$routeParams',
                                                'localStorageService',
                                                RenewalOrderController]);


