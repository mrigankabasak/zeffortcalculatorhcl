sap.ui.define([
	"./BaseController",
	"../utils/formatter"
],
	function (BaseController, formatter) {
		"use strict";

		return BaseController.extend("com.zeffortcalculatorhcl.controller.HCLDetail", {
			formatter: formatter,
			onInit: async function () {
				this.getRouter().getRoute("HCLDetail").attachPatternMatched(this.onDetailMatched, this);

			},

			onSwitchChange: function (oEvent) {
				this.getOwnerModel("pgUiData").setProperty("/enableTableData", oEvent.getSource().getState());
				oEvent.getSource().getState() ? this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "H") : this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "M");
			},

			onChangeHoursorMonths: function (oEvent) {
				switch (oEvent.getParameter("selected")) {
					case true:
						this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "M");
						break;
					default:
						this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "H");
						break;
				}
			},

			onEdit: function (sSaveorEdit) {
				this.getOwnerModel("oModelEstCal").setProperty("/SaveOrEdit", sSaveorEdit);
				this.getRouter().navTo("Calculate", {}, false);
			},

			onHomePage: function () {
				this.getRouter().navTo("Home", {}, false);
			},

			onSearchCust: function () {
				this.getRouter().navTo("Search", {
					OpportunityId: this.getOwnerModel("oModelEstCal").getProperty("/OpportunityId")
				}, false);
			}
		});
	});
