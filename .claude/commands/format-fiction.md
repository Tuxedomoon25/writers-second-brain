---
name: format-fiction
description: Convert fiction manuscript from Obsidian markdown to Atticus .docx and/or InDesign .docx with automation scripts
---

# Format Fiction — Manuscript Export Pipeline

Convert your fiction manuscript from Obsidian markdown to print-ready formats.

## Outputs

1. **Atticus .docx** — H1 chapter names, H2 scene names, `***` scene breaks, Normal body text
2. **InDesign .docx** — ChapterNumber + ChapterTitle custom styles, scene titles removed, `***` scene breaks
3. **InDesign config + JSX scripts** — Automation for import, masters, styles, frames, front/back matter, and auditing

## Pipeline

```
1. CONFIG  → Find and read format-config.yaml from vault
2. CONFIRM → Show book details, chapter count, trim size — ask user to confirm
3. FORMAT  → Ask: Atticus / InDesign / Both?
4. EXPORT  → Run format_fiction.py with selected format
5. SCRIPTS → For InDesign: generate config.json, list JSX script run order
6. REPORT  → Show output paths and next steps
```

## Step 1: Find Config

Look for `format-config.yaml` in the vault path specified in CLAUDE.md:
- Read `$VAULT_PATH/format-config.yaml` (where VAULT_PATH comes from CLAUDE.md Key Paths > Vault)
- If not found, ask the user for the config path

## Step 2: Confirm Details

Display to the user:
```
Book: {title}
Author: {author}
Chapters: {count}
Structure: {structure}
Trim: {width} x {height} inches
Output: {output_path}
```

Ask: "Does this look correct? Any changes before export?"

**IMPORTANT**: Always confirm trim size. The plan requires asking for trim dimensions before generating output. Show the current trim from config and ask the user to verify.

## Step 3: Choose Format

Ask: "Which format? (1) Atticus  (2) InDesign  (3) Both"

## Step 4: Run Export

Execute from the `scripts/` directory:

```bash
python scripts/format_fiction.py --config "{vault_path}/format-config.yaml" --format {atticus|indesign|both}
```

The script reads all parameters from config — no hardcoded values.

## Step 5: InDesign Scripts (if InDesign selected)

After export, inform the user:

```
InDesign .docx and config.json saved to: {output_path}

JSX scripts are at: scripts/indesign/
Run them in this order in InDesign (Window > Utilities > Scripts):

1. import.jsx      — Creates document, imports styles, places .docx
2. setup_masters.jsx — Creates A-Master (headers/folios) and B-Master (chapter openers)
3. fix_styles.jsx   — Fixes fonts, spacing, EPUB tagging
4. fix_frames.jsx   — Resizes all text frames to exact margins
5. add_matter.jsx   — Adds front matter (i-vi) and back matter
6. audit_styles.jsx — Exports style settings for review
7. audit_frames.jsx — Checks frame alignment (target: 0 issues)

The scripts read indesign_config.json from the output directory.
Copy the JSX files to your InDesign Scripts Panel folder if needed.
```

## Step 6: Report

Show summary:
- Output files and their locations
- Stats (chapters, scenes, scene breaks, word count)
- Next steps

## Re-run Support

This skill supports clean re-runs:
- Edit content in Obsidian, then re-run `/format-fiction`
- The script overwrites previous output files
- No manual reconfiguration needed

## Config Reference

The `format-config.yaml` in the vault root controls everything:
- Book metadata (title, author, ISBN, dedication)
- Chapter manifest (paths, names, numbers)
- Trim dimensions and margins
- Font selections
- InDesign template path
- Output directory
