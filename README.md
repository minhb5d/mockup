# Mockup Quản lý án GĐT/TT — Vụ Giám đốc, Kiểm tra (bản TANDTC)

Mockup React cho phân hệ **Giám đốc thẩm / Tái thẩm**, nghiệp vụ **Vụ Giám đốc, Kiểm tra (GĐ,KT)**
của hệ thống Quản lý án — TAND tối cao.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bắt buộc pass trước khi tạo PR
```

Stack: Vite 6 + React 18 + TypeScript. Style viết inline (không dùng CSS module).
Icon: `lucide-react`. Biểu đồ: `recharts` (đã có sẵn trong dependencies).

## Mục tiêu hiện tại

Sửa mockup cho khớp **SRS Vụ GĐ,KT** (`SRS/2. Giám đốc, Kiểm tra`).
Toàn bộ khối lượng công việc đã được liệt kê thành **606 mục** trong:

| File | Nội dung |
|---|---|
| `docs/DOI-CHIEU-SRS-MOCKUP.xlsx` | Bảng làm việc — 606 mục, lọc theo Module / Loại / Người xử lý |
| `docs/DOI-CHIEU-SRS-MOCKUP.md` | Bản chi tiết đọc theo module, có dẫn chiếu SRS và file:dòng |
| `docs/PHAN-CONG-CONG-VIEC.md` | **Đọc file này trước** — chia việc, sở hữu file, quy tắc git |
| `docs/CAU-HOI-CHO-BA.md` | Các điểm SRS mâu thuẫn/bỏ lửng đang chờ BA trả lời |

Quy ước 4 loại mục:

- **THIẾU** (276) — SRS có, mockup chưa có → bổ sung
- **LỆCH** (149) — cả hai đều có nhưng khác nhau → sửa theo SRS
- **THỪA** (84) — mockup có, SRS không mô tả → **KHÔNG tự xoá**, note lại hỏi Lead
- **CẦN HỎI** (97) — bản thân SRS mâu thuẫn hoặc bỏ lửng → chờ BA, chưa làm

## Phạm vi

Chỉ Vụ GĐ,KT cấp **TANDTC**. Không làm VPHCTP (`SRS/1.1`, `SRS/1.2`).
Nhóm tài liệu cấp Tỉnh (`SRS/2/4. GĐ,KT Tỉnh`) để dành cho giai đoạn sau, hiện **không áp** vào mockup này.
