# Kiro Master Build Plan — Little Steps Home PWA

> **Mục đích của file này:** Dùng làm input khởi tạo cho Kiro để build MVP một ứng dụng PWA cho bé tập vận động chân theo video YouTube, chọn nhân vật đồng hành, nhận phần thưởng và trang trí ngôi nhà/phụ kiện của nhân vật.
>
> **Cách dùng trong Kiro:** Mở workspace mới, đặt file này tại thư mục gốc, sau đó yêu cầu Kiro đọc file và tạo bộ spec native tại `.kiro/specs/little-steps-home/` gồm `requirements.md`, `design.md`, `tasks.md`; đồng thời tạo steering docs tại `.kiro/steering/` gồm `product.md`, `tech.md`, `structure.md`.

---

## 0. Prompt khởi tạo để gửi cho Kiro

```text
Read KIRO_MASTER_PLAN_LITTLE_STEPS_HOME.md as the authoritative MVP product brief.

Create Kiro workspace steering files:
- .kiro/steering/product.md
- .kiro/steering/tech.md
- .kiro/steering/structure.md

Create a Kiro feature spec:
- .kiro/specs/little-steps-home/requirements.md
- .kiro/specs/little-steps-home/design.md
- .kiro/specs/little-steps-home/tasks.md

Use Vietnamese for product/user-facing requirements and English for source-code identifiers, filenames, type names and technical conventions.

Before implementation:
1. Review the generated requirements and design against this master plan.
2. Do not add Supabase, login, analytics, payments, camera/pose detection, notifications or free-form drag-and-drop in MVP.
3. Create safe placeholder content/assets where real YouTube video IDs or final artwork are not yet supplied.
4. Then execute implementation tasks in order, updating task checkboxes as each acceptance criterion passes.
```

---

# 1. Product Overview

## 1.1 Product name

- Working name: **Nhà Nhỏ Vận Động**
- Code/project slug: `little-steps-home`

## 1.2 Core idea

Ứng dụng PWA dành cho một bé sử dụng trên điện thoại hoặc tablet của gia đình.

Bé sẽ:

1. Chọn một bạn thú đồng hành.
2. Vào căn phòng/ngôi nhà của bạn thú.
3. Chọn nhiệm vụ tập hôm nay.
4. Tập theo một video YouTube đã được phụ huynh chọn trước.
5. Sau khi hoàn thành, nhận sao và vật phẩm.
6. Dùng vật phẩm để trang trí phòng hoặc trang bị phụ kiện cho nhân vật.
7. Quay lại trong những buổi sau để hoàn thiện căn nhà.

## 1.3 Product promise

> Bé không cảm thấy đang xem một danh sách bài tập; bé đang giúp bạn thú xây dựng một căn nhà đáng yêu bằng những buổi vận động vui vẻ.

## 1.4 Primary users

### Child user
- Bé độ tuổi tiểu học, thao tác chủ yếu bằng chạm.
- Cần giao diện ít chữ, icon lớn, phản hồi trực quan và vui vẻ.

### Parent user
- Chọn/duyệt trước video phù hợp.
- Hỗ trợ bé bắt đầu hoặc xác nhận hoàn thành buổi tập.
- Xem lịch sử đơn giản và có thể reset tiến độ trên thiết bị.

---

# 2. MVP Scope

## 2.1 In scope

- PWA cài ra màn hình chính từ trình duyệt.
- Hoạt động tốt trên mobile/tablet portrait.
- 01 hồ sơ bé cục bộ, chỉ lưu nickname nếu phụ huynh nhập.
- 03 nhân vật để chọn lần đầu.
- 01 căn phòng chính.
- 07 nhiệm vụ video mẫu theo hành trình 7 buổi.
- Video YouTube được nhúng bằng privacy-enhanced embed.
- Phần thưởng gồm sao, đồ nội thất và phụ kiện đơn giản.
- Trang trí căn phòng theo các vị trí/slot cố định.
- Đổi phụ kiện nhân vật đã mở khóa.
- Tiến độ lưu cục bộ trên thiết bị.
- Parent area tối giản để xem tiến độ, xem ghi chú an toàn và reset dữ liệu.
- Deploy lên Vercel.

