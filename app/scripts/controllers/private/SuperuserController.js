(function(module) {
    mifosX.controllers = _.extend(module, {
        SuperuserController: function(scope, resourceFactory) {
            scope.client = [];
            scope.offices = [];
            scope.cOfficeName = 'Head Office';
            scope.dOfficeName = 'Head Office';
            scope.bOfficeName = 'Head Office';
            scope.sOfficeName = 'Head Office';
            scope.chartType = 'Days';
            scope.collectionPieData = [];
            scope.cumCustomersPieData = [];
            scope.disbursedPieData = [];
            scope.formData = {};
            
           
            scope.formatdate = function(){
                var bardate = new Date();
                scope.formattedDate = [];
                for(var i=0; i<12;i++)
                {
                    var temp_date = bardate.getDate();
                    bardate.setDate(temp_date - 1);
                    var curr_date = bardate.getDate();
                    var curr_month = bardate.getMonth() +1;
                    scope.formattedDate[i] = curr_date + "/" + curr_month;
                }
            };scope.formatdate();

            
            scope.getWeek = function() {
                scope.formattedWeek = [];
                var checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                var time = checkDate.getTime();
                checkDate.setMonth(0);
                checkDate.setDate(1);
                var week = Math.floor(Math.round((time - checkDate) / 86400000) / 7);
                for(var i=0;i<12;i++)
                {
                    if(week==0)
                    {
                        week = 52;
                    }
                    scope.formattedWeek[i] = week - i;

                }
            };scope.getWeek();

            scope.getMonth = function(){
                var today = new Date();
                var aMonth = today.getMonth();
                scope.formattedMonth= [];
                var month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                for (var i=0; i<12; i++)
                {
                    scope.formattedMonth.push(month[aMonth]);
                    aMonth--;
                    if (aMonth < 0)
                    {
                        aMonth = 11;
                    }
                }
            }; scope.getMonth();

            scope.getBarData = function(firstData,secondClientData,secondLoanData){
                scope.BarData = [

                                    {
                                        "key": "New Client Joining",
                                        "values": [
                                            [ firstData[11] , secondClientData[11]] ,
                                            [ firstData[10] , secondClientData[10]] ,
                                            [ firstData[9] , secondClientData[9]] ,
                                            [ firstData[8] , secondClientData[8]] ,
                                            [ firstData[7] , secondClientData[7]] ,
                                            [ firstData[6] , secondClientData[6]] ,
                                            [ firstData[5] , secondClientData[5]] ,
                                            [ firstData[4] , secondClientData[4]] ,
                                            [ firstData[3] , secondClientData[3]] ,
                                            [ firstData[2] , secondClientData[2]] ,
                                            [ firstData[1] , secondClientData[1]] ,
                                            [ firstData[0] , secondClientData[0]]
                                        ]
                                    },
                                    {
                                        "key": "New Orders Created",
                                        "values": [
                                            [ firstData[11] , secondLoanData[11]] ,
                                            [ firstData[10] , secondLoanData[10]] ,
                                            [ firstData[9] , secondLoanData[9]] ,
                                            [ firstData[8] , secondLoanData[8]] ,
                                            [ firstData[7] , secondLoanData[7]] ,
                                            [ firstData[6] , secondLoanData[6]] ,
                                            [ firstData[5] , secondLoanData[5]] ,
                                            [ firstData[4] , secondLoanData[4]] ,
                                            [ firstData[3] , secondLoanData[3]] ,
                                            [ firstData[2] , secondLoanData[2]] ,
                                            [ firstData[1] , secondLoanData[1]] ,
                                            [ firstData[0] , secondLoanData[0]]
                                        ]
                                    }
                                ];
                };

            scope.getFcount = function (dateData,retrievedDateData,responseData) {
                for(var i in dateData )
                {    scope.fcount[i] = 0;
                    for(var j in retrievedDateData)
                    {
                        if(dateData[i]==retrievedDateData[j])
                        {
                            scope.fcount[i]=responseData[j].count;

                        }
                    }
                }
            };
            scope.getLcount = function (dateData,retrievedDateData,responseData) {
                for(var i in dateData )
                {    scope.lcount[i] = 0;
                    for(var j in retrievedDateData)
                    {
                        if(dateData[i]==retrievedDateData[j])
                        {
                            scope.lcount[i]=responseData[j].lcount;

                        }
                    }
                }
            };

		 scope.id = this.officeId || 1;	
            resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay',R_officeId:scope.id, genericResultSet:false} , function(data) {
                scope.client = data;
                scope.days = [];
                scope.tempDate = [];
                scope.fcount = [];
                for(var i in scope.client)
                {
                    scope.days[i] = scope.client[i].days;
                }
                for(var i in scope.days)
                {
                    var tday = scope.days[i][2];
                    var tmonth = scope.days[i][1];
                    var tyear = scope.days[i][0];
                    scope.tempDate[i] = tday + "/" + tmonth;
                }
                scope.getFcount(scope.formattedDate,scope.tempDate,scope.client);
		 scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'OrderTrendsByDay',R_officeId:scope.id, genericResultSet:false} , function(data) {
                    scope.ldays = [];
                    scope.ltempDate = [];
                    scope.lcount = [];
                    for(var i in data)
                    {
                        scope.ldays[i] = data[i].days;
                    }
                    for(var i in scope.ldays)
                    {
                        var tday = scope.ldays[i][2];
                        var tmonth = scope.ldays[i][1];
                        var tyear = scope.ldays[i][0];
                        scope.ltempDate[i] = tday + "/" + tmonth;
                    }
                    scope.getLcount(scope.formattedDate,scope.ltempDate,data);
                    scope.getBarData(scope.formattedDate,scope.fcount,scope.lcount);
                });
            });


           
 resourceFactory.groupTemplateResource.get(function(data) {scope.offices = data.officeOptions;});

/* Paymode Collection Chart */
		 scope.id = this.officeIdCollection || 1;
         resourceFactory.runReportsResource.get({reportSource: 'PaymodeCollection Chart',R_officeId:scope.id, genericResultSet:false} , function(data) 
            	{	scope.collectionPieData = data;
            		scope.showCollectionerror = false;
            		if(data[0].Collection == 0 && data[1].Collection == 0 && data[2].Collection == 0  && data[3].Collection == 0){
                    scope.showCollectionerror = true;
                }
         scope.collectedData = 		[{key:"Cash", y:scope.collectionPieData[0].Collection},
                	                 {key:"Cheque", y:scope.collectionPieData[1].Collection},
                	                 {key:"M-pesa", y:scope.collectionPieData[2].Collection},
                	                 {key:"Manual Mpesa", y:scope.collectionPieData[3].Collection}
                	                 ];
            });
            
/* status wise orders */
		 scope.id = this.officeIdCum || 1;
            resourceFactory.runReportsResource.get({reportSource: 'CumulativeCustomersChart',R_officeId:scope.id, genericResultSet:false} , function(data) {
            	
            	scope.showCumCustomerDataerror = false;
            	var count = 0;
            	scope.cumCustomersPieData = data;
        		for(var i in data){
            		if(data[i].clients==0){
            			count+=1;
            		}
            		
            	}
            	if(count==data.length)
        		scope.showCumCustomerDataerror = true;
        		scope.cumCustomerData = [];
        		for(var i in data)	{
        							scope.cumCustomerData.push({key:data[i].status,y:data[i].clients});
        							console.log(scope.cumCustomerData);
        					  		}
        		});
            	/*scope.cumCustomersPieData = data;
            	if(data[0].clients == 0 && data[1].clients == 0 && data[2].clients == 0){
                    scope.showCumCustomerDataerror = true;
                }
            	scope.cumCustomerData = [
            	                       {key:"Active", y:scope.cumCustomersPieData[0].clients},
            	                       {key:"Disconnected", y:scope.cumCustomersPieData[1].clients},
            	                       {key:"Pending", y:scope.cumCustomersPieData[2].clients}
            	                   ];
            });*/

             resourceFactory.runReportsResource.get({reportSource: 'Stock_Item_Details',R_officeId:1, genericResultSet:false} , function(data) 
             	{scope.disbursedPieData = data;
             	scope.showDisbursementerror=false;
             	var count = 0;
             	for(var i in data){
            		if(data[i].allocated==0){
            			count+=1;
            		}
            		
            	}
            	if(count==data.length)
            		scope.showDisbursementerror=true;
             	scope.disbursedData = [];
                 for(var i in data){
                	 console.log(data[i].Item);
                	 scope.disbursedData.push({key:data[i].Item,y:data[i].allocated});
                 }
             });
         
         
         
         /*Daily Data */
            scope.getDailyData = function(){
                scope.chartType = 'Days';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay',R_officeId:scope.id, genericResultSet:false} , function(data) {
		      scope.client = data;
                    scope.days = [];
                    scope.tempDate = [];
                    scope.fcount = [];
                    for(var i in scope.offices){
                        if(scope.offices[i].id == scope.id){
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for(var i in scope.client)
                    {
                        scope.days[i] = scope.client[i].days;
                    }
                    for(var i in scope.days)
                    {
                        var tday = scope.days[i][2];
                        var tmonth = scope.days[i][1];
                        var tyear = scope.days[i][0];
                        scope.tempDate[i] = tday + "/" + tmonth;
                    }
                    scope.getFcount(scope.formattedDate,scope.tempDate,scope.client);
			 scope.id = this.officeId || 1;
                    resourceFactory.runReportsResource.get({reportSource: 'OrderTrendsByDay',R_officeId:scope.id, genericResultSet:false} , function(data) {
                        scope.ldays = [];
                        scope.ltempDate = [];
                        scope.lcount = [];
                        for(var i in data)
                        {
                            scope.ldays[i] = data[i].days;
                        }
                        for(var i in scope.ldays)
                        {
                            var tday = scope.ldays[i][2];
                            var tmonth = scope.ldays[i][1];
                            var tyear = scope.ldays[i][0];
                            scope.ltempDate[i] = tday + "/" + tmonth;
                        }
                        scope.getLcount(scope.formattedDate,scope.ltempDate,data);
                        scope.getBarData(scope.formattedDate,scope.fcount,scope.lcount);
                    }); 
                });
            };

            scope.getWeeklyData = function(){
                scope.chartType = 'Weeks';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByWeek',R_officeId:scope.id, genericResultSet:false} , function(data) {
                    scope.client = data;
                    scope.weeks = [];
                    scope.fcount = [];

                    for(var i in scope.offices){
                        if(scope.offices[i].id == scope.id){
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for(var i in scope.client)
                    {
                        scope.weeks[i] = scope.client[i].Weeks;
                    }

                    scope.getFcount(scope.formattedWeek,scope.weeks,scope.client);
			 scope.id = this.officeId || 1;
                    resourceFactory.runReportsResource.get({reportSource: 'OrderTrendsByWeek',R_officeId:scope.id, genericResultSet:false} , function(data) {
                        scope.lweeks = [];
                        scope.lcount = [];
                        for(var i in data)
                        {
                            scope.lweeks[i] = data[i].Weeks;
                        }
                        scope.getLcount(scope.formattedWeek,scope.lweeks,data);
                        scope.getBarData(scope.formattedWeek,scope.fcount,scope.lcount);
                    });
                });
            };

            scope.getMonthlyData = function() {
                scope.chartType = 'Months';
                scope.id = this.officeId || 1;
                scope.formattedSMonth = [];
                var monthArray = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
                var today = new Date();
                var aMonth = today.getMonth();
                for (var i=0; i<12; i++)
                {
                    scope.formattedSMonth.push(monthArray[aMonth]);
                    aMonth--;
                    if (aMonth < 0)
                    {
                        aMonth = 11;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByMonth',R_officeId:scope.id, genericResultSet:false} , function(data) {
                    scope.client = data;
                    scope.months = [];
                    scope.fcount = [];

                    for(var i in scope.offices){
                        if(scope.offices[i].id == scope.id){
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for(var i in scope.client)
                    {
                        scope.months[i] = scope.client[i].Months;
                    }
                    scope.getFcount(scope.formattedMonth,scope.months,scope.client);
			 scope.id = this.officeId || 1;
                    resourceFactory.runReportsResource.get({reportSource: 'OrderTrendsByMonth',R_officeId:scope.id, genericResultSet:false} , function(data) {
                        scope.lmonths = [];
                        scope.lcount = [];

                        for(var i in data)
                        {
                            scope.lmonths[i] = data[i].Months;
                        }
                        scope.getLcount(scope.formattedMonth,scope.lmonths,data);
                        scope.getBarData(scope.formattedSMonth,scope.fcount,scope.lcount);
                    });
                });
            };

/* Paymode Collection Chart*/

            scope.getCollectionOffice = function () 
            {	var id = this.officeId || 1;
                for(var i in scope.offices){if(scope.offices[i].id==id){scope.cOfficeName = scope.offices[i].name;}}
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'PaymodeCollection Chart',R_officeId:scope.id, genericResultSet:false},function(data) 
                	{
                	scope.showCollectionerror = false;
                	scope.collectionPieData = data;
                	scope.collectedData=[];
                	if(data[0].Collection == 0 && data[1].Collection == 0 && data[2].Collection == 0 && data[3].Collection == 0)
                	{scope.showCollectionerror = true;}
                	for(var i in data){	console.log(data[i].PayMode);
                						scope.collectedData.push({key:data[i].PayMode,y:data[i].Collection});
                						console.log(scope.collectedData);
                					  }
                	});
            };
/* status wise orders */
            scope.getCumOffice = function () 
            {   var id = this.officeId || 1;
                for(var i in scope.offices)	{ if(scope.offices[i].id== id){scope.dOfficeName = scope.offices[i].name;} }
                scope.id = this.officeId || 1;
                var count = 0;
                scope.showCumCustomerDataerror = false;
                resourceFactory.runReportsResource.get({reportSource: 'CumulativeCustomersChart',R_officeId:scope.id, genericResultSet:false} , function(data) 
            		{
            		scope.cumCustomersPieData = data;
            		for(var i in data){
                		if(data[i].clients==0){
                			count+=1;
                		}
                		
                	}
                	if(count==data.length)
            		scope.showCumCustomerDataerror = true;
            		scope.cumCustomerData = [];
            		for(var i in data)	{console.log(data[i].status);
            							scope.cumCustomerData.push({key:data[i].status,y:data[i].clients});
            							console.log(scope.cumCustomerData);
            					  		}
            		});
            };

/* Stock Item Details */
            scope.getStock = function () 
            {	var id = this.officeId || 1;
                for(var i in scope.offices){if(scope.offices[i].id== id){scope.sOfficeName = scope.offices[i].name;}}
                scope.id = this.officeId || 1;
                var count=0;
                scope.showDisbursementerror=false;
                resourceFactory.runReportsResource.get({reportSource: 'Stock_Item_Details',R_officeId:scope.id, genericResultSet:false} , function(data) 
                	{scope.disbursedPieData = data;
                	for(var i in data){
                		if(data[i].allocated==0){
                			count+=1;
                		}
                		
                	}
                	if(count==data.length)
                		scope.showDisbursementerror=true;
                    scope.disbursedData = [];
            		for(var i in data)	{
            							console.log(data[i].Item);
										scope.disbursedData.push({key:data[i].Item,y:data[i].allocated});
										console.log(scope.disbursedData);}
                	});
            };

            scope.xFunction = function(){
                return function(d) {
                    return d.key;
                };
            };
            scope.yFunction = function(){
                return function(d) {
                    return d.y;
                };
            };
            var colorArray = ['#0f82f5', '#008000', '#808080', '#000000', '#FFE6E6'];
            var colorArrayPie =['#008000','#ff4500','#0f82f5'];
            scope.colorFunction = function() {
                return function(d, i) {
                    return colorArray[i];
                };
            };
            scope.colorFunctionPie = function() {
                return function(d, i) {
                    return colorArrayPie[i];
                };
            };

        }
    });
    mifosX.ng.application.controller('SuperuserController', ['$scope', 'ResourceFactory', mifosX.controllers.SuperuserController]).run(function($log) {
        $log.info("SuperuserController initialized");
    });
}(mifosX.controllers || {}));




    
    



