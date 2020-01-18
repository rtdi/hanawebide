sap.ui.define([ "sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v4/ODataModel",
		"io/rtdi/hana/webide/ui/controls/TableDefinition",
		"io/rtdi/hana/webide/ui/controls/ViewDefinition"], function(Controller, ODataModel, TableDefinition, ViewDefinition) {
	"use strict";

	return Controller.extend("io.rtdi.hana.webide.ui.Controller", {

		onInit : function() {
			var cOwner = this.getView().byId("idOwnerFilter");
			var that = this;
			var oBinding = cOwner.getBinding("items");
			oBinding.attachEvent("dataReceived", function() {
				var oFirstItem = that.getView().byId("idOwnerFilter")
						.getFirstItem();
				that.getView().byId("idOwnerFilter")
						.setSelectedItem(oFirstItem);
			});
		},
		onSearch : function(oEvent) {
			this.buildFilter();
		},
		getGroupHeader : function(oGroup) {
			return new sap.m.GroupHeaderListItem({
				title : oGroup.key,
				upperCase : false
			});
		},
		onOwnerChange : function(oEvent) {
			this.buildFilter();
		},
		onTypeChange : function(oEvent) {
			this.buildFilter();
		},
		onObjectSelect : function(oEvent) {
			var oListItem = oEvent.getParameter("listItem");
			var sType = oListItem.data("type");
			var sSchemaName = oListItem.data("schema");
			var sTableName = oListItem.getTitle();
			
			var cPanel = this.getView().byId("idDefinitionPane");
			var cContent = cPanel.getContent();
			if (sType === "TABLE") {
				if (!!cContent && cContent.getId() === "idTableDef") {
					this._cTableDefinition.setTable(sSchemaName, sTableName);
				} else {
					this._cTableDefinition = new TableDefinition("idTableDef", {height: "100%"} );
					this._cTableDefinition.setTable(sSchemaName, sTableName);
					cPanel.setContent(this._cTableDefinition);
				}
			} else if (sType === "VIEW") {
				if (!!cContent && cContent.getId() === "idViewDef") {
					this._cViewDefinition.setView(sSchemaName, sTableName);
				} else {
					this._cViewDefinition = new ViewDefinition("idViewDef", {height: "100%"} );
					this._cViewDefinition.setView(sSchemaName, sTableName);
					cPanel.setContent(this._cViewDefinition);
				}
			}
			
			
		},
		buildFilter : function() {
			var cOwnerFilter = this.getView().byId("idOwnerFilter");
			var cTypeFilter = this.getView().byId("idTypeFilter");
			var cSearchFilter = this.getView().byId("idSearchFilter");

			var aFilters = [];
			var sSchemaName = cOwnerFilter.getSelectedKey();
			var sType = cTypeFilter.getSelectedKey();
			var sSearch = cSearchFilter.getValue();

			if (sSchemaName && sSchemaName.length > 0) {
				aFilters.push(new sap.ui.model.Filter("SCHEMA_NAME",
						sap.ui.model.FilterOperator.EQ, sSchemaName));
			}
			if (sType && sType.length > 0) {
				if (sType !== "*") {
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, sType));
				} else {
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "TABLE"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "VIEW"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "PROCEDURE"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "FUNCTION"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "SEQUENCE"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "SYNONYM"));
					aFilters.push(new sap.ui.model.Filter("OBJECT_TYPE",
							sap.ui.model.FilterOperator.EQ, "TASK"));
				}
			}
			if (sSearch && sSearch.length > 0) {
				aFilters.push(new sap.ui.model.Filter("OBJECT_NAME",
						sap.ui.model.FilterOperator.Contains, sSearch));
			}

			var oList = this.byId("idList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");

		}

	});

});
