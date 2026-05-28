# Nhà Nhỏ Vận Động — Little Steps Home

PWA cho bé tập vận động chân theo video YouTube đã được phụ huynh duyệt. Bé chọn nhân vật đồng hành, hoàn thành nhiệm vụ, nhận quà và trang trí căn phòng.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) on a mobile viewport.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build locally |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run Vitest unit/component tests |
| `pnpm test:e2e` | Run Playwright E2E tests |

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Zustand (persisted local state)
- Zod (runtime validation)
- Motion (animations)
- YouTube IFrame Player API (privacy-enhanced embed)
- Minimal PWA (manifest + service worker)

## Replacing Placeholder Video IDs

All 7 mission videos use placeholder IDs in `src/data/missions.ts`.

To configure real videos:

1. Open `src/data/missions.ts`.
2. Replace each `VIDEO_ID_TO_BE_SUPPLIED_XX` with a valid 11-character YouTube video ID.
3. Before using each video:
   - Watch the full video.
   - Verify movements are suitable for the child.
   - Confirm the video can be embedded (not restricted).
   - Note if adult supervision is needed for specific movements.
4. Run `pnpm build` to verify no validation errors.

Video IDs look like: `dQw4w9WgXcQ` (11 alphanumeric characters, hyphens, underscores).

## PWA Installation Guide

### Android (Chrome)

1. Open the production URL in Chrome.
2. Tap the three-dot menu (⋮) → "Add to Home screen" or "Install app".
3. Confirm the installation prompt.
4. The app icon appears on the home screen.
5. Opening from the icon launches in standalone mode (no browser chrome).

### iOS / iPadOS (Safari)

1. Open the production URL in Safari.
2. Tap the Share button (□↑) → "Add to Home Screen".
3. Confirm the name and tap "Add".
4. The app icon appears on the home screen.
5. Opening from the icon launches in standalone-like mode.

**Known iOS limitations:**
- iOS does not show a native install prompt banner.
- Service worker cache may be evicted after ~7 days of inactivity.
- `standalone` display mode works but status bar behavior may vary.

### Desktop (Chrome/Edge)

1. Open the production URL.
2. Click the install icon in the address bar or use menu → "Install app".
3. The app opens in its own window.

## Offline Behavior

| Feature | Offline behavior |
|---|---|
| App shell (home, room, wardrobe) | ✅ Works — cached by service worker |
| Local assets (characters, items) | ✅ Works — cached on first load |
| Progress/state | ✅ Works — stored in localStorage |
| Video missions | ❌ Requires internet — shows friendly message |
| Onboarding | ✅ Works after initial cache |

When offline and attempting a video mission, the app displays:
> "Không thể tải video. Hãy kiểm tra kết nối mạng và thử lại."

The service worker explicitly does NOT cache:
- YouTube iframe/player resources
- YouTube video streams
- Any `*.youtube.com`, `*.ytimg.com`, `*.googlevideo.com` requests

## Deployment (Vercel)

1. Push the `little-steps-home` directory to a Git repository.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Set the root directory to `little-steps-home` if it's in a monorepo.
4. Framework preset: Next.js (auto-detected).
5. No environment variables needed for MVP.
6. Deploy.

Post-deploy verification:
- [ ] HTTPS URL works
- [ ] Manifest loads at `/manifest.webmanifest`
- [ ] Service worker registers at `/sw.js`
- [ ] App is installable on mobile
- [ ] Video playback works with a configured video ID
- [ ] Progress persists after close/reopen

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components (kid-ui, room, mission, common)
├── data/             # Static seed content (characters, missions, items)
├── lib/              # Utilities (youtube adapter, validation)
├── stores/           # Zustand persisted state
└── types/            # Domain type definitions
public/
├── assets/           # Character, room, item SVG illustrations
├── icons/            # App icons
├── sw.js             # Service worker
└── offline.html      # Offline fallback page
```

## Safety & Privacy

- No camera, microphone, or AI pose detection.
- No login, analytics, ads, or tracking.
- No data leaves the device — progress is localStorage only.
- Videos load only after explicit user action.
- Privacy-enhanced YouTube embed (`youtube-nocookie.com`).
- No guilt-based messaging or streak penalties.
- Persistent rest/stop buttons during video playback.

## License

Private project — not for public distribution without review.
