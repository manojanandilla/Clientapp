(function(module) {
  mifosX.controllers = _.extend(module, {
	  EditJobParameters: function(scope, routeParams, resourceFactory, location,dateFilter,$rootScope) {
		  
		  scope.reportDatas =[];
		  scope.billingMessageDatas=[];
		  scope.jobparameters=[];
		  scope.provisionSysData=[];
		  scope.formData=[];
		  scope.date={};
		//  scope.start.date = new Date();
		    scope.date.processDate = dateFilter(new Date(),'dd MMMM yyyy');
	        scope.date.dueDate = dateFilter(new Date(),'dd MMMM yyyy');
	        scope.date.exipiryDate = dateFilter(new Date(),'dd MMMM yyyy');
      resourceFactory.jobsparameters.get({jobId : routeParams.id}, function(data) {
        scope.reportDatas = data.queryData;
        scope.billingMessageDatas=data.billingMessageDatas;
        scope.jobparameters=data.jobparameters;
        scope.provisionSysData=data.provisionSysData;
        scope.formData=data;
        
        var actDate = dateFilter(scope.jobparameters.processDate,'dd MMMM yyyy');
        scope.date.processDate = new Date(actDate);
        
        var dueDate = dateFilter(scope.jobparameters.dueDate,'dd MMMM yyyy');
        scope.date.dueDate = new Date(dueDate);
        
        var exipiryDate= dateFilter(scope.jobparameters.exipiryDate,'dd MMMM yyyy');
        scope.date.exipiryDate = new Date(exipiryDate);
       
       
        if(data.jobparameters.isDynamic=="Y"){
        	scope.formData.isDynamic=true;
        }
        
        if(data.jobparameters.isAutoRenewal=="Y"){
        	scope.formData.isAutoRenewal=true;
        }
        
        if(data.jobparameters.updateStatus=="Y"){
        	scope.formData.isUpdateStatus=true;
        }
        
        if(data.jobparameters.createTicket=="Y"){
        	scope.formData.isCreateTicket=true;
        }else{
        	scope.formData.isCreateTicket=false;
        }
       
      });
       
      scope.cancel = function() {
        location.path('/jobs');
      }; 

      scope.submit = function() {
    	
    	  this.formData.jobName=this.formData.name;
    	  this.formData.dateFormat = 'dd MMMM yyyy';
    	  this.formData.locale = $rootScope.locale.code;
    	  this.formData.reportName=this.formData.jobparameters.batchName;
    	  this.formData.messageTemplate=this.formData.jobparameters.messageTemplate;
    	  this.formData.emailId=this.formData.jobparameters.emailId;
    	  this.formData.URL=this.formData.jobparameters.url;
    	  this.formData.ProvSystem=this.formData.jobparameters.provSystem;
    	  this.formData.Username=this.formData.jobparameters.username;
    	  this.formData.Password=this.formData.jobparameters.password;
    	  
    	  if(this.formData.name == "INVOICING"){this.formData.processDate = dateFilter(scope.date.processDate,'dd MMMM yyyy');}
    	  if(this.formData.name== "STATEMENT"){this.formData.dueDate = dateFilter(scope.date.dueDate,'dd MMMM yyyy');}
    	  if(this.formData.name== "AUTO_EXPIRY"){this.formData.exipiryDate = dateFilter(scope.date.exipiryDate,'dd MMMM yyyy');}
    	  if(this.formData.name == "PDF"){this.formData.processDate = dateFilter(scope.date.processDate,'dd MMMM yyyy');}
    	  if(this.formData.name == "EXPORTDATA"){this.formData.processDate = dateFilter(scope.date.processDate,'dd MMMM yyyy');}
         
      delete this.formData.jobId;
   	  delete this.formData.displayName;
   	  delete this.formData.name;
   	  delete this.formData.cronExpression;
   	  delete this.formData.cronDescription;
   	  delete this.formData.active;
   	  delete this.formData.currentlyRunning;
   	  delete this.formData.lastRunHistory;
   	  delete this.formData.queryData;
   	  delete this.formData.jobparameters;
   	  delete this.formData.nextRunTime;
   	  delete this.formData.billingMessageDatas;
   	  delete this.formData.historyId;
   	  delete this.formData.initializingError;
   	  delete this.formData.provisionSysData;
   	  
          
        resourceFactory.jobsparameters.update({jobId: routeParams.id}, this.formData, function(data){
          location.path('/viewschedulerjob/'+data.resourceId);
        });
      };
    }
  });
  mifosX.ng.application.controller('EditJobParameters', ['$scope', '$routeParams', 'ResourceFactory', '$location','dateFilter','$rootScope', mifosX.controllers.EditJobParameters]).run(function($log) {
    $log.info("EditJobParameters initialized");
  });
}(mifosX.controllers || {}));
