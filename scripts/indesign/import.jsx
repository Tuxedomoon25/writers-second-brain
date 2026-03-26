/*
 * import.jsx — Parameterized InDesign import
 *
 * Reads indesign_config.json for all paths, dimensions, and fonts.
 * Creates a NEW document, imports styles from template,
 * places the .docx, and walks every paragraph to apply correct styles.
 *
 * Run via: Window > Utilities > Scripts
 */

// ============================================================
// READ CONFIG
// ============================================================

var configFile = new File(File($.fileName).parent.parent + "/indesign_config.json");
if (!configFile.exists) {
    // Try next to the active document
    if (app.documents.length > 0) {
        configFile = new File(app.activeDocument.filePath + "/indesign_config.json");
    }
}
if (!configFile.exists) {
    // Prompt user
    configFile = File.openDialog("Select indesign_config.json", "JSON:*.json");
}
if (!configFile || !configFile.exists) {
    throw new Error("indesign_config.json not found. Run format_fiction.py first.");
}

configFile.open("r");
var configText = configFile.read();
configFile.close();

var CFG = eval("(" + configText + ")");

// Derived paths
var TEMPLATE_PATH = CFG.paths.template_path || "";
var DOCX_PATH = CFG.paths.output_dir + "/" + CFG.paths.docx_filename;
var SAVE_PATH = CFG.paths.output_dir + "/" + CFG.paths.indd_filename;

// Dimensions
var DOC_WIDTH = CFG.trim.width_in + "in";
var DOC_HEIGHT = CFG.trim.height_in + "in";
var MARGIN_TOP = CFG.margins.top_in + "in";
var MARGIN_BOTTOM = CFG.margins.bottom_in + "in";
var MARGIN_INSIDE = CFG.margins.inside_in + "in";
var MARGIN_OUTSIDE = CFG.margins.outside_in + "in";

// Style names
var WORD_CHAPTER_NUMBER = "ChapterNumber";
var WORD_CHAPTER_TITLE = "ChapterTitle";
var WORD_SCENE_BREAK = "SceneBreak";
var WORD_NORMAL = "Normal";

var ID_CHAPTER_NUMBER = "Chapter Number";
var ID_CHAPTER_TITLE = "Chapter Title";
var ID_BODY_TEXT = "Body Text";
var ID_BODY_NO_INDENT = "Body Text - No Indent";
var ID_SCENE_BREAK = "Scene Break";
var ID_ITALIC = "Italic";
var ID_BOLD = "Bold";

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
              "Book: " + CFG.title + "\n" +
              "Saved to: " + SAVE_PATH + "\n" +
              "Pages: " + doc.pages.length + "\n\n" +
              "Style mapping:\n" +
              "  Chapter Numbers: " + stats.chapterNumbers + "\n" +
              "  Chapter Titles: " + stats.chapterTitles + "\n" +
              "  Scene Breaks: " + stats.sceneBreaks + "\n" +
              "  Body Text: " + stats.bodyText + "\n" +
              "  First Paragraphs: " + stats.firstParas + "\n\n" +
              "Next: Run setup_masters.jsx, then fix_styles.jsx.");
    } catch (e) {
        alert("ERROR:\n\n" + e.message + "\n\nLine: " + e.line);
    }
}

function step1_createDoc() {
    var doc = app.documents.add({
        documentPreferences: {
            pageWidth: DOC_WIDTH,
            pageHeight: DOC_HEIGHT,
            facingPages: true,
            pagesPerDocument: 1
        }
    });

    doc.marginPreferences.top = MARGIN_TOP;
    doc.marginPreferences.bottom = MARGIN_BOTTOM;
    doc.marginPreferences.left = MARGIN_INSIDE;
    doc.marginPreferences.right = MARGIN_OUTSIDE;

    doc.textPreferences.smartTextReflow = true;
    doc.textPreferences.limitToMasterTextFrames = false;
    doc.textPreferences.deleteEmptyPages = true;
    doc.textPreferences.addPages = AddPageOptions.END_OF_DOCUMENT;

    return doc;
}

function step2_importStyles(doc) {
    var templateFile = new File(TEMPLATE_PATH);
    if (!templateFile.exists) {
        $.writeln("WARNING: Template not found: " + TEMPLATE_PATH + " — skipping style import.");
        return doc;
    }

    doc.importStyles(ImportFormat.PARAGRAPH_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);
    doc.importStyles(ImportFormat.CHARACTER_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);
    doc.importStyles(ImportFormat.OBJECT_STYLES_FORMAT, templateFile,
                     GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE);

    var required = [ID_CHAPTER_TITLE, ID_BODY_TEXT, ID_BODY_NO_INDENT, ID_SCENE_BREAK];
    for (var i = 0; i < required.length; i++) {
        try {
            doc.paragraphStyles.itemByName(required[i]).name;
        } catch (e) {
            throw new Error("Required style '" + required[i] + "' not found after import!");
        }
    }

    return doc;
}

function step3_createChapterNumberStyle(doc) {
    try {
        doc.paragraphStyles.itemByName(ID_CHAPTER_NUMBER).name;
        return;
    } catch (e) {}

    var baseStyle = null;
    try { baseStyle = doc.paragraphStyles.itemByName(ID_CHAPTER_TITLE); } catch (e) {}

    var style = doc.paragraphStyles.add({ name: ID_CHAPTER_NUMBER, basedOn: baseStyle });
    style.pointSize = 60;
    style.justification = Justification.CENTER_ALIGN;
    style.spaceBefore = "2in";
    style.spaceAfter = "0.25in";
    style.startParagraph = StartParagraph.NEXT_ODD_PAGE;
}

