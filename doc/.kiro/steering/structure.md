---
inclusion: always
---

# Project Structure Steering — Nhà Nhỏ Vận Động

## Intended repository layout

```text
little-steps-home/
├─ .kiro/
│  ├─ steering/
│  └─ specs/little-steps-home/
├─ public/
│  ├─ icons/
│  ├─ assets/
│  │  ├─ characters/
│  │  ├─ rooms/
│  │  ├─ items/
│  │  └─ rewards/
│  ├─ offline.html
│  └─ sw.js
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ manifest.ts
│  │  ├─ page.tsx
│  │  ├─ onboarding/page.tsx
│  │  ├─ mission/[missionId]/page.tsx
│  │  ├─ reward/[missionId]/page.tsx
│  │  ├─ room/page.tsx
│  │  ├─ wardrobe/page.tsx
│  │  └─ parent/page.tsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ kid-ui/
│  │  ├─ mission/
│  │  ├─ rewards/
│  │  └─ room/
│  ├─ features/
│  │  ├─ characters/
│  │  ├─ missions/
│  │  ├─ progress/
│  │  ├─ rewards/
│  │  └─ room-decoration/
│  ├─ data/
│  │  ├─ characters.ts
│  │  ├─ missions.ts
│  │  └─ items.ts
│  ├─ lib/
│  │  ├─ pwa/
│  │  ├─ storage/
│  │  ├─ validation/
│  │  └─ youtube/
│  ├─ stores/
│  │  └─ progress-store.ts
│  └─ types/
│     └─ domain.ts
├─ tests/e2e/
└─ README.md
```

## Routing responsibilities

| Route | Responsibility |
|---|---|
| `/` | Home; show character room preview, progress and next mission |
| `/onboarding` | First-run character choice and optional nickname |
| `/mission/[missionId]` | Mission intro, safety note and player experience |
| `/reward/[missionId]` | Reward reveal after validated completion |
| `/room` | Fixed-slot room decoration editor |
| `/wardrobe` | Accessory equipment editor |
| `/parent` | Progress summary, notes and deliberate reset |

## Module boundaries

### `src/data/`
Static, validated MVP content only: characters, missions, item catalog. Do not store runtime progress here.

### `src/types/`
Shared TypeScript domain definitions. Must be React-independent.

### `src/features/`
Feature-specific rules and view models. Reward-awarding and compatibility logic belong here.

### `src/stores/`
Persisted runtime state and actions only. Components should not manually edit persisted objects.

### `src/lib/youtube/`
Script loader, player wrapper and typed event translation. No reward logic.

### `src/components/`
Presentational and interactive components, grouped by use case. Components call feature/store APIs rather than embedding business rules.

## Naming conventions

- Files: kebab-case except Next.js route conventions.
- Components/types: PascalCase.
- Hooks: `useXxx`.
- Store actions: verbs such as `selectCharacter`, `completeMission`, `equipItem`, `resetProgress`.
- Seed IDs: stable kebab-case strings, e.g. `rabbit-cloud`, `mission-day-01`, `bed-rainbow`.

## Architectural rules

1. Reward awarding must be a single domain/store action and be idempotent.
2. Player state must not directly write reward state without completion confirmation.
3. Route pages should orchestrate; business rules live outside route components.
4. Content data must be validated at startup/build use.
5. State hydration must handle first render safely in a PWA/client persistence context.
6. Public assets must be local and legally usable.
