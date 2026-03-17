---
name: setup
description: Guided onboarding — discover your writing voice, rules, and style (30-45 min)
---

# Welcome to The Writer's Second Brain

This guided setup will discover your unique writing voice and configure your entire system. Take your time — this is the foundation everything builds on.

**What happens:** I'll interview you across 5 phases. At the end, I'll generate your personalized configuration files automatically.

**Time:** 30-45 minutes (worth every minute — you only do this once)

---

## Phase 1: BASICS (2 min)

Let's start simple.

### Questions

1. **What's your name?**
   > [Wait for response]

2. **What's the working title of your novel or story?**
   > Don't worry if it's not final. Working titles change.
   > [Wait for response]

3. **In one sentence, what's your story about?**
   > This is your logline — the elevator pitch. Example: "A grieving engineer discovers that the silence spreading across Ghent is not metaphorical but literal, and must choose between fixing the world or finally hearing himself."
   > [Wait for response]

---

## Phase 2: GENRE DETECTION (3 min)

This determines your vault structure and available tools.

### Questions

4. **What genre best describes your story?**
   > Choose one:
   > - **Fantasy / Sci-Fi / Mythology** — You'll get an extended vault with World Bible, magic systems, cultures, geography, and history
   > - **Literary Fiction** — Character-driven, contemporary or historical
   > - **Thriller / Mystery / Crime** — Plot-driven, suspense-focused
   > - **Romance** — Relationship-driven with emotional arc
   > - **Historical Fiction** — Set in a specific historical period
   > - **Children's Book** — Simplified templates, age-appropriate language
   > - **Creative Nonfiction / Memoir** — True stories told with narrative craft
   > - **Other** — Describe your genre
   > [Wait for response]

### Genre Branching Logic

**If Fantasy/Sci-Fi/Mythology:**
- Copy `vault-template-fantasy/` to the user's Obsidian location (includes World Bible sections)
- Inform the user: "Great choice. Before we write scenes, we'll build your world first — like Tolkien spent years on Middle-earth before writing The Lord of the Rings. After this setup, your first command will be `/story-forge` in world-building mode."
- Set `config.yaml` genre to `fantasy`

**If any other genre:**
- Copy `vault-template/` to the user's Obsidian location
- Set `config.yaml` genre to the selected genre

**If Children's Book:**
- Copy `vault-template/` but note that simplified character templates and age-appropriate language rules will apply
- Set `config.yaml` genre to `children`

---

## Phase 3: LANGUAGE CHOICE (2 min)

### Questions

5. **What language will you write in?**
   > - **English** — Quality checks use configurable English prose rules
   > - **Dutch (Nederlands)** — Quality checks include Schrijfwijzer fiction rules (verleden tijd, geen ontkrachters, actieve stem)
   > [Wait for response]

**If Dutch:**

6. **Vlaams or Nederlands?**
   > This affects vocabulary, register, and dialogue authenticity.
   > - **Vlaams** — Belgian Dutch (e.g., Elsschot, Lampo, Claus, Hertmans)
   > - **Nederlands** — Netherlands Dutch (e.g., Nooteboom, Haasse, Mulisch)
   > [Wait for response]

### Language Configuration

**If English:**
- Load English quality check prompts
- Set `config.yaml` language to `en`

**If Dutch:**
- Load Dutch quality check prompts (verleden-tijd, ontkrachter-scan, show-dont-tell-nl, voice-consistency-nl)
- Load `reference/dutch/schrijfwijzer-fiction.md` as supplementary rules
- Load `reference/dutch/dutch-dialogue-guide.md` for dialogue writing
- Set `config.yaml` language to `nl`, dialect to `flemish` or `dutch`
- Inform user: "Your prose will follow Schrijfwijzer fiction rules. Ontkrachters are forbidden in narrative voice but allowed in dialogue when character-appropriate."

---

## Phase 4: VOICE DISCOVERY (15-20 min)

This is the heart of the setup. Take your time.

### Round 1: Influences (3-4 min)

7. **Name 2-3 authors whose writing you admire. For each, what would you like to use from their style in your own writing?**
   > Example: "Hemingway — his restraint, the way he lets silence do the work. C.S. Lewis — how he makes the mythic feel intimate and warm."
   > For Dutch writers: "Elsschot — zijn droge, precieze ironie. Lampo — hoe hij het magische in het alledaagse weeft."
   > [Wait for response]

8. **What do you deliberately avoid? What kind of writing makes you cringe?**
   > Example: "Purple prose. Endless descriptions of weather. Characters who explain their feelings out loud."
   > [Wait for response]

### Round 2: Tense & POV (2-3 min)

