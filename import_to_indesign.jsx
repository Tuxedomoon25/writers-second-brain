/*
 * import_to_indesign.jsx — v5
 *
 * Creates a NEW document, imports styles from template,
 * places the .docx, and walks every paragraph to apply correct styles.
 *
 * Run via: Window > Utilities > Scripts
 */

// ============================================================
// CONFIGURATION
// ============================================================

var CONFIG = {
    templatePath: "C:\\Users\\Timo\\OneDrive - Faren\\01_Projects\\Paths of Light\\The_Great_Story_Project\\03_InDesign\\Template.indt",
    docxPath: "C:\\Users\\Timo\\Desktop\\Projects\\Atticus Indesign\\The Silence of the Bells - InDesign Import.docx",
    savePath: "C:\\Users\\Timo\\Desktop\\Projects\\Atticus Indesign\\The_Silence_of_the_Bells_Interior.indd",

    // Document setup (5.5 x 8.5 inches)
    docWidth: "5.5in",
    docHeight: "8.5in",
    marginTop: "0.6in",
    marginBottom: "0.7in",
    marginInside: "0.75in",
    marginOutside: "0.5in",

    // Word style names (from the .docx)
    wordChapterNumber: "ChapterNumber",
    wordChapterTitle: "ChapterTitle",
    wordSceneBreak: "SceneBreak",
    wordNormal: "Normal",

    // InDesign target styles (from template)
    idChapterNumber: "Chapter Number",
    idChapterTitle: "Chapter Title",
    idBodyText: "Body Text",
    idBodyNoIndent: "Body Text - No Indent",
    idSceneBreak: "Scene Break",

    // Character styles
    idItalic: "Italic",
    idBold: "Bold"
};

// ============================================================
// MAIN
// ============================================================

main();

