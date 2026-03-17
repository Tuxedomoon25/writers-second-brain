---
name: humanize
description: Remove AI-typical writing patterns from any text
---

# Humanize — Remove AI Writing Patterns

Analyze and rewrite text to remove patterns that make prose sound AI-generated. Based on Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup), adapted for fiction.

## Input

The user provides a passage of text — either pasted directly or as a file path.

## Process

### Pass 1: Detection

Scan the text for these fiction-relevant AI patterns:

**AI Vocabulary (flag and replace):**
- additionally, furthermore, moreover, notably
- testament, tapestry, landscape, delve, embark, foster
- pivotal, profound, nuanced, multifaceted, intricate
- resonate, underscore, encompass, facilitate
- in terms of, in the realm of, it's worth noting that

**Significance Inflation (tone down):**
- "a pivotal moment" → just describe the moment
- "deeply meaningful" → show the meaning through action
- "a testament to" → remove or rephrase concretely

**Synonym Cycling (pick one and commit):**
- Restating the same idea in 2-3 different phrasings within a paragraph
- Choose the strongest version, cut the rest

**Hedging in Narrative Voice (commit to the POV):**
- "seemed to" → remove (commit: "She smiled" not "She seemed to smile")
- "appeared to" → remove
- "could potentially" → remove "potentially"
- Exception: hedging is valid in dialogue or with deliberate unreliable narrators

**Mechanical Rule of Three (break the pattern):**
- "X, Y, and Z" in artificial triads where items aren't genuinely distinct
- Break into varied structures: pair + single, list of four, etc.

**Generic Descriptions (make specific):**
- "The sun dipped below the horizon" → specific: what color? what did it illuminate?
- "A chill ran down her spine" → specific: what physical sensation, exactly?
- "His heart raced" → specific: what did the adrenaline actually feel like in his body?

**Dialogue Tag Abuse (use "said"):**
- "exclaimed", "mused", "retorted", "quipped", "declared", "proclaimed"
- Replace with "said" (80% of the time) or remove tag entirely (action beat instead)

**Emotional Labeling (show, don't name):**
- "He felt sad" → show sadness through action
- "She was angry" → show anger through physical tells
- "They were happy" → show happiness through behavior

**Purple Prose Inflation (trim):**
- Every noun with 2+ adjectives
- Excessive metaphor stacking
- Description that doesn't advance character or plot

**Copula Avoidance (let "was" be):**
- "serves as" → "is" or "was"
- "features" → "has" or "had"
- "boasts" → just describe it

**Dutch-specific patterns (if text is in Dutch):**
- "bovendien", "daarnaast", "het is belangrijk op te merken"
- "in het kader van", "met betrekking tot"
- "zou kunnen", "het lijkt erop dat", "mogelijkerwijs"
- "fungeert als", "kenmerkt zich door"

### Pass 2: Rewrite

Rewrite flagged passages preserving:
- The writer's established voice (read CLAUDE.md rules)
- The writer's em dash preference (if enabled in rules, don't flag em dashes)
- Intentional literary devices (deliberate tricolon, unreliable narrator hedging)
- Character-specific dialogue patterns

### Pass 3: Audit

Final scan of the rewritten text to catch any remaining AI-isms that slipped through.

## Output

```markdown
## Humanizer Report

### Patterns Found: [count]

| Pattern | Count | Severity |
|---------|-------|----------|
| [pattern type] | [N] | [High/Medium/Low] |

### Changes Made

[For each change:]
- **[Pattern]**: "[original text]" → "[rewritten text]"

### Humanized Text

[Full rewritten passage]

### Notes
[Any patterns that were intentionally preserved and why]
```
