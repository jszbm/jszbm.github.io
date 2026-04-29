# ⚜ Grimoire — Game Dev Portfolio Theme

A medieval-fantasy game developer portfolio for GitHub Pages.
One-page design with game cards, built-in audio player, screenshot lightbox, skills, and timeline.

## Quick Start

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Customising Your Info

Everything lives in **`_config.yml`** — no code needed for most edits:

```yaml
title: "Your Name"
tagline: "Game Developer · Composer · World-Builder"
email: "you@example.com"

links:
  itch:    "https://yourname.itch.io"
  github:  "https://github.com/yourname"

hero:
  greeting: "Hail, traveler."
  intro: >
    Your intro text here.

disciplines:
  - name: "Game Design"
    icon: "🎮"
    detail: "Unity · Godot · level design"

timeline:
  - year: "2024"
    title: "Some Role or Achievement"
    detail: "What you did."
```

## Adding a Game

Create a file in `_games/my-game.md`:

```markdown
---
title: "My Game"
slug: "my-game"
tagline: "A short tagline"
year: 2024
status: "Released"        # Released | In Development | Prototype
itch_url: "https://yourname.itch.io/my-game"
github_url: ""            # blank = hidden
engine: "Godot 4"
role: "Solo dev"

# YouTube trailer (just the video ID)
youtube_id: "abc123"

# Screenshots — place files in /assets/games/my-game/
screenshots:
  - file: "screen1.png"
    caption: "Level 1 dungeon"
  - file: "screen2.png"
    caption: "Boss encounter"

# Audio — place files in /assets/games/my-game/audio/
audio:
  - title: "Main Theme"
    file: "/assets/games/my-game/audio/main-theme.mp3"

# Markdown description
description: |
  Tell the story of this game.
  Supports **markdown**.

tags: [godot, roguelite, solo]
weight: 1   # lower = shown first
---
```

### Placing assets

```
assets/
  games/
    my-game/
      screen1.png
      screen2.png
      audio/
        main-theme.mp3
```

## Deploying to GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: `main` branch, root
3. Site live at `https://yourusername.github.io/repo` (or your custom domain)

For a custom domain add a `CNAME` file with your domain.
