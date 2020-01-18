sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableDefinitionControl = XMLComposite.extend("io.rtdi.hana.webide.ui.controls.TableDefinition", {
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
			var cHeader = self.byId("idPageHeader");
			var cTable = self.byId("idColumnList");
			var cIndexes = self.byId("idIndexes");
			var cObjectDependencies = self.byId("id-object-dependencies");
			cObjectDependencies.setObject(sSchemaName, sTableName);
			
			if (!cTable.getModel()) {
				var oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "http://localhost:8080/hanatest/odata/SYS/TABLE_COLUMNS/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				cTable.setModel(oColumnModel);
			}

			if (!cIndexes.getModel()) {
				var oColumnModel = new sap.ui.model.odata.v4.ODataModel(
						{
							"serviceUrl": "http://localhost:8080/hanatest/odata/SYS/INDEXES/",
							"autoExpandSelect": true,
							"operationMode": "Server",
							"groupId": "$direct",
							"synchronizationMode": "None"
						}
				);
				cIndexes.setModel(oColumnModel);
			}

			var oTableHeaderModel = new sap.ui.model.json.JSONModel();
			oTableHeaderModel.loadData(
					"http://localhost:8080/hanatest/rest/lookup/SYS/TABLES?" +
					"$select=SCHEMA_NAME, TABLE_NAME, TABLE_TYPE, TEMPORARY_TABLE_TYPE, IS_USER_DEFINED_TYPE, CREATE_TIME, IS_LOGGED, COMMENTS" +
					"&SCHEMA_NAME="
					+ encodeURI(sSchemaName)
					+ "&TABLE_NAME=" + encodeURI(sTableName));
			
			cHeader.setModel(oTableHeaderModel);
			
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
					sap.ui.model.FilterOperator.EQ, sSchemaName));
			aFilters.push(new sap.ui.model.Filter("TABLE_NAME",
					sap.ui.model.FilterOperator.EQ, sTableName));
			
			var oBinding = cTable.getBinding("rows");
			oBinding.filter(aFilters, "Application");

			cIndexes.getBinding("rows").filter(aFilters, "Application");
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
		_TableTypeFormatter: function(sType, sTemp, sUserDefined) {
			// '/TABLE_TYPE', '/TEMPORARY_TABLE_TYPE', '/IS_USER_DEFINED_TYPE'
			var s;
			if (sUserDefined === "TRUE") {
				s = "TableType";
			} else if (sTemp === "GLOBAL") {
				s = "Global Temporary Table";
			} else if (sType === "VIRTUAL") {
				s = "Virtual Table";
			} else if (sType === "COLUMN") {
				s = "Columnar Table";
			} else if (sType === "ROW") {
				s = "Row Table";
			} else {
				s = "???";
			}
			return "(Type: " + s + ")";
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