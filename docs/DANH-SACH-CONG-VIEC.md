# DANH SÁCH ĐẦU VIỆC — Sửa mockup GĐT/TT theo SRS Vụ GĐ,KT

Lập ngày 27/08/2026. Một dòng = một đầu việc = một nhánh git = một Pull Request.
Cột *Số mục* là số mục trong `DOI-CHIEU-SRS-MOCKUP.xlsx` thuộc đầu việc đó.
Ước lượng là con số thô cho công việc mockup (không có backend), dùng để xếp thứ tự ưu tiên chứ chưa phải cam kết tiến độ.

## Phase 0 — làm trước, chung cho cả hai (người phụ trách: Kevin)

| Mã | Tên công việc | Số mục | Ước lượng | File chính | Ghi chú |
|---|---|---|---|---|---|
| P0.1 | Khởi tạo repo Git, đưa lên GitHub private và mời teammate |  | 0.5 | `toàn repo` | ĐÃ XONG phần khởi tạo local |
| P0.2 | Viết tài liệu đối chiếu SRS↔mockup, phân công công việc và quy tắc làm việc | 606 |  | `docs/` | ĐÃ XONG |
| P0.3 | Dọn 15 lỗi kỹ thuật của mockup (code chết, lệch số cột, hàm sinh ngẫu nhiên trong render) | 15 | 1.0 | `nhiều file` |  |
| P0.4 | Tách App.tsx và QuanLyVuAnView.tsx thành các file con để 2 lane không đụng nhau |  | 1.0 | `App.tsx, QuanLyVuAnView.tsx` |  |
| P0.5 | Dựng component dùng chung PrintReportModal cho chức năng In báo cáo |  | 1.0 | `PrintReportModal.tsx (mới)` | Lane A làm, cả 2 lane dùng lại |

**Tổng Chung: 5 đầu việc, ~3.5 ngày công**

## Lane A — Kevin

