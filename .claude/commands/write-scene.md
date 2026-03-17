---
name: write-scene
description: Draft a scene with automatic quality gates, refinement, and humanizer — the full writing pipeline
---

# Write Scene — Your Writing Pipeline

Draft a scene using your personal rules and quality gates, then refine until it meets your standards.

## Pipeline

```
1. LOAD    → Read scene context (outline, characters, setting, rules)
2. DRAFT   → Generate prose following your commandments
3. CHECK   → Run 4 quality checks (show/tell, voice, pacing, style)
4. REFINE  → Fix violations, re-check (up to 5 iterations)
5. HUMANIZE → Remove AI-typical patterns
6. SAVE    → Write to manuscript vault + save to experiences
```

## Context Loading

Before drafting, read the following files:

1. **CLAUDE.md** — Writer's rules, voice, quality thresholds, language
2. **config.yaml** — If exists: vault path, character voice patterns, style settings
3. **Scene context** — From the user's input or vault:
   - Scene card from `2. Outlines/Scene Cards/`
   - Deep-dive beats from `2. Outlines/Deep Dive Beats/`
   - POV character profile from `4. Characters/`
   - Setting from `5. Settings/`
   - Tone guide from `2. Outlines/Tone of voice/`
4. **memory/voice/style-rules.md** — The writer's commandments
5. **memory/voice/voice-analysis.md** — Voice rhythm and pattern data
6. **memory/patterns/** — HIGH confidence patterns to apply

## Invocation

- `/write-scene` — Interactive: asks which scene to write
- `/write-scene Act1-Ch1-Scene1` — Specific scene by reference
- `/write-scene --draft-only` — Skip quality checks (not recommended)
- `/write-scene --continue` — Continue from last session
- `/write-scene --dry-run` — Preview what will be loaded without writing

## Phase 1: LOAD — Gather Context

### Step 1: Identify the Scene

If the user didn't specify a scene, ask:

> "Which scene are we writing? You can reference it by:
> - Act/Chapter/Scene number (e.g., 'Act 1, Chapter 2, Scene 3')
> - Scene title from your outline
> - 'Next' — I'll find the next unwritten scene in your task list"

### Step 2: Load Scene Architecture

Read the scene card and extract:
- **POV Character** — Who are we inside?
- **Goal** — What does the POV want in this scene?
- **Setup** — Where do we start?
- **Crossroads** — The conflict or choice
- **Outcome** — What happens?
- **The New Question** — The hook that pulls the reader forward

Read the deep-dive beats if available — these are the beat-by-beat sequence to follow.

### Step 3: Load Character Voice

Read the POV character's profile from `4. Characters/`. Extract:
- Internal voice pattern
- Dialogue pattern
- Awareness filter (what they notice)
- Emotional signature (how they show emotion physically)
- Coping mechanism

For other characters in the scene, load their dialogue patterns too.

### Step 4: Load Setting

Read the setting file for this scene's location. Extract sensory details.

### Step 5: Load Tone

Check the scene-by-scene tone guide for this specific scene's:
- Track style (Legato/Staccato/Crescendo)
- Emotional key
- Rhythm description

### Step 6: Present the Brief

Before drafting, show the writer what was loaded:

```markdown
## Scene Brief: [Scene Title]

**POV:** [Character] | **Location:** [Setting] | **Tone:** [Track Style]
**Goal:** [Scene goal]
**Crossroads:** [Core conflict]

**Character voice loaded:** [Internal pattern summary]
**Rules active:** [List of commandments that apply]
**Quality thresholds:** Show/Tell [X], Voice [X], Pacing [X], Style [X]

**Beats to follow:** [Number of beats from deep-dive]

Ready to draft?
```

Wait for the writer's approval before drafting.

---

## Phase 2: DRAFT — Generate the Scene

### Drafting Instructions

Generate prose for this scene following ALL of these constraints:

**From the writer's commandments (CLAUDE.md / style-rules.md):**
- Apply every rule: tense, POV, adverb policy, metaphor limit, rhythm, show-don't-tell, etc.
- These are NON-NEGOTIABLE — violations will be caught by quality checks

**From the character profile:**
- Internal voice matches the POV character's thinking pattern
- Dialogue matches each character's speech pattern
- The POV character notices what their awareness filter would catch
- Emotion shown through their specific emotional signature (somatic, physical)

**From the scene card:**
- Follow the Goal → Setup → Crossroads → Outcome → New Question arc
- If deep-dive beats exist, follow them in order

**From the tone guide:**
- Match the track style (paragraph length, rhythm, intensity)
- Match the emotional key

**Target:** ~1,500 words (±10%). Adjust based on beat count.

**Language:** Write in the language specified in CLAUDE.md (English or Dutch). If Dutch, apply Schrijfwijzer fiction rules automatically.

### Output

Present the draft with a word count. Ask:

> "Here's the draft ([word count] words). Want me to run quality checks, or would you prefer to review it first?"

If `--draft-only` flag, stop here.

---

## Phase 3: CHECK — Quality Gates

Run 4 quality checks sequentially. For each, evaluate the draft against the scoring rubric.

### Check 1: Show Don't Tell

Evaluate whether emotions are shown through physical action and sensory detail, not named. Score 1-10.

**Violations to flag:**
- Named emotions: "felt [emotion]", "was [emotion]", "seemed [emotion]"
- Abstract feelings: "a sense of", "experienced"
- Direct statements: "He feared", "She loved"

**Correct methods:**
- Somatic truth (emotions as biology): copper taste, cold knot, jaw tight
- Object/action shows: checking watch, gripping tight, avoiding eye contact
- Environmental reflection: oppressive atmosphere, closing spaces

### Check 2: Character Voice Consistency

Evaluate across 4 dimensions:
1. **Internal voice** — Does the thinking match the character profile?
2. **Dialogue** — Does speech match the speech pattern?
3. **Awareness** — Does the character notice what they should?
4. **Emotional signature** — Does emotion show through THEIR specific physical tells?

### Check 3: Pacing & Tension

Evaluate:
- Paragraph length variation (not monotonous)
- Escalation or movement (emotional, physical, informational)
- Scene rhythm matches the tone guide (Legato/Staccato/Crescendo)
- Forward momentum — does the scene end pulling the reader forward?

### Check 4: Prose Style

Check each of the writer's commandments explicitly:
- Tense compliance
- Adverb count
- Metaphor density
- Dialogue tag usage
- Formatting conventions
- Any other personal rules

### Present Results

```markdown
## Quality Check Results

| Dimension | Score | Threshold | Status |
|-----------|-------|-----------|--------|
| Show Don't Tell | [X]/10 | [T] | [PASS/FAIL] |
| Character Voice | [X]/10 | [T] | [PASS/FAIL] |
| Pacing & Tension | [X]/10 | [T] | [PASS/FAIL] |
| Prose Style | [X]/10 | [T] | [PASS/FAIL] |

### Issues Found
[List specific violations with quotes and fix suggestions]
```

If ALL pass → proceed to Phase 5 (Humanize)
If ANY fail → proceed to Phase 4 (Refine)

---

## Phase 4: REFINE — Fix and Re-check

### Iteration Loop (max 5)

For each failing dimension:
1. List specific violations with line references
2. Rewrite the affected passages, fixing violations while preserving voice
3. Re-run only the failing checks
4. If still failing after 5 iterations:

> "We've reached 5 refinement iterations. The scene is at [scores]. Here are the remaining issues — would you like to:
> - Accept as-is and move to humanizing
> - Manually edit and re-run quality checks
> - Start a fresh draft with adjusted approach"

---

## Phase 5: HUMANIZE — Remove AI Patterns

Run the fiction humanizer on the polished draft. Check for:
- AI vocabulary (additionally, testament, landscape, delve, tapestry)
- Significance inflation ("a pivotal moment", "deeply meaningful")
- Synonym cycling
- Hedging in narrative voice ("seemed to", "appeared to")
- Mechanical rule-of-three
- Generic descriptions (cliche weather, spine-chilling)
- Dialogue tag abuse (exclaimed, mused, retorted → use "said")
- Emotional labeling that slipped through quality checks

**Respect writer's rules:** If CLAUDE.md enables em dashes, don't flag them. If the writer's rules allow specific patterns, don't flag them.

For Dutch: also check Dutch AI vocabulary (bovendien, daarnaast, het is belangrijk op te merken).

Rewrite flagged passages, preserving voice. Present changes:

> "Humanizer caught [N] patterns. Here's what I changed: [list]. The scene is ready."

---

## Phase 6: SAVE — Persist to Vault and Experiences

### Step 1: Save to Manuscript

Write the final scene to the manuscript vault:
- Path: `[vault]/1. Manuscript/Act [N]/Chapter [N].md`
- Append to existing chapter file or create new one
- Use the scene header format from config

### Step 2: Save to Experiences

Create the experience record:
```
experiences/scenes/act[N]-ch[N]-scene[N]/
├── draft.md           ← The final polished scene
├── quality-review.md  ← Quality scores and findings
└── learnings.md       ← Patterns worth remembering
```

### Step 3: Update Brain Health

Add entry to `brain-health/growth-log.md`:
```
### [Date] - Scene Written: [Title]
- Scores: Show/Tell [X], Voice [X], Pacing [X], Style [X]
- Iterations: [N]
- Humanizer flags: [N]
- Word count: [N]
```

Update `brain-health/quality-metrics.md` with the new scores.

### Step 4: Update Task List

Mark the scene as complete in `0. Pre-write task list/Pre-write task list.md`.

### Step 5: Extract Patterns (Optional)

If the scene scored 8+ on any dimension, ask:

> "This scene scored [X] on [dimension]. Want me to extract the technique as a pattern for future scenes?"

If yes, add to the relevant `memory/patterns/` file with LOW confidence.

### Step 6: Confirm

> "Scene saved to [path]. [Word count] words.
>
> Quality: Show/Tell [X] | Voice [X] | Pacing [X] | Style [X]
> Humanizer: [N] patterns caught and fixed
>
> Next scene: [title from outline] — run `/write-scene` when ready."

---

## Edge Cases

### No scene card exists
Ask the writer to describe the scene informally: "What happens? Who's there? What's the emotional core?" Generate a temporary scene card, then draft.

### No character profile loaded
Warn: "I don't have a character profile for [name]. I'll draft using your general voice rules, but character-specific voice and emotional signature won't be enforced. Consider running `/character-forge [name]` first."

### Writer provides a specific passage to rewrite
Skip Phase 2 (Draft). Load the passage as input, run Phases 3-6 on it.

### Writer wants to continue a scene from a previous session
Read the most recent draft from `experiences/scenes/`, present it, and ask where to continue from.

## Input

$ARGUMENTS
