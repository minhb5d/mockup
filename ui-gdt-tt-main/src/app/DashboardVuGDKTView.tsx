import React, { useMemo, useState } from "react";
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList, Clock, FileWarning, Gavel, Printer, Scale, UserX } from "lucide-react";
import {
  BORDER, F, MUTED, RED, TEXT, BG,
  getDepartmentInfo, type UserRoleType,
  type AccountTypeId, type DashboardRoleType,
  getAccountTypeProfile, getDashboardPermission,
} from "./shared";

// ── Loại drill-down mở màn nghiệp vụ thật ────────────────────────────────────
type DashboardTarget =
  | "don-cho-phe-duyet" | "quan-ly-vu-an" | "quan-ly-vu-xet-xu"
  | "an-quoc-hoi" | "an-thoi-hieu" | "phan-cong-ttv";

const VU_ORDER: UserRoleType[] = ["vu-1", "vu-2", "vu-3", "vu-4"];

type KhoangThoiGian = "hom-nay" | "7-ngay" | "thang" | "quy" | "nam" | "tuy-chon";
type CapXetXu = "tat-ca" | "gdt" | "tai-tham";

const ACCOUNT_OPTIONS: { id: AccountTypeId; label: string }[] = [
  { id: "ttv-gdkt", label: "Thẩm tra viên / Thư ký giải quyết án" },
  { id: "tham-phan-gdkt", label: "Thẩm phán" },
  { id: "pho-vu-truong-gdkt", label: "Phó Vụ trưởng" },
  { id: "vu-truong-gdkt", label: "Vụ trưởng" },
  { id: "bctk-vu-gdkt", label: "Tài khoản báo cáo thống kê Vụ" },
];

// ── Số liệu giả theo Vụ (department-level, dataScope = department) ──────────
interface DeptKpi {
  choPheDuyet: number;
  chuaPhanCongTTV: number;
  quaHan: number;
  conThoiHieu3Thang: number;
  dangGiaiQuyet: number;
  anQuocHoi: number;
  chuaXetXu: number;
  daGiaiQuyetTrongKy: number;
}
const DEPT_KPI: Record<UserRoleType, DeptKpi> = {
  "vu-1": { choPheDuyet: 12, chuaPhanCongTTV: 7, quaHan: 9, conThoiHieu3Thang: 14, dangGiaiQuyet: 58, anQuocHoi: 11, chuaXetXu: 16, daGiaiQuyetTrongKy: 33 },
  "vu-2": { choPheDuyet: 8, chuaPhanCongTTV: 4, quaHan: 5, conThoiHieu3Thang: 9, dangGiaiQuyet: 41, anQuocHoi: 7, chuaXetXu: 10, daGiaiQuyetTrongKy: 24 },
  "vu-3": { choPheDuyet: 6, chuaPhanCongTTV: 3, quaHan: 4, conThoiHieu3Thang: 6, dangGiaiQuyet: 33, anQuocHoi: 4, chuaXetXu: 8, daGiaiQuyetTrongKy: 19 },
  "vu-4": { choPheDuyet: 3, chuaPhanCongTTV: 2, quaHan: 2, conThoiHieu3Thang: 4, dangGiaiQuyet: 19, anQuocHoi: 2, chuaXetXu: 5, daGiaiQuyetTrongKy: 12 },
  "toan-bo": { choPheDuyet: 29, chuaPhanCongTTV: 16, quaHan: 20, conThoiHieu3Thang: 33, dangGiaiQuyet: 151, anQuocHoi: 24, chuaXetXu: 39, daGiaiQuyetTrongKy: 88 },
  "hinh-su": { choPheDuyet: 12, chuaPhanCongTTV: 7, quaHan: 9, conThoiHieu3Thang: 14, dangGiaiQuyet: 58, anQuocHoi: 11, chuaXetXu: 16, daGiaiQuyetTrongKy: 33 },
  "dan-su": { choPheDuyet: 8, chuaPhanCongTTV: 4, quaHan: 5, conThoiHieu3Thang: 9, dangGiaiQuyet: 41, anQuocHoi: 7, chuaXetXu: 10, daGiaiQuyetTrongKy: 24 },
  "hanh-chinh": { choPheDuyet: 3, chuaPhanCongTTV: 2, quaHan: 2, conThoiHieu3Thang: 4, dangGiaiQuyet: 19, anQuocHoi: 2, chuaXetXu: 5, daGiaiQuyetTrongKy: 12 },
};

// Hệ số thu hẹp phạm vi theo dataScope (mockup — API thật phải tính lại theo permission server-side)
function scaleKpi(dept: DeptKpi, dataScope: ReturnType<typeof getDashboardPermission>["dataScope"]): DeptKpi {
  const f = dataScope === "department" ? 1 : dataScope === "assigned-scope" ? 0.42 : dataScope === "assigned" ? 0.12 : 0.06;
  const round = (n: number) => Math.max(0, Math.round(n * f));
  return {
    choPheDuyet: round(dept.choPheDuyet),
    chuaPhanCongTTV: round(dept.chuaPhanCongTTV),
    quaHan: round(dept.quaHan),
    conThoiHieu3Thang: round(dept.conThoiHieu3Thang),
    dangGiaiQuyet: round(dept.dangGiaiQuyet),
    anQuocHoi: round(dept.anQuocHoi),
    chuaXetXu: round(dept.chuaXetXu),
    daGiaiQuyetTrongKy: round(dept.daGiaiQuyetTrongKy),
  };
}

interface CanBoRow {
  hoTen: string; taiKhoan: string; chucVu: string; vu: UserRoleType;
  dangGiaiQuyet: number; quaHan: number; con3Thang: number; choPheDuyet: number; chuaXetXu: number; daGiaiQuyet: number;
}
const CAN_BO_VU_GDKT: CanBoRow[] = [
  { hoTen: "Nguyễn Thị Bình", taiKhoan: "binhnt", chucVu: "Vụ trưởng", vu: "vu-1", dangGiaiQuyet: 14, quaHan: 2, con3Thang: 3, choPheDuyet: 4, chuaXetXu: 3, daGiaiQuyet: 9 },
  { hoTen: "Bùi Thị Thanh Loan", taiKhoan: "loanbtt", chucVu: "TTV", vu: "vu-1", dangGiaiQuyet: 21, quaHan: 3, con3Thang: 4, choPheDuyet: 3, chuaXetXu: 5, daGiaiQuyet: 12 },
  { hoTen: "Trần Quốc Hành", taiKhoan: "hanhtq", chucVu: "Phó Vụ trưởng", vu: "vu-1", dangGiaiQuyet: 17, quaHan: 2, con3Thang: 3, choPheDuyet: 3, chuaXetXu: 4, daGiaiQuyet: 8 },
  { hoTen: "Nguyễn Thị Hà", taiKhoan: "hant", chucVu: "Vụ trưởng", vu: "vu-2", dangGiaiQuyet: 9, quaHan: 1, con3Thang: 2, choPheDuyet: 2, chuaXetXu: 2, daGiaiQuyet: 6 },
  { hoTen: "Phạm Minh Tùng", taiKhoan: "tungpm", chucVu: "TTV", vu: "vu-2", dangGiaiQuyet: 16, quaHan: 2, con3Thang: 3, choPheDuyet: 2, chuaXetXu: 3, daGiaiQuyet: 9 },
  { hoTen: "Cao Phương Ly", taiKhoan: "lycp", chucVu: "TTV", vu: "vu-3", dangGiaiQuyet: 12, quaHan: 1, con3Thang: 2, choPheDuyet: 1, chuaXetXu: 3, daGiaiQuyet: 7 },
  { hoTen: "Mai Hương Sen", taiKhoan: "senmh", chucVu: "TTV", vu: "vu-4", dangGiaiQuyet: 8, quaHan: 1, con3Thang: 1, choPheDuyet: 1, chuaXetXu: 2, daGiaiQuyet: 5 },
];

function fmtDate(d: Date) { return d.toLocaleDateString("vi-VN"); }
function periodLabel(kg: KhoangThoiGian): string {
  const now = new Date();
  if (kg === "hom-nay") return fmtDate(now);
  if (kg === "7-ngay") { const from = new Date(now); from.setDate(now.getDate() - 6); return `${fmtDate(from)} → ${fmtDate(now)}`; }
  if (kg === "quy") return `Quý ${Math.floor(now.getMonth() / 3) + 1}/${now.getFullYear()}`;
  if (kg === "nam") return `Năm ${now.getFullYear()}`;
  if (kg === "tuy-chon") return "Tùy chọn";
  return `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
}

function KpiCard({ icon, label, value, bg, color, onClick, disabled }: {
  icon: React.ReactNode; label: string; value: string | number; bg: string; color: string; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        background: bg, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, fontFamily: F,
        cursor: onClick && !disabled ? "pointer" : "default", transition: "box-shadow .15s",
      }}
      onMouseEnter={(e) => { if (onClick && !disabled) e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color, letterSpacing: 0.2, lineHeight: 1.3 }}>{label}</span>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, marginTop: 10 }}>{value}</div>
    </div>
  );
}

function MiniBarChart({ title, categories, values, color, sortDesc }: { title: string; categories: string[]; values: number[]; color: string; sortDesc?: boolean }) {
  let items = categories.map((c, i) => ({ c, v: values[i] }));
  if (sortDesc) items = [...items].sort((a, b) => b.v - a.v);
  const max = Math.max(1, ...values);
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <div key={it.c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: MUTED, width: 150, flexShrink: 0, textAlign: "right" }}>{it.c}</span>
            <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 16, position: "relative" }}>
              <div style={{ width: `${Math.max(3, (it.v / max) * 100)}%`, height: "100%", background: color, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT, width: 24, textAlign: "right" }}>{it.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupedBarChart({ title, categories, series }: { title: string; categories: string[]; series: { name: string; color: string; values: number[] }[] }) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        {series.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />{s.name}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end", height: 170, borderLeft: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, paddingLeft: 8 }}>
        {categories.map((cat, ci) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 145 }}>
              {series.map((s) => (
                <div key={s.name} title={`${s.name}: ${s.values[ci]}`} style={{ width: 16, height: `${Math.max(2, (s.values[ci] / max) * 100)}%`, background: s.color, borderRadius: "2px 2px 0 0" }} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: MUTED, textAlign: "center", maxWidth: 80 }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardVuGDKTView({
  userRole = "vu-1", setUserRole, onNavigate,
}: {
  userRole?: UserRoleType;
  setUserRole?: (r: UserRoleType) => void;
  onNavigate?: (v: DashboardTarget) => void;
}) {
  const [accountType, setAccountType] = useState<AccountTypeId>("vu-truong-gdkt");
  const [khoangTG, setKhoangTG] = useState<KhoangThoiGian>("thang");
  const [capXX, setCapXX] = useState<CapXetXu>("tat-ca");
  const [trichNgang, setTrichNgang] = useState<string | null>(null);

  const profile = getAccountTypeProfile(accountType);
  const perm = getDashboardPermission(profile.dashboardRole);
  const info = getDepartmentInfo(userRole);
  const vu = userRole === "toan-bo" || !VU_ORDER.includes(userRole) ? "vu-1" : userRole;

  const kpi = useMemo(() => scaleKpi(DEPT_KPI[vu] ?? DEPT_KPI["vu-1"], perm.dataScope), [vu, perm.dataScope]);

  const nguoiDangDangNhap = useMemo(() => {
    const wanted: Record<DashboardRoleType, string> = { "vu-truong": "Vụ trưởng", "pho-vu-truong": "Phó Vụ trưởng", "tham-phan": "TTV", ttv: "TTV", "bctk-vu": "Vụ trưởng" };
    return CAN_BO_VU_GDKT.find((r) => r.vu === vu && r.chucVu === wanted[profile.dashboardRole]) || CAN_BO_VU_GDKT.find((r) => r.vu === vu) || CAN_BO_VU_GDKT[0];
  }, [vu, profile.dashboardRole]);

  const staffRows = useMemo(() => {
    if (!perm.showHieuSuatCanBo) return [] as CanBoRow[];
    const rows = CAN_BO_VU_GDKT.filter((r) => r.vu === vu);
    if (perm.dataScope === "assigned-scope") return rows.filter((r) => r.chucVu !== "Vụ trưởng"); // phạm vi phụ trách: không gồm chính Vụ trưởng
    return rows;
  }, [vu, perm.showHieuSuatCanBo, perm.dataScope]);

  const drill = (target: DashboardTarget, popupLabel: string) => {
    if (!perm.canOpenBusinessScreen) { setTrichNgang(popupLabel); return; }
    onNavigate?.(target);
  };

  // 7.1 Tiến độ giải quyết vụ án
  const pipelineFull = [
    { label: "Chưa phân công TTV", value: kpi.chuaPhanCongTTV, color: "#ef4444" },
    { label: "Đã phân công", value: Math.round(kpi.dangGiaiQuyet * 0.3), color: "#f59e0b" },
    { label: "Đang nghiên cứu", value: Math.round(kpi.dangGiaiQuyet * 0.35), color: "#3b82f6" },
    { label: "Chưa có tờ trình", value: Math.round(kpi.dangGiaiQuyet * 0.15), color: "#8b5cf6" },
    { label: "Đang trình / chờ ý kiến", value: kpi.choPheDuyet, color: "#ec4899" },
    { label: "Đã có kết quả", value: kpi.daGiaiQuyetTrongKy, color: "#16a34a" },
  ];
  const pipeline = perm.dataScope === "self" || perm.dataScope === "assigned"
    ? pipelineFull.filter((p) => p.label !== "Chưa phân công TTV")
    : pipelineFull;

  // 7.4 Tình hình xét xử GĐT/TT
  const xetXuCats = ["Quá hạn chưa xét xử", "Chưa xét xử", "Rút kháng nghị", "Chuyển thẩm quyền", "Đã xét xử"];
  const xetXuVals = [Math.round(kpi.quaHan * 0.5), kpi.chuaXetXu, Math.round(kpi.dangGiaiQuyet * 0.04), Math.round(kpi.dangGiaiQuyet * 0.03), kpi.daGiaiQuyetTrongKy];

  // 7.5 Theo dõi thời hạn giải quyết
  const thoiHanCats = ["Quá hạn", "Còn dưới 3 tháng", "Còn trên 3 tháng"];
  const thoiHanVals = [kpi.quaHan, kpi.conThoiHieu3Thang, Math.max(0, kpi.dangGiaiQuyet - kpi.quaHan - kpi.conThoiHieu3Thang)];

  // 7.6 Án Quốc hội / Án thời hiệu <3 tháng theo loại án
  const loaiAnCats = isToanBoLoai(info) ? info.loaiAnList : [info.loaiAnChinh];
  const anQHSeries = { name: "Án Quốc hội", color: RED, values: loaiAnCats.map((_, i) => Math.max(0, kpi.anQuocHoi - i * 2)) };
  const anTHSeries = { name: "Còn thời hiệu < 3 tháng", color: "#f59e0b", values: loaiAnCats.map((_, i) => Math.max(0, kpi.conThoiHieu3Thang - i)) };

  // 7.3 Cảnh báo cần xử lý ngay — top vụ ưu tiên
  const canhBaoRows = useMemo(() => {
    const baseCode = info.code;
    const rows = [
      { ma: `${baseCode.slice(0, 3)}26-002148`, nguoiPhuTrach: nguoiDangDangNhap.hoTen, trangThai: "Chưa xét xử", canhBao: `Quá hạn ${5 + (kpi.quaHan % 10)} ngày` },
      { ma: `${baseCode.slice(0, 3)}26-001937`, nguoiPhuTrach: staffRows[1]?.hoTen || nguoiDangDangNhap.hoTen, trangThai: "Đang nghiên cứu", canhBao: `Còn ${20 - (kpi.conThoiHieu3Thang % 15)} ngày` },
      { ma: `${baseCode.slice(0, 3)}26-002205`, nguoiPhuTrach: staffRows[0]?.hoTen || nguoiDangDangNhap.hoTen, trangThai: "Chờ phê duyệt", canhBao: "Quá hạn 2 ngày" },
    ];
    return rows;
  }, [info.code, nguoiDangDangNhap.hoTen, staffRows, kpi.quaHan, kpi.conThoiHieu3Thang]);

  const soLine: React.CSSProperties = { padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, fontSize: 12, background: "#fff" };

  return (
    <div style={{ padding: 20, background: "#f8fafc", height: "100%", overflow: "auto", fontFamily: F }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>Trang chủ</div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ margin: 0, color: TEXT, fontSize: 19 }}>Dashboard {info.tenRutGon}</h2>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{profile.label} · {periodLabel(khoangTG)}</div>
        </div>

        <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountTypeId)} style={{ ...soLine, minWidth: 220, cursor: "pointer" }} title="Vai trò phân quyền">
          {ACCOUNT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        {setUserRole && (
          <select value={vu} onChange={(e) => setUserRole(e.target.value as UserRoleType)} style={{ ...soLine, minWidth: 90, cursor: "pointer" }} title="Vụ">
            <option value="vu-1">Vụ I</option>
            <option value="vu-2">Vụ II</option>
            <option value="vu-3">Vụ III</option>
            <option value="vu-4">Vụ IV</option>
          </select>
        )}

        <select value={khoangTG} onChange={(e) => setKhoangTG(e.target.value as KhoangThoiGian)} style={{ ...soLine, minWidth: 150, cursor: "pointer" }}>
          <option value="hom-nay">Hôm nay</option>
          <option value="7-ngay">7 ngày gần đây</option>
          <option value="thang">Tháng hiện tại</option>
          <option value="quy">Quý hiện tại</option>
          <option value="nam">Năm hiện tại</option>
          <option value="tuy-chon">Tùy chọn từ ngày/đến ngày</option>
        </select>

        <select value={capXX} onChange={(e) => setCapXX(e.target.value as CapXetXu)} style={{ ...soLine, minWidth: 140, cursor: "pointer" }}>
          <option value="tat-ca">Tất cả cấp xét xử</option>
          <option value="gdt">Giám đốc thẩm</option>
          <option value="tai-tham">Tái thẩm</option>
        </select>

        <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: RED, color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: F, fontSize: 12, fontWeight: 600 }}>
          <Printer size={14} /> In Báo cáo
        </button>
      </div>

      {perm.readOnly && (
        <div style={{ marginBottom: 12, padding: "8px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 12, color: "#1d4ed8", fontFamily: F }}>
          Tài khoản báo cáo thống kê — chỉ xem, không thao tác/sửa hồ sơ nghiệp vụ. Bấm vào số liệu để xem thông tin trích ngang.
        </div>
      )}

      {/* 8 KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 12 }}>
        <KpiCard icon={<ClipboardList size={13} color="#fff" />} label={perm.choPheDuyetLabel.toUpperCase()} value={kpi.choPheDuyet} bg="#fdf4ff" color="#a21caf"
          onClick={() => drill("don-cho-phe-duyet", "Trích ngang: hồ sơ chờ phê duyệt")} />
        {perm.showChuaPhanCongTTVAdmin ? (
          <KpiCard icon={<UserX size={13} color="#fff" />} label="CHƯA PHÂN CÔNG TTV" value={kpi.chuaPhanCongTTV} bg="#fef2f2" color={RED}
            onClick={() => drill("phan-cong-ttv", "Trích ngang: hồ sơ chưa phân công TTV")} />
        ) : (
          <KpiCard icon={<ClipboardList size={13} color="#fff" />} label="ĐANG NGHIÊN CỨU" value={Math.round(kpi.dangGiaiQuyet * 0.35)} bg="#eff6ff" color="#1d4ed8"
            onClick={() => drill("quan-ly-vu-an", "Trích ngang: hồ sơ đang nghiên cứu")} />
        )}
        <KpiCard icon={<AlertTriangle size={13} color="#fff" />} label="ÁN QUÁ HẠN" value={kpi.quaHan} bg="#fff1f2" color="#e11d48"
          onClick={() => drill("quan-ly-vu-xet-xu", "Trích ngang: án quá hạn")} />
        <KpiCard icon={<Clock size={13} color="#fff" />} label="CÒN THỜI HIỆU < 3 THÁNG" value={kpi.conThoiHieu3Thang} bg="#fff7ed" color="#c2410c"
          onClick={() => drill("an-thoi-hieu", "Trích ngang: còn thời hiệu < 3 tháng")} />
        <KpiCard icon={<FileWarning size={13} color="#fff" />} label="VỤ ÁN ĐANG GIẢI QUYẾT" value={kpi.dangGiaiQuyet} bg="#f0fdf4" color="#16a34a"
          onClick={() => drill("quan-ly-vu-an", "Trích ngang: vụ án đang giải quyết")} />
        <KpiCard icon={<Gavel size={13} color="#fff" />} label="ÁN QUỐC HỘI" value={kpi.anQuocHoi} bg="#f5f3ff" color="#7c3aed"
          onClick={() => drill("an-quoc-hoi", "Trích ngang: án Quốc hội")} />
        <KpiCard icon={<Scale size={13} color="#fff" />} label="CHƯA XÉT XỬ" value={kpi.chuaXetXu} bg="#ecfeff" color="#0e7490"
          onClick={() => drill("quan-ly-vu-xet-xu", "Trích ngang: chưa xét xử")} />
        <KpiCard icon={<CheckCircle2 size={13} color="#fff" />} label="ĐÃ GIẢI QUYẾT TRONG KỲ" value={kpi.daGiaiQuyetTrongKy} bg="#f7fee7" color="#4d7c0f"
          onClick={() => drill("quan-ly-vu-an", "Trích ngang: đã giải quyết trong kỳ")} />
      </div>

      {/* 7.1 Tiến độ giải quyết vụ án */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Tiến độ giải quyết vụ án</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pipeline.map((p, i) => (
            <div key={p.label} style={{ flex: "1 1 140px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10.5, color: MUTED }}>{i + 1}. {p.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{p.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {/* 7.2 Chờ phê duyệt / cho ý kiến */}
        <MiniBarChart
          title={`${perm.choPheDuyetLabel} — phân bố theo cấp/trạng thái chờ`}
          categories={["Chờ Vụ trưởng", "Chờ xin ý kiến", "Tờ trình/dự thảo", "Nhóm khác"]}
          values={[Math.round(kpi.choPheDuyet * 0.4), Math.round(kpi.choPheDuyet * 0.25), Math.round(kpi.choPheDuyet * 0.25), Math.max(0, kpi.choPheDuyet - Math.round(kpi.choPheDuyet * 0.9))]}
          color="#a21caf"
        />
        {/* 7.4 Tình hình xét xử GĐT/TT */}
        <GroupedBarChart title="Tình hình xét xử GĐT/TT" categories={xetXuCats} series={[{ name: "Số vụ", color: RED, values: xetXuVals }]} />
      </div>

      {/* 7.3 Cảnh báo cần xử lý ngay */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <AlertTriangle size={15} color="#dc2626" />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Cảnh báo cần xử lý ngay</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
          <thead>
            <tr style={{ background: BG }}>
              {["Mã vụ án", "Người phụ trách", "Trạng thái", "Cảnh báo"].map((h) => (
                <th key={h} style={{ padding: 8, border: `1px solid ${BORDER}`, textAlign: "left", fontWeight: 700, color: TEXT }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {canhBaoRows.map((r) => (
              <tr key={r.ma} style={{ cursor: perm.canOpenBusinessScreen ? "pointer" : "default" }} onClick={() => drill("quan-ly-vu-xet-xu", `Trích ngang: ${r.ma}`)}>
                <td style={{ padding: 8, border: `1px solid ${BORDER}`, fontWeight: 600, color: RED }}>{r.ma}</td>
                <td style={{ padding: 8, border: `1px solid ${BORDER}` }}>{r.nguoiPhuTrach}</td>
                <td style={{ padding: 8, border: `1px solid ${BORDER}` }}>{r.trangThai}</td>
                <td style={{ padding: 8, border: `1px solid ${BORDER}`, color: r.canhBao.startsWith("Quá hạn") ? "#dc2626" : "#c2410c", fontWeight: 600 }}>{r.canhBao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {/* 7.5 Theo dõi thời hạn giải quyết */}
        <GroupedBarChart title="Theo dõi thời hạn giải quyết" categories={thoiHanCats} series={[
          { name: "Quá hạn", color: "#dc2626", values: [thoiHanVals[0], 0, 0] },
          { name: "Còn < 3 tháng", color: "#f59e0b", values: [0, thoiHanVals[1], 0] },
          { name: "Còn > 3 tháng", color: "#16a34a", values: [0, 0, thoiHanVals[2]] },
        ]} />
        {/* 7.6 Án Quốc hội / Án thời hiệu <3 tháng theo loại án */}
        <GroupedBarChart title="Án Quốc hội / Còn thời hiệu < 3 tháng theo loại án" categories={loaiAnCats} series={[anQHSeries, anTHSeries]} />
      </div>

      {/* 7.7 Hiệu suất cán bộ */}
      {perm.showHieuSuatCanBo && (
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, overflowX: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>
            Hiệu suất cán bộ {perm.dataScope === "assigned-scope" ? "(phạm vi phụ trách)" : "(toàn Vụ)"}
            {perm.readOnly && <span style={{ fontSize: 11, fontWeight: 400, color: MUTED }}> — chỉ xem</span>}
          </div>
          <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Họ và tên", "Chức vụ", "Đang giải quyết", "Quá hạn", "< 3 tháng", perm.choPheDuyetLabel, "Chưa xét xử", "Đã giải quyết"].map((h) => (
                  <th key={h} style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "left", fontWeight: 700, color: TEXT }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffRows.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: MUTED, border: `1px solid ${BORDER}` }}>Trống</td></tr>
              ) : staffRows.map((r) => (
                <tr key={r.taiKhoan}>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.hoTen}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.chucVu}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.dangGiaiQuyet}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", color: r.quaHan > 0 ? "#dc2626" : TEXT }}>{r.quaHan}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.con3Thang}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.choPheDuyet}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.chuaXetXu}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.daGiaiQuyet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ fontSize: 10, color: MUTED, marginTop: 10 }}>
        Dashboard Vụ GĐ,KT — phân quyền theo 5 vai trò (Thẩm tra viên/Thư ký, Thẩm phán, Phó Vụ trưởng, Vụ trưởng, Tài khoản BCTK Vụ) × 4 Vụ (I–IV). Người dùng: {nguoiDangDangNhap.hoTen} ({profile.label}). Dữ liệu hiển thị là dữ liệu giả lập cho mục đích kiểm thử phân quyền UI; khi nối API phải kiểm tra lại quyền ở server.
      </div>

      {trichNgang && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setTrichNgang(null)}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 22, maxWidth: 420, width: "100%", fontFamily: F }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Thông tin trích ngang phục vụ báo cáo thống kê</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{trichNgang}</div>
            <div style={{ fontSize: 12, color: TEXT, marginTop: 10 }}>
              Đơn vị: {info.tenRutGon} · Khoảng thời gian: {periodLabel(khoangTG)} · Cấp xét xử: {capXX === "tat-ca" ? "Tất cả" : capXX === "gdt" ? "Giám đốc thẩm" : "Tái thẩm"}
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 10, fontStyle: "italic" }}>Tài khoản BCTK Vụ chỉ xem trích ngang, không mở màn nghiệp vụ có quyền sửa.</div>
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button onClick={() => setTrichNgang(null)} style={{ padding: "7px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isToanBoLoai(info: ReturnType<typeof getDepartmentInfo>): boolean {
  return info.loaiAnList.length > 1;
}
