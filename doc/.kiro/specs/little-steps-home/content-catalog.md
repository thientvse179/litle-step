# MVP Content Catalog — Characters, Missions and Items

## 1. Purpose

File này là nguồn tham chiếu cho Kiro khi tạo seed content trong `src/data/`. Đây chưa phải video/asset thật; phụ huynh cần thay video placeholder và duyệt nội dung trước khi bé dùng.

## 2. Characters

| ID | Tên hiển thị | Mô tả cho bé | Room theme |
|---|---|---|---|
| `rabbit-cloud` | Thỏ Mây | Thích nhảy và trồng hoa | Phòng cầu vồng pastel |
| `bear-honey` | Gấu Mật | Thích vận động và khám phá | Phòng gỗ ấm áp |
| `cat-star` | Mèo Sao | Thích giữ thăng bằng và ngắm trời | Phòng sao dịu nhẹ |

## 3. Mission catalog

| ID | Buổi | Tên bé nhìn thấy | Story intro | Duration placeholder | Video ID placeholder | Stars | Reward item | Safety note |
|---|---:|---|---|---:|---|---:|---|---|
| `mission-day-01` | 1 | Bước Chân Đầu Tiên | Bạn thú vừa vào nhà mới. Con cùng vận động để trải chiếc thảm đầu tiên nhé! | 7 phút | `VIDEO_ID_TO_BE_SUPPLIED_01` | 2 | `rug-rainbow` | Tập trên nền không trơn, có người lớn bên cạnh. |
| `mission-day-02` | 2 | Vượt Suối Lấp Lánh | Hôm nay bạn thú cần chiếc giường êm sau chuyến phiêu lưu. | 8 phút | `VIDEO_ID_TO_BE_SUPPLIED_02` | 2 | `bed-cloud` | Quan sát bé nếu bài có động tác nhảy. |
| `mission-day-03` | 3 | Leo Đồi Tìm Sao | Cùng tìm chiếc đèn sao để phòng sáng lung linh. | 7 phút | `VIDEO_ID_TO_BE_SUPPLIED_03` | 2 | `lamp-star` | Cho bé nghỉ nếu thấy mệt hoặc khó chịu. |
| `mission-day-04` | 4 | Giữ Cầu Thật Vững | Con giúp bạn thú mở chiếc cửa sổ nhìn ra vườn nhé. | 8 phút | `VIDEO_ID_TO_BE_SUPPLIED_04` | 2 | `window-magic` | Cần người lớn quan sát nếu có giữ thăng bằng. |
| `mission-day-05` | 5 | Vũ Điệu Trong Vườn | Một chậu cây nhỏ sẽ làm căn phòng tươi vui hơn. | 9 phút | `VIDEO_ID_TO_BE_SUPPLIED_05` | 3 | `plant-happy` | Chừa đủ không gian vận động xung quanh bé. |
| `mission-day-06` | 6 | Đường Đua Vui Vẻ | Bạn thú muốn đội chiếc mũ đặc biệt để đi khám phá. | 8 phút | `VIDEO_ID_TO_BE_SUPPLIED_06` | 3 | `hat-adventure` | Dừng nếu bé trượt chân hoặc thấy đau. |
| `mission-day-07` | 7 | Mở Rương Kho Báu | Hoàn thành hành trình để mở rương quà trong phòng! | 10 phút | `VIDEO_ID_TO_BE_SUPPLIED_07` | 4 | `toy-treasure-chest` | Phụ huynh cùng bé hoàn thành buổi cuối thật vui. |

## 4. Item catalog

### Room decoration items

| ID | Tên hiển thị | Slot ID | Unlock type | Mission |
|---|---|---|---|---|
| `rug-rainbow` | Thảm cầu vồng | `floor-rug` | mission | `mission-day-01` |
| `bed-cloud` | Giường đám mây | `bed` | mission | `mission-day-02` |
| `lamp-star` | Đèn ngôi sao | `lamp` | mission | `mission-day-03` |
| `window-magic` | Cửa sổ phép thuật | `window` | mission | `mission-day-04` |
| `plant-happy` | Chậu cây vui vẻ | `plant` | mission | `mission-day-05` |
| `toy-treasure-chest` | Rương kho báu | `toy` | mission | `mission-day-07` |

### Character accessories

| ID | Tên hiển thị | Accessory category | Unlock type | Mission |
|---|---|---|---|---|
| `hat-adventure` | Mũ phiêu lưu | `headwear` | mission | `mission-day-06` |

## 5. Future optional star-redemption items — not required in MVP

Chỉ triển khai nếu phần bắt buộc đã hoàn thành và được duyệt scope.

| ID | Item | Cost |
|---|---|---:|
| `wall-art-butterfly` | Tranh bươm bướm | 5 sao |
| `toy-teddy` | Gấu bông nhỏ | 6 sao |
| `glasses-star` | Kính ngôi sao | 8 sao |

## 6. Video replacement checklist

Trước khi thay `VIDEO_ID_TO_BE_SUPPLIED_*`:
- [ ] Phụ huynh đã xem hết video.
- [ ] Nội dung tập trung vào vận động phù hợp với bé.
- [ ] Thời lượng không quá dài đối với buổi tập dự kiến.
- [ ] Bài không yêu cầu thiết bị hoặc thao tác nguy hiểm ngoài dự kiến.
- [ ] Đã xác định ghi chú an toàn tương ứng.
- [ ] Video phát được qua embedded player.
- [ ] Link/video không dẫn bé vào nội dung không phù hợp khi sử dụng thực tế.
