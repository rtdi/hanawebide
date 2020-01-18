sap.ui.define(['jquery.sap.global', 'sap/ui/core/library', 'io/rtdi/hana/webide/ui/controls/external/amcharts4/core', 'io/rtdi/hana/webide/ui/controls/external/amcharts4/charts', 'io/rtdi/hana/webide/ui/controls/external/amcharts4/plugins/forceDirected'],
    function(jQuery, library1, amcore, amcharts, amforcedirected) {
        "use strict";

        sap.ui.getCore().initLibrary({
            name : "io.rtdi",
            dependencies : ["sap.ui.core"],
            types: [],
            interfaces: [],
            controls: [
                "io.rtdi.amChartContainer"
            ],
            elements: [],
            noLibraryCSS: true,
            version: "0.8.3"
        });

        return io.rtdi;
    });