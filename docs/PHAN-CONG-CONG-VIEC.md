# PHÂN CÔNG CÔNG VIỆC — Sửa mockup theo SRS Vụ GĐ,KT

**Ngày lập:** 27/08/2026 · **Tổng khối lượng:** 606 mục (276 THIẾU · 149 LỆCH · 84 THỪA · 97 CẦN HỎI)

---

## 1. Nguyên tắc chia: chia theo FILE, không chia theo module

Merge conflict chỉ xảy ra khi hai người sửa **cùng một file**. Mockup này có mấy file đa nghiệp vụ:

- `QuanLyVuAnView.tsx` (3.409 dòng) — chứa danh sách vụ án **+** màn chi tiết **+** tab Tờ trình
  **+** popup tạo phiếu mượn/trả hồ sơ, và bị 3 module dùng chung.
- `App.tsx` (3.405 dòng) — chứa routing **+** màn Cấu hình TTV **+** màn Giao tiểu hồ sơ **+** code chết.

Nếu chia theo module thì hai người sẽ đụng nhau ở đúng hai file này suốt cả dự án. Vì vậy:
**các module dùng chung một file phải thuộc cùng một lane**, và trước khi tách nhánh phải chạy
**Phase 0** để tách hai file khổng lồ trên thành file con.

---

## 2. Phase 0 — làm trước, merge vào `main` trước khi tách nhánh

Do một người làm, không chia. Nội dung:

1. `git init` + commit baseline nguyên trạng (đã xong: commit `37e24c6`)
2. Dọn **15 lỗi kỹ thuật** ở phụ lục `DOI-CHIEU-SRS-MOCKUP.md` — code chết, lệch số cột giữa
   `<colgroup>` và header, `Math.random()` trong render, tab không lọc gì…
3. **Tách file lớn** để hai lane có ranh giới sạch:
   - `App.tsx` → tách ra `CauHinhTTVView.tsx`, `GiaoTieuHoSoView.tsx`; `App.tsx` chỉ còn routing
   - `QuanLyVuAnView.tsx` → tách ra `TabToTrinh.tsx`
4. Thêm `README.md`, `AGENTS.md`, `CLAUDE.md`, thư mục `docs/`
5. `npm run build` pass → push `main`

Sau Phase 0 mới tạo nhánh. **Không ai bắt đầu trước khi Phase 0 lên `main`.**

### Kết quả Phase 0 (commit `289189f`)

| Trước | Sau | |
|---|---|---|
| 42.605 dòng | **38.818 dòng** | xoá 3.787 dòng code chết |
| `App.tsx` 3.405 dòng | **315 dòng** | chỉ còn routing; **không file nào import từ `./App` nữa** |
| `QuanLyVuAnView.tsx` 3.409 dòng | **2.527 dòng** | tách cụm Tờ trình ra `TabToTrinh.tsx` |
| `QuanLyVuXetXuView.tsx` 6.924 dòng | **6.328 dòng** | xoá 5 component chết |

3 file mới sinh ra ở Phase 0: `CauHinhTTVView.tsx`, `GiaoTieuHoSoView.tsx` (Lane B),
`TabToTrinh.tsx` (Lane A). 3 helper `getPartyLabels` / `isVu234` / `getQuanHePhapLuat`
chuyển từ `App.tsx` sang `AppHelpers.tsx`.

Hai mục trong danh sách 15 lỗi được **chuyển thành TODO trong code** thay vì sửa ở Phase 0,
vì muốn sửa đúng thì phải áp quy tắc SRS (là việc của lane tương ứng):
tab "Quá hạn giải quyết" của Quản lý khiếu nại, và `ChonHoSoModal` trong Hồ sơ kháng nghị.

---

## 3. Chia lane

### Lane A — Kevin (Claude) · ~295 mục

Cụm nghiệp vụ lõi, rối nhất, bám SRS sâu nhất. Ít file nhưng file to.

