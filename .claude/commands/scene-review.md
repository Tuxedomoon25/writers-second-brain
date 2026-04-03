---
name: scene-review
description: Quality check any passage across 4 dimensions + humanizer scan
---

# Scene Review

Review and score a passage of prose across 4 quality dimensions, then run a humanizer scan for AI-typical patterns.

## Input

The user will provide either:
- A file path to a scene in their vault (e.g., `1. Manuscript/Act 1/Chapter 1.md`)
- A pasted passage of text
- A reference like "the scene I just wrote" (check the most recent file in `experiences/scenes/`)

## Process

### Step 1: Load Context

1. Read the user's CLAUDE.md for their writing rules and quality thresholds
2. Read the relevant character profile(s) from `4. Characters/` if the POV character is identifiable
3. Read `memory/voice/style-rules.md` for their commandments
4. Read the scene/passage to review

### Step 2: Evaluate 4 Dimensions

Score each dimension on a 1-10 scale against the user's configured thresholds.

**Dimension 1: Show Don't Tell**
- Are emotions shown through physical action and sensory detail, not named?
- Are there instances of "felt", "realized", "knew" that could be shown instead?
- Does the passage trust the reader to infer meaning?

**Dimension 2: Character Voice Consistency**
- Does the POV character's internal voice match their profile?
- Does their dialogue match their speech patterns?
- Do they notice what their profession/obsession would make them notice?
- Is the emotional signature consistent (how they physically express emotion)?

**Dimension 3: Pacing & Tension**
- Does the scene have a clear rhythm (not monotonous)?
- Is there escalation or movement (emotional, physical, or informational)?
- Does paragraph length vary to create rhythm?
- Does the scene end with forward momentum?

**Dimension 4: Prose Style**
- Does the passage follow the user's personal commandments?
- Check each rule explicitly (tense, adverbs, metaphor density, etc.)
- Flag specific violations with line references

### Step 3: Prose Mechanics Scan

Perform a quantitative analysis of the passage. Count precisely — do not estimate.

**Adverb count**: Count every word ending in -ly. Exclude these non-adverbs: only, early, family, lonely, holy, likely, reply, apply, multiply, supply, fly, rely, ally, belly, bully, folly, fully, gully, hilly, jelly, jolly, rally, silly, tally, ugly, Italy, July. Target: **0** (Rule 4: Verb Supremacy).

**Passive voice count**: Count instances of (was/were/is/are/been/being) followed by a past participle. Target: **0**. Flag each with an active rewrite suggestion.

