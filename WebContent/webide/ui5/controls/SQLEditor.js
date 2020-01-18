sap.ui.define([ 'sap/ui/core/Control', "jquery.sap.global", "io/rtdi/hana/webide/ui/controls/SQLEditorLibrary" ], function(Control, jQuery, library) {
	return Control.extend("io.rtdi.SQLEditor", {
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
			oRm.write("<textarea");
			oRm.write(" style=\"width: " + oControl.getWidth() + "; height: " + oControl.getHeight() + ";\" ");
            oRm.writeControlData(oControl);
            oRm.write(">");
			oRm.write("</textarea>");
		},
		onBeforeRendering : function() {
		},
		onAfterRendering : function() {
			if (sap.ui.core.Control.prototype.onAfterRendering) {
				sap.ui.core.Control.prototype.onAfterRendering.apply(this, arguments);
			}
		}
	});
});
