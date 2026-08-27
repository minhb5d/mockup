# DANH SÁCH CÂU HỎI GỬI BA — Mockup GĐT/TT (bản TANDTC)

**Ngày lập:** 27/08/2026 · **Người hỏi:** Kevin Ngo · **Người trả lời:** chị BA phụ trách Vụ GĐ,KT

**Bối cảnh:** đối chiếu mockup `ui-gdt-tt-main` (27 file, ~42.600 dòng) với bộ tài liệu
`GĐTTT _GĐTTT Cấp Tỉnh` (39 file SRS + quy trình + 2 file Q&A/biên bản họp) để sửa mockup theo SRS.
Các câu hỏi dưới đây là những điểm **không tự quyết được từ tài liệu hiện có**.

Ký hiệu `[n]` = số thứ tự dòng trong file `SRS/2. Giám đốc, Kiểm tra/7. Q&A/Tài liệu họp với các
vụ giám đốc, kiểm tra.xlsx`, sheet *Chi tiết Nghiệp vụ thảo luận*.

---

## A. Phạm vi và tài liệu chuẩn để đối chiếu

**A1.** Mockup này là bản **TANDTC** (có 4 Vụ GĐ,KT). Vậy bộ tài liệu chuẩn để đối chiếu là thư mục
`SRS/2. Giám đốc, Kiểm tra` (các nhóm 1, 2, 3, 4, 5) — đúng không? Hai nhóm `SRS/1.1 VPHCTP`,
`SRS/1.2 VPHCTP_VER 2` và nhóm `4. GĐ,KT Tỉnh` **nằm ngoài** phạm vi mockup này, đúng không?

**A2.** Bên VPHCTP có 2 bản (`1.1` và `1.2 VER 2`). Bên GĐ,KT có bản VER 2 tương ứng không, hay các
file trong `2. Giám đốc, Kiểm tra` đã là bản mới nhất? Có file nào **đã bị thay thế nhưng chưa xóa**
khỏi thư mục không (để em khỏi sửa mockup theo bản cũ)?

**A3.** File `Tài liệu họp với các vụ giám đốc, kiểm tra.xlsx` có **65 nội dung thảo luận**, nhưng
toàn bộ cột *Trạng thái thực hiện* và *Trạng thái tài liệu* đang **trống**. Những nội dung này:
đã được cập nhật vào SRS chưa, hay còn đang chờ tòa chốt? (Các mục ảnh hưởng trực tiếp đến mockup
em liệt kê ở mục E.)

**A4.** File `Q&A Tờ trình Vụ GD,KT.xlsx` có **18 câu hỏi** (ngày hỏi 17/06/2026) nhưng cột *Trả lời*
**trống hoàn toàn**. Đã có câu trả lời ở tài liệu khác chưa? Nếu chưa, phần Tờ trình trong mockup nên
dựng theo giả định nào?

**A5.** Sau này bản cấp Tỉnh sẽ dùng lại mockup này. Định hướng là **một mockup dùng chung** (đổi theo
cấu hình đơn vị) hay **tách hai bản** riêng? Việc này ảnh hưởng đến cách em đặt tên chức danh và cấu
trúc dữ liệu ngay từ bây giờ.

---

## B. Có trong SRS nhưng mockup chưa có — cần biết có phải dựng không

**B1. Dashboard.** Có 3 SRS (`Dashboard Vụ GĐ,KT`, `Dashboard chánh án`, `Dashboard VPHCTP`) nhưng
mockup **không có màn Dashboard nào**. Có thuộc phạm vi mockup này không, ưu tiên mức nào?
(Lưu ý `[43]`: khi có thêm vụ khiếu nại thì dashboard chưa thể hiện được do chưa có quy trình chuẩn —
vậy dựng luôn phần vụ GQĐ + vụ XX trước, hay chờ chốt đủ?)

**B2. Lên lịch xét xử.** Có SRS riêng (`2. GĐ,KT - Vụ xét xử/3. Lên lịch xét xử.docx`). Mockup mới chỉ
có thông tin lịch **nằm lồng trong** Phân công HĐXX và Quản lý vụ xét xử, chưa có màn riêng. Có cần
tách thành màn riêng như SRS không?

