"""
Shared parsing functions for fiction and nonfiction manuscript formatting.

Used by both format_fiction.py and format_nonfiction.py.
"""

import re
import yaml
from pathlib import Path


def load_config(config_path: str) -> dict:
    """Load and validate a format-config.yaml file."""
    path = Path(config_path)
    if not path.exists():
        raise FileNotFoundError(f"Config not found: {config_path}")
    with open(path, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)

    required = ['title', 'author', 'vault_path', 'manuscript_path', 'output_path', 'structure', 'chapters']
    for key in required:
        if key not in config:
            raise ValueError(f"Missing required config key: {key}")

    return config


def clean_scene_title(title: str) -> str:
    """Strip version tags like (POLISHED), (v1), (v2) from scene titles."""
    title = re.sub(r'\s*\(POLISHED[^)]*\)', '', title)
    title = re.sub(r'\s*\(v\d[^)]*\)', '', title)
    return title.strip()


# Fiction metadata markers (WSB pipeline metadata embedded in manuscript files)
FICTION_METADATA_MARKERS = [
    '**Word Count**', '**Quality Scores**', '## Changes Summary',
    '**Mythology Enrichment**', '**Polish Fixes Applied**',
    '**Major Revisions**', '**Voice Adjustments**',
    '**Sensory Enhancements**', '**Negative Construction Fixes**',
    '**Rule 11 Compliance**', '**Rule 11', '**Previous Changes',
    '**Two-Layer moments**', '**Somatic tells used',
    '**Chapter', '**Ch5 somatic', '**Ch4 somatic',
    '### Act 3', '### Somatic', '### Quality', '### Changes',
    '### Act 3 Budget', '**Mythology', '### NOVEL STATUS',
    '**Estimated total', '**Chapter 9', '**Chapter 10',
    '**Chapter 11', '**Chapter 12',
]

# Fiction bullet-point metadata keywords (lines starting with "- " containing these)
FICTION_BULLET_KEYWORDS = [
    'threshold', 'PASS', 'adverb', 'metaphor', 'Kill', 'Remove',
    'Convert', 'Enhance', 'Strengthen', 'Adjust', 'Tighten',
    'Fix', 'Retain', 'Changed', 'Scene 1', 'Scene 2', 'Scene 3',
    'Sc1', 'Sc2', 'Sc3', 'Drift', 'Mass', 'Un-naming',
    'Cole', 'Chest', 'Root', 'Dad', 'Door', 'Postcard',
    'Hiss', 'Gate', 'Stairs', 'Map', "Maya's",
    'Five-stage', 'Temperature', 'Cobblestones', 'Final line',
    'Somatic tell', 'NO copper', 'No jaw', 'Tell ARC',
    'No copper',
]

# Nonfiction metadata markers (simpler — no quality scores or somatic ledgers)
NONFICTION_METADATA_MARKERS = [
    '**Word Count**', '## Changes Summary', '### Quality',
    '### Changes', '**Previous Changes',
]


def is_metadata_line(line: str, markers: list = None) -> bool:
    """Check if a line is a metadata marker that should be skipped."""
    if markers is None:
        markers = FICTION_METADATA_MARKERS
    stripped = line.strip()
    if re.match(r'\*?\*?Word Count\*?\*?\s*:', stripped):
        return True
    for marker in markers:
        if stripped.startswith(marker):
            return True
    return False


