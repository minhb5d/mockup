# ĐỐI CHIẾU SRS ↔ MOCKUP — Vụ Giám đốc, Kiểm tra (bản TANDTC)

**Ngày:** 27/08/2026 · **Mockup:** `ui-gdt-tt-main` (27 file, ~42.600 dòng) · **Chuẩn đối chiếu:** `SRS/2. Giám đốc, Kiểm tra`
**Phạm vi:** chỉ Vụ GĐ,KT. Không đối chiếu VPHCTP (`SRS/1.1`, `1.2`) và không áp tài liệu cấp Tỉnh (`SRS/2/4. GĐ,KT Tỉnh`).

**Quy ước:**
- **THIẾU** = SRS có, mockup chưa có → **bổ sung**
- **THỪA** = mockup có, SRS không mô tả → **note lại hỏi Lead**, chưa xóa
- **LỆCH** = cả hai đều có nhưng khác nhau → sửa mockup theo SRS
- **CẦN HỎI** = bản thân SRS mâu thuẫn / bỏ lửng → hỏi BA

---

# 1. MÀN NHẬN ĐƠN VÀ THỤ LÝ VỤ ÁN

## THIẾU
- **[Cao]** Popup **Trả đơn** (toàn bộ) — *SRS 1.2 Trả đơn* — mockup chỉ có nút không gắn handler (`NhanDonTLVuAnView.tsx:336`, bản chạy `App.tsx:399`). Cần: Ngày trả đơn (mặc định hôm nay, không sửa), Lý do (bắt buộc), "Tổng số đơn: [n]", bảng đơn đã tick, nút Trả đơn/Đóng, thông báo "Trả đơn thành công."
- **[Cao]** Popup **Ghép vụ án** (toàn bộ) — *SRS 1.5* — nút có (`shared.tsx:55`) nhưng không có onClick. Cần: khối tìm kiếm (Tòa ra BA/QĐ, Số BA/QĐ, Ngày BA/QĐ + Tìm kiếm/Làm lại), label "Ghép đơn [Mã đơn] với vụ án", DS vụ án radio chọn 1, cột Tên vụ án / Thông tin BA-QĐ & QHPL / Phân công (TTV, LĐV, TP) / Số lượng đơn / icon Xem, nút Ghép đơn–Đóng.
- **[Cao]** Popup **Chuyển vụ án** — *SRS 1.3* — nút có (`shared.tsx:52`) nhưng không mở modal xác nhận + tìm/chọn vụ án đích, không kiểm tra điều kiện chuyển.
- **[Cao]** Màn **Thêm mới vụ án** — *SRS 1.4.3* — nút mở `ThemHoSoScreen` (`App.tsx:3363`) mà file này **chỉ là 1 ảnh PNG tĩnh**. Cần dựng form thật: nhóm A Thông tin chung (Hình thức, Thủ tục giải quyết, Loại bản án, Loại án, **Số thụ lý**, **Ngày thụ lý**, **Người đứng đơn**, **Địa chỉ**, Ngày ghi trên đơn, **Ngày nhận đơn**); nhóm B Quá trình giải quyết (**Số BA/QĐ**, **Ngày BA/QĐ**, **Tòa ra BA/QĐ**, **QHPL**, QHPL tranh chấp); nhóm C bảng đương sự + người có quyền lợi/nghĩa vụ liên quan; nhóm D Phân công TTV/Lãnh đạo; nhóm E Lưu/Đóng.
- **[Cao]** Validate & cảnh báo khi Lưu/Đóng màn Thêm mới vụ án — *SRS 1.4.3 mục 29, 30* — "[Tên trường] là bắt buộc", "Chưa Lưu Vụ Án, bạn có chắc chắn Đóng?".
- **[Cao]** Tự động fill khi tra cứu bản án — *SRS 1.4.3 mục 14, 16, 21* — nhập Số/Ngày/Tòa BA/QĐ → tự điền QHPL + DS người liên quan.
- **[Cao]** Icon **Tạo tờ trình** ở cột Thao tác tab Chờ xin ý kiến — *SRS mục 34* — mockup chỉ có 1 icon Xem cho mọi tab (`NhanDonTLVuAnView.tsx:522`).
- **[TB]** Trường tìm kiếm "Số tờ trình phân công", "Ngày tờ trình phân công" — *SRS mục 17, 18*.
- **[TB]** Hiển thị "Số tờ trình - Ngày tờ trình" trong cột Thông tin đơn — *SRS mục 28*.
- **[TB]** Hiển thị "Đơn vị gửi công văn – số – ngày" khi hình thức đơn là công văn — *SRS mục 28*.
- **[TB]** Cột Người đứng đơn thiếu dòng "Địa chỉ:" và quy tắc rút gọn (>3 người → "… trong tooltip") — *SRS mục 29*.
- **[TB]** Quy tắc rút gọn đương sự trong cột BA/QĐ — *SRS mục 30* — hình sự tối đa 3 bị cáo + "[n-3] người khác"; hành chính/khác 1 người mỗi bên + tooltip.
- **[TB]** Dòng "Các bản án khác liên quan – hiện mờ" trong cột BA/QĐ — *SRS mục 30*.
- **[TB]** Cột Thông tin vụ án thiếu **LĐV** và **Trạng thái giao THS** (Chưa/Đã giao THS) — *SRS mục 31*.
- **[TB]** Cột Ý kiến lãnh đạo thiếu trạng thái **Trả lại** + lý do — *SRS mục 32* — mockup hard-code "Đã duyệt" (`NhanDonTLVuAnView.tsx:252`).
- **[TB]** Checkbox "Tổng đơn mới trong ngày: 03 đơn" + text "Tổng đơn: 100,000 đơn" — *SRS Mockup Màn 1, 2*.
- **[TB]** Thông báo "Không có dữ liệu phù hợp với điều kiện tìm kiếm." — *SRS mục 23*.
- **[TB]** Popup xác nhận **Hủy ghép vụ án** — *SRS 1.6* — (xem CẦN HỎI: SRS ghi "Hủy ghép vụ án - **Bỏ**").
- **[TB]** Dropdown người giao/nhận trong Giao tiểu hồ sơ phải hiển thị "[Họ tên, ngày sinh] / [Chức vụ, chức danh]" — *SRS Giao tiểu hồ sơ mục 5, 6, 8*.
- **[Thấp]** Bộ lọc "Giao tiểu hồ sơ" thiếu 2 giá trị (đủ 4: Đã/Chưa giao TTV, Đã/Chưa nhận từ VP HCTP) — *SRS mục 22*.

## THỪA (hỏi Lead)
- Cột "THÔNG TIN NHẬN/TRẢ" (Ngày nhận, Người thao tác, Ngày thao tác, Người trả, Ngày trả) — `NhanDonTLVuAnView.tsx:264`
- Cột "NGÀY DUYỆT TỜ TRÌNH" ở tab Đã có vụ án — `NhanDonTLVuAnView.tsx:265`
- Bộ lọc "Thuộc án" (Án quốc hội/chỉ đạo/TVTN/tử hình) — `SearchFilterPanel.tsx:55`
- Bộ lọc "Thời hiệu" — `SearchFilterPanel.tsx:59`
- Bộ lọc "Nơi chuyển" — `SearchFilterPanel.tsx:56`
- Bộ lọc "Thời gian chuyển" — `SearchFilterPanel.tsx:39`
- Toàn bộ khối tìm kiếm 12 trường trong màn Giao tiểu hồ sơ — `App.tsx:766` (SRS chỉ có bảng + Lưu/In/Đóng)
- Cột "HĐTP cấp phúc thẩm", "Thẩm phán chủ tọa cấp phúc thẩm" — `NhanDonTLVuAnView.tsx:161`
- Dropdown "Tài khoản phân quyền" (chuyển Vụ I/II/III/IV) — `shared.tsx:300` — công cụ demo
- Nút refresh trên thanh action — `NhanDonTLVuAnView.tsx:369`

## LỆCH
- Nút in: **SRS** "In danh sách" | **Mockup** "In báo cáo" và bấm vào mở màn soạn công văn (`NhanDonTLVuAnView.tsx:361`, `App.tsx:3388`)
- Nút reset: **SRS** "Làm mới" | **Mockup** "Xóa bộ lọc" (`SearchFilterPanel.tsx:312`)
- **SRS** "Người đứng đơn" | **Mockup** "Người gửi đơn" (`SearchFilterPanel.tsx:19`)
- **SRS** "Thẩm tra viên" | **Mockup** "Cán bộ giải quyết đơn" (`SearchFilterPanel.tsx:49`)
- Địa chỉ gửi: **SRS** Tỉnh/thành + **Xã** + chi tiết | **Mockup** Tỉnh/Thành + **Quận/Huyện** (`SearchFilterPanel.tsx:181`) — mô hình 2 cấp
- "Phân loại đơn": **SRS** 2 giá trị (Đơn mới / Đơn khiếu nại sau khi đã giải quyết) | **Mockup** 4 giá trị, 3 trong đó thực chất là *Hình thức đơn* (`SearchFilterPanel.tsx:31`)
- **SRS** "Trạng thái thụ lý" (Thụ lý mới / Đã thụ lý) | **Mockup** "Trạng thái" (Chưa nhận/Đã nhận/Trả lại) (`SearchFilterPanel.tsx:209`)
- **SRS** "Án vị thành niên"/"Người chưa thành niên" | **Mockup** "Án TVTN" (`shared.tsx:85`)
- Điều kiện enable Trả đơn / Giao THS — mockup chỉ check tab, không check trạng thái đơn (`NhanDonTLVuAnView.tsx:346`)
- Tab mặc định màn Giao tiểu hồ sơ: **SRS** "Nhận THS từ VPHCTP" | **Mockup** "giao-ttv" (`App.tsx:615`)
- Tab "Giao THS đến TTV": **SRS** bỏ cột "Ngày Vụ nhận" | **Mockup** vẫn còn (`App.tsx:949`)
- Box KQGQ trước đó: **SRS** "Đã có TBGQ: [Loại] - [Số] - [Ngày]" | **Mockup** hard-code "TBTLĐ số 1" (`NhanDonTLVuAnView.tsx:206`)
- Cột Thông tin đơn tab Chờ xin ý kiến: **SRS** chỉ Mã đơn + hình thức đơn | **Mockup** render đủ như các tab khác
- Nhãn "Thẩm phán (Dự kiến)": **SRS** bỏ "(Dự kiến)" khi tờ trình đã có bút phê | **Mockup** tính theo tab (`NhanDonTLVuAnView.tsx:20`)

## CẦN HỎI
- SRS ghi tiêu đề "**Hủy ghép vụ án - Bỏ**" nhưng bên dưới vẫn mô tả đầy đủ use case. Giữ hay bỏ?
- Ghi chú trong SRS Màn 2: "**Bỏ Button Thêm vụ án + Ghép vụ án BỔ SUNG ĐÊM NGÀY 18/8 NHÉ ANH TRUNG**" mâu thuẫn với mục 31 (vẫn có 2 nút). Chốt bản nào?
- Ghi chú SRS Màn 4: "**Bỏ Thông tin bản án** > Thêm Ý kiến lãnh đạo" — bỏ cột nào chính xác?
- SRS mục 11 "Thụ lý đơn" và mục 20 "Trạng thái thụ lý" cùng danh sách giá trị — trùng lặp hay 2 trường khác nhau?
- BR-05 (danh mục QHPL tranh chấp) còn dở: "…(nhiều quá thống kê sau thêm)" — chưa đủ để dựng combobox.
- Tab "Hồ sơ kháng nghị" bị comment-out trong `data.ts:591` nhưng use case SRS vẫn liệt kê — tách màn riêng hay là 1 tab của màn này?
- **Lỗi kỹ thuật cần dọn:** `GiaoTieuHoSoView` có **2 bản trùng lặp** — bản chạy là `App.tsx:614`, bản trong `NhanDonTLVuAnView.tsx:563` là code chết và còn thiếu import `Calendar`.

---

# 2. QUẢN LÝ VỤ GIẢI QUYẾT ĐƠN (danh sách + chi tiết)

## THIẾU
### Màn danh sách — bộ lọc
- **[Cao]** Bộ lọc **Loại BA GĐT** (Đơn đề nghị GĐT,TT / Rút hồ sơ đoàn kiểm tra / Chủ động GĐT qua Bản án) — *SRS Tìm kiếm nâng cao mục 4*
- **[TB]** Bộ lọc **Thuộc Vụ** — *SRS Tìm kiếm cơ bản mục 6*
- **[TB]** Bộ lọc **Hồ sơ từ ngày – Đến ngày** — *mục 2*
- **[TB]** Bộ lọc **Kết quả từ ngày – Đến ngày** — *mục 10*
- **[TB]** Bộ lọc **Kết quả xét xử từ ngày – Đến ngày** — *mục 12*
- **[TB]** Bộ lọc **Thông báo** (Chưa/Có thông báo TT, Chưa/Có thông báo KQ) — *mục 18*
- **[TB]** Bộ lọc **Loại công văn** — *mục 20*

### Màn danh sách — bảng
- **[Cao]** Dòng cha (vụ án) thiếu số/ngày bản án, Tòa ban hành, tổng số đơn đã thụ lý, **badge tình trạng hồ sơ** — *SRS DS vụ án hình sự mục 5, 6* — mockup chỉ STT + mã + tên (`QuanLyVuAnView.tsx:938`)
- **[Cao]** Cột "Thông tin đơn & thụ lý" thiếu: label loại án (Án quốc hội/tử hình/chỉ đạo), công văn chính `[Đơn vị gửi]-[Số CV]-[Ngày CV]`, thông tin chỉ đạo `[Tên LĐ]-[Chức vụ]: Ý kiến`, công văn chuyển đơn/kiến nghị, Thông báo tình thế `TBTT: [Số]-[Ngày]` — *mục 8*
- **[Cao]** Cột "Thông tin bản án đề nghị" thiếu DS bị cáo được đề nghị GĐT (tối đa 3 + "[n-3] bị cáo khác" + tooltip) và **Thời hiệu** ở nhánh hình sự — *mục 11*
- **[Cao]** Cột "Trạng thái" thiếu KQGQ từng đơn kèm `[Số]-[Ngày]` — *mục 10*
- **[TB]** Cột "Phân công" nhánh hình sự thiếu **Thẩm phán** — *mục 12*
- **[TB]** Cột "Người đứng đơn" thiếu địa chỉ — *mục 9*
- **[TB]** Tooltip xem đầy đủ Nguyên đơn/Bị đơn — *SRS DS các vụ án còn lại mục 9*
- **[Thấp]** Combobox số bản ghi/trang chỉ có "10 / trang", thiếu 20/50/100 — *mục 17*

