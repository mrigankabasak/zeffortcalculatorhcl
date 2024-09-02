sap.ui.define([
	"./BaseController",
	"com/zeffortcalculatorhcl/model/models",
	"sap/ui/core/routing/History",
	"../utils/formatter",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/library",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/m/Label"
],
	function (BaseController, models, History, formatter, MessageBox, Dialog, Button, TextArea, HorizontalLayout, VerticalLayout, mobileLibrary, Text, VBox, Label) {
		"use strict";
		let ButtonType = mobileLibrary.ButtonType;
		let DialogType = mobileLibrary.DialogType;
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
