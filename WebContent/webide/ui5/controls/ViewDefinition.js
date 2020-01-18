sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var ViewDefinitionControl = XMLComposite.extend("io.rtdi.hana.webide.ui.controls.ViewDefinition", {
		metadata: {
			properties: {
				schema: "string",
				view: "string"
			},
			events: {
				help: {}
			}
		},
		init : function() {
			self = this;
		},
		setView: function(sSchemaName, sViewName) {
			var cHeader = self.byId("idPageHeader");
			var cTable = self.byId("idColumnList");
			var cObjectDependencies = self.byId("id-object-dependencies");
			cObjectDependencies.setObject(sSchemaName, sViewName);
			
			if (!cTable.getModel()) {
				var oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "http://localhost:8080/hanatest/odata/SYS/VIEW_COLUMNS/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				cTable.setModel(oColumnModel);
			}

			var oTableHeaderModel = new sap.ui.model.json.JSONModel();
			oTableHeaderModel.loadData(
					"http://localhost:8080/hanatest/rest/lookup/SYS/VIEWS?" +
					"$select=SCHEMA_NAME, VIEW_NAME, VIEW_TYPE, CREATE_TIME, COMMENTS" +
					"&SCHEMA_NAME="
					+ encodeURI(sSchemaName)
					+ "&VIEW_NAME=" + encodeURI(sViewName));
			
			cHeader.setModel(oTableHeaderModel);
			
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("VIEW_NAME",
					sap.ui.model.FilterOperator.EQ, sViewName));
			
			var oBinding = cTable.getBinding("rows");
			oBinding.filter(aFilters, "Application");

		},
		_TimestampFormatter: function(sTimestamp) {
			if (!!sTimestamp) {
				var oTs = new Date(sTimestamp);
				return oTs.toUTCString();
			} else {
				return "";
			}
		},
		_TableNameFormatter: function(sSchemaName, sTableName) {
			return sSchemaName + "." + sTableName;
		},
		_ViewTypeFormatter: function(sType) {
			return "(Type: " + sType + ")";
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
	return ViewDefinitionControl;
}, true);