def extract_fiction_prose(filepath: str, metadata_markers: list = None,
                         bullet_keywords: list = None) -> list:
    """
    Extract prose content from a fiction chapter markdown file.

    Returns list of tuples:
        ('heading', text)     - Scene heading (## title)
        ('scene_break',)      - Scene break (--- before ## heading)
        ('paragraph', text)   - Prose paragraph

    Scene breaks are only emitted BETWEEN scenes (before ## headings),
    not for internal --- breaks within a scene.
    """
    if metadata_markers is None:
        metadata_markers = FICTION_METADATA_MARKERS
    if bullet_keywords is None:
        bullet_keywords = FICTION_BULLET_KEYWORDS

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    elements = []
    in_metadata = False
    seen_headings = set()

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip YAML frontmatter
        if i == 0 and stripped == '---':
            i += 1
            while i < len(lines) and lines[i].strip() != '---':
                i += 1
            i += 1
            continue

        # Skip chapter-level heading (# CHAPTER X)
        if stripped.startswith('# ') and 'CHAPTER' in stripped.upper():
            i += 1
            continue

        # Check for metadata sections
        if is_metadata_line(stripped, metadata_markers):
            in_metadata = True
            i += 1
            continue

        # Handle horizontal rules (---)
        if stripped == '---':
            if in_metadata:
                in_metadata = False
                i += 1
                continue

            # Look ahead: does this --- precede metadata?
            j = i + 1
            while j < len(lines) and lines[j].strip() == '':
                j += 1
            if j < len(lines) and is_metadata_line(lines[j].strip(), metadata_markers):
                in_metadata = True
                i += 1
                continue

            # Does this --- precede a ## heading? = scene break
            if j < len(lines) and lines[j].strip().startswith('## '):
                elements.append(('scene_break',))
                i += 1
                continue

            # Internal break within a scene — skip
            i += 1
            continue

        if in_metadata:
            if stripped == '':
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    j += 1
                if j < len(lines):
                    next_stripped = lines[j].strip()
                    if next_stripped.startswith('## ') and not is_metadata_line(next_stripped, metadata_markers):
                        in_metadata = False
                    elif next_stripped == '---':
                        pass
                    elif (not is_metadata_line(next_stripped, metadata_markers) and
                          not next_stripped.startswith('-') and
                          not next_stripped.startswith('|') and
                          not next_stripped.startswith('*')):
                        in_metadata = False
            i += 1
            continue

        if stripped == '':
            i += 1
            continue

        # Skip markdown tables
        if stripped.startswith('|') and '|' in stripped[1:]:
            i += 1
            continue

        # Skip metadata bullet points
        if stripped.startswith('- ') and any(kw in stripped for kw in bullet_keywords):
            i += 1
            continue

        # Scene heading (## Title)
        if stripped.startswith('## '):
            title = stripped[3:].strip()
            title = clean_scene_title(title)
            if title in seen_headings:
                i += 1
                continue
            seen_headings.add(title)
            elements.append(('heading', title))
            i += 1
            continue

        # Regular paragraph
        elements.append(('paragraph', stripped))
        i += 1

    # Post-process: ensure scene_break before every heading except the first
    return post_process_scene_breaks(elements)


