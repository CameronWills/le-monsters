# Le Monsters

A 2D platformer browser game featuring Hugo (an orange labubu-like character) navigating through a side-scrolling level with enemies, collectibles, and a boss battle.

## 🎮 Features

- **Core Gameplay**: Side-scrolling platformer with jumping, moving, and collecting mechanics
- **Combat System**: Stomp enemies or use wizard staff to shoot
- **Boss Battle**: Pattern-based final boss requiring wizard staff power-up
- **Lives System**: 3 lives with checkpoints for respawning
- **Power-ups**: Wizard hat unlocks shooting ability
- **Menus & UI**: Main menu, pause, victory, and game over screens
- **Persistence**: LocalStorage saves best completion times

## 🛠️ Tech Stack

- **Game Engine**: Phaser 3.70+
- **Build Tool**: Vite 5.x with HMR
- **Language**: TypeScript 5.x (strict mode)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Target**: Desktop browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

## 📋 Prerequisites

- **Node.js**: v18.x or v20.x LTS
- **npm**: v9.x or v10.x

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone <repository-url>
cd le-monsters-browser

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (opens http://localhost:3000)
npm run dev
```

### Build & Preview

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Lint TypeScript
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 📂 Project Structure

```
src/
├── main.ts                    # Game entry point
├── config/
│   ├── constants.ts           # Game constants
│   └── phaser-config.ts       # Phaser configuration
├── scenes/                    # Game scenes
├── entities/                  # Player, enemies, collectibles
├── managers/                  # Game services (audio, input, state)
├── factories/                 # Entity creation & pooling
└── types/                     # TypeScript interfaces

public/
└── assets/                    # Sprites, audio, level data

tests/
├── unit/                      # Unit tests
├── integration/               # Integration tests
└── e2e/                       # E2E tests
```

## 🎯 Performance Targets

- **60 FPS** sustained during gameplay
- **<3s** initial load time
- **<2MB** total bundle size (compressed)
- **<16ms** input latency

## 🎨 Art Style

Hand-drawn colouring-in aesthetic appealing to ages 7-8.

## 🎮 Controls

- **Arrow Keys / WASD**: Move Hugo
- **Spacebar**: Jump
- **Shift**: Shoot (when wizard hat collected)
- **ESC**: Pause

## 📝 Implementation Status

### ✅ Phase 1: Setup (Complete)
- Project structure created
- Package.json with dependencies
- Vite, TypeScript, ESLint configuration
- Entry HTML file

### ✅ Phase 2: Foundational (Complete)
- Game constants and configuration
- TypeScript interfaces for all entities
- Phaser game configuration
- BootScene implementation
- Manager and factory stubs

### 🚧 Phase 3: User Story 1 - Core Gameplay (In Progress)
Next: Asset loading and PreloadScene

## 🤝 Contributing

This project follows the spec-driven development workflow. See `/specs/001-le-monsters-browser/` for detailed implementation plans.

## 📄 License

MIT

## 🎓 Development Guide

For detailed development instructions, see:
- `/specs/001-le-monsters-browser/quickstart.md` - Developer setup
- `/specs/001-le-monsters-browser/data-model.md` - Entity definitions
- `/specs/001-le-monsters-browser/contracts/` - API contracts
- `/specs/001-le-monsters-browser/tasks.md` - Implementation tasks

---

**Built with ❤️ using Phaser 3, Vite, and TypeScript**
