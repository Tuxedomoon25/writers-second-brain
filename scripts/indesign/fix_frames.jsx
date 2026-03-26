/*
 * fix_frames.jsx — Parameterized frame alignment
 *
 * Reads indesign_config.json for margin dimensions.
 * Forces units to points for accuracy.
 * Run with the .indd open.
 */

var doc = app.activeDocument;
var configFile = new File(doc.filePath + "/indesign_config.json");
if (!configFile.exists) {
    configFile = File.openDialog("Select indesign_config.json", "JSON:*.json");
}
if (!configFile || !configFile.exists) {
    throw new Error("indesign_config.json not found.");
}

configFile.open("r");
var CFG = eval("(" + configFile.read() + ")");
configFile.close();

// Force points
var origH = doc.viewPreferences.horizontalMeasurementUnits;
var origV = doc.viewPreferences.verticalMeasurementUnits;
doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

try {
    var mTop = CFG.margins.top_pt;
    var mBottom = CFG.margins.bottom_pt;
    var mInside = CFG.margins.inside_pt;
    var mOutside = CFG.margins.outside_pt;

    var fixed = 0;
    var skipped = 0;

    for (var p = 0; p < doc.pages.length; p++) {
        var page = doc.pages[p];
        var isRecto = (page.side === PageSideOptions.RIGHT_HAND);

        var pb = page.bounds;
        var pageTop = pb[0];
        var pageLeft = pb[1];
        var pageBottom = pb[2];
        var pageRight = pb[3];

        var expTop = pageTop + mTop;
        var expBottom = pageBottom - mBottom;
        var expLeft, expRight;

        if (isRecto) {
            expLeft = pageLeft + mInside;
            expRight = pageRight - mOutside;
        } else {
            expLeft = pageLeft + mOutside;
            expRight = pageRight - mInside;
        }

        for (var f = 0; f < page.textFrames.length; f++) {
            var frame = page.textFrames[f];
            var gb = frame.geometricBounds;
            var fW = gb[3] - gb[1];
            var fH = gb[2] - gb[0];

            if (fW > 200 && fH > 200) {
                frame.geometricBounds = [expTop, expLeft, expBottom, expRight];
                fixed++;
            } else {
                skipped++;
            }
        }
    }

    doc.save();

    alert("Frames fixed!\n\n" +
          "Resized: " + fixed + " frames\n" +
          "Skipped (small): " + skipped + "\n\n" +
          "Margins (points):\n" +
          "  Top: " + CFG.margins.top_pt + "pt (" + CFG.margins.top_in + "in)\n" +
          "  Bottom: " + CFG.margins.bottom_pt + "pt (" + CFG.margins.bottom_in + "in)\n" +
          "  Inside: " + CFG.margins.inside_pt + "pt (" + CFG.margins.inside_in + "in)\n" +
          "  Outside: " + CFG.margins.outside_pt + "pt (" + CFG.margins.outside_in + "in)\n\n" +
          "Run audit_frames.jsx to verify.");

} catch(e) {
    alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
} finally {
    doc.viewPreferences.horizontalMeasurementUnits = origH;
    doc.viewPreferences.verticalMeasurementUnits = origV;
}
