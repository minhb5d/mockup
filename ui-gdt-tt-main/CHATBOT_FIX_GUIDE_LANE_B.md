# CHATBOT FIX GUIDE — LANE B / GĐ,KT

## 1. Mục tiêu

Đây là source mockup đã được patch theo **danh sách case Lane B do người dùng chốt** trong `LANE_B_CASES_SOURCE.md`.

Bot/agent tiếp theo **không được tự mở rộng phạm vi**, không được “tối ưu nghiệp vụ” theo suy luận, và không được lấy module VPHCTP làm chuẩn thiết kế cho GĐ,KT.

## 2. Nguồn chuẩn nghiệp vụ

Chỉ dùng **các file SRS GĐ,KT trực tiếp trên Google Drive** làm baseline nghiệp vụ.

Không dùng file tổng hợp `.md` làm nguồn quyết định requirement. Không dùng biên bản, HDSD, testcase hoặc nghiệp vụ thực tế để tự override SRS nếu người dùng chưa yêu cầu.

Quy tắc xử lý:

- SRS có, mockup thiếu -> bổ sung.
- SRS có, mockup khác -> sửa theo SRS.
- Mockup có, SRS không có -> không tự xóa; note hỏi Lead.
- Hai đoạn/file SRS tự mâu thuẫn -> không tự chọn; `BLOCKED - HỎI LEAD`.

## 3. Phạm vi patch này

Patch chỉ tập trung các case trong `LANE_B_CASES_SOURCE.md`, theo các nhóm:

1. Nhận đơn và thụ lý vụ án / Giao tiểu hồ sơ.
2. Phân công Thẩm tra viên.
3. Phân công Thẩm phán.
4. Cấu hình hệ thống liên quan TTV/LĐV.
5. Hồ sơ kháng nghị.
6. Hồ sơ tử hình / đơn xin ân giảm.
7. Công văn trao đổi.
8. Án Quốc hội / Án thời hiệu.
9. Danh sách vụ án phân công TPTC.

### Case bị khóa, không tự sửa

- **Tên hai tab HSKN**: chính case đầu vào ghi SRS dùng cả cặp “HSKN Chánh án / HSKN VKS” và tiêu đề “HSKN đến / HSKN đi”. Đây là conflict trong SRS. Source giữ cách gọi hiện tại; bot sau chỉ đổi khi Lead chốt chính thức.

## 4. File source đã thay đổi

- `src/app/AnBaoCaoViews.tsx`
- `src/app/App.tsx`
- `src/app/CongVanTraoDoiView.tsx`
- `src/app/HoSoKhangNghiView.tsx`
- `src/app/HoSoTuHinhView.tsx`
- `src/app/NhanDonTLVuAnView.tsx`
- `src/app/PhanCongTPTCView.tsx`
- `src/app/PhanCongTTVView.tsx`
- `src/app/PhanCongThamPhanView.tsx`
- `src/app/SearchFilterPanel.tsx`
- `src/app/ThemKetQuaModal.tsx`
- `src/app/shared.tsx`

Diff chính xác so với source ban đầu nằm trong `LANE_B_CHANGES.patch`.

## 5. Các thay đổi quan trọng đã thực hiện

### Nhận đơn / TLVA

- Chuẩn hóa label filter: Người đứng đơn, Thẩm tra viên, Làm mới.
- Phân loại đơn dùng đúng 2 nhóm theo case Lane B.
- Địa chỉ theo Tỉnh/Thành + Xã + Địa chỉ chi tiết.
- Trạng thái thụ lý dùng Thụ lý mới / Đã thụ lý.
- Thuật ngữ “Án vị thành niên / Người chưa thành niên” thay cho “Án TVTN”.
- Giao THS mặc định mở tab Nhận THS từ VPHCTP.
- Tab Giao THS đến TTV không còn cột Ngày Vụ nhận.
- Chờ xin ý kiến: cột Thông tin đơn chỉ còn Mã đơn + Hình thức đơn.
- “Thẩm phán (Dự kiến)” dựa vào việc đã có bút phê/ý kiến lãnh đạo, không chỉ dựa tab.
- KQGQ trước đó hiển thị `Đã có TBGQ: [Loại] - [Số] - [Ngày]`.
- Nút In danh sách không điều hướng nhầm sang màn soạn công văn.