| Mã | Tên công việc | Số mục | Ước lượng | File chính | Ghi chú |
|---|---|---|---|---|---|
| | **2. Quản lý vụ giải quyết đơn** | | | | |
| A1.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Quản lý vụ giải quyết đơn theo SRS | 27 | 2.0 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` | Sửa nhanh, gom được vào ít PR |
| A1.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Quản lý vụ giải quyết đơn (popup/form/luồng chính) | 17 | 5.5 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` | Phần nặng nhất |
| A1.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Quản lý vụ giải quyết đơn | 20 | 3.5 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` |  |
| A1.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Quản lý vụ giải quyết đơn | 2 | 0.5 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` |  |
| A1.5 | Tổng hợp và trình Lead các mục THỪA của màn Quản lý vụ giải quyết đơn (mockup có, SRS không mô tả) | 13 | 0.5 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| A1.6 | Tổng hợp câu hỏi gửi BA cho màn Quản lý vụ giải quyết đơn (SRS mâu thuẫn/bỏ lửng) | 6 | 0.5 | `QuanLyVuAnView.tsx, TabThongTin.tsx, VuAnSearchFilterPanel.tsx, ThemKetQuaModal.tsx` | Đang bị chặn, chờ BA trả lời |
| | **3. Tờ trình vụ giải quyết đơn** | | | | |
| A2.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Tờ trình vụ giải quyết đơn theo SRS | 14 | 1.0 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` | Sửa nhanh, gom được vào ít PR |
| A2.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Tờ trình vụ giải quyết đơn (popup/form/luồng chính) | 9 | 3.0 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` | Phần nặng nhất |
| A2.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Tờ trình vụ giải quyết đơn | 9 | 1.5 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` |  |
| A2.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Tờ trình vụ giải quyết đơn | 2 | 0.5 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` |  |
| A2.5 | Tổng hợp và trình Lead các mục THỪA của màn Tờ trình vụ giải quyết đơn (mockup có, SRS không mô tả) | 10 | 0.5 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| A2.6 | Tổng hợp câu hỏi gửi BA cho màn Tờ trình vụ giải quyết đơn (SRS mâu thuẫn/bỏ lửng) | 7 | 0.5 | `TabToTrinh.tsx, TaoDuThaoModal.tsx, TrinhKyModal.tsx, PheDuyetDeXuatView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **4. Vụ xét xử GĐT/TT** | | | | |
| A3.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Vụ xét xử GĐT/TT theo SRS | 14 | 1.0 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` | Sửa nhanh, gom được vào ít PR |
| A3.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Vụ xét xử GĐT/TT (popup/form/luồng chính) | 11 | 3.5 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` | Phần nặng nhất |
| A3.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Vụ xét xử GĐT/TT | 13 | 2.0 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` |  |
| A3.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Vụ xét xử GĐT/TT | 4 | 0.5 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` |  |
| A3.5 | Tổng hợp và trình Lead các mục THỪA của màn Vụ xét xử GĐT/TT (mockup có, SRS không mô tả) | 7 | 0.5 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| A3.6 | Tổng hợp câu hỏi gửi BA cho màn Vụ xét xử GĐT/TT (SRS mâu thuẫn/bỏ lửng) | 11 | 0.5 | `QuanLyVuXetXuView.tsx, PhanCongHDXXView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **5. Quản lý khiếu nại** | | | | |
| A4.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Quản lý khiếu nại theo SRS | 11 | 1.0 | `QuanLyKhieuNaiView.tsx` | Sửa nhanh, gom được vào ít PR |
| A4.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Quản lý khiếu nại (popup/form/luồng chính) | 6 | 2.0 | `QuanLyKhieuNaiView.tsx` | Phần nặng nhất |
| A4.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Quản lý khiếu nại | 13 | 2.0 | `QuanLyKhieuNaiView.tsx` |  |
| A4.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Quản lý khiếu nại | 3 | 0.5 | `QuanLyKhieuNaiView.tsx` |  |
| A4.5 | Tổng hợp và trình Lead các mục THỪA của màn Quản lý khiếu nại (mockup có, SRS không mô tả) | 6 | 0.5 | `QuanLyKhieuNaiView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| A4.6 | Tổng hợp câu hỏi gửi BA cho màn Quản lý khiếu nại (SRS mâu thuẫn/bỏ lửng) | 4 | 0.5 | `QuanLyKhieuNaiView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **15. Dashboard Vụ GĐ,KT** | | | | |
| A5.1 | Dựng mới màn Dashboard Vụ GĐ,KT theo SRS (khung màn, bộ lọc, bảng/biểu đồ chính) | 15 | 5.0 | `DashboardView.tsx (mới)` | Chờ chốt phạm vi trước khi bắt đầu |
| A5.2 | Hoàn thiện chi tiết màn Dashboard Vụ GĐ,KT (quy tắc nghiệp vụ, drill-down, in báo cáo) | 2 | 0.5 | `DashboardView.tsx (mới)` |  |
| A5.3 | Bổ sung các chi tiết phụ màn Dashboard Vụ GĐ,KT | 1 | 0.5 | `DashboardView.tsx (mới)` |  |
| A5.4 | Tổng hợp câu hỏi gửi BA cho màn Dashboard Vụ GĐ,KT (SRS mâu thuẫn/bỏ lửng) | 8 | 0.5 | `DashboardView.tsx (mới)` | Đang bị chặn, chờ BA trả lời |
| | **16. Quản lý vụ án tổng hợp** | | | | |
| A6.1 | Dựng mới màn Quản lý vụ án tổng hợp theo SRS (khung màn, bộ lọc, bảng/biểu đồ chính) | 10 | 3.5 | `VuAnTongHopView.tsx (mới)` | Chờ chốt phạm vi trước khi bắt đầu |
| A6.2 | Hoàn thiện chi tiết màn Quản lý vụ án tổng hợp (quy tắc nghiệp vụ, drill-down, in báo cáo) | 6 | 1.0 | `VuAnTongHopView.tsx (mới)` |  |
| A6.3 | Bổ sung các chi tiết phụ màn Quản lý vụ án tổng hợp | 2 | 0.5 | `VuAnTongHopView.tsx (mới)` |  |
| A6.4 | Chuẩn hoá mã/tên vụ án của Quản lý vụ án tổng hợp cho khớp SRS | 4 | 0.5 | `VuAnTongHopView.tsx (mới)` |  |
| A6.5 | Tổng hợp câu hỏi gửi BA cho màn Quản lý vụ án tổng hợp (SRS mâu thuẫn/bỏ lửng) | 8 | 0.5 | `VuAnTongHopView.tsx (mới)` | Đang bị chặn, chờ BA trả lời |