function step4_placeDocx(doc) {
    var docxFile = new File(DOCX_PATH);
    if (!docxFile.exists) {
        throw new Error("DOCX not found:\n" + DOCX_PATH);
    }

    var prefs = app.wordRTFImportPreferences;
    prefs.useTypographersQuotes = true;
    prefs.importFootnotes = true;
    prefs.importEndnotes = false;
    prefs.removeFormatting = false;

    var page = doc.pages[0];
    var pb = page.bounds;
    var m = page.marginPreferences;

    var frame = page.textFrames.add({
        geometricBounds: [pb[0] + m.top, pb[1] + m.left, pb[2] - m.bottom, pb[3] - m.right]
    });

    frame.place(docxFile);

    var lastFrame = frame;
    var added = 0;

    while (lastFrame.overflows && added < 500) {
        var np = doc.pages.add();
        added++;
        var nm = np.marginPreferences;
        var nb = np.bounds;

        var nf = np.textFrames.add({
            geometricBounds: [nb[0] + nm.top, nb[1] + nm.left, nb[2] - nm.bottom, nb[3] - nm.right]
        });

        lastFrame.nextTextFrame = nf;
        lastFrame = nf;
    }
}

function step5_remapStyles(doc) {
    var sChapterNum = getStyle(doc, ID_CHAPTER_NUMBER);
    var sChapterTitle = getStyle(doc, ID_CHAPTER_TITLE);
    var sBodyText = getStyle(doc, ID_BODY_TEXT);
    var sSceneBreak = getStyle(doc, ID_SCENE_BREAK);
    var sBodyNoIndent = getStyle(doc, ID_BODY_NO_INDENT);

    var stats = { chapterNumbers: 0, chapterTitles: 0, sceneBreaks: 0, bodyText: 0, firstParas: 0, other: 0 };

    for (var s = 0; s < doc.stories.length; s++) {
        var paras = doc.stories[s].paragraphs;
        var prevStyleTarget = null;

        for (var p = 0; p < paras.length; p++) {
            var para = paras[p];
            var styleName = "";
            try { styleName = para.appliedParagraphStyle.name; } catch (e) { continue; }

            var targetStyle = null;

            if (styleName === WORD_CHAPTER_NUMBER) {
                targetStyle = sChapterNum;
                stats.chapterNumbers++;
            } else if (styleName === WORD_CHAPTER_TITLE) {
                targetStyle = sChapterTitle;
                stats.chapterTitles++;
            } else if (styleName === WORD_SCENE_BREAK) {
                targetStyle = sSceneBreak;
                stats.sceneBreaks++;
            } else if (styleName === WORD_NORMAL || styleName === "[Basic Paragraph]" || styleName === "Normal") {
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
                para.clearOverrides(OverrideType.ALL);
            } else {
                stats.other++;
            }

            prevStyleTarget = targetStyle;
        }
    }

    deleteWordStyle(doc, WORD_CHAPTER_NUMBER, sBodyText);
    deleteWordStyle(doc, WORD_CHAPTER_TITLE, sBodyText);
    deleteWordStyle(doc, WORD_SCENE_BREAK, sBodyText);

    return stats;
}

function deleteWordStyle(doc, name, replacement) {
    try { var ws = doc.paragraphStyles.itemByName(name); ws.name; ws.remove(replacement); } catch (e) {}
}

function step6_safetyPass(doc) {
    var italicStyle = getCharStyle(doc, ID_ITALIC);
    var boldStyle = getCharStyle(doc, ID_BOLD);

    if (italicStyle) {
        app.findTextPreferences = NothingEnum.NOTHING;
        app.changeTextPreferences = NothingEnum.NOTHING;
        app.findTextPreferences.fontStyle = "Italic";
        app.changeTextPreferences.appliedCharacterStyle = italicStyle;
        doc.changeText();
    }

    if (boldStyle) {
        app.findTextPreferences = NothingEnum.NOTHING;
        app.changeTextPreferences = NothingEnum.NOTHING;
        app.findTextPreferences.fontStyle = "Bold";
        app.changeTextPreferences.appliedCharacterStyle = boldStyle;
        doc.changeText();
    }

    app.findTextPreferences = NothingEnum.NOTHING;
    app.changeTextPreferences = NothingEnum.NOTHING;
}

function step7_cleanup(doc) {
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "\\r\\r+";
    app.changeGrepPreferences.changeTo = "\\r";
    doc.changeGrep();

    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "\\t";
    app.changeGrepPreferences.changeTo = "";
    doc.changeGrep();

    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
}

function step8_postProcess(doc) {
    try {
        doc.sections[0].pageNumberStyle = PageNumberStyle.ARABIC;
        doc.sections[0].pageNumberStart = 1;
    } catch (e) {}
}

function step9_save(doc) {
    doc.save(new File(SAVE_PATH));
}

function getStyle(doc, name) {
    try { var s = doc.paragraphStyles.itemByName(name); s.name; return s; } catch (e) { return null; }
}

function getCharStyle(doc, name) {
    try { var s = doc.characterStyles.itemByName(name); s.name; return s; } catch (e) { return null; }
}