### Dọn code chết

`GiaoTieuHoSoView` trước đây bị duplicate trong `App.tsx` và `NhanDonTLVuAnView.tsx`.

Patch đã bỏ implementation duplicate khỏi `App.tsx`; chỉ còn **một source of truth** tại `NhanDonTLVuAnView.tsx`, còn `App.tsx` import component này.

Bot sau không được copy component trở lại `App.tsx`.

### Phân công TTV

- Filter Giai đoạn dùng đúng 2 giá trị nghiệp vụ trong case.
- Nút ở màn chưa phân công đổi theo mode: ngẫu nhiên -> `Lưu phân công`; chỉ định -> `Phân công`.
- Reset dùng `Làm mới`.
- TTV/LĐV hiển thị thông tin đầy đủ hơn thay vì chỉ họ tên.

### Phân công TP

- Màn chỉ định không dùng radio `Tất cả`.
- Hình thức phân công phụ thuộc bậc TP.
- Combobox TP hiển thị họ tên + thông tin chức vụ/chức danh.
- `Xóa` được xử lý theo nghĩa hủy kết quả phân công, đưa record về chưa phân công; không xóa record nghiệp vụ khỏi dataset.
- Breadcrumb đặt trong ngữ cảnh GĐ,KT.
- Số vụ đang giải quyết không sinh bằng `Math.random()` mỗi render.

### Cấu hình TTV

- Chức danh hiển thị readonly, không phải trường tùy ý sửa.
- Cột tên dùng `Thẩm tra viên`.
- Thông tin TTV/LĐV hiển thị đầy đủ hơn.
- Banner cập nhật thành công không hiện sẵn khi mới mở màn.

### Hồ sơ kháng nghị

- Tách bộ lọc theo HSKN đến/đi.
- Không chọn hồ sơ -> không tự nhận record đầu tiên.
- Trả hồ sơ không còn fallback ID hard-code `102`.
- Popup trả dùng ngày hiện tại readonly + lý do bắt buộc.
- Chuyển hồ sơ kiểm tra hồ sơ đã chuyển và dùng message theo case.
- Có handoff local giữa QĐ kháng nghị có hiệu lực và danh sách HSKN đi qua event `gdt:qdkhangnghi-hieu-luc`.

**Không tự sửa tên tab HSKN cho tới khi Lead chốt conflict SRS.**

### Hồ sơ tử hình

- Danh sách bị án không lọc bỏ bị án không tử hình; giữ toàn bộ danh sách và ưu tiên bị án tử hình.
- Tách form QĐ không kháng nghị khỏi form QĐ kháng nghị.
- `Xét thấy` đúng nhãn.
- Cho phép chọn nhiều bị án trong QĐ kháng nghị.
- Chuẩn hóa nơi nhận theo `TAND / VKS / Khác` và danh sách chi tiết phụ thuộc lựa chọn.
- Kết luận CTN dùng `Ân giảm / Không xét ân giảm`.
- Người ký CV xác minh dùng danh sách chức vụ phù hợp; nơi nhận/đơn vị nhận phụ thuộc loại.
- File đính kèm dùng control upload thật.
- Điều hướng chi tiết dùng đúng record thay vì tất cả trỏ `hs-1`.
- Tab chi tiết dùng `Hồ sơ`.

### Công văn trao đổi

