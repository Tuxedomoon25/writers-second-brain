# Setup Guide — Your First 15 Minutes

This guide walks you through getting The Writer's Second Brain running on your computer. No technical experience required.

---

## What You Need

- A computer (Windows, Mac, or Linux)
- An internet connection
- 15 minutes of uninterrupted time

---

## Step 1: Install VS Code (3 minutes)

VS Code is a free text editor that runs Claude Code.

1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Click the big blue **Download** button
3. Install it (accept all defaults)
4. Open VS Code

---

## Step 2: Install Claude Code Extension (2 minutes)

1. In VS Code, click the **Extensions** icon in the left sidebar (it looks like 4 squares)
2. Search for **"Claude Code"**
3. Click **Install** on the one by Anthropic
4. After installation, you'll see a Claude icon in the left sidebar

---

## Step 3: Sign In to Claude (2 minutes)

1. Click the Claude icon in the left sidebar
2. Follow the prompts to sign in with your Claude account
3. If you don't have an account, create one at [claude.ai](https://claude.ai)

---

## Step 4: Get The Writer's Second Brain (3 minutes)

### Option A: Download ZIP (Easiest)

1. Go to the GitHub page for this project
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP to a folder you'll remember (e.g., `Documents/writers-second-brain`)

### Option B: Clone with Git (If you know Git)

Open a terminal and run:

```bash
git clone https://github.com/Tuxedomoon25/writers-second-brain.git
```

---

## Step 5: Open the Project (1 minute)

1. In VS Code, go to **File → Open Folder**
2. Navigate to where you put the `writers-second-brain` folder
3. Select it and click **Open**

You should see the project files in the left sidebar.

---

## Step 6: Run Setup (30-45 minutes)

This is the fun part — discovering your writing voice.

1. Open the Claude Code panel (click the Claude icon in the left sidebar)
2. Type: `/setup`
3. Press Enter

The setup wizard will interview you about:
- Your story concept and genre
- Your preferred language (English or Dutch)
- Your writing influences
- Your personal rules and style
- Your quality standards

Take your time. This is the foundation everything builds on.

---

## You're Ready!

After setup, your system is personalized. Here's what to do next:

### If you chose Fantasy/Sci-Fi:
```
/story-forge
```
Start building your world before writing scenes.

### If you chose any other genre:
```
/character-forge [your protagonist's name]
```
Start with your main character.

### Then:
```
/story-forge          → Build your outline
/write-scene          → Write your first scene
/scene-review         → Check your work
```

---

## Need Help?

- **Something not working?** Check that Claude Code is signed in (click the Claude icon)
- **Want to redo setup?** Just run `/setup` again — it will overwrite your previous configuration
- **Questions about commands?** Type `/help` or read `CLAUDE.md` in the project root

---

## Tips for Getting Started

1. **Start small.** Your first scene doesn't need to be perfect. Start with quality thresholds at 6/10.
2. **Trust the process.** The quality gates catch issues. Focus on the story.
3. **Refine as you go.** After 5-10 scenes, revisit `/setup` to tighten your rules.
4. **Your voice is yours.** The AI writes in YOUR style because YOU defined the rules. If it doesn't sound like you, adjust your commandments.
