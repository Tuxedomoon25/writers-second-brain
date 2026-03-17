---
name: grow
description: View your writing growth metrics and brain health
---

# Grow — Your Writing Growth Dashboard

Display your writing system's health, growth trajectory, and pattern maturity.

## Process

1. Read `brain-health/growth-log.md` for milestones
2. Read `brain-health/pattern-confidence.md` for pattern maturity
3. Read `brain-health/quality-metrics.md` for score trends
4. Count files in `experiences/scenes/` for total scenes written
5. Count entries in `memory/patterns/` for total patterns extracted
6. Read `memory/voice/style-rules.md` for rule count

## Output

```markdown
## Your Writing Brain — Growth Dashboard

### Brain Status
| Metric | Value |
|--------|-------|
| Scenes Written | [count] |
| Characters Created | [count from vault/4. Characters/] |
| Patterns Extracted | [count] |
| HIGH Confidence Patterns | [count] |
| Average Quality Score | [average across all reviews] |
| Rules Defined | [count from CLAUDE.md] |

### Quality Trend
[Show last 5 scene scores if available]

| Scene | Show/Tell | Voice | Pacing | Style | Overall |
|-------|-----------|-------|--------|-------|---------|
| [scene 1] | ... | ... | ... | ... | ... |

### Pattern Maturity
- LOW confidence: [count] — Experimental, first use
- MEDIUM confidence: [count] — Promising, used twice
- HIGH confidence: [count] — Validated, proven reliable

### Recent Milestones
[Last 5 entries from growth-log.md]

### Next Milestone
[Suggest the next achievement based on current state]
- 0 scenes → "Write your first scene with /write-scene"
- 1-5 scenes → "Keep writing! Patterns emerge after 5+ scenes"
- 5-10 scenes → "Review your rules — what's working? Run /setup to refine"
- 10+ scenes → "You're building compound returns. Check your HIGH confidence patterns."
```
