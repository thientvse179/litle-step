# Requirements — Nhà Nhỏ Vận Động MVP

## 1. Overview

### 1.1 Objective
Xây dựng một PWA mobile-first giúp bé tập vận động chân theo video YouTube đã được phụ huynh chọn trước, thông qua trải nghiệm chọn nhân vật, nhận quà và trang trí phòng.

### 1.2 User roles
- **Bé:** chọn nhân vật, bắt đầu nhiệm vụ, xem/tập theo video, nhận quà và trang trí.
- **Phụ huynh:** cài app, duyệt/thay video, quan sát tập luyện, xem tiến độ và reset local progress.
- **Developer:** cấu hình seed video/assets và deploy lên Vercel.

### 1.3 Assumptions
- MVP dùng cho một bé trên một thiết bị.
- Có kết nối Internet khi xem video.
- Danh sách video thật sẽ được bổ sung sau; ứng dụng phải an toàn khi còn placeholder.
- Phụ huynh chịu trách nhiệm duyệt nội dung và giám sát khi cần.

## 2. Scope

### In scope
PWA installable, onboarding, ba nhân vật, bảy mission, YouTube player privacy-enhanced, thưởng một lần, phòng trang trí fixed-slot, phụ kiện cơ bản, local persistence, parent area, deploy Vercel, automated core tests.

### Out of scope
Backend/Supabase/login, cloud sync, nhiều trẻ, CMS, Google Sheet import, push, analytics, ads, payment, camera/AI, social, leaderboard, random rewards, drag-and-drop tự do.

---

## 3. Functional Requirements

## REQ-01 — First-run onboarding and character selection

**User story:** Là một bé, con muốn chọn bạn thú mà con thích để có cảm giác đây là hành trình riêng của mình.

### Acceptance criteria
1. **WHEN** ứng dụng được mở lần đầu và chưa có tiến độ local hợp lệ, **THEN** hệ thống phải điều hướng tới onboarding.
2. **WHEN** onboarding hiển thị, **THEN** hệ thống phải hiển thị đúng ba nhân vật starter: Thỏ Mây, Gấu Mật, Mèo Sao.
3. **WHEN** bé chọn một nhân vật và xác nhận, **THEN** hệ thống phải lưu nhân vật được chọn vào local persisted state và điều hướng về home.
4. **WHEN** phụ huynh không nhập nickname, **THEN** onboarding vẫn phải hoàn tất được.
5. **IF** đã có nhân vật được chọn trong state hợp lệ, **THEN** mở app không được bắt bé onboarding lại.

## REQ-02 — Home and next mission

**User story:** Là một bé, con muốn nhìn thấy bạn thú và món quà có thể nhận hôm nay để muốn bắt đầu tập.

### Acceptance criteria
1. **WHEN** home được mở sau onboarding, **THEN** hệ thống phải hiển thị nhân vật đã chọn, phòng hiện tại, số sao và số nhiệm vụ đã hoàn thành.
2. **WHEN** còn mission chưa hoàn thành, **THEN** hệ thống phải chọn mission chưa hoàn thành tiếp theo làm `Tập hôm nay`.
3. **WHEN** hiển thị mission tiếp theo, **THEN** hệ thống phải hiển thị vật phẩm có thể mở khóa và CTA bắt đầu.
4. **WHEN** toàn bộ bảy mission đã hoàn thành, **THEN** hệ thống phải hiển thị trạng thái chúc mừng hoàn thành hành trình thay vì một mission mới.
5. **WHEN** bé bấm `Trang trí phòng` hoặc `Phụ kiện`, **THEN** hệ thống phải điều hướng đến chức năng tương ứng.

## REQ-03 — Mission introduction and safety

**User story:** Là phụ huynh, tôi muốn biết bé chuẩn bị tập nội dung gì và cần lưu ý gì trước khi phát video.

