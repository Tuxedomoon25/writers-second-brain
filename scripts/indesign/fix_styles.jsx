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

        // FIX 5: Chapter Title — Enable Split Document for EPUB
        try {
            var chTitle2 = doc.paragraphStyles.itemByName("Chapter Title");
            chTitle2.splitDocument = true;
            fixes.push("Chapter Title: Split Document (EPUB) enabled");
        } catch(e) {
            fixes.push("SKIP: Split Document — " + e.message);
        }

        // FIX 6: Drop Cap character style — set font to Cinzel Decorative
        try {
            var dropCap = doc.characterStyles.itemByName("Drop Cap");
            dropCap.name;
            applyFont(dropCap, CFG.fonts.chapter_number + "\tRegular");
            fixes.push("Drop Cap: font set to " + CFG.fonts.chapter_number);
        } catch(e) {
            fixes.push("SKIP: Drop Cap — " + e.message);
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
