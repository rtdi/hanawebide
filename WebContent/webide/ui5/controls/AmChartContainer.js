/* global am4core:true */
sap.ui.define([ 'sap/ui/core/Control', "jquery.sap.global", "io/rtdi/hana/webide/ui/controls/AmChartLibrary" ], function(Control, jQuery, library) {
	return Control.extend("io.rtdi.amChartContainer", {
		metadata: {
            properties: {
                width: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100%"
                },
                height: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100%"
                },
                plugin: {
                    type: "string"
                }
            },
            aggregations : {},
		},
		renderer : function(oRm, oControl) {
			oRm.write("<div");
			oRm.write(" style=\"width: " + oControl.getWidth() + "; height: " + oControl.getHeight() + ";\" ");
            oRm.writeControlData(oControl);
            oRm.write(">");
			oRm.write("</div>");
		},
		onBeforeRendering : function() {
			/* jQuery.sap.includeScript("https://www.amcharts.com/lib/4/core.js", "amCharts.core", null, null);
			jQuery.sap.includeScript("https://www.amcharts.com/lib/4/charts.js", "amCharts.charts", null, null);
			if (!!this.getPlugin()) {
				jQuery.sap.includeScript("https://www.amcharts.com/lib/4/" + this.getPlugin(), "amCharts.plugin", null, null);
			} */
		},
		onAfterRendering : function() {
			// if I need to do any post render actions, it will happen here
			if (sap.ui.core.Control.prototype.onAfterRendering) {
				sap.ui.core.Control.prototype.onAfterRendering.apply(this, arguments); // run the super class's method first
			}
			this._chart = am4core.create(this.getDomRef(), am4plugins_forceDirected.ForceDirectedTree);
			this._f(this._chart);
		},
		setChart : function(f) {
			this._f = f;
			if (this._chart) {
				f(this._chart);
			}
		},
		dispose : function() {
			if (this._chart) {
				this._chart.dispose();
			}
		}
	});
});
