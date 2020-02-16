sap.ui.define(["sap/ui/core/XMLComposite"], function(XMLComposite) {
	var self;
	var TableViewerControl = XMLComposite.extend("io.rtdi.hana.webide.ui.pages.CatalogBrowser.controls.TableViewer", {
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
			
			var oTableHeaderModel = new sap.ui.model.json.JSONModel();
			oTableHeaderModel.loadData(
					"../../rest/lookup/SYS/TABLES?" +
					"$select=SCHEMA_NAME, TABLE_NAME, TABLE_TYPE, TEMPORARY_TABLE_TYPE, IS_USER_DEFINED_TYPE, CREATE_TIME, IS_LOGGED, COMMENTS" +
					"&SCHEMA_NAME="
					+ encodeURI(sSchemaName)
					+ "&TABLE_NAME=" + encodeURI(sTableName));
			
			cHeader.setModel(oTableHeaderModel);

			var cTableDef = self.byId("idTableDef");
			cTableDef.setTable(sSchemaName, sTableName);
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
		}
	});
	return TableViewerControl;
}, true);