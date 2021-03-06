sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableIndexesControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableIndexes", {
		metadata: {
			properties: {
				schema: "string",
				table: "string"
			},
			events: {
				help: {}
			}
		},
		init : function() {
			self = this;
		},
		setTable: function(sSchemaName, sTableName) {
			var otable = self.byId("idIndexes");
			// if (!self.getModel()) {
				var oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "../../../../odata/SYS/INDEXES/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				self.setModel(oColumnModel);
			//}
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("TABLE_NAME",
					sap.ui.model.FilterOperator.EQ, sTableName));
			
			var oBinding = otable.getBinding("rows");
			oBinding.filter(aFilters, "Application");
		}
	});
	return TableIndexesControl;
}, true);