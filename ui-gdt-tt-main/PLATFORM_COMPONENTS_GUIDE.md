# PLATFORM COMPONENTS — DÙNG CHUNG LANE A + LANE B

## Mục tiêu
Tách các phần trình bày lặp lại thành component nền tảng để hai lane dùng chung mà KHÔNG thay đổi nghiệp vụ/SRS.

## Component đã đưa xuống nền tảng

### 1. `components/platform/PlatformModalFrame.tsx`
Chỉ quản lý:
- backdrop/overlay;
- z-index;
- căn giữa modal;
- card container;
- style container truyền từ caller.

KHÔNG quản lý:
- tiêu đề nghiệp vụ;
- nút nghiệp vụ;
- validation;
- trạng thái;
- điều kiện hiển thị;
- luồng Lưu/Trình/Trả/Ghép/Phân công.

Đang được dùng tại:
- Lane B: `NhanDonModals.tsx`, `PhanCongTTVView.tsx`;
- Lane A: `PheDuyetDeXuatView.tsx`.

### 2. `components/platform/TableEmptyState.tsx`
Chỉ render một dòng empty-state của bảng. Text được caller truyền vào nên tên/thông báo theo SRS của từng màn vẫn giữ nguyên.

Đang được dùng tại:
- Lane B: `PhanCongTTVView.tsx`;
- Lane A: `QuanLyVuAnView.tsx`.

## Component dùng chung đã có sẵn và nên tiếp tục dùng
Trong `shared.tsx` đã có các primitive dùng chung:
- `Badge`;
- `Tag`;
- `StatusBadge`;
- `TH_STYLE` / `TD_STYLE`;
- `TaiKhoanPhanQuyenBar`;
- helpers theo đơn vị/loại án.

Không di chuyển các primitive này trong vòng refactor hiện tại để tránh tạo diff lớn không cần thiết.

## Những phần KHÔNG gom chung ở vòng này

### Search / Filter panel
Không gom một panel duy nhất vì từng SRS có bộ field, label, option và hành vi reset/search khác nhau.

### Popup nghiệp vụ
Không gom nội dung popup Trả đơn, Ghép vụ án, HSKN, phân công, tử hình, tờ trình... vì mỗi luồng có field/rule riêng.

### Status / business rule
Không đưa trạng thái, điều kiện enable/disable, mapping nghiệp vụ vào platform component.

### PrintReportModal
Danh sách công việc Phase 0 có P0.5 component In báo cáo dùng chung. Chưa ép các màn hiện tại dùng chung trong vòng này vì tiêu chí/biểu mẫu in của từng SRS chưa đồng nhất. Chỉ nên làm sau khi chốt schema props chung, để không vô tình đổi trường/label theo SRS.

## Quy tắc bắt buộc cho bot/dev sau
1. Platform component chỉ được chứa UI structure thuần.
2. Không hard-code text nghiệp vụ trong platform component.
3. Không hard-code option combobox nghiệp vụ.
4. Không quyết định trạng thái/permission/business condition trong platform component.
5. Mọi label, validation message, action handler phải nằm ở màn nghiệp vụ hoặc được truyền vào qua props.
6. Khi refactor phải kiểm tra trước/sau: text hiển thị và handler nghiệp vụ không thay đổi.
7. Nếu muốn gom một component mà phải đổi SRS wording hoặc logic của một màn thì KHÔNG gom.
