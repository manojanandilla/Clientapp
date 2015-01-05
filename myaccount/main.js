var selfcareApp = angular.module('selfcareApp',['configurations','ngResource','ngRoute','ui.bootstrap','pascalprecht.translate','modified.datepicker',
                                                	'webStorageModule','tmh.dynamicLocale','notificationWidget','LocalStorageModule']);


selfcareApp.config(function($httpProvider ,$translateProvider) {
	
	//Set headers
    $httpProvider.defaults.headers.common['X-Obs-Platform-TenantId'] = 'default';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    
	$translateProvider.useStaticFilesLoader({
        prefix: 'global-translations/locale-',
        suffix: '.json'
	});
	
	 $translateProvider.preferredLanguage(selfcareModels.locale);
});

selfcareApp.controller('SelfcareMainController',['$rootScope','$translate','SessionManager','RequestSender','AuthenticationService',
                                                 '$location','$modal','localStorageService','tmhDynamicLocale',
                                                 function(scope, translate,sessionManager,RequestSender,
                     			   				    authenticationService,location,modal,localStorageService,tmhDynamicLocale){
	   scope.domReady = true;
	   scope.selfcare_userName = "";
	   scope.iskortaTokenAvailable = false;
	   var urlAfterHash = window.location.hash;
	   if((urlAfterHash.match('/active') == '/active')||(urlAfterHash.match('/orderbookingscreen') == '/orderbookingscreen')
			   ||(urlAfterHash.match('/kortasuccess') == '/kortasuccess') || (urlAfterHash.match('/globalpaysuccess') == '/globalpaysuccess')){
		   scope.isLandingPage= true;
		   
	   }else{
		   scope.isLandingPage= false;
	   }
	   
	   (urlAfterHash.match('/active') == '/active') ? scope.isRegClientProcess = true : scope.isRegClientProcess = false;
	   
//setting the date format
scope.setDf = function () {
	   localStorageService.get('dateformat') ? scope.df = scope.dateformat = localStorageService.get('dateformat') 
			   								 : (localStorageService.add('dateformat', 'dd MMMM yyyy'),
			   									scope.df = scope.dateformat = 'dd MMMM yyyy');
};scope.setDf();
	   
//getting languages form model Lang.js 
scope.langs = Langs;

if(localStorageService.get('Language')){
	   
	   for ( var i in scope.langs) {
		   if(scope.langs[i].code == localStorageService.get('Language')){
			   scope.optlang = scope.langs[i];
			   tmhDynamicLocale.set(scope.optlang.code);
			   translate.uses(scope.optlang.code);
			   break;
		   };
	   };
	   
}else{
	   scope.optlang = scope.langs[0];
}

//set the language code when change the language 
 scope.changeLang = function (lang) {
     localStorageService.add('Language', lang.code);
     scope.optlang = lang;
     tmhDynamicLocale.set(lang.code);
     translate.uses(lang.code);
 };

//forgot password success msg popup controller
 var ForgotPwdPopupSuccessController = function($scope,$modalInstance){
		
		$scope.done = function(){
			$modalInstance.close('delete');
	};
};
		
//forgot password popup controller
	 var ForgotPwdPopupController = function($scope,$modalInstance){
		 
		 $scope.isProcessing = false;
		 $scope.emailData = {};
		 
		 $scope.accept = function(email){
			 
			 $scope.formData = {'uniqueReference':$scope.emailData.email};
			 authenticationService.authenticateWithUsernamePassword(function(data){
			 
				 $scope.isProcessing = true;
				 $scope.stmError = null;
				 RequestSender.forgotPwdResource.update($scope.formData,function(successData){
					 
					 $scope.isProcessing = false;
					 $modalInstance.close('delete');
					 modal.open({
						 templateUrl: 'forgotpwdpopupsuccess.html',
						 controller: ForgotPwdPopupSuccessController,
						 resolve:{}
					 });
					 
				 },function(errorData){
					 $scope.stmError = errorData.data.errors[0].userMessageGlobalisationCode;
					 $scope.isProcessing = false;
				 });
				 
			 });
		};
		
		$scope.reject = function(){
			$modalInstance.dismiss('cancel');
		};
	 };
	 
	 //for forgot password popup
	 scope.forgotPwdPopup = function(){
		 modal.open({
			 templateUrl: 'forgotpwdpopup.html',
			 controller: ForgotPwdPopupController,
			 resolve:{}
			});
	 };
	 
	//isActive Function 
	 scope.isActive = function (route) {
		
		 var active = route === location.path();
		 	return active;
   };
	 
	//calling this method every time if session is exit or not
	   sessionManager.restore(function(session) {
	        scope.currentSession = session;
	    });
	   
	   scope.signout = function(){
	    	  scope.currentSession = sessionManager.clear();
	      };
}]);