**B3. Luồng Rút hồ sơ.** SRS + `[18][19][20]` mô tả luồng: Phiếu rút hồ sơ → Phiếu chuyển → Phiếu nhận
→ Công văn xác minh bổ sung → Phiếu trả → Phiếu nhận. Mockup **không có** chức năng này (chỉ có tab
*Mượn/trả hồ sơ*). Có phải dựng không? Bộ biểu mẫu phiếu đã chốt chưa? Câu hỏi ở `[19]` (vụ án đã có
trong kho số hóa thì tòa cấp trên còn phải làm phiếu rút hồ sơ không) đã có trả lời chưa?

**B4. Tách vụ án** `[14]`. Mockup mới có Ghép / Hủy ghép / Chuyển / Thêm vụ án, **chưa có Tách vụ án**.
Có nằm trong phạm vi không? Nếu có thì điều kiện tách là gì?

**B5. Quản lý vụ án tổng hợp** (`6. Quản lý vụ án tổng hợp.docx` — hồ sơ tổng hợp vụ án, khái niệm
*vụ án gốc* / *vụ án tạm*). SRS ghi rõ *"Hỗ trợ quản lý hồ sơ Vụ án đối với phân hệ HCTP"*. Vậy màn này
thuộc **HCTP hay Vụ GĐ,KT**? Mockup Vụ GĐ,KT có phải dựng không?

**B6. Thủ tục rút gọn** (Q&A câu 18). Mockup chưa có luồng *Vụ trưởng tổ chức họp → kết luận vụ án giải
quyết theo thủ tục rút gọn*. Câu hỏi cốt lõi chưa có trả lời: vụ án được chốt là rút gọn **từ lúc thẩm
phán cho ý kiến** hay **sau buổi họp**? Có biên bản họp không, ai ghi?

---

## C. Có trong mockup nhưng em chưa tìm thấy SRS mô tả

**C1.** Nhóm menu **"Quản lý đơn"** (Tiếp nhận đơn / Danh sách đơn / Phân công thẩm phán) — đây là chức
năng của VPHCTP được đưa vào mockup Vụ GĐ,KT để demo cho liền mạch, hay là phần chính thức của phân hệ
này? Nếu là VPHCTP thì có nên bỏ khỏi mockup không?

**C2.** Menu **"Công tác lãnh đạo" → "Phê duyệt đề xuất"** (`PheDuyetDeXuatView.tsx`, 974 dòng) — SRS nào
mô tả màn này? Em không map được vào file nào trong `2. Giám đốc, Kiểm tra`.

**C3.** Tab **"Tài liệu vụ án"** và **"Hồ sơ lưu trữ"** trong màn chi tiết vụ án — em mới thấy được nhắc
ở `[29][30]` (chỉ có tên chức năng, không có nội dung), chưa thấy SRS mô tả trường dữ liệu. Có SRS riêng
không, hay lấy theo hệ thống cũ?

**C4.** Thanh **"Tài khoản phân quyền"** cho chọn 1 trong 4 Vụ + vai trò *"Lãnh đạo TANDTC / Quản trị viên
(Toàn bộ 4 Vụ)"* (dùng ở 9 file). Đây là **công cụ demo** để chuyển đơn vị cho nhanh, hay phải mô phỏng
đúng phân quyền thật? Vai trò "xem được toàn bộ 4 Vụ" có tồn tại thật trong hệ thống không?

**C5.** Nhiều combobox trong mockup **chưa có danh mục giá trị** (ví dụ *Hình thức đơn*, *Thụ lý đơn* trong
`SearchFilterPanel.tsx` để rỗng). Danh mục chuẩn lấy từ đâu — có file danh mục dùng chung không, hay em
lấy theo hệ thống STG hiện tại?

---

## D. Chênh lệch giữa mockup và SRS — cần chốt lấy theo bên nào

