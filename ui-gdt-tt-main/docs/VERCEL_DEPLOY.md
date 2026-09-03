# Deploy Vercel

Nếu upload ZIP/repo với `package.json` ở root của source này:

- Framework Preset: Vite
- Root Directory: để trống
- Install Command: `npm ci --include=dev`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: 20.x

Nếu source này được đặt lại bên trong thư mục `ui-gdt-tt-main/` của một repo khác, đặt Root Directory = `ui-gdt-tt-main`.

Không commit/upload `node_modules` từ Windows lên Vercel.