**"Felt/realized/knew" count**: Count instances of named-emotion verbs: felt, realized, knew, noticed, understood, recognized, sensed, thought, believed, decided, wondered. Target: **0** (Rule 3: Show Don't Tell). Flag each with a somatic alternative.

**Metaphor density**: For each paragraph, count distinct metaphors or similes. Flag any paragraph with >1 metaphor (Rule 5: Metaphor Limit).

**Negative constructions**: Count "wasn't", "didn't", "couldn't", "wouldn't", "shouldn't", "isn't", "aren't", "don't", "won't", "no", "not", "never", "nothing", "nowhere", "none". Exclude passages involving Mist, Weaver, or existential horror where absence IS the point (Rule 6 exception). Flag each with a positive rewrite.

**Sentence length distribution**: Count words per sentence across the full passage. Calculate:
- Total sentence count
- Average sentence length (words)
- Standard deviation of sentence lengths (higher = more rhythmic variety)
- Count of HARD sentences (>25 words)
- Count of VERY HARD sentences (>35 words)
- Flag if std dev < 3.0 as MONOTONOUS (Rule 10: Paragraph Wave)

**Readability**: Calculate Flesch-Kincaid grade level. Formula: `0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59`. Report as informational only (fiction readability varies by intent).

**Present as a table in the review output:**

```markdown
### Prose Mechanics

| Metric | Count | Target | Status |
|--------|-------|--------|--------|
| -ly Adverbs | [N] | 0 | [PASS/FAIL] |
| Passive Voice | [N] | 0 | [PASS/FAIL] |
| "Felt/realized/knew" | [N] | 0 | [PASS/FAIL] |
| Metaphor overload (paragraphs) | [N] | 0 | [PASS/FAIL] |
| Negative constructions | [N] | Report | — |
| Avg sentence length | [N] words | — | — |
| Sentence rhythm (std dev) | [N] | >3.0 | [PASS/MONOTONOUS] |
| Hard sentences (>25 words) | [N] | Report | — |
| Very hard sentences (>35 words) | [N] | Report | — |
| Readability (Flesch-Kincaid) | [score] | Report | Grade [X] |

**Flagged items:**
- [For each adverb: quote the sentence, bold the adverb, suggest a stronger verb]
- [For each passive: quote, suggest active rewrite]
- [For each felt/realized/knew: quote, suggest somatic alternative]
- [For each metaphor overload: quote the paragraph, identify the competing metaphors]
- [For each negative: quote, suggest positive assertion]
```

### Step 4: Humanizer Scan

Check for AI-typical patterns:
- AI vocabulary ("additionally", "testament", "landscape", "delve", "tapestry", "pivotal")
- Significance inflation ("a profound moment", "deeply meaningful")
- Synonym cycling (restating the same idea in different words)
- Excessive hedging ("seemed to", "appeared to", "could potentially")
- Mechanical rule-of-three structures
- Generic descriptions ("the sun dipped below the horizon", "a chill ran down her spine")
- Dialogue tag variety abuse ("exclaimed", "mused", "retorted" instead of "said")

For Dutch: also check for Dutch AI vocabulary ("bovendien", "daarnaast", "het is belangrijk op te merken")

### Step 5: Present Results

```markdown
## Scene Review: [Scene Title or Description]

### Scores

| Dimension | Score | Threshold | Status |
|-----------|-------|-----------|--------|
| Show Don't Tell | [X]/10 | [threshold] | [PASS/FAIL] |
| Character Voice | [X]/10 | [threshold] | [PASS/FAIL] |
| Pacing & Tension | [X]/10 | [threshold] | [PASS/FAIL] |
| Prose Style | [X]/10 | [threshold] | [PASS/FAIL] |

### Overall: [PASS/NEEDS WORK]

### Highlights (What Works)
- [2-3 specific things that are strong, with quotes]

### Issues Found
[For each issue:]
- **[Dimension]**: [Description of issue]
  - Line: "[quote from passage]"
  - Suggestion: [How to fix]

### Prose Mechanics

| Metric | Count | Target | Status |
|--------|-------|--------|--------|
| -ly Adverbs | [N] | 0 | [PASS/FAIL] |
| Passive Voice | [N] | 0 | [PASS/FAIL] |
| "Felt/realized/knew" | [N] | 0 | [PASS/FAIL] |
| Metaphor overload (paragraphs) | [N] | 0 | [PASS/FAIL] |
| Negative constructions | [N] | Report | — |
| Avg sentence length | [N] words | — | — |
| Sentence rhythm (std dev) | [N] | >3.0 | [PASS/MONOTONOUS] |
| Hard sentences (>25 words) | [N] | Report | — |
| Very hard sentences (>35 words) | [N] | Report | — |
| Readability (Flesch-Kincaid) | [score] | Report | Grade [X] |

**Flagged items:**
- [Line/quote for each adverb, passive, felt/realized/knew, with suggestion]

### Humanizer Flags
[For each AI-typical pattern found:]
- **[Pattern type]**: "[flagged text]" → Suggestion: [alternative]

### Recommendations
[1-3 actionable next steps, prioritized by impact]
```

### Step 6: Save to Experiences

If reviewing a scene from the vault, save the review to:
`experiences/scenes/[act-chapter-scene]/quality-review.md`

Update `brain-health/quality-metrics.md` with the scores.
