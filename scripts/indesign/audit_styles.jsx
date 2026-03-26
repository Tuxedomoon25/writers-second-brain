/*
 * audit_styles.jsx — Style audit (unchanged logic, config-aware)
 *
 * Exports all paragraph style, character style, and document settings
 * to a readable text file for review and optimization.
 *
 * Run with your .indd open.
 */

function repeatStr(s, n) { var r = ""; for (var i = 0; i < n; i++) r += s; return r; }
function round2(n) { return Math.round(n * 100) / 100; }

main();

function main() {
    var doc = app.activeDocument;
    var report = [];

    report.push(repeatStr("=", 70));
    report.push("STYLE AUDIT: " + doc.name);
    report.push("Date: " + new Date().toLocaleDateString());
    report.push(repeatStr("=", 70));

    // Document Settings
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
    report.push("Smart Text Reflow: " + doc.textPreferences.smartTextReflow);

    // Paragraph Styles
    report.push("");
    report.push("## PARAGRAPH STYLES (" + doc.paragraphStyles.length + ")");
    report.push(repeatStr("=", 70));

    for (var i = 0; i < doc.paragraphStyles.length; i++) {
        var ps = doc.paragraphStyles[i];
        if (ps.name === "[No Paragraph Style]") continue;

        report.push("");
        report.push("### " + ps.name);
        report.push(repeatStr("-", 40));

        try { if (ps.basedOn && ps.basedOn.name !== "[No Paragraph Style]") report.push("Based On: " + ps.basedOn.name); } catch(e) {}
        try { report.push("Font: " + ps.appliedFont.name); } catch(e) { report.push("Font: (not set)"); }
        try { report.push("Font Style: " + ps.fontStyle); } catch(e) {}
        report.push("Size: " + ps.pointSize + " pt");
        report.push("Leading: " + ps.leading + (ps.leading === 1635019116 ? " (Auto)" : " pt"));
        report.push("Alignment: " + ps.justification.toString());
        report.push("First Line Indent: " + round2(ps.firstLineIndent / 72) + " in (" + ps.firstLineIndent + " pt)");
        report.push("Left Indent: " + round2(ps.leftIndent / 72) + " in");
        report.push("Right Indent: " + round2(ps.rightIndent / 72) + " in");
        report.push("Space Before: " + ps.spaceBefore + " pt");
        report.push("Space After: " + ps.spaceAfter + " pt");
        report.push("Tracking: " + ps.tracking);
        try { report.push("Capitalization: " + ps.capitalization.toString()); } catch(e) {}
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
        report.push("Hyphenation: " + ps.hyphenation);
        if (ps.hyphenation) {
            report.push("  Min Word Length: " + ps.hyphenateWordsLongerThan);
            report.push("  After First: " + ps.hyphenateAfterFirst);
            report.push("  Before Last: " + ps.hyphenateBeforeLast);
            report.push("  Hyphen Limit: " + ps.hyphenateLadderLimit);
        }
        report.push("Word Spacing: " + ps.desiredWordSpacing + "% (min " + ps.minimumWordSpacing + "%, max " + ps.maximumWordSpacing + "%)");
        report.push("Letter Spacing: " + ps.desiredLetterSpacing + "% (min " + ps.minimumLetterSpacing + "%, max " + ps.maximumLetterSpacing + "%)");
        report.push("Glyph Scaling: " + ps.desiredGlyphScaling + "% (min " + ps.minimumGlyphScaling + "%, max " + ps.maximumGlyphScaling + "%)");
        report.push("Drop Cap Lines: " + ps.dropCapLines);
        report.push("Drop Cap Characters: " + ps.dropCapCharacters);
        if (ps.dropCapLines > 0) {
            try { report.push("Drop Cap Style: " + ps.dropCapStyle.name); } catch(e) {}
        }
        if (ps.nestedGrepStyles.length > 0) {
            report.push("GREP Styles: " + ps.nestedGrepStyles.length);
            for (var g = 0; g < ps.nestedGrepStyles.length; g++) {
                try { report.push("  [" + (g+1) + "] Pattern: " + ps.nestedGrepStyles[g].grepExpression + " => Style: " + ps.nestedGrepStyles[g].appliedCharacterStyle.name); } catch(e) {}
            }
        }
        try {
            report.push("Ligatures: " + ps.ligatures);
            report.push("OT Contextual Alternates: " + ps.otfContextualAlternate);
            report.push("OT Figure Style: " + ps.otfFigureStyle.toString());
        } catch(e) {}
        try { report.push("Split Document (EPUB): " + ps.splitDocument); } catch(e) {}
    }

    // Character Styles
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
        try { if (cs.noBreak === true) report.push("No Break: true"); } catch(e) {}
    }

    // Master Spreads
    report.push("");
    report.push("## MASTER SPREADS (" + doc.masterSpreads.length + ")");
    report.push(repeatStr("=", 70));

    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var ms = doc.masterSpreads[i];
        report.push("");
        report.push("### " + ms.name + " (prefix: " + ms.namePrefix + ")");
        report.push("Pages: " + ms.pages.length);
        var itemCount = 0;
        for (var p = 0; p < ms.pages.length; p++) itemCount += ms.pages[p].pageItems.length;
        report.push("Page Items: " + itemCount);
    }

    // Recommendations
    report.push("");
    report.push("## OPTIMIZATION RECOMMENDATIONS");
    report.push(repeatStr("=", 70));

    var bodyText = null;
    try { bodyText = doc.paragraphStyles.itemByName("Body Text"); bodyText.name; } catch(e) {}

    if (bodyText) {
        if (!bodyText.hyphenation) report.push("[!] Body Text: Hyphenation is OFF");
        if (!bodyText.keepLinesTogether) report.push("[!] Body Text: Keep Lines Together is OFF");
        if (bodyText.minimumWordSpacing === 100 && bodyText.maximumWordSpacing === 100) report.push("[!] Body Text: Word Spacing fixed at 100%");
        if (bodyText.minimumGlyphScaling === 100 && bodyText.maximumGlyphScaling === 100) report.push("[!] Body Text: Glyph Scaling fixed at 100%");
        if (bodyText.nestedGrepStyles.length === 0) report.push("[!] Body Text: No GREP styles for runt prevention");
        try { if (!bodyText.ligatures) report.push("[!] Body Text: Ligatures OFF"); } catch(e) {}
    }

    try {
        var chTitle = doc.paragraphStyles.itemByName("Chapter Title");
        if (!chTitle.splitDocument) report.push("[!] Chapter Title: Split Document (EPUB) OFF");
    } catch(e) {}

    // Save
    var reportText = report.join("\n");
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
        alert(reportText.substring(0, 2000) + "\n\n[Truncated]");
    }
}