def extract_nonfiction_prose(filepath: str, chapters_config: list = None) -> list:
    """
    Extract prose content from a nonfiction manuscript markdown file.

    Nonfiction files may be a single .md with # headings as chapter boundaries,
    or separate .md files per chapter.

    Returns list of tuples:
        ('chapter', name)       - Chapter boundary (# heading)
        ('subheading', text)    - Subheading (### heading -> H2 in output)
        ('epigraph', text)      - Block quote line (> text)
        ('paragraph', text)     - Prose paragraph
        ('citation', text, ref) - Paragraph with inline citation markers
        ('scene_break',)        - Section break (--- or ***)

    Args:
        filepath: Path to the .md file
        chapters_config: Optional list of chapter dicts with 'section' keys
                        to filter specific sections from a single file
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    elements = []
    in_metadata = False

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip YAML frontmatter
        if i == 0 and stripped == '---':
            i += 1
            while i < len(lines) and lines[i].strip() != '---':
                i += 1
            i += 1
            continue

        # Check for metadata sections
        if is_metadata_line(stripped, NONFICTION_METADATA_MARKERS):
            in_metadata = True
            i += 1
            continue

        # Handle horizontal rules (---)
        if stripped == '---' or stripped == '***':
            if in_metadata:
                in_metadata = False
                i += 1
                continue
            elements.append(('scene_break',))
            i += 1
            continue

        if in_metadata:
            if stripped == '':
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    j += 1
                if j < len(lines):
                    next_stripped = lines[j].strip()
                    if next_stripped.startswith('# ') and not is_metadata_line(next_stripped, NONFICTION_METADATA_MARKERS):
                        in_metadata = False
                    elif not is_metadata_line(next_stripped, NONFICTION_METADATA_MARKERS):
                        in_metadata = False
            i += 1
            continue

        if stripped == '':
            i += 1
            continue

        # Chapter heading (# HEADING)
        if stripped.startswith('# ') and not stripped.startswith('## '):
            title = stripped[2:].strip()
            elements.append(('chapter', title))
            i += 1
            continue

        # Subheading (### HEADING -> H2 in output)
        if stripped.startswith('### '):
            title = stripped[4:].strip()
            elements.append(('subheading', title))
            i += 1
            continue

        # Skip ## headings (section-level, handled differently in nonfiction)
        if stripped.startswith('## '):
            title = stripped[3:].strip()
            elements.append(('subheading', title))
            i += 1
            continue

        # Block quotes / epigraphs
        if stripped.startswith('> '):
            text = stripped[2:].strip()
            elements.append(('epigraph', text))
            i += 1
            continue

        # Skip markdown tables
        if stripped.startswith('|') and '|' in stripped[1:]:
            i += 1
            continue

        # Bullet list items (strip '- ' prefix, preserve formatting)
        if stripped.startswith('- '):
            item_text = stripped[2:].strip()
            if item_text:
                elements.append(('list_item', item_text))
            i += 1
            continue

        # Regular paragraph — check for citation markers
        citation_pattern = r'\[@[\w.]+(?:,\s*[^\]]+)?\]'
        citations = re.findall(citation_pattern, stripped)
        if citations:
            elements.append(('citation', stripped, citations))
        else:
            elements.append(('paragraph', stripped))

        i += 1

    return elements


def post_process_scene_breaks(elements: list) -> list:
    """Ensure scene_break exists before every heading except the first."""
    fixed = []
    first_heading_seen = False
    for elem in elements:
        if elem[0] == 'heading':
            if first_heading_seen:
                if not fixed or fixed[-1][0] != 'scene_break':
                    fixed.append(('scene_break',))
            first_heading_seen = True
        fixed.append(elem)
    return fixed


def add_formatted_text(paragraph, text: str):
    """Parse markdown inline formatting (*italic*, **bold**, ***bold italic***) and add Word runs."""
    pattern = r'(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_)'
    pos = 0
    for match in re.finditer(pattern, text):
        if match.start() > pos:
            paragraph.add_run(text[pos:match.start()])
        if match.group(2):  # ***bold italic***
            run = paragraph.add_run(match.group(2))
            run.bold = True
            run.italic = True
        elif match.group(3):  # **bold**
            run = paragraph.add_run(match.group(3))
            run.bold = True
        elif match.group(4):  # *italic*
            run = paragraph.add_run(match.group(4))
            run.italic = True
        elif match.group(5):  # _italic_
            run = paragraph.add_run(match.group(5))
            run.italic = True
        pos = match.end()
    if pos < len(text):
        paragraph.add_run(text[pos:])


def strip_citations_for_text(text: str) -> str:
    """Remove [@Author.Work, ...] citation markers from text for display."""
    return re.sub(r'\s*\[@[\w.]+(?:,\s*[^\]]+)?\]', '', text)


def extract_citation_refs(text: str) -> list:
    """Extract citation references from text as list of (author, work, locator) tuples."""
    pattern = r'\[@([\w]+)\.([\w]+)(?:,\s*(.+?))?\]'
    return re.findall(pattern, text)


def generate_indesign_config(config: dict, output_dir: str):
    """Generate indesign_config.json for JSX scripts to consume."""
    import json

    trim = config.get('trim', {})
    margins = trim.get('margins', {})
    fonts = config.get('fonts', {})

    # Convert inches to points
    width_pt = trim.get('width', 5.5) * 72
    height_pt = trim.get('height', 8.5) * 72
    margin_top_pt = margins.get('top', 0.6) * 72
    margin_bottom_pt = margins.get('bottom', 0.7) * 72
    margin_inside_pt = margins.get('inside', 0.75) * 72
    margin_outside_pt = margins.get('outside', 0.5) * 72

    jsx_config = {
        'title': config.get('title', ''),
        'subtitle': config.get('subtitle', ''),
        'author': config.get('author', ''),
        'website': config.get('website', ''),
        'isbn': config.get('isbn', '[ISBN-13 NUMBER]'),
        'dedication': config.get('dedication', ''),
        'structure': config.get('structure', 'act-chapter-scene'),
        'scene_titles_in_print': config.get('scene_titles_in_print', False),

        'trim': {
            'width_in': trim.get('width', 5.5),
            'height_in': trim.get('height', 8.5),
            'width_pt': width_pt,
            'height_pt': height_pt,
        },
        'margins': {
            'top_in': margins.get('top', 0.6),
            'bottom_in': margins.get('bottom', 0.7),
            'inside_in': margins.get('inside', 0.75),
            'outside_in': margins.get('outside', 0.5),
            'top_pt': margin_top_pt,
            'bottom_pt': margin_bottom_pt,
            'inside_pt': margin_inside_pt,
            'outside_pt': margin_outside_pt,
        },
        'fonts': {
            'body': fonts.get('body', 'Garamond'),
            'chapter_number': fonts.get('chapter_number', 'Cinzel Decorative'),
            'chapter_title': fonts.get('chapter_title', 'Cinzel'),
            'drop_cap': fonts.get('drop_cap', fonts.get('chapter_number', 'Cinzel Decorative')),
            'quotes': fonts.get('quotes', 'Goldenbook'),
            'headers': fonts.get('headers', 'Cinzel'),
            'folios': fonts.get('folios', 'Goldenbook'),
        },
        'scene_break_ornament': config.get('scene_break_ornament', '').replace('\\', '/'),
        'scene_break_ornament_width': config.get('scene_break_ornament_width', 1.0),
        'paths': {
            'output_dir': output_dir.replace('\\', '/'),
            'template_path': config.get('template_path', '').replace('\\', '/'),
            'docx_filename': config.get('title', 'manuscript') + ' - InDesign Import.docx',
            'indd_filename': config.get('title', 'manuscript').replace(' ', '_') + '_Interior.indd',
        },
    }

    config_path = Path(output_dir) / 'indesign_config.json'
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(jsx_config, f, indent=2, ensure_ascii=False)

    return str(config_path)
