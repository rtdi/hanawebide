sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableStatisticsControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableStatistics", {
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
			var otable = self.byId("idStatistics");
			var oColumnModel = otable.getModel();
			// if (!otable.getModel()) {
				oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "../../../../odata/SYS/M_CS_TABLES/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				otable.setModel(oColumnModel);
			// }

			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("TABLE_NAME",
					sap.ui.model.FilterOperator.EQ, sTableName));
			
			var oBinding = otable.getBinding("rows");
			oBinding.filter(aFilters, "Application");
		}
	});
	return TableStatisticsControl;
}, true);