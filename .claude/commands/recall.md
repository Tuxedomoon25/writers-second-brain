---
name: recall
description: Search your writing memory for patterns, examples, and craft learnings
---

# Recall — Search Your Writing Memory

Search across all memory types to find relevant patterns, past examples, and proven approaches for your current writing challenge.

## Input

The user provides a topic, question, or challenge. Examples:
- `/recall how do I write tension in dialogue`
- `/recall my best scene openings`
- `/recall character voice for [name]`
- `/recall pacing patterns for action scenes`

## Process

1. **Search memory/voice/** — Check if the query relates to voice, rules, or influences
2. **Search memory/patterns/** — Check prose patterns, dialogue patterns, pacing patterns for relevant entries
3. **Search memory/examples/** — Find curated passages that demonstrate the technique
4. **Search memory/craft/** — Check craft learnings for relevant notes
5. **Search experiences/scenes/** — Find past scenes where this technique was used well (based on quality scores)

## Output

Present findings organized by relevance:

```markdown
## Recall: [Query]

### From Your Patterns
[Relevant patterns found, with confidence level (LOW/MEDIUM/HIGH)]

### From Your Best Work
[Relevant example passages from memory/examples/]

### From Your Craft Notes
[Relevant learnings from memory/craft/]

### From Past Scenes
[Links to relevant scenes in experiences/ with their quality scores]

### Suggestion
[If no memory found: "You haven't built patterns for this yet. Write a few scenes focusing on [topic] and the patterns will emerge naturally through the /learn process."]
```
