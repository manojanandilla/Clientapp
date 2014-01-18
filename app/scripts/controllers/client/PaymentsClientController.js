(function(module) {
  mifosX.controllers = _.extend(module, {
	  PaymentsClientController: function(scope,webStorage, resourceFactory, routeParams, location,dateFilter,validator) {

        scope.formData = {};
        scope.clientId = routeParams.id;
        var clientData = webStorage.get('clientData');
	    scope.displayName=clientData.displayName;
	    scope.statusActive=clientData.statusActive;
	    scope.accountNo=clientData.accountNo;
	    scope.officeName=clientData.officeName;
	    scope.balanceAmount=clientData.balanceAmount;
	    scope.currency=clientData.currency;
	    scope.imagePresent=clientData.imagePresent;
        //scope.datass = {};
        scope.start={};
         scope.start.date = new Date();
        resourceFactory.paymentsTemplateResource.getPayments(function(data){
        	scope.payments = data;
            scope.data = data.data;
          scope.paymentTypeData=function(value){
            	
            	for(var i=0;i<scope.data.length;i++){
            		
            		if(scope.data[i].id==value){
            			scope.paymentType=scope.data[i].mCodeValue;
            		}
            	}
            };
        //  scope.formData.destinationOfficeId = scope.offices[0].id;  
        });

        scope.dbClick = function(){
        	console.log("dbclick");
        	return false;
        };
        
        scope.dbClick = function(){
        	console.log("dbclick");
        	return false;
        };
        
        scope.submit = function() {
        	scope.flag = false;
          this.formData.locale = "en";
          this.formData.dateFormat = "dd MMMM yyyy";
      	  var paymentDate = dateFilter(scope.start.date,'dd MMMM yyyy');
          this.formData.paymentDate= paymentDate;
          var res1 = validator.validateZipCode(scope.formData.receiptNo);
          resourceFactory.paymentsResource.save({clientId : routeParams.id}, this.formData, function(data){
        	  scope.flag = false;
            location.path('/viewclient/'+routeParams.id);
          },function(errData){
        	  scope.flag = false;
          });
        };

    }
  });
  mifosX.ng.application.controller('PaymentsClientController', ['$scope','webStorage', 'ResourceFactory', '$routeParams', '$location','dateFilter','HTValidationService', mifosX.controllers.PaymentsClientController]).run(function($log) {
    $log.info("PaymentsClientController initialized");
  });
}(mifosX.controllers || {}));