| # | Module | Số mục | SRS nguồn |
|---|---|---|---|
| 2 | Quản lý vụ giải quyết đơn (danh sách + chi tiết) | 85 | `1. GĐ,KT - Vụ GQĐ/SRS_Danh sách vụ án`, `2. Xem chi tiết vụ giải quyết đơn` |
| 3 | Tờ trình | 51 | `1. GĐ,KT - Vụ GQĐ/4. SRS_Tờ trình_Vụ GQĐ`, `5. Cấu hình/SRS_Danh mục cấp trình` |
| 4 | Vụ xét xử GĐT/TT | 60 | `2. GĐ,KT - Vụ xét xử` (4 file) |
| 5 | Quản lý khiếu nại | 43 | `3. Vụ khiếu nại` (2 file) |
| 15 | Dashboard Vụ GĐ,KT | 26 | `3. Dashboard/Dashboard Vụ GĐ,KT` |
| 16 | Quản lý vụ án tổng hợp | 30 | `1. GĐ,KT - Vụ GQĐ/6. Quản lý vụ án tổng hợp` |

**File thuộc Lane A:**
`QuanLyVuAnView.tsx` · `TabToTrinh.tsx` (tách ở Phase 0) ·
`TabThongTin.tsx` · `TaiLieuHoSoView.tsx` · `HoSoLuuTruView.tsx` · `VuAnSearchFilterPanel.tsx` ·
`ThemKetQuaModal.tsx` · `TaoDuThaoModal.tsx` · `TrinhKyModal.tsx` · `PheDuyetDeXuatView.tsx` ·
`QuanLyKhieuNaiView.tsx` · `QuanLyVuXetXuView.tsx` · `PhanCongHDXXView.tsx`
*(file mới)* `DashboardView.tsx` · `VuAnTongHopView.tsx`

### Lane B — teammate (Codex) · ~279 mục

Các màn độc lập, mỗi màn gần như gói gọn trong một file. Đầu việc rõ ràng, ít phụ thuộc chéo —
hợp với cách làm việc theo checklist.

| # | Module | Số mục | SRS nguồn |
|---|---|---|---|
| 1 | Màn nhận đơn và thụ lý vụ án | 51 | `1. [GĐ,KT] Màn nhận đơn và thụ lý vụ án` |
| 6 | Phân công Thẩm tra viên | 22 | `3. [GĐ,KT] Phân công Thẩm tra viên` |
| 7 | Phân công Thẩm phán | 30 | `4.[GĐ,KT] Phân công TP` |
| 8 | Cấu hình hệ thống | 16 | `5. Cấu hình hệ thống` (3 file) |
| 9 | Hồ sơ kháng nghị | 41 | `2. [GĐ,KT] Hồ sơ kháng nghị` |
| 10 | Hồ sơ tử hình + Đơn xin ân giảm | 49 | `1. GĐ,KT - Vụ GQĐ/5. Hồ sơ tử hình` |
| 11 | Công văn trao đổi | 28 | `1. GĐ,KT - Vụ GQĐ/7. Công văn trao đổi` |
| 12 | Án Quốc hội & Án thời hiệu | 16 | `1. GĐ,KT - Vụ GQĐ/8. Án Quốc Hội & Án thời hiệu` |
| 13 | Danh sách vụ án phân công TPTC | 26 | `1. GĐ,KT - Vụ GQĐ/3. Danh sách vụ án phân công TPTC` |

**File thuộc Lane B:**
`NhanDonTLVuAnView.tsx` · `SearchFilterPanel.tsx` · `PhanCongTTVView.tsx` ·
`PhanCongThamPhanView.tsx` · `PhanCongTPTCView.tsx` · `HoSoKhangNghiView.tsx` ·
`HoSoTuHinhView.tsx` · `CongVanTraoDoiView.tsx` · `AnBaoCaoViews.tsx` ·
`CauHinhTTVView.tsx` (tách ở Phase 0) · `GiaoTieuHoSoView.tsx` (tách ở Phase 0)
*(file mới)* `DanhSachToNhomView.tsx` · `DanhMucCapTrinhView.tsx`

