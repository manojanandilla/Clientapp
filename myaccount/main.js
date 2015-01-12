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

SelfcareMainController = function(scope, translate,sessionManager,RequestSender,authenticationService,location,modal,localStorageService,tmhDynamicLocale,webStorage,route){
	
	   scope.domReady = true;
	   var urlAfterHash = window.location.hash;
	   
	   if(localStorageService.get('selfcare_sessionData')||webStorage.get("clientTotalData")){
		   scope.isLandingPage= true;
	   }
	   
	   (urlAfterHash.match('/active') == '/active') ? (scope.isLandingPage= true,scope.isRegClientProcess = true) : scope.isRegClientProcess = false;
	   
	   //adding web tv url
	   scope.webtvURL = selfcareModels.webtvURL;
	   localStorageService.add("selfcareAppUrl",selfcareModels.selfcareAppUrl);
	   
	   
//setting the date format
scope.setDf = function () {
	   localStorageService.get('localeDateFormat') ? scope.df = scope.dateformat = localStorageService.get('localeDateFormat') 
			   								 : (localStorageService.add('localeDateFormat', 'dd MMMM yyyy'),
			   									scope.df = scope.dateformat = 'dd MMMM yyyy');
};scope.setDf();
	   
//getting languages form model Lang.js 
scope.langs = Langs;

if(localStorageService.get('localeLang')){
	   var localeLang = localStorageService.get('localeLang');
	   for ( var i in scope.langs) {
		   if(scope.langs[i].code == localeLang){
			   scope.localeLang = scope.langs[i];
			   tmhDynamicLocale.set(localeLang);
			   translate.uses(localeLang);
			   break;
		   };
	   };
	   
}else{
	   scope.localeLang = scope.langs[0];
}

//set the language code when change the language 
 scope.changeLang = function (lang) {
     localStorageService.add('localeLang', lang.code);
     scope.localeLang = lang;
     tmhDynamicLocale.set(lang.code);
     translate.uses(lang.code);
 };
 
 window.setInterval(function(){
	 //checking session every  second when scope.currentSession.user not null
	 if((scope.currentSession.user != null)){
		 //in this checking is it Registration Page or not  
		 if(!(urlAfterHash.match('/active') == '/active')){
			 if(localStorageService.get('selfcare_sessionData')||webStorage.get("clientTotalData")){}
			 else scope.signout();
		 }
	 }
   },1000);

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
	    	  route.reload();
	   };
};

selfcareApp.controller('SelfcareMainController',['$rootScope',
                                                 '$translate',
                                                 'SessionManager',
                                                 'RequestSender',
                                                 'AuthenticationService',
                                                 '$location',
                                                 '$modal',
                                                 'localStorageService',
                                                 'tmhDynamicLocale',
                                                 'webStorage',
                                                 '$route',
                                                 SelfcareMainController]);