## 2.2 Explicitly out of scope for MVP

- Đăng nhập hoặc tạo tài khoản.
- Supabase/database/cloud sync.
- Nhiều hồ sơ bé.
- Trang CMS/admin quản lý video.
- Tự tải dữ liệu từ Google Sheet.
- Camera, AI kiểm tra tư thế hoặc ghi hình bé.
- Bảng xếp hạng, mạng xã hội, chia sẻ thành tích.
- Thanh toán, quảng cáo, vật phẩm ngẫu nhiên hoặc loot box.
- Push notification.
- Kéo thả đồ nội thất tự do.
- Offline playback video YouTube.

## 2.3 MVP success criteria

- Phụ huynh mở app, cài PWA và bé có thể hoàn thành onboarding không cần hướng dẫn kỹ thuật.
- Bé có thể chọn nhân vật, bắt đầu một nhiệm vụ, xem video, hoàn thành và nhìn thấy vật phẩm mới xuất hiện trong phòng.
- Sau khi đóng/mở lại app, tiến độ và đồ đã trang trí vẫn còn trên cùng thiết bị.
- Không có quảng cáo hoặc nội dung ngoài app do ứng dụng tự thêm; YouTube player có thể vẫn hiển thị thành phần thuộc YouTube.
- Các luồng không khuyến khích áp lực, tội lỗi hoặc so sánh với trẻ khác.

---

# 3. Experience and Safety Principles

## 3.1 Child-friendly UX rules

- Nút chạm chính tối thiểu cao 48px.
- Mỗi màn hình chỉ có một hành động chính rõ ràng.
- Dùng từ ngắn, tích cực, dễ hiểu: `Tập hôm nay`, `Nhận quà`, `Trang trí phòng`, `Con cần nghỉ`.
- Không hiển thị nhiều cài đặt hoặc link ngoài ở chế độ bé.
- Không phạt khi bỏ lỡ buổi tập.
- Không dùng thông điệp gây tội lỗi, ví dụ “Bạn thú buồn vì con chưa tập”.

## 3.2 Physical activity safety rules

- Có ghi chú: tập ở nơi bằng phẳng, không trơn và có người lớn quan sát.
- Màn hình video luôn hiển thị nút `Con cần nghỉ` và `Dừng buổi tập`.
- Parent note có thể cảnh báo video có động tác nhảy/giữ thăng bằng.
- Ứng dụng không tuyên bố đánh giá sức khỏe hoặc độ chính xác động tác.

## 3.3 Privacy and YouTube rules

- MVP không thu thập dữ liệu cá nhân; nickname là tùy chọn và chỉ lưu local.
- Không dùng analytics, ad pixel hoặc third-party tracking trong MVP.
- Không autoplay video.
- Video chỉ load sau khi người dùng bấm bắt đầu nhiệm vụ.
- Embed dùng `https://www.youtube-nocookie.com/embed/{VIDEO_ID}`.
- Dùng YouTube IFrame Player API để theo dõi trạng thái player nếu cần xác định video đã kết thúc.
- Vì trải nghiệm được thiết kế cho trẻ em, trước khi phát hành rộng rãi phải kiểm tra và thực hiện self-designation child-directed theo yêu cầu của YouTube.
- Không cache nội dung video YouTube trong service worker.

---

# 4. Recommended Tech Stack

## 4.1 Final recommendation for MVP

| Layer | Technology | Decision |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Một codebase, phù hợp Vercel và PWA |
| Styling | Tailwind CSS + shadcn/ui primitives | Dễ làm UI mobile thân thiện |
| Animation | Motion / Framer Motion | Hiệu ứng mở khóa và trang trí nhẹ |
| Local state | Zustand + `persist` middleware | Tiến độ nhỏ, local-first, code đơn giản |
| Runtime validation | Zod | Validate seed data và persisted state |
| Video | YouTube IFrame Player API + `youtube-nocookie.com` | Player có event, giảm cá nhân hóa embed |
| PWA | Next.js `app/manifest.ts` + service worker tối giản trong `public/sw.js` | Installable, cache app shell/assets; không cache YouTube |
| Content storage | Local TypeScript/JSON seed files | MVP không phụ thuộc backend |
| Assets | Static WebP/PNG/SVG under `public/assets` | Tải nhanh, deploy cùng app |
| Unit/component test | Vitest + React Testing Library | Test logic progression/UI component |
| E2E test | Playwright | Test hành trình bé và persistence |
| Code quality | ESLint + Prettier | Chuẩn hóa code |
| Package manager | pnpm | Nhanh, lockfile rõ ràng |
| Hosting | Vercel | Deploy Next.js/PWA thuận tiện |

## 4.2 Why not Supabase in MVP

Không dùng Supabase ở MVP vì:

- Chỉ có một bé trên một thiết bị.
- Không cần đăng nhập hoặc đồng bộ.
- Local storage giúp test ý tưởng nhanh hơn.
- Giảm rủi ro privacy và cấu hình backend.

### Phase 2 upgrade option

Khi bé thực sự sử dụng đều và cần nhiều thiết bị hoặc phụ huynh quản trị nội dung từ xa, bổ sung:

- Supabase Postgres cho content/progress.
- Supabase Storage cho asset riêng.
- Optional parent authentication.
- Import video session từ Google Sheet.

## 4.3 Dependency policy

- Khi khởi tạo project, dùng bản stable hiện tại của các package.
- Chỉ cài package nếu phục vụ một chức năng MVP cụ thể.
- Không thêm PWA plugin phức tạp nếu manifest + service worker đơn giản đáp ứng đủ MVP.
- Không thêm backend package hoặc authentication package trong MVP.

---

# 5. Proposed Application Structure

```text
little-steps-home/
├─ .kiro/
│  ├─ steering/
│  │  ├─ product.md
│  │  ├─ tech.md
│  │  └─ structure.md
│  └─ specs/
│     └─ little-steps-home/
│        ├─ requirements.md
│        ├─ design.md
│        └─ tasks.md
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
│  │  ├─ onboarding/
│  │  │  └─ page.tsx
│  │  ├─ mission/
│  │  │  └─ [missionId]/
│  │  │     └─ page.tsx
│  │  ├─ reward/
│  │  │  └─ [missionId]/
│  │  │     └─ page.tsx
│  │  ├─ room/
│  │  │  └─ page.tsx
│  │  ├─ wardrobe/
│  │  │  └─ page.tsx
│  │  └─ parent/
│  │     └─ page.tsx
│  ├─ components/
│  │  ├─ kid-ui/
│  │  ├─ room/
│  │  ├─ mission/
│  │  ├─ rewards/
│  │  └─ common/
│  ├─ features/
│  │  ├─ characters/
│  │  ├─ missions/
│  │  ├─ rewards/
│  │  ├─ room-decoration/
│  │  └─ progress/
│  ├─ data/
│  │  ├─ characters.ts
│  │  ├─ missions.ts
│  │  └─ items.ts
│  ├─ lib/
│  │  ├─ youtube.ts
│  │  ├─ pwa.ts
│  │  ├─ storage.ts
│  │  └─ validators.ts
│  ├─ stores/
│  │  └─ progress-store.ts
│  └─ types/
│     └─ domain.ts
├─ tests/
│  └─ e2e/
└─ README.md
```

---

# 6. Key Routes and User Flows

## 6.1 Routes

| Route | Purpose |
|---|---|
| `/` | Home: nhân vật trong phòng, phần thưởng hôm nay, CTA bắt đầu |
| `/onboarding` | Chọn nhân vật và nickname tùy chọn |
| `/mission/[missionId]` | Intro nhiệm vụ và YouTube player |
| `/reward/[missionId]` | Reveal sao/vật phẩm sau khi hoàn thành |
| `/room` | Xem và trang trí phòng bằng vật phẩm đã mở khóa |
| `/wardrobe` | Trang bị phụ kiện cho nhân vật |
| `/parent` | Ghi chú an toàn, lịch sử và reset progress |

## 6.2 First-time onboarding flow

```text
Open app
→ Welcome
→ Choose one of 3 characters
→ Optional child nickname
→ Display empty starter room
→ Offer first mission
```

## 6.3 Daily workout/reward flow

```text
Home
→ See today's unlockable item
→ Mission introduction and safety note
→ User taps Start
→ Load YouTube privacy-enhanced player
→ Video reaches END state
→ Child/parent taps Confirm completed
→ Reward reveal animation
→ Unlock item + award stars once only
→ Place/equip item or return to home
```

## 6.4 Decoration flow

```text
Room
→ Tap an available fixed room slot
→ See unlocked items valid for slot
→ Select item
→ Room displays selected item
→ Choice persists after app reload
```

---

# 7. Domain Model

## 7.1 Type definitions target

```ts
type CharacterId = 'rabbit-cloud' | 'bear-honey' | 'cat-star';
type Difficulty = 'easy' | 'medium';
type ItemType = 'room-decoration' | 'character-accessory';
type RoomSlotId =
  | 'floor-rug'
  | 'bed'
  | 'window'
  | 'wall-art'
  | 'lamp'
  | 'plant'
  | 'toy';

interface Character {
  id: CharacterId;
  name: string;
  description: string;
  avatarSrc: string;
  roomBackgroundSrc: string;
}

interface Mission {
  id: string;
  dayNumber: number;
  title: string;
  kidTitle: string;
  story: string;
  youtubeVideoId: string;
  durationMinutes: number;
  difficulty: Difficulty;
  rewardStars: number;
  rewardItemId: string;
  parentSafetyNote: string;
  isActive: boolean;
}

interface Item {
  id: string;
  name: string;
  type: ItemType;
  imageSrc: string;
  roomSlotId?: RoomSlotId;
  compatibleCharacterIds?: CharacterId[];
  unlockSource: 'mission' | 'stars';
  unlockMissionId?: string;
  requiredStars?: number;
}

interface WorkoutCompletion {
  missionId: string;
  completedAt: string;
  videoEnded: boolean;
}

interface ChildProgressState {
  version: number;
  childNickname?: string;
  selectedCharacterId?: CharacterId;
  totalStars: number;
  completedMissions: WorkoutCompletion[];
  unlockedItemIds: string[];
  equippedAccessoryItemIds: string[];
  roomLayout: Partial<Record<RoomSlotId, string>>;
}
```

## 7.2 Business rules

- Một mission chỉ được trao thưởng một lần.
- Replay video đã hoàn thành được phép, nhưng không cấp thêm sao/vật phẩm.
- Vật phẩm `mission` được mở khóa khi mission tương ứng hoàn thành.
- Vật phẩm `stars` chỉ mở khóa khi bé chủ động đổi đủ sao; MVP có thể defer chức năng đổi sao nếu cần giảm scope.
- Chỉ item đúng `roomSlotId` mới được đặt vào slot đó.
- Nếu state persisted invalid/corrupted, app phải fallback an toàn và không crash.

---

# 8. Seed Content for MVP

## 8.1 Characters

| ID | Name | Personality | Home visual |
|---|---|---|---|
| `rabbit-cloud` | Thỏ Mây | Thích nhảy và trồng hoa | Phòng pastel cầu vồng |
| `bear-honey` | Gấu Mật | Thích vận động và khám phá | Phòng gỗ ấm áp |
| `cat-star` | Mèo Sao | Khéo léo và thích ngắm sao | Phòng trời đêm dịu nhẹ |

## 8.2 Seven mission placeholders

> Replace `VIDEO_ID_TO_BE_SUPPLIED_*` with parent-approved YouTube video IDs before real use.

| Day | Mission title | Placeholder Video ID | Reward item |
|---|---|---|---|
| 1 | Bước chân đầu tiên | `VIDEO_ID_TO_BE_SUPPLIED_01` | Thảm cầu vồng |
| 2 | Vượt suối lấp lánh | `VIDEO_ID_TO_BE_SUPPLIED_02` | Giường nhỏ |
| 3 | Leo đồi tìm sao | `VIDEO_ID_TO_BE_SUPPLIED_03` | Đèn ngôi sao |
| 4 | Giữ cầu thật vững | `VIDEO_ID_TO_BE_SUPPLIED_04` | Cửa sổ phép thuật |
| 5 | Vũ điệu trong vườn | `VIDEO_ID_TO_BE_SUPPLIED_05` | Chậu cây |
| 6 | Đường đua vui vẻ | `VIDEO_ID_TO_BE_SUPPLIED_06` | Mũ cho nhân vật |
| 7 | Mở rương kho báu | `VIDEO_ID_TO_BE_SUPPLIED_07` | Rương/vương miện đặc biệt |