### Tab Thông tin vụ án
- **[Cao]** Không có nút **Lưu**/**Đóng** và cảnh báo kèm theo — *SRS khối D mục 20, 21* — mockup chỉ có "✏ Sửa thông tin" (`TabThongTin.tsx:925`). Thiếu "[Tên trường] là bắt buộc", "Các thông tin thay đổi chưa được Lưu", thông báo về VP HCTP.
- **[Cao]** Chế độ sửa: cho sửa Thủ tục giải quyết, Thời hiệu, Bản án bị GĐT + **icon Tra cứu** để update lại thông tin — *SRS Mockup Màn 1*
- **[Cao]** Hộp **tìm kiếm DS người liên quan** (combobox liệt kê người ở các quá trình giải quyết trước, chọn nhiều) — *SRS Thông tin đương sự mục 13*
- **[Cao]** Bảng Người khiếu nại thiếu cột **"Người được khiếu nại"** và **"Nội dung khiếu nại" (bắt buộc)**
- **[TB]** Cột Họ tên thiếu **CCCD** và label thống kê (Đầu vụ / Dưới 18 tuổi / Tái phạm) + label "Được GĐT,TT" — *mục 14*
- **[TB]** Thao tác **Sửa** trên từng dòng người liên quan — *mục 20* (mockup chỉ Xem + Xóa)

### Tab Danh sách đơn
- **[Cao]** **Checkbox chọn đơn** + popup xác nhận tách vụ án + cảnh báo "Chọn đơn để tách vụ án" — *SRS mục 8*
- **[TB]** Ghi chú phân loại: Đơn thụ lý đi kèm (không xem chi tiết được), Ghi chú 2 – Án quốc hội, Ghi chú 3 – Án chỉ đạo — *mục 5*
- **[TB]** Ẩn tab DS đơn với vụ "Rút hồ sơ đoàn kiểm tra" và "Chủ động GĐT qua bản án" — *SRS Điều kiện trước*

### Tab Hồ sơ (Mượn/trả hồ sơ)
- **[Cao]** Trường **Đơn vị cụ thể** (combobox phụ thuộc Đơn vị giữ hồ sơ: TAND/VKS/Trại giam/Trại tạm giam/Khác) — *SRS mục 3* — mockup là textbox tự do (`QuanLyVuAnView.tsx:1757`)
- **[Cao]** Trường **Nội dung hồ sơ** (bắt buộc, chỉ hiện với Phiếu trả)
- **[TB]** Đổi nhãn "Ngày lập phiếu" → **"Ngày nhận"** khi loại phiếu là Phiếu nhận — *mục 5*
- **[TB]** **Bảng tài liệu đính kèm** (Tên, Loại, Ngày tạo, Người tạo) — *SRS khối B*
- **[TB]** Cột "Loại phiếu" thiếu **[Số thứ tự lần tạo]** (Phiếu mượn 1, 2…)
- **[Thấp]** Cảnh báo "Bạn có chắc chắn đóng khi chưa Lưu?"

### Tab Giải quyết văn bản đề nghị
- **[Cao]** Popup **Quyết định tạm đình chỉ thi hành án** thiếu gần hết — *SRS Màn 6 mục 5–13* — thiếu Căn cứ điều luật (Bộ luật/Điều/Khoản/Điểm + nút Thêm điều luật), bảng Quyết định tạm đình chỉ (Bản án/QĐ, Phần quyết định, Hình phạt chi tiết), nút Thêm quyết định, bảng Nơi nhận đầy đủ, nút Lấy số/Trình ký/Xem biểu mẫu
- **[Cao]** Kết quả **Kháng nghị** thiếu trường bắt buộc: **Thẩm quyền xét xử**, **Nội dung vụ án**, **Xét thấy**, **Quyết định** — *SRS Màn 2 mục 2.6–2.9*
- **[Cao]** Biểu mẫu **VKS đang giải quyết**: nút Thêm công văn + bảng Thông tin quyết định/công văn — *Màn 2 mục 4.5–4.6*
- **[Cao]** Popup xác nhận **xóa kết quả giải quyết** + thao tác **Sửa/Xóa** từng dòng — *Màn 3 mục 18–20* (mockup chỉ có icon Xem)
- **[TB]** Cột **Ngày phát hành** trong bảng QĐ tạm đình chỉ/hoãn THA — *khối A mục 7*
- **[TB]** Nơi nhận thiếu: Cơ quan THA hình sự / THA dân sự / Đơn vị VKS / Trại giam / Trại tạm giam — *mục 2.10*
- **[TB]** Nút **Trình duyệt** + radio Trình duyệt/Trình ký + trường **Nội dung duyệt ký** — *Màn 8 mục 3*
- **[TB]** BR-05 (ẩn nút thêm KQ khi mọi đơn đã có KQ), BR-02 (đơn đã có KQ không hiện trong dropdown Đơn liên quan)

### Khung chi tiết
- **[Cao]** Chặn chuyển tab khi thiếu thông tin bắt buộc + cảnh báo "Bổ sung các thông tin bắt buộc để tiếp tục thao tác" — *SRS dòng đầu tài liệu*

## THỪA (hỏi Lead)
- Dòng "Mã vụ án" trong Thông tin chung — `TabThongTin.tsx:750` — **SRS đã gạch bỏ**
- Dòng "Loại bản án" — `TabThongTin.tsx:751` — **SRS đã gạch bỏ**
- Cột "VỤ ÁN", "LOẠI BA/QĐ", "GIAI ĐOẠN" ở bảng Quá trình giải quyết — `TabThongTin.tsx:806` — **SRS ghi BỎ**
- Cột "GIAI ĐOẠN", "CHỨC DANH" ở bảng phân công Thẩm phán — `QuanLyVuAnView.tsx:1989` — **SRS gạch bỏ**
- Cột "GIAI ĐOẠN", "CHỨC DANH TTV", "TÊN CHỨC VỤ LĐ" bảng phân công TTV/LĐV — `QuanLyVuAnView.tsx:2032` — **SRS gạch bỏ**
- Trường "Cán bộ"/"Tên cán bộ" popup Tạo phiếu — `QuanLyVuAnView.tsx:1761` — **SRS gạch bỏ**
- Trường "Người ký ban hành" popup Tạo phiếu — `QuanLyVuAnView.tsx:1739`
- Cột "Tên Bị cáo" bảng QĐ tạm đình chỉ/hoãn THA — `QuanLyVuAnView.tsx:3133` — **SRS gạch bỏ**
- Popup `QuickViewDanhSachDonModal` — `QuanLyVuAnView.tsx:469`
- Bộ lọc "Phân loại đơn" — `VuAnSearchFilterPanel.tsx:457`
- Bộ lọc "Ngày tuyên án" (ô đơn) — `VuAnSearchFilterPanel.tsx:479`
- Tab "Tài liệu vụ án" + "Hồ sơ lưu trữ" — `QuanLyVuAnView.tsx:3346` — *(SRS Vụ xét xử cũng không có; xem mục 6)*
- Nút Xóa ở bảng QĐ hoãn THA — `QuanLyVuAnView.tsx:3166`

## LỆCH
- Ô tìm kiếm đương sự: **SRS** 3 ô riêng (Bị cáo / Nguyên đơn / Bị đơn) | **Mockup** gộp 1 ô (`VuAnSearchFilterPanel.tsx:269`)
- Trạng thái hồ sơ: **SRS** Đã/Chưa có hồ sơ (con: Đã/Chưa có phiếu mượn) | **Mockup** 5 giá trị phẳng (`:351`)
- Tờ trình lãnh đạo: **SRS** Chưa/Đã có tờ trình / Đã có tờ trình lần 1 | **Mockup** đang là danh mục *Yêu cầu trình tiếp* (`:386`)
- Ý kiến tờ trình: **SRS** 5 nhóm giá trị | **Mockup** 4, thiếu "Chưa/Đã có ý kiến", "Nghiên cứu xác minh bổ sung", "Yêu cầu trình tiếp" (`:418`)
- Yêu cầu trình tiếp: **SRS** 12 giá trị | **Mockup** 4 (`:428`)
- Kết quả giải quyết: **SRS** 9 giá trị | **Mockup** 3 (`:440`)
- Cấp xét xử: **SRS** ST/PT/GĐT/TT | **Mockup** chỉ GĐT/TT (`:467`)
- Án thời hiệu: **SRS** 6 mốc (<1, <2, <3, <6 tháng, <1 năm, đã hết) | **Mockup** 3 giá trị (`:326`)
- Rút kháng nghị: **SRS** date range | **Mockup** 1 ô (`:493`)
- Thuộc án: **SRS** "Người chưa thành niên" | **Mockup** "Án TVTN" (`:314`)
- Nút in: **SRS** "In danh sách" | **Mockup** "In biểu đồ" (`QuanLyVuAnView.tsx:905`)
- Tổng bản ghi: **SRS** count **theo vụ án** | **Mockup** đếm theo dòng đơn (`:1288`)
- Icon xem chi tiết: **SRS** icon mắt | **Mockup** nhánh vụ án còn lại dùng "⋮" (`:1276`)
- Bảng Quá trình giải quyết: **SRS** gộp Số+Ngày+Tòa vào 1 cột, cho edit | **Mockup** tách 3 cột, không edit (`TabThongTin.tsx:806`)
- Bảng phân công: **SRS** gộp `[Họ tên / Chức danh]`, sắp mới→cũ | **Mockup** tách cột
- Tên tab: **SRS** "Thông tin vụ án" / "Hồ sơ" / "Giải quyết văn bản đề nghị", mặc định mở tab Thông tin vụ án | **Mockup** "Thông tin chung" / "Mượn/trả hồ sơ" / "Giải quyết văn bản", mặc định **danh-sach-don** (`:3321`)
- Nút tách: **SRS** "Tách vụ án" | **Mockup** "Tách vụ kiện" (`:1384`)
- Cột: **SRS** "Người đứng đơn" | **Mockup** "Người dùng đơn" (`:1399`)
- Số phiếu: **SRS** cấp số tự động, không cho nhập, `[Số]/[Năm]/[Hậu tố]` | **Mockup** input tự do (`:1735`)
- Loại phiếu: **SRS** "Phiếu rút hồ sơ (dân sự là Phiếu mượn)" | **Mockup** chỉ "Phiếu mượn" (`:1714`)
- Số bút lục: **SRS** chỉ hiện với Phiếu trả/chuyển/nhận | **Mockup** hiện với cả Phiếu mượn (`:1742`)
- Bảng Nơi nhận: **SRS** chỉ 5 loại phiếu | **Mockup** hiện cố định mọi loại (`:1772`)
- Bảng DS phiếu: **SRS** gộp "Thông tin phiếu", đổi "Cán bộ"→"Người thao tác", "Trạng thái"→"Người ký" 4 trạng thái | **Mockup** giữ nguyên 4 cột (`:1902`)
- Checkbox "QĐ hoãn thi hành án": **SRS** án hình sự đổi thành "QĐ tạm đình chỉ THA" và **bỏ checkbox** | **Mockup** vẫn là checkbox (`:3080`)
- Chọn bị án khi kháng nghị: **SRS** chọn **nhiều** | **Mockup** select đơn (`ThemKetQuaModal.tsx:616`)
- **SRS** "Ghi chú" khi Xếp đơn | **Mockup** "Lý do xếp đơn" (`ThemKetQuaModal.tsx:775`)
- Thao tác dòng phiếu: **SRS** Sửa/In/Xóa (Sửa & Xóa chỉ khi chưa trình ký) | **Mockup** nút "Sửa" dùng icon mắt, không ràng buộc (`:1941`)

## CẦN HỎI
- SRS không liệt kê bộ tab của màn danh sách; mockup có Tất cả / Đang giải quyết / Đã giải quyết. Chốt bộ tab + tab mặc định.
- Checkbox "chọn tất cả" (SRS mục 3): mockup có checkbox nhưng không nối logic — thiếu chức năng hay chỉ là mockup tĩnh?
- SRS quy định "mặc định Dân sự chung; Vụ có cả HS + DS thì ưu tiên dân sự chung"; mockup lấy mặc định theo `userRole` (`:48`). Chốt quy tắc.
- SRS có **2 layout bảng khác nhau** (hình sự vs các vụ còn lại); mockup dùng **một bộ header chung** (`:922`) → nhánh "các vụ án còn lại" render lệch cột so với `<colgroup>`. Lỗi hay chủ ý?
- Nơi nhận chi tiết trong mọi popup là danh sách cứng, không phụ thuộc "Tòa đang đăng nhập / Tòa xét xử bản án bị GĐT" như SRS.
- Không tìm thấy SRS mô tả 2 tab "Tài liệu vụ án" và "Hồ sơ lưu trữ" — thuộc SRS nào?

---

# 3. TỜ TRÌNH (Vụ giải quyết đơn)

> Lưu ý kỹ thuật: tab Tờ trình đang chạy là `QuanLyVuAnView.tsx:2668` (`TabToTrinh`), render tại `:3402`. Bản `App.tsx:1750` là **code chết trùng lặp** — dễ sửa nhầm, cần dọn.

## THIẾU
- **[Cao]** Popup **"Chọn đơn cần xử lý"** — *SRS 2.3 + 3.3* — toàn bộ popup (Từ khóa, Ngày nhận đơn, Tìm kiếm, Làm mới, bảng đơn 7 cột, checkbox chọn nhiều, nút Hủy/Chọn đơn xử lý). Mockup nút "Thêm đơn xử lý" (`QuanLyVuAnView.tsx:2589`) chỉ push cứng 1 dòng.
- **[Cao]** Panel **"Áp dụng ý kiến cho đơn khác"** trong popup Tạo tờ trình — *SRS 2.4 + 3.4* — chỉ tồn tại ở màn Phê duyệt (`PheDuyetDeXuatView.tsx:500`).
- **[Cao]** Bắt buộc **tải file Word đã ký tay** trước khi trình ký + chặn nút Trình ký — *SRS BR-03*
- **[Cao]** Tải **file tổng hợp chữ ký** của lãnh đạo sau khi kết thúc quá trình trình — *SRS "Thay đổi tờ trình 15/08"*
- **[Cao]** **Checkbox chọn văn bản** trên bảng Danh sách văn bản — *SRS 3.1 A#2, #3* — nút Trình văn bản đang áp dụng cho toàn bộ danh sách
- **[Cao]** Checkbox **"Giải quyết theo thủ tục rút gọn"** trong popup Tạo tờ trình — *SRS 3.2 D.2 #26*
- **[Cao]** Nút **"Xem biểu mẫu"** ở nhóm nút cuối popup Tạo tờ trình (án hình sự) — *SRS 3.2 E #30*
- **[Cao]** Ràng buộc **"mỗi lần trình chỉ một cấp lãnh đạo tiếp theo"** — *SRS BR-04* — `TrinhKyModal.tsx:1195` cho thêm không giới hạn
- **[Cao]** Ràng buộc **"lãnh đạo trước phải cho ý kiến mới được trình lãnh đạo sau"** — *SRS "Thay đổi tờ trình 15/08"*
- **[TB]** Badge "Rút gọn" trên tài liệu tại màn Trình ký — *SRS 3.7 B#4*
- **[TB]** Icon **Sửa** tại bảng Danh sách người được trình — *SRS 3.7 D#13*
- **[TB]** Lọc "Ngày" và "Loại tài liệu" tại popup Thêm tài liệu — *SRS 3.5 D#18, #19*
- **[TB]** Counter "Đã chọn N tài liệu" — *SRS 3.5 D#20*
- **[TB]** **"Tờ trình tổng hợp"** là mục mặc định đứng đầu + cơ chế ghép phiếu ký vào tờ trình gốc — *SRS 3.7 B#3*
- **[TB]** Giới hạn **4000 ký tự** cho Nội dung đề xuất + nội dung mẫu đổi theo loại đề xuất — *SRS 3.2 #22, #27*
- **[TB]** DS người được trình phải lọc theo Loại án / phân công thực tế — *SRS Danh mục cấp trình BR-02* — mockup là danh sách cứng (`TrinhKyModal.tsx:1220`)
- **[TB]** Màn cấu hình **"Danh mục cấp trình"** — *SRS Danh mục cấp trình mục 3* — chưa có (Mã, Tên, Thứ tự, Switch Hoạt động, tab Chức danh áp dụng, tab Theo tổ/nhóm, Thêm/Sửa/Xóa)
- **[TB]** Dòng tài liệu con của lượt trình đã duyệt — *SRS 3.1 B#27* — `subRows` luôn rỗng
- **[Thấp]** Xác nhận khi đóng popup lúc chưa lưu — *SRS 3.2 #2, #28*
- **[Thấp]** Kiểm tra lại trạng thái trước khi thu hồi — *SRS 4.6 bước 7-9*

## THỪA (hỏi Lead)
- Cột "NGÀY TẠO" trong Danh sách văn bản — `QuanLyVuAnView.tsx:2790`
- Cột "CẤP TRÌNH" tách riêng trong Lịch sử trình ký — `:2885` (SRS gộp vào 1 cột "Lãnh đạo trình")
- Icon "Xóa tờ trình"/"Xóa dự thảo" — `:2834`, `:2839`
- Trạng thái **"Từ chối"** trong Lịch sử trình ký — `:2679` (SRS dùng "Trả lại" — BR-07)
- Icon "Trình ký" trên dòng lịch sử đã duyệt — `:2925`
- Kết quả **"Xếp đơn"** và nhánh "vks-dang-giai-quyet" trong popup Tạo dự thảo — `TaoDuThaoModal.tsx:970`, `QuanLyVuAnView.tsx:2745` — *SRS 3.6: "trong phạm vi tờ trình chỉ áp dụng hai kết quả: Trả lời đơn và Kháng nghị"*
- Trường "Chọn Bị cáo" khi Kết quả = Kháng nghị — `TaoDuThaoModal.tsx:988`
- 2 giá trị cấp trình "Trình dự thảo trả lời đơn"/"Trình dự thảo kháng nghị" tại màn Trình ký — `TrinhKyModal.tsx:1213`
- Nút chuyển trạng thái demo "Đang xem: Dữ liệu hồ sơ mẫu" — `TrinhKyModal.tsx:613`
- **Code chết:** `App.tsx:1750` `TabToTrinh` (bản sao đầy đủ, không render)

## LỆCH
- **Loại đề xuất giải quyết (hình sự)**: **SRS** Trả lời đơn / Kháng nghị / VKS đang xử lý / Xếp đơn / Nghiên cứu, xác minh, bổ sung | **Mockup** Kháng nghị / Không kháng nghị / Yêu cầu xác minh / Khác (`QuanLyVuAnView.tsx:2616`)
- **Ý kiến TTV (án còn lại)**: **SRS** **Radio button**, 5 options | **Mockup** **combobox**, danh mục khác (`:2560`)
- **Ý kiến đề xuất tờ trình khiếu nại**: **SRS** chỉ 2 (Chấp nhận / Không chấp nhận) | **Mockup** 4 (`:2496`)
- **Ý kiến lãnh đạo màn Phê duyệt**: nhãn lệch ("VKS đang giải quyết" vs "đang xử lý"), nhánh Vụ 2-3-4 dùng danh mục khác nữa (`PheDuyetDeXuatView.tsx:551`, `:679`)
- Icon thao tác dòng đơn popup Tạo tờ trình: **SRS** mở panel "Áp dụng ý kiến cho đơn khác" | **Mockup** mở modal "Xem biểu mẫu" (`:2627`) — đúng vị trí, sai chức năng
- **Thu hồi**: **SRS** BR-06 — thu hồi toàn bộ văn bản của lần trình, cập nhật trạng thái về "Chờ trình", **ghi lịch sử** | **Mockup** xóa hẳn dòng khỏi lịch sử (`:2757`)
- **Trình lại**: **SRS** mở popup tờ trình và **kế thừa dữ liệu** | **Mockup** mở thẳng màn Trình ký (`:2829`)
- **Xem biểu mẫu**: **SRS** đã trình ký → PDF; chưa trình ký → Word sửa được | **Mockup** luôn ở chế độ Word (`:2058`)
- Bộ lọc "Lọc theo đơn": **SRS** nguồn là DS đơn trong vụ | **Mockup** tách chuỗi từ nội dung ý kiến (`:2731`)
- Cột "Ý kiến" lịch sử: **SRS** cú pháp `[Họ tên NĐĐ] - STL:[STL]-[Ngày]: [Ý kiến]`, cắt 30 ký tự | **Mockup** nguyên văn (`:2899`)
- Cột "Trạng thái" dòng tờ trình: **SRS** Đã ký / Chờ ký | **Mockup** luôn "–" (`:2814`)
- Nút màn Phê duyệt: **SRS** "Từ chối" | **Mockup** "Trả lại" (`PheDuyetDeXuatView.tsx:728`); chưa có BR-07 (trả tờ trình → trả toàn bộ dự thảo đi kèm)
- Popup Thêm tài liệu: **SRS** tiêu đề "Thêm tài liệu vào hồ sơ tờ trình", tab "Các giai đoạn còn lại", nút Hủy/Lưu | **Mockup** "Hồ sơ lưu trữ - Vụ án…", "Tất cả giai đoạn", "Đóng"/"Xác nhận bổ sung tài liệu" (`TrinhKyModal.tsx:608`)
- Popup Tạo tờ trình khối thông tin vụ án: **SRS** có trường **"Giai đoạn"** | **Mockup** thiếu, lại thêm "Mã vụ án" (`:2419`)

## CẦN HỎI
- Điều kiện tách giao diện là **Loại án = Hình sự** (theo SRS) hay **Vụ 1 vs Vụ 2,3,4** như mockup (`isVu234`, `:2321`)? Hai tiêu chí không tương đương.
- BR-01: "Chỉ chọn đơn chưa thuộc tờ trình nào hoặc đã bỏ khỏi tờ trình trước" — cần nguồn dữ liệu và điều kiện lọc để dựng popup chọn đơn.
- BR-01 dòng cuối: "Nếu có ít nhất 01 đơn đủ điều kiện phân công lại TPTC thì thực hiện phân công lại" — tự động khi lưu tờ trình hay thao tác riêng?
- SRS 3.1 #14 "Tờ trình đủ điều kiện trình lại" — chưa định nghĩa điều kiện. Mockup hiện icon cho **mọi** dòng.
- BR-11 quy tắc đặt tên biểu mẫu — mockup đặt tên tùy tiện (`:2705`, `:2742`). Có áp dụng BR-11 không?
- "Người được trình" cho "Trình Thẩm phán": hiển thị đồng thời TP phân công và TPTC tái phân công, hay chỉ 1 tùy trạng thái?
- BR-03 màn Phê duyệt: checkbox rút gọn chỉ hiện với vai trò Thẩm phán — mockup luôn hiện. Danh sách vai trò được phép?

---

# 4. VỤ XÉT XỬ GĐT/TT (danh sách + chi tiết + lên lịch + phân công HĐXX)

## THIẾU
- **[Cao]** Tab **"Đơn GĐT,TT"** trong chi tiết vụ xét xử — *SRS Xem chi tiết vụ XX* — `DETAIL_TABS` (`QuanLyVuXetXuView.tsx:434`) không có. Cần bảng: Mã đơn, Thông tin giải quyết đơn (Thụ lý mới / TLM trùng TP / Đã thụ lý), Người đứng đơn, Phân loại (đơn chính/trùng/thụ lý đi kèm + ghi chú Án QH, Án chỉ đạo), KQGQ đơn (chỉ đơn có QĐ kháng nghị), icon Xem đơn scan. Ẩn tab khi vụ XX là Hồ sơ kháng nghị.
- **[Cao]** **12/21 trường tìm kiếm** màn Quản lý vụ xét xử — *SRS Quản lý vụ XX mục A* — mockup chỉ có 8 (`:6572`). Thiếu: Nguyên đơn/Bị đơn, Số thụ lý XX, Số thụ lý XX từ–đến ngày, Xét xử từ–đến ngày, Trạng thái xét xử, Thẩm phán, Hoãn THA?, Số kháng nghị, Ngày kháng nghị, Người kháng nghị, Thẩm quyền xét xử, Án lệ áp dụng.
- **[Cao]** Chức năng **In báo cáo** (2 biểu mẫu: "Biểu mẫu vụ xét xử GĐT,TT" / "Biểu mẫu vụ rút kháng nghị") + hộp tiêu chí in + tiêu đề BC tự sinh — *SRS Quản lý vụ XX & in BC* — mockup chỉ có "Tạo danh sách vụ xét xử" và "Xuất Excel" (`:6741`)
- **[Cao]** **Popup Sửa tội danh / hình phạt** ở tab Kết quả xét xử — *SRS Xét xử GĐT,TT — Bảng Popup sửa tội danh* — nút "Sửa" (`:4635`) không mở gì. Cần: Án phí, Ngày nhận bản án, Ngày hiệu lực, Lý do, Đối chiếu so sánh (Bản án/QĐ | Cáo trạng), Điều chỉnh tội danh (3 nhóm/16 option), Năm bộ luật, Điều luật, Khoản, toggle Tội danh chính + logic auto-tích "Xét xử lại"/"Đổi hình phạt"
- **[Cao]** Trường **"Tòa án xét xử lại"** ở tab Kết quả — *SRS mục B.11*
- **[Cao]** **Bảng Điều luật** nhiều dòng ở tab Kết quả (Bộ luật / Điều luật chọn nhiều / Khoản / Điểm + Lưu-Hủy-Sửa-Xóa) — *SRS mục B.12* — mockup chỉ 2 select đơn (`:4518`)
- **[Cao]** Trường **"Quá hạn luật định"** tại tab Thụ lý (Không / Quá hạn chủ quan / Quá hạn khách quan) — *SRS Thụ lý mục B.3*
- **[Cao]** Luồng nhập & Lưu **Số/Ngày thụ lý xét xử** — *SRS Thụ lý B.1, B.2, B.5* — mockup hiển thị cứng, không có ô nhập/nút Lưu, thiếu quy tắc "bắt buộc cả 2 trường", "gợi ý số trống gần nhất", "chưa có số thụ lý thì ẩn các tab sau"
- **[Cao]** **Kiểm tra trùng lịch xét xử** (theo Ngày + Giờ/Cả ngày + Phòng) + cảnh báo "Lịch xét xử đang trùng với {Tên vụ án}." — *SRS Lên lịch xét xử mục 13*
- **[Cao]** **Phòng xét xử** (bắt buộc) trong popup Thêm/Cập nhật lịch — *SRS Lên lịch mục 3, 9* — popup (`PhanCongHDXXView.tsx:1026`) thiếu hẳn
- **[Cao]** Biểu mẫu **"Thông báo cho VKSNDTC tham gia phiên tòa" (Thư mời VKS)** — *SRS Phân công HĐXX mục 2.2.D.2 + mục 7* — dropdown chỉ có 2 option (`PhanCongHDXXView.tsx:4211`)
- **[TB]** Nút **"Xem kết quả xét xử"** trên hàng danh sách — *SRS phần Phân tab*
- **[TB]** Thông tin chung vụ án thiếu: Số–Ngày thụ lý xét xử, Trạng thái, VKS giải quyết (đang comment `:581`), Thời hiệu giải quyết, QHPL (bắt buộc), QHPL thống kê — *SRS mục A.5–A.11*
- **[TB]** Cột **"Người được khiếu nại"** + ràng buộc "Nội dung khiếu nại bắt buộc" — *SRS mục C.8*
- **[TB]** Cảnh báo thiếu thông tin bắt buộc: "Bổ sung các thông tin bắt buộc để tiếp tục thao tác", "Không tìm thấy thông tin người liên quan…", "Các thông tin thay đổi chưa được Lưu", "[Tên trường] là bắt buộc"
- **[TB]** Thanh thống kê lịch xét xử thiếu loại **"Thi hành án"** và thiếu số đếm — *SRS Lên lịch mục 2*
- **[TB]** Bộ lọc **"Người tạo"** và **"Cảnh báo trùng"** trên màn Lịch xét xử — *SRS mục 6, 7*
- **[TB]** Nhóm Thông tin vụ án / tra cứu vụ án trong popup Thêm lịch (Số thụ lý, Ngày thụ lý, icon Tra cứu, link "Thông tin vụ án tìm được") — *SRS mục 5–9*
- **[TB]** **Nút Xóa lịch xét xử** + hộp xác nhận — *SRS mục 11*
- **[TB]** Bộ lọc riêng của **Danh sách phân công HĐXX** (Số danh sách, Ngày danh sách, Đơn vị tạo, TP chủ tọa, TP thành viên, Trạng thái, Hội đồng xét xử) — *SRS 2.1.A* — mockup đang dùng bộ lọc vụ án (`PhanCongHDXXView.tsx:4430`)
- **[TB]** Màn/tab **Danh sách tham mưu Hội đồng xét xử** — *SRS mục 1.4* — không tồn tại
- **[TB]** Cột **Kháng nghị** trong bảng "DS các vụ án trình phê duyệt" — *SRS 2.2.B.6*
- **[TB]** **Lịch sử chỉnh sửa** phân công HĐXX — *SRS mục 8*
- **[TB]** **Bảng Căn cứ điều luật** + Cơ sở trại giam/trại tạm giam trong popup QĐ tiếp tục tạm giam — *SRS QĐ Bị cáo C.5, C.6*
- **[Thấp]** Nhóm nút tab Kết quả thiếu "Thêm mới kết quả"/"Cập nhật kết quả"/"Chỉnh sửa thông tin vụ án" + trạng thái nút theo luồng ký — *SRS mục E*
- **[Thấp]** Khối **Thông tin thống kê** ở tab Kết quả — *SRS mục G* (SRS ghi "đang phát triển")
- **[Thấp]** Biểu mẫu **"Phiếu kết quả phân công"** cho TTV — *SRS Phân công B.7* (`hasDoc: false` tại `:741`)
- **[Thấp]** Trạng thái **"Hủy Quyết Định"** ở bảng QĐ phân công — *SRS Phân công C.6*

## THỪA (hỏi Lead)
- Tab **"Tờ trình"** trong chi tiết vụ xét xử — `QuanLyVuXetXuView.tsx:436`, component `:881` — 4 file SRS Vụ xét xử không mô tả
- **4 tab danh sách dư**: "Chưa thụ lý xét xử", "Rút kháng nghị", "Đã xét xử", "Chuyển thẩm quyền" — `:6508` (SRS chỉ 3 tab)
- Cột "Nơi lưu giữ" bảng Xử lý vật chứng — `:4665`
- Option "Quyết định hoãn phiên tòa **của Chánh án**" — `:3430` (SRS chỉ có của HĐXX)
- Nút "Xuất Excel" — `:6744`
- Cột "Số & Ngày thụ lý XX", "Phân công TTV/TP", "Trạng thái", "Thao tác" trong bảng vụ án trình phê duyệt — `PhanCongHDXXView.tsx:4004`
- **Code chết:** `ContextMenu` (`:4691`), hằng `LIST_TABS` (`:429`)

## LỆCH
- **Cấp độ chọn HĐXX**: **SRS** Loại hội đồng là Toggle ở **cấp danh sách**, thành viên áp dụng chung cho N vụ + label "Áp dụng chung cho N vụ án" | **Mockup** chọn **riêng từng dòng vụ án** (`:6143`, `PhanCongHDXXView.tsx:2782`)
- **Số thành viên Hội đồng toàn thể**: **SRS** cố định **11 thẩm phán**, hiển thị xám, không thêm/bớt | **Mockup** 19 người, coi là toàn thể khi chọn ≥18 (`:108`, `:5997`)
- **Cột đầu bảng DS vụ xét xử**: **SRS** "Thông tin vụ xét xử" gồm `Kháng nghị: [Số KN – Ngày KN]`, `Người KN:`, gạch ngang, Số & ngày thụ lý XX | **Mockup** header "SỐ & NGÀY THỤ LÝ XX", Số/Ngày KN không hiển thị (`:6777`)
- **Bảng thông tin chung**: **SRS** bỏ "Mã vụ án – Tên vụ án", đổi "Số – Ngày BA/QĐ" → **"Số – Ngày BAST (hoặc QĐST)"** | **Mockup** vẫn giữ ở 4 chỗ (`:534`, `:578`, `:771`, `:4471`)
- **Cột bảng Bị cáo**: **SRS** gộp Họ tên + ngày sinh + CCCD; "Địa vị pháp lý"→**"Tư cách tố tụng"**; "Thông tin tội danh, Mức án"→**"Thông tin bổ sung hình phạt"** | **Mockup** giữ nguyên cũ, chưa có CCCD (`:645`)
- **Thao tác dòng người liên quan**: **SRS** icon Sửa + icon Biểu mẫu | **Mockup** icon Xem + Xóa (`:551`)
- **Bảng Phân công**: **SRS** gộp "Họ và tên – ngày phân công" vào 1 cột | **Mockup** tách 2 cột (`:778`)
- **Thông tin chung tab Kết quả**: **SRS** Liên quan bản án (ST/PT/GĐT), Số–Ngày thụ lý XX, **Thủ tục giải quyết**, Trạng thái, Tòa án thụ lý, VKS giải quyết | **Mockup** dùng lại InfoGrid tab Thông tin, thiếu 4 trường (`:4470`)
- **Checkbox bảng DS quyết định liên quan**: **SRS** "Xét xử lại" và **"Đổi hình phạt"** (hệ thống **tự tích**) | **Mockup** "Đối với hình phạt", tích tay (`:4602`)
- **Bộ lọc quá hạn**: **SRS** "Quá hạn luật định" 3 option | **Mockup** "Quá hạn xét xử" 2 option (`:6674`, `PhanCongHDXXView.tsx:4477`)
- **Nút reset**: **SRS** "Làm mới" | **Mockup** "Xóa bộ lọc" (`:6715`)
- **Popup chọn lịch xét xử**: **SRS** mở **lịch tháng**, bấm ô ngày trống để thêm phiên | **Mockup** form phẳng (`:5509`)
- **Nút popup Sửa DS**: **SRS** Trả lại, Ký duyệt, Xem biểu mẫu, Lưu, Đóng | **Mockup** Đóng, Lưu, Lấy số, Trình ký, Xem biểu mẫu (`PhanCongHDXXView.tsx:3060`)
- **Nút popup tạo DS tham mưu**: **SRS** "Trình duyệt" (đồng thời gửi sang màn Công tác lãnh đạo của PCA và màn DS phân công HĐXX) | **Mockup** "Trình ký" (`:6397`)

## CẦN HỎI
- Tab **"Tờ trình"** ở chi tiết vụ xét xử đến từ đâu? Giữ hay bỏ?
- SRS nói "Xem chi tiết vụ án với **8 Tab**" nhưng chỉ mô tả 7 mục. 2 tab "Tài liệu vụ án"/"Hồ sơ vụ án" chỉ được nhắc gián tiếp. Chốt danh sách tab chuẩn + thứ tự.
- Tên tab kết quả không nhất quán trong SRS: **"Xét xử GĐT, TT"** (tiêu đề) vs **"Kết quả GĐT,TT"** (use case). Mockup dùng "Kết quả xét xử". Chốt tên nào?
- **Điều kiện chuyển vụ GQĐ lên vụ xét xử ghi 2 kiểu khác nhau trong cùng 1 file SRS**: (a) "Trạng thái Đã có KQGQ và có từ 1 KQ là Kháng nghị"; (b) "Số KQGQ = (số đơn TLM + TLM trùng TP) và có từ 1 đơn là Kháng nghị". Chuẩn là cái nào?
- Quy tắc "Hội đồng 5 chỉ được chọn tối đa 4 TP tham gia cùng" (mục 1.2.1.2) **mâu thuẫn** với mục 8 ("không còn ràng buộc phải đủ đúng 5 người"). Mục 8 là bản mới nhất?
- Số TP Hội đồng toàn thể: SRS mục 8 ghi **11**, biểu mẫu QĐ mẫu liệt kê **5**, mockup dùng **19**. Nguồn danh sách lấy từ đâu?
- Tab "Chưa có danh sách xét xử" phải gồm cả vụ đã duyệt nhưng có QĐ hoãn phiên tòa/đình chỉ (BR-02) — cách thể hiện trạng thái này?
- Popup "Tạo danh sách vụ xét xử": luồng đúng có phải là tick chọn ở màn danh sách rồi bấm "Tạo danh sách" không? (mockup dùng `MODAL_ROWS` dựng sẵn, không validate BR-01)
- SRS mô tả Lịch xét xử là **màn hình độc lập** (có breadcrumb, nút Thêm lịch, filter) nhưng mockup chỉ có modal trong Phân công HĐXX và không có mục menu. Cần màn riêng trên menu không?
- Biểu mẫu **"Quyết định thay đổi thẩm phán"** được SRS đánh dấu *"pending – cần BA confirm"* nhưng mockup đã làm (`PhanCongHDXXView.tsx:3149`). Giữ hay bỏ?
- SRS "Quyết định vụ án" ghi *"Danh sách loại biểu mẫu (update sau)"*; danh sách mockup lệch (thiếu "QĐ rút kháng nghị toàn bộ", thừa "QĐ hoãn phiên tòa của Chánh án"). Cần bản chính thức.

---

# 5. QUẢN LÝ KHIẾU NẠI

## THIẾU
- **[Cao]** Popup **In báo cáo** với 4 loại danh sách (Quản lý vụ khiếu nại / DS tờ trình / Quản lý hồ sơ / Giải quyết đơn), mỗi loại một bảng tiêu chí riêng (22/17/13/13 tiêu chí) + trường "Tiêu đề BC" tự fill — *SRS mục 1 Chức năng In báo cáo* — mockup chỉ có nút "In biểu đồ" gọi `window.print()` (`QuanLyKhieuNaiView.tsx:186`)
- **[Cao]** Cột "Trạng thái" thiếu khối **Tờ trình**: `Tờ trình: Số - Ngày`, `Tên tờ trình - Ngày tạo (Link)`, `Trạng thái trình (Chưa có tờ trình/Chưa trình/Trình [LĐ gần nhất]) - Trạng thái cho ý kiến` — *SRS B mục 5*
- **[Cao]** **Thời hạn giải quyết đếm ngược** (Hình sự 7 ngày, Dân sự 15 ngày từ ngày thụ lý) — *SRS B mục 5*
- **[Cao]** **"Đơn liên quan"** khi thêm KQGQ khiếu nại (dropdown chọn nhiều đơn TLM, cú pháp `[Họ tên NĐĐ] (Số TL… Ngày TL…)`, bắt buộc) — *SRS 1.5.3 Màn 2 mục 2* — mockup chặn hẳn với khiếu nại (`ThemKetQuaModal.tsx:449`)
- **[Cao]** Trường **"Căn cứ điều luật"** (Bộ luật / Điều luật nhiều lựa chọn / Khoản / Điểm) — *SRS 1.5.3 Màn 2 mục 7*
- **[Cao]** **"Kết quả xác định thẩm quyền"** (dropdown 3 giá trị) — *mục 9*
- **[TB]** **"Trích yếu"** mặc định "V/v thông báo giải quyết đơn khiếu nại" — *mục 5*
- **[TB]** Bộ lọc thiếu: Nguyên đơn, Bị đơn (SRS tách riêng), Trạng thái thụ lý, Kết quả thụ lý, Kết quả từ–đến ngày — *SRS A mục 5, 6, 21, 22*
- **[TB]** Bộ lọc **Hồ sơ từ ngày – Đến ngày** — *A nâng cao mục 13*
- **[TB]** Đương sự trong cột "Thông tin BA/QĐ" (HS: Bị cáo; HC: Người khởi kiện/bị kiện; khác: Nguyên/Bị đơn) — *B mục 2*
- **[TB]** Thông báo tình thế `TBTT: [Số]-[Ngày]` — *B mục 1*
- **[TB]** Công văn chính của Án Quốc hội + nội dung Ý kiến chỉ đạo trên dòng danh sách — *B mục 1*
- **[TB]** Địa chỉ người đứng đơn — *B mục "Người đứng đơn"*
- **[TB]** `KQGQ: Trạng thái (Loại kết quả: Số QĐ - Ngày QĐ)` — *B mục 5*
- **[TB]** Ngày nhận hồ sơ đầu tiên kèm trạng thái hồ sơ — *B mục 5*
- **[TB]** Thao tác **"Xem kết quả giải quyết"** khi đã có KQ — *B mục 6*
- **[TB]** Nhóm kết quả **"Xếp đơn"** ở tab Giải quyết văn bản đề nghị — *SRS 1.5.3* — mockup chỉ có Chấp nhận / Không chấp nhận (`App.tsx:2215`)
- **[TB]** "Nội dung hồ sơ" (bắt buộc, chỉ Phiếu trả) + "Ghi chú" ở popup tạo phiếu — *1.4.3 A*
- **[TB]** Đổi nhãn "Ngày lập phiếu"→"Ngày nhận" với Phiếu nhận + ẩn nút Cấp số/Trình ký — *1.4.3 mục 5*
- **[Thấp]** Nút **"In danh sách"** ở tab Danh sách đơn — *1.2.4*
- **[Thấp]** Cảnh báo "Bổ sung các thông tin bắt buộc để tiếp tục thao tác"
- **[Thấp]** Cảnh báo "Các thông tin thay đổi chưa được Lưu" (2 nút Lưu/Đóng)

## THỪA (hỏi Lead)
- **Nút "Thêm mới" khiếu nại** — `QuanLyKhieuNaiView.tsx:151` — SRS quy định vụ khiếu nại **chỉ được chuyển sang từ màn Nhận đơn & thụ lý**, màn này không có chức năng tạo mới
- Cột checkbox chọn hàng loạt — `:205`, `:227`
- 2 tab thừa ở chi tiết: "Tài liệu vụ án", "Hồ sơ lưu trữ" — `QuanLyVuAnView.tsx:3351` — *SRS: "Xem chi tiết vụ án với **6 Tab**"*
- 8 trường lọc thuộc nghiệp vụ vụ án–xét xử lọt vào màn khiếu nại: Hoãn THA, Cấp xét xử, Kết quả xét xử, Ngày tuyên án, Rút kháng nghị, Ngày rút KN, Phân loại đơn, Thẩm phán — `VuAnSearchFilterPanel.tsx`
- Trường "Cán bộ" popup tạo phiếu — `QuanLyVuAnView.tsx:1758` — **SRS đã gạch bỏ**
- Trường "Người ký ban hành" popup tạo phiếu — `:1737`

## LỆCH
- **[Lỗi]** Tab **"Quá hạn giải quyết" không lọc gì**, trả về toàn bộ — `QuanLyKhieuNaiView.tsx:73` (`return group;`)
- **[Lỗi]** Tab "Đang/Đã giải quyết" lọc theo `kqGiaiQuyet` nhưng giá trị `da-co-con-don` lại render thành badge "Không chấp nhận khiếu nại" — `:63`, `:371` — trộn **trạng thái** với **loại kết quả**
- Bảng "Lịch sử phân công TTV" thiếu cột **"Người thao tác"** — `QuanLyVuAnView.tsx:2032` — *SRS 1.3.3 C.6*
- Tab Phân công vẫn giữ cột "GIAI ĐOẠN" và tách "CHỨC DANH" — *SRS: bỏ cột giai đoạn, gộp họ tên + chức danh*
- Bảng "QUÁ TRÌNH GIẢI QUYẾT" tách 3 cột, thiếu cột **Thời hiệu giải quyết (Radio)** — `TabThongTin.tsx:809` — *SRS 1.1.3 mục 12, 14*
- Bảng DS phiếu: chưa gộp "Thông tin phiếu", còn cột "Ghi chú" (SRS gạch), chưa đổi "Cán bộ"→"Người thao tác", Loại phiếu thiếu [Số thứ tự lần tạo] — `QuanLyVuAnView.tsx:1902`
- "Số bút lục" chỉ ẩn với công văn — *SRS: chỉ **hiển thị** với Phiếu trả/chuyển/nhận*
- "Tên đơn vị" textbox tự do — *SRS: combobox phụ thuộc Đơn vị giữ hồ sơ*
- Badge "Án TVTN" — *SRS: "Án Người chưa thành niên"*
- Nút "In biểu đồ" — *SRS: "In báo cáo"/"In biểu mẫu"*
- Cột "Người dùng đơn" — *SRS: "Người đứng đơn"*

## CẦN HỎI
- Mockup dùng chung `ChiTietVuAnView` cho cả vụ án và khiếu nại (`App.tsx:3330`), chỉ khác cờ `isKhieuNai`. SRS quy định 6 tab với cấu trúc bảng khác. Tách component riêng hay dùng chung + prop?
- Tab mặc định màn khiếu nại: "Tất cả" hay "Đang giải quyết"?
- SRS 1.5.3 mục 5 "Người duyệt" ghi **"Tạm ẩn"** — mockup vẫn hiện (`App.tsx:2226`). Ẩn hay giữ?
- "Trạng thái hồ sơ": SRS 3 nhóm, mockup 5 giá trị. Lấy bộ nào?

---

# 6. PHÂN CÔNG THẨM TRA VIÊN

## THIẾU
- **[Cao]** **Combobox TTV/LĐV + date picker Ngày phân công ngay trên từng dòng** — *SRS B mục 5,6,7 + mục 9* — mockup render text tĩnh (`PhanCongTTVView.tsx:936`), chỉ phân công qua 1 modal chung áp cùng TTV/LĐV cho mọi dòng đã chọn (`:1016`)
- **[Cao]** **Tự động fill Lãnh đạo theo Cấu hình TTV báo cáo** sau khi chọn TTV — *SRS BR1* — mockup random LĐV độc lập (`:355`)
- **[Cao]** Tag **"Đã có vụ giải quyết"/"Đơn chờ phê duyệt"** trên dòng — *SRS B mục 1, 2 + BR-03*
- **[Cao]** **Gợi ý lịch sử phân công** (hiện mờ TTV/LĐV của vụ giải quyết trước, click chọn được) — *SRS B mục 6, 7*
- **[Cao]** **BR-04**: đơn đã có vụ án khi phân công chỉ định **chỉ cho chọn TTV đang được phân công vào vụ đó**
- **[Cao]** Ngày phân công gợi ý = ngày đang chọn, cho sửa, không bỏ trống — *SRS B mục 5* — mockup hard-code `"26/06/2026"` (`:359`)
- **[TB]** Ô nhập **"Ngày TTV nhận tiểu hồ sơ"** + đồng bộ 2 chiều với màn Nhận đơn — *SRS B mục 4*
- **[TB]** Label **cảnh báo thời hiệu giải quyết** trên từng dòng — *SRS BR-05*
- **[TB]** Validate & thông báo khi Lưu: "Phân công TTV/LĐ thành công" / "Không có vụ việc được Phân công TTV/LĐ" / viền đỏ + "Điền đầy đủ thông tin trước khi lưu phân công" (đủ 4 trường) — *SRS Luồng (5)*
- **[TB]** Cảnh báo **"Chưa Lưu phân công"** (2 nút Lưu/Thoát) khi rời tính năng
- **[TB]** Giai đoạn **"Giải quyết khiếu nại"** cho vụ khiếu nại + để trống cột Đương sự — *SRS Phân công TTV (đầu file Quản lý khiếu nại)*
- **[TB]** Icon **"Xem đơn scan"** — *SRS B Thao tác* — mockup mở popup "Thông tin chi tiết vụ án" (`:971`)
- **[Thấp]** Đồng bộ kết quả phân công 2 chiều với tab Phân công trong chi tiết vụ án — *Luồng (4)*
- **[Thấp]** Sắp xếp mặc định theo ngày thụ lý gần → xa — *Luồng (1)*

## THỪA (hỏi Lead)
- Cột checkbox vẫn hiện ở chế độ **"Phân công ngẫu nhiên"** — `PhanCongTTVView.tsx:847` — *SRS: "Phân công ngẫu nhiên: **Không hiện checkbox**"*
- Cột Ngày phân công TTV/LĐ lặp chuỗi giai đoạn ở cả 4 ô — `:938`

## LỆCH
- Combobox **"Giai đoạn"** ở bộ lọc: **SRS** chỉ 2 giá trị (Giai đoạn giải quyết đơn / Giai đoạn xét xử GĐT,TT) | **Mockup** Sơ thẩm/Phúc thẩm/GĐT/TT (`:590`)
- Nút hành động: **SRS** "Phân công" cho phân công chỉ định/đã phân công, "Lưu phân công" ở màn chưa phân công | **Mockup** ngược lại (`:780`, `:797`)
- Combobox TTV/LĐ: **SRS** `[Họ tên - Ngày sinh / Chức danh tư pháp]` | **Mockup** chỉ họ tên (`:16`)
- Nút reset: **SRS** "Làm mới" | **Mockup** "Xóa bộ lọc" (`:757`)

## CẦN HỎI
- **Thuật toán phân công ngẫu nhiên TTV** — SRS chỉ dẫn link Google Sheets ghi "(chưa chỉnh sửa)". Mockup đang random thuần (`:354`). Cần bản chốt (theo tải? theo loại án? theo nghiệp vụ TTV?)
- "Giai đoạn phân công" là combobox người dùng chọn hay hệ thống tự xác định theo vụ? Mockup gán cứng "GĐ Xét xử GĐT, TT" sau khi phân công (`:358`)

---

# 7. PHÂN CÔNG THẨM PHÁN

## THIẾU
- **[Cao]** Màn **"Quản lý kết quả phân công"** theo lịch sử từng lần phân công (Ngày phân công / Số lượng đơn-vụ-hồ sơ / TK thực hiện / Thời gian nhận đơn / Hình thức PC / Thao tác Sửa-In-Xóa) — *SRS 1.1.1.3 Màn hình 1 mục B* — mockup chỉ lọc lại chính bảng đơn (`PhanCongThamPhanView.tsx:155`)
- **[Cao]** Popup **"Sửa kết quả phân công"** (Màn hình 2) — toàn bộ: bộ lọc 8 trường + bảng lịch sử + Ngày phân công + Thẩm phán + Ghi chú 2 trường + Lưu sửa đổi / In danh sách TP / Quay lại
- **[Cao]** Ràng buộc **bắt buộc Ghi chú khi đổi Thẩm phán** (gồm **Người yêu cầu thay đổi** + **Lý do thay đổi**), ô đổi màu hồng, cảnh báo "Bổ sung các thông tin bắt buộc trước khi Lưu sửa đổi" — *SRS mục 13/25/33* — mockup là input tự do, không bắt buộc (`:750`)
- **[Cao]** **Bộ cột riêng cho từng hình thức phân công** — *SRS mục B, D, E* — Hồ sơ kháng nghị (Số/Ngày thụ lý XX, Thông tin kháng nghị, Loại án), Hồ sơ tử hình (Số lượng bị án tử hình), Công văn trao đổi (Số CV, Ngày CV, Nơi gửi) — mockup dùng 1 bộ cột cố định (`:663`)
- **[Cao]** Option **"Hồ sơ kháng nghị GĐT, TT"** trong combobox Hình thức phân công — *SRS mục 3, Màn hình 4 mục 4*
- **[Cao]** Thao tác **Sửa / In / Xóa** kết quả phân công theo dòng + cảnh báo "Bạn có chắc chắn muốn hủy kết quả phân công?" + trả đơn về trạng thái chưa phân công — *SRS Luồng 1 (4)–(7)*
- **[TB]** Cột **"Số tờ trình (thay đổi phân công)"**, hiện "-" nếu không đổi — *SRS C.17*
- **[TB]** Trường **"Thời hiệu"** trong khối Thông tin BA/QĐ — *SRS mục 10, 16, 21*
- **[TB]** Ghi chú mặc định **"Vụ án TPB3 giải quyết có đề xuất kháng nghị"** (cho sửa) — *SRS C.20*
- **[TB]** Gợi ý mờ TP trong tờ trình đề xuất của Vụ GĐ,KT — *SRS Mockup Màn hình 3*
- **[TB]** **"Lĩnh vực xử lý chuyên môn"** trong popup Danh sách thẩm phán — *SRS Màn hình 4 mục 9*
- **[TB]** Phân quyền: **Vụ trưởng, TP được phân công chỉ xem; Phó chánh án mới thao tác** — *SRS Mockup Màn hình 2–5*
- **[TB]** **BR1**: loại TP có chức vụ Chánh án khỏi DS; TPTC loại trừ TPTC thuộc tòa Phúc thẩm
- **[TB]** **BR2**: chọn TP ở combobox chung → các đơn thuộc vụ có TP đó tự hiện tên TPB3; combobox TPB3 theo đơn chỉ hiện TPB3 thuộc vụ đó + TP không thuộc vụ nào
- **[TB]** Cảnh báo "Bạn chưa lưu thay đổi phân công" khi Quay lại/Thoát
- **[Thấp]** Thông báo "Thay đổi thẩm phán cho n đơn/vụ" + giữ popup mở sau khi lưu để in DS vừa đổi
- **[Thấp]** "Ngày phân công" của Hồ sơ tử hình mặc định ngày hiện tại, **không cho sửa** — *SRS D.23*

## THỪA (hỏi Lead)
- **Tab "DS chưa phân công ngẫu nhiên" + nút "Phân công ngẫu nhiên"** — `PhanCongThamPhanView.tsx:249`, `:599` — *SRS đã **gạch bỏ** "Màn hình 3: Danh sách đơn chưa phân công ngẫu nhiên"; Màn 2 ghi "Nguyên tắc phân công ~~ngẫu nhiên/~~chỉ định **Chỉ TPTC**"*
- Option "Đơn đề nghị GĐT, TT" trong combobox Hình thức — `:396` — SRS chỉ có 4 hình thức
- Trường "Người nhập đơn" ở bộ lọc màn chưa phân công chỉ định — `:426`

## LỆCH
- Radio "Tất cả / TP bậc 3 / TP tối cao" dùng chung cho cả tab chỉ định — **SRS** radio 3 option **chỉ ở màn Quản lý kết quả phân công**; Màn hình 4 chỉ 2 option, **không có "Tất cả"** (`:313`)
- Combobox Hình thức **không phụ thuộc bậc TP** — **SRS** TPTC được 4 option, **TPB3 chỉ có "CV trao đổi"** (`:394`)
- Combobox Thẩm phán chỉ hiện họ tên — **SRS** `[Họ tên - Ngày sinh / Chức vụ, chức danh]` (`:14`, `:738`)
- Nút "Xóa" xóa đơn khỏi danh sách — **SRS** "Xóa" là **hủy kết quả phân công**, đưa đơn về danh sách chưa phân công (`:204`)
- Breadcrumb "Quản lý đơn › Phân công thẩm phán" — SRS đặt chức năng trong menu Vụ GĐ,KT (`:238`)
- Số vụ đang giải quyết trong popup DS thẩm phán sinh **ngẫu nhiên mỗi lần render** — `:811` (`Math.random()`)

## CẦN HỎI
- SRS Màn hình 1 mục B ghi "Chọn Theo đơn (màn 1)" nhưng phần Mockup ghi "**bỏ radio Theo đơn/Theo vụ**". Bảng cuối cùng chỉ còn theo đơn?
- Popup Sửa kết quả phân công có "Số tờ trình / Ngày tờ trình / Trạng thái tờ trình" **bị gạch bỏ** nhưng bảng chỉ định (C.17) vẫn giữ "Số tờ trình (thay đổi phân công)" — còn hiển thị cột này không?
- SRS mục 3 ghi "TPTC: **Chọn 1 trong 3 option**" nhưng liệt kê 4 dòng; "TPB3: Chọn 1 trong 3 option" nhưng chỉ liệt kê 1. Chốt số option thực tế.
- Nguyên tắc phân công chỉ định/ngẫu nhiên (1.1.1.5 mục 4) chỉ có link Google Sheets — cần bản chốt.

---

# 8. CẤU HÌNH HỆ THỐNG

## THIẾU
- **[Cao]** Toàn bộ chức năng **"Danh sách Tổ/Nhóm"** — *SRS_Cấu hình thành viên tổ_nhóm* — mockup **không có màn nào**. Cần: tìm kiếm theo tên/mã tổ, lọc Loại án, nút Thêm mới, grid + Switch trạng thái, icon Sửa/Gán thành viên/Xóa; popup Sửa (Mã tổ, Tên tổ ≤255, Loại án, Loại tổ/nhóm, Trạng thái, Mô tả ≤500); popup Gán đối tượng (Tên tổ, tìm theo tên–tài khoản–email, lọc đơn vị, Gán tất cả, 2 grid Chưa gán/Đã gán, nút >/<, Đóng, Cập nhật tổ); BR01–BR03.
- **[Cao]** Màn **"Danh mục cấp trình"** — *SRS_Danh mục cấp trình mục 3* — chưa có (đã nêu ở mục 3 Tờ trình)
- **[Cao]** Cảnh báo **"Chưa Lưu cấu hình"** (2 nút Lưu/Thoát) khi rời tính năng — *SRS Luồng (5)*
- **[TB]** Nút "Lưu cấu hình" chỉ active khi có thay đổi — *Luồng (3)*
- **[TB]** **"Người thao tác"** cập nhật theo dòng thực sự thay đổi khi Lưu — *B mục 5* — mockup hard-code "Nguyễn Văn A / 11/06/2026" cho mọi dòng (`App.tsx:1351`)
- **[TB]** Preview khi bấm **"In biểu mẫu"** — *A mục 4* — nút không gắn hành động (`App.tsx:1279`)
- **[Thấp]** Nút "Tìm kiếm" chưa lọc dữ liệu — `App.tsx:1275`

## THỪA (hỏi Lead)
- Option nghiệp vụ **"Báo cáo thống kê"** — `App.tsx:1231` — *SRS chỉ có "Giải quyết án" và "Xử lý nghiệp vụ"*
- Giá trị **"GD Xét xử GĐT"** trong danh sách Lãnh đạo — `App.tsx:1236` — không phải người
- Option "- Tất cả -" trong combobox Lãnh đạo của từng dòng — `App.tsx:1346`

## LỆCH
- Cột **"Chức danh"** là select cho sửa — `App.tsx:1335` — *SRS: nguồn DB, không phải trường người dùng chỉnh sửa*
- Combobox Lãnh đạo/TTV chỉ hiện họ tên — *SRS: `[Họ tên - Ngày sinh / Chức vụ, Chức danh]`* (`App.tsx:1265`)
- Header cột "Họ và tên" — *SRS đặt tên cột là **"Thẩm tra viên"*** (`App.tsx:1317`)
- Banner "Cập nhật dữ liệu thành công!" hiện **mặc định khi mở màn** — `App.tsx:1240` (`useState(true)`)

## CẦN HỎI
- SRS B mục 1 đánh dấu Thẩm tra viên là "User tích chọn" nhưng mockup không có checkbox chọn dòng — có cần checkbox thao tác hàng loạt không?
- Màn "Danh sách Tổ/Nhóm" có tác nhân là **Quản trị hệ thống**, không phải Vụ GĐ,KT — thuộc mockup này hay module quản trị riêng?

---

# 9. HỒ SƠ KHÁNG NGHỊ

## THIẾU
- **[Cao]** Màn 2 — **Xử lý / nhập-sửa hồ sơ kháng nghị (form 6 tab)** — *SRS "Màn 2: Xử lý hồ sơ kháng nghị", Tab 1–6* — `HoSoKhangNghiView.tsx` **hoàn toàn không có**; cột Thao tác tab "đến" (`:2052`) chỉ có Nhận và Trả, không có icon Xem/sửa. `ThemHoSoScreen` chỉ là ảnh PNG tĩnh. Cần dựng 6 tab: Hình thức đơn (mặc định "Hồ sơ kháng nghị GĐT/TT"), Thủ tục giải quyết, Loại QĐ/BA, Loại án, Số/Ngày bản án, Tòa xét xử, Cấp xét xử (hiện thêm 3/6 trường khi chọn PT/GĐT), tickbox "Không có nội dung GĐT-TT"; Số/Ngày QĐKN, Người kháng nghị, Ý kiến chỉ đạo + Nội dung chỉ đạo; Người liên quan theo loại án; Quá trình bổ sung tài liệu; Quá trình chuyển đơn.
- **[Cao]** Popup **"Xác nhận chuyển hồ sơ"** — *SRS "HSKN đi > D" mục 30–35* — nút "Chuyển hồ sơ" (`:1908`→`:1509`) đổi trạng thái trực tiếp. Cần: Ngày chuyển HSKN (mặc định hôm nay, không sửa), **Số bút lục HSKN**, Đơn vị chuyển đến (TAND / VKSND / Khác), Đơn vị chi tiết (danh mục theo lựa chọn, "Khác" nhập tay), Ghi chú, switch **Đính kèm hồ sơ, tài liệu**.
- **[Cao]** Popup **"Nhận hồ sơ"** (người giao văn thư, người nhận vụ, ngày nhận) — *SRS "HSKN đến > B" mục 20* — `handleOpenNhanHoSo` (`:1742`) hard-code tên + ngày. `ModalNhanHoSoKhangNghi` (`:418`, bản trùng `App.tsx:3071`) là **code chết**, và bản thân nó cũng thiếu 3 trường trên.
- **[Cao]** Cột **"Thông tin văn thư ĐI"** ở tab HSKN đi (Mã văn thư chuyển đi, Ngày văn thư chuyển đi VKS/tòa tỉnh, Người phát hành) — *SRS "HSKN đi > C" mục 24* — mockup dùng chung header "MÃ VĂN THƯ ĐẾN" cho cả 2 tab (`:1958`)
- **[Cao]** Thao tác từng dòng tab đi: **"Chuyển hồ sơ kháng nghị"** và **"Nhận HSKN CA sau khi VKS trả về"** — *SRS mục 29* — mockup chỉ có "Xem biểu mẫu" và "Đi trình ký Lãnh đạo" (`:2047`)
- **[Cao]** Luồng **"Trả hồ sơ"** ở tab đi (popup nhập thông tin trả, cập nhật ngày trả + bút lục sang tab Thông tin vụ án của Quản lý vụ xét xử) — *SRS "HSKN đi > Luồng sự kiện chính mục 4"*
- **[TB]** Trường tìm kiếm tab đến: **"Nhận HSKN từ ngày–đến ngày"** (mục 11), **"Người nhận HSKN"** (mục 13)
- **[TB]** Trường tìm kiếm tab đi: **"Chuyển từ ngày–đến ngày"**, **"Trạng thái chuyển"** (Chưa chuyển/Đã chuyển/Đã trả), **"Người chuyển HSKN"**
- **[TB]** Trạng thái **"Đã trả"** (VKS đã trả lại) ở tab đi — *SRS mục 28* — data mockup chỉ có Chưa chuyển/Chờ chuyển/Đã chuyển (`:1354`)
- **[TB]** Thông tin phát hành ở cột trạng thái tab đi: Số văn thư trả, Ngày trả, Người nhận Vụ — *mục 28*
- **[TB]** Thông tin phát hành tab đến: Số văn thư đến, Ngày tiếp nhận; và Ngày VKS chuyển (theo bìa thư), Người chuyển (theo bìa thư) — *mục 26, 27*
- **[TB]** **Thời hiệu** (3 năm/5 năm) trong cột Thông tin BA/QĐ — *mục 26 cả 2 tab* — mockup thiếu (`:1997`)
- **[TB]** Hiển thị "Ngày trả VKS / Người trả" sau khi trả hồ sơ — *mục 21* — `handleConfirmTraHoSo` (`:1775`) chỉ set trạng thái
- **[TB]** Ràng buộc **bắt buộc scan tài liệu Hồ sơ kháng nghị** — *mục 29* — tab "đến" không có chức năng scan/đính kèm
- **[Thấp]** Nút **"In danh sách"** — *mục 22* — mockup thay bằng "Xuất Excel" (`:1941`)
- **[Thấp]** Chức năng tìm kiếm chưa hoạt động — nút Tìm kiếm và Xóa bộ lọc không có `onClick` (`SearchFilterPanel.tsx:277`, `:295`)

## THỪA (hỏi Lead)
- Nút **"Chọn hồ sơ"** + `ChonHoSoModal` — `HoSoKhangNghiView.tsx:1884`, `:1305` — mở `TaiLieuHoSoView` với `vuAnId` hard-code, `onSelect` luôn chọn `listHoSo[0]` bất kể thao tác
- Nút **"Tạo công văn"** + `ModalTaoCongVan` — `:1896`, `:190` — không có trong SRS module này
- **Màn soạn thảo Word `WordEditorView`** — `:575`, mở qua `App.tsx:3350`/`3360` — 3 loại văn bản, toolbar định dạng, auto sinh số công văn theo Vụ, hậu tố QĐKN theo loại án. Không có trong SRS.
- `ModalTrinhKy` — `:64`
- Ràng buộc "phải có công văn chuyển mới được chuyển hồ sơ" — `:1516`
- Trạng thái **"Chờ chuyển"** — `:1391` (SRS chỉ có Chưa chuyển / Đã chuyển / Đã trả)
- Dòng "Thẩm quyền xét xử" trong cột Thông tin kháng nghị — `:1994`
- Nút "Xuất Excel" (không có onClick) — `:1941`
- Lọc cứng toàn bộ danh sách theo Vụ (vu-1..vu-4) — `:1791`
- Trường tìm kiếm không có trong SRS: "Người gửi đơn", "Số CV chuyển", "Ngày CV chuyển" — `SearchFilterPanel.tsx:78`, `:83`
- **Code chết:** `ModalNhanHoSoKhangNghi` (`:418` và bản trùng `App.tsx:3071`)

## LỆCH
- Tên 2 tab: **SRS** Luồng sự kiện gọi "HSKN **Chánh án**" / "HSKN **VKS**", tiêu đề usecase là "đến"/"đi" | **Mockup** "đi"/"đến" (`:1833`) — *SRS tự mâu thuẫn*
- Bộ lọc: **SRS** 2 bộ khác nhau cho 2 tab | **Mockup** dùng chung 1 bộ (`:1861`, `SearchFilterPanel.tsx:65`)
- Popup Trả hồ sơ: **SRS** Ngày trả mặc định hôm nay **không sửa được**, chỉ gồm Ngày trả + Lý do (bắt buộc) | **Mockup** thêm ô "Cán bộ thực hiện" tự do, "Ngày thực hiện" **cho sửa**, giá trị hard-code (`:11`, `:44`)
- Nút "Nhận hồ sơ" khi chưa chọn dòng: **SRS** báo "Không có thông tin hồ sơ nhận" | **Mockup** tự tìm bản ghi "Chờ nhận" đầu tiên và nhận luôn (`:1752`)
- Nút "Chuyển hồ sơ": **SRS** "Không có thông tin hồ sơ cần chuyển" / "Không thể chuyển các hồ sơ đã chuyển" / "Hoàn thành chuyển n Hồ sơ" | **Mockup** thông báo khác, không check hồ sơ đã chuyển (`:1510`)
- Trả hồ sơ: **SRS** "Hoàn thành trả n Hồ sơ" | **Mockup** khi chưa chọn dòng nào thì fallback vào id `102` hard-code (`:1776`) thay vì báo lỗi
- Nút "Nhận hồ sơ": **SRS** nhận từ văn thư đến **và** nhận hồ sơ VKS trả về | **Mockup** chỉ 1 luồng (`:1924`)
- Điều kiện trước tab đi: **SRS** vụ có QĐKN có hiệu lực → chuyển sang tab HSKN đi | **Mockup** `listDi` là dữ liệu tĩnh, không liên kết (`:1354`)

## CẦN HỎI
- SRS ghi **"Bỏ đơn thụ lý kèm"** nhưng phần Mô tả màn hình vẫn có đầy đủ **Tab 3 – Thông tin đơn thụ lý kèm**. Màn Xử lý HSKN có 5 hay 6 tab?
- SRS ghi "Phần Xử lý đơn: chỉ để lại trường Thẩm quyền xét xử là TPB3 hay TPTC" nhưng Tab 4 vẫn liệt kê đầy đủ 6 trường. Tab 4 rút gọn đến mức nào?
- SRS "HSKN đi > Luồng sự kiện chính > mục 5. Chọn Hồ sơ kháng nghị" **để trống nội dung**. Có phải ứng với nút "Chọn hồ sơ" mockup đã dựng không?
- **Quy tắc nghiệp vụ của cả 2 usecase đều trống** (usecase đi chỉ có nhãn "BR-01:" không nội dung) — không có căn cứ đối chiếu ràng buộc.
- Toàn bộ nghiệp vụ soạn thảo/trình ký/cấp số công văn đang dựng trong màn HSKN nhưng không có trong SRS module này — yêu cầu mới, thuộc SRS khác, hay mockup vẽ dư?
- SRS mục 6 ghi "Ngày bản án/quyết định — Date picker"; mockup dùng 1 ngày đơn. Là 1 ngày hay khoảng từ–đến?

---

# 10. HỒ SƠ TỬ HÌNH (Đơn xin ân giảm + Hồ sơ tử hình)

## THIẾU
- **[Cao]** Màn **Thêm mới hồ sơ tử hình** — *SRS 2.2 + 3.2* — chưa có: khu A Thông tin tra cứu bản án (Số BA, Ngày BA, Tòa xét xử, Tìm kiếm), khu B DS bản án (chọn 1), khu C DS bị án (STT, Họ tên, Ngày sinh, Giới tính, Tội danh, Hình phạt, Thao tác) + nút **Thêm bị án** + phân trang, nút Hủy/Lưu. Thanh công cụ danh sách (`HoSoTuHinhView.tsx:2913`) chỉ có nút làm mới.
- **[Cao]** Cột **"Trạng thái giải quyết" theo BR-01** — *SRS 3.1 mục 18 + BR-01* — phải hiển thị **theo từng bị án** với 6 chỉ tiêu: Trình (7 mức), KQGQ đơn, KQGQ Chánh án, KQGQ VKS, KQGQ Chủ tịch nước, Xác minh. Mockup chỉ có 1 chip đơn trị 4 giá trị (`:91`, `:3126`)
- **[Cao]** **Bảng danh sách bản án liên quan** ở tab Thông tin hồ sơ (STT, Số & ngày BA/QĐ, Tòa xét xử, Thao tác — Số BA bấm được) — *SRS 3.3 khu B* — mockup chỉ có `HoSoInfoGrid` 2 dòng tĩnh (`:110`)
- **[Cao]** Cột **"Bị án"** trong bảng Quyết định của Chánh án — *SRS 3.7.2 mục 9* — `:2268`
- **[Cao]** Cột **"Bị án"** trong bảng Quyết định của Viện trưởng VKS — *SRS 3.7.3 mục 4* — `:1348`
- **[Cao]** Cột **"Bị án"** trong bảng Tờ trình Chủ tịch nước — *SRS 3.7.4 mục 4* — `:1557`
- **[Cao]** Trường **"Bị án"** (combobox, bắt buộc) trong popup Tạo QĐ kháng nghị của VKS — *SRS 3.7.3.1 mục 3* — `VKSQDModal` (`:1245`) chỉ có Số QĐ, Ngày QĐ, Viện trưởng VKS, Tải file
- **[Cao]** Nút **"Trình duyệt"** trong popup QĐ kháng nghị / không kháng nghị của Tòa án — *SRS 3.7.2.1 D#18, 3.7.2.2 D#18* — `:1197`
- **[TB]** Số lượng đơn theo loại tại cột "Bị án & Tội danh" (đơn xin ân giảm + kêu oan / xin ân giảm / xin thi hành án) — *SRS 3.1 mục 16* — `:3092`
- **[TB]** **Trạng thái lưu hồ sơ** (Chưa lưu / Đã lưu) tại cột Thông tin BA/QĐ — *SRS 3.1 mục 14* — `:3055`
- **[TB]** Cột **"Giai đoạn"** ở cả 2 bảng tab Phân công — *SRS 3.5 mục 9, 17* — dữ liệu có nhưng header + ô đều **bị comment out** (`:609`, `:616`, `:647`, `:654`)
- **[TB]** Trường **"Nơi nhận"** (combobox Tòa án / VKS / Khác) trong popup Tạo công văn xác minh — *SRS 3.7.5.1* — mockup chỉ có "Đơn vị nhận" textbox tự do (`:1686`)
- **[TB]** Empty state **"Không có đơn xin ân giảm"** ở tab Danh sách đơn — *SRS BR-03* — mockup luôn render 2 dòng cứng (`:2174`)
- **[TB]** **Ẩn khối dữ liệu của giai đoạn chưa phát sinh** — *SRS 4.3 bước 15* — mockup luôn render đủ 3 bảng (`:1933`)
- **[TB]** **Lịch sử bàn giao/chuyển hồ sơ tử hình** (không ghi đè lần chuyển trước) — *SRS 4.9 bước 65* — mockup chỉ là form nhập 1 lần (`:1820`)
- **[Thấp]** Icon tải xuống chỉ hiện khi đã có file + có quyền — *SRS 3.7.2 mục 16* — mockup hiện vô điều kiện (`:2283`)

## THỪA (hỏi Lead)
- **Toàn bộ tab "Đơn xin ân giảm"** (bộ lọc 10 trường + bảng 8 cột) — `HoSoTuHinhView.tsx:2681`, `Sidebar.tsx:366` — SRS Hồ sơ tử hình **không mô tả màn danh sách đơn xin ân giảm ở cấp menu**
- **Tab "Tờ trình"** (DS văn bản + Lịch sử trình ký + Trình ký/Tạo dự thảo/Tạo tờ trình/Hồ sơ tờ trình/Thu hồi) — `:671` — *SRS 2.6 và 3.6 ghi "Nội dung đặc tả: **Bỏ trống**"*
- **Tab thứ 7 "Hồ sơ tử hình"** (trình xem tài liệu theo bút lục, zoom, phân trang) — `:2323` — *SRS 3.8 ghi "**Bỏ trống**"*
- Thao tác **"Xem"** trong Bảng KQGQ đơn và Bảng kết quả xét xử — `:2058`, `:2136` — *SRS 2.3 ghi rõ "(**Bỏ thao tác xem**)"*
- Bảng **"Thông tin chung vụ án"** ở tab Danh sách đơn và tab Phân công — `:2155`, `:577` — *SRS 2.4 và 2.5 ghi "(**Bỏ bảng Thông tin chung vụ án**)"*
- Cột "CẤP XÉT XỬ" trong Bảng kết quả xét xử — `:2087`
- Cột "TRẠNG THÁI" trong bảng QĐ của Viện trưởng VKS — `:1348`
- Nút "Tạo QĐ không kháng nghị của VKS" dùng chung form với QĐ kháng nghị — `:1319` (SRS chưa đặc tả popup này)
- **Code chết:** hằng `DON_AN_GIAM_LIST` 11 trường — `:15`

## LỆCH
- **[Lỗi]** Bảng DS bị án: **SRS** hiển thị **toàn bộ** bị án, bị án tử hình lên đầu | **Mockup** `.filter(r => r.tuHinh)` **lọc bỏ hẳn** bị án không tử hình (`:1950`)
- Popup **"Quyết định không kháng nghị"** của Tòa án: **SRS** là form **riêng** (không có "Thẩm quyền xét xử", không có combobox "Quyết định", trường 7 là "Nội dung vụ án", người ký = **Thẩm phán giải quyết**) | **Mockup** gọi lại đúng `QDModal` của QĐ kháng nghị, chỉ đổi tiêu đề (`:1240`)
- Trường "Xét thấy": **SRS** nhãn "Xét thấy" | **Mockup** nhãn **"Xem thứ tự"** (`:1182`) — sai nhãn
- Trường "Bị án" popup QĐ kháng nghị: **SRS** combobox **chọn nhiều** | **Mockup** select đơn, 1 option (`:1170`)
- Nút cấp số: **SRS** "Lập số" (3.7.2.1) / "Lấy số" (3.7.2.2) | **Mockup** "Lấy số / Hủy lấy số" (`:1217`) — thêm trạng thái không có trong SRS
- **Bảng "Nơi nhận"**: **SRS** cột Nơi nhận = TAND / VKS / **Khác**; cột chi tiết **phụ thuộc** lựa chọn (TAND → Tòa đăng nhập, Tòa xét xử BA bị GĐT, Đ/c Chánh án, Đ/c PCA phụ trách, Khác>nhập; VKS → VKS ngang cấp…) | **Mockup** cột Nơi nhận = VKS / Tòa án / **Bộ Tư pháp**, cột chi tiết là select cố định 2 giá trị, không phụ thuộc (`:1037`)
- "Viện trưởng VKS": **SRS** **Textbox** nhập tên người, bắt buộc | **Mockup** select chọn **đơn vị** (`:1267`)
- "Kết luận của Chủ tịch nước": **SRS** Ân giảm / **Không xét ân giảm** | **Mockup** Ân giảm / **Bác đơn** / **Chưa có kết luận** (`:1512`)
- "Người ký" popup CV xác minh: **SRS** danh sách **Vụ trưởng + Vụ phó** | **Mockup** input tự do (`:1667`)
- "Đơn vị nhận" popup CV xác minh: **SRS** danh mục theo Nơi nhận | **Mockup** input tự do (`:1688`)
- "Tải file đính kèm": **SRS** File area | **Mockup** hiển thị cứng tên file, **không có control upload** (`:1712`)
- Cột "Thông tin đơn" bảng KQGQ đơn: **SRS** Mã đơn, Ngày ghi trên đơn, Loại đơn (3 loại), Người đứng đơn; "Bị án" là cột **riêng** | **Mockup** gộp cột, dùng "Số đơn", loại đơn không khớp danh mục (`:2002`). **Header 6 mục nhưng `<colgroup>` 7 cột → lệch cột**
- Cột "Kết quả xét xử": **SRS** tách 2 mục (KQ xét xử GĐT,TT và hình phạt cuối cùng) | **Mockup** gộp 1 cột (`:2087`)
- Badge tiến trình cột "Thông tin BA/QĐ": **SRS** cột này để **trạng thái lưu hồ sơ**; "Tình trạng giải quyết GĐT,TT" là **giá trị bộ lọc** | **Mockup** gắn nhãn tiến trình vào cột này (`:3063`)
- Bảng Lịch sử phân công TP: STT chạy ngược 3,2,1 (`:558`); header 6 mục / `<colgroup>` 7 cột (`:601`), bảng TTV 7 mục / 8 cột (`:637`) → **lệch cột**
- **[Lỗi]** Điều hướng chi tiết: **mọi dòng đều gọi `setDetail("hs-1")`** (`:3043`, `:3130`, `:2967`); tiêu đề chi tiết hard-code "ĐẶNG THÌN DƯƠNG" trong khi bị án của `hs-1` là "Chu Văn An" (`:1913`)
- Tên tab 7: **SRS** "Hồ sơ" | **Mockup** "Hồ sơ tử hình" (trùng tên menu cha). Breadcrumb màn danh sách "Quản lý hồ sơ tử hình" vs màn chi tiết "Quản lý án tử hình" — không thống nhất

## CẦN HỎI
- SRS 2.6/3.6 (tab Tờ trình) và 3.8 (tab Hồ sơ) ghi **"Nội dung đặc tả: Bỏ trống"** nhưng mockup đã dựng đầy đủ. Mockup là chốt và SRS bổ sung sau, hay mockup vượt phạm vi?
- Tab **"Đơn xin ân giảm"** không xuất hiện trong SRS Hồ sơ tử hình, cũng không có trong SRS Nhận đơn & thụ lý. Thuộc tài liệu nào?
- SRS gọi nút là **"Lập số"** (3.7.2.1) và **"Lấy số"** (3.7.2.2) cho cùng chức năng — thống nhất tên nào?
- Cần bổ sung đặc tả popup **"Quyết định không kháng nghị của VKS"** (hoặc xác nhận dùng chung form).
- SRS 3.7.5.2 "Kết quả Thi hành án" ghi "Lấy thông tin bên THA" — có cho sửa tại màn này không?
- SRS 3.7.5.3 "Tình trạng hồ sơ — Combobox — Danh mục tình trạng" **không liệt kê giá trị**; mockup tự đặt "Đang lưu trữ / Đã chuyển". Cần danh mục chính thức.
- BR-02 (đầu vào hồ sơ, kiểm trùng theo Số BA + Ngày BA + Tòa xét xử) không thể hiện trên UI — logic backend thuần hay cần cảnh báo trùng ở màn Thêm mới?

---

# 11. CÔNG VĂN TRAO ĐỔI

## THIẾU
- **[Cao]** Khối **tra cứu bản án** trong popup Tạo công văn (Số BA/QĐ, Ngày BA/QĐ, Tòa xét xử + icon Tìm kiếm, thông báo "Đã tìm thấy/Không tìm thấy thông tin bản án") — *SRS 3.2 mục 8–11* — popup không có (`CongVanTraoDoiView.tsx:594`), trong khi bảng danh sách **lại có cột "THÔNG TIN BA/QĐ"** (`:2384`) → dữ liệu không có đường nhập
- **[Cao]** Nút **Trình duyệt** ở cả popup Tạo công văn và popup Thêm kết quả giải quyết — *SRS 3.2 mục 30, 3.8 mục 12* — toàn file không có chuỗi "Trình duyệt"
- **[Cao]** Nút **Lấy số / Hủy cấp số** trong popup "Thêm kết quả giải quyết công văn" — *SRS 3.8 mục 11* — `:1758`
- **[Cao]** **Danh sách kết quả tìm kiếm + cơ chế chọn công văn được trả lời** trong khối "Trả lời cho công văn" — *SRS 3.2 mục 19 + Luồng 4.4 bước 3–5* — mockup chỉ có ô nhập + nút Tìm kiếm, không có bảng kết quả, không lưu liên kết (`:660`)
- **[Cao]** **Phân công Thẩm tra viên + Ngày phân công TTV** tại tab "Thông tin công văn" — *SRS 3.4 khu A + Luồng 4.6 bước 2* — mockup chỉ có Số/Ngày thụ lý (`:1979`)
- **[TB]** Cột **Giai đoạn** trong 2 bảng lịch sử phân công — *SRS 3.5 A, B* — `:2058`, `:2107`
- **[TB]** Nút **Trình lại** trong bảng "Danh sách văn bản" tab Tờ trình — *SRS 3.6 mục 5* — `:1158`
- **[TB]** Đính kèm tệp cho **công văn đi** — *SRS Luồng 4.2 bước 6* — mockup chỉ hiện khối đính kèm khi là công văn đến (`:701`)
- **[TB]** Nút **+ Thêm / Sửa / Xóa nơi nhận** cho popup Thêm KQGQ + ràng buộc "Nơi nhận chi tiết" theo danh mục — *SRS 3.2 mục 21*
- **[Thấp]** Giới hạn **2.000 ký tự** cho Nội dung công văn và Ghi chú — *SRS 3.2 mục 13, 14* — `:648`

## THỪA (hỏi Lead)
- Cột **"Số bản"** trong bảng cấu hình nơi nhận công văn đi — `:741` — SRS chỉ có 3 cột (Nơi nhận, Nơi nhận chi tiết, Ghi chú)
- Option **"Cơ quan Công an"**, **"Bộ Tư Pháp"** trong combobox phân loại nơi nhận — `:757` — SRS chỉ có TAND, VKS, Khác
- Cột **"THÔNG TIN BA/QĐ"** trong bảng danh sách — `:2384` — SRS liệt kê 9 cột, không có cột này

## LỆCH
- Popup Tạo công văn mặc định **"Công văn đến"** (`:530`) — **SRS** mặc định **"Công văn đi"** (Luồng 4.2 bước 2)
- Nút Lấy số/Trình ký/Xem biểu mẫu hiện theo `isSaved` chứ không theo **loại công văn** → vẫn hiện với công văn đến (`:842`) — **SRS** phải ẩn với công văn đến
- Điều kiện hiện icon **Xóa** dùng `!r.coKQGG` (`:2446`) — **SRS** điều kiện là **CV đi đã trình ký thì không được xóa**
- Cột "Trích yếu / Kính gửi" thay cho cột **"Ghi chú"** trong bảng nơi nhận — `:741`, `:773`
- **Nơi nhận chi tiết** là textbox tự do (`:765`) — **SRS** combobox: Tòa đăng nhập / Tòa xét xử BA bị GĐT / Đ/c Chánh án / Đ/c PCA phụ trách / Khác>nhập
- Popup "Xem chi tiết" từ tab Thông tin công văn là **chỉ đọc** (`:894`) — **SRS 3.3 mục 4** ghi "Mở popup **Chỉnh sửa** công văn"
- Thẩm tra viên / Thẩm phán / Lãnh đạo / Đơn vị nhận / Đơn vị gửi ở vùng tìm kiếm là **textbox tự do** (`:2274`…) — **SRS** yêu cầu **Autocomplete** từ danh sách người dùng/danh mục đơn vị
- Icon trong "Lịch sử trình ký" đặt `title="Trình ký"` (`:1250`) — **SRS 3.6 mục 8** gọi là **"Trình tiếp"** (kế thừa văn bản + hồ sơ tờ trình)
- Trường **Người ký** popup Tạo công văn là textbox tự do cho cả 2 loại (`:606`) — **SRS** phân biệt: CV đi = Autocomplete theo chức vụ (Vụ trưởng → Phó VT → TPTC → TPB3, cú pháp `[Họ tên]_[Chức vụ/Chức danh]`); CV đến = nhập tay
- Cột ĐƠN VỊ GỬI / ĐƠN VỊ NHẬN hard-code "Tòa án nhân dân tối cao" cho phía đối ứng (`:2419`), và không xử lý "nhiều nơi nhận → hiện đơn vị đầu tiên + số còn lại/tooltip" — *SRS mục 27*

## CẦN HỎI
- **⚠ Hai bản SRS Công văn trao đổi mâu thuẫn nhau.** File `8. Án Quốc Hội & Án thời hiệu.docx` chứa **một đặc tả "Công văn trao đổi" khác hẳn** file `7. Công văn trao đổi.docx`: bộ lọc khác (Tòa gửi CV / Số thụ lý / Ngày thụ lý / Tờ trình lãnh đạo / KQGQ / Thời gian giải quyết / Nội dung), có thanh thống kê Tổng/Chưa giải quyết/Đã giải quyết, trạng thái hiển thị khác, thao tác Sửa/Xóa/Thêm tờ trình ngay trên dòng. Mockup bám theo file 7. **Bản nào là bản chốt?** (bản trong file 8 có vẻ là bản cũ của HCTP — tác nhân ghi "Cán bộ phòng HCTP")
- SRS 3.2 mục 6: "Số CV — Hệ thống cấp" nhưng lại cho để trống trước khi lấy số; mockup để user nhập. Số CV đi do user nhập hay hoàn toàn do luồng Lấy số?
- SRS mục F "Đính kèm tệp — Hỗ trợ PDF, DOCX, `" **bị cắt câu**. Cần danh sách định dạng + dung lượng tối đa.
- BR-01: "Công văn đến là phản hồi → Tự động cập nhật vào tab Kết quả giải quyết của công văn trước". Tạo bản ghi KQGQ **tự động** hay người dùng tự thêm?
- SRS 3.8 mục 5 ghi nút **Đóng** "Validate và **lưu** kết quả giải quyết" — trùng mô tả với nút Lưu. Nút Đóng có lưu không?

---

# 12. ÁN QUỐC HỘI & ÁN THỜI HIỆU

## THIẾU
- **[Cao]** **Toàn bộ giá trị của mọi combobox** — mọi `<FormSelect>` trong `AnBaoCaoViews.tsx` gọi **không truyền prop `options`** (toàn file không có chuỗi `options=`), nên dropdown chỉ có "Vui lòng chọn". Cần bổ sung:
  - **Loại công văn** (Án QH): 8 giá trị — Công văn chuyển, CV đề nghị, CV kiến nghị, CV nhắc lại, CV 9.3, Các vụ việc khác thuộc 8.1 không thuộc 9.3, Vụ việc có giám sát Quốc hội, Các loại khác
  - **Kết quả thụ lý** (Án QH): --Tất cả--, Chưa có kết quả, Đã có kết quả (Trả lời đơn / Kháng nghị / Xếp đơn)
  - **Thời hạn giải quyết** (Án thời hiệu): --Tất cả--, <1, <2, <3, <4, <5, <6, <9, <12 tháng
  - **Tình trạng giải quyết** (Án thời hiệu): --Tất cả--, Chưa có kết quả (Chưa/Đã phân công TTV), Đã có kết quả (Trả lời đơn / Kháng nghị / Xếp đơn / VKS đang nghiên cứu / Giải quyết khác)
  - **Loại án** (8 loại theo quyền của vụ), **TTV / Lãnh đạo phụ trách** (theo vụ), **Thẩm phán** (theo tòa)
- **[TB]** **Logic sinh tiêu đề báo cáo động** — *SRS Luồng (2)* — ghép theo tiêu chí: `Danh sách vụ án Quốc hội (là loại án) (do tên thẩm phán) (,tên lãnh đạo) (phụ trách) (Kết quả thụ lý)`; Án thời hiệu thêm `(có thời hiệu dưới x tháng)`. Mockup là ô nhập tay (`:450`, `:730`)
- **[TB]** Ràng buộc **"Tính đến ngày"** theo trường Đến ngày — *SRS Án thời hiệu Luồng (2)* — mockup hard-code `(Tính đến ngày 09/08/2026)` (`:801`)
- **[TB]** Logic cột **Tình trạng giải quyết** theo thứ tự ưu tiên — *SRS Án QH B7* — Chưa có KQ: ưu tiên 1 "Trình + [Cấp trình]", ưu tiên 2 "Đã/Chưa phân công TTV"; Đã có KQ: "KQGQ + Số + Ngày" hoặc "Thụ lý xét xử GĐT,TT + Ngày TL + Số QĐXX + Ngày QĐXX"
- **[Thấp]** Nút **Tìm kiếm** riêng — *SRS Luồng (1)* — mockup chỉ có "Xem Báo cáo" và "Xóa bộ lọc"
- **[Thấp]** Tên tòa án / tên Vụ lấy theo tài khoản đăng nhập — mockup hard-code "TÒA ÁN NHÂN DÂN TỐI CAO / VỤ GIÁM ĐỐC KIỂM TRA VỀ HÌNH SỰ" (`:512`)

## THỪA (hỏi Lead)
- Ô **"Tiêu đề báo cáo"** cho nhập tự do — `:450`, `:730` — SRS quy định tiêu đề **sinh tự động** theo tiêu chí
- Chức năng **"Chỉnh sửa như Word"** (contentEditable + `document.execCommand`) và **"Thêm dòng"/"Lưu văn bản"** — `:119`, `:212`, `:225` — SRS chỉ yêu cầu **xem trước và in**, không có chỉnh sửa tại chỗ

## LỆCH
- Tiêu đề cột "Bị đơn/Người được khiếu nại" (`:536`, `:814`): **SRS Án QH** ghi "Bị đơn", **SRS Án thời hiệu** ghi "Bị đơn/Bị cáo"
- Án thời hiệu hiển thị **"Tổng: 449 vụ án" hard-code** (`:802`) trong khi bảng chỉ có 11 dòng — Án QH làm đúng (`{rows.length}`)
- Án QH: **SRS** 1 tiêu chí "Giải quyết từ ngày - đến ngày" | **Mockup** tách 2 ô rời (`:451`)

## CẦN HỎI
- **Cách tính thời hiệu**: SRS ghi "*Nếu đơn về bản án chọn loại án hình sự và 1 loại khác: thời hiệu theo hình sự **(hỏi trực tiếp)***" — chính SRS đánh dấu chưa chốt.
- Danh sách **Kết quả thụ lý** (Án QH) khác **Tình trạng giải quyết** (Án thời hiệu). Dùng chung danh mục hay 2 danh mục riêng?
- SRS Án QH mục A6 "Loại công văn": mục 5 "Công văn 9.3 - …" và mục 6 "Các vụ việc khác thuộc 8.1 không thuộc 9.3 - …" **đều bỏ lửng dấu "…"**. Cần danh mục đầy đủ.
- SRS Án QH B8 "Tên cơ quan" nhưng dữ liệu mô tả là **tên Đại biểu Quốc hội** — nhãn cột đúng là gì?
- Mô tả use case Án thời hiệu ghi "in báo cáo danh sách vụ án **Quốc hội**" — có vẻ lỗi copy. Xác nhận.

---

# 13. DANH SÁCH VỤ ÁN PHÂN CÔNG TPTC

## THIẾU
- **[Cao]** **Popup biểu mẫu Tờ trình phân công TPTC gần như trống** — *SRS mục C (14 mục)* — mockup (`PhanCongTPTCView.tsx:818`) chỉ có 4 trường (Số tờ trình, Ngày tờ trình, Người trình ký, Nội dung tờ trình). Cần bổ sung: bảng **Thông tin chung**; **Ngày/Số quyết định** theo logic cấp số tự động (hậu tố `TB-TA`); **Người ký ban hành** (mặc định Vụ trưởng Vụ đăng nhập, `[Họ tên] - [Ngày sinh]` + Chức vụ/Chức danh); **Kính gửi** (mặc định DS Phó Chánh án tòa đăng nhập); **Ngày trình / Cấp trình / Người đã trình tờ trình** (mặc định lấy từ tờ trình gần nhất, cho sửa); **Thẩm phán tối cao đề xuất**; **Nội dung ý kiến tờ trình** mặc định "…nhận thấy có căn cứ kháng nghị"; **Căn cứ quyết định** (mặc định QĐ số 75/QĐ-CA ngày 06/4/2026, Điều 15); **bảng Nơi nhận** 3 cột + thao tác, 2 dòng mặc định (`Khác – Như kính gửi`, `Khác – Lưu: Vụ GĐKT1`) + logic sinh biểu mẫu
- **[Cao]** Nút **Lấy số / Hủy lấy số** — *SRS Luồng (3)* — không tồn tại; Số tờ trình đang hard-code `"35/TT-TA"` (`:249`)
- **[Cao]** Nút **In danh sách** — *SRS B11* — chỉ có "In tờ trình" trong modal (`:993`)
- **[Cao]** **Thời hiệu + cảnh báo thời hiệu** (đếm ngược khi còn <30 ngày) trong cột Thông tin bản án — *SRS B2* — `:715`
- **[TB]** **Logo/nhãn phân loại đặc biệt** (Án Quốc hội, án chỉ đạo, án tử hình, án vị thành niên) — *SRS B2*
- **[TB]** Link **"Xem tờ trình giải quyết"** trong cột Phân công — *SRS B4* — `:738`
- **[TB]** Quy tắc "khi chưa phân công chỉ hiện tên chức danh (TTV, LĐV, TP)" — *SRS B4*
- **[TB]** **Ngày ký** trong cột Thông tin tờ trình đề xuất — *SRS B5* — `:749`
- **[TB]** Phân biệt chế độ mở tờ trình theo trạng thái (chưa trình/bị trả lại → Word sửa được; đang trình/đã duyệt → PDF) — *SRS B6* — mockup chỉ 1 modal xem tĩnh (`:940`)
- **[TB]** Trường tìm kiếm **Người khiếu nại** và **Bị cáo** cho án hình sự (nhãn đổi theo Loại án) — *SRS A5, A6* — mockup nhãn cố định (`:475`, `:484`)
- **[Thấp]** Tự động fill Ngày BA/QĐ và Tòa ra BA/QĐ khi nhập Số BA/QĐ — *SRS A2, A3*
- **[Thấp]** Thứ tự sắp xếp mặc định theo ngày lãnh đạo cho ý kiến / ngày tạo tờ trình (gần → xa), phụ là ngày thụ lý — *SRS Luồng (1)*

## THỪA (hỏi Lead)
- Nhãn **"Cấp xét xử: Sơ thẩm"** trong cột Thông tin bản án — `:721`
- Ô **"Nội dung tờ trình"** tự do với mặc định "Kính trình Phó Chánh án TAND tối cao xem xét phân công Thẩm phán Tối cao…" — `:880`, `:252` — *SRS C9 quy định là "Nội dung ý kiến tờ trình" mặc định "…nhận thấy có căn cứ kháng nghị"*

## LỆCH
- Tiêu đề cột **"Thông tin bản án/quyết định và QHPL"** (`:662`) nhưng dữ liệu render **không có QHPL** (`:715`) — bỏ "và QHPL" hoặc bổ sung dữ liệu
- Tiêu đề cột **"Đương sự & Người đề nghị"** (`:663`) — **SRS B3** ghi **"Đương sự & Người đứng đơn"**; nội dung thiếu Bị cáo (HS) / Bị đơn (DS)
- Cột thao tác chỉ có **1 icon** (`:785`) — **SRS B6** tách 2 hành vi: **Xem** (popup, cho sửa khi chưa trình/bị trả lại) và **Xem tờ trình** (Word/PDF theo trạng thái)
- **SRS B7**: "Thêm tờ trình: **Click từ 1 đơn**" | **Mockup** checkbox chọn **nhiều** vụ án rồi tạo tờ trình hàng loạt (`:280`) — mô hình thao tác khác nhau
- Trường **Thẩm phán bậc 3** ở bộ lọc dùng danh sách cứng 5 tên (`:16`) — **SRS A4**: "có thể có TPB3 không thuộc vụ, hiện tại không cần ràng buộc"
- Modal "Thêm tờ trình" gọi trường **"Người trình ký"** với lựa chọn PCA/Thẩm phán/Vụ trưởng lẫn lộn (`:869`) — **SRS C3-C4** tách rõ **Người ký ban hành** (Vụ trưởng) và **Kính gửi** (Phó Chánh án)

## CẦN HỎI
- **Mâu thuẫn trong chính SRS về "Hình thức phân công"**: phần Mockup ghi "thêm tìm kiếm Hình thức phân công (TPB3 - Kháng nghị / TPB3 - Giải quyết khác)" nhưng mục A8 của bảng mô tả **bị gạch ngang (bỏ)**. Mockup không có trường này. Giữ hay bỏ?
- Mục B8 (Số — hệ thống tự gen, 1 công văn gồm nhiều vụ án) và B9 (Ngày chuyển dự kiến) cũng **bị gạch ngang**. Bỏ 2 mục này có đồng nghĩa **bỏ luôn mô hình "1 tờ trình cho nhiều vụ án"** không? Nếu bỏ thì thao tác chọn nhiều checkbox của mockup (`:646`) là sai hướng.
- SRS C6, C7, C8 khai báo **Loại Control = "Datepicker"** cho "Cấp trình tờ trình", "Người đã trình tờ trình", "Thẩm phán tối cao đề xuất" — rõ ràng là lỗi tài liệu (phải là Dropdown). Xác nhận.
- Điều kiện trước của use case (2 nhánh về ý kiến TPB3 và ý kiến lãnh đạo vụ) **trỏ tới một Google Sheet ngoài**. Cần bản chốt điều kiện lọc danh sách.
- SRS C10 "Căn cứ quyết định" mặc định "Quyết định số 75/QĐ-CA ngày 06/4/2026" — cấu hình được hay hard-code?
- Tab thứ 2: mockup "DS đã tạo tờ trình" vs SRS "Danh sách đã có tờ trình" — thống nhất nhãn.

---

# 14. IN BÁO CÁO (toàn hệ thống)

## THIẾU
- **[Cao]** **Popup "In báo cáo"** với combobox **"Loại danh sách"** để hiện đúng bộ tiêu chí — *SRS A.1* — mockup không có popup tiêu chí nào
- **[Cao]** Trường **"Tiêu đề BC" tự sinh** theo tiêu chí đã chọn (6 mẫu tiêu đề) — *SRS A.2 + Luồng (3)*
- **[Cao]** Bộ tiêu chí **"MÀN HÌNH IN – QUẢN LÝ VỤ ÁN"** (25 trường) — *SRS mục A* — Tòa ra BA/QĐ, Số BA/QĐ, Ngày BA/QĐ, Loại án, Thuộc án, Nguyên đơn/bị đơn, Ngày tạo từ–đến, Số thụ lý, TTV, Lãnh đạo phụ trách, Thẩm phán, Thông báo KQGQ, Loại công văn, Trạng thái hồ sơ, Tờ trình lãnh đạo, Ý kiến LĐ tờ trình, Yêu cầu trình tiếp, Số đơn TLM, Trạng thái thụ lý, Kết quả thụ lý, Loại BA GĐT, Án thời hiệu
- **[Cao]** Bộ tiêu chí **"MÀN HÌNH IN – QUẢN LÝ TỜ TRÌNH"** (19 trường) + 2 loại in ("IN DS tờ trình" / "In BC tờ trình" — DS tờ trình duyệt kháng nghị) + trường "Từ ngày – đến ngày (Ngày trình lãnh đạo)" — *SRS mục B*
- **[Cao]** Bộ tiêu chí **"MÀN HÌNH IN – Giải quyết đơn"** (15 trường) + 3 loại in ("IN DS vụ án" / "In DS án thời hiệu 3 năm" / "In DS án thời hiệu 5 năm") + trường "Loại ngày" — *SRS mục C*
- **[Cao]** Bộ tiêu chí **"MÀN HÌNH IN – Quản lý hồ sơ"** (14 trường, có Số phiếu, Loại phiếu/công văn, Trạng thái hồ sơ 4 mức) — *SRS mục F*
- **[Cao]** **Preview báo cáo** sau khi chọn tiêu chí + tải về dạng Docs hoặc in — *SRS Luồng (2)*
- **[TB]** Sắp xếp DS in (vụ GQĐ có thao tác mới gần→xa; phụ: đơn có ngày thụ lý đơn chính gần→xa) — *SRS Điều kiện sau*
- **[TB]** Quy tắc in DS tờ trình / BC tờ trình — *SRS QTNV 1.b* — DS tờ trình chỉ in tờ trình ở vòng trình gần nhất; BC tờ trình chỉ in bản ghi kháng nghị đã duyệt gần nhất
- **[TB]** Quy tắc riêng màn in Giải quyết đơn — *SRS QTNV 1.c*
- **[TB]** Search text/number **không dấu, không cần đủ họ tên** — *SRS QTNV 1*
- **[TB]** Công thức thời hiệu để lọc tiêu chí "Án thời hiệu" — *SRS QTNV 2* — HS ≤ 1 năm; loại khác 5 năm (có đơn GĐT,TT trước đó trong 3 năm) hoặc 3 năm
- **[Thấp]** Option "Tất cả" cho combobox Tòa ra BA/QĐ ở mọi màn in

## THỪA (hỏi Lead)
- Nút **"In biểu đồ"** — `QuanLyVuAnView.tsx:905`, `QuanLyKhieuNaiView.tsx:186` — SRS chỉ có "In báo cáo", và mockup không có biểu đồ nào để in
- Nút **"Xuất Excel"** — `HoSoKhangNghiView.tsx:1941`, `QuanLyVuXetXuView.tsx:6745` — SRS chỉ quy định "tải về dạng Docs hoặc in luôn"
- Nút "In biểu mẫu" — `App.tsx:1280` (màn Cấu hình TTV báo cáo)

## LỆCH
- "In báo cáo" ở màn Nhận đơn mở thẳng `WordEditorView` (`NhanDonTLVuAnView.tsx:367`, `App.tsx:3388`), **bỏ qua bước popup chọn loại + tiêu chí**
- `PhanCongTTVView.tsx:801`, `PhanCongThamPhanView.tsx:617`, `QuanLyKhieuNaiView.tsx:170` đều gọi **`window.print()` in nguyên trang trình duyệt**, không sinh báo cáo theo tiêu chí, không preview/tải Docs
- `QuanLyVuAnView.tsx:905` nút "In biểu đồ" **không gắn onClick** (nút chết)
- `QuanLyVuAnView.tsx:1887` "In danh sách" (tab Mượn/trả hồ sơ) **không gắn onClick**
- `QuanLyVuAnView.tsx:1936` icon "In" trên từng dòng phiếu **không gắn onClick**, và SRS không định nghĩa in theo từng phiếu lẻ
- `AnBaoCaoViews.tsx:450`, `:730` "Tiêu đề báo cáo" là ô nhập tay — SRS A.2 quy định tự fill
- `AnBaoCaoViews.tsx:449` bộ lọc báo cáo chỉ có 10 trường, **không khớp bất kỳ bộ tiêu chí A/B/C/F nào** của SRS In BC

## CẦN HỎI
- SRS ghi "Màn hình 3,4,5,6,7,8: Popup in báo cáo" nhưng chỉ định nghĩa **4 nhóm tiêu chí A, B, C, F** — **thiếu hẳn mục D và E**. Hai màn in còn lại là màn nào?
- Bảng tiêu chí mục A **nhảy số: dòng 22 → 24 (thiếu dòng 23)**. Ở màn Quản lý vụ án dòng 23 là "Quá hạn luật định" — tiêu chí này có nằm trong popup in không?
- Tác nhân use case In BC ghi "**VT-HCTP**, Thẩm phán" trong khi use case mô tả là click In báo cáo tại màn Quản lý vụ án **trong phần GĐ,KT**. Cán bộ Vụ GĐ,KT có quyền in không, bộ tiêu chí có khác giữa 2 phân hệ?
- Trường "Loại công văn" ghi nguồn là "danh mục list công văn … **VP HCTP**" — Vụ GĐ,KT lấy danh mục nào?
- Phân biệt "Kết quả thụ lý" (mục A dòng 22) và "Kết quả giải quyết" (mục C dòng 12) — 2 combobox riêng hay 1?
- Mục A dòng 22 vẫn còn option "Giải quyết khác" trong khi mục tương ứng ở màn Quản lý vụ án **đã gạch bỏ**. Dùng bản nào?
- Các nút "Xuất Excel" đang có trong mockup có phải yêu cầu mới không?
- Nút "In biểu đồ" là yêu cầu mới hay nhầm nhãn của "In báo cáo"?
- In báo cáo cho **Quản lý vụ xét xử** và **Quản lý khiếu nại** nằm ở 2 file SRS khác — đã đối chiếu riêng ở mục 4 và mục 5.

---

# 15. DASHBOARD VỤ GĐ,KT — **CHƯA CÓ GÌ TRONG MOCKUP**

Đã xác minh: `Sidebar.tsx` khai báo `type View` gồm 21 view (`:5-22`) — **không có view dashboard**; nút "Trang chủ" (`:216`) **không gắn onClick**; không có thư viện biểu đồ; không có màn thống kê nào. **Toàn bộ SRS Dashboard phải bổ sung mới.**

## THIẾU (toàn bộ)
- **[Cao]** Màn Dashboard + điểm vào từ menu; tiêu đề động "Vụ [Đăng nhập]: Đang giải quyết (…)"
- **[Cao]** Bộ lọc **Thời gian** toàn dashboard: Tùy chọn / Hôm nay / Tuần (±7 ngày) / **Tháng (mặc định)** / Quý / Năm
- **[Cao]** Ô thống kê **"Tổng đơn chưa thuộc vụ án"** — *SRS A dòng 2*
- **[Cao]** Ô thống kê **"Tổng vụ án đang giải quyết"** — *A dòng 3*
- **[Cao]** Ô thống kê **"Án Quốc Hội đang giải quyết"** — *A dòng 4*
- **[Cao]** Ô thống kê **"Án thời hiệu <3 tháng đang giải quyết"** — *A dòng 5*
- **[Cao]** Biểu đồ **"Trạng thái thụ lý giải quyết đơn"** (Đã giải quyết / Đã có tờ trình / Chưa có tờ trình / Chưa phân công TTV / Tổng vụ án / Tổng vụ GQĐ), tách 3 nhóm — *A dòng 6–7*
- **[Cao]** Biểu đồ **"Trạng thái thụ lý xét xử"** (Quá hạn chưa XX / Chưa XX / Rút kháng nghị / Chuyển thẩm quyền XX / Đã XX / Tổng), tách 3 nhóm, kèm công thức thời hạn (HS 1 tháng, DS-GĐT 4 tháng, DS-TT 2 tháng kể từ ngày nhận QĐ KN) — *A dòng 8–11*
- **[Cao]** Bảng **"Thông tin quá trình vụ giải quyết đơn theo loại án"** — *B dòng 1–5* — nhóm Phân công TTV, Hồ sơ, Quá trình giải quyết (10 cột: Chưa có tờ trình, Phó vụ trưởng, Vụ trưởng, TP có ý kiến, TP không có ý kiến, Xác minh–bổ sung, Phó CA, Tổ TP, Chánh án, Hội đồng TP), Dự thảo (Trả lời đơn / Kháng nghị), Hoãn thi hành án
- **[Cao]** Bảng **"Án Quốc Hội"** theo loại án — *B dòng 6*
- **[Cao]** Bảng **"Án thời hiệu <3 tháng theo loại án"** — *B dòng 7*
- **[Cao]** Biểu đồ **"Thống kê vụ án đang giải quyết theo thời hiệu"** — *C dòng 1–5*
- **[Cao]** Biểu đồ **"Tổng án Quốc Hội / Án thời hiệu <3 tháng theo loại án"** (8 loại án + cột Tổng) — *D*
- **[Cao]** Bảng **"Hiệu suất giải quyết đơn của cán bộ Vụ GĐ,KT"** — *D bảng dòng 1–9* — combobox Cán bộ (7 nhóm); cột Họ tên, Chức vụ–chức danh, Phải giải quyết (Cũ còn lại / Mới nhận / Tổng — mốc 5 ngày làm việc kể từ ngày phân công TTV), Đã giải quyết (Trả lời đơn / Kháng nghị / Xử lý khác / Tổng), Tỷ lệ giải quyết, Chưa xét xử, Đã xét xử (Rút KN / Chuyển thẩm quyền XX / Đã XX), Tỷ lệ xét xử, Tổng đơn
- **[Cao]** **Drill-down**: click cột/số ở biểu đồ hoặc bảng → mở tab tương ứng với DS vụ án đúng tiêu chí — *Luồng (1)*
- **[TB]** Chức năng **in báo cáo** từ dashboard
- **[TB]** Công thức "thời hiệu còn 3 tháng" — *QTNV 1* — HS: 9 tháng ≤ (nay − ngày BA) ≤ 1 năm; loại khác: 2 năm 9 tháng ≤ … ≤ 3 năm, hoặc 4 năm 9 tháng ≤ … ≤ 5 năm
- **[Thấp]** 6 ràng buộc kiểm tra chéo tổng số cho tester — *QTNV 2 (1)–(6)*

## CẦN HỎI
- Dashboard đặt ở đâu trong menu — gắn vào nút "Trang chủ" (`Sidebar.tsx:216`) hay mục riêng? Hiển thị theo Vụ đăng nhập?
- **Mâu thuẫn SRS**: ô "Tổng đơn chờ tiếp nhận" (A dòng 1) và cột "Chờ tiếp nhận"/"Quá hạn tiếp nhận" (dòng 6) **đã bị gạch bỏ**, nhưng QTNV 2 điều (1) vẫn ghi "Tổng đơn chờ tiếp nhận = …". Bỏ hay giữ?
- **Lỗi SRS mục B dòng 2 "Hồ sơ"**: giá trị "Đã có" mô tả là "…**chưa** có phiếu nhận hồ sơ", "Chưa có" mô tả là "…**đã** có phiếu nhận hồ sơ" — **hai định nghĩa bị đảo**.
- Ký hiệu **"D" bị dùng 2 lần** (Biểu đồ án QH/thời hiệu và Bảng hiệu suất cán bộ) — thứ tự hiển thị ra sao?
- Mục A dòng 8 "Rút kháng nghị": công thức **bỏ lửng** ("Tổng vụ xét xử nhưng rút kháng nghị=")
- Mục C dòng 2 "Án Quốc Hội" đã gạch bỏ — biểu đồ thời hiệu còn 4 cột, đúng không?
- "Đã giải quyết" (A dòng 6) có điều kiện phức tạp về KQ kháng nghị + thẩm quyền xét xử — cần chốt.
- **Loại biểu đồ cụ thể** (cột chồng / cột nhóm / tròn) cho từng khối — SRS chỉ có ảnh, không mô tả chữ.

---

# 16. QUẢN LÝ VỤ ÁN TỔNG HỢP — **CHƯA CÓ GÌ TRONG MOCKUP**

Đã xác minh: grep `src/app/*.tsx` cho "vụ án tạm", "vuAnTam", "tổng hợp vụ án", "hồ sơ tổng hợp" → **0 kết quả**; `Sidebar.tsx` không có view tương ứng.

> **⚠ SRS mâu thuẫn về phân hệ sở hữu:** phần mở đầu ghi "Hỗ trợ quản lý hồ sơ Vụ án đối với **phân hệ HCTP**"; use case màn Danh sách ghi tác nhân "**Cán bộ VP HCTP**", điều kiện "quyền truy cập **menu VP HCTP**"; nhưng use case màn Chi tiết ghi "quyền truy cập **menu Giám đốc, kiểm tra**", cả 3 luồng sự kiện đều bắt đầu "Tại menu **Giám đốc, kiểm tra** → Hồ sơ tổng hợp vụ án", và BR-01 ghi "…tổng hợp tại tab Hồ sơ vụ án tổng hợp **bên Vụ Giám đốc, Kiểm tra**". **Cần chốt trước khi ước lượng khối lượng.**

## THIẾU (toàn bộ, nếu thuộc phạm vi GĐ,KT)
- **[Cao]** Màn **"Danh sách hồ sơ tổng hợp vụ án"** + mục menu
- **[Cao]** Khu vực tìm kiếm nâng cao **9 tiêu chí** (Tòa ra BA/QĐ, Số BA/QĐ, Ngày BA/QĐ, Loại án, Thuộc án, Nhận đơn từ–đến, Thụ lý từ–đến, Mã số vụ án tổng hợp, Án thời hiệu) + Tìm kiếm/Làm mới
- **[Cao]** Cột **"Thông tin vụ án tổng hợp"** — Mã vụ án tổng hợp **HS[YY]-XXXXXX** (6 chữ số, reset đầu năm); Tên vụ án tổng hợp (HS: *[Tên bị án đầu vụ] – [Tội danh chính]*; DS: *[QHPL] – [Nguyên đơn] và [Bị đơn]*); Ngày tạo; DS **Mã vụ án tạm** dạng link
- **[Cao]** Cột **"Thông tin vụ án" theo giai đoạn** (Sơ thẩm / Phúc thẩm / GĐT / TT với Số BA, Ngày BA, Tòa ra bản án)
- **[Cao]** Cột Số đơn, **Trạng thái** (Đang/Đã giải quyết), **Tình trạng** 6 giá trị — *BR-05*
- **[Cao]** Icon **"Án Quốc Hội"** trên dòng danh sách
- **[Cao]** Checkbox chọn hồ sơ + button **"Tích hợp vụ án tạm"** + modal xác nhận (gộp và **xóa mềm** bản ghi vụ án tạm)
- **[Cao]** Màn **"Chi tiết hồ sơ tổng hợp vụ án"** — khối Vụ án gốc; khối Thông tin bản án với checkbox ẩn/hiện từng bản án (Sơ thẩm mặc định ẩn); checkbox "Danh sách đơn" (mặc định hiện)
- **[Cao]** **Bảng Danh sách đơn** trong màn chi tiết (STT, Người/đơn vị đứng đơn, Thông tin đơn, Số đơn, Thông tin giải quyết, Kết quả thụ lý, icon Xem chi tiết đơn)
- **[Cao]** Khối **"Vụ án tạm"** trong màn chi tiết
- **[TB]** **BR-03**: vụ án tạm chỉ hiện gợi ý khi trùng ít nhất một trong Giai đoạn / Số BA-QĐ / Ngày BA-QĐ / Tòa ban hành
- **[TB]** **BR-01**: logic tự động ghép đơn mới vào vụ án tổng hợp / tạo vụ án tạm (TH1–TH3)
- **[TB]** **BR-05**: quy tắc suy ra Trạng thái/Tình trạng
- **[TB]** Sắp xếp danh sách + sắp xếp đơn trong màn chi tiết
- **[TB]** Phân trang + dòng "Hiển thị 1-2 trong tổng số 2 vụ án"
- **[TB]** BR-01 màn chi tiết: vào chi tiết vụ án tổng hợp **hoặc** vụ án tạm đều hiển thị đầy đủ cả hai
- **[Thấp]** **BR-04**: xóa đơn cuối cùng của vụ án tạm → tự xóa vụ án tạm
- **[Thấp]** Validate khoảng ngày (Từ ngày > Đến ngày → báo lỗi) và trạng thái danh sách rỗng

## LỆCH (so với phần đang có trong mockup)
- Mã vụ án mockup dùng **`VA26-XXXXXX`** (`QuanLyVuAnView.tsx:68`, `data.ts:383`) — SRS quy định mã hồ sơ tổng hợp là **`HS[YY]-XXXXXX`**. Hai mã khác nhau hay cùng một mã?
- Tên vụ án dân sự mockup: *"Vụ án [1 đương sự] – [QHPL]"* — **SRS Quản lý vụ án tổng hợp** yêu cầu *[QHPL] – [Nguyên đơn] và [Bị đơn]*; **SRS In BC** lại yêu cầu *Nguyên đơn – bị đơn – QHPL*. **Mockup không khớp cả hai.**
- Header nhóm vụ án lớn không hiển thị "(Số vụ án giải quyết)" — `QuanLyVuAnView.tsx:955` (có biến `soVuAnGiaiQuyet` `:66` nhưng không dùng)
- Mockup gom nhóm vụ án lớn ngay trong màn "Quản lý vụ án" (`:864`), **không phải** màn "Hồ sơ tổng hợp vụ án" riêng có tìm kiếm nâng cao, trạng thái/tình trạng và tích hợp vụ án tạm

## CẦN HỎI
- **Phân hệ nào sở hữu màn này?** (mâu thuẫn nêu ở trên) — quyết định có phải dựng trong mockup GĐ,KT hay không.
- Mã `HS[YY]-XXXXXX`: tiền tố "HS" cố định hay đổi theo loại án? Quan hệ với mã `VA26-…`?
- Quy tắc đặt **tên vụ án dân sự** khác nhau giữa 2 SRS — chốt bản nào?
- BR-06 "Check ảnh hưởng giữa các tính năng" **chỉ có ảnh**, không có nội dung chữ.
- Trường "Tình trạng" ghi "*(chi tiết ở bảng phụ lục)*" — bảng phụ lục ở đâu?
- Phần cuối tài liệu còn để mở **3 phương án** xử lý khi không tìm thấy bản án trong DB — đã chốt Phương án 3 (vụ án tạm) chưa? Cơ chế "gửi thông tin đến các tòa án liên quan nhập bổ sung" có thuộc phạm vi mockup không?
- "Xóa mềm" vụ án tạm: có màn xem lại / khôi phục không?
- 1 vụ án gốc có nhiều vụ án tạm gợi ý — chọn từng cái hay tích hợp tất cả?

---

# PHỤ LỤC — LỖI KỸ THUẬT CẦN DỌN (không liên quan SRS)

| # | Vấn đề | Vị trí |
|---|---|---|
| 1 | `GiaoTieuHoSoView` có **2 bản trùng lặp**; bản chạy là `App.tsx:614`, bản chết thiếu import `Calendar` | `NhanDonTLVuAnView.tsx:563` |
| 2 | `TabToTrinh` có **2 bản trùng lặp**; bản chạy là `QuanLyVuAnView.tsx:2668` | `App.tsx:1750` |
| 3 | `ModalNhanHoSoKhangNghi` **code chết**, không nơi nào render | `HoSoKhangNghiView.tsx:418`, `App.tsx:3071` |
| 4 | `ContextMenu` khai báo nhưng không được gọi | `QuanLyVuXetXuView.tsx:4691` |
| 5 | Hằng `LIST_TABS` chết (tabs định nghĩa inline) | `QuanLyVuXetXuView.tsx:429` |
| 6 | Hằng `DON_AN_GIAM_LIST` chết | `HoSoTuHinhView.tsx:15` |
| 7 | **Lệch cột**: header 6 mục nhưng `<colgroup>` 7 cột (bảng KQGQ đơn) | `HoSoTuHinhView.tsx:1994` |
| 8 | **Lệch cột**: bảng phân công TP (6/7), bảng TTV (7/8) | `HoSoTuHinhView.tsx:601`, `:637` |
| 9 | **Lệch cột**: nhánh "các vụ án còn lại" render thêm 1 ô STT so với `<colgroup>` 7 cột | `QuanLyVuAnView.tsx:922` |
| 10 | Mọi dòng hồ sơ tử hình đều mở `hs-1`; tiêu đề chi tiết hard-code tên bị án sai | `HoSoTuHinhView.tsx:3043`, `:1913` |
| 11 | Tab "Quá hạn giải quyết" (khiếu nại) **không lọc gì**, `return group;` | `QuanLyKhieuNaiView.tsx:73` |
| 12 | Số vụ đang giải quyết sinh `Math.random()` mỗi lần render | `PhanCongThamPhanView.tsx:811` |
| 13 | Banner "Cập nhật dữ liệu thành công!" bật mặc định khi mở màn | `App.tsx:1240` |
| 14 | Nhiều nút không gắn `onClick`: In biểu đồ, In danh sách, icon In, Tìm kiếm, Xóa bộ lọc, Xuất Excel | nhiều file |
| 15 | `ChonHoSoModal.onSelect` luôn chọn `listHoSo[0]` bất kể thao tác người dùng | `HoSoKhangNghiView.tsx:1321` |
