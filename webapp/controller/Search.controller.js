sap.ui.define([
	"./BaseController",
	"sap/ui/core/library",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SearchField",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/ColumnListItem",
	"sap/m/Column"
],
	function (BaseController, CoreLib, Filter, FilterOperator, SearchField, Column, Label, Text, ColumnListItem) {
		"use strict";
		const { BusyIndicator } = CoreLib;
		return BaseController.extend("com.zeffortcalculatorhcl.controller.Search", {
			onInit: function () {
				this.getView().addEventDelegate({
					onAfterRendering: () => {
						this.tbCustomerTemplate = this.getView().byId("tbCustomer")?.getBindingInfo("items")?.template;
					}
				});
				this.getRouter().getRoute("Search").attachPatternMatched(this.onSearchMatched, this);
			},

			onSearchMatched: function (oEvent) {
				if (oEvent.getParameter("arguments").OpportunityId) {
					this.getOwnerModel("oModelEstCal").setProperty("/searchParam", oEvent.getParameter("arguments").OpportunityId);
					this.onSearch();
				}
				else {
					this.getOwnerModel("oModelEstCal").setProperty("/searchParam", "");
					let oTable = this.getView().byId("tbCustomer");
					oTable.setVisible(false);
					oTable.unbindItems();

				}
			},

			onSearch: function () {
				let aFilter = [];
				let oTable = this.getView().byId("tbCustomer");
				if (this.getOwnerModel("oModelEstCal").getProperty("/searchParam")) {
					aFilter.push(new Filter({
						path: "CustId",
						operator: FilterOperator.EQ,
						value1: this.getOwnerModel("oModelEstCal").getProperty("/searchParam")
					}));
					aFilter.push(new Filter({
						path: "OpportunityId",
						operator: FilterOperator.EQ,
						value1: this.getOwnerModel("oModelEstCal").getProperty("/searchParam")
					}));

					oTable.bindItems({
						path: "/zi_hcl_free_sel",
						template: this?.tbCustomerTemplate,
						filters: aFilter
					});
					oTable.setVisible(true);
				} else {
					oTable.setVisible(false);
					oTable.unbindItems();
				}
			},

			onItemPress: function (oEvent) {
				if (oEvent.getSource().getBindingContext()) {
					switch (1) {
						case 1:
							this.getRouter().navTo("HCLDetail", {
								CustId: oEvent.getSource().getBindingContext().getProperty("CustId"),
								OpportunityId: oEvent.getSource().getBindingContext().getProperty("OpportunityId"),
								Version: oEvent.getSource().getBindingContext().getProperty("Version")
							}, false);
							break;

						default:
							this.getRouter().navTo("Detail", {
								CustId: oEvent.getSource().getBindingContext().getProperty("CustId"),
								OpportunityId: oEvent.getSource().getBindingContext().getProperty("OpportunityId"),
								Version: oEvent.getSource().getBindingContext().getProperty("Version")
							}, false);
							break;
					}
				}

			},

			handleValueHelp: function () {
				// Loading F4 help from S4
				BusyIndicator.show();
				let oF4Help = this.callBackEnd("/zi_hcl_value_help", "GET", [], {}, {});
				oF4Help.then((oResponse) => {
					let result = oResponse.data.results;
					this.getOwnerModel("oModelEstCal").setProperty("/custValueHelp", result);
					BusyIndicator.hide();
					this._oBasicSearchField = new SearchField();
					this.loadFragment({
						name: "com.zeffortcalculatorhcl.view.fragment.ValueHelpDialog"
					}).then(function (oDialog) {
						var oFilterBar = oDialog.getFilterBar(), oColumnOppId, oColumnCustId, oColumnCustName, oColumnCreatedOn, oColumnCreatedBy;
						this._oVHD = oDialog;

						this.getView().addDependent(oDialog);

						// Set Basic Search for FilterBar
						oFilterBar.setFilterBarExpanded(false);
						oFilterBar.setBasicSearch(this._oBasicSearchField);

						// Trigger filter bar search when the basic search is fired
						this._oBasicSearchField.attachSearch(function () {
							oFilterBar.search();
						});

						oDialog.getTableAsync().then(function (oTable) {

							oTable.setModel(this.getOwnerModel("oModelEstCal"));

							// For Desktop and tabled the default table is sap.ui.table.Table
							if (oTable.bindRows) {
								// Bind rows to the ODataModel and add columns
								oTable.bindAggregation("rows", {
									path: "/custValueHelp",
									events: {
										dataReceived: function () {
											oDialog.update();
										}
									}
								});
								oColumnOppId = new Column({ label: new Label({ text: "Opportunity ID" }), template: new Text({ wrapping: false, text: "{OpportunityId}" }) });
								oColumnOppId.data({
									fieldName: "OpportunityId"
								});
								oColumnCustId = new Column({ label: new Label({ text: "Customer ID" }), template: new Text({ wrapping: false, text: "{CustId}" }) });
								oColumnCustId.data({
									fieldName: "CustId"
								});
								oColumnCustName = new Column({ label: new Label({ text: "Customer Name" }), template: new Text({ wrapping: false, text: "{CustName}" }) });
								oColumnCustName.data({
									fieldName: "CustName"
								});

								oColumnCreatedBy = new Column({ label: new Label({ text: "Created By" }), template: new Text({ wrapping: false, text: "{UserAlias}" }) });
								oColumnCreatedBy.data({
									fieldName: "UserAlias"
								});

								oColumnCreatedOn = new Column({
									label: new Label({ text: "Created On" }),
									template: new Text({ wrapping: false, text: { path: 'LastChangedOn', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MMM dd,yyyy' } } })
								});
								oColumnCreatedOn.data({
									fieldName: "LastChangedOn"
								});
								oTable.addColumn(oColumnOppId);
								oTable.addColumn(oColumnCustId);
								oTable.addColumn(oColumnCustName);
								oTable.addColumn(oColumnCreatedBy);
								oTable.addColumn(oColumnCreatedOn);
							}

							// For Mobile the default table is sap.m.Table
							if (oTable.bindItems) {
								// Bind items to the ODataModel and add columns
								oTable.bindAggregation("items", {
									path: "/custValueHelp",
									template: new ColumnListItem({
										cells: [new Label({ text: "{OpportunityId}" }), new Label({ text: "{CustId}" }), new Label({ text: "{CustName}" }), new Label({ text: "{UserAlias}" }), new Label({ text: { path: 'LastChangedOn', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MMM dd,yyyy' } } })]
									}),
									events: {
										dataReceived: function () {
											oDialog.update();
										}
									}
								});
								oTable.addColumn(new Column({ header: new Label({ text: "Opportunity ID" }) }));
								oTable.addColumn(new Column({ header: new Label({ text: "Customer ID" }) }));
								oTable.addColumn(new Column(
									{ header: new Label({ text: "Customer Name" }), demandPopin: true, minScreenWidth: "Desktop" }
								));
								oTable.addColumn(new Column(
									{ header: new Label({ text: "Created By" }), demandPopin: true, minScreenWidth: "Desktop" }
								));
								oTable.addColumn(new Column(
									{ header: new Label({ text: "Created On" }), demandPopin: true, minScreenWidth: "Desktop" }
								));
							}
							oDialog.update();
						}.bind(this));

						oDialog.open();
					}.bind(this));
				}).catch((error) => {
					BusyIndicator.hide();
					console.log(error);
				});
			},

			onFilterBarSearch: function (oEvent) {
				var sSearchQuery = this._oBasicSearchField.getValue(),
					aSelectionSet = oEvent.getParameter("selectionSet");

				var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
					if (oControl.getValue()) {
						aResult.push(new Filter({
							path: oControl.getName(),
							operator: FilterOperator.Contains,
							value1: oControl.getValue()
						}));
					}

					return aResult;
				}, []);

				aFilters.push(new Filter({
					filters: [
						new Filter({ path: "OpportunityId", operator: FilterOperator.Contains, value1: sSearchQuery }),
						new Filter({ path: "CustId", operator: FilterOperator.Contains, value1: sSearchQuery })
					],
					and: false
				}));

				this._filterTable(new Filter({
					filters: aFilters,
					and: true
				}));
			},

			_filterTable: function (oFilter) {
				var oVHD = this._oVHD;

				oVHD.getTableAsync().then(function (oTable) {
					if (oTable.bindRows) {
						oTable.getBinding("rows").filter(oFilter);
					}
					if (oTable.bindItems) {
						oTable.getBinding("items").filter(oFilter);
					}

					// This method must be called after binding update of the table.
					oVHD.update();
				});
			},

			onValueHelpOkPress: function (oEvent) {
				var aToken = oEvent.getParameter("tokens")[0].mProperties.text;
				this.getOwnerModel("oModelEstCal").setProperty("/searchParam", aToken);
				this._oVHD.close();
			},

			onValueHelpCancelPress: function () {
				this._oVHD.close();
			},

			onValueHelpAfterClose: function () {
				this._oVHD.destroy();
			},

			onNavBack: function () {
				this.getRouter().navTo("Home", {}, false);
			}

		});
	});