sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableTriggersControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableTriggers", {
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
			var otable = self.byId("idTriggers");
			var oColumnModel = otable.getModel();
			// if (!otable.getModel()) {
				oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "../../../../odata/SYS/TRIGGERS/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				otable.setModel(oColumnModel);
			// }

			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SUBJECT_TABLE_SCHEMA",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("SUBJECT_TABLE_NAME",
					sap.ui.model.FilterOperator.EQ, sTableName));
			
			var oBinding = otable.getBinding("rows");
			oBinding.filter(aFilters, "Application");
		},
		_TimestampFormatter: function(sTimestamp) {
			if (!!sTimestamp) {
				var oTs = new Date(sTimestamp);
				return oTs.toUTCString();
			} else {
				return "";
			}
		} 
	});
	return TableTriggersControl;
}, true);