**D1. Chi tiết vụ giải quyết đơn — bộ tab lệch nhau:**

| SRS (`2. Xem chi tiết vụ giải quyết đơn` + `4. SRS_Tờ trình`) | Mockup hiện tại |
|---|---|
| Thông tin vụ án | Thông tin **chung** |
| Danh sách đơn | Danh sách đơn |
| Phân công | Phân công |
| **Hồ sơ** | **Mượn/trả hồ sơ** |
| Tờ trình | Tờ trình |
| Giải quyết văn bản **đề nghị** | Giải quyết văn bản |
| *(không có)* | **Tài liệu vụ án** |
| *(không có)* | **Hồ sơ lưu trữ** |

→ Chốt giúp em: danh sách tab, **thứ tự tab**, và tên hiển thị chuẩn của từng tab.

**D2. Chi tiết vụ xét xử — bộ tab lệch nhau:**

| SRS (`2. GĐ,KT - Vụ xét xử/2. Xem chi tiết vụ XX`) | Mockup hiện tại |
|---|---|
| Thông tin vụ án | Thông tin vụ án |
| **Đơn GĐT,TT** | *(không có)* |
| Thụ lý | Thụ lý |
| *(không có)* | **Tờ trình** |
| Phân công | Phân công |
| Quyết định bị cáo (chỉ án hình sự) | Quyết định bị cáo (chỉ án hình sự) ✔ |
| Quyết định vụ án | Quyết định vụ án |
| **Xét xử GĐT, TT** | **Kết quả xét xử** |
| *(không có)* | **Tài liệu vụ án**, **Hồ sơ vụ án** |

→ Mockup **thiếu tab "Đơn GĐT,TT"**; **"Kết quả xét xử"** có phải chính là **"Xét xử GĐT, TT"** trong SRS
không, hay là hai thứ khác nhau? Tab "Tờ trình" ở màn vụ xét xử có đúng không (SRS không mô tả)?

**D3. Bộ tab lọc ở danh sách Quản lý vụ án:** mockup đang là *Tất cả / Đang giải quyết / Đã giải quyết*.
SRS quy định bộ tab nào? (Màn Quản lý vụ xét xử trong mockup lại dùng bộ khác: *Tất cả / Chưa có DS xét
xử / ...* — hai màn có cần thống nhất không?)

**D4. Tên hội đồng xét xử.** Mockup đang dùng *"Hội đồng 5 thẩm phán"* (31 chỗ) và *"Hội đồng toàn thể
(Chủ tọa: Chánh án TANDTC)"*. Tên hiển thị chuẩn trong SRS là gì? Và `[35]` hỏi *"biểu mẫu thành lập hội
đồng toàn thể có tương tự hội đồng 5 không"* — đã có trả lời chưa?

---

## E. Nghiệp vụ còn treo trong file họp — ảnh hưởng trực tiếp đến mockup, cần biết đã chốt chưa

