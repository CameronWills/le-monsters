## Tech Stack

**Core Technologies:**
- **Language**: TypeScript 5.x (strict mode enabled)
- **Game Engine**: Phaser 3.70+ (latest stable)
- **Build Tool**: Vite 5.x (with HMR for fast development)
- **Runtime**: Client-side only, desktop browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

**Recommended Additional Components:**

**Asset Management:**
- **Tiled Map Editor** (optional): For level design if complexity grows beyond single screen
- **TexturePacker** (optional): For efficient sprite sheet generation from your son's drawings
- Asset pipeline: Simple file-based loading via Phaser's LoaderPlugin

**Code Quality & Development:**
- **ESLint** + **Prettier**: TypeScript linting and code formatting
- **Vitest**: Unit testing framework (Vite-native, fast)
- **Playwright** or **Cypress**: E2E testing for user scenarios (validate acceptance criteria)

**State Management:**
- **Phaser's built-in Scene system**: For game state (menu, gameplay, game over)
- **LocalStorage API**: For persisting high scores/best times (no backend needed)

**Audio:**
- **Howler.js** (optional enhancement): Better cross-browser audio handling than Phaser's default
- OR use **Phaser's native Sound Manager**: Simpler, sufficient for basic SFX/music

**Deployment:**
- **GitHub Pages** or **Netlify**: Static site hosting (free tier)
- **Vite build output**: Optimized production bundle with asset hashing

**Development Tools:**
- **Phaser Dev Tools** (browser extension): Real-time scene inspection
- **VS Code** + **Phaser 3 snippets extension**: Improved DX

**Constraints:**
- 60 FPS minimum performance target
- No external API calls or backend services
- All game logic runs client-side
- Assets loaded from `/public/assets/` directory structure

Please generate an implementation plan based on this stack.