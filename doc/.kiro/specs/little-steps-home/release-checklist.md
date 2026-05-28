# MVP Release Checklist — Nhà Nhỏ Vận Động

> Không đánh dấu MVP sẵn sàng cho bé dùng thật hoặc phát hành rộng rãi cho đến khi các mục bắt buộc bên dưới hoàn thành.

## A. Core experience

- [ ] First-run onboarding hiển thị ba nhân vật và lưu lựa chọn.
- [ ] Home hiển thị đúng nhân vật, phòng, sao và mission tiếp theo.
- [ ] Một mission hợp lệ phát video sau khi bấm bắt đầu.
- [ ] Mission hoàn thành cấp đúng item/sao.
- [ ] Replay không cấp thưởng thêm.
- [ ] Bé có thể đặt item vào slot tương thích.
- [ ] Trang trí/phụ kiện vẫn còn sau khi reload.
- [ ] Parent reset xóa đúng progress và quay về onboarding.

## B. Child-safety review

- [x] CTA và text không chứa thông điệp gây tội lỗi/áp lực.
- [x] Không có cơ chế phạt khi không tập hoặc mất streak.
- [x] Không có quảng cáo, payment, random reward hoặc leaderboard.
- [x] Không có camera, micro hoặc AI kiểm tra động tác.
- [x] Nút nghỉ/dừng luôn dễ truy cập trong flow video.
- [x] Có safety note về không gian tập và giám sát người lớn.
- [x] Hiệu ứng animation không quá mạnh và tôn trọng reduced motion.

## C. YouTube/video content review

| Mission | Video ID replaced | Parent watched full video | Embed works | Safety note verified |
|---|---|---|---|---|
| Day 1 | [ ] | [ ] | [ ] | [ ] |
| Day 2 | [ ] | [ ] | [ ] | [ ] |
| Day 3 | [ ] | [ ] | [ ] | [ ] |
| Day 4 | [ ] | [ ] | [ ] | [ ] |
| Day 5 | [ ] | [ ] | [ ] | [ ] |
| Day 6 | [ ] | [ ] | [ ] | [ ] |
| Day 7 | [ ] | [ ] | [ ] | [ ] |

Additional YouTube checks:
- [x] Player uses privacy-enhanced embed mode.
- [x] Iframe/player does not load before explicit Start action.
- [x] Video does not autoplay.
- [x] Player error/offline cannot trigger completion.
- [x] YouTube/player/video resources are not cached by service worker.
- [ ] Applicable YouTube child-directed/public-distribution requirements have been reviewed before any broader release.

## D. Privacy and dependencies

- [x] No Supabase/backend/authentication dependency in MVP.
- [x] No analytics/tracking/ad SDK.
- [x] Nickname/progress remains local to device.
- [x] No unexpected network call other than app hosting/static assets and configured YouTube playback.
- [ ] Asset artwork is owned, generated or appropriately licensed.

## E. PWA and device checks

- [ ] Manifest served correctly in production.
- [ ] App icons display correctly.
- [ ] App can be added/installed to target device home screen.
- [ ] Installed app opens in standalone-like presentation where supported.
- [ ] Progress persists after closing/reopening installed app.
- [ ] Offline app shell/room state behaves as designed.
- [ ] Offline video screen explicitly says Internet is needed.

## F. Engineering quality checks

- [x] `pnpm lint` passes.
- [x] `pnpm typecheck` passes if configured separately.
- [x] `pnpm test` passes.
- [ ] Playwright core E2E suite passes.
- [x] `pnpm build` passes.
- [x] No blocker accessibility findings remain.
- [ ] Vercel production deployment has been manually smoke-tested.

## G. Production sign-off record

| Field | Value |
|---|---|
| Production URL |  |
| Tested device/browser |  |
| Tested date |  |
| Reviewer |  |
| Known limitations |  |
| Approval for family use |  |