9. **What tense will your story use?**
   > - **Simple past** (most common): "She walked to the window and stared."
   > - **Present tense**: "She walks to the window and stares."
   > - **Past perfect / frame narrative**: "She had walked to the window before she understood."
   > - **Unsure** — I'll help you decide with examples
   > [Wait for response]

10. **What point of view?**
    > - **Close third person** (most common): "She noticed the crack in the wall." — Deep POV, one character's perspective
    > - **First person**: "I noticed the crack in the wall." — Maximum intimacy
    > - **Omniscient third**: "She noticed the crack, though she couldn't know what waited behind it." — God's-eye view
    > - **Multiple POV**: Different characters narrate different chapters
    > - **Unsure** — I'll help you decide
    > [Wait for response]

### Round 3: The Rules Interview (5-7 min)

Now we build your personal writing rules — your "Commandments." These become the quality gates that enforce YOUR standards.

I'll present a framework with 10 slots. For each, I'll offer an example rule. You can adopt it, adapt it, or create your own. You don't need all 10 — quality is more important than quantity.

**For each rule you choose, I need:**
- The rule itself (one sentence)
- Why it matters to you
- A correct example (1-2 sentences of prose)
- A wrong example (the same moment written badly)

11. **Rule 1: Tense** — Already decided above. I'll formalize it.

12. **Rule 2: Show Don't Tell**
    > Example rule: "Never name an emotion. Show it through the body — clenched jaw, held breath, fingers pressing into a palm."
    > Do you want to adopt this, adapt it, or define your own version?
    > [Wait for response — continue for each rule slot]

13. **Rule 3: Verb Strength**
    > Example rule: "Zero tolerance for -ly adverbs. If you need an adverb, the verb is wrong."
    > Your version?
    > [Wait for response]

14. **Rule 4: Metaphor Discipline**
    > Example rule: "Maximum one metaphor per paragraph. Let it breathe."
    > Your version?
    > [Wait for response]

15. **Rule 5: Sentence Rhythm**
    > Example rule: "Vary paragraph length — long, medium, short. End scenes on short."
    > Your version?
    > [Wait for response]

16. **Rule 6-10: Your Choice**
    > Other areas to consider rules for:
    > - Dialogue tags (only "said"? or variety?)
    > - Description density (sparse or rich?)
    > - Sensory anchors (does every scene need a tactile object?)
    > - Formatting (em dashes, italics for thoughts, no ALL CAPS?)
    > - Positive vs. negative framing ("The room was silent" vs. "No sound came")
    >
    > Add as many as feel right. Skip what doesn't resonate.
    > [Wait for response — iterate until the user is satisfied]

### Round 4: Voice Synthesis (3-4 min)

17. **Share a passage you love — either your own writing or from one of your influences (200-300 words).**
    > This can be a paragraph, a scene opening, or a piece of dialogue. I'll analyze it to understand your natural rhythm, vocabulary register, metaphor domains, and sentence patterns.
    > [Wait for response]

**After receiving the passage, analyze it:**
- Sentence length distribution (short/medium/long ratio)
- Vocabulary register (formal, conversational, technical, poetic)
- Metaphor domains (what physical domains do they draw from?)
- Rhythm pattern (staccato, legato, mixed)
- Emotional mode (restrained, expressive, oscillating)

**Present the analysis:**
> "Based on this passage, here's what I see in your voice:
> - **Voice name suggestion**: [e.g., "The Quiet Surgeon" — precise, restrained, with sudden flashes of tenderness]
> - **Rhythm**: [e.g., "Mostly medium sentences with sharp short ones for impact"]
> - **Metaphor domains**: [e.g., "You draw from architecture and weather — structures and atmospheres"]
> - **Register**: [e.g., "Conversational but precise — you never waste a word"]
>
> Does this feel right? Would you adjust anything?"

18. [Wait for user confirmation or adjustments]

### Round 5: Quality Calibration (2-3 min)

19. **I'll show you three versions of the same scene moment at different quality levels. Tell me which one meets YOUR minimum bar for a first draft.**

**Show three versions:**

**Version A (6/10 — Adequate):**
> [Generate a short passage at quality level 6 — technically competent but flat, some telling, generic details]

**Version B (8/10 — Good):**
> [Generate the same moment at quality level 8 — strong showing, specific details, character voice present]

**Version C (10/10 — Excellent):**
> [Generate the same moment at quality level 10 — every sentence earns its place, voice is distinctive, sensory and emotional layers interweave]

**Generate these in the user's chosen language (English or Dutch).**

> "Which of these would you accept as a first draft that you'd then refine? A, B, or C?"
> [Wait for response]

