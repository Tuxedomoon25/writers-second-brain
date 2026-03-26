/*
 * fix_styles.jsx
 *
 * Applies style fixes based on audit review.
 * Run with The_Silence_of_the_Bells_Interior.indd open.
 */

main();

function main() {
    var doc = app.activeDocument;
    var fixes = [];

    try {
        // ============================================================
        // FIX 1: Chapter Title — Cinzel Regular, tracking +50, All Caps
        // ============================================================

        try {
            var chTitle = doc.paragraphStyles.itemByName("Chapter Title");
            chTitle.name;

            // Change font from Cinzel Decorative to Cinzel Regular
            try {
                chTitle.appliedFont = app.fonts.itemByName("Cinzel\tRegular");
            } catch(e) {
                try { chTitle.appliedFont = "Cinzel"; chTitle.fontStyle = "Regular"; } catch(e2) {}
            }
            chTitle.tracking = 50;
            chTitle.capitalization = Capitalization.ALL_CAPS;

            fixes.push("Chapter Title: Cinzel Regular, tracking +50, All Caps");
        } catch(e) {
            fixes.push("SKIP: Chapter Title not found");
        }

        // ============================================================
        // FIX 2: Scene Break — Based on Body Text, Regular, centered
        // ============================================================

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

        // ============================================================
        // FIX 3: Quote / BlockQuote — Goldenbook Regular, 10.5pt
        // ============================================================

        try {
            var quote = doc.paragraphStyles.itemByName("Quote / BlockQuote");
            quote.name;

            try {
                quote.appliedFont = app.fonts.itemByName("Goldenbook\tRegular");
            } catch(e) {
                try { quote.appliedFont = "Goldenbook"; quote.fontStyle = "Regular"; } catch(e2) {}
            }
            quote.pointSize = 10.5;
            quote.fontStyle = "Regular";
            quote.leftIndent = "0.5in";
            quote.rightIndent = "0.5in";
            quote.firstLineIndent = 0;

            fixes.push("Quote / BlockQuote: Goldenbook Regular 10.5pt, indents 0.5in");
        } catch(e) {
            fixes.push("SKIP: Quote / BlockQuote — " + e.message);
        }

        // ============================================================
        // FIX 4: Quote Author — Cinzel Bold, 9pt, Small Caps
        // ============================================================

        try {
            var quoteAuthor = doc.paragraphStyles.itemByName("Quote Author");
            quoteAuthor.name;

            try {
                quoteAuthor.appliedFont = app.fonts.itemByName("Cinzel\tBold");
            } catch(e) {
                try { quoteAuthor.appliedFont = "Cinzel"; quoteAuthor.fontStyle = "Bold"; } catch(e2) {}
            }
            quoteAuthor.pointSize = 9;
            quoteAuthor.capitalization = Capitalization.SMALL_CAPS;
            quoteAuthor.justification = Justification.RIGHT_ALIGN;
            quoteAuthor.leftIndent = "0.5in";
            quoteAuthor.rightIndent = "0.5in";
            quoteAuthor.firstLineIndent = 0;

            fixes.push("Quote Author: Cinzel Bold 9pt, Small Caps, right-aligned");
        } catch(e) {
            fixes.push("SKIP: Quote Author — " + e.message);
        }

        // ============================================================
        // FIX 5: Chapter Title — Enable Split Document for EPUB
        // ============================================================

        try {
            var chTitle2 = doc.paragraphStyles.itemByName("Chapter Title");
            chTitle2.splitDocument = true;

            fixes.push("Chapter Title: Split Document (EPUB) enabled");
        } catch(e) {
            fixes.push("SKIP: Split Document — " + e.message);
        }

        // ============================================================
        // FIX 6: Drop Cap character style — set font to Cinzel Decorative
        // ============================================================

        try {
            var dropCap = doc.characterStyles.itemByName("Drop Cap");
            dropCap.name;

            try {
                dropCap.appliedFont = app.fonts.itemByName("Cinzel Decorative\tRegular");
            } catch(e) {
                try {
                    dropCap.appliedFont = app.fonts.itemByName("Cinzel Decorative\tBold");
                } catch(e2) {
                    try { dropCap.appliedFont = "Cinzel Decorative"; } catch(e3) {}
                }
            }

            fixes.push("Drop Cap: font set to Cinzel Decorative");
        } catch(e) {
            fixes.push("SKIP: Drop Cap — " + e.message);
        }

        // ============================================================
        // FIX 7: Delete unnamed character styles
        // ============================================================

        var deleted = 0;
        var bodyTextStyle = null;
        try { bodyTextStyle = doc.paragraphStyles.itemByName("Body Text"); } catch(e) {}

        // Loop backwards to safely delete
        for (var i = doc.characterStyles.length - 1; i >= 0; i--) {
            var cs = doc.characterStyles[i];
            var csName = cs.name;

            // Skip system styles and named styles
            if (csName === "[None]" || csName === "No Break" || csName === "Drop Cap" ||
                csName === "Italic" || csName === "Bold") {
                continue;
            }

            // Delete unnamed/empty styles (name is empty or whitespace)
            if (csName.replace(/\s/g, "").length === 0) {
                try {
                    cs.remove();
                    deleted++;
                } catch(e) {}
            }
        }
        if (deleted > 0) {
            fixes.push("Deleted " + deleted + " unnamed character styles");
        }

        // ============================================================
        // SAVE
        // ============================================================

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
