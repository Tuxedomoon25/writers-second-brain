# The Writer's Second Brain™

**Your AI-powered fiction writing system — built on Claude Code + Obsidian.**

By [ContentArchitect.ai](https://contentarchitect.ai)

---

## What Is This?

The Writer's Second Brain is a complete fiction writing system that gives you:

- **Your own writing rules** encoded into AI — it writes in YOUR voice, not generic AI prose
- **Quality gates** that enforce YOUR standards automatically (show-don't-tell, character voice, pacing, prose style)
- **A growing knowledge base** — your writing patterns, best passages, and craft learnings compound over time
- **Character psychology tools** — build deep, psychologically complex characters with Enneagram-based voice design
- **Story architecture** — from concept to outline to beat sheet to scene cards
- **AI humanization** — a final quality gate that catches and removes AI-typical writing patterns

Works in **English** and **Dutch** (Schrijfwijzer-based fiction rules). Supports **all genres** including a dedicated **fantasy/mythology** mode with world-building tools.

---

## Quick Start (15 minutes)

### Step 1: Get Claude Code

If you don't have Claude Code yet, follow the setup guide in `quick-start/SETUP-GUIDE.md`.

### Step 2: Clone or Download

**Option A — Git (recommended):**

```bash
git clone https://github.com/Tuxedomoon25/writers-second-brain.git
cd writers-second-brain
```

**Option B — ZIP download:**

Download the ZIP from GitHub and extract it to a folder of your choice.

### Step 3: Run Setup

Open the project in VS Code with Claude Code, then run:

```
/setup
```

This starts a guided interview (30-45 minutes) that discovers your writing voice, style rules, and quality preferences. It generates all your personalized configuration files.

### Step 4: Start Writing

```
/story-forge       → Build your story concept, outline, and beat sheet
/character-forge    → Create deep character profiles with psychology and voice
/write-scene        → Draft a scene with automatic quality gates
/scene-review       → Review and score any passage
```

---

## The 4-Command Workflow

```
/story-forge [concept]  →  Concept → outline → beat sheet → scene cards
/character-forge [name] →  Psychology → voice → somatic design → profile
/write-scene [scene]    →  Draft → quality gates → refinement → polished scene
/scene-review [scene]   →  4-dimension quality assessment
```

Every scene you write feeds back into your brain:

```
Write → Review → Extract patterns → Patterns improve next scene
```

Your writing system gets smarter the more you use it.

---

## What's Inside

```
writers-second-brain/
├── .claude/commands/          ← Your writing commands (/setup, /write-scene, etc.)
├── .claude/skills/            ← AI pipelines (write-scene, humanizer)
├── vault-template/            ← Obsidian vault structure (standard fiction)
├── vault-template-fantasy/    ← Extended vault (with World Bible for fantasy)
├── memory/                    ← Your growing knowledge base
├── experiences/               ← Scene history and learnings
├── brain-health/              ← Writing growth metrics
├── reference/                 ← Bundled craft knowledge
└── demo/                      ← Example system (for inspiration, not copying)
```

---

## Features

### Genre Support

| Genre | What You Get |
|-------|-------------|
| Literary Fiction | Standard vault + full quality pipeline |
| Fantasy / Sci-Fi | Extended vault with World Bible, magic system, cultures, geography |
| Thriller / Mystery | Standard vault + pacing-focused quality checks |
| Romance | Standard vault + emotional arc tracking |
| Children's Book | Simplified templates + age-appropriate language rules |
| Historical Fiction | Standard vault + research organization |

### Language Support

| Language | Writing Rules | Quality Checks | Humanizer |
|----------|--------------|----------------|-----------|
| English | Configurable (your rules) | Show/tell, voice, pacing, style | Full 24-pattern detection |
| Dutch | Schrijfwijzer + Schrijf.be adapted for fiction | + Verleden tijd, ontkrachters | Dutch AI vocabulary patterns |

### Quality Pipeline

Every scene passes through:

```
Draft → 4 Quality Checks → Polish → Humanize → Final Output
```

1. **Show Don't Tell** — Emotions shown through action, not named
2. **Character Voice** — POV consistency across 4 dimensions
3. **Pacing & Tension** — Scene rhythm and emotional escalation
4. **Prose Style** — Adherence to YOUR personal rules
5. **Humanizer** — Removes AI-typical patterns (vocabulary, hedging, cliches)

---

## Commands Reference

| Command | Purpose | Duration |
|---------|---------|----------|
| `/setup` | Guided onboarding — discover your voice and configure everything | 30-45 min |
| `/story-forge` | Build story concept, outline, beat sheet, scene cards | 20-30 min |
| `/character-forge` | Deep character creation with psychology and voice design | 15-20 min |
| `/write-scene` | Draft a scene with full quality pipeline | 5-10 min |
| `/scene-review` | Quality check any passage | 2-3 min |
| `/humanize` | Remove AI-typical patterns from any text | 1-2 min |
| `/recall` | Search your writing memory for patterns and examples | 10 sec |
| `/grow` | View your writing growth metrics | 5 sec |

---

## Philosophy

> "You are not a prompt engineer. You are a writer who happens to have an AI collaborator."

This system is built on three principles:

1. **Your voice, your rules.** The AI writes in YOUR style because YOU defined the rules. The `/setup` interview captures your unique writing DNA.

2. **Perfectionism is a feature.** Your high standards become quality gates. Instead of perfecting every sentence manually, you perfect the SYSTEM — and the system enforces your standards across every page.

3. **The craft compounds.** Every scene you write teaches the system something new. Your patterns, your best passages, your craft learnings accumulate in memory and inform future writing.

---

## License

Apache 2.0 — free for personal and commercial use.

---

## Credits

Created by Timo ([@Tuxedomoon25](https://github.com/Tuxedomoon25)) as part of [ContentArchitect.ai](https://contentarchitect.ai).

Built with [Claude Code](https://claude.ai/claude-code) by Anthropic.

Fiction-adapted humanizer based on [blader/humanizer](https://github.com/blader/humanizer) and Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
