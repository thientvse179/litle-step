---
inclusion: always
---

# Technology Steering — Nhà Nhỏ Vận Động

## Approved MVP stack

| Concern | Approved choice | Notes |
|---|---|---|
| Application framework | Next.js App Router + TypeScript | Deploy on Vercel; mobile-first PWA |
| Package manager | pnpm | Keep a committed lockfile |
| Styling | Tailwind CSS | Use design tokens in global CSS |
| UI primitives | shadcn/ui where useful | Avoid building a full design system |
| Animation | `motion` / Motion for React | Calm reward animations; honor reduced motion |
| Client state | Zustand with `persist` middleware | Store only local child progress |
| Runtime validation | Zod | Validate seed content and persisted state |
| Video playback | YouTube IFrame Player API | Implement local loader; no YouTube Data API needed |
| Privacy-enhanced embed | `youtube-nocookie.com` | Load only after user presses Start |
| PWA | `src/app/manifest.ts`, app icons, minimal `public/sw.js` | Cache shell/local assets only |
| Test runner | Vitest + React Testing Library | Domain/store/component tests |
| Browser tests | Playwright | End-to-end core flow with mocked player events |
| Hosting | Vercel | HTTPS required for production service worker |

## Technical boundaries

### Local-only persistence
MVP stores only:
- optional nickname;
- selected character;
- completed mission IDs and timestamps;
- star balance/total;
- unlocked/equipped item IDs;
- room slot selections.

Store this data in browser local persistence via Zustand. Do not send it to a server.

### No backend in MVP
Do not add:
- Supabase;
- database migrations;
- API routes for user progress;
- authentication libraries;
- remote content administration.

### Video integration constraints
- Render mission intro before creating any YouTube iframe.
- Require a direct user action to load/play video; do not autoplay.
- Use a responsive 16:9 player area and do not render below YouTube minimum interaction requirements.
- Capture `ENDED` state from the IFrame Player API before enabling normal reward confirmation.
- Include a developer-only mock/test path for automated tests; never enable it in production UI.
- Set a referrer policy that does not suppress the origin/referrer needed by YouTube integrations.
- Service worker must not cache video, iframe or YouTube requests.

### PWA strategy
- Implement installable metadata through `src/app/manifest.ts`.
- Provide app icons and Apple touch icon.
- Register a minimal service worker from the client after app load.
- Precache local UI shell/assets only; show a friendly online-required state for video playback.
- Do not implement web push in MVP.

## Recommended dependency commands

Kiro may initialize with current stable compatible versions rather than hardcoded versions:

```bash
pnpm create next-app@latest little-steps-home --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
pnpm add zustand zod motion clsx tailwind-merge
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom playwright
```

Only add shadcn components actually used by the MVP.

## Coding standards

- Strict TypeScript; avoid `any`.
- Use Server Components by default; use `"use client"` only for interactive/persisted/player components.
- Domain types and pure business rules must not depend on React.
- Validate persisted state before using it.
- Use static seed content in `src/data/` for MVP.
- Use English identifiers and Vietnamese UI strings.
- No remote image dependencies for character/item assets in MVP.

## Source references

- Next.js PWA guide: `https://nextjs.org/docs/app/guides/progressive-web-apps`
- YouTube IFrame Player API: `https://developers.google.com/youtube/iframe_api_reference`
- YouTube privacy-enhanced embed guidance: `https://support.google.com/youtube/answer/171780`
- YouTube minimum functionality/policies: `https://developers.google.com/youtube/terms/required-minimum-functionality`
