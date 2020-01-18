sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/table/sample/TreeTable/BasicODataTreeBinding/localService/mockserver"
], function(UIComponent, ODataModel) {
    "use strict";

    return UIComponent.extend("sap.ui.table.sample.TreeTable.BasicODataTreeBinding.Component", {
        metadata: {
			manifest: "json"
		},
        init : function(){
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            var sODataServiceUrl = "http://localhost:8080/hanatest/odata/RTDI/OBJECT_HIERARCHY/TABLE";

            // set model on component
            this.setModel(
                new ODataModel(sODataServiceUrl, {
                    json : true,
                    useBatch : true
                })
            );
        }
    });
});
