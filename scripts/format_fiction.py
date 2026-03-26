"""
Convert fiction manuscript from Obsidian markdown to print-ready .docx.

Usage:
    python format_fiction.py --config path/to/format-config.yaml --format atticus
    python format_fiction.py --config path/to/format-config.yaml --format indesign
    python format_fiction.py --config path/to/format-config.yaml --format both

Replaces the three hardcoded scripts:
  - convert_to_docx.py
  - convert_to_docx_atticus.py
  - convert_to_docx_indesign.py
"""

import argparse
import os
import sys
from pathlib import Path

from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

# Add parent dir to path for lib imports
sys.path.insert(0, str(Path(__file__).parent))
from lib.parser import (
    load_config, extract_fiction_prose, add_formatted_text,
    generate_indesign_config,
)


def build_atticus_docx(config: dict) -> str:
    """
    Build Atticus-format .docx: H1 chapter names, H2 scene names, *** scene breaks.
    Returns the output path.
    """
    doc = Document()

    vault_path = config['vault_path']
    manuscript_path = config['manuscript_path']
    chapters = config['chapters']

    for ch_idx, chapter in enumerate(chapters):
        rel_path = chapter['path']
        chapter_name = chapter['name']
        filepath = os.path.join(vault_path, manuscript_path, rel_path)

        if not os.path.exists(filepath):
            print(f"  WARNING: Chapter file not found: {filepath}")
            continue

        elements = extract_fiction_prose(filepath)

        # Chapter heading (H1) = chapter NAME
        doc.add_heading(chapter_name, level=1)

        # Strip leading scene breaks before first content
        while elements and elements[0][0] == 'scene_break':
            elements.pop(0)

        for elem in elements:
            if elem[0] == 'heading':
                doc.add_heading(elem[1], level=2)
            elif elem[0] == 'scene_break':
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.style = doc.styles['Normal']
                p.add_run('***')
            elif elem[0] == 'paragraph':
                p = doc.add_paragraph()
                p.style = doc.styles['Normal']
                add_formatted_text(p, elem[1])

        # Page break between chapters (except after last)
        if ch_idx < len(chapters) - 1:
            doc.add_page_break()

    # Build output path
    title_slug = config['title'].replace(' ', '_')
    output_dir = config['output_path']
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{config['title']} - Atticus Import.docx")

    doc.save(output_path)

    # Stats
    h1_count = sum(1 for p in doc.paragraphs if p.style.name == 'Heading 1')
    h2_count = sum(1 for p in doc.paragraphs if p.style.name == 'Heading 2')
    scene_breaks = sum(1 for p in doc.paragraphs if p.text.strip() == '***')
    body_paras = sum(1 for p in doc.paragraphs if p.style.name == 'Normal' and p.text.strip() and p.text.strip() != '***')

    print(f"  Atticus .docx saved: {output_path}")
    print(f"  H1 (chapters): {h1_count}")
    print(f"  H2 (scenes): {h2_count}")
    print(f"  Scene breaks (***): {scene_breaks}")
    print(f"  Body paragraphs: {body_paras}")

    return output_path


def create_custom_style(doc, name, base_style='Normal'):
    """Create a custom paragraph style in the Word document."""
    styles = doc.styles
    style = styles.add_style(name, 1)  # 1 = WD_STYLE_TYPE.PARAGRAPH
    style.base_style = styles[base_style]
    return style


def build_indesign_docx(config: dict) -> str:
    """
    Build InDesign-format .docx: ChapterNumber + ChapterTitle custom styles,
    scene titles removed, SceneBreak custom style.
    Returns the output path.
    """
    doc = Document()

    # Create custom Word styles that InDesign will map from
    style_chapter_num = create_custom_style(doc, 'ChapterNumber')
    style_chapter_title = create_custom_style(doc, 'ChapterTitle')
    style_scene_break = create_custom_style(doc, 'SceneBreak')

    vault_path = config['vault_path']
    manuscript_path = config['manuscript_path']
    chapters = config['chapters']

    for ch_idx, chapter in enumerate(chapters):
        rel_path = chapter['path']
        ch_number = chapter.get('number', ch_idx + 1)
        ch_name = chapter['name']
        filepath = os.path.join(vault_path, manuscript_path, rel_path)

        if not os.path.exists(filepath):
            print(f"  WARNING: Chapter file not found: {filepath}")
            continue

        elements = extract_fiction_prose(filepath)

        # Strip leading scene breaks
        while elements and elements[0][0] == 'scene_break':
            elements.pop(0)

        # Add Chapter Number paragraph (just the digit)
        p = doc.add_paragraph()
        p.style = style_chapter_num
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(str(ch_number))

        # Add Chapter Title paragraph (chapter NAME)
        p = doc.add_paragraph()
        p.style = style_chapter_title
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(ch_name)

        for elem in elements:
            if elem[0] == 'heading':
                # Scene headings REMOVED for print
                continue
            elif elem[0] == 'scene_break':
                p = doc.add_paragraph()
                p.style = style_scene_break
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.add_run('***')
            elif elem[0] == 'paragraph':
                p = doc.add_paragraph()
                p.style = doc.styles['Normal']
                add_formatted_text(p, elem[1])

        # Page break between chapters (except after last)
        if ch_idx < len(chapters) - 1:
            doc.add_page_break()

    # Build output path
    output_dir = config['output_path']
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{config['title']} - InDesign Import.docx")

    doc.save(output_path)

    # Stats
    chapter_nums = sum(1 for p in doc.paragraphs if p.style.name == 'ChapterNumber')
    chapter_titles = sum(1 for p in doc.paragraphs if p.style.name == 'ChapterTitle')
    scene_breaks = sum(1 for p in doc.paragraphs if p.style.name == 'SceneBreak')
    total_words = sum(len(p.text.split()) for p in doc.paragraphs if p.style.name == 'Normal')

    print(f"  InDesign .docx saved: {output_path}")
    print(f"  Chapter numbers: {chapter_nums}")
    print(f"  Chapter titles: {chapter_titles}")
    print(f"  Scene breaks: {scene_breaks}")
    print(f"  Prose words: {total_words}")

    return output_path


def main():
    parser = argparse.ArgumentParser(description='Convert fiction manuscript to print-ready .docx')
    parser.add_argument('--config', required=True, help='Path to format-config.yaml')
    parser.add_argument('--format', required=True, choices=['atticus', 'indesign', 'both'],
                        help='Output format: atticus, indesign, or both')
    args = parser.parse_args()

    config = load_config(args.config)

    print(f'Formatting: {config["title"]}')
    print(f'Chapters: {len(config["chapters"])}')
    print(f'Structure: {config["structure"]}')
    print(f'Output: {config["output_path"]}')
    print()

    if args.format in ('atticus', 'both'):
        print('[Atticus]')
        build_atticus_docx(config)
        print()

    if args.format in ('indesign', 'both'):
        print('[InDesign]')
        indesign_path = build_indesign_docx(config)
        print()

        # Generate InDesign config.json for JSX scripts
        print('[InDesign Config]')
        config_json_path = generate_indesign_config(config, config['output_path'])
        print(f'  Config JSON saved: {config_json_path}')
        print()

    print('Done.')


if __name__ == '__main__':
    main()