## 8.3 Room fixed slots for MVP

| Slot ID | Allowed content |
|---|---|
| `floor-rug` | Thảm |
| `bed` | Giường |
| `window` | Cửa sổ |
| `wall-art` | Tranh/đèn tường |
| `lamp` | Đèn |
| `plant` | Cây/hoa |
| `toy` | Thú bông/rương kho báu |

---

# 9. Functional Requirements Summary

## FR-01 — Installable PWA
The system shall provide manifest, app icons and service worker functionality so a parent can install the app to the home screen and reopen it in standalone presentation mode.

## FR-02 — Character selection
The system shall let the child choose exactly one starter character during onboarding and persist that selection locally.

## FR-03 — Home and progress
The system shall show the selected character, decorated room, total earned stars, completed mission count and today's next available mission.

## FR-04 — Video mission
The system shall show mission story, duration, reward preview and parent safety note before loading a parent-approved YouTube video.

## FR-05 — YouTube privacy and playback
The system shall load videos only after user initiation using a privacy-enhanced YouTube embed, and shall detect playback completion where supported.

## FR-06 — Completion and idempotent rewards
The system shall award mission stars and its item at most once when the completed flow is confirmed after the video ends.

## FR-07 — Room decoration
The system shall allow unlocked room items to be assigned to compatible fixed slots and persist the layout locally.

## FR-08 — Character accessories
The system shall allow unlocked accessories to be equipped/removed and persist the character appearance locally.

## FR-09 — Parent area
The system shall provide a parent-facing page showing history, safety notes and a deliberate reset-progress action.

## FR-10 — Safe failure behavior
The system shall show a friendly parent-facing error when a video is missing, invalid or unavailable, without marking the mission completed.

---

# 10. Implementation Task Plan

> Kiro should convert this list into `.kiro/specs/little-steps-home/tasks.md` and track progress using the checkboxes. Execute tasks in order unless a dependency is explicitly satisfied.

## Phase 0 — Kiro setup and specification

- [ ] **T0.1 Generate workspace steering documentation**
  - Create `.kiro/steering/product.md` describing users, MVP promise, child-safe UX and non-goals.
  - Create `.kiro/steering/tech.md` recording the approved technology stack and forbidden MVP additions.
  - Create `.kiro/steering/structure.md` documenting folder layout, naming rules and component boundaries.
  - **Done when:** Kiro uses these documents as persistent context and no MVP task proposes backend/auth/analytics.

- [ ] **T0.2 Generate and validate feature spec**
  - Create `.kiro/specs/little-steps-home/requirements.md`.
  - Create `.kiro/specs/little-steps-home/design.md`.
  - Create `.kiro/specs/little-steps-home/tasks.md`.
  - Ensure requirements cover FR-01 to FR-10 and non-functional constraints in this file.
  - **Done when:** requirements, design and tasks are internally consistent and approved before coding.

## Phase 1 — Project bootstrap and foundations

- [ ] **T1.1 Initialize application**
  - Create a Next.js App Router TypeScript project using `pnpm`.
  - Configure Tailwind CSS, ESLint and import aliases.
  - Install only approved MVP dependencies: UI primitives, Zustand, Zod, animation library and testing packages.
  - **Done when:** development server runs and production build passes.

- [ ] **T1.2 Create global mobile-first design system**
  - Establish app theme tokens: soft background, readable contrast, rounded cards and large touch targets.
  - Add reusable components: `PrimaryButton`, `KidCard`, `ProgressStars`, `ParentNote`, `PageShell`.
  - Respect reduced-motion preference for animations.
  - **Done when:** reusable UI renders responsively at small mobile and tablet widths.

- [ ] **T1.3 Add safe placeholder visual assets**
  - Add locally owned or generated placeholder illustrations for 3 characters, room backgrounds and initial reward items.
  - Do not copy copyrighted character artwork.
  - Optimize static images as SVG/WebP/PNG appropriate for UI.
  - **Done when:** app uses working placeholders with no remote asset dependency.

## Phase 2 — Data model, seed content and persistence

- [ ] **T2.1 Implement domain types and validation**
  - Define types for `Character`, `Mission`, `Item`, `WorkoutCompletion` and `ChildProgressState`.
  - Add Zod schemas for seed data and persisted state.
  - **Done when:** invalid seed/state produces a controlled fallback rather than runtime crash.

- [ ] **T2.2 Create local seed content**
  - Create data for 3 characters.
  - Create 7 mission placeholders with parent safety notes and reward mapping.
  - Create item/room-slot catalog.
  - Keep YouTube IDs replaceable in one clearly documented data file.
  - **Done when:** all screens can render from seed data without backend.

- [ ] **T2.3 Implement persisted progress store**
  - Create Zustand store with local persistence.
  - Support onboarding completion, selected character, stars, completed missions, unlocked items, equipped accessories and room layout.
  - Add versioning/migration placeholder for persisted state.
  - **Done when:** reload/reopen preserves progress and reset removes only local progress.

- [ ] **T2.4 Implement reward idempotency logic**
  - Ensure repeated completion or replay never duplicates a mission reward.
  - Unit test the reward logic.
  - **Done when:** stars/items are awarded once per mission across reloads.

## Phase 3 — Child onboarding and home experience

- [ ] **T3.1 Build welcome/onboarding screen**
  - Display product title, friendly introduction and CTA.
  - Provide optional nickname entry without requiring personal information.
  - **Done when:** first-time user can enter onboarding and skip nickname safely.

- [ ] **T3.2 Build character selection**
  - Display 3 large selectable character cards.
  - Confirm chosen character and initialize starter room.
  - Allow parent to reset later rather than enabling accidental character reset on child home.
  - **Done when:** selection persists and redirects to home.

- [ ] **T3.3 Build home dashboard**
  - Show decorated room preview, selected character, star count and mission progress.
  - Highlight the next uncompleted mission and its unlockable reward.
  - Provide visible `Tập hôm nay`, `Trang trí phòng` and discreet parent entry.
  - **Done when:** home renders correct state for new, partially completed and fully completed 7-day journeys.

## Phase 4 — Mission and YouTube video playback

- [ ] **T4.1 Build mission intro experience**
  - Show kid-friendly mission title, story, approximate duration, reward preview and parent safety note.
  - Include `Bắt đầu` and `Quay lại` actions.
  - Load no YouTube content before `Bắt đầu` is tapped.
  - **Done when:** before start, browser makes no embed/player request from the mission intro UI.

- [ ] **T4.2 Build privacy-enhanced YouTube player component**
  - Implement responsive player with minimum valid interactive size.
  - Use `youtube-nocookie.com` embed and the IFrame Player API when completion detection is enabled.
  - Set `playsinline=1` and safe origin configuration as appropriate.
  - Do not autoplay.
  - Do not cache video resources via service worker.
  - **Done when:** supplied valid video plays inline after user tap and END state is captured.

- [ ] **T4.3 Implement mission safety controls and video errors**
  - Show buttons: `Con cần nghỉ` and `Dừng buổi tập`.
  - Show friendly fallback if video ID is placeholder, invalid, embedding disabled or playback fails.
  - Do not enable reward completion when video cannot be completed.
  - **Done when:** broken/unconfigured video cannot incorrectly award a reward.

- [ ] **T4.4 Implement completion confirmation**
  - After player END state, show a simple confirmation step suitable for child/parent.
  - Invoke idempotent reward awarding and route to reward reveal.
  - **Done when:** completion is only available after a valid completion signal, subject to an explicit developer test-mode override.

## Phase 5 — Rewards, room decoration and accessories

- [ ] **T5.1 Build reward reveal screen**
  - Animate stars and newly unlocked item in a calm celebratory way.
  - Provide `Trang trí ngay` and `Về nhà` actions.
  - Handle replay of completed mission by showing already-received status instead of granting reward again.
  - **Done when:** user understands what was earned and state matches persistence.

- [ ] **T5.2 Build room scene renderer**
  - Display character, room background and equipped fixed-slot decoration layers.
  - Ensure layout works in portrait orientation and assets do not overlap critical buttons.
  - **Done when:** empty room and decorated room render correctly on mobile/tablet.

