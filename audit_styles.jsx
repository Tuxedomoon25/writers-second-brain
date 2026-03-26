/*
 * audit_styles.jsx
 *
 * Exports all paragraph style, character style, and document settings
 * to a readable text file for review and optimization.
 *
 * Run with your .indd open.
 */

// Polyfill for ExtendScript (no .repeat support)
function repeatStr(s, n) {
    var r = "";
    for (var i = 0; i < n; i++) r += s;
    return r;
}

main();

function main() {
    var doc = app.activeDocument;
    var report = [];

    report.push(repeatStr("=", 70));
    report.push("STYLE AUDIT: " + doc.name);
    report.push("Date: " + new Date().toLocaleDateString());
    report.push(repeatStr("=", 70));

    // ============================================================
    // DOCUMENT SETTINGS
    // ============================================================

    report.push("");
    report.push("## DOCUMENT SETTINGS");
    report.push(repeatStr("-", 40));

    var dp = doc.documentPreferences;
    report.push("Page Width: " + dp.pageWidth + " pt (" + round2(dp.pageWidth / 72) + " in)");
    report.push("Page Height: " + dp.pageHeight + " pt (" + round2(dp.pageHeight / 72) + " in)");
    report.push("Facing Pages: " + dp.facingPages);
    report.push("Pages: " + doc.pages.length);

    var mp = doc.marginPreferences;
    report.push("Margins — Top: " + round2(mp.top / 72) + "in, Bottom: " + round2(mp.bottom / 72) + "in, Left/Inside: " + round2(mp.left / 72) + "in, Right/Outside: " + round2(mp.right / 72) + "in");

    var tp = doc.textPreferences;
    report.push("Smart Text Reflow: " + tp.smartTextReflow);

    // ============================================================
    // PARAGRAPH STYLES
    // ============================================================

    report.push("");
    report.push("## PARAGRAPH STYLES (" + doc.paragraphStyles.length + ")");
    report.push(repeatStr("=", 70));

    for (var i = 0; i < doc.paragraphStyles.length; i++) {
        var ps = doc.paragraphStyles[i];
        var name = ps.name;

        // Skip default system styles
        if (name === "[No Paragraph Style]") continue;

        report.push("");
        report.push("### " + name);
        report.push(repeatStr("-", 40));

        // Based on
        try {
            if (ps.basedOn && ps.basedOn.name !== "[No Paragraph Style]") {
                report.push("Based On: " + ps.basedOn.name);
            }
        } catch(e) {}

        // Font
        try { report.push("Font: " + ps.appliedFont.name); } catch(e) { report.push("Font: (not set)"); }
        try { report.push("Font Style: " + ps.fontStyle); } catch(e) {}
        report.push("Size: " + ps.pointSize + " pt");
        report.push("Leading: " + ps.leading + (ps.leading === 1635019116 ? " (Auto)" : " pt"));

        // Alignment
        report.push("Alignment: " + ps.justification.toString());

        // Indents
        report.push("First Line Indent: " + round2(ps.firstLineIndent / 72) + " in (" + ps.firstLineIndent + " pt)");
        report.push("Left Indent: " + round2(ps.leftIndent / 72) + " in");
        report.push("Right Indent: " + round2(ps.rightIndent / 72) + " in");

        // Spacing
        report.push("Space Before: " + ps.spaceBefore + " pt (" + round2(ps.spaceBefore / 72) + " in)");
        report.push("Space After: " + ps.spaceAfter + " pt (" + round2(ps.spaceAfter / 72) + " in)");

        // Tracking
        report.push("Tracking: " + ps.tracking);

        // Capitalization
        try { report.push("Capitalization: " + ps.capitalization.toString()); } catch(e) {}

        // Keep Options
        report.push("Start Paragraph: " + ps.startParagraph.toString());
        report.push("Keep Lines Together: " + ps.keepLinesTogether);
        if (ps.keepLinesTogether) {
            report.push("  Keep All Lines: " + ps.keepAllLinesTogether);
            if (!ps.keepAllLinesTogether) {
                report.push("  Keep First N Lines: " + ps.keepFirstLines);
                report.push("  Keep Last N Lines: " + ps.keepLastLines);
            }
        }
        report.push("Keep With Next: " + ps.keepWithNext + " lines");

        // Hyphenation
        report.push("Hyphenation: " + ps.hyphenation);
        if (ps.hyphenation) {
            report.push("  Min Word Length: " + ps.hyphenateWordsLongerThan);
            report.push("  After First: " + ps.hyphenateAfterFirst);
            report.push("  Before Last: " + ps.hyphenateBeforeLast);
            report.push("  Hyphen Limit: " + ps.hyphenateLadderLimit);
        }

        // Justification
        report.push("Word Spacing: " + ps.desiredWordSpacing + "% (min " + ps.minimumWordSpacing + "%, max " + ps.maximumWordSpacing + "%)");
        report.push("Letter Spacing: " + ps.desiredLetterSpacing + "% (min " + ps.minimumLetterSpacing + "%, max " + ps.maximumLetterSpacing + "%)");
        report.push("Glyph Scaling: " + ps.desiredGlyphScaling + "% (min " + ps.minimumGlyphScaling + "%, max " + ps.maximumGlyphScaling + "%)");

        // Drop Caps
        report.push("Drop Cap Lines: " + ps.dropCapLines);
        report.push("Drop Cap Characters: " + ps.dropCapCharacters);
        if (ps.dropCapLines > 0) {
            try {
                report.push("Drop Cap Style: " + ps.dropCapStyle.name);
            } catch(e) {}
        }

        // GREP Styles
        if (ps.nestedGrepStyles.length > 0) {
            report.push("GREP Styles: " + ps.nestedGrepStyles.length);
            for (var g = 0; g < ps.nestedGrepStyles.length; g++) {
                var gs = ps.nestedGrepStyles[g];
                try {
                    report.push("  [" + (g+1) + "] Pattern: " + gs.grepExpression + " => Style: " + gs.appliedCharacterStyle.name);
                } catch(e) {}
            }
        }

        // OpenType Features
        try {
            report.push("Ligatures: " + ps.ligatures);
            report.push("OT Contextual Alternates: " + ps.otfContextualAlternate);
            report.push("OT Figure Style: " + ps.otfFigureStyle.toString());
        } catch(e) {}

        // Export Tagging
        try {
            report.push("Split Document (EPUB): " + ps.splitDocument);
        } catch(e) {}
    }

    // ============================================================
    // CHARACTER STYLES
    // ============================================================

    report.push("");
    report.push("## CHARACTER STYLES (" + doc.characterStyles.length + ")");
    report.push(repeatStr("=", 70));

    for (var i = 0; i < doc.characterStyles.length; i++) {
        var cs = doc.characterStyles[i];
        if (cs.name === "[None]") continue;

        report.push("");
        report.push("### " + cs.name);
        report.push(repeatStr("-", 40));

        try { report.push("Font: " + cs.appliedFont.name); } catch(e) {}
        try { report.push("Font Style: " + cs.fontStyle); } catch(e) {}
        try { report.push("Size: " + cs.pointSize); } catch(e) {}
        try { report.push("Tracking: " + cs.tracking); } catch(e) {}
        try {
            if (cs.noBreak === true) report.push("No Break: true");
        } catch(e) {}
    }

    // ============================================================
    // MASTER SPREADS
    // ============================================================

    report.push("");
    report.push("## MASTER SPREADS (" + doc.masterSpreads.length + ")");
    report.push(repeatStr("=", 70));

    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var ms = doc.masterSpreads[i];
        report.push("");
        report.push("### " + ms.name + " (prefix: " + ms.namePrefix + ")");
        report.push("Pages: " + ms.pages.length);
        var itemCount = 0;
        for (var p = 0; p < ms.pages.length; p++) {
            itemCount += ms.pages[p].pageItems.length;
        }
        report.push("Page Items: " + itemCount);
    }

    // ============================================================
    // OPTIMIZATION RECOMMENDATIONS
    // ============================================================

    report.push("");
    report.push("## OPTIMIZATION RECOMMENDATIONS");
    report.push(repeatStr("=", 70));

    // Check Body Text style
    var bodyText = null;
    try {
        bodyText = doc.paragraphStyles.itemByName("Body Text");
        bodyText.name;
    } catch(e) {}

    if (bodyText) {
        // Hyphenation
        if (!bodyText.hyphenation) {
            report.push("[!] Body Text: Hyphenation is OFF — turn on for justified text");
        }

        // Keep Options
        if (!bodyText.keepLinesTogether) {
            report.push("[!] Body Text: Keep Lines Together is OFF — set to 2 lines start/end for widow/orphan control");
        }

        // Justification
        if (bodyText.minimumWordSpacing === 100 && bodyText.maximumWordSpacing === 100) {
            report.push("[!] Body Text: Word Spacing is fixed at 100% — set to 80/100/133 for better justified text");
        }
        if (bodyText.minimumGlyphScaling === 100 && bodyText.maximumGlyphScaling === 100) {
            report.push("[!] Body Text: Glyph Scaling is fixed at 100% — set to 98/100/102 for smoother justification");
        }

        // GREP Styles
        if (bodyText.nestedGrepStyles.length === 0) {
            report.push("[!] Body Text: No GREP styles — add .{12}$ with No Break character style to prevent runts");
        }

        // OpenType
        try {
            if (!bodyText.ligatures) {
                report.push("[!] Body Text: Ligatures are OFF — turn on for professional typography");
            }
            if (!bodyText.otfContextualAlternate) {
                report.push("[!] Body Text: Contextual Alternates OFF — turn on for Garamond Premier");
            }
        } catch(e) {}

        // Leading check
        if (bodyText.pointSize > 0 && bodyText.leading !== 1635019116) {
            var ratio = bodyText.leading / bodyText.pointSize;
            if (ratio < 1.15) {
                report.push("[!] Body Text: Leading ratio " + round2(ratio * 100) + "% is tight — recommended 120-130%");
            } else if (ratio > 1.4) {
                report.push("[!] Body Text: Leading ratio " + round2(ratio * 100) + "% is loose — recommended 120-130%");
            }
        }
    }

    // Check for missing Export Tagging on Chapter Title
    try {
        var chTitle = doc.paragraphStyles.itemByName("Chapter Title");
        if (!chTitle.splitDocument) {
            report.push("[!] Chapter Title: Split Document (EPUB) is OFF — enable for e-book chapter breaks");
        }
    } catch(e) {}

    // ============================================================
    // SAVE REPORT
    // ============================================================

    var reportText = report.join("\n");

    // Save to file
    var savePath = doc.filePath + "/style_audit.txt";
    try {
        var file = new File(savePath);
        file.encoding = "UTF-8";
        file.open("w");
        file.write(reportText);
        file.close();
        alert("Style audit saved to:\n" + savePath + "\n\n" +
              "Paragraph Styles: " + doc.paragraphStyles.length + "\n" +
              "Character Styles: " + doc.characterStyles.length + "\n" +
              "Master Spreads: " + doc.masterSpreads.length);
    } catch(e) {
        // If can't save to file, show in alert
        alert(reportText.substring(0, 2000) + "\n\n[Truncated — could not save file]");
    }
}

function round2(n) {
    return Math.round(n * 100) / 100;
}

