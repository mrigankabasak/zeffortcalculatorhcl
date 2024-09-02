sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "com/zeffortcalculatorhcl/model/models",
],
    function (BaseController, MessageBox, models) {
        "use strict";

        return BaseController.extend("com.zeffortcalculatorhcl.controller.Opportunity", {
            onInit: function () {
                  this.getView().addEventDelegate({
                    onBeforeShow: ()=>{
                        // Clearing the Global Input Model and the radio buttons
                        this.getOwnerModel("oModelEstCal").destroy();
			            this.setOwnerModel(models.getEcInputModel(this.getOwnerModel()), "oModelEstCal");
                        this.getView().byId("radio_L").setSelected(false);
                        this.getView().byId("radio_U").setSelected(false);
                        this.getView().byId("radio_C").setSelected(false);
                    }   
                });
            },
            onWorkpackage: function (oEvent, value) {
                if (value) {
                    this.getOwnerModel("oModelEstCal").setProperty("/OppType", value);
                }
            },

            onOpportunitysubmit: function () {             
                let oJsData = {
                    "CustId": this.getOwnerModel("oModelEstCal").getProperty("/CustId"),
                    "OppType": this.getOwnerModel("oModelEstCal").getProperty("/OppType"),
                    "CustName": this.getOwnerModel("oModelEstCal").getProperty("/CustName"),
                    "OppName": this.getOwnerModel("oModelEstCal").getProperty("/OppName"),
                };

                if (oJsData.CustId && oJsData.CustName && oJsData.OppName && oJsData.OppType) {
                        
                    let aFilter = [];
                    aFilter.push(this.createFilter("CustId", oJsData.CustId));
                    aFilter.push(this.createFilter("OppType", oJsData.OppType));
                    aFilter.push(this.createFilter("CustName", oJsData.CustName));
                    aFilter.push(this.createFilter("OppName", oJsData.OppName));
                    
                    sap.ui.core.BusyIndicator.show();
                    let oResponse = this.callBackEnd("/zi_hcl_opp_custom", "GET", aFilter, {}, {});
                    //let oResponse = this.callBackEnd("/zi_hcl_opp_custom", "POST", [], oJsData);
                    oResponse.then((oResponse) => {
                        let result = oResponse.data.results[0];
                        //let result = oResponse.data.results;
                        this.getOwnerModel("oModelEstCal").setProperty("/OpportunityId", result.OpportunityId);
                        this.getOwnerModel("oModelEstCal").setProperty("/Version", result.Version);

                        sap.ui.core.BusyIndicator.hide();
                        
                            MessageBox.information("Opportunity ID " + result.OpportunityId + " has been created for future reference", {    
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: () => {
                                this.getRouter().navTo("Calculate", {}, false);
                                return;
                            }
                        });

                    }).catch((error) => {
                        sap.m.MessageBox.success( JSON.stringify(error));
                        sap.ui.core.BusyIndicator.hide();
                    });

                }else{
                    MessageBox.error("Please enter all the required fields");
                }

            },
        });
    });
