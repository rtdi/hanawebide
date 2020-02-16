sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableContentControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableContent", {
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
			var otable = self.byId("idTableContent");
			var oColumnModel = otable.getModel();
			// if (!otable.getModel()) {
				oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "../../../../odata/" + sSchemaName + "/" + sTableName + "/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				// otable.setModel(oColumnModel);
			// }
			
			
		}
	});
	return TableContentControl;
}, true);