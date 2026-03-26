/*
 * audit_frames.jsx — v2
 *
 * Audits every page's text frames against expected margins.
 * FIXES unit conversion by temporarily switching to points.
 *
 * Run with your .indd open.
 */

function repeatStr(s, n) { var r = ""; for (var i = 0; i < n; i++) r += s; return r; }
function r2(n) { return Math.round(n * 100) / 100; }
function ptsToIn(pts) { return r2(pts / 72); }

main();

function main() {
    var doc = app.activeDocument;

    // ============================================================
    // SAVE original units and FORCE points
    // ============================================================

    var origH = doc.viewPreferences.horizontalMeasurementUnits;
    var origV = doc.viewPreferences.verticalMeasurementUnits;

    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

    try {
        var report = [];
        var pw = doc.documentPreferences.pageWidth;
        var ph = doc.documentPreferences.pageHeight;

        report.push(repeatStr("=", 70));
        report.push("FRAME & MARGIN AUDIT v2: " + doc.name);
        report.push(repeatStr("=", 70));
        report.push("");
        report.push("Document: " + r2(pw) + "pt x " + r2(ph) + "pt (" + ptsToIn(pw) + "in x " + ptsToIn(ph) + "in)");
        report.push("Facing Pages: " + doc.documentPreferences.facingPages);
        report.push("Total Pages: " + doc.pages.length);

        var dm = doc.marginPreferences;
        report.push("");
        report.push("Default Margins (points / inches):");
        report.push("  Top:     " + r2(dm.top) + "pt  (" + ptsToIn(dm.top) + "in)");
        report.push("  Bottom:  " + r2(dm.bottom) + "pt  (" + ptsToIn(dm.bottom) + "in)");
        report.push("  Inside:  " + r2(dm.left) + "pt  (" + ptsToIn(dm.left) + "in)");
        report.push("  Outside: " + r2(dm.right) + "pt  (" + ptsToIn(dm.right) + "in)");

        var mTop = dm.top;
        var mBottom = dm.bottom;
        var mInside = dm.left;
        var mOutside = dm.right;

        var textW = pw - mInside - mOutside;
        var textH = ph - mTop - mBottom;
        report.push("");
        report.push("Expected text area: " + r2(textW) + "pt x " + r2(textH) + "pt (" + ptsToIn(textW) + "in x " + ptsToIn(textH) + "in)");

        report.push("");
        report.push(repeatStr("=", 70));
        report.push("PAGE-BY-PAGE AUDIT");
        report.push(repeatStr("=", 70));

        var issues = [];
        var goodPages = 0;

        for (var p = 0; p < doc.pages.length; p++) {
            var page = doc.pages[p];
            var pageNum = page.name;
            var isRecto = (page.side === PageSideOptions.RIGHT_HAND);
            var side = isRecto ? "recto" : "verso";

            var masterName = "none";
            try { masterName = page.appliedMaster.namePrefix; } catch(e) {}

            var frames = [];
            for (var f = 0; f < page.textFrames.length; f++) {
                frames.push(page.textFrames[f]);
            }

            var pb = page.bounds;
            var pageLeft = pb[1];
            var pageTop = pb[0];
            var pageRight = pb[3];
            var pageBottom = pb[2];

            var expLeft, expRight;
            if (isRecto) {
                expLeft = pageLeft + mInside;
                expRight = pageRight - mOutside;
            } else {
                expLeft = pageLeft + mOutside;
                expRight = pageRight - mInside;
            }
            var expTop = pageTop + mTop;
            var expBottom = pageBottom - mBottom;

            var pageIssues = [];

            if (frames.length === 0 && masterName !== "B") {
                pageIssues.push("NO TEXT FRAMES on non-blank page");
            }

            for (var fi = 0; fi < frames.length; fi++) {
                var frame = frames[fi];
                var gb = frame.geometricBounds;
                var fTop = gb[0];
                var fLeft = gb[1];
                var fBottom = gb[2];
                var fRight = gb[3];
                var fW = fRight - fLeft;
                var fH = fBottom - fTop;

                var tol = 2; // 2pt tolerance

                // Position checks
                if (Math.abs(fLeft - expLeft) > tol) {
                    pageIssues.push("Frame " + (fi+1) + " LEFT: " + r2(fLeft) + "pt (expected " + r2(expLeft) + "pt, off by " + r2(fLeft - expLeft) + "pt)");
                }
                if (Math.abs(fRight - expRight) > tol) {
                    pageIssues.push("Frame " + (fi+1) + " RIGHT: " + r2(fRight) + "pt (expected " + r2(expRight) + "pt, off by " + r2(fRight - expRight) + "pt)");
                }
                if (Math.abs(fTop - expTop) > tol) {
                    pageIssues.push("Frame " + (fi+1) + " TOP: " + r2(fTop) + "pt (expected " + r2(expTop) + "pt, off by " + r2(fTop - expTop) + "pt)");
                }
                if (Math.abs(fBottom - expBottom) > tol) {
                    pageIssues.push("Frame " + (fi+1) + " BOTTOM: " + r2(fBottom) + "pt (expected " + r2(expBottom) + "pt, off by " + r2(fBottom - expBottom) + "pt)");
                }

                // Size check
                if (fW < 72 || fH < 72) {
                    pageIssues.push("Frame " + (fi+1) + " TINY: " + r2(fW) + "pt x " + r2(fH) + "pt (" + ptsToIn(fW) + "in x " + ptsToIn(fH) + "in)");
                }

                // Overset
                if (frame.overflows) {
                    pageIssues.push("Frame " + (fi+1) + " OVERSET TEXT");
                }
            }

            // Extra frames
            if (frames.length > 1) {
                pageIssues.push("MULTIPLE FRAMES: " + frames.length + " text frames (expected 1)");
            }

            if (pageIssues.length > 0) {
                report.push("");
                report.push("Page " + pageNum + " (" + side + ", master=" + masterName + ", frames=" + frames.length + "):");
                for (var ii = 0; ii < pageIssues.length; ii++) {
                    report.push("  [!] " + pageIssues[ii]);
                }
                issues.push({ page: pageNum, count: pageIssues.length });
            } else {
                goodPages++;
            }
        }

        // Summary
        report.push("");
        report.push(repeatStr("=", 70));
        report.push("SUMMARY");
        report.push(repeatStr("=", 70));
        report.push("Total pages: " + doc.pages.length);
        report.push("Pages OK: " + goodPages);
        report.push("Pages with issues: " + issues.length);

        if (issues.length === 0) {
            report.push("ALL FRAMES ALIGNED CORRECTLY!");
        } else {
            report.push("");
            report.push("Pages needing attention:");
            for (var i = 0; i < issues.length; i++) {
                report.push("  Page " + issues[i].page + ": " + issues[i].count + " issue(s)");
            }
        }

        // Save
        var reportText = report.join("\n");
        var savePath = doc.filePath + "/frame_audit.txt";
        try {
            var file = new File(savePath);
            file.encoding = "UTF-8";
            file.open("w");
            file.write(reportText);
            file.close();
            alert("Frame audit saved!\n\n" +
                  "Pages OK: " + goodPages + "/" + doc.pages.length + "\n" +
                  "Pages with issues: " + issues.length + "\n\n" +
                  "Saved to: " + savePath);
        } catch(e) {
            alert(reportText.substring(0, 3000));
        }

    } finally {
        // ============================================================
        // RESTORE original units (always runs, even on error)
        // ============================================================
        doc.viewPreferences.horizontalMeasurementUnits = origH;
        doc.viewPreferences.verticalMeasurementUnits = origV;
    }
}
