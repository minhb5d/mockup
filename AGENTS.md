# Quy tắc làm việc trên repo này (cho mọi AI agent: Codex, Claude Code, …)

Repo có **2 người làm song song trên 2 nhánh**, sau đó merge. Phần lớn quy tắc dưới đây tồn tại để
merge không đau. Vi phạm một quy tắc format có thể sinh diff hàng nghìn dòng và làm hỏng việc của
người kia — đọc kỹ mục "Cấm" trước khi sửa gì.

## 1. Nguồn sự thật

- **SRS là chuẩn.** Khi mockup và SRS lệch nhau, sửa mockup theo SRS.
- Danh sách việc: `docs/DOI-CHIEU-SRS-MOCKUP.xlsx` (bảng làm việc) và `docs/DOI-CHIEU-SRS-MOCKUP.md`
  (chi tiết theo module, có dẫn chiếu mục SRS và `file.tsx:dòng`).
- Chia việc và sở hữu file: `docs/PHAN-CONG-CONG-VIEC.md`.
- **Chỉ làm các mục thuộc lane của mình.** Mục loại **THỪA** và **CẦN HỎI** thì **không đụng vào**,
  đang chờ Lead/BA trả lời.

## 2. Cấm — sẽ phá merge

- ❌ **Không chạy Prettier / ESLint --fix / format-on-save trên cả file.** Code dùng inline style,
  format lại sinh diff toàn file. Chỉ sửa đúng những dòng cần sửa.
- ❌ **Không sắp xếp lại import**, không đổi dấu nháy, không thêm/bớt dấu chấm phẩy hàng loạt.
- ❌ **Không sửa file thuộc lane của người kia.** Nếu cần, mở issue hoặc nhắn — đừng tự sửa.
- ❌ **Không đổi tên / di chuyển file** đã có, trừ khi được ghi rõ trong `PHAN-CONG-CONG-VIEC.md`.
- ❌ **Không xoá các mục loại THỪA** dù thấy SRS không mô tả — chờ Lead chốt.
- ❌ **Không commit `node_modules/`, `dist/`** (đã có trong `.gitignore`).

## 3. File dùng chung — sửa phải cẩn thận

`src/app/App.tsx` (routing), `src/app/Sidebar.tsx`, `src/app/shared.tsx`, `src/app/data.ts`,
`src/styles/*`.

Cả hai lane đều phải chạm vào các file này. Quy tắc:

- Mỗi thay đổi ở file dùng chung tách thành **PR riêng, càng nhỏ càng tốt**, merge vào `main` ngay
  trong ngày, rồi hai bên `git pull --rebase`.
- Chỉ **thêm** (thêm view mới, thêm route, thêm hằng số), tránh sửa/xoá cái đang có.
- Thêm route mới thì chèn **cuối** danh sách, không chèn giữa.
- Báo cho người kia trước khi sửa.

## 4. Quy trình git

```bash
git checkout main && git pull
git checkout -b A/ten-module        # hoặc B/ten-module
# ... làm việc ...
npm run build                        # BẮT BUỘC pass
git add -A && git commit -m "..."
git pull --rebase origin main        # rebase, không merge
git push -u origin A/ten-module
# tạo Pull Request vào main
```

- Một module = một nhánh = một PR. **Không gộp nhiều module vào một PR.**
- Nhánh đặt tên `A/<slug>` hoặc `B/<slug>` để nhìn là biết của ai.
- Merge vào `main` ngay khi xong một module, đừng để dồn — dồn càng lâu conflict càng nặng.

## 5. Commit message

Tiếng Việt, một dòng đầu ngắn gọn, có mã module. Nếu sửa theo mục cụ thể trong bảng đối chiếu thì
ghi mã mục (`TH-045`, `LE-012`…) để truy ngược được:

```
feat(nhan-don): bổ sung popup Trả đơn theo SRS 1.2 (TH-001)

- Thêm modal Trả đơn: Ngày trả (mặc định hôm nay, disabled), Lý do (bắt buộc)
- Bảng đơn đã tick + nút xoá từng dòng
- Thông báo "Trả đơn thành công."
```

## 6. Chuẩn code trong repo này

- Style viết inline (`style={{...}}`), không dùng CSS module / styled-components. Giữ nguyên cách này.
- Màu chủ đạo `#8b0000`, font `'Be Vietnam Pro', sans-serif` — dùng hằng có sẵn trong `shared.tsx`.
- Icon lấy từ `lucide-react`.
- Dữ liệu mẫu để trong `data.ts` hoặc hằng số đầu file view, không hardcode giữa JSX.
- Đây là **mockup**: không có backend, không gọi API. State giữ trong `useState`.
- Text hiển thị dùng **đúng chữ trong SRS** — sai một chữ cũng tính là lệch (VD: SRS ghi
  "Người đứng đơn" thì không viết "Người gửi đơn").

## 7. Kiểm tra trước khi tạo PR

- [ ] `npm run build` pass
- [ ] Chỉ sửa file thuộc lane của mình (`git diff --stat` để soát)
- [ ] Không có diff format thừa (`git diff` không có hàng loạt dòng chỉ đổi khoảng trắng)
- [ ] Đã tick trạng thái các mục tương ứng trong `docs/DOI-CHIEU-SRS-MOCKUP.xlsx`
- [ ] Mục nào làm khác SRS (vì lý do gì đó) thì ghi rõ trong mô tả PR