**Tổng A: 33 đầu việc, ~46.5 ngày công**

## Lane B — teammate

| Mã | Tên công việc | Số mục | Ước lượng | File chính | Ghi chú |
|---|---|---|---|---|---|
| | **1. Nhận đơn và thụ lý vụ án** | | | | |
| B1.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Nhận đơn và thụ lý vụ án theo SRS | 14 | 1.0 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` | Sửa nhanh, gom được vào ít PR |
| B1.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Nhận đơn và thụ lý vụ án (popup/form/luồng chính) | 7 | 2.5 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` | Phần nặng nhất |
| B1.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Nhận đơn và thụ lý vụ án | 12 | 2.0 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` |  |
| B1.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Nhận đơn và thụ lý vụ án | 1 | 0.5 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` |  |
| B1.5 | Tổng hợp và trình Lead các mục THỪA của màn Nhận đơn và thụ lý vụ án (mockup có, SRS không mô tả) | 10 | 0.5 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B1.6 | Tổng hợp câu hỏi gửi BA cho màn Nhận đơn và thụ lý vụ án (SRS mâu thuẫn/bỏ lửng) | 7 | 0.5 | `NhanDonTLVuAnView.tsx, SearchFilterPanel.tsx` | Đang bị chặn, chờ BA trả lời |
| | **6. Phân công Thẩm tra viên** | | | | |
| B2.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Phân công Thẩm tra viên theo SRS | 4 | 0.5 | `PhanCongTTVView.tsx` | Sửa nhanh, gom được vào ít PR |
| B2.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Phân công Thẩm tra viên (popup/form/luồng chính) | 6 | 2.0 | `PhanCongTTVView.tsx` | Phần nặng nhất |
| B2.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Phân công Thẩm tra viên | 6 | 1.0 | `PhanCongTTVView.tsx` |  |
| B2.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Phân công Thẩm tra viên | 2 | 0.5 | `PhanCongTTVView.tsx` |  |
| B2.5 | Tổng hợp và trình Lead các mục THỪA của màn Phân công Thẩm tra viên (mockup có, SRS không mô tả) | 2 | 0.5 | `PhanCongTTVView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B2.6 | Tổng hợp câu hỏi gửi BA cho màn Phân công Thẩm tra viên (SRS mâu thuẫn/bỏ lửng) | 2 | 0.5 | `PhanCongTTVView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **7. Phân công Thẩm phán** | | | | |
| B3.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Phân công Thẩm phán theo SRS | 6 | 0.5 | `PhanCongThamPhanView.tsx` | Sửa nhanh, gom được vào ít PR |
| B3.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Phân công Thẩm phán (popup/form/luồng chính) | 6 | 2.0 | `PhanCongThamPhanView.tsx` | Phần nặng nhất |
| B3.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Phân công Thẩm phán | 9 | 1.5 | `PhanCongThamPhanView.tsx` |  |
| B3.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Phân công Thẩm phán | 2 | 0.5 | `PhanCongThamPhanView.tsx` |  |
| B3.5 | Tổng hợp và trình Lead các mục THỪA của màn Phân công Thẩm phán (mockup có, SRS không mô tả) | 3 | 0.5 | `PhanCongThamPhanView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B3.6 | Tổng hợp câu hỏi gửi BA cho màn Phân công Thẩm phán (SRS mâu thuẫn/bỏ lửng) | 4 | 0.5 | `PhanCongThamPhanView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **8. Cấu hình hệ thống** | | | | |
| B4.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Cấu hình hệ thống theo SRS | 4 | 0.5 | `CauHinhTTVView.tsx (+ 2 file mới)` | Sửa nhanh, gom được vào ít PR |
| B4.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Cấu hình hệ thống (popup/form/luồng chính) | 3 | 1.0 | `CauHinhTTVView.tsx (+ 2 file mới)` | Phần nặng nhất |
| B4.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Cấu hình hệ thống | 3 | 0.5 | `CauHinhTTVView.tsx (+ 2 file mới)` |  |
| B4.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Cấu hình hệ thống | 1 | 0.5 | `CauHinhTTVView.tsx (+ 2 file mới)` |  |
| B4.5 | Tổng hợp và trình Lead các mục THỪA của màn Cấu hình hệ thống (mockup có, SRS không mô tả) | 3 | 0.5 | `CauHinhTTVView.tsx (+ 2 file mới)` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B4.6 | Tổng hợp câu hỏi gửi BA cho màn Cấu hình hệ thống (SRS mâu thuẫn/bỏ lửng) | 2 | 0.5 | `CauHinhTTVView.tsx (+ 2 file mới)` | Đang bị chặn, chờ BA trả lời |
| | **9. Hồ sơ kháng nghị** | | | | |
| B5.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Hồ sơ kháng nghị theo SRS | 8 | 0.5 | `HoSoKhangNghiView.tsx` | Sửa nhanh, gom được vào ít PR |
| B5.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Hồ sơ kháng nghị (popup/form/luồng chính) | 6 | 2.0 | `HoSoKhangNghiView.tsx` | Phần nặng nhất |
| B5.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Hồ sơ kháng nghị | 8 | 1.5 | `HoSoKhangNghiView.tsx` |  |
| B5.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Hồ sơ kháng nghị | 2 | 0.5 | `HoSoKhangNghiView.tsx` |  |
| B5.5 | Tổng hợp và trình Lead các mục THỪA của màn Hồ sơ kháng nghị (mockup có, SRS không mô tả) | 11 | 0.5 | `HoSoKhangNghiView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B5.6 | Tổng hợp câu hỏi gửi BA cho màn Hồ sơ kháng nghị (SRS mâu thuẫn/bỏ lửng) | 6 | 0.5 | `HoSoKhangNghiView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **10. Hồ sơ tử hình** | | | | |
| B6.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Hồ sơ tử hình theo SRS | 17 | 1.5 | `HoSoTuHinhView.tsx` | Sửa nhanh, gom được vào ít PR |
| B6.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Hồ sơ tử hình (popup/form/luồng chính) | 8 | 2.5 | `HoSoTuHinhView.tsx` | Phần nặng nhất |
| B6.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Hồ sơ tử hình | 7 | 1.0 | `HoSoTuHinhView.tsx` |  |
| B6.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Hồ sơ tử hình | 1 | 0.5 | `HoSoTuHinhView.tsx` |  |
| B6.5 | Tổng hợp và trình Lead các mục THỪA của màn Hồ sơ tử hình (mockup có, SRS không mô tả) | 9 | 0.5 | `HoSoTuHinhView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B6.6 | Tổng hợp câu hỏi gửi BA cho màn Hồ sơ tử hình (SRS mâu thuẫn/bỏ lửng) | 7 | 0.5 | `HoSoTuHinhView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **11. Công văn trao đổi** | | | | |
| B7.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Công văn trao đổi theo SRS | 10 | 1.0 | `CongVanTraoDoiView.tsx` | Sửa nhanh, gom được vào ít PR |
| B7.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Công văn trao đổi (popup/form/luồng chính) | 5 | 1.5 | `CongVanTraoDoiView.tsx` | Phần nặng nhất |
| B7.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Công văn trao đổi | 4 | 0.5 | `CongVanTraoDoiView.tsx` |  |
| B7.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Công văn trao đổi | 1 | 0.5 | `CongVanTraoDoiView.tsx` |  |
| B7.5 | Tổng hợp và trình Lead các mục THỪA của màn Công văn trao đổi (mockup có, SRS không mô tả) | 3 | 0.5 | `CongVanTraoDoiView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B7.6 | Tổng hợp câu hỏi gửi BA cho màn Công văn trao đổi (SRS mâu thuẫn/bỏ lửng) | 5 | 0.5 | `CongVanTraoDoiView.tsx` | Đang bị chặn, chờ BA trả lời |
| | **12. Án Quốc hội & Án thời hiệu** | | | | |
| B8.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Án Quốc hội & Án thời hiệu theo SRS | 3 | 0.5 | `AnBaoCaoViews.tsx` | Sửa nhanh, gom được vào ít PR |
| B8.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Án Quốc hội & Án thời hiệu (popup/form/luồng chính) | 1 | 0.5 | `AnBaoCaoViews.tsx` | Phần nặng nhất |
| B8.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Án Quốc hội & Án thời hiệu | 3 | 0.5 | `AnBaoCaoViews.tsx` |  |
| B8.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Án Quốc hội & Án thời hiệu | 2 | 0.5 | `AnBaoCaoViews.tsx` |  |
| B8.5 | Tổng hợp và trình Lead các mục THỪA của màn Án Quốc hội & Án thời hiệu (mockup có, SRS không mô tả) | 2 | 0.5 | `AnBaoCaoViews.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B8.6 | Tổng hợp câu hỏi gửi BA cho màn Án Quốc hội & Án thời hiệu (SRS mâu thuẫn/bỏ lửng) | 5 | 0.5 | `AnBaoCaoViews.tsx` | Đang bị chặn, chờ BA trả lời |
| | **13. Danh sách vụ án phân công TPTC** | | | | |
| B9.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn Danh sách vụ án phân công TPTC theo SRS | 6 | 0.5 | `PhanCongTPTCView.tsx` | Sửa nhanh, gom được vào ít PR |
| B9.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn Danh sách vụ án phân công TPTC (popup/form/luồng chính) | 4 | 1.5 | `PhanCongTPTCView.tsx` | Phần nặng nhất |
| B9.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn Danh sách vụ án phân công TPTC | 6 | 1.0 | `PhanCongTPTCView.tsx` |  |
| B9.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn Danh sách vụ án phân công TPTC | 2 | 0.5 | `PhanCongTPTCView.tsx` |  |
| B9.5 | Tổng hợp và trình Lead các mục THỪA của màn Danh sách vụ án phân công TPTC (mockup có, SRS không mô tả) | 2 | 0.5 | `PhanCongTPTCView.tsx` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| B9.6 | Tổng hợp câu hỏi gửi BA cho màn Danh sách vụ án phân công TPTC (SRS mâu thuẫn/bỏ lửng) | 6 | 0.5 | `PhanCongTPTCView.tsx` | Đang bị chặn, chờ BA trả lời |