- [ ] **T5.3 Build fixed-slot decoration editor**
  - Let the child tap a slot and choose from unlocked compatible items.
  - Allow clearing or replacing an item in a slot.
  - Save layout immediately to persisted progress.
  - **Done when:** incompatible items cannot be placed and choices remain after reload.

- [ ] **T5.4 Build wardrobe/accessory view**
  - Display unlocked accessories and equip/remove actions.
  - Keep MVP to one compatible accessory category if layering becomes complex.
  - **Done when:** equipped accessory is visible on home/room and persists.

## Phase 6 — Parent area and content replacement

- [ ] **T6.1 Add protected-ish parent entry pattern**
  - Use a simple non-authenticated adult friction mechanism, e.g. hold button for 3 seconds or solve a short reading prompt.
  - Clearly state that this is not secure authentication.
  - **Done when:** child is unlikely to accidentally open reset/settings during normal play.

- [ ] **T6.2 Build parent progress and safety screen**
  - Show chosen character, mission completion history, earned items and safety notes for the next mission.
  - Add a deliberate reset workflow with confirmation.
  - **Done when:** parent can inspect/reset local progress without affecting seed content.

- [ ] **T6.3 Document video replacement process**
  - Add instructions in README for replacing placeholder IDs with approved YouTube video IDs.
  - Add validation warning for placeholder or malformed IDs.
  - Note that each real video must be reviewed by a parent and checked for embeddability before use.
  - **Done when:** developer can safely configure seven real videos in a single file.

## Phase 7 — PWA and deployment

- [ ] **T7.1 Implement web app manifest and icons**
  - Add `src/app/manifest.ts` with app name, short name, standalone display, theme/background and icon set.
  - Create required icons and Apple touch icon assets.
  - **Done when:** browser recognizes app as installable where platform requirements are satisfied.

- [ ] **T7.2 Implement minimal service worker**
  - Cache app shell and locally hosted static assets required to open installed app.
  - Provide an offline fallback page.
  - Explicitly exclude YouTube/player/video network resources from caching.
  - Implement safe service-worker registration/update behavior.
  - **Done when:** app shell opens offline while video missions clearly state internet is required.

- [ ] **T7.3 Test install and standalone experience**
  - Verify installation flow on Android Chrome and iOS/iPadOS Safari where available.
  - Verify installed app opens in standalone presentation.
  - Confirm progress persists after close/reopen.
  - **Done when:** install checklist is recorded in README with any platform limitations.

- [ ] **T7.4 Deploy to Vercel**
  - Create Vercel project and deployment configuration.
  - Confirm HTTPS production URL, asset loading, PWA manifest and service-worker scope.
  - **Done when:** production deployment supports onboarding, mission playback using a configured video and reward persistence.

## Phase 8 — Quality, accessibility and release readiness

- [ ] **T8.1 Add unit and component tests**
  - Test progress store initialization, mission completion, duplicate reward prevention, equip/replace item and invalid state fallback.
  - Test primary child UI states.
  - **Done when:** automated tests pass in CI/local.

- [ ] **T8.2 Add E2E happy path tests**
  - Cover onboarding → choose character → open mission → simulate completion → reward → decorate room → reload/persist.
  - Stub YouTube completion event in test environment; do not rely on third-party video playback in automated test.
  - **Done when:** happy path runs reliably.

- [ ] **T8.3 Accessibility and child UX review**
  - Verify touch target size, keyboard focus for parent use, readable text contrast, reduced-motion support and meaningful alt text.
  - Verify no guilt-based language or accidental external navigation.
  - **Done when:** review checklist is completed and issues fixed.

- [ ] **T8.4 Privacy and YouTube release checklist**
  - Confirm no analytics/tracking in MVP.
  - Confirm only parent-approved video IDs are configured.
  - Confirm `youtube-nocookie.com` embed usage.
  - Document need for appropriate child-directed self-designation before any public/shared launch.
  - **Done when:** release checklist is stored in README.

---

# 11. Suggested Initial Milestone Order

