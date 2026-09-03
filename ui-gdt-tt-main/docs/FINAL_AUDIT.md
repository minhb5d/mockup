# FINAL AUDIT — Mockup GĐT/TT TANDTC

## Căn cứ chốt

Bản này được dọn theo thứ tự ưu tiên:

1. Luồng nghiệp vụ `Quy trình GĐT,TT.drawio` (TANDTC).
2. SRS TANDTC theo từng module/màn.
3. Bảng `Đối chiếu SRS - 27.08.2026`: đỏ = bỏ, vàng = không triển khai thêm, xanh = giữ/bổ sung; dòng không màu phải kiểm tra lại SRS + Draw.io.

Không áp các delta **chỉ dành cho cấp tỉnh** vào bản TANDTC. Ví dụ: án tử hình/ân giảm vẫn thuộc phạm vi TANDTC; phân công Thẩm phán ngẫu nhiên vẫn được giữ vì SRS TANDTC yêu cầu cả ngẫu nhiên và chỉ định.

## HSKN đi — trạng thái cuối

Đã bỏ các phần mockup thừa/không có căn cứ ở core flow:

- Nút/modal `Chọn hồ sơ` riêng (checkbox danh sách đã làm nhiệm vụ chọn).
- `Tạo công văn` độc lập trước khi chuyển HSKN.
- Word editor/công văn riêng của HSKN.
- Điều kiện phải có số công văn mới được chuyển.
- Trạng thái `Chờ chuyển` không chuẩn.
- Field/list `Thẩm quyền xét xử` ở HSKN đi không thuộc vị trí SRS.
- Action nhận HSKN CA ở tab HSKN đi; nhận hồ sơ thuộc HSKN đến.

Giữ:

- Checkbox → `Chuyển hồ sơ`.
- Popup thông tin chuyển: ngày chuyển, số bút lục, đơn vị nhận, đơn vị chi tiết, ghi chú/tài liệu.
- `In danh sách`.
- Xem/Sửa.
- Văn thư đi: mã VT đi, ngày VT đi, người phát hành.
- Theo dõi xét xử Tòa tỉnh khi hồ sơ thực sự chuyển Tòa tỉnh, vì có căn cứ luồng Draw.io.

## Các cleanup chính toàn mockup

- Nhận đơn: bỏ Ghép/Chuyển/Thêm vụ án tại vị trí bị đánh dấu đỏ; giữ `Hủy ghép` theo bản đối chiếu xanh cập nhật sau.
- Giao tiểu hồ sơ: bỏ filter/action mockup tự thêm ngoài SRS.
- Quản lý vụ GQĐ: bỏ các field/cột đỏ như Mã vụ án, Loại bản án ở vị trí bị gạch, các cột lịch sử phân công/giai đoạn dư, QuickView dư, Phân loại đơn và các action không có căn cứ.
- Khiếu nại: bỏ Thêm mới, bulk checkbox/QuickView và các filter xét xử bị lọt từ màn GQĐ; ẩn Tài liệu/Hồ sơ lưu trữ trong luồng khiếu nại.
- Tờ trình: dọn các cột/action lịch sử thừa; giữ các nhánh có căn cứ SRS/Draw.io.
- Phân công TTV: giữ ngẫu nhiên/chỉ định theo SRS; dọn dữ liệu/label lặp và UI thừa.
- Phân công Thẩm phán: **giữ phân công ngẫu nhiên và chỉ định** theo SRS TANDTC; không xóa theo dòng audit cũ bị mâu thuẫn với SRS chính thức.
- Công văn trao đổi: bỏ Số bản, loại nơi nhận ngoài SRS và cột BA/QĐ dư.
- Báo cáo Án QH/Án thời hiệu: bỏ editor kiểu Word, contentEditable/add-row/save không thuộc màn in báo cáo; giữ preview/in báo cáo.
- TPTC: bỏ Cấp xét xử dư; chuẩn hóa `Nội dung ý kiến tờ trình`, mặc định theo nội dung nghiệp vụ.
- Quản lý vụ xét xử: bỏ Xuất Excel/Nơi lưu giữ/QĐ hoãn do Chánh án ở vị trí không có căn cứ; giữ các trạng thái nghiệp vụ hợp lệ như rút kháng nghị/đã xét xử khi chúng thuộc luồng.
- Hồ sơ tử hình/ân giảm: **giữ cho bản TANDTC**; chỉ các delta cấp tỉnh mới yêu cầu bỏ.
- Dọn code dead/import/relative path và cấu hình Vercel.

## QA cuối

- TypeScript/TSX: 98 file (bao gồm `vite-env.d.ts`).
- `tsc --noEmit`: PASS, 0 lỗi TypeScript.
- TypeScript parser: 0 lỗi cú pháp.
- Relative imports: 0 đường dẫn thiếu.
- Không đóng gói `node_modules`, `.git`, `dist`, file backup.

## Build / Vercel

Build local trong sandbox không thể xác nhận vì `node_modules` phục vụ QA được lấy từ môi trường Windows, nên Rollup trên Linux thiếu native package `@rollup/rollup-linux-x64-gnu`. Một lần `npm ci` Linux sạch cũng timeout do giới hạn mạng sandbox.

Bản final đã cấu hình để Vercel tự cài sạch dependency Linux:

```text
Install Command: npm ci --include=dev
Build Command: npm run build
Output Directory: dist
Node.js: 20.x
```

`npm run build` gọi Vite trực tiếp qua Node để không phụ thuộc executable permission của `.bin`:

```text
node ./node_modules/vite/bin/vite.js build
```
