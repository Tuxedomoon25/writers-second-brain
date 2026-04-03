/*
 * add_matter.jsx — Parameterized front/back matter
 *
 * Reads indesign_config.json for title, author, dedication, copyright, etc.
 * Run with the .indd open (after import + masters + styles + frames).
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
    try {
        var TITLE = CFG.title;
        var SUBTITLE = CFG.subtitle || "";
        var AUTHOR = CFG.author;
        var WEBSITE = CFG.website || "";
        var ISBN = CFG.isbn || "[ISBN-13 NUMBER]";
        var DEDICATION = (CFG.dedication || "").replace(/\\n/g, "\r");

        var COPYRIGHT =
            "Text copyright \u00A9 2026 " + AUTHOR + "\r\r" +
            "All rights reserved. This book or parts thereof may not be reproduced " +
            "in any form, stored in any retrieval system, or transmitted in any form " +
            "by any means \u2013 electronic, mechanical, photocopy, recording, or otherwise " +
            "\u2013 without prior written permission of the publisher.\r\r" +
            (CFG.structure === "act-chapter-scene" ?
                "This is a work of fiction. Names, characters, places, and incidents either " +
                "are the product of the author\u2019s imagination or are used fictitiously, and " +
                "any resemblance to actual persons, living or dead, business establishments, " +
                "events, or locales is entirely coincidental.\r\r" : "") +
            (WEBSITE ? WEBSITE + "\r\r" : "") +
            "ISBN: " + ISBN;

        // Build frame bounds dynamically from each page's own margins
        function pageBounds(page) {
            var pb = page.bounds;
            var pm = page.marginPreferences;
            return [
                pb[0] + pm.top,
                pb[1] + pm.left,
                pb[2] - pm.bottom,
                pb[3] - pm.right
            ];
        }

        // Legacy fallback bounds for pages not yet created
        var frameBounds = [
            CFG.margins.top_in + "in",
            CFG.margins.inside_in + "in",
            (CFG.trim.height_in - CFG.margins.bottom_in) + "in",
            (CFG.trim.width_in - CFG.margins.outside_in) + "in"
        ];

        // Get B-Master
        var bMaster = null;
        for (var m = 0; m < doc.masterSpreads.length; m++) {
            if (doc.masterSpreads[m].namePrefix === "B") {
                bMaster = doc.masterSpreads[m];
                break;
            }
        }
        if (!bMaster) {
            throw new Error("B-Master not found. Run setup_masters.jsx first.");
        }

        // ============================================================
        // FRONT MATTER: 6 pages at beginning
        // ============================================================

        for (var i = 0; i < 6; i++) {
            doc.pages.add(LocationOptions.AT_BEGINNING);
        }
        for (var i = 0; i < 6; i++) {
            doc.pages[i].appliedMaster = bMaster;
        }

        // Page i (recto): Half-title
        var frame1 = doc.pages[0].textFrames.add();
        frame1.geometricBounds = pageBounds(doc.pages[0]);
        frame1.contents = TITLE;
        frame1.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        styleText(frame1.parentStory.texts[0], {
            font: CFG.fonts.chapter_title + "\tRegular",
            size: 24,
            align: Justification.CENTER_ALIGN,
            tracking: 50,
            caps: Capitalization.ALL_CAPS
        });

        // Page ii (verso): Blank

        // Page iii (recto): Full title page
        var frame3 = doc.pages[2].textFrames.add();
        frame3.geometricBounds = pageBounds(doc.pages[2]);
        var titleContent = TITLE;
        if (SUBTITLE) titleContent += "\r\r" + SUBTITLE;
        titleContent += "\r\r\r" + AUTHOR;
        frame3.contents = titleContent;
        frame3.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;

        var s3 = frame3.parentStory;
        styleText(s3.paragraphs[0], {
            font: CFG.fonts.chapter_title + "\tRegular", size: 30,
            align: Justification.CENTER_ALIGN, tracking: 50, caps: Capitalization.ALL_CAPS
        });
        if (s3.paragraphs.length > 1) {
            styleText(s3.paragraphs[1], { size: 12, align: Justification.CENTER_ALIGN });
        }
        if (SUBTITLE && s3.paragraphs.length > 2) {
            styleText(s3.paragraphs[2], {
                font: CFG.fonts.body + "\tItalic", size: 14, align: Justification.CENTER_ALIGN
            });
        }
        for (var pi = 3; pi < s3.paragraphs.length - 1; pi++) {
            styleText(s3.paragraphs[pi], { size: 12, align: Justification.CENTER_ALIGN });
        }
        if (s3.paragraphs.length > 3) {
            styleText(s3.paragraphs[s3.paragraphs.length - 1], {
                font: CFG.fonts.chapter_title + "\tRegular", size: 16,
                align: Justification.CENTER_ALIGN, tracking: 75
            });
        }

        // Page iv (verso): Copyright
        var frame4 = doc.pages[3].textFrames.add();
        frame4.geometricBounds = pageBounds(doc.pages[3]);
        frame4.contents = COPYRIGHT;
        frame4.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        styleText(frame4.parentStory.texts[0], {
            font: CFG.fonts.body + "\tRegular", size: 8, align: Justification.LEFT_ALIGN
        });

        // Page v (recto): Dedication
        if (DEDICATION) {
            var frame5 = doc.pages[4].textFrames.add();
            frame5.geometricBounds = pageBounds(doc.pages[4]);
            frame5.contents = DEDICATION;
            frame5.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
            styleText(frame5.parentStory.texts[0], {
                font: CFG.fonts.body + "\tItalic", size: 14, align: Justification.CENTER_ALIGN
            });
        }

        // Page vi (verso): Blank

        // ============================================================
        // PAGE NUMBERING
        // ============================================================

        try {
            doc.sections[0].pageNumberStyle = PageNumberStyle.LOWER_ROMAN;
            doc.sections[0].pageNumberStart = 1;
        } catch(e) {}

        try {
            var bodySection = doc.sections.add(doc.pages[6]);
            bodySection.pageNumberStyle = PageNumberStyle.ARABIC;
            bodySection.pageNumberStart = 1;
        } catch(e) {}

        // ============================================================
        // BACK MATTER
        // ============================================================

        // Add blank page if needed to start back matter on recto
        if (doc.pages.length % 2 === 0) {
            var bp = doc.pages.add(LocationOptions.AT_END);
            bp.appliedMaster = bMaster;
        }

        // Acknowledgements
        var ackPage = doc.pages.add(LocationOptions.AT_END);
        ackPage.appliedMaster = bMaster;
        var ackFrame = ackPage.textFrames.add();
        ackFrame.geometricBounds = pageBounds(ackPage);
        ackFrame.contents = "Acknowledgements\r\r[Your acknowledgements text here]";
        var ackS = ackFrame.parentStory;
        styleText(ackS.paragraphs[0], {
            font: CFG.fonts.chapter_title + "\tRegular", size: 24,
            align: Justification.CENTER_ALIGN, tracking: 50,
            caps: Capitalization.ALL_CAPS, spaceBefore: "2in"
        });
        for (var pi = 1; pi < ackS.paragraphs.length; pi++) {
            styleText(ackS.paragraphs[pi], {
                font: CFG.fonts.body + "\tRegular", size: 12, align: Justification.LEFT_ALIGN
            });
        }

        // Blank verso
        var bv1 = doc.pages.add(LocationOptions.AT_END);
        bv1.appliedMaster = bMaster;

        // About the Author
        var aboutPage = doc.pages.add(LocationOptions.AT_END);
        aboutPage.appliedMaster = bMaster;
        var aboutFrame = aboutPage.textFrames.add();
        aboutFrame.geometricBounds = pageBounds(aboutPage);
        aboutFrame.contents = "About the Author\r\r[Your author bio here]";
        var aboutS = aboutFrame.parentStory;
        styleText(aboutS.paragraphs[0], {
            font: CFG.fonts.chapter_title + "\tRegular", size: 24,
            align: Justification.CENTER_ALIGN, tracking: 50,
            caps: Capitalization.ALL_CAPS, spaceBefore: "2in"
        });
        for (var pi = 1; pi < aboutS.paragraphs.length; pi++) {
            styleText(aboutS.paragraphs[pi], {
                font: CFG.fonts.body + "\tRegular", size: 12, align: Justification.LEFT_ALIGN
            });
        }

        // Blank verso
        var bv2 = doc.pages.add(LocationOptions.AT_END);
        bv2.appliedMaster = bMaster;

        // Coming Next / Series teaser
        if (CFG.structure === "act-chapter-scene") {
            var nextPage = doc.pages.add(LocationOptions.AT_END);
            nextPage.appliedMaster = bMaster;
            var nextFrame = nextPage.textFrames.add();
            nextFrame.geometricBounds = pageBounds(nextPage);
            nextFrame.contents = "The story continues\r\r[Teaser text here]";
            nextFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
            var nextS = nextFrame.parentStory;
            styleText(nextS.paragraphs[0], {
                font: CFG.fonts.chapter_title + "\tRegular", size: 18,
                align: Justification.CENTER_ALIGN, tracking: 50
            });
            for (var pi = 1; pi < nextS.paragraphs.length; pi++) {
                styleText(nextS.paragraphs[pi], {
                    font: CFG.fonts.body + "\tItalic", size: 14,
                    align: Justification.CENTER_ALIGN
                });
            }
        }

        doc.save();

        alert("Front and back matter added!\n\n" +
              "Book: " + TITLE + "\n" +
              "Front: i-vi (half-title, blank, title, copyright, dedication, blank)\n" +
              "Chapter 1 starts at page 1\n" +
              "Back: Acknowledgements, About the Author" +
              (CFG.structure === "act-chapter-scene" ? ", Coming Next" : "") + "\n\n" +
              "Total pages: " + doc.pages.length + "\n\n" +
              "Edit placeholder text [in brackets] as needed.");

    } catch(e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}

function styleText(textObj, opts) {
    if (opts.align) textObj.justification = opts.align;
    if (opts.size) textObj.pointSize = opts.size;
    if (opts.tracking) textObj.tracking = opts.tracking;
    if (opts.caps) textObj.capitalization = opts.caps;
    if (opts.spaceBefore) textObj.spaceBefore = opts.spaceBefore;

    if (opts.font) {
        try {
            textObj.appliedFont = app.fonts.itemByName(opts.font);
        } catch(e) {
            try {
                var parts = opts.font.split("\t");
                textObj.appliedFont = parts[0];
            } catch(e2) {}
        }
    }
}