### Acceptance criteria
1. **WHEN** mở một mission, **THEN** hệ thống phải hiển thị tên thân thiện, câu chuyện, thời lượng ước tính, phần thưởng và ghi chú an toàn.
2. **WHEN** màn hình intro mới hiển thị và chưa bấm `Bắt đầu`, **THEN** hệ thống không được tạo YouTube iframe hoặc tải player.
3. **WHEN** video ID là placeholder hoặc sai định dạng, **THEN** hệ thống phải hiển thị thông báo cấu hình cho phụ huynh và không cho bắt đầu nhận thưởng.
4. **WHEN** người dùng bấm `Quay lại`, **THEN** mission không được đánh dấu hoàn thành và không cấp thưởng.

## REQ-04 — YouTube video playback

**User story:** Là một bé, con muốn tập theo video trong app mà không bị kéo khỏi hành trình chính.

### Acceptance criteria
1. **WHEN** bé/phụ huynh bấm `Bắt đầu` với video ID hợp lệ, **THEN** hệ thống phải tải embedded player ở privacy-enhanced mode.
2. **WHEN** player được hiển thị, **THEN** hệ thống phải hiển thị video responsive, có kích thước tương tác hợp lệ và không autoplay.
3. **WHEN** player phát video, **THEN** hệ thống phải hiển thị hành động `Con cần nghỉ` và `Dừng buổi tập`.
4. **WHEN** player báo trạng thái kết thúc video, **THEN** hệ thống phải cho phép bước xác nhận hoàn thành.
5. **IF** player lỗi, video bị chặn embed hoặc mất mạng trước khi hoàn thành, **THEN** hệ thống phải hiển thị trạng thái lỗi thân thiện và không cấp thưởng.
6. **WHEN** offline, **THEN** hệ thống phải cho biết cần Internet để xem video.

## REQ-05 — Mission completion and rewards

**User story:** Là một bé, con muốn nhận quà sau khi hoàn thành để trang trí nhà cho bạn thú.

### Acceptance criteria
1. **WHEN** video đã kết thúc và người dùng xác nhận hoàn thành mission chưa từng hoàn thành, **THEN** hệ thống phải lưu completion, cộng số sao cấu hình và mở khóa vật phẩm cấu hình.
2. **WHEN** hoàn thành thành công, **THEN** hệ thống phải điều hướng đến reward reveal screen.
3. **WHEN** mission đã hoàn thành được phát/xác nhận lại, **THEN** hệ thống không được cộng thêm sao hoặc mở khóa trùng vật phẩm.
4. **WHEN** reward reveal hiển thị, **THEN** bé phải có thể chọn `Trang trí ngay` hoặc `Về nhà`.
5. **IF** state local bị lỗi hoặc completion không hợp lệ, **THEN** app phải fail safely, không cấp thưởng ngoài ý muốn.

## REQ-06 — Fixed-slot room decoration

**User story:** Là một bé, con muốn đặt món đồ đã nhận vào phòng của bạn thú để nhìn thấy thành quả của mình.

### Acceptance criteria
1. **WHEN** bé mở trang phòng, **THEN** hệ thống phải hiển thị room background, nhân vật và các vật phẩm đang trang bị.
2. **WHEN** bé chọn một slot, **THEN** hệ thống chỉ hiển thị các item đã mở khóa và tương thích với slot đó.
3. **WHEN** bé chọn một item hợp lệ, **THEN** hệ thống phải đặt item vào slot và lưu layout locally ngay lập tức.
4. **WHEN** app reload, **THEN** room layout đã lưu phải còn hiển thị.
5. **WHEN** không có item phù hợp đã mở khóa, **THEN** app phải hiển thị thông điệp tích cực hướng bé về nhiệm vụ tiếp theo.

## REQ-07 — Character accessories

**User story:** Là một bé, con muốn mặc phụ kiện cho bạn thú để cá nhân hóa nhân vật.

