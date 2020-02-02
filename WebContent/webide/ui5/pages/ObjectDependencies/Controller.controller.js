sap.ui.define([ "sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v4/ODataModel", "io/rtdi/hana/webide/ui/controls/helperfunctions" ], function(Controller, ODataModel, h) {
	"use strict";

	return Controller.extend("io.rtdi.hana.webide.ui.Controller", {

		onInit : function() {
		},
		onAfterRendering : function() {
			var cControl = this.getView().byId("idchart");
			var sSchemaName = jQuery.sap.getUriParameters().get("schema");
			var sObjectName = jQuery.sap.getUriParameters().get("object");
			// var oDom = cControl.getDomRef();
			// Create chart
			// var chart = am4core.create(oDom, am4plugins_forceDirected.ForceDirectedTree);
			var chart = cControl.getChart();
			// Create series
			var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("../../rest/objectdependencies/" + h.encodeURIfull(sSchemaName) +"/" + h.encodeURIfull(sObjectName), null, false );
			
			var oRawData = oModel.getProperty("/");
			oRawData.forEach(function(item) {
					switch (item.objecttype) {
						case "VIEW":
							item.color = "#8080A0";
							break;
						case "MONITORVIEW":
							item.color = "#8080B0";
							break;
						case "SYNONYM":
							item.color = "#8080E0";
							break;
						case "PROCEDURE":
							item.color = "#8080F0";
							break;
						case "FUNCTION":
							item.color = "#9090F0";
							break;
						case "TABLE":
							item.color = "#E08080";
							break;
						case "INDEX":
							item.color = "#E09090";
							break;
						case "SEQUENCE":
							item.color = "#90E090";
							break;
						case "SCHEMA":
							item.color = "#E0E0E0";
							break;
						case "TRIGGER":
							item.color = "#909090";
							break;
						case "AREA":
							item.color = "#E0E0E0";
							break;
						case "PACKAGE":
							item.color = "#E0E0E0";
							break;
						case "REMOTE SOURCE":
							item.color = "#E0E0E0";
							break;
						case "ADAPTER":
							item.color = "#E0E0E0";
							break;
						case "AGENT":
							item.color = "#E0E0E0";
							break;
						case "TASK":
							item.color = "#E0E0E0";
							break;
						case "LIBRARY":
							item.color = "#E0E0E0";
							break;
						default:
							item.color = "#E0E0E0";
						break;							
					}
				});
			// Set data
			series.data = oRawData;

			// Set up data fields
			series.dataFields.value = 1;
			series.dataFields.name = "nodeid";
			series.dataFields.id = "nodeid";
			series.dataFields.linkWith = "link";
			series.dataFields.color = "color";
			// Add labels
			series.nodes.template.label.text = "{nodeid}";
			series.nodes.template.label.fill = "#000000";
			series.nodes.template.label.wrap = true;
			series.fontSize = 10;
			series.minRadius = 50;
			series.maxRadius = 100;
		}
	});

});
