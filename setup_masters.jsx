/*
 * setup_masters.jsx — v3
 *
 * Master pages for 5.5 x 8.5 trim size.
 * Margins: top 0.6in, bottom 0.7in, outside 0.5in, inside 0.75in
 *
 * Run with The_Silence_of_the_Bells_Interior.indd open.
 */

main();

function main() {
    var doc = app.activeDocument;

    try {
        // ============================================================
        // Page dimensions (5.5 x 8.5 in points)
        // ============================================================

        var pw = 396;    // 5.5in page width
        var ph = 612;    // 8.5in page height

        // Margins in points
        var mTop = 43.2;     // 0.6in
        var mBottom = 50.4;  // 0.7in
        var mOutside = 36;   // 0.5in
        var mInside = 54;    // 0.75in

        // Frame positions
        var headerY = 21.6;     // 0.3in from top
        var headerH = 14.4;     // 0.2in height
        var folioY = 583.2;     // 8.1in from top
        var folioH = 14.4;      // 0.2in height
        var folioW = 72;        // 1in wide

        // LEFT page edges
        var L_left = mOutside;                // 0.5in = 36pt
        var L_right = pw - mInside;           // 5.5in - 0.75in = 4.75in = 342pt

        // RIGHT page edges (spread coordinates: add pw)
        var R_left = pw + mInside;            // 5.5 + 0.75 = 6.25in = 450pt
        var R_right = pw + pw - mOutside;     // 11 - 0.5 = 10.5in = 756pt

        // ============================================================
        // STEP 1: Get or create A-Master
        // ============================================================

        var aMaster = null;
        for (var m = 0; m < doc.masterSpreads.length; m++) {
            if (doc.masterSpreads[m].namePrefix === "A") {
                aMaster = doc.masterSpreads[m];
                break;
            }
        }
        if (!aMaster) {
            aMaster = doc.masterSpreads.add();
        }

        // Clear existing items on A-Master
        for (var ap = 0; ap < aMaster.pages.length; ap++) {
            while (aMaster.pages[ap].pageItems.length > 0) {
                try { aMaster.pages[ap].pageItems[0].remove(); } catch(e) { break; }
            }
        }

        // ============================================================
        // STEP 2: Left page (verso) — header + page number
        // ============================================================

        var leftPage = aMaster.pages[0];

        // Header: THE SILENCE OF THE BELLS
        var lh = leftPage.textFrames.add({
            geometricBounds: [headerY, L_left, headerY + headerH, L_right]
        });
        lh.contents = "THE SILENCE OF THE BELLS";
        var lht = lh.parentStory.texts[0];
        lht.justification = Justification.LEFT_ALIGN;
        lht.pointSize = 8;
        lht.tracking = 100;
        lht.capitalization = Capitalization.ALL_CAPS;
        try { lht.appliedFont = app.fonts.itemByName("Cinzel\tRegular"); } catch(e) {
            try { lht.appliedFont = "Cinzel"; } catch(e2) {}
        }

        // Page number: bottom-left
        var lf = leftPage.textFrames.add({
            geometricBounds: [folioY, L_left, folioY + folioH, L_left + folioW]
        });
        lf.contents = "";
        lf.parentStory.insertionPoints[0].contents = SpecialCharacters.AUTO_PAGE_NUMBER;
        var lft = lf.parentStory.texts[0];
        lft.justification = Justification.LEFT_ALIGN;
        lft.pointSize = 10;
        try { lft.appliedFont = app.fonts.itemByName("Goldenbook\tBold"); } catch(e) {
            try { lft.appliedFont = app.fonts.itemByName("Goldenbook\tRegular"); } catch(e2) {
                try { lft.appliedFont = "Goldenbook"; } catch(e3) {}
            }
        }

        // ============================================================
        // STEP 3: Right page (recto) — header + page number
        // ============================================================

        var rightPage = aMaster.pages[1];

        // Header: TIMO DE GROOT
        var rh = rightPage.textFrames.add({
            geometricBounds: [headerY, R_left, headerY + headerH, R_right]
        });
        rh.contents = "TIMO DE GROOT";
        var rht = rh.parentStory.texts[0];
        rht.justification = Justification.RIGHT_ALIGN;
        rht.pointSize = 8;
        rht.tracking = 100;
        rht.capitalization = Capitalization.ALL_CAPS;
        try { rht.appliedFont = app.fonts.itemByName("Cinzel\tRegular"); } catch(e) {
            try { rht.appliedFont = "Cinzel"; } catch(e2) {}
        }

        // Page number: bottom-right
        var rf = rightPage.textFrames.add({
            geometricBounds: [folioY, R_right - folioW, folioY + folioH, R_right]
        });
        rf.contents = "";
        rf.parentStory.insertionPoints[0].contents = SpecialCharacters.AUTO_PAGE_NUMBER;
        var rft = rf.parentStory.texts[0];
        rft.justification = Justification.RIGHT_ALIGN;
        rft.pointSize = 10;
        try { rft.appliedFont = app.fonts.itemByName("Goldenbook\tBold"); } catch(e) {
            try { rft.appliedFont = app.fonts.itemByName("Goldenbook\tRegular"); } catch(e2) {
                try { rft.appliedFont = "Goldenbook"; } catch(e3) {}
            }
        }

        $.writeln("A-Master set up.");

        // ============================================================
        // STEP 4: Get or create B-Master (blank)
        // ============================================================

        var bMaster = null;
        for (var m = 0; m < doc.masterSpreads.length; m++) {
            if (doc.masterSpreads[m].namePrefix === "B") {
                bMaster = doc.masterSpreads[m];
                break;
            }
        }
        if (!bMaster) {
            bMaster = doc.masterSpreads.add();
        }
        for (var bp = 0; bp < bMaster.pages.length; bp++) {
            while (bMaster.pages[bp].pageItems.length > 0) {
                try { bMaster.pages[bp].pageItems[0].remove(); } catch(e) { break; }
            }
        }

        // ============================================================
        // STEP 5: Apply masters to pages
        // ============================================================

        // A-Master on all pages
        for (var p = 0; p < doc.pages.length; p++) {
            doc.pages[p].appliedMaster = aMaster;
        }

        // B-Master on chapter openers
        var chNumStyle = null;
        try {
            chNumStyle = doc.paragraphStyles.itemByName("Chapter Number");
            chNumStyle.name;
        } catch(e) {}

        var bCount = 0;
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
                    // Blank verso before chapter
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

        alert("Done!\n\n" +
              "Trim: 5.5 x 8.5 in\n" +
              "Margins: T 0.6 / B 0.7 / Out 0.5 / In 0.75\n\n" +
              "A-Master: headers + folios\n" +
              "B-Master: blank on " + bCount + " chapter pages\n\n" +
              "Left: THE SILENCE OF THE BELLS (Cinzel 8pt)\n" +
              "Right: TIMO DE GROOT (Cinzel 8pt)\n" +
              "Folios: bottom outer corners (Goldenbook 10pt)\n\n" +
              "Total pages: " + doc.pages.length);

    } catch(e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}
