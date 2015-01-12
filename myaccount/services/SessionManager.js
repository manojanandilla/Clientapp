selfcareApp.service("SessionManager",['$rootScope','HttpService','$location','localStorageService',
                                      			function(scope, httpService,location,localStorageService){
	
      var EMPTY_SESSION = {user:null};

      this.clear = function() {
    	localStorageService.remove("selfcare_sessionData");
    	localStorageService.remove("clientTotalData");
        localStorageService.remove('localeLang');
        localStorageService.remove('selfcareAppUrl');
        httpService.cancelAuthorization();
        scope.isLandingPage= false;
		location.path('/').replace();
        return scope.currentSession= {user:null};
      };

        this.restore = function(handler) {
            var selfcare_sessionData = localStorageService.get('selfcare_sessionData');
            if (selfcare_sessionData !== null) {
              httpService.setAuthorization(selfcare_sessionData.authenticationKey);
            	  var clientData = localStorageService.get("clientTotalData");
            	  if(clientData){
            		  scope.selfcare_userName = clientData.displayName;
            		  clientData.selfcare.token ? scope.iskortaTokenAvailable = true :  scope.iskortaTokenAvailable = false;
            		  if(location.path() == "/")location.path('/profile');
            		  else if(location.path())location.path(location.path());
            		  else location.path('/profile');
            	  }
                handler({user: 'selfcare'});
            } else {
              handler(EMPTY_SESSION);
            }
        };
}]);