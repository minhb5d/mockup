# Hướng dẫn Git cho người mới — repo mockup GĐT/TT

Repo đã được khởi tạo sẵn ở máy Kevin tại:

```
C:\Users\ADMIN\Downloads\Telegram Desktop\ui-gdt-tt-main\ui-gdt-tt-main
```

Đã có 2 commit trên nhánh `main`, `node_modules/` đã bị loại trừ. Việc còn lại: đưa lên GitHub.

---

## PHẦN 1 — Kevin: đưa repo lên GitHub (chọn 1 trong 2 cách)

### Cách A — GitHub Desktop (khuyến nghị, không cần gõ lệnh)

1. Tải và cài **GitHub Desktop**: https://desktop.github.com — mở lên, đăng nhập tài khoản GitHub.
2. Menu **File → Add local repository…**
3. Bấm **Choose…**, trỏ tới đúng thư mục:
   `C:\Users\ADMIN\Downloads\Telegram Desktop\ui-gdt-tt-main\ui-gdt-tt-main`
   (thư mục **bên trong**, cái có file `package.json` — không phải thư mục cha)
4. Bấm **Add repository**. GitHub Desktop sẽ nhận ra 2 commit có sẵn.
5. Bấm nút **Publish repository** ở thanh trên cùng.
6. Trong hộp thoại:
   - **Name**: `ui-gdt-tt`
   - **Description**: `Mockup Quản lý án GĐT/TT — Vụ Giám đốc, Kiểm tra`
   - ✅ **Keep this code private** ← **bắt buộc tích ô này**
7. Bấm **Publish repository**. Xong — code đã lên GitHub.

### Cách B — dòng lệnh

Cần cài **Git for Windows** trước: https://git-scm.com/download/win (bấm Next hết, giữ mặc định).

1. Vào https://github.com/new, điền:
   - **Repository name**: `ui-gdt-tt`
   - Chọn **Private**
   - **KHÔNG** tích "Add a README file", "Add .gitignore", "Choose a license" — để trống hết,
     vì repo ở máy đã có sẵn rồi, tích vào sẽ gây xung đột.
   - Bấm **Create repository**
2. Mở **Git Bash** (chuột phải trong thư mục dự án → *Open Git Bash here*), chạy:

```bash
cd "/c/Users/ADMIN/Downloads/Telegram Desktop/ui-gdt-tt-main/ui-gdt-tt-main"
git remote add origin https://github.com/<TÊN-GITHUB-CỦA-BẠN>/ui-gdt-tt.git
git push -u origin main
```

3. Lần đầu push sẽ hiện cửa sổ đăng nhập GitHub — đăng nhập bằng trình duyệt là xong.

---

## PHẦN 2 — Mời teammate

1. Vào repo trên GitHub → tab **Settings**
2. Menu trái: **Collaborators** (có thể phải nhập lại mật khẩu)
3. Bấm **Add people**, gõ username GitHub của em teammate → **Add to repository**
4. Em ấy sẽ nhận email mời, bấm **Accept**

---

## PHẦN 3 — Teammate: lấy code về và bắt đầu làm

```bash
git clone https://github.com/<TÊN-GITHUB-CỦA-KEVIN>/ui-gdt-tt.git
cd ui-gdt-tt
npm install
npm run dev
```

Đọc trước khi sửa gì: `AGENTS.md` (quy tắc) và `docs/PHAN-CONG-CONG-VIEC.md` (chia việc).
Danh sách đầu việc: `docs/DOI-CHIEU-SRS-MOCKUP.xlsx`, lọc cột **Lane = B**.

---

## PHẦN 4 — Vòng lặp làm việc hằng ngày (cả hai)

```bash
# 1. Lấy code mới nhất trước khi làm bất cứ gì
git checkout main
git pull

# 2. Tạo nhánh cho module sắp làm
git checkout -b B/nhan-don          # Lane B; Lane A thì dùng A/...

# 3. Sửa code ... rồi kiểm tra build
npm run build

# 4. Lưu lại
git add -A
git commit -m "feat(nhan-don): bổ sung popup Trả đơn theo SRS 1.2 (TH-001)"

# 5. Đồng bộ với main rồi đẩy lên
git pull --rebase origin main
git push -u origin B/nhan-don
```

Sau đó vào GitHub, bấm **Compare & pull request** → **Create pull request** → người kia review →
**Merge pull request**.

### Vài lệnh hay cần

| Việc | Lệnh |
|---|---|
| Xem đang ở nhánh nào, sửa file gì | `git status` |
| Xem mình đã sửa những dòng nào | `git diff` |
| Xem tóm tắt file đã sửa | `git diff --stat` |
| Bỏ hết thay đổi chưa commit của 1 file | `git checkout -- đường/dẫn/file.tsx` |
| Xem lịch sử | `git log --oneline` |
| Quay về nhánh main | `git checkout main` |

### Nếu bị conflict khi `git pull --rebase`

Git sẽ báo file nào conflict. Mở file đó, tìm các dấu:

```
<<<<<<< HEAD
(code của người kia)
=======
(code của mình)
>>>>>>> ...
```

Giữ lại phần đúng, xoá 3 dòng dấu `<<<<<<<`, `=======`, `>>>>>>>`, rồi:

```bash
git add đường/dẫn/file.tsx
git rebase --continue
```

Nếu rối quá thì `git rebase --abort` để quay lại như cũ, rồi hỏi người kia.

---

## Lưu ý

- **Không bao giờ commit `node_modules/`** — đã có trong `.gitignore`, đừng gỡ ra.
- Thư mục dự án đang nằm trong `Downloads\Telegram Desktop`. Sau khi push lên GitHub xong, nên
  clone lại về một chỗ gọn hơn (VD `C:\Projects\ui-gdt-tt`) để làm việc lâu dài — Downloads dễ bị
  dọn nhầm.
