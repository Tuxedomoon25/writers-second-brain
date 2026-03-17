# Writing Process

## The Workflow

```
1. PLAN    →  /story-forge (concept → outline → beats → scene cards)
2. BUILD   →  /character-forge (deep character profiles with voice)
3. WRITE   →  /write-scene (draft → quality gates → polish → humanize)
4. REVIEW  →  /scene-review (4-dimension quality check)
5. LEARN   →  Patterns extracted automatically to memory/
```

## Per-Scene Process

Before each scene:
1. Check the scene card in `2. Outlines/Scene Cards/`
2. Check the deep-dive beats in `2. Outlines/Deep Dive Beats/`
3. Review the POV character's voice profile in `4. Characters/`
4. Review the setting in `5. Settings/`

Writing:
1. Run `/write-scene` with the scene context
2. The pipeline drafts, checks quality, and polishes automatically
3. Review the output — does it sound like YOU?

After each scene:
1. Run `/scene-review` if you want an additional quality check
2. Scene history is saved to `experiences/scenes/`
3. Patterns are extracted to `memory/patterns/`

## Quality Thresholds

Your thresholds are set in `CLAUDE.md` (configured by `/setup`). If scenes are failing quality gates too often, consider lowering thresholds temporarily. If everything passes easily, consider raising them.