- Popup tạo mới mặc định Công văn đi.
- Action Lấy số / Trình ký / Xem biểu mẫu không áp dụng như nhau cho Công văn đến.
- Điều kiện xóa dùng trạng thái trình ký của CV đi, không dùng cờ KQGQ không liên quan.
- Bảng nơi nhận dùng `Ghi chú`; nơi nhận chi tiết theo danh mục/phụ thuộc loại.
- Xem chi tiết chuyển sang popup chỉnh sửa.
- Các tiêu chí người/đơn vị trong search dùng control danh mục thay vì textbox tự do ở các case đã patch.
- Lịch sử trình ký dùng tên action `Trình tiếp`.
- Người ký: CV đi dùng danh sách; CV đến cho nhập tay.
- Nhiều nơi nhận hiển thị đơn vị đầu tiên + số còn lại/tooltip.

### Án QH / Án thời hiệu

- Header đương sự theo từng màn đúng case.
- Tổng số Án thời hiệu tính từ dữ liệu đang render, không hard-code 449.
- Bộ lọc ngày Án QH được trình bày như một tiêu chí khoảng ngày.

### TPTC

- Cột BA/QĐ có dữ liệu QHPL tương ứng với tiêu đề.
- `Đương sự & Người đứng đơn` và nội dung bị cáo/bị đơn được bổ sung.
- Có hai hành vi xem theo case: xem popup / xem tờ trình.
- Thêm tờ trình yêu cầu đúng 1 vụ được chọn, không tạo hàng loạt nhiều vụ.
- TPB3 filter là input có datalist gợi ý, **không khóa cứng vào 5 tên**, nên có thể nhập TPB3 ngoài danh sách gợi ý.
- Tách `Người ký ban hành` và `Kính gửi`.

## 6. Guardrails bắt buộc cho bot tiếp theo

1. **Không sửa file ngoài phạm vi** chỉ để “clean code” nếu không có bug/case rõ ràng.
2. Không đổi route/menu/navigation ngoài case đã chốt.
3. Không tự tạo API/backend giả mới nếu chỉ cần sửa mockup local state.
4. Không xóa feature chỉ vì không thấy trong một file SRS; nếu nghi là thừa -> note Lead.
5. Không dùng VPHCTP làm chuẩn UI/logic cho GĐ,KT.
6. Không đổi dữ liệu sample thành nghiệp vụ mới chưa có SRS.
7. Không giải quyết conflict SRS bằng suy luận.
8. Trước khi sửa một case, phải tìm **component đang render thực tế** để tránh tạo implementation duplicate.
9. Sau mỗi patch, chạy parse/compile check và kiểm diff chỉ chạm file cần thiết.
10. Nếu cần thay đổi tiếp, ưu tiên patch nhỏ, có thể review; không rewrite cả component khi không cần.

## 7. QA đã chạy

- Parse toàn bộ `src/**/*.ts` và `src/**/*.tsx`: **93 file, 0 lỗi cú pháp TypeScript/TSX**.
- Assertion các thay đổi trọng yếu Lane B: đạt tại thời điểm đóng gói.
- Kiểm tra duplicate `GiaoTieuHoSoView`: chỉ còn một definition.

### Hạn chế môi trường build

Không xác nhận được full `npm run build` trong môi trường đóng gói vì thư mục `node_modules` tạm thời bị thiếu executable/file của Vite (`node_modules/vite/bin/vite.js`). Đây là dependency/runtime setup, không phải parse error của source patch.

Khi bot/dev nhận ZIP:

```bash
npm ci
npm run build
npm run dev
```

Sau đó smoke-test các route/màn thuộc Lane B trước khi merge.

## 8. Không được sửa tiếp nếu chưa có yêu cầu

Sau khi nhận source này, mặc định coi Lane B đã được patch theo danh sách hiện tại. Nếu phát hiện thêm thiếu/lệch ngoài file `LANE_B_CASES_SOURCE.md`, bot chỉ được **báo lại**, không tự triển khai cho tới khi người dùng chốt phạm vi tiếp theo.
