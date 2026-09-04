# Dashboard Vụ GĐ,KT — cập nhật 2026-09-04

## Vị trí menu
- Dashboard là **một màn hình riêng** trong nhóm **Quản lý án GĐT/TT**.
- Thứ tự:
  1. Dashboard Vụ GĐ,KT
  2. Nhận đơn và TL vụ án
  3. Hồ sơ kháng nghị
  4. Các màn nghiệp vụ còn lại
- Bỏ liên kết Dashboard bị lặp ở mục `Trang chủ` để tránh hai menu cùng mở một màn.

## Logic Dashboard đã sửa
- 5 nhóm quyền: TTV/Thư ký giải quyết án; Thẩm phán; Phó Vụ trưởng; Vụ trưởng; BCTK Vụ.
- Dashboard chỉ chọn Vụ I–IV, không có `Toàn bộ 4 Vụ`.
- Phó Vụ trưởng dùng tập dữ liệu demo riêng cho phạm vi phụ trách, không còn nhân tỷ lệ toàn Vụ.
- TTV/Thẩm phán dùng phạm vi hồ sơ được phân công.
- Vụ trưởng xem toàn Vụ.
- BCTK Vụ xem toàn Vụ nhưng drill-down chỉ mở thông tin trích ngang read-only.
- Sửa identity demo để chức danh và tên tài khoản không bị gán sai.
- KPI `Chờ phê duyệt` mở breakdown theo loại đầu việc trước khi drill-down.
- KPI `Án quá hạn` tách quá hạn giải quyết đơn và quá hạn xét xử.
- Biểu đồ/pipeline/cảnh báo hỗ trợ click drill-down.
- Bộ lọc `Tùy chọn` có `Từ ngày` và `Đến ngày`.
- TopBar ẩn dropdown phân quyền toàn cục khi đang ở Dashboard để không bị trùng với bộ chọn role/Vụ trong chính Dashboard.

## QA
- `DashboardVuGDKTView.tsx`: TypeScript transpile syntax PASS.
- `App.tsx`: TypeScript transpile syntax PASS.
- `Sidebar.tsx`: TypeScript transpile syntax PASS.
- 105 file TS/TSX: 0 relative import bị thiếu.
- Full `tsc` không thể dùng làm tiêu chí PASS vì source ZIP không kèm `node_modules`; lỗi chính là thiếu dependency/type package của React/lucide/radix...
