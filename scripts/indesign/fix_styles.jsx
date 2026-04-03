/*
 * fix_styles.jsx — Parameterized style fixes
 *
 * Reads indesign_config.json for font references.
 * Run with the .indd open (after import.jsx + setup_masters.jsx).
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

main();

function main() {
    var fixes = [];

    try {
        // FIX 1: Chapter Title — Cinzel Regular, tracking +50, All Caps
        try {
            var chTitle = doc.paragraphStyles.itemByName("Chapter Title");
            chTitle.name;
            applyFont(chTitle, CFG.fonts.chapter_title + "\tRegular");
            chTitle.tracking = 50;
            chTitle.capitalization = Capitalization.ALL_CAPS;
            fixes.push("Chapter Title: " + CFG.fonts.chapter_title + " Regular, tracking +50, All Caps");
        } catch(e) {
            fixes.push("SKIP: Chapter Title not found");
        }

        // FIX 2: Scene Break — Based on Body Text, Regular, centered
        try {
            var sceneBreak = doc.paragraphStyles.itemByName("Scene Break");
            sceneBreak.name;
            var bodyText = doc.paragraphStyles.itemByName("Body Text");
            sceneBreak.basedOn = bodyText;
            sceneBreak.fontStyle = "Regular";
            sceneBreak.justification = Justification.CENTER_ALIGN;
            sceneBreak.firstLineIndent = 0;
            sceneBreak.spaceBefore = "14pt";
            sceneBreak.spaceAfter = "14pt";
            fixes.push("Scene Break: Based on Body Text, Regular, centered, 14pt spacing");
        } catch(e) {
            fixes.push("SKIP: Scene Break — " + e.message);
        }

        // FIX 3: Quote / BlockQuote — Goldenbook Regular, 10.5pt
        try {
            var quote = doc.paragraphStyles.itemByName("Quote / BlockQuote");
            quote.name;
            applyFont(quote, CFG.fonts.quotes + "\tRegular");
            quote.pointSize = 10.5;
            quote.fontStyle = "Regular";
            quote.leftIndent = "0.5in";
            quote.rightIndent = "0.5in";
            quote.firstLineIndent = 0;
            fixes.push("Quote / BlockQuote: " + CFG.fonts.quotes + " Regular 10.5pt, indents 0.5in");
        } catch(e) {
            fixes.push("SKIP: Quote / BlockQuote — " + e.message);
        }

        // FIX 4: Quote Author — Cinzel Bold, 9pt, Small Caps
        try {
            var quoteAuthor = doc.paragraphStyles.itemByName("Quote Author");
            quoteAuthor.name;
            applyFont(quoteAuthor, CFG.fonts.chapter_title + "\tBold");
            quoteAuthor.pointSize = 9;
            quoteAuthor.capitalization = Capitalization.SMALL_CAPS;
            quoteAuthor.justification = Justification.RIGHT_ALIGN;
            quoteAuthor.leftIndent = "0.5in";
            quoteAuthor.rightIndent = "0.5in";
            quoteAuthor.firstLineIndent = 0;
            fixes.push("Quote Author: " + CFG.fonts.chapter_title + " Bold 9pt, Small Caps, right-aligned");
        } catch(e) {
            fixes.push("SKIP: Quote Author — " + e.message);
        }

        // FIX 5: Part Title — Cinzel Regular, 36pt, centered, tracking +50, starts on odd page
        try {
            var partTitle = doc.paragraphStyles.itemByName("Part Title");
            partTitle.name;
            applyFont(partTitle, CFG.fonts.chapter_title + "\tRegular");
            partTitle.pointSize = 36;
            partTitle.tracking = 50;
            partTitle.capitalization = Capitalization.ALL_CAPS;
            partTitle.justification = Justification.CENTER_ALIGN;
            partTitle.spaceBefore = "2.5in";
            partTitle.spaceAfter = "0.25in";
            partTitle.startParagraph = StartParagraph.NEXT_ODD_PAGE;
            fixes.push("Part Title: " + CFG.fonts.chapter_title + " Regular 36pt, All Caps, centered");
        } catch(e) {
            fixes.push("SKIP: Part Title — " + e.message);
        }

        // FIX 5b: Part Subtitle — Body font, 14pt, italic, centered
        try {
            var partSub = doc.paragraphStyles.itemByName("Part Subtitle");
            partSub.name;
            applyFont(partSub, CFG.fonts.body + "\tItalic");
            partSub.pointSize = 14;
            partSub.justification = Justification.CENTER_ALIGN;
            partSub.spaceBefore = "0.1in";
            partSub.spaceAfter = "0in";
            fixes.push("Part Subtitle: " + CFG.fonts.body + " Italic 14pt, centered");
        } catch(e) {
            fixes.push("SKIP: Part Subtitle — " + e.message);
        }

        // FIX 6: Chapter Title — Enable Split Document for EPUB
        try {
            var chTitle2 = doc.paragraphStyles.itemByName("Chapter Title");
            chTitle2.splitDocument = true;
            fixes.push("Chapter Title: Split Document (EPUB) enabled");
        } catch(e) {
            fixes.push("SKIP: Split Document — " + e.message);
        }

        // FIX 6: Drop Cap character style — set font (uses drop_cap key, falls back to chapter_number)
        try {
            var dropCap = doc.characterStyles.itemByName("Drop Cap");
            dropCap.name;
            var dropCapFont = (CFG.fonts.drop_cap || CFG.fonts.chapter_number);
            applyFont(dropCap, dropCapFont + "\tRegular");
            dropCap.fontStyle = "Regular";
            fixes.push("Drop Cap: font set to " + dropCapFont + " Regular (forced)");
        } catch(e) {
            fixes.push("SKIP: Drop Cap — " + e.message);
        }

        // FIX 8: Scene Break ornament — replace *** text with SVG
        var ornamentPath = CFG.scene_break_ornament || "";
        var ornamentWidth = CFG.scene_break_ornament_width || 1.0;
        if (ornamentPath !== "") {
            var ornamentFile = new File(ornamentPath);
            if (ornamentFile.exists) {
                var ornamentCount = 0;
                var sceneBreakStyle = null;
                try { sceneBreakStyle = doc.paragraphStyles.itemByName("Scene Break"); sceneBreakStyle.name; } catch(e) {}

                if (sceneBreakStyle) {
                    app.findTextPreferences = NothingEnum.NOTHING;
                    app.changeTextPreferences = NothingEnum.NOTHING;
                    app.findTextPreferences.findWhat = "***";
                    app.findTextPreferences.appliedParagraphStyle = sceneBreakStyle;
                    var found = doc.findText();

                    // Target width in points (1 inch = 72pt)
                    var targetPt = ornamentWidth * 72;

                    for (var sb = found.length - 1; sb >= 0; sb--) {
                        try {
                            var sbText = found[sb];

                            // Clear the *** text
                            sbText.contents = "";

                            // Remember doc measurement units, switch to points for reliable math
                            var oldUnits = doc.viewPreferences.horizontalMeasurementUnits;
                            var oldVUnits = doc.viewPreferences.verticalMeasurementUnits;
                            doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
                            doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

                            // Place the SVG — creates inline anchored frame
                            var placedItems = sbText.place(ornamentFile);
                            var graphic = placedItems[0];
                            var frame = graphic.parent;

                            // Read current frame size in points
                            var fb = frame.geometricBounds;
                            var currentW = fb[3] - fb[1];
                            var currentH = fb[2] - fb[0];

                            // Scale factor to reach target width
                            var scaleFactor = targetPt / currentW;

                            // Resize frame proportionally
                            frame.geometricBounds = [
                                fb[0],
                                fb[1],
                                fb[0] + (currentH * scaleFactor),
                                fb[1] + targetPt
                            ];
                            frame.fit(FitOptions.PROPORTIONALLY);
                            frame.fit(FitOptions.CENTER_CONTENT);

                            // Clean frame appearance
                            frame.strokeWeight = 0;
                            try { frame.strokeColor = doc.swatches.itemByName("None"); } catch(e3) {}
                            try { frame.fillColor = doc.swatches.itemByName("None"); } catch(e4) {}

                            // Restore measurement units
                            doc.viewPreferences.horizontalMeasurementUnits = oldUnits;
                            doc.viewPreferences.verticalMeasurementUnits = oldVUnits;

                            ornamentCount++;
                        } catch(e2) {
                            // Restore units on error too
                            try {
                                doc.viewPreferences.horizontalMeasurementUnits = oldUnits;
                                doc.viewPreferences.verticalMeasurementUnits = oldVUnits;
                            } catch(e5) {}
                            fixes.push("WARNING: Scene break ornament failed at index " + sb + ": " + e2.message);
                        }
                    }

                    app.findTextPreferences = NothingEnum.NOTHING;
                    app.changeTextPreferences = NothingEnum.NOTHING;
                    fixes.push("Scene Break ornaments: " + ornamentCount + " placed (" + ornamentWidth + "in wide)");
                }
            } else {
                fixes.push("SKIP: Scene break ornament — file not found: " + ornamentPath);
            }
        }

        // FIX 7: Delete unnamed character styles
        var deleted = 0;
        for (var i = doc.characterStyles.length - 1; i >= 0; i--) {
            var cs = doc.characterStyles[i];
            var csName = cs.name;
            if (csName === "[None]" || csName === "No Break" || csName === "Drop Cap" ||
                csName === "Italic" || csName === "Bold") continue;
            if (csName.replace(/\s/g, "").length === 0) {
                try { cs.remove(); deleted++; } catch(e) {}
            }
        }
        if (deleted > 0) fixes.push("Deleted " + deleted + " unnamed character styles");

        doc.save();

        var report = "Style fixes applied:\n\n";
        for (var f = 0; f < fixes.length; f++) {
            report += (f + 1) + ". " + fixes[f] + "\n";
        }
        report += "\nDocument saved.";
        alert(report);

    } catch(e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}

function applyFont(obj, fontName) {
    try {
        obj.appliedFont = app.fonts.itemByName(fontName);
    } catch(e) {
        try {
            var parts = fontName.split("\t");
            obj.appliedFont = parts[0];
            if (parts.length > 1) obj.fontStyle = parts[1];
        } catch(e2) {}
    }
}
