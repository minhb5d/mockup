# CHATBOT FIX GUIDE — LANE B / THIẾU — Vụ GĐ,KT

## 1. Mục tiêu
Tiếp tục phát triển mockup Vụ GĐ,KT từ source trong ZIP này. Bản source đã được patch theo danh sách `LANE_B_MISSING_CASES_SOURCE.md` ở mức mockup tương tác (React state/local mock data).

## 2. Phạm vi cứng
- Chỉ xử lý các case `Loại = THIẾU` trong `LANE_B_MISSING_CASES_SOURCE.md`.
- Tổng danh sách nguồn: 118 case THIẾU.
- **Case số 18 — “Popup xác nhận Hủy ghép vụ án” — CỐ Ý CHƯA FIX.** Không tạo modal, không nối handler, không thay đổi flow này cho tới khi Lead chốt.
- Không tự thêm nghiệp vụ VPHCTP.
- Không tự đổi requirement vì suy luận nghiệp vụ/pháp luật.
- Không tự xóa chức năng ngoài scope.
- Nếu có mâu thuẫn SRS: ghi `BLOCKED / HỎI LEAD`, không tự chọn một phía.

## 3. Baseline nghiệp vụ
Khi cần xác minh thêm requirement, chỉ dùng **SRS GĐ,KT trực tiếp trên Drive**. Không dùng các file master/canonical `.md` làm nguồn chuẩn.

## 4. Các file chính đã sửa
- `src/app/NhanDonTLVuAnView.tsx`
- `src/app/NhanDonModals.tsx`
- `src/app/SearchFilterPanel.tsx`
- `src/app/PhanCongTTVView.tsx`
- `src/app/PhanCongThamPhanView.tsx`
- `src/app/App.tsx`
- `src/app/HoSoKhangNghiView.tsx`
- `src/app/HoSoTuHinhView.tsx`
- `src/app/CongVanTraoDoiView.tsx`
- `src/app/AnBaoCaoViews.tsx`
- `src/app/PhanCongTPTCView.tsx`
- `src/app/data.ts`
- `src/app/QuanLyVuAnView.tsx`
- `src/app/AppHelpers.tsx`

## 5. Map chức năng đã patch
### Nhận đơn & Thụ lý vụ án
- Popup Trả đơn, Ghép vụ án, Chuyển vụ án.
- Form Thêm mới vụ án thật + validation + cảnh báo đóng chưa lưu + tra cứu BA/QĐ mock.
- Tạo tờ trình ở Chờ xin ý kiến, field tờ trình trong filter/list, metadata công văn, người đứng đơn/đương sự, LĐV/trạng thái THS, tổng đơn, empty state.
- Giao THS: format người giao/nhận và đủ trạng thái filter.
- **Không triển khai Hủy ghép (case 18).**

### Phân công TTV
- Combobox TTV/LĐV + ngày phân công theo từng dòng.
- Auto-fill LĐV theo cấu hình mẫu, tag/gợi ý phân công trước, ngày nhận THS, cảnh báo thời hiệu, validate 4 trường, warning chưa lưu, sắp xếp mặc định.

### Phân công Thẩm phán
- Màn quản lý kết quả theo lịch sử lần phân công.
- Popup sửa kết quả, bắt buộc người yêu cầu/lý do khi đổi TP.
- Bộ cột theo hình thức, HSKN/tử hình/CV, hủy kết quả trả hồ sơ về chưa phân công, filter candidate TP, warning chưa lưu.

### Cấu hình hệ thống
- Danh sách Tổ/Nhóm + popup thêm/sửa/gán thành viên ở mức mock.
- Danh mục cấp trình.
- Dirty state / cảnh báo chưa lưu / người thao tác / preview in / tìm kiếm.

### Hồ sơ kháng nghị
- Form xử lý/nhập-sửa 6 tab.
- Popup Nhận hồ sơ, Xác nhận chuyển hồ sơ.
- Tách dữ liệu/filter HSKN đến/đi, trạng thái Đã trả, thông tin phát hành, scan hồ sơ, action dòng, in danh sách.

### Hồ sơ tử hình
- Thêm mới hồ sơ tử hình, BA/QĐ liên quan, trạng thái lưu, progress nhiều chỉ tiêu.
- Cột Bị án ở các bảng quyết định/tờ trình, popup VKS/QĐ, trình duyệt, nơi nhận, lịch sử bàn giao, empty state và download condition.

### Công văn trao đổi
- Tra cứu BA/QĐ khi tạo CV.
- Tìm/chọn CV được trả lời và lưu liên kết trong mock state.
- Phân công TTV/ngày PC, giai đoạn lịch sử, trình lại, đính kèm CV đi.
- Trình duyệt, lấy/hủy số ở KQGQ, nơi nhận phụ thuộc danh mục, limit 2.000 ký tự.

### Án Quốc hội & Án thời hiệu
- Options cho combobox, nút Tìm kiếm, tiêu đề báo cáo động, Tính đến ngày, trạng thái giải quyết mẫu, tên Tòa/Vụ theo context mock thay vì ô rỗng.

### Danh sách vụ án phân công TPTC
- Popup tờ trình mở rộng theo nhóm field SRS, lấy/hủy số, nơi nhận.
- In danh sách, thời hiệu/cảnh báo, nhãn án, link xem tờ trình GQ, Ngày ký, Word/PDF theo trạng thái, filter label theo loại án, auto-fill BA/QĐ, sort mặc định.

## 6. Quy tắc khi bot khác code tiếp
1. Đọc `LANE_B_MISSING_CASES_SOURCE.md` trước khi sửa.
2. Đọc `LANE_B_MISSING_CHANGES.patch` để biết các thay đổi đã có; không viết lại component theo phong cách khác nếu không cần.
3. Giữ mock state nhất quán; không thêm backend/API giả không được yêu cầu.
4. Không hard-code flow trái SRS chỉ để nút “có vẻ chạy”. Validation và state transition phải đi cùng UI.
5. Không duplicate component. Nếu đã có component/modal dùng chung thì reuse.
6. Case 18 phải tiếp tục ở trạng thái `SKIPPED / HỎI LEAD`.
7. Trước khi bàn giao: parse toàn bộ `.ts/.tsx`, kiểm diff và chạy build nếu dependencies đầy đủ.

## 7. QA hiện tại
Xem `LANE_B_MISSING_QA_REPORT.txt`.
