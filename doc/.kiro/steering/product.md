---
inclusion: always
---

# Product Steering — Nhà Nhỏ Vận Động

## Product vision

**Nhà Nhỏ Vận Động** là PWA cho bé tập vận động chân theo các video YouTube đã được phụ huynh duyệt. Trải nghiệm biến một buổi tập thành hành trình chăm sóc bạn thú: bé chọn nhân vật, hoàn thành nhiệm vụ, nhận quà và trang trí căn phòng của nhân vật.

## Product promise

> Bé cảm thấy mình đang giúp bạn thú xây một ngôi nhà đáng yêu, thay vì đang phải hoàn thành một danh sách bài tập.

## Primary users

### Bé
- Độ tuổi mục tiêu: tiểu học.
- Dùng tablet hoặc điện thoại ở chế độ portrait.
- Đọc được câu ngắn; cần icon, hình ảnh và nút lớn.
- Không nên gặp menu phức tạp, quảng cáo hoặc link dẫn đi ngoài luồng tập.

### Phụ huynh
- Cài PWA lên thiết bị.
- Chọn, xem trước và thay video thật.
- Quan sát bé khi có động tác nhảy/giữ thăng bằng.
- Xem tiến độ cơ bản hoặc reset dữ liệu cục bộ.

## MVP user loop

```text
Chọn bạn thú
→ Xem căn phòng ban đầu
→ Chọn nhiệm vụ hôm nay
→ Tập theo video đã duyệt
→ Xác nhận hoàn thành
→ Nhận sao + vật phẩm
→ Trang trí phòng / đeo phụ kiện
→ Quay lại tập trong lần tiếp theo
```

## MVP scope

### Included
- Cài được như PWA và deploy Vercel.
- Một tiến trình bé lưu trên một thiết bị.
- Ba nhân vật starter.
- Một phòng chính với slot nội thất cố định.
- Bảy nhiệm vụ/video mẫu cho vòng trải nghiệm đầu.
- Privacy-enhanced YouTube player tải sau thao tác bắt đầu.
- Sao, mở khóa đồ phòng và một số phụ kiện nhân vật.
- Parent area đơn giản: lịch sử, ghi chú an toàn, reset.

### Excluded
- Login, backend, Supabase, cloud sync, nhiều hồ sơ bé.
- CMS hoặc import Google Sheet.
- Camera, micro, AI đánh giá động tác.
- Quảng cáo, tracking, payment, shop mua tiền thật.
- Leaderboard, social sharing, loot box/random reward.
- Push notification.
- Kéo thả nội thất tự do.

## Tone and copy rules

- Ngôn ngữ hiển thị cho bé: tiếng Việt, câu ngắn, vui vẻ.
- CTA khuyến nghị: `Tập hôm nay`, `Bắt đầu`, `Con cần nghỉ`, `Nhận quà`, `Trang trí ngay`, `Về nhà`.
- Luôn khuyến khích nhẹ nhàng, không ép buộc.
- Tuyệt đối không dùng thông điệp gây tội lỗi như “Bạn thú buồn vì con không tập”.
- Không dùng thông điệp về cân nặng, hình thể hoặc cạnh tranh.

## Success criteria

MVP thành công khi:

1. Phụ huynh cài app lên màn hình chính và mở lại ở chế độ standalone.
2. Bé hoàn tất được flow chọn nhân vật → xem video → nhận quà → trang trí phòng.
3. Tiến độ còn nguyên sau khi đóng/mở lại app trên cùng thiết bị.
4. Video lỗi hoặc chưa cấu hình không thể cấp thưởng nhầm.
5. Trải nghiệm không thu thập dữ liệu nhạy cảm và không tạo áp lực cho bé.