function main() {
    var t0 = new Date();

    try {
        var doc = step1_createDoc();
        step2_importStyles(doc);
        step3_createChapterNumberStyle(doc);
        step4_placeDocx(doc);
        var stats = step5_remapStyles(doc);
        step6_safetyPass(doc);
        step7_cleanup(doc);
        step8_postProcess(doc);
        step9_save(doc);

        var elapsed = Math.round((new Date() - t0) / 1000);

        alert("Import complete! (" + elapsed + "s)\n\n" +
              "Saved to: " + CONFIG.savePath + "\n" +
              "Pages: " + doc.pages.length + "\n\n" +
              "Style mapping:\n" +
              "  Chapter Numbers: " + stats.chapterNumbers + "\n" +
              "  Chapter Titles: " + stats.chapterTitles + "\n" +
              "  Scene Breaks: " + stats.sceneBreaks + "\n" +
              "  Body Text: " + stats.bodyText + "\n" +
              "  First Paragraphs: " + stats.firstParas + "\n\n" +
              "Next: Press W to preview, check Preflight.");
    } catch (e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}

// ============================================================
// STEP 1: Create brand new document (not from template)
// ============================================================

function step1_createDoc() {
    $.writeln("Step 1: Creating new 6x9 document...");

    var doc = app.documents.add({
        documentPreferences: {
            pageWidth: CONFIG.docWidth,
            pageHeight: CONFIG.docHeight,
            facingPages: true,
            pagesPerDocument: 1
        }
    });

    // Set margins
    doc.marginPreferences.top = CONFIG.marginTop;
    doc.marginPreferences.bottom = CONFIG.marginBottom;
    doc.marginPreferences.left = CONFIG.marginInside;   // inside/gutter
    doc.marginPreferences.right = CONFIG.marginOutside;

    // Enable smart text reflow
    doc.textPreferences.smartTextReflow = true;
    doc.textPreferences.limitToMasterTextFrames = false;
    doc.textPreferences.deleteEmptyPages = true;
    doc.textPreferences.addPages = AddPageOptions.END_OF_DOCUMENT;

    $.writeln("  Done. 6x9 facing pages, smart text reflow enabled.");
    return doc;
}

// ============================================================
// STEP 2: Import styles from template
// ============================================================

function step2_importStyles(doc) {
    $.writeln("Step 2: Importing styles from template...");

    var templateFile = new File(CONFIG.templatePath);
    if (!templateFile.exists) {
        throw new Error("Template not found:\n" + CONFIG.templatePath);
    }

    // Import paragraph styles
    doc.importStyles(ImportFormat.PARAGRAPH_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);

    // Import character styles
    doc.importStyles(ImportFormat.CHARACTER_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);

    // Import object styles
    doc.importStyles(ImportFormat.OBJECT_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);

    // Verify key styles exist
    var required = [CONFIG.idChapterTitle, CONFIG.idBodyText, CONFIG.idBodyNoIndent, CONFIG.idSceneBreak];
    for (var i = 0; i < required.length; i++) {
        try {
            doc.paragraphStyles.itemByName(required[i]).name;
        } catch (e) {
            throw new Error("Required style '" + required[i] + "' not found after import!");
        }
    }

    $.writeln("  Imported paragraph, character, and object styles from template.");
    return doc;
}

// ============================================================
// STEP 3: Create "Chapter Number" style (based on Chapter Title)
// ============================================================

function step3_createChapterNumberStyle(doc) {
    $.writeln("Step 3: Creating Chapter Number style...");

    try {
        doc.paragraphStyles.itemByName(CONFIG.idChapterNumber).name;
        $.writeln("  Already exists, skipping.");
        return;
    } catch (e) {}

    // Base it on Chapter Title so it inherits the font family
    var baseStyle = null;
    try {
        baseStyle = doc.paragraphStyles.itemByName(CONFIG.idChapterTitle);
    } catch (e) {}

    var style = doc.paragraphStyles.add({
        name: CONFIG.idChapterNumber,
        basedOn: baseStyle
    });

    style.pointSize = 60;
    style.justification = Justification.CENTER_ALIGN;
    style.spaceBefore = "2in";
    style.spaceAfter = "0.25in";
    style.startParagraph = StartParagraph.NEXT_ODD_PAGE;

    $.writeln("  Created 'Chapter Number' based on 'Chapter Title'.");
}

// ============================================================
// STEP 4: Place .docx
// ============================================================

function step4_placeDocx(doc) {
    $.writeln("Step 4: Placing .docx...");

    var docxFile = new File(CONFIG.docxPath);
    if (!docxFile.exists) {
        throw new Error("DOCX not found:\n" + CONFIG.docxPath);
    }

    // Import preferences
    var prefs = app.wordRTFImportPreferences;
    prefs.useTypographersQuotes = true;
    prefs.importFootnotes = true;
    prefs.importEndnotes = false;
    prefs.removeFormatting = false;

    // Create text frame on page 1
    var page = doc.pages[0];
    var pb = page.bounds;
    var m = page.marginPreferences;

    var frame = page.textFrames.add({
        geometricBounds: [
            pb[0] + m.top,
            pb[1] + m.left,
            pb[2] - m.bottom,
            pb[3] - m.right
        ]
    });

    // Place
    frame.place(docxFile);

    // Thread overflow into new pages
    var lastFrame = frame;
    var added = 0;

    while (lastFrame.overflows && added < 500) {
        var np = doc.pages.add();
        added++;
        var nm = np.marginPreferences;
        var nb = np.bounds;

        var nf = np.textFrames.add({
            geometricBounds: [
                nb[0] + nm.top,
                nb[1] + nm.left,
                nb[2] - nm.bottom,
                nb[3] - nm.right
            ]
        });

        lastFrame.nextTextFrame = nf;
        lastFrame = nf;
    }

    // Report
    var story = frame.parentStory;
    $.writeln("  Pages: " + doc.pages.length + " (" + added + " added)");
    $.writeln("  Characters: " + story.characters.length);
    $.writeln("  Paragraphs: " + story.paragraphs.length);
    $.writeln("  Still overflows: " + lastFrame.overflows);
}

// ============================================================
// STEP 5: Remap styles by walking every paragraph
// ============================================================

function step5_remapStyles(doc) {
    $.writeln("Step 5: Remapping Word styles to InDesign styles...");

    // Get target styles
    var sChapterNum = getStyle(doc, CONFIG.idChapterNumber);
    var sChapterTitle = getStyle(doc, CONFIG.idChapterTitle);
    var sBodyText = getStyle(doc, CONFIG.idBodyText);
    var sSceneBreak = getStyle(doc, CONFIG.idSceneBreak);
    var sBodyNoIndent = getStyle(doc, CONFIG.idBodyNoIndent);

    var stats = { chapterNumbers: 0, chapterTitles: 0, sceneBreaks: 0, bodyText: 0, firstParas: 0, other: 0 };

    for (var s = 0; s < doc.stories.length; s++) {
        var paras = doc.stories[s].paragraphs;
        var prevStyleTarget = null;

        for (var p = 0; p < paras.length; p++) {
            var para = paras[p];
            var styleName = "";
            try {
                styleName = para.appliedParagraphStyle.name;
            } catch (e) { continue; }

            var targetStyle = null;

            // Map based on Word style name
            if (styleName === CONFIG.wordChapterNumber) {
                targetStyle = sChapterNum;
                stats.chapterNumbers++;
            } else if (styleName === CONFIG.wordChapterTitle) {
                targetStyle = sChapterTitle;
                stats.chapterTitles++;
            } else if (styleName === CONFIG.wordSceneBreak) {
                targetStyle = sSceneBreak;
                stats.sceneBreaks++;
            } else if (styleName === CONFIG.wordNormal ||
                       styleName === "[Basic Paragraph]" ||
                       styleName === "Normal") {
                // Check if this is a first paragraph (after chapter title or scene break)
                if (prevStyleTarget === sChapterTitle || prevStyleTarget === sSceneBreak) {
                    targetStyle = sBodyNoIndent;
                    stats.firstParas++;
                } else {
                    targetStyle = sBodyText;
                    stats.bodyText++;
                }
            }

            if (targetStyle) {
                para.appliedParagraphStyle = targetStyle;
                // Clear any leftover overrides from Word
                para.clearOverrides(OverrideType.ALL);
            } else {
                stats.other++;
            }

            prevStyleTarget = targetStyle;
        }
    }

    $.writeln("  Chapter Numbers: " + stats.chapterNumbers);
    $.writeln("  Chapter Titles: " + stats.chapterTitles);
    $.writeln("  Scene Breaks: " + stats.sceneBreaks);
    $.writeln("  Body Text: " + stats.bodyText);
    $.writeln("  First Paragraphs: " + stats.firstParas);
    $.writeln("  Other/unmapped: " + stats.other);

    // Delete leftover Word styles
    deleteWordStyle(doc, CONFIG.wordChapterNumber, sBodyText);
    deleteWordStyle(doc, CONFIG.wordChapterTitle, sBodyText);
    deleteWordStyle(doc, CONFIG.wordSceneBreak, sBodyText);

    return stats;
}

function deleteWordStyle(doc, name, replacement) {
    try {
        var ws = doc.paragraphStyles.itemByName(name);
        ws.name;
        ws.remove(replacement);
        $.writeln("  Deleted Word style: " + name);
    } catch (e) {}
}

// ============================================================
// STEP 6: Safety pass — italic and bold
// ============================================================

function step6_safetyPass(doc) {
    $.writeln("Step 6: Safety pass (italic/bold)...");

    var italicStyle = getCharStyle(doc, CONFIG.idItalic);
    var boldStyle = getCharStyle(doc, CONFIG.idBold);

    if (italicStyle) {
        app.findTextPreferences = NothingEnum.NOTHING;
        app.changeTextPreferences = NothingEnum.NOTHING;
        app.findTextPreferences.fontStyle = "Italic";
        app.changeTextPreferences.appliedCharacterStyle = italicStyle;
        var r = doc.changeText();
        $.writeln("  Italic: " + r.length);
    }

    if (boldStyle) {
        app.findTextPreferences = NothingEnum.NOTHING;
        app.changeTextPreferences = NothingEnum.NOTHING;
        app.findTextPreferences.fontStyle = "Bold";
        app.changeTextPreferences.appliedCharacterStyle = boldStyle;
        var r = doc.changeText();
        $.writeln("  Bold: " + r.length);
    }

    app.findTextPreferences = NothingEnum.NOTHING;
    app.changeTextPreferences = NothingEnum.NOTHING;
}

// ============================================================
// STEP 7: Cleanup
// ============================================================

function step7_cleanup(doc) {
    $.writeln("Step 7: Cleanup...");

    // Double returns
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "\\r\\r+";
    app.changeGrepPreferences.changeTo = "\\r";
    doc.changeGrep();

    // Tabs
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "\\t";
    app.changeGrepPreferences.changeTo = "";
    doc.changeGrep();

    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;

    $.writeln("  Done.");
}

// ============================================================
// STEP 8: Post-process (master pages, page numbering)
// ============================================================

function step8_postProcess(doc) {
    $.writeln("Step 8: Post-processing...");

    // Apply master pages is not possible without importing masters from template.
    // The user can manually apply masters after reviewing.
    // Set page numbering to Arabic starting at 1
    try {
        doc.sections[0].pageNumberStyle = PageNumberStyle.ARABIC;
        doc.sections[0].pageNumberStart = 1;
    } catch (e) {}

    $.writeln("  Page numbering set to Arabic, starting at 1.");
    $.writeln("  NOTE: Master pages were not imported. Apply manually if needed.");
}

// ============================================================
// STEP 9: Save
// ============================================================

function step9_save(doc) {
    $.writeln("Step 9: Saving...");
    doc.save(new File(CONFIG.savePath));
    $.writeln("  Saved to: " + CONFIG.savePath);
}

// ============================================================
// HELPERS
// ============================================================

function getStyle(doc, name) {
    try {
        var s = doc.paragraphStyles.itemByName(name);
        s.name;
        return s;
    } catch (e) {
        $.writeln("  WARNING: Paragraph style '" + name + "' not found.");
        return null;
    }
}

function getCharStyle(doc, name) {
    try {
        var s = doc.characterStyles.itemByName(name);
        s.name;
        return s;
    } catch (e) {
        $.writeln("  WARNING: Character style '" + name + "' not found.");
        return null;
    }
}
