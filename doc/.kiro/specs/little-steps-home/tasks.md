# Implementation Tasks — Nhà Nhỏ Vận Động MVP

## Task execution rules for Kiro

- Implement tasks in order unless explicitly approved otherwise.
- Before marking a task complete, run the listed validation checks.
- Update this checklist only after acceptance criteria pass.
- Do not expand MVP scope without approval.
- Use placeholder-safe seed video IDs until real approved videos are supplied.

---

## Phase 0 — Spec confirmation

- [x] **T0.1 Review specification consistency**
  - Read all steering and spec files.
  - Check for conflicts among scope, architecture, routes and task order.
  - Report only blocking corrections before implementation.
  - **Validation:** written implementation summary maps REQ-01 through REQ-10 to planned routes/modules.

- [x] **T0.2 Establish implementation guardrails**
  - Confirm no backend/auth/analytics/camera/push/payment/free-drag-drop dependencies will be added.
  - Confirm all child-facing copy uses Vietnamese and code identifiers use English.
  - **Validation:** dependency proposal and file plan comply with `tech.md` and child-safety steering.

---

## Phase 1 — Bootstrap and UI foundation

- [x] **T1.1 Initialize Next.js application**
  - Create Next.js App Router + TypeScript + Tailwind project using pnpm.
  - Configure strict TypeScript, ESLint and `@/*` alias.
  - Add only approved dependencies.
  - **Requirements:** NFR-07, NFR-08.
  - **Validation:** `pnpm lint` and `pnpm build` pass.

- [x] **T1.2 Establish app shell and metadata**
  - Create root layout with Vietnamese metadata, viewport-safe mobile behavior and base theme.
  - Add core navigation model appropriate to child/parent flows.
  - **Requirements:** REQ-02, NFR-01, NFR-03.
  - **Validation:** app loads without runtime/layout error at mobile widths.

- [x] **T1.3 Implement UI primitives and theme**
  - Add design tokens for pastel backgrounds, high contrast text, rounded surfaces and touch targets.
  - Build `PrimaryButton`, `SecondaryButton`, `KidCard`, `StarsBadge`, `ParentNote`, `EmptyState`, `ErrorState`.
  - Honor `prefers-reduced-motion`.
  - **Requirements:** NFR-01, NFR-02, NFR-06.
  - **Validation:** component visual states render; touch target rule documented/tested where practical.

- [x] **T1.4 Add local placeholder assets**
  - Add legally usable placeholder assets for 3 characters, 3 room themes and MVP items.
  - Ensure scenes render without external asset URLs.
  - **Requirements:** REQ-01, REQ-06, NFR-04.
  - **Validation:** no missing asset errors; placeholders are identifiable and replaceable.

---

## Phase 2 — Domain data and persisted state

- [x] **T2.1 Define domain types and Zod schemas**
  - Implement `Character`, `Mission`, `Item`, `ChildProgressState`, slot and result types.
  - Implement validation for content and hydrated progress.
  - **Requirements:** REQ-10, NFR-05.
  - **Validation:** unit tests for valid and invalid seed/state cases pass.

- [x] **T2.2 Create seed catalogs**
  - Add three characters, seven missions and item catalog from `content-catalog.md`.
  - Add a reusable `isConfiguredVideoId()` validator for placeholders/invalid IDs.
  - Add referential validation for reward item IDs and slot item IDs.
  - **Requirements:** REQ-10.
  - **Validation:** build/test fails clearly on broken catalog relationships.

- [x] **T2.3 Implement persisted progress store**
  - Implement Zustand state with persistence, initial defaults, hydration handling and version field.
  - Implement `selectCharacter`, `setNickname`, `resetProgress`.
  - **Requirements:** REQ-01, REQ-02, REQ-08.
  - **Validation:** progress survives reload; invalid persisted JSON/state safely resets or repairs.

- [-] **T2.4 Implement idempotent reward and equipment actions**
  - Implement `completeMission`, `equipRoomItem`, `clearRoomSlot`, `equipAccessory`, `removeAccessory`.
  - Restrict award to ended/confirmed video flow.
  - Restrict room items to compatible unlocked slots.
  - **Requirements:** REQ-05, REQ-06, REQ-07, NFR-05.
  - **Validation:** unit tests prove no duplicate awards and no invalid item equipment.

---

## Phase 3 — Onboarding and home

- [~] **T3.1 Build first-run routing and onboarding welcome**
  - Redirect uninitialized users from home to onboarding.
  - Provide optional nickname and simple welcome UI.
  - **Requirements:** REQ-01.
  - **Validation:** new state starts onboarding; existing state does not.

- [~] **T3.2 Build character selection**
  - Show exactly three selectable characters with image/name/description.
  - Save selection and send child to starter home.
  - **Requirements:** REQ-01.
  - **Validation:** Playwright flow selects character and persists across refresh.

- [~] **T3.3 Build home dashboard**
  - Render room preview, character, accessory overlay, stars, completion count and next mission.
  - Show reward preview and CTAs.
  - Show celebration/end state after 7 missions.
  - **Requirements:** REQ-02, REQ-07.
  - **Validation:** component tests cover new, partial and completed states.

---

## Phase 4 — Mission player flow

- [~] **T4.1 Build mission intro screen**
  - Display title, story, duration, reward preview and safety note.
  - Add back/start actions.
  - Detect placeholder/invalid video configuration.
  - Ensure iframe is not rendered before explicit start.
  - **Requirements:** REQ-03, REQ-10.
  - **Validation:** component test verifies no player before start and safe placeholder status.

- [~] **T4.2 Implement YouTube adapter and privacy-enhanced player**
  - Write typed IFrame API loader/adapter.
  - Use privacy-enhanced player host/configuration and inline playback.
  - Do not autoplay.
  - Surface ready, playing, paused, ended and error events.
  - **Requirements:** REQ-04, NFR-04.
  - **Validation:** integration/component test with mocked adapter; manual configured-video check.