**Tổng B: 54 đầu việc, ~45.0 ngày công**

## Chung cả hai lane — In báo cáo

| Mã | Tên công việc | Số mục | Ước lượng | File chính | Ghi chú |
|---|---|---|---|---|---|
| | **14. In báo cáo** | | | | |
| A+B1.1 | Chuẩn hoá nhãn hiển thị và danh mục combobox màn In báo cáo theo SRS | 7 | 0.5 | `PrintReportModal.tsx (mới) + các màn` | Sửa nhanh, gom được vào ít PR |
| A+B1.2 | Bổ sung các chức năng trọng yếu còn thiếu ở màn In báo cáo (popup/form/luồng chính) | 7 | 2.5 | `PrintReportModal.tsx (mới) + các màn` | Phần nặng nhất |
| A+B1.3 | Bổ sung các trường và cột dữ liệu còn thiếu ở màn In báo cáo | 5 | 1.0 | `PrintReportModal.tsx (mới) + các màn` |  |
| A+B1.4 | Bổ sung các chi tiết phụ và thông báo hệ thống màn In báo cáo | 1 | 0.5 | `PrintReportModal.tsx (mới) + các màn` |  |
| A+B1.5 | Tổng hợp và trình Lead các mục THỪA của màn In báo cáo (mockup có, SRS không mô tả) | 3 | 0.5 | `PrintReportModal.tsx (mới) + các màn` | KHÔNG tự xoá code — chỉ tổng hợp và hỏi |
| A+B1.6 | Tổng hợp câu hỏi gửi BA cho màn In báo cáo (SRS mâu thuẫn/bỏ lửng) | 9 | 0.5 | `PrintReportModal.tsx (mới) + các màn` | Đang bị chặn, chờ BA trả lời |

**Tổng A+B: 6 đầu việc, ~5.5 ngày công**
