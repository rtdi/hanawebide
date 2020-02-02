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
			if (!self.getModel()) {
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
			}
		}
	});
	return TableIndexesControl;
}, true);