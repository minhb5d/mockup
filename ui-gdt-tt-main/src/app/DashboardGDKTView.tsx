import React, { useMemo, useState } from "react";
import { Calendar, ClipboardList, Grid3x3, LineChart, Printer, User } from "lucide-react";
import { BORDER, F, MUTED, RED, TEXT, getDepartmentInfo, type UserRoleType } from "./shared";

type DashboardTarget = "don-cho-phe-duyet" | "quan-ly-vu-an" | "quan-ly-vu-xet-xu" | "an-quoc-hoi" | "an-thoi-hieu";

const VU_ORDER: UserRoleType[] = ["vu-1", "vu-2", "vu-3", "vu-4"];

// Cán bộ Vụ GĐ,KT — theo danh sách Kevin cung cấp (BAN-GIAO 03/09)
interface CanBoRow {
  hoTen: string;
  taiKhoan: string;
  chucVu: string;
  vu: UserRoleType;
  ngay: number;
  thang: number;
  ky: number;
  tb: string;
}

const CAN_BO_VU_GDKT: CanBoRow[] = [
  { hoTen: "Nguyễn Thị Bình", taiKhoan: "binhnt", chucVu: "Vụ trưởng", vu: "vu-1", ngay: 2, thang: 14, ky: 37, tb: "1.7" },
  { hoTen: "Bùi Thị Thanh Loan", taiKhoan: "loanbtt", chucVu: "TTV", vu: "vu-1", ngay: 3, thang: 21, ky: 58, tb: "2.6" },
  { hoTen: "Nguyễn Thị Hà", taiKhoan: "hant", chucVu: "Vụ trưởng", vu: "vu-2", ngay: 1, thang: 9, ky: 24, tb: "1.1" },
  { hoTen: "Phạm Minh Tùng", taiKhoan: "tungpm", chucVu: "TTV", vu: "vu-2", ngay: 2, thang: 16, ky: 41, tb: "1.9" },
  { hoTen: "Cao Phương Ly", taiKhoan: "lycp", chucVu: "TTV", vu: "vu-3", ngay: 2, thang: 12, ky: 33, tb: "1.5" },
  { hoTen: "Mai Hương Sen", taiKhoan: "senmh", chucVu: "TTV", vu: "vu-4", ngay: 1, thang: 8, ky: 19, tb: "0.9" },
];

// Lãnh đạo TAND tối cao / văn phòng — chỉ để xem báo cáo tổng hợp (không có số liệu xử lý đơn trực tiếp)
const LANH_DAO_XEM_TONG_HOP = [
  "Nguyễn Văn Quảng/Chánh án",
  "Nguyễn Hải Trâm/Phó Chánh án",
  "Nguyễn Tường Linh/Chánh văn phòng",
  "Nguyễn Việt Hùng/Phó Chánh Văn phòng",
];

function StatCard({
  icon,
  label,
  value,
  bg,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
  color: string;
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, fontFamily: F }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 0.3 }}>{label}</span>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 14 }}>{value}</div>
    </div>
  );
}

function GroupedBarChart({
  title,
  categories,
  series,
}: {
  title: string;
  categories: string[];
  series: { name: string; color: string; values: number[] }[];
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const gridLines = [0, 0.2, 0.4, 0.6, 0.8, 1];
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        {series.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: 190, display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", fontSize: 10, color: MUTED, paddingRight: 6, width: 26 }}>
          {gridLines.map((g) => (
            <span key={g}>{Math.round(max * g)}</span>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", borderLeft: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          {gridLines.map((g) => (
            <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: `${g * 100}%`, borderTop: g === 0 ? "none" : "1px dashed #eef0f2" }} />
          ))}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "0 8px" }}>
            {categories.map((cat, ci) => (
              <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 165 }}>
                  {series.map((s) => (
                    <div
                      key={s.name}
                      title={`${s.name}: ${s.values[ci]}`}
                      style={{ width: 14, height: `${Math.max(2, (s.values[ci] / max) * 100)}%`, background: s.color, borderRadius: "2px 2px 0 0" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 6, paddingLeft: 26 }}>
        {categories.map((cat) => (
          <span key={cat} style={{ fontSize: 10, color: MUTED, textAlign: "center", maxWidth: 70 }}>{cat}</span>
        ))}
      </div>
    </div>
  );
}

function StackedPercentChart({ title, categories, seriesA, seriesB, labelA, labelB }: {
  title: string; categories: string[]; seriesA: number[]; seriesB: number[]; labelA: string; labelB: string;
}) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#1e3a8a" }} />{labelA}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#f97316" }} />{labelB}</div>
      </div>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-end", height: 190, borderLeft: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, paddingLeft: 10 }}>
        {categories.map((cat, i) => {
          const a = seriesA[i], b = seriesB[i];
          const total = a + b || 1;
          return (
            <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <div style={{ width: 34, height: 165, display: "flex", flexDirection: "column-reverse", borderRadius: "2px 2px 0 0", overflow: "hidden" }}>
                <div style={{ height: `${(a / total) * 100}%`, background: "#1e3a8a" }} title={`${labelA}: ${a}`} />
                <div style={{ height: `${(b / total) * 100}%`, background: "#f97316" }} title={`${labelB}: ${b}`} />
              </div>
              <span style={{ fontSize: 10, color: MUTED, textAlign: "center", lineHeight: 1.3 }}>{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardGDKTView({ userRole = "vu-1", setUserRole, onNavigate }: { userRole?: UserRoleType; setUserRole?: (r: UserRoleType) => void; onNavigate?: (v: DashboardTarget) => void }) {
  const [capXetXu] = useState("Giám đốc thẩm, tái thẩm");
  const info = getDepartmentInfo(userRole);
  const isToanBo = userRole === "toan-bo";

  const staffRows = useMemo(() => (isToanBo ? CAN_BO_VU_GDKT : CAN_BO_VU_GDKT.filter((r) => r.vu === userRole || (userRole === "hinh-su" && r.vu === "vu-1") || (userRole === "dan-su" && r.vu === "vu-2") || (userRole === "hanh-chinh" && r.vu === "vu-4"))), [userRole, isToanBo]);

  const nguoiDangDangNhap = staffRows.find((r) => r.chucVu === "Vụ trưởng") || CAN_BO_VU_GDKT[0];

  const stats = useMemo(() => {
    const factor = isToanBo ? CAN_BO_VU_GDKT.length : Math.max(1, staffRows.length);
    return {
      trongThang: staffRows.reduce((s, r) => s + r.thang, 0) || 14 * factor,
      trongKy: staffRows.reduce((s, r) => s + r.ky, 0) || 37 * factor,
      tbNgay: (staffRows.reduce((s, r) => s + Number(r.tb), 0) / Math.max(1, staffRows.length)).toFixed(1),
    };
  }, [staffRows, isToanBo]);

  // Các mốc quy trình nghiệp vụ GĐT/TT tại Vụ GĐ,KT (theo tài liệu "Các quy trình nghiệp vụ GĐT/TT" V1.1):
  // Phòng HCTP chuyển VB đến Vụ → Vụ phân công nghiên cứu → TPB3/TPTC/Tổ thẩm phán giải quyết → chuẩn bị & xét xử GĐT,TT
  const trangThaiCategories = ["Sau thụ lý, chuyển Vụ", "Phân công nghiên cứu", "Giải quyết văn bản (TPB3/TPTC)", "Chuẩn bị & xét xử GĐT,TT"];
  const trangThaiSeries = [
    { name: "Chưa giải quyết", color: "#2563eb", values: [9, 3, 0, 0] },
    { name: "Đang giải quyết", color: "#f59e0b", values: [0, 6, 22, 5] },
    { name: "Đã giải quyết", color: "#16a34a", values: [0, 0, 0, 33] },
  ];

  // Phân luồng thẩm quyền giải quyết văn bản đề nghị (bước 1.8–1.14, mục "Trình tự giải quyết văn bản đề nghị")
  const chuyenDonCategories = ["TPB3 thuộc Vụ", "TPB3 lãnh đạo ngoài Vụ", "Thẩm phán Tối cao (TPTC)", "Tổ thẩm phán", "Thủ tục rút gọn", "Phó Chánh án"];
  const chuyenDonSeries = [{ name: "Văn bản đang giải quyết", color: RED, values: [15, 3, 7, 4, 5, 2] }];

  const loaiAnCategories = isToanBo ? ["Hình sự", "Dân sự", "KDTM/LĐ/HNGĐ", "Hành chính"] : [info.loaiAnChinh];
  const loaiAnValues = isToanBo ? [11, 7, 4, 2] : [11];

  const vuLabels = VU_ORDER.map((v) => getDepartmentInfo(v).tenRutGon.replace("Vụ Giám đốc, kiểm tra ", "Vụ "));
  const thuLyMoi = [18, 12, 9, 6];
  const donTrung = [3, 2, 1, 1];

  return (
    <div style={{ padding: 20, background: "#f8fafc", height: "100%", overflow: "auto", fontFamily: F }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>Trang chủ</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2 style={{ margin: 0, color: TEXT, fontSize: 20 }}>{info.tenDayDu}</h2>
        </div>
        {setUserRole && (
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRoleType)}
            style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, fontSize: 12, background: "#fff", minWidth: 200 }}
          >
            <option value="vu-1">Vụ Giám đốc, kiểm tra I (Hình sự)</option>
            <option value="vu-2">Vụ Giám đốc, kiểm tra II (Dân sự)</option>
            <option value="vu-3">Vụ Giám đốc, kiểm tra III (KDTM...)</option>
            <option value="vu-4">Vụ Giám đốc, kiểm tra IV (Hành chính)</option>
            <option value="toan-bo">Toàn bộ Vụ GĐ,KT</option>
          </select>
        )}
        <select value={capXetXu} disabled style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, fontSize: 12, background: "#fff", color: TEXT, minWidth: 170 }}>
          <option>Giám đốc thẩm, tái thẩm</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", fontSize: 12, color: TEXT }}>
          <Calendar size={13} color={MUTED} /> 1/9/2026 → 30/9/2026
        </div>
        <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: RED, color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: F, fontSize: 12, fontWeight: 600 }}>
          <Printer size={14} /> In Báo cáo
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, marginBottom: 12 }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: F }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={24} color="#9ca3af" />
          </div>
          <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, textAlign: "center" }}>{nguoiDangDangNhap.hoTen}</div>
          <div style={{ fontSize: 11, color: MUTED }}>{nguoiDangDangNhap.chucVu}</div>
        </div>
        <StatCard icon={<ClipboardList size={15} color="#fff" />} label="SỐ ĐƠN XỬ LÝ TRONG THÁNG" value={stats.trongThang} bg="#f0fdf4" color="#16a34a" />
        <StatCard icon={<Grid3x3 size={15} color="#fff" />} label="TỔNG ĐƠN XỬ LÝ TRONG KỲ" value={stats.trongKy} bg="#f5f3ff" color="#7c3aed" />
        <StatCard icon={<LineChart size={15} color="#fff" />} label="KỲ: TRUNG BÌNH ĐƠN/NGÀY" value={stats.tbNgay} bg="#fff7ed" color="#ea580c" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <GroupedBarChart title="Tổng số đơn theo trạng thái giải quyết" categories={trangThaiCategories} series={trangThaiSeries} />
        <GroupedBarChart title="Văn bản đề nghị theo thẩm quyền giải quyết" categories={chuyenDonCategories} series={chuyenDonSeries} />
      </div>

      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Vụ việc đang giải quyết theo loại án</div>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-end", height: 150, paddingLeft: 8 }}>
          {loaiAnCategories.map((cat, i) => {
            const max = Math.max(...loaiAnValues, 1);
            return (
              <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{loaiAnValues[i]}</span>
                <div style={{ width: 38, height: `${(loaiAnValues[i] / max) * 110}px`, background: RED, borderRadius: "3px 3px 0 0" }} />
                <span style={{ fontSize: 10, color: MUTED, textAlign: "center", maxWidth: 80 }}>{cat}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <StackedPercentChart title="Đơn đủ điều kiện theo Vụ GĐ,KT giải quyết" categories={vuLabels} seriesA={thuLyMoi} seriesB={donTrung} labelA="Đơn thụ lý mới" labelB="Đơn trùng" />
      </div>

      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, overflowX: "auto" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Tổng đơn xử lý theo cán bộ</div>
        <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 11.5 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Họ và tên", "Tài khoản", "Chức vụ", "Số đơn xử lý trong ngày hiện tại", "Số đơn xử lý trong tháng hiện tại", "Tổng số đơn xử lý trong kỳ", "Trung bình số đơn xử lý mỗi ngày (làm việc) trong kỳ"].map((h) => (
                <th key={h} style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "left", fontWeight: 700, color: TEXT }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffRows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center", color: MUTED, border: `1px solid ${BORDER}` }}>Trống</td>
              </tr>
            ) : (
              staffRows.map((r) => (
                <tr key={r.taiKhoan}>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.hoTen}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, color: MUTED }}>{r.taiKhoan}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.chucVu}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.ngay}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.thang}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.ky}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.tb}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {isToanBo && (
          <div style={{ marginTop: 10, fontSize: 10.5, color: MUTED }}>
            Lãnh đạo TAND tối cao / Chánh văn phòng chỉ xem báo cáo tổng hợp (không có số liệu xử lý đơn trực tiếp): {LANH_DAO_XEM_TONG_HOP.map((s) => s.split("/")[0]).join(", ")}.
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, color: MUTED, marginTop: 10 }}>
        Dashboard dựng theo mẫu Trang chủ của Phòng Hành chính - Tư pháp trên STG, áp dụng cho Vụ GĐ,KT với phân quyền theo Vụ (đổi Vụ ở góc trên để xem theo phạm vi phụ trách). Các mốc/thẩm quyền giải quyết trong 2 biểu đồ trên tham chiếu tài liệu "Các quy trình nghiệp vụ GĐT/TT" (V1.1): sau thụ lý → phân công nghiên cứu → giải quyết theo thẩm quyền (TPB3 thuộc Vụ / TPB3 lãnh đạo ngoài Vụ / TPTC / Tổ thẩm phán / thủ tục rút gọn / Phó Chánh án) → chuẩn bị & xét xử GĐT,TT.
      </div>
    </div>
  );
}
