sap.ui.define([
	"./BaseController",
	"../utils/formatter"
],
	function (BaseController, formatter) {
		"use strict";
		return BaseController.extend("com.zeffortcalculatorhcl.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.getRouter().getRoute("Detail").attachPatternMatched(this.onDetailMatched, this);
				this.getView().byId("detailEdit").setVisible(true);
			},
			onEdit: function (sSaveorEdit) {
				this.getOwnerModel("oModelEstCal").setProperty("/SaveOrEdit", sSaveorEdit);
				this.getRouter().navTo("Calculate", {}, false);
			},
			onSearchCust: function () {
				this.getRouter().navTo("Search", {
					OpportunityId: this.getOwnerModel("oModelEstCal").getProperty("/OpportunityId")
				},false);
			}
			
		});
	});