### Module 14 — In báo cáo (32 mục): chia đôi

Chức năng In báo cáo rải khắp mọi màn nên không gán cho một lane được.

- **Lane A dựng component dùng chung `PrintReportModal.tsx`** ngay đầu, merge vào `main` sớm:
  popup chọn "Loại danh sách" → hiện bộ tiêu chí tương ứng → preview → tải Docs / in.
- Sau đó **mỗi lane tự nối In báo cáo cho các màn của mình**, dùng lại component đó.
- Bộ tiêu chí của từng loại danh sách nằm ở `SRS/1. [GĐ,KT] In BC` mục A, B, C, F.

### Vùng dùng chung (không thuộc lane nào)

`App.tsx` (chỉ còn routing sau Phase 0) · `Sidebar.tsx` · `shared.tsx` · `data.ts` · `src/styles/*`

Quy tắc sửa: xem `AGENTS.md` mục 3 — PR riêng, nhỏ, merge trong ngày, báo nhau trước, chỉ thêm không xoá.

---

## 4. Thứ tự làm trong mỗi lane

Cả hai lane làm theo cùng một trình tự để dễ đồng bộ tiến độ:

1. **Vòng 1 — LỆCH nhãn & danh mục combobox.** Sửa nhanh, ít rủi ro, thấy kết quả ngay. Lọc cột
   *Loại = LỆCH* trong file xlsx. Riêng nhóm này gộp được vào ít PR.
2. **Vòng 2 — THIẾU mức [Cao].** Các popup/màn còn trống hoàn toàn. Đây là phần nặng nhất.
3. **Vòng 3 — THIẾU mức [TB] và [Thấp].**
4. **Vòng 4 — In báo cáo cho các màn của mình.**

Riêng Lane A: **Dashboard (15) và Vụ án tổng hợp (16) để cuối cùng** — cả hai đang chờ chốt phạm vi
(xem `CAU-HOI-CHO-BA.md` mục B1 và B5). Dựng trước mà sai phạm vi thì phí công.

---

## 5. Nhịp merge

- Xong **một module** → tạo PR → merge vào `main` ngay, không để dồn.
- Sau mỗi lần `main` có commit mới, cả hai chạy `git pull --rebase origin main`.
- Mỗi tuần chốt một lần: hai bên cùng rà `git log main --oneline` và cập nhật cột **Trạng thái**
  trong file xlsx.

## 6. Việc đang bị chặn — chưa ai làm

- **84 mục THỪA** — chờ Lead chốt giữ hay bỏ. Trong đó tách 2 nhóm:
  - Mockup làm cái **SRS đã gạch bỏ** (tab "DS chưa phân công ngẫu nhiên", cột "Giai đoạn"/"Chức danh"
    ở các bảng phân công, trường "Cán bộ" popup tạo phiếu…) → nhiều khả năng mockup dựng theo SRS bản cũ.
  - Mockup làm cái **SRS chưa có** (màn soạn thảo Word + tạo công văn trong Hồ sơ kháng nghị, tab
    "Tờ trình" và tab "Hồ sơ" của Hồ sơ tử hình mà SRS ghi "Nội dung đặc tả: Bỏ trống", tab "Tài liệu
    vụ án"/"Hồ sơ lưu trữ", thanh chọn 4 Vụ) → hỏi là yêu cầu mới hay vẽ dư.
- **97 mục CẦN HỎI** — SRS tự mâu thuẫn hoặc bỏ lửng, chờ BA. Xem `CAU-HOI-CHO-BA.md`.

Hai nhóm này **để nguyên trong code**, không sửa, không xoá, cho tới khi có câu trả lời.
