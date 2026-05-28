# Nhà Nhỏ Vận Động — Bộ tài liệu import vào Kiro

## 1. Mục đích

Bộ tài liệu này mô tả đầy đủ MVP cho một ứng dụng PWA dành cho bé:

- Bé chọn một nhân vật đồng hành.
- Bé tập chân theo video YouTube do phụ huynh đã duyệt.
- Bé nhận sao và vật phẩm sau khi hoàn thành.
- Bé dùng vật phẩm để trang trí phòng hoặc đeo phụ kiện cho nhân vật.
- Ứng dụng deploy trên Vercel và có thể cài ra màn hình chính như app.

Tên làm việc của ứng dụng: **Nhà Nhỏ Vận Động**  
Project slug: `little-steps-home`

## 2. Các file trong bộ tài liệu

```text
little-steps-home-kiro/
├─ 00_README_IMPORT_TO_KIRO.md
├─ KIRO_BUILD_PROMPT.md
├─ KIRO_MASTER_PLAN_LITTLE_STEPS_HOME.md
└─ .kiro/
   ├─ steering/
   │  ├─ product.md
   │  ├─ tech.md
   │  ├─ structure.md
   │  └─ child-safety-and-content.md
   └─ specs/
      └─ little-steps-home/
         ├─ requirements.md
         ├─ design.md
         ├─ tasks.md
         ├─ content-catalog.md
         └─ release-checklist.md
```

## 3. Cách dùng nhanh trong Kiro

### Trường hợp A — Tạo project mới

1. Tạo thư mục project mới, ví dụ `little-steps-home`.
2. Copy toàn bộ nội dung trong ZIP này vào thư mục project, đặc biệt giữ nguyên thư mục ẩn `.kiro`.
3. Mở thư mục project bằng Kiro.
4. Mở chat trong Kiro và paste nội dung file `KIRO_BUILD_PROMPT.md`.
5. Yêu cầu Kiro đọc các file steering/spec trước khi viết code.
6. Bắt đầu triển khai theo thứ tự task trong `.kiro/specs/little-steps-home/tasks.md`.

### Trường hợp B — Đã có project Next.js rỗng

1. Copy thư mục `.kiro/` và các file Markdown ở root vào project hiện có.
2. Mở `tasks.md`, đánh dấu task bootstrap nào đã hoàn thành.
3. Paste prompt trong `KIRO_BUILD_PROMPT.md`.
4. Cho Kiro kiểm tra codebase hiện tại so với `design.md` trước khi triển khai tiếp.

## 4. Nguyên tắc build bắt buộc

- MVP là **local-first**, không có login và không có Supabase.
- Chỉ nhúng video sau khi bé/phụ huynh bấm bắt đầu.
- Video YouTube dùng privacy-enhanced embed (`youtube-nocookie.com`).
- Không dùng camera, micro, AI nhận diện động tác hay thu thập thông tin của bé.
- Không có quảng cáo, tracking, bảng xếp hạng, phần thưởng ngẫu nhiên hoặc cơ chế phạt khi bé không tập.
- Phần thưởng của một nhiệm vụ chỉ được cấp **một lần**.
- Trang trí phòng dùng **slot cố định**, không cần kéo-thả tự do ở MVP.

## 5. Những dữ liệu cần thay trước khi bé dùng thật

| Dữ liệu | Hiện trạng | Cần làm |
|---|---|---|
| 7 video YouTube | Placeholder trong content catalog | Phụ huynh xem toàn bộ, chọn video phù hợp, kiểm tra có nhúng được |
| Logo/icon app | Placeholder | Chốt phong cách hình ảnh |
| Nhân vật và nội thất | Placeholder/gợi ý | Tạo asset thuộc quyền sử dụng của bạn |
| Vercel project | Chưa tạo | Deploy sau khi flow end-to-end chạy ổn |

## 6. Tài liệu chính thức tham khảo

- Kiro Specs: `https://kiro.dev/docs/specs/`
- Kiro Steering: `https://kiro.dev/docs/steering/`
- Next.js PWA Guide: `https://nextjs.org/docs/app/guides/progressive-web-apps`
- YouTube IFrame Player API: `https://developers.google.com/youtube/iframe_api_reference`
- YouTube Privacy-Enhanced Embed: `https://support.google.com/youtube/answer/171780`
