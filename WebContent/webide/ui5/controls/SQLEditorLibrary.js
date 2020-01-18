sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
    function(jQuery, library1) {
        "use strict";

        sap.ui.getCore().initLibrary({
            name : "io.rtdi",
            dependencies : ["sap.ui.core"],
            types: [],
            interfaces: [],
            controls: [
                "io.rtdi.SQLEditor"
            ],
            elements: [],
            noLibraryCSS: true,
            version: "0.8.3"
        });

        return io.rtdi;
    });