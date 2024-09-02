sap.ui.define([
    "./BaseController",
    "com/zeffortcalculatorhcl/model/models",
    "../utils/formatter"
],
    function (BaseController, models, formatter) {
        "use strict";

        return BaseController.extend("com.zeffortcalculatorhcl.controller.Home", {
            formatter: formatter,
            onInit: function () {
            },

            onChoice: function () {
                this.getOwnerModel("oModelEstCal")?.destroy();
                this.setOwnerModel(models.getEcInputModel(this.getOwnerModel()), "oModelEstCal");

                if (this.getView().byId("Choice1").getSelected()) {                    
                    this.getRouter().navTo("Opportunity", {}, true);

                }
                if (this.getView().byId("Choice2").getSelected()) {
                    this.getRouter().navTo("Search", {}, false);
                }
            }
        });
    });