### Acceptance criteria
1. **WHEN** mở wardrobe, **THEN** hệ thống phải hiển thị phụ kiện đã mở khóa và trạng thái đang sử dụng.
2. **WHEN** chọn phụ kiện tương thích, **THEN** hệ thống phải equip nó lên nhân vật và lưu locally.
3. **WHEN** bỏ phụ kiện, **THEN** nhân vật trở lại trạng thái mặc định tương ứng.
4. **WHEN** home hoặc room hiển thị nhân vật, **THEN** phụ kiện đang equip phải xuất hiện.

## REQ-08 — Parent area and reset

**User story:** Là phụ huynh, tôi muốn xem tiến độ và reset an toàn mà bé không vô tình thao tác nhầm.

### Acceptance criteria
1. **WHEN** từ child flow muốn mở parent area, **THEN** hệ thống phải yêu cầu adult-friction interaction đơn giản, ví dụ giữ nút trong 3 giây.
2. **WHEN** parent area mở, **THEN** hệ thống phải hiển thị nhân vật, lịch sử mission hoàn thành, tổng sao, item đã mở và safety note của mission tiếp theo.
3. **WHEN** phụ huynh chọn reset, **THEN** hệ thống phải hiển thị bước xác nhận rõ ràng trước khi xóa state.
4. **WHEN** reset được xác nhận, **THEN** hệ thống phải xóa local progress và đưa ứng dụng về onboarding.
5. Hệ thống phải ghi rõ adult-friction không phải cơ chế bảo mật đăng nhập.

## REQ-09 — Installable PWA and offline shell

**User story:** Là phụ huynh, tôi muốn ghim app vào màn hình chính để bé mở như một ứng dụng quen thuộc.

### Acceptance criteria
1. **WHEN** app được deploy qua HTTPS, **THEN** app phải cung cấp manifest hợp lệ, icon, theme/background color và standalone display.
2. **WHEN** người dùng cài app và mở từ màn hình chính, **THEN** app phải mở được trong trải nghiệm standalone theo khả năng của nền tảng.
3. **WHEN** app shell/local asset đã được tải trước đó và thiết bị offline, **THEN** home/room/progress local phải mở được hoặc hiển thị offline fallback rõ ràng.
4. **WHEN** offline và mission cần video, **THEN** hệ thống phải thông báo video cần Internet.
5. Service worker không được cache YouTube iframe/player/video resources.

## REQ-10 — Content configuration and validation

**User story:** Là developer/phụ huynh, tôi muốn thay video và asset an toàn mà không sửa logic ứng dụng.

### Acceptance criteria
1. Hệ thống phải lưu catalog nhân vật, mission và item trong các seed data module tách biệt với UI logic.
2. **WHEN** mission dùng placeholder video ID, **THEN** hệ thống phải chặn playback flow thực tế và chỉ dẫn thay video.
3. **WHEN** seed data không hợp lệ, **THEN** validation phải phát hiện và hiển thị lỗi cấu hình an toàn.
4. README phải hướng dẫn vị trí thay bảy video IDs và quy trình duyệt video trước khi bé dùng.

---

## 4. Non-functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Mobile-first portrait layout, usable on common phones and tablets. |
| NFR-02 | Primary touch controls minimum 48px in height/target dimension. |
| NFR-03 | Child-facing language is concise Vietnamese and avoids guilt/pressure. |
| NFR-04 | No camera, microphone, analytics, ad SDK, payment or remote child-progress collection in MVP. |
| NFR-05 | State actions are idempotent where rewards are involved. |
| NFR-06 | App must respect reduced-motion preference for celebratory animations. |
| NFR-07 | TypeScript strict checks, lint, unit tests and core E2E happy path pass before release. |
| NFR-08 | App deploys successfully to Vercel without private runtime secrets in MVP. |

## 5. Traceability Summary

| Capability | Requirement IDs |
|---|---|
| Start journey | REQ-01, REQ-02 |
| Safe exercise video flow | REQ-03, REQ-04 |
| Motivation loop | REQ-05, REQ-06, REQ-07 |
| Parent control | REQ-08 |
| App installation/offline | REQ-09 |
| Safe configurable content | REQ-10 |