| # | Nội dung | Vì sao cần |
|---|---|---|
| **E1** `[4]` | Khi thêm vụ án, hệ thống tự gom các đơn cùng **số / ngày / tòa xét xử / thẩm phán** vào 1 vụ — quy tắc này đã chốt chưa? | Quyết định logic màn Nhận đơn & thụ lý |
| **E2** `[3]` | VPHCTP chỉ chuyển đơn **sau khi đã có kết quả phân công TP** (không chuyển trước) — đã chốt chưa? | Quyết định trạng thái đơn đầu vào |
| **E3** `[6]` | Giao tiểu hồ sơ bản cứng/bản mềm: có cần **phiếu mượn / phiếu nhận** như hồ sơ không? | Màn Giao tiểu hồ sơ trong mockup đang không có phiếu |
| **E4** `[7]` | Phân công LĐV khi TP giải quyết là Phó Vụ trưởng / Vụ trưởng / TPB3 không thuộc vụ — có mặc định là Vụ trưởng không? | Logic màn Phân công TTV |
| **E5** `[8]` | Sửa kết quả phân công có **cần công văn** không? | Có phải thêm bước tạo công văn vào mockup |
| **E6** `[11]` | TPB3 đề xuất kháng nghị → đẩy về phân công lại **luôn**, hay cần LĐV + tổ thẩm phán cho ý kiến trước? | Luồng màn DS vụ án phân công TPTC |
| **E7** `[12]` | Kết quả giải quyết sau **khác** kết quả trước (trước trả lời đơn, sau kháng nghị) thì xử lý tiếp thế nào? | Luồng Thêm mới vụ án / rút hồ sơ đoàn kiểm tra |
| **E8** `[26]` | Ngày hiệu lực của QĐ hoãn thi hành án có phải là **ngày phát hành từ văn phòng** không? | Trường ngày trong tab QĐ bị cáo |
| **E9** `[27]` | KQ là QĐ kháng nghị (Chánh án) chuyển thẩm quyền XX về tòa tỉnh → **ai nhận / phân công / tạo vụ xét xử**? | Luồng nối từ vụ GQĐ sang vụ XX |
| **E10** `[50][51]` | Tờ trình khiếu nại dùng chung form với tờ trình vụ án nhưng kết quả là *Chấp nhận / Không chấp nhận*; và **thiếu biểu mẫu** kết quả khi chấp nhận khiếu nại | Màn Quản lý khiếu nại |
| **E11** `[54]` | Tờ trình Công văn trao đổi và tờ trình án tử hình **không cần số tờ trình**, đúng không? Cấp trình dùng chung với tờ trình thường? | Màn Công văn trao đổi |
| **E12** `[52]` | Quy trình công văn trao đổi: công văn gửi đến Tòa trước → Tòa phân công về từng Vụ — hiểu vậy đúng không? Có giữ chức năng trao đổi công văn **nội bộ giữa các đơn vị** như hệ thống cũ không? | Màn Công văn trao đổi |

---

## F. Biểu mẫu

**F1.** Các mục `[11][17][18][23][28][31][38][56]` đều đang **xin biểu mẫu** từ tòa (tờ trình thực tế,
phiếu mượn/trả của từng Vụ, phiếu rút hồ sơ, biểu mẫu kết quả giải quyết, biểu mẫu in DS tờ trình, biên
bản/QĐ hoãn phiên tòa, tài liệu án tử hình). Đã nhận đủ chưa, và để ở đâu? Thư mục `SRS/2. Giám đốc,
Kiểm tra/Biểu mẫu` hiện có đủ chưa hay còn thiếu?

**F2.** `[28]` Các loại án khác nhau (hình sự, dân sự, hành chính…) có **dùng chung biểu mẫu** không, hay
mỗi loại một mẫu riêng? (Ảnh hưởng đến việc mockup có phải tách form theo loại án hay không.)

**F3.** `[38]` Biểu mẫu hoãn phiên tòa đang dùng chung với giai đoạn sơ thẩm/phúc thẩm — giữ nguyên hay
làm mẫu riêng cho GĐT/TT?

**F4.** `[31]` Biểu mẫu in *Danh sách tờ trình / tờ trình kháng nghị* cần điều chỉnh thông tin hiển thị —
đã có bản chốt chưa?

**F5.** `[23]` Tòa có dùng **AI hỗ trợ soạn tờ trình**. Việc này có phải thể hiện trên mockup không (nút
gợi ý / sinh nội dung), hay nằm ngoài phạm vi?

---

## G. Câu hỏi về cách làm việc

**G1.** Khi mockup và SRS lệch nhau, mặc định lấy **SRS làm chuẩn** đúng không? Hay có những chỗ mockup
đã được chốt trong buổi demo mà SRS chưa kịp cập nhật (nếu có, chị chỉ giúp em danh sách)?

**G2.** Sau khi em sửa mockup, chị có cần em ghi lại **nhật ký thay đổi** (sửa gì, theo SRS mục nào)
để chị đối chiếu khi cập nhật SRS không? Nếu có thì theo mẫu nào?

**G3.** Có deadline / thứ tự ưu tiên màn nào cần xong trước cho buổi demo gần nhất không?