- [~] **T4.3 Add safety and failure controls**
  - Add `Con cần nghỉ` and `Dừng buổi tập`.
  - Handle offline, player error, invalid video and embed-unavailable states.
  - Prevent completion action until a valid ended signal occurs.
  - **Requirements:** REQ-03, REQ-04.
  - **Validation:** error/offline test cases never mutate reward state.

- [~] **T4.4 Connect mission completion**
  - Present explicit confirmation after ended event.
  - Invoke idempotent completion action and route to reward page.
  - Support replay without re-awarding.
  - **Requirements:** REQ-05.
  - **Validation:** first-completion and replay E2E paths pass.

---

## Phase 5 — Reward and personalization loop

- [~] **T5.1 Build reward reveal page**
  - Show new stars/item and a calm celebration animation.
  - Add `Trang trí ngay` and `Về nhà`.
  - Show already-received state for previously completed mission.
  - **Requirements:** REQ-05, NFR-06.
  - **Validation:** component tests for newly-awarded and previously-awarded views.

- [~] **T5.2 Implement room renderer**
  - Create layered room scene with theme background, character, accessories and slotted decorations.
  - Keep controls accessible and outside artwork collisions.
  - **Requirements:** REQ-06, NFR-01.
  - **Validation:** empty/decorated scene renders at phone/tablet viewport sizes.

- [~] **T5.3 Build fixed-slot room editor**
  - Let child tap slots, see compatible unlocked items and select/clear items.
  - Show friendly locked/empty prompts.
  - **Requirements:** REQ-06.
  - **Validation:** equipment and persistence tests pass.

- [~] **T5.4 Build wardrobe editor**
  - Show only unlocked compatible accessories.
  - Equip/remove an accessory; reflect on home and room.
  - **Requirements:** REQ-07.
  - **Validation:** accessory state persists after reload.

---

## Phase 6 — Parent area

- [~] **T6.1 Add adult-friction entry**
  - Add a discreet parent entry reached through a long-press interaction or similar.
  - Clearly label that this is not login/security.
  - **Requirements:** REQ-08.
  - **Validation:** normal child taps do not accidentally navigate; parent can access deliberately.

- [~] **T6.2 Build progress and safety panel**
  - Display selected character, stars, completed sessions, unlocked items and upcoming safety note.
  - **Requirements:** REQ-08.
  - **Validation:** panel correctly reflects persisted state.

- [~] **T6.3 Implement reset flow**
  - Require clear two-step confirmation.
  - Reset only local progress and route to onboarding.
  - **Requirements:** REQ-08.
  - **Validation:** reset E2E path removes progress and does not remove seed content.

---

## Phase 7 — PWA and Vercel delivery

- [x] **T7.1 Add manifest and install assets**
  - Implement `src/app/manifest.ts`, icons, Apple touch icon and app metadata.
  - **Requirements:** REQ-09.
  - **Validation:** manifest is valid and served in build/production preview.

- [x] **T7.2 Add minimal service worker and registration**
  - Cache shell/local assets and offline fallback only.
  - Explicitly bypass YouTube/player/video requests.
  - Implement update-safe registration.
  - **Requirements:** REQ-09, NFR-04.
  - **Validation:** offline app shell test passes; YouTube resources absent from cache.

- [x] **T7.3 Verify install/offline behavior**
  - Document Android Chrome and iOS/iPadOS Safari installation steps/results where tested.
  - Verify persisted room and progress reopen from installed app.
  - **Requirements:** REQ-09.
  - **Validation:** completed install checklist in release document.

- [ ] **T7.4 Deploy to Vercel**
  - Create production project/config.
  - Verify HTTPS, PWA scope, local asset loading and one real configured-video playback.
  - **Requirements:** NFR-08, REQ-09.
  - **Validation:** deployment URL supports core loop.
  - **Note:** Requires creating Vercel project and pushing to Git. Instructions in README.

---

## Phase 8 — Quality and release gate

- [x] **T8.1 Complete automated test coverage**
  - Unit: domain, state, validation, item compatibility.
  - Component: onboarding, home, intro, reward, parent reset.
  - E2E: onboarding → mocked completion → reward → room → reload → no duplicate reward.
  - **Requirements:** NFR-07.
  - **Validation:** lint/type/test/build/E2E commands pass.

- [x] **T8.2 Accessibility and child-safe UX audit**
  - Check touch size, contrast, alt labels, focus, reduced-motion and copy rules.
  - Confirm no guilt language or external navigation in child flow.
  - **Requirements:** NFR-01, NFR-02, NFR-03, NFR-06.
  - **Validation:** audit checklist signed off in `release-checklist.md`.

- [x] **T8.3 Content and privacy release gate**
  - Replace all mission placeholders with reviewed video IDs.
  - Confirm all safety notes.
  - Confirm no analytics, ads, remote progress or disallowed dependency.
  - Review YouTube child-directed/public distribution requirements.
  - **Requirements:** REQ-04, REQ-10, NFR-04.
  - **Validation:** release checklist completed before real-use/public release.
  - **Note:** Video ID replacement and YouTube child-directed review require parent action before real use. Code-level privacy/dependency checks pass.

---

## Definition of Done for MVP

- [~] REQ-01 to REQ-10 acceptance criteria pass.
- [~] Child can complete: choose character → mission video → reward → decorate room.
- [~] Rewards cannot be duplicated by replay/reload.
- [~] Installed PWA preserves progress on the tested family device.
- [~] Real configured videos have been reviewed by parent.
- [~] No prohibited MVP feature/dependency is present.
- [~] Production deployment is documented and tested.