**Map to thresholds:**
- If A: Set all thresholds to 6/10
- If B: Set show_dont_tell and character_voice to 8/10, pacing and style to 7/10
- If C: Set all thresholds to 9/10 (with warning: "These are very high thresholds. The system may require many refinement iterations. Consider starting at 8 and tightening later.")

---

## Phase 5: EXPORT — Generate Configuration Files

Based on all answers, generate the following files:

### File 1: Update CLAUDE.md

Update the CLAUDE.md in the project root with all answers:
- About Me section (name, novel, genre, language)
- My Writing Voice section (voice name, influences, one-sentence description)
- My Writing Rules (all commandments with rule/why/correct/wrong)
- Quality Thresholds (calibrated scores)
- Vault Path (where they put the Obsidian vault)
- Key Paths (manuscript, characters, outlines)

### File 2: Create/Update config.yaml

Create `.claude/skills/write-scene/config.yaml` based on the template at `.claude/skills/write-scene/templates/config-template.yaml`:
- Set vault path
- Set language and dialect
- Set quality thresholds from calibration
- Set character profiles (empty, ready for /character-forge)
- Set style rules (tense, adverbs tolerance, metaphor limit, etc.)

### File 3: Create memory/voice/style-rules.md

```markdown
# My Writing Rules

> Generated by /setup on [today's date]
> Source: Voice Discovery Interview

## The Commandments

[For each rule the user defined:]

### [Rule Number]: [Rule Name]
- **Rule**: [The rule]
- **Why**: [Why it matters]
- **Correct**: [Example]
- **Wrong**: [Counter-example]

[Repeat for all rules]
```

### File 4: Create memory/voice/influences.md

```markdown
# My Writing Influences

> Generated by /setup on [today's date]

## Authors I Admire

[For each influence:]

### [Author Name]
- **What I use**: [What they use from this author]
- **Key quality**: [One-word descriptor]

## What I Avoid
[The user's cringe list]
```

### File 5: Create memory/voice/voice-analysis.md

```markdown
# Voice Analysis

> Generated by /setup on [today's date]
> Based on analysis of user's sample passage

## Voice Profile

- **Voice Name**: [Suggested name, confirmed by user]
- **Rhythm**: [Pattern description]
- **Metaphor Domains**: [Physical domains they draw from]
- **Register**: [Vocabulary level]
- **Emotional Mode**: [Restraint level]

## Sentence Patterns
- **Average length**: [short/medium/long]
- **Short:Medium:Long ratio**: [approximate]
- **Signature move**: [What makes their rhythm distinctive]

## Sample Passage Analyzed
[The passage they provided]
```

### File 6: Update vault Tone of Voice

Update `[vault]/2. Outlines/Tone of voice/Master tone of voice.md` with their commandments in the "Ten Commandments" framework format.

### File 7: Update vault Styles

Update `[vault]/7. Notes/1. Styles.md` with their style guidelines.

### File 8: Initialize brain-health/growth-log.md

Add first entry:
```markdown
### [Today's Date] - Brain Initialized
- **Event**: /setup completed
- **Voice**: [Voice name] ([Language])
- **Genre**: [Genre]
- **Rules**: [Number] commandments defined
- **Thresholds**: Show/Tell [X], Voice [X], Pacing [X], Style [X]
- **Next milestone**: Create first character with /character-forge
```

---

## Setup Complete!

### What's Been Configured

| Component | Status |
|-----------|--------|
| CLAUDE.md | Updated with your writing DNA |
| config.yaml | Calibrated to your standards |
| Voice Profile | Your rules, influences, and analysis |
| Tone of Voice | Your commandments in the vault |
| Style Guidelines | Your preferences documented |
| Brain Health | Initialized and tracking |

### Your Writing System Status

```
Brain Health: INITIALIZED
├── Voice: [Voice Name] defined
├── Rules: [N] commandments active
├── Quality: [threshold] minimum
├── Language: [EN/NL]
├── Genre: [genre]
├── Characters: 0 (create with /character-forge)
├── Scenes: 0 (write with /write-scene)
└── Patterns: 0 (grow automatically)
```

### What's Next?

**If Fantasy/Sci-Fi:**
```
/story-forge    → Build your world and story structure first
```

**If any other genre:**
```
/character-forge [protagonist name]    → Create your first character
```

Then:
```
/story-forge              → Build your outline and beat sheet
/write-scene [scene]      → Write your first scene
```

---

**Setup time:** ~30-45 minutes
**Brain status:** Personalized and ready
**Your voice:** Defined, analyzed, and encoded
