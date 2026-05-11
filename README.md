# Captain's Wheel

A fast-paced casino-themed browser game built with Phaser 3. Spin the wheel, match the suit, beat the house.

## Gameplay

Obstacles fly in from the edges toward the centre wheel. Rotate the wheel so the correct segment faces each incoming card — match it to score points, miss it to lose HP.

The game escalates through four stages as your score climbs:

| Score | Stage | Wheel |
|-------|-------|-------|
| 0 – 99 | Colour Match | 2 segments — RED / BLACK |
| 100 – 299 | Suit Match | 4 segments — ♥ ♦ ♣ ♠ |
| 300 – 599 | Full Suits | 6 segments — novelty deck |
| 600+ | Master Match | 8 segments — suit + Lo/Hi |

At **1 000 points** the Joker (★) unlocks — a wildcard obstacle that matches any segment.

The soundtrack escalates with you: a different music track kicks in at each major score boundary.

## Controls

| Input | Action |
|-------|--------|
| Mouse drag / touch | Rotate wheel |
| `P` / `Esc` | Pause |
| `Space` / `Enter` | Start game (menu) |

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Audio

Place the following files in `public/assets/` to enable sound:

| File | Used for |
|------|----------|
| `bgm-slow.mp3` | Background music — stages 1 & 2 |
| `bgm-mid.mp3` | Background music — stage 3 |
| `bgm-fast.mp3` | Background music — stage 4 + Joker |
| `sfx-match.mp3` | Match hit sound |
| `sfx-miss.mp3` | Miss sound |
| `sfx-lose.mp3` | Game over sound |

The ♪ button in-game toggles music on/off; preference is saved across sessions.

## Building

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

Upload the contents of `dist/` to any static host (Netlify, Vercel, GitHub Pages, itch.io).

## Testing

```bash
npm test          # run once
npm run test:watch # watch mode
```

Tests cover all pure-logic modules (ScoreManager, HealthManager, SettingsManager, etc.) using Vitest with injectable storage fakes — no browser required.

## Project Structure

```
src/
  config/       # segment definitions per stage
  entities/     # Wheel, FloatingText
  managers/     # Audio, Health, Obstacle, Pause, Score, Settings, UI
  scenes/       # Menu, Game, GameOver, Pause, Transition
  utils/        # drawFelt, matcher, speedScaler
tests/          # mirrors src/managers and src/utils
public/assets/  # audio files (not committed)
```

## Tech Stack

- [Phaser 3](https://phaser.io/) — game framework
- [Vite](https://vitejs.dev/) — build tooling
- [Vitest](https://vitest.dev/) — unit tests