| Milestone | Outcome | Tasks |
|---|---|---|
| M0 — Spec ready | Kiro context and approved implementation plan | T0.1–T0.2 |
| M1 — App skeleton | Mobile UI shell and valid seed content | T1.1–T2.3 |
| M2 — First playable loop | Choose character → video mission → reward | T2.4, T3.*, T4.*, T5.1 |
| M3 — Motivation loop | Room decoration + wardrobe | T5.2–T5.4 |
| M4 — Parent-ready MVP | Parent view and real video configuration | T6.* |
| M5 — Installable release | PWA + Vercel deploy | T7.* |
| M6 — Release confidence | Tests, accessibility and privacy checklist | T8.* |

---

# 12. Acceptance Scenarios for Kiro Validation

## Scenario A — First launch
- Given no persisted app state,
- When the user opens the app,
- Then the app routes to onboarding,
- And the child can choose one of exactly three starter characters,
- And the choice persists after refresh.

## Scenario B — Start a mission safely
- Given the child is on an uncompleted mission intro screen,
- When no start action has been taken,
- Then no YouTube player should be loaded.
- When the child taps `Bắt đầu`,
- Then the approved privacy-enhanced player loads without autoplay.

## Scenario C — Unlock reward once
- Given a mission is uncompleted,
- When the video reports completion and completion is confirmed,
- Then its configured stars and item are unlocked.
- When the same mission is replayed,
- Then no additional stars or duplicate unlocks are granted.

## Scenario D — Decorate room
- Given a room item is unlocked,
- When the child selects the compatible fixed slot and selects the item,
- Then it appears in the room.
- When the app reloads,
- Then the decoration remains visible.

## Scenario E — Offline behavior
- Given the app has previously loaded its shell/assets,
- When the device is offline,
- Then the installed app can open its local UI and room/progress.
- And when a child opens a video mission,
- Then the app explains that an internet connection is required for video playback.

## Scenario F — Invalid video
- Given a mission has an invalid or placeholder YouTube ID,
- When playback is attempted,
- Then the app shows a parent-friendly setup/error message,
- And no reward is granted.

---

# 13. Future Phase 2 Backlog — Do Not Build in MVP

- Supabase content database and progress sync.
- Parent login.
- Google Sheet import for missions/videos.
- Multiple child profiles.
- More rooms: garden, playroom, celebration area.
- Star shop for optional item selection.
- Audio voice prompts.
- Custom self-hosted exercise videos.
- Content management UI.
- PWA update prompt and optional reminder notifications.

---

# 14. Decisions Kiro Must Not Change Without Approval

1. MVP is local-first and does not use Supabase/authentication.
2. No camera, recording or AI pose detection.
3. No advertising, analytics, social tracking, payment or randomized rewards.
4. YouTube is embedded only after user action and uses privacy-enhanced embed.
5. Rewards cannot be repeatedly earned by replaying the same completed mission.
6. Decoration uses fixed slots, not free drag-and-drop.
7. Public release must not proceed without reviewing child-directed YouTube requirements and real video content.

---

# 15. Inputs To Replace Before Real Use

| Input required | Placeholder location | Owner action |
|---|---|---|
| Final app name/logo | theme/assets config | Parent/developer decides |
| 7 parent-approved YouTube video IDs | `src/data/missions.ts` | Watch and verify each video |
| Character artwork | `public/assets/characters` | Use owned/generated artwork |
| Room/item artwork | `public/assets/rooms`, `public/assets/items` | Use owned/generated artwork |
| Production Vercel URL | deployment config/README | Set after deploy |

---

# 16. Official Documentation References for Implementation

- Kiro Specs: https://kiro.dev/docs/specs/
- Kiro Steering: https://kiro.dev/docs/steering/
- Next.js PWA guide: https://nextjs.org/docs/app/guides/progressive-web-apps
- YouTube IFrame Player API: https://developers.google.com/youtube/iframe_api_reference
- YouTube embed and privacy-enhanced mode guidance: https://support.google.com/youtube/answer/171780

---

## Final instruction to Kiro

Build only after creating and reviewing the Kiro-native steering/spec documents. Prefer a clean, maintainable, mobile-first implementation over adding extra features. The MVP is successful when a child can enjoy one safe loop end-to-end:

```text
Choose friend → Complete approved workout video → Receive gift → Decorate friend's home → Return later with progress preserved
```
