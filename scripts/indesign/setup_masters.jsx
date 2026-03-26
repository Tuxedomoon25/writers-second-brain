/*
 * setup_masters.jsx — Parameterized master pages
 *
 * Reads indesign_config.json for dimensions, fonts, title, and author.
 * Creates A-Master (headers + folios) and B-Master (blank for chapter openers).
 *
 * Run with the .indd open (after import.jsx).
 */

// ============================================================
// READ CONFIG
// ============================================================

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

// ============================================================
// FORCE POINTS
// ============================================================

var origH = doc.viewPreferences.horizontalMeasurementUnits;
var origV = doc.viewPreferences.verticalMeasurementUnits;
doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

try {
    main();
} finally {
    doc.viewPreferences.horizontalMeasurementUnits = origH;
    doc.viewPreferences.verticalMeasurementUnits = origV;
}

function main() {
    var pw = CFG.trim.width_pt;
    var ph = CFG.trim.height_pt;
    var mTop = CFG.margins.top_pt;
    var mBottom = CFG.margins.bottom_pt;
    var mOutside = CFG.margins.outside_pt;
    var mInside = CFG.margins.inside_pt;

    var headerFont = CFG.fonts.headers;
    var folioFont = CFG.fonts.folios;
    var bookTitle = CFG.title.toUpperCase();
    var authorName = CFG.author.toUpperCase();

    // Frame positions
    var headerY = mTop / 2 - 7.2;  // Centered in top margin area
    var headerH = 14.4;
    var folioY = ph - mBottom + (mBottom - 14.4) / 2;  // Centered in bottom margin
    var folioH = 14.4;
    var folioW = 72;

    // LEFT page edges (verso)
    var L_left = mOutside;
    var L_right = pw - mInside;

    // RIGHT page edges (recto, spread coordinates: add pw)
    var R_left = pw + mInside;
    var R_right = pw + pw - mOutside;

    // ============================================================
    // A-Master
    // ============================================================

    var aMaster = findOrCreateMaster(doc, "A");

    // Clear existing items
    for (var ap = 0; ap < aMaster.pages.length; ap++) {
        while (aMaster.pages[ap].pageItems.length > 0) {
            try { aMaster.pages[ap].pageItems[0].remove(); } catch(e) { break; }
        }
    }

    var leftPage = aMaster.pages[0];

    // Header: BOOK TITLE (left page)
    var lh = leftPage.textFrames.add({
        geometricBounds: [headerY, L_left, headerY + headerH, L_right]
    });
    lh.contents = bookTitle;
    var lht = lh.parentStory.texts[0];
    lht.justification = Justification.LEFT_ALIGN;
    lht.pointSize = 8;
    lht.tracking = 100;
    lht.capitalization = Capitalization.ALL_CAPS;
    applyFont(lht, headerFont + "\tRegular");

    // Folio: bottom-left
    var lf = leftPage.textFrames.add({
        geometricBounds: [folioY, L_left, folioY + folioH, L_left + folioW]
    });
    lf.contents = "";
    lf.parentStory.insertionPoints[0].contents = SpecialCharacters.AUTO_PAGE_NUMBER;
    var lft = lf.parentStory.texts[0];
    lft.justification = Justification.LEFT_ALIGN;
    lft.pointSize = 10;
    applyFont(lft, folioFont + "\tBold");

    // Right page (recto)
    var rightPage = aMaster.pages[1];

    // Header: AUTHOR NAME (right page)
    var rh = rightPage.textFrames.add({
        geometricBounds: [headerY, R_left, headerY + headerH, R_right]
    });
    rh.contents = authorName;
    var rht = rh.parentStory.texts[0];
    rht.justification = Justification.RIGHT_ALIGN;
    rht.pointSize = 8;
    rht.tracking = 100;
    rht.capitalization = Capitalization.ALL_CAPS;
    applyFont(rht, headerFont + "\tRegular");

    // Folio: bottom-right
    var rf = rightPage.textFrames.add({
        geometricBounds: [folioY, R_right - folioW, folioY + folioH, R_right]
    });
    rf.contents = "";
    rf.parentStory.insertionPoints[0].contents = SpecialCharacters.AUTO_PAGE_NUMBER;
    var rft = rf.parentStory.texts[0];
    rft.justification = Justification.RIGHT_ALIGN;
    rft.pointSize = 10;
    applyFont(rft, folioFont + "\tBold");

    // ============================================================
    // B-Master (blank)
    // ============================================================

    var bMaster = findOrCreateMaster(doc, "B");
    for (var bp = 0; bp < bMaster.pages.length; bp++) {
        while (bMaster.pages[bp].pageItems.length > 0) {
            try { bMaster.pages[bp].pageItems[0].remove(); } catch(e) { break; }
        }
    }

    // ============================================================
    // Apply masters to pages
    // ============================================================

    for (var p = 0; p < doc.pages.length; p++) {
        doc.pages[p].appliedMaster = aMaster;
    }

    // B-Master on chapter openers
    var bCount = 0;
    var chNumStyle = getStyle(doc, "Chapter Number");
    if (chNumStyle) {
        for (var p = 0; p < doc.pages.length; p++) {
            var page = doc.pages[p];
            var found = false;
            for (var f = 0; f < page.textFrames.length; f++) {
                for (var pi = 0; pi < page.textFrames[f].paragraphs.length; pi++) {
                    try {
                        if (page.textFrames[f].paragraphs[pi].appliedParagraphStyle.name === "Chapter Number") {
                            found = true; break;
                        }
                    } catch(e) {}
                }
                if (found) break;
            }
            if (found) {
                page.appliedMaster = bMaster;
                bCount++;
                if (p > 0) {
                    var prev = doc.pages[p - 1];
                    var empty = true;
                    for (var pf = 0; pf < prev.textFrames.length; pf++) {
                        if (prev.textFrames[pf].contents.replace(/[\s\r\n]/g, "").length > 0) {
                            empty = false; break;
                        }
                    }
                    if (empty) prev.appliedMaster = bMaster;
                }
            }
        }
    }

    // Page numbering
    try {
        doc.sections[0].pageNumberStyle = PageNumberStyle.ARABIC;
        doc.sections[0].pageNumberStart = 1;
    } catch(e) {}

    doc.save();

    alert("Masters set up!\n\n" +
          "Trim: " + CFG.trim.width_in + " x " + CFG.trim.height_in + " in\n" +
          "A-Master: headers + folios\n" +
          "B-Master: blank on " + bCount + " chapter pages\n\n" +
          "Left: " + bookTitle + " (" + headerFont + " 8pt)\n" +
          "Right: " + authorName + " (" + headerFont + " 8pt)\n" +
          "Folios: bottom outer corners (" + folioFont + " 10pt)\n\n" +
          "Total pages: " + doc.pages.length);
}

// ============================================================
// HELPERS
// ============================================================

function findOrCreateMaster(doc, prefix) {
    for (var m = 0; m < doc.masterSpreads.length; m++) {
        if (doc.masterSpreads[m].namePrefix === prefix) {
            return doc.masterSpreads[m];
        }
    }
    return doc.masterSpreads.add();
}

function getStyle(doc, name) {
    try { var s = doc.paragraphStyles.itemByName(name); s.name; return s; } catch (e) { return null; }
}

function applyFont(textObj, fontName) {
    try {
        textObj.appliedFont = app.fonts.itemByName(fontName);
    } catch(e) {
        try {
            var parts = fontName.split("\t");
            textObj.appliedFont = parts[0];
        } catch(e2) {}
    }
}
