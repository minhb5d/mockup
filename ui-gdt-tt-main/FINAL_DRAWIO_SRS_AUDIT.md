# FINAL AUDIT — SRS 27.08.2026 + Draw.io + Merge Mockup A/B

## 1. Nguyên tắc chốt

Source cuối được hợp nhất từ 2 mockup. ZIP 2 được dùng làm khung chính; phần Lane A/nghiệp vụ còn thiếu từ ZIP 1 được đưa vào theo ranh giới module thay vì copy đè toàn repo.

Quy tắc áp dụng bảng `Đối chiếu SRS - 27.08.2026`:

- **Đỏ:** bỏ/không đưa vào source cuối.
- **Vàng:** không triển khai thêm.
- **Xanh:** giữ hoặc bổ sung.
- **Không tô màu:** quyết định bằng SRS trong Google Drive và luồng Draw.io.

Trong trường hợp mockup cũ khác Draw.io, **Draw.io được dùng làm chuẩn luồng nghiệp vụ chính**; SRS dùng làm chuẩn field, trạng thái, validation, biểu mẫu và rule chi tiết.

## 2. Đối chiếu 13 page Draw.io

| # | Page Draw.io | Kết luận đối chiếu source cuối | Module/source chính |
|---|---|---|---|
| 1 | Quy tắc chung | Đã áp dụng cách hiểu gateway/nhánh song song/điều kiện khi rà các flow. Không phải màn UI riêng. | Toàn hệ thống |
| 2 | 1. Quy Trình Tổng Quan VPHCTP | Đã có tiếp nhận, phân công, số hóa/thụ lý, trả/chuyển/yêu cầu bổ sung, phân công TP, xin ý kiến, chuyển Vụ. Các thao tác bị đánh dấu đỏ ở màn Nhận đơn đã bỏ khỏi vị trí không phù hợp. | `NhanDonTLVuAnView.tsx`, `NhanDonModals.tsx`, `PhanCongThamPhanView.tsx`, `LuuSoVanBanView.tsx` |
| 3 | 1.1 QT - Nhận đơn từ tòa khác | **Page rỗng trong file Draw.io (0 node/edge)** nên không sinh thêm flow ngoài SRS hiện có. | — |
| 4 | Lưu số văn bản | Đã tách màn Lưu số văn bản & In báo cáo, có quyết định theo thẩm quyền/điều kiện đơn và nghiệp vụ sau thụ lý. | `LuuSoVanBanView.tsx`, `PrintReportModal.tsx` |
| 5 | Tiêu chí phân công TP | Đã sửa phân công tự động theo hướng loại trừ người không đủ điều kiện → ưu tiên/tiêu chí nghiệp vụ → cân bằng tải/tạm đình chỉ/quá hạn/lỗi chủ quan → thứ tự tên; không còn dùng modulo đơn giản. | `PhanCongThamPhanView.tsx` |
| 6 | 2.0 Quy trình xử lý đơn đề nghị GĐT,TT của Vụ GĐ,KT | Đã có tiếp nhận từ VPHCTP, tạo/ghép vụ theo phạm vi phù hợp, phân công TTV, nghiên cứu hồ sơ, tờ trình, kết quả GQĐ, HSKN, tạo vụ xét xử, ký ban hành, lưu trữ. | `QuanLyVuAnView.tsx`, `PhanCongTTVView.tsx`, `TabToTrinh.tsx`, `ThemKetQuaModal.tsx`, `HoSoKhangNghiView.tsx`, `QuanLyVuXetXuView.tsx` |
| 7 | 2.4 Vụ việc đã có Thông báo giải quyết | Đã bổ sung vòng VPHCTP → Vụ GĐKT kiểm tra → Vụ trưởng → Phó Chánh án → trả kết quả VPHCTP → tiếp tục thụ lý hoặc trả lời kết quả. | `QuanLyVuAnView.tsx`, `App.tsx` |
| 8 | 2.6 Tiêu chí PC TTV | Đã sửa phân công TTV tự động: loại người không đủ điều kiện; ưu tiên người xử lý vụ việc trước đó; sau đó cân bằng số vụ; cuối cùng sắp theo tên tiếng Việt. Có cảnh báo thay đổi cấu hình chưa lưu. | `PhanCongTTVView.tsx` |
| 9 | 2.8 Xử lý hồ sơ kháng nghị | Có HSKN đi/đến; popup chuyển HSKN; popup nhận HSKN; thông tin văn thư đi; và đã bổ sung luồng Tòa tỉnh → VKS cùng cấp → VKS trả → Tòa tỉnh nhận lại → lịch/kết quả xét xử → TANDTC theo dõi. | `HoSoKhangNghiView.tsx` |
| 10 | 2.9 Lập tờ trình | Đã có luồng TPB3/TPTC, TTV lập dự thảo, LĐV/TP/PCA cho ý kiến, nhánh không đồng quan điểm và phân công lại TPTC. | `TabToTrinh.tsx`, `PhanCongTPTCView.tsx`, `PheDuyetDeXuatView.tsx`, `TrinhKyModal.tsx` |
| 11 | 2.14 Giải quyết đơn GĐT,TT | Đã có kết quả trả lời/kháng nghị, VKS đang giải quyết, khiếu nại, hoãn/tạm đình chỉ, dự thảo văn bản và trình ký. | `ThemKetQuaModal.tsx`, `TaoDuThaoModal.tsx`, `QuanLyKhieuNaiView.tsx`, `QuanLyVuAnView.tsx` |
| 12 | 2.16 Xét xử GĐT,TT | Đã có thụ lý vụ xét xử, phân công HĐXX 5 TP/toàn thể, lịch xét xử riêng, hoãn/rút kháng nghị, kết quả xét xử. Đã sửa loại lịch ST/PT/GĐT/THA tách khỏi hình thức trực tiếp/trực tuyến và bổ sung checklist giấy mời VKS → gửi HĐXX/VKS/Vụ/CA-PCA → bố trí phòng/điều kiện. | `QuanLyVuXetXuView.tsx`, `PhanCongHDXXView.tsx`, `TaoDuThaoModal.tsx` |
| 13 | Quy trình xử lý án tử hình | Đã thể hiện chuỗi án tử hình → xem xét GĐT/TT → đơn xin ân giảm → TANDTC/VKS → Chủ tịch nước → kết quả ân giảm → thi hành án; có trạng thái theo từng bị án và các bảng/QĐ/tờ trình liên quan. | `HoSoTuHinhView.tsx` |

