/*
 * fix_frames.jsx
 *
 * Resizes ALL text frames to match exact margin specifications.
 * Forces units to points for accuracy.
 *
 * Margins: Top 43.2pt, Bottom 50.4pt, Inside 54pt, Outside 36pt
 * Page: 396pt x 612pt (5.5 x 8.5in)
 */

main();

function main() {
    var doc = app.activeDocument;

    // Force points
    var origH = doc.viewPreferences.horizontalMeasurementUnits;
    var origV = doc.viewPreferences.verticalMeasurementUnits;
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

    try {
        var mTop = 43.2;
        var mBottom = 50.4;
        var mInside = 54;
        var mOutside = 36;

        var fixed = 0;
        var skipped = 0;

        for (var p = 0; p < doc.pages.length; p++) {
            var page = doc.pages[p];
            var isRecto = (page.side === PageSideOptions.RIGHT_HAND);

            var pb = page.bounds; // [y1, x1, y2, x2]
            var pageTop = pb[0];
            var pageLeft = pb[1];
            var pageBottom = pb[2];
            var pageRight = pb[3];

            // Calculate correct frame bounds
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

            // Fix each text frame on this page
            for (var f = 0; f < page.textFrames.length; f++) {
                var frame = page.textFrames[f];
                var gb = frame.geometricBounds; // [y1, x1, y2, x2]

                var fW = gb[3] - gb[1];
                var fH = gb[2] - gb[0];

                // Only fix frames that are body-text sized (wider than 200pt and taller than 200pt)
                // Skip tiny frames like scene break ornaments
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
              "New margins (points):\n" +
              "  Top: 43.2pt (0.6in)\n" +
              "  Bottom: 50.4pt (0.7in)\n" +
              "  Inside: 54pt (0.75in)\n" +
              "  Outside: 36pt (0.5in)\n\n" +
              "Run audit_frames.jsx to verify.");

    } catch(e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    } finally {
        doc.viewPreferences.horizontalMeasurementUnits = origH;
        doc.viewPreferences.verticalMeasurementUnits = origV;
    }
}
