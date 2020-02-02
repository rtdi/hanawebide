sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableDefinitionControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableDefinition", {
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
							"serviceUrl": "../../../../odata/SYS/TABLE_COLUMNS/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				self.setModel(oColumnModel);
			}

			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("TABLE_NAME",
					sap.ui.model.FilterOperator.EQ, sTableName));
			
			var oBinding = self.getBinding("rows");
			oBinding.filter(aFilters, "Application");

			cIndexes.getBinding("rows").filter(aFilters, "Application");
		},
		_DataTypeFormatter: function(sDataTypeName, iSize, iScale) {
			switch (sDataTypeName) {
			case "BIGINT":
			case "BINTEXT":
			case "BLOB":
			case "BOOLEAN":
			case "CLOB":
			case "DATE":
			case "DOUBLE":
			case "INTEGER":
			case "NCLOB":
			case "REAL":
			case "SECONDDATE":
			case "SMALLDECIMAL":
			case "SMALLINT":
			case "ST_GEOMETRY":
			case "ST_POINT":
			case "TEXT":
			case "TIME":
			case "TIMESTAMP":
			case "TINYINT":
				return sDataTypeName;
			case "ALPHANUM":
			case "BINARY":
			case "CHAR":
			case "NCHAR":
			case "NVARCHAR":
			case "SHORTTEXT":
			case "VARBINARY":
			case "VARCHAR":
				return sDataTypeName + " (" + iSize + ")";
			case "DECIMAL":
			default:
				return sDataTypeName + " (" + iSize + "," + iScale + ")";
			}
		} 
	});
	return TableDefinitionControl;
}, true);