## 3. Các điểm SRS quan trọng đã chốt trong source

### HSKN
- Popup **Xác nhận chuyển hồ sơ**: Ngày chuyển, Số bút lục, đơn vị TAND/VKSND/Khác, đơn vị chi tiết, ghi chú, đính kèm.
- Popup **Nhận hồ sơ**: người giao văn thư, người nhận Vụ, ngày nhận.
- Tab HSKN đi có **Mã văn thư đi / Ngày văn thư đi / Người phát hành**.
- Theo dõi HSKN thuộc thẩm quyền xét xử cấp tỉnh đã được bổ sung theo Draw.io page 9.

### Vụ xét xử GĐT/TT
- Có tab **Đơn GĐT,TT**.
- Có Số/Ngày thụ lý xét xử, Quá hạn luật định, QHPL/QHPL thống kê.
- Có chỉnh sửa tội danh/hình phạt, điều luật nhiều dòng, kết quả xét xử và in báo cáo.
- Lịch xét xử là **màn độc lập**; trạng thái **Hoãn xét xử** là trạng thái riêng.

### Hồ sơ tử hình
- Có trường/cột **Bị án** ở các quyết định/tờ trình liên quan.
- Popup QĐ VKS có Bị án bắt buộc.
- Có **Trình duyệt** ở QĐ kháng nghị/không kháng nghị.
- Hiển thị tiến độ theo 6 chỉ tiêu: Trình, KQGQ đơn, KQGQ Chánh án, KQGQ VKS, KQGQ Chủ tịch nước, Xác minh.
- Có thống kê loại đơn xin ân giảm/kêu oan/xin thi hành án.

### Dashboard + Hồ sơ tổng hợp
- Đã bổ sung Dashboard Vụ GĐ,KT: trạng thái thụ lý xét xử, quá trình GQĐ, án Quốc hội, án thời hiệu, thống kê theo thời hiệu.
- Đã bổ sung Hồ sơ tổng hợp vụ án và route/sidebar tương ứng.

## 4. Những phần bị loại/không làm theo rule màu

Các thành phần bị đánh dấu **đỏ** không được đưa trở lại chỉ vì có trong mockup cũ. Điển hình ở màn Nhận đơn: các action Ghép/Chuyển/Thêm vụ án ở vị trí bị loại; dải tổng số không đúng; các cột/filter bị gạch bỏ; thông tin HĐTP phúc thẩm thừa.

Các dòng **vàng** không được triển khai thêm. Source không tự mở rộng các điểm này nếu Draw.io/SRS không bắt buộc.

## 5. QA kỹ thuật cuối

- TypeScript/TSX được parse bằng TypeScript compiler API: **102 file, 0 lỗi cú pháp**.
- Relative import resolution: **0 import bị thiếu**.
- Alias `@/*` đã được khai báo đồng thời trong `tsconfig.json` và `vite.config.ts`.
- File backup `.bak_drawio`, `.bak`, `.orig`, `.rej`: **đã loại khỏi bản final**.
- `node_modules`: **không đóng gói trong ZIP final**.

### Build production

Không thể xác nhận `npm run build` trong môi trường hiện tại vì bộ `node_modules` nằm trong ZIP nguồn ban đầu chỉ có skeleton/thư mục rỗng; thử `npm ci --offline` thất bại do cache thiếu gói `yallist-3.1.1`. Đây là giới hạn dependency của môi trường chạy, không phải lỗi syntax/import của source.

Trên máy có Internet, chạy:

```bash
npm install
npm run build
```

Sau khi cài dependency đầy đủ, Vite sẽ được tạo lại trong `node_modules/.bin`.

## 6. Kết luận

Bản final này là source đã merge và sửa theo **Draw.io trước, SRS chi tiết sau, rule màu của bảng đối chiếu cuối cùng**. Những comment audit cũ có chữ `THIẾU/LỆCH/THỪA` trong một số file được giữ như dấu vết đối chiếu lịch sử; nhiều mục ngay bên dưới comment đã có implementation. Trạng thái chốt phải căn theo báo cáo này và code thực tế, không căn theo comment audit cũ.
