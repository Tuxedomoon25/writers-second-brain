/*
 * add_matter.jsx — v2
 *
 * Adds front matter and back matter with correct coordinates.
 * Uses document's measurement units (inches) instead of points.
 *
 * Run with The_Silence_of_the_Bells_Interior.indd open.
 * If front/back matter pages already exist, delete them first (Ctrl+Z or manual delete).
 */

main();

function main() {
    var doc = app.activeDocument;

    try {
        // ============================================================
        // CONTENT
        // ============================================================

        var TITLE = "The Silence of the Bells";
        var SUBTITLE = "Age 6 of The Sung World";
        var AUTHOR = "Timo de Groot";

        var COPYRIGHT =
            "Text copyright \u00A9 2026 Timo de Groot\r\r" +
            "All rights reserved. This book or parts thereof may not be reproduced " +
            "in any form, stored in any retrieval system, or transmitted in any form " +
            "by any means \u2013 electronic, mechanical, photocopy, recording, or otherwise " +
            "\u2013 without prior written permission of the publisher.\r\r" +
            "This is a work of fiction. Names, characters, places, and incidents either " +
            "are the product of the author\u2019s imagination or are used fictitiously, and " +
            "any resemblance to actual persons, living or dead, business establishments, " +
            "events, or locales is entirely coincidental.\r\r" +
            "www.timodegroot.com\r\r" +
            "ISBN: [ISBN-13 NUMBER]";

        var DEDICATION = "For those who learned to carry\rwhat they could not measure.";

        // ============================================================
        // Get B-Master
        // ============================================================

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
        // FRONT MATTER: Add 6 pages at beginning
        // ============================================================

        for (var i = 0; i < 6; i++) {
            doc.pages.add(LocationOptions.AT_BEGINNING);
        }
        for (var i = 0; i < 6; i++) {
            doc.pages[i].appliedMaster = bMaster;
        }

        // ============================================================
        // Page i (recto): Half-title
        // ============================================================

        var frame1 = doc.pages[0].textFrames.add();
        frame1.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        frame1.contents = TITLE;
        frame1.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        styleText(frame1.parentStory.texts[0], {
            font: "Cinzel\tRegular",
            size: 24,
            align: Justification.CENTER_ALIGN,
            tracking: 50,
            caps: Capitalization.ALL_CAPS
        });

        // ============================================================
        // Page ii (verso): Blank
        // ============================================================

        // Nothing

        // ============================================================
        // Page iii (recto): Full title page
        // ============================================================

        var frame3 = doc.pages[2].textFrames.add();
        frame3.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        frame3.contents = TITLE + "\r\r" + SUBTITLE + "\r\r\r" + AUTHOR;
        frame3.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;

        var s3 = frame3.parentStory;
        // Title line
        styleText(s3.paragraphs[0], {
            font: "Cinzel\tRegular", size: 30, align: Justification.CENTER_ALIGN,
            tracking: 50, caps: Capitalization.ALL_CAPS
        });
        // Blank line
        if (s3.paragraphs.length > 1) {
            styleText(s3.paragraphs[1], { size: 12, align: Justification.CENTER_ALIGN });
        }
        // Subtitle
        if (s3.paragraphs.length > 2) {
            styleText(s3.paragraphs[2], {
                font: "Garamond\tItalic", size: 14, align: Justification.CENTER_ALIGN
            });
        }
        // Blank lines
        for (var pi = 3; pi < s3.paragraphs.length - 1; pi++) {
            styleText(s3.paragraphs[pi], { size: 12, align: Justification.CENTER_ALIGN });
        }
        // Author name (last paragraph)
        if (s3.paragraphs.length > 3) {
            var lastP = s3.paragraphs[s3.paragraphs.length - 1];
            styleText(lastP, {
                font: "Cinzel\tRegular", size: 16, align: Justification.CENTER_ALIGN,
                tracking: 75
            });
        }

        // ============================================================
        // Page iv (verso): Copyright
        // ============================================================

        var frame4 = doc.pages[3].textFrames.add();
        frame4.geometricBounds = ["0.6in", "0.5in", "7.8in", "4.75in"];
        frame4.contents = COPYRIGHT;
        frame4.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        styleText(frame4.parentStory.texts[0], {
            font: "Garamond\tRegular", size: 8, align: Justification.LEFT_ALIGN
        });

        // ============================================================
        // Page v (recto): Dedication
        // ============================================================

        var frame5 = doc.pages[4].textFrames.add();
        frame5.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        frame5.contents = DEDICATION;
        frame5.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        styleText(frame5.parentStory.texts[0], {
            font: "Garamond\tItalic", size: 14, align: Justification.CENTER_ALIGN
        });

        // ============================================================
        // Page vi (verso): Blank
        // ============================================================

        // Nothing

        // ============================================================
        // PAGE NUMBERING
        // ============================================================

        // Front matter: roman numerals
        try {
            doc.sections[0].pageNumberStyle = PageNumberStyle.LOWER_ROMAN;
            doc.sections[0].pageNumberStart = 1;
        } catch(e) {}

        // Body: Arabic starting at 1 on page 7 (Chapter 1)
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

        // --- Acknowledgements ---
        var ackPage = doc.pages.add(LocationOptions.AT_END);
        ackPage.appliedMaster = bMaster;
        var ackFrame = ackPage.textFrames.add();
        ackFrame.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        ackFrame.contents = "Acknowledgements\r\r[Your acknowledgements text here]";
        var ackS = ackFrame.parentStory;
        styleText(ackS.paragraphs[0], {
            font: "Cinzel\tRegular", size: 24, align: Justification.CENTER_ALIGN,
            tracking: 50, caps: Capitalization.ALL_CAPS, spaceBefore: "2in"
        });
        for (var pi = 1; pi < ackS.paragraphs.length; pi++) {
            styleText(ackS.paragraphs[pi], {
                font: "Garamond\tRegular", size: 12, align: Justification.LEFT_ALIGN
            });
        }

        // Blank verso
        var bv1 = doc.pages.add(LocationOptions.AT_END);
        bv1.appliedMaster = bMaster;

        // --- About the Author ---
        var aboutPage = doc.pages.add(LocationOptions.AT_END);
        aboutPage.appliedMaster = bMaster;
        var aboutFrame = aboutPage.textFrames.add();
        aboutFrame.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        aboutFrame.contents = "About the Author\r\r[Your author bio here]";
        var aboutS = aboutFrame.parentStory;
        styleText(aboutS.paragraphs[0], {
            font: "Cinzel\tRegular", size: 24, align: Justification.CENTER_ALIGN,
            tracking: 50, caps: Capitalization.ALL_CAPS, spaceBefore: "2in"
        });
        for (var pi = 1; pi < aboutS.paragraphs.length; pi++) {
            styleText(aboutS.paragraphs[pi], {
                font: "Garamond\tRegular", size: 12, align: Justification.LEFT_ALIGN
            });
        }

        // Blank verso
        var bv2 = doc.pages.add(LocationOptions.AT_END);
        bv2.appliedMaster = bMaster;

        // --- Coming Next ---
        var nextPage = doc.pages.add(LocationOptions.AT_END);
        nextPage.appliedMaster = bMaster;
        var nextFrame = nextPage.textFrames.add();
        nextFrame.geometricBounds = ["0.6in", "0.75in", "7.8in", "5in"];
        nextFrame.contents = "The Sung World continues\r\rThe bells ring more than once.\r\r[Teaser text for Book 2 here]";
        nextFrame.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        var nextS = nextFrame.parentStory;
        styleText(nextS.paragraphs[0], {
            font: "Cinzel\tRegular", size: 18, align: Justification.CENTER_ALIGN, tracking: 50
        });
        for (var pi = 1; pi < nextS.paragraphs.length; pi++) {
            styleText(nextS.paragraphs[pi], {
                font: "Garamond\tItalic", size: 14, align: Justification.CENTER_ALIGN
            });
        }

        // ============================================================
        // SAVE
        // ============================================================

        doc.save();

        alert("Front and back matter added!\n\n" +
              "Front: i-vi (half-title, blank, title, copyright, dedication, blank)\n" +
              "Chapter 1 starts at page 1\n" +
              "Back: Acknowledgements, About the Author, Coming Next\n\n" +
              "Total pages: " + doc.pages.length + "\n\n" +
              "Edit placeholder text [in brackets] as needed.");

    } catch(e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}

// ============================================================
// HELPER: Style text with options
// ============================================================

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
            // Try just the family name
            try {
                var parts = opts.font.split("\t");
                textObj.appliedFont = parts[0];
            } catch(e2) {}
        }
    }
}
