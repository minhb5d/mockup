import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Gavel,
  Printer,
  Scale,
  UserX,
  X,
} from "lucide-react";
import {
  BORDER,
  F,
  MUTED,
  RED,
  TEXT,
  BG,
  getDepartmentInfo,
  type UserRoleType,
  type AccountTypeId,
  type DashboardRoleType,
  getAccountTypeProfile,
  getDashboardPermission,
} from "./shared";

// ── Drill-down mở màn nghiệp vụ thật ─────────────────────────────────────────
type DashboardTarget =
  | "don-cho-phe-duyet"
  | "cho-y-kien"
  | "quan-ly-vu-an"
  | "quan-ly-vu-xet-xu"
  | "an-quoc-hoi"
  | "an-thoi-hieu"
  | "phan-cong-ttv";

type VuId = "vu-1" | "vu-2" | "vu-3" | "vu-4";
const VU_ORDER: VuId[] = ["vu-1", "vu-2", "vu-3", "vu-4"];

type KhoangThoiGian = "hom-nay" | "7-ngay" | "thang" | "quy" | "nam" | "tuy-chon";
type CapXetXu = "tat-ca" | "gdt" | "tai-tham";

const ACCOUNT_OPTIONS: { id: AccountTypeId; label: string }[] = [
  { id: "ttv-gdkt", label: "Thẩm tra viên / Thư ký giải quyết án" },
  { id: "tham-phan-gdkt", label: "Thẩm phán" },
  { id: "pho-vu-truong-gdkt", label: "Phó Vụ trưởng" },
  { id: "vu-truong-gdkt", label: "Vụ trưởng" },
  { id: "bctk-vu-gdkt", label: "Tài khoản báo cáo thống kê Vụ" },
];

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

// Số liệu demo toàn Vụ. API thật phải tính từ dữ liệu được phân quyền server-side.
const DEPT_KPI: Record<VuId, DeptKpi> = {
  "vu-1": { choPheDuyet: 12, chuaPhanCongTTV: 7, quaHan: 9, conThoiHieu3Thang: 14, dangGiaiQuyet: 58, anQuocHoi: 11, chuaXetXu: 16, daGiaiQuyetTrongKy: 33 },
  "vu-2": { choPheDuyet: 8, chuaPhanCongTTV: 4, quaHan: 5, conThoiHieu3Thang: 9, dangGiaiQuyet: 41, anQuocHoi: 7, chuaXetXu: 10, daGiaiQuyetTrongKy: 24 },
  "vu-3": { choPheDuyet: 6, chuaPhanCongTTV: 3, quaHan: 4, conThoiHieu3Thang: 6, dangGiaiQuyet: 33, anQuocHoi: 4, chuaXetXu: 8, daGiaiQuyetTrongKy: 19 },
  "vu-4": { choPheDuyet: 3, chuaPhanCongTTV: 2, quaHan: 2, conThoiHieu3Thang: 4, dangGiaiQuyet: 19, anQuocHoi: 2, chuaXetXu: 5, daGiaiQuyetTrongKy: 12 },
};

// Phó Vụ trưởng: phạm vi được giao phụ trách được mô phỏng bằng tập số liệu RIÊNG,
// không lấy % ngẫu nhiên của toàn Vụ.
const PVT_SCOPE_KPI: Record<VuId, DeptKpi> = {
  "vu-1": { choPheDuyet: 5, chuaPhanCongTTV: 3, quaHan: 4, conThoiHieu3Thang: 6, dangGiaiQuyet: 26, anQuocHoi: 5, chuaXetXu: 7, daGiaiQuyetTrongKy: 14 },
  "vu-2": { choPheDuyet: 4, chuaPhanCongTTV: 2, quaHan: 3, conThoiHieu3Thang: 5, dangGiaiQuyet: 22, anQuocHoi: 4, chuaXetXu: 6, daGiaiQuyetTrongKy: 12 },
  "vu-3": { choPheDuyet: 3, chuaPhanCongTTV: 1, quaHan: 2, conThoiHieu3Thang: 3, dangGiaiQuyet: 17, anQuocHoi: 2, chuaXetXu: 4, daGiaiQuyetTrongKy: 9 },
  "vu-4": { choPheDuyet: 2, chuaPhanCongTTV: 1, quaHan: 1, conThoiHieu3Thang: 2, dangGiaiQuyet: 11, anQuocHoi: 1, chuaXetXu: 3, daGiaiQuyetTrongKy: 6 },
};

const THAM_PHAN_KPI: Record<VuId, DeptKpi> = {
  "vu-1": { choPheDuyet: 2, chuaPhanCongTTV: 0, quaHan: 1, conThoiHieu3Thang: 2, dangGiaiQuyet: 9, anQuocHoi: 2, chuaXetXu: 4, daGiaiQuyetTrongKy: 5 },
  "vu-2": { choPheDuyet: 1, chuaPhanCongTTV: 0, quaHan: 1, conThoiHieu3Thang: 1, dangGiaiQuyet: 7, anQuocHoi: 1, chuaXetXu: 3, daGiaiQuyetTrongKy: 4 },
  "vu-3": { choPheDuyet: 1, chuaPhanCongTTV: 0, quaHan: 0, conThoiHieu3Thang: 1, dangGiaiQuyet: 6, anQuocHoi: 1, chuaXetXu: 2, daGiaiQuyetTrongKy: 3 },
  "vu-4": { choPheDuyet: 1, chuaPhanCongTTV: 0, quaHan: 0, conThoiHieu3Thang: 1, dangGiaiQuyet: 5, anQuocHoi: 0, chuaXetXu: 2, daGiaiQuyetTrongKy: 3 },
};

interface CanBoRow {
  hoTen: string;
  taiKhoan: string;
  chucVu: string;
  vu: VuId;
  dangGiaiQuyet: number;
  quaHan: number;
  con3Thang: number;
  choPheDuyet: number;
  chuaXetXu: number;
  daGiaiQuyet: number;
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

const PVT_ASSIGNED_ACCOUNTS: Record<VuId, string[]> = {
  "vu-1": ["loanbtt"],
  "vu-2": ["tungpm"],
  "vu-3": ["lycp"],
  "vu-4": ["senmh"],
};

interface DashboardIdentity {
  displayName: string;
  accountName: string;
}

const ACCOUNT_IDENTITY: Record<VuId, Record<DashboardRoleType, DashboardIdentity>> = {
  "vu-1": {
    ttv: { displayName: "Bùi Thị Thanh Loan", accountName: "TTV Vụ I" },
    "tham-phan": { displayName: "Thẩm phán được phân công", accountName: "Tài khoản Thẩm phán · Vụ I" },
    "pho-vu-truong": { displayName: "Trần Quốc Hành", accountName: "Phó Vụ trưởng · Vụ I" },
    "vu-truong": { displayName: "Nguyễn Thị Bình", accountName: "Vụ trưởng · Vụ I" },
    "bctk-vu": { displayName: "Tài khoản BCTK Vụ I", accountName: "Báo cáo thống kê · Vụ I" },
  },
  "vu-2": {
    ttv: { displayName: "Phạm Minh Tùng", accountName: "TTV Vụ II" },
    "tham-phan": { displayName: "Thẩm phán được phân công", accountName: "Tài khoản Thẩm phán · Vụ II" },
    "pho-vu-truong": { displayName: "Tài khoản Phó Vụ trưởng Vụ II", accountName: "Phó Vụ trưởng · Vụ II" },
    "vu-truong": { displayName: "Nguyễn Thị Hà", accountName: "Vụ trưởng · Vụ II" },
    "bctk-vu": { displayName: "Tài khoản BCTK Vụ II", accountName: "Báo cáo thống kê · Vụ II" },
  },
  "vu-3": {
    ttv: { displayName: "Cao Phương Ly", accountName: "TTV Vụ III" },
    "tham-phan": { displayName: "Thẩm phán được phân công", accountName: "Tài khoản Thẩm phán · Vụ III" },
    "pho-vu-truong": { displayName: "Tài khoản Phó Vụ trưởng Vụ III", accountName: "Phó Vụ trưởng · Vụ III" },
    "vu-truong": { displayName: "Tài khoản Vụ trưởng Vụ III", accountName: "Vụ trưởng · Vụ III" },
    "bctk-vu": { displayName: "Tài khoản BCTK Vụ III", accountName: "Báo cáo thống kê · Vụ III" },
  },
  "vu-4": {
    ttv: { displayName: "Mai Hương Sen", accountName: "TTV Vụ IV" },
    "tham-phan": { displayName: "Thẩm phán được phân công", accountName: "Tài khoản Thẩm phán · Vụ IV" },
    "pho-vu-truong": { displayName: "Tài khoản Phó Vụ trưởng Vụ IV", accountName: "Phó Vụ trưởng · Vụ IV" },
    "vu-truong": { displayName: "Tài khoản Vụ trưởng Vụ IV", accountName: "Vụ trưởng · Vụ IV" },
    "bctk-vu": { displayName: "Tài khoản BCTK Vụ IV", accountName: "Báo cáo thống kê · Vụ IV" },
  },
};

interface BreakdownItem {
  label: string;
  value: number;
  target: DashboardTarget;
  popupLabel: string;
}
interface BreakdownState {
  title: string;
  note: string;
  items: BreakdownItem[];
}
interface TrichNgangState {
  title: string;
  target: DashboardTarget;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("vi-VN");
}
function inputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function viDate(value: string) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? value : fmtDate(d);
}
function periodLabel(kg: KhoangThoiGian, tuNgay: string, denNgay: string): string {
  const now = new Date();
  if (kg === "hom-nay") return fmtDate(now);
  if (kg === "7-ngay") {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    return `${fmtDate(from)} → ${fmtDate(now)}`;
  }
  if (kg === "quy") return `Quý ${Math.floor(now.getMonth() / 3) + 1}/${now.getFullYear()}`;
  if (kg === "nam") return `Năm ${now.getFullYear()}`;
  if (kg === "tuy-chon") return `${viDate(tuNgay)} → ${viDate(denNgay)}`;
  return `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
}

function kpiFromStaff(row: CanBoRow): DeptKpi {
  return {
    choPheDuyet: row.choPheDuyet,
    chuaPhanCongTTV: 0,
    quaHan: row.quaHan,
    conThoiHieu3Thang: row.con3Thang,
    dangGiaiQuyet: row.dangGiaiQuyet,
    anQuocHoi: Math.max(0, Math.round(row.dangGiaiQuyet * 0.12)),
    chuaXetXu: row.chuaXetXu,
    daGiaiQuyetTrongKy: row.daGiaiQuyet,
  };
}

function KpiCard({ icon, label, value, bg, color, onClick }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 14,
        fontFamily: F,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow .15s, transform .15s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.08)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color, letterSpacing: 0.2, lineHeight: 1.3 }}>{label}</span>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, marginTop: 10 }}>{value}</div>
      {onClick && <div style={{ fontSize: 9.5, color: MUTED, marginTop: 5 }}>Bấm để xem chi tiết</div>}
    </button>
  );
}

function MiniBarChart({
  title,
  categories,
  values,
  color,
  sortDesc,
  onItemClick,
}: {
  title: string;
  categories: string[];
  values: number[];
  color: string;
  sortDesc?: boolean;
  onItemClick?: (category: string, value: number, originalIndex: number) => void;
}) {
  let items = categories.map((c, i) => ({ c, v: values[i], originalIndex: i }));
  if (sortDesc) items = [...items].sort((a, b) => b.v - a.v);
  const max = Math.max(1, ...values);
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <button
            type="button"
            key={it.c}
            onClick={() => onItemClick?.(it.c, it.v, it.originalIndex)}
            style={{ display: "flex", alignItems: "center", gap: 8, border: 0, background: "transparent", padding: 0, fontFamily: F, cursor: onItemClick ? "pointer" : "default", textAlign: "left" }}
          >
            <span style={{ fontSize: 11, color: MUTED, width: 150, flexShrink: 0, textAlign: "right" }}>{it.c}</span>
            <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 16, position: "relative" }}>
              <div style={{ width: `${Math.max(3, (it.v / max) * 100)}%`, height: "100%", background: color, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT, width: 24, textAlign: "right" }}>{it.v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GroupedBarChart({
  title,
  categories,
  series,
  onBarClick,
}: {
  title: string;
  categories: string[];
  series: { name: string; color: string; values: number[] }[];
  onBarClick?: (seriesName: string, category: string, value: number, seriesIndex: number, categoryIndex: number) => void;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
        {series.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />{s.name}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end", height: 170, borderLeft: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, paddingLeft: 8 }}>
        {categories.map((cat, ci) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, minWidth: 42 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 145 }}>
              {series.map((s, si) => (
                <button
                  type="button"
                  key={s.name}
                  title={`${s.name}: ${s.values[ci]}`}
                  onClick={() => onBarClick?.(s.name, cat, s.values[ci], si, ci)}
                  style={{ width: 16, height: `${Math.max(2, (s.values[ci] / max) * 100)}%`, background: s.color, borderRadius: "2px 2px 0 0", border: 0, padding: 0, cursor: onBarClick ? "pointer" : "default" }}
                />
              ))}
            </div>
            <span style={{ fontSize: 10, color: MUTED, textAlign: "center", maxWidth: 90 }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardVuGDKTView({
  userRole = "vu-1",
  setUserRole,
  onNavigate,
}: {
  userRole?: UserRoleType;
  setUserRole?: (r: UserRoleType) => void;
  onNavigate?: (v: DashboardTarget) => void;
}) {
  const normalizedVu: VuId = VU_ORDER.includes(userRole as VuId) ? (userRole as VuId) : "vu-1";
  const [accountType, setAccountType] = useState<AccountTypeId>("vu-truong-gdkt");
  const [khoangTG, setKhoangTG] = useState<KhoangThoiGian>("thang");
  const [capXX, setCapXX] = useState<CapXetXu>("tat-ca");
  const now = useMemo(() => new Date(), []);
  const [tuNgay, setTuNgay] = useState(() => inputDate(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [denNgay, setDenNgay] = useState(() => inputDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
  const [trichNgang, setTrichNgang] = useState<TrichNgangState | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownState | null>(null);

  // Dashboard Vụ chỉ có Vụ I–IV. Nếu trạng thái toàn cục trước đó là "toàn bộ"/alias thì chuẩn hóa về Vụ I.
  useEffect(() => {
    if (userRole !== normalizedVu) setUserRole?.(normalizedVu);
  }, [normalizedVu, setUserRole, userRole]);

  const vu = normalizedVu;
  const profile = getAccountTypeProfile(accountType);
  const perm = getDashboardPermission(profile.dashboardRole);
  const info = getDepartmentInfo(vu);
  const identity = ACCOUNT_IDENTITY[vu][profile.dashboardRole];

  const ttvRow = useMemo(() => CAN_BO_VU_GDKT.find((r) => r.vu === vu && r.chucVu === "TTV"), [vu]);

  const kpi = useMemo<DeptKpi>(() => {
    if (profile.dashboardRole === "vu-truong" || profile.dashboardRole === "bctk-vu") return DEPT_KPI[vu];
    if (profile.dashboardRole === "pho-vu-truong") return PVT_SCOPE_KPI[vu];
    if (profile.dashboardRole === "tham-phan") return THAM_PHAN_KPI[vu];
    if (ttvRow) return kpiFromStaff(ttvRow);
    return { choPheDuyet: 0, chuaPhanCongTTV: 0, quaHan: 0, conThoiHieu3Thang: 0, dangGiaiQuyet: 0, anQuocHoi: 0, chuaXetXu: 0, daGiaiQuyetTrongKy: 0 };
  }, [profile.dashboardRole, ttvRow, vu]);

  const staffRows = useMemo(() => {
    if (!perm.showHieuSuatCanBo) return [] as CanBoRow[];
    const rows = CAN_BO_VU_GDKT.filter((r) => r.vu === vu);
    if (perm.dataScope === "assigned-scope") {
      const assigned = new Set(PVT_ASSIGNED_ACCOUNTS[vu]);
      return rows.filter((r) => assigned.has(r.taiKhoan));
    }
    return rows;
  }, [perm.dataScope, perm.showHieuSuatCanBo, vu]);

  const scopeLabel =
    perm.dataScope === "department"
      ? perm.readOnly
        ? "Toàn Vụ · chỉ xem báo cáo/trích ngang"
        : "Toàn Vụ"
      : perm.dataScope === "assigned-scope"
        ? "Vụ việc/lĩnh vực được giao phụ trách"
        : perm.dataScope === "assigned"
          ? "Vụ việc được phân công"
          : "Cá nhân / hồ sơ được phân công";

  const drill = (target: DashboardTarget, popupLabel: string) => {
    if (!perm.canOpenBusinessScreen) {
      setTrichNgang({ title: popupLabel, target });
      return;
    }
    onNavigate?.(target);
  };

  const openApprovalBreakdown = () => {
    const don = Math.max(0, Math.round(kpi.choPheDuyet * 0.34));
    const yKien = Math.max(0, Math.round(kpi.choPheDuyet * 0.26));
    const toTrinh = Math.max(0, Math.round(kpi.choPheDuyet * 0.27));
    const khac = Math.max(0, kpi.choPheDuyet - don - yKien - toTrinh);
    setBreakdown({
      title: perm.choPheDuyetLabel,
      note: "Tách số tổng theo loại đầu việc để tránh đưa mọi trạng thái chờ về cùng một màn nghiệp vụ.",
      items: [
        { label: "Đơn chờ phê duyệt", value: don, target: "don-cho-phe-duyet", popupLabel: "Trích ngang: đơn chờ phê duyệt" },
        { label: "Chờ xin ý kiến", value: yKien, target: "cho-y-kien", popupLabel: "Trích ngang: chờ xin ý kiến" },
        { label: "Tờ trình / dự thảo chờ xử lý", value: toTrinh, target: "quan-ly-vu-an", popupLabel: "Trích ngang: tờ trình / dự thảo chờ xử lý" },
        { label: "Nhóm chờ khác", value: khac, target: "quan-ly-vu-an", popupLabel: "Trích ngang: nhóm chờ khác" },
      ],
    });
  };

  const openOverdueBreakdown = () => {
    const quaHanGQD = Math.max(0, Math.ceil(kpi.quaHan * 0.58));
    const quaHanXX = Math.max(0, kpi.quaHan - quaHanGQD);
    setBreakdown({
      title: "Án quá hạn",
      note: "Tách quá hạn giải quyết đơn và quá hạn xét xử trước khi drill-down.",
      items: [
        { label: "Quá hạn giải quyết đơn", value: quaHanGQD, target: "quan-ly-vu-an", popupLabel: "Trích ngang: quá hạn giải quyết đơn" },
        { label: "Quá hạn xét xử", value: quaHanXX, target: "quan-ly-vu-xet-xu", popupLabel: "Trích ngang: quá hạn xét xử" },
      ],
    });
  };

  const pipelineFull = [
    { label: "Chưa phân công TTV", value: kpi.chuaPhanCongTTV, color: "#ef4444", target: "phan-cong-ttv" as DashboardTarget },
    { label: "Đã phân công", value: Math.round(kpi.dangGiaiQuyet * 0.3), color: "#f59e0b", target: "quan-ly-vu-an" as DashboardTarget },
    { label: "Đang nghiên cứu", value: Math.round(kpi.dangGiaiQuyet * 0.35), color: "#3b82f6", target: "quan-ly-vu-an" as DashboardTarget },
    { label: "Chưa có tờ trình", value: Math.round(kpi.dangGiaiQuyet * 0.15), color: "#8b5cf6", target: "quan-ly-vu-an" as DashboardTarget },
    { label: "Đang trình / chờ ý kiến", value: kpi.choPheDuyet, color: "#ec4899", target: "cho-y-kien" as DashboardTarget },
    { label: "Đã có kết quả", value: kpi.daGiaiQuyetTrongKy, color: "#16a34a", target: "quan-ly-vu-an" as DashboardTarget },
  ];
  const pipeline = perm.showChuaPhanCongTTVAdmin ? pipelineFull : pipelineFull.filter((p) => p.label !== "Chưa phân công TTV");

  const xetXuCats = ["Quá hạn chưa xét xử", "Chưa xét xử", "Rút kháng nghị", "Chuyển thẩm quyền", "Đã xét xử"];
  const xetXuVals = [Math.round(kpi.quaHan * 0.42), kpi.chuaXetXu, Math.round(kpi.dangGiaiQuyet * 0.04), Math.round(kpi.dangGiaiQuyet * 0.03), kpi.daGiaiQuyetTrongKy];

  const thoiHanCats = ["Quá hạn", "Còn dưới 3 tháng", "Còn trên 3 tháng"];
  const thoiHanVals = [kpi.quaHan, kpi.conThoiHieu3Thang, Math.max(0, kpi.dangGiaiQuyet - kpi.quaHan - kpi.conThoiHieu3Thang)];

  const loaiAnCats = isNhieuLoaiAn(info) ? info.loaiAnList : [info.loaiAnChinh];
  const anQHSeries = { name: "Án Quốc hội", color: RED, values: loaiAnCats.map((_, i) => Math.max(0, kpi.anQuocHoi - i * 2)) };
  const anTHSeries = { name: "Còn thời hiệu < 3 tháng", color: "#f59e0b", values: loaiAnCats.map((_, i) => Math.max(0, kpi.conThoiHieu3Thang - i)) };

  const canhBaoRows = useMemo(() => {
    const baseCode = info.code;
    const assignedNames = staffRows.map((r) => r.hoTen);
    const fallback = identity.displayName;
    return [
      { ma: `${baseCode.slice(0, 3)}26-002148`, nguoiPhuTrach: assignedNames[0] || fallback, trangThai: "Chưa xét xử", canhBao: `Quá hạn ${5 + (kpi.quaHan % 10)} ngày`, target: "quan-ly-vu-xet-xu" as DashboardTarget },
      { ma: `${baseCode.slice(0, 3)}26-001937`, nguoiPhuTrach: assignedNames[1] || assignedNames[0] || fallback, trangThai: "Đang nghiên cứu", canhBao: `Còn ${20 - (kpi.conThoiHieu3Thang % 15)} ngày`, target: "quan-ly-vu-an" as DashboardTarget },
      { ma: `${baseCode.slice(0, 3)}26-002205`, nguoiPhuTrach: assignedNames[0] || fallback, trangThai: "Chờ phê duyệt", canhBao: "Quá hạn 2 ngày", target: "don-cho-phe-duyet" as DashboardTarget },
    ];
  }, [identity.displayName, info.code, kpi.conThoiHieu3Thang, kpi.quaHan, staffRows]);

  const approvalCategories = ["Chờ Vụ trưởng", "Chờ xin ý kiến", "Tờ trình/dự thảo", "Nhóm khác"];
  const approvalValues = useMemo(() => {
    const a = Math.round(kpi.choPheDuyet * 0.4);
    const b = Math.round(kpi.choPheDuyet * 0.25);
    const c = Math.round(kpi.choPheDuyet * 0.25);
    return [a, b, c, Math.max(0, kpi.choPheDuyet - a - b - c)];
  }, [kpi.choPheDuyet]);

  const trichNgangRows = useMemo(() => {
    const labels = ["Đang nghiên cứu", "Chờ phê duyệt", "Chờ ý kiến", "Chưa xét xử", "Đã có tờ trình", "Đang xử lý"];
    return Array.from({ length: 6 }, (_, i) => ({
      ma: `${info.code.slice(0, 3)}26-${String(2101 + i).padStart(6, "0")}`,
      loaiAn: info.loaiAnList[i % info.loaiAnList.length] || info.loaiAnChinh,
      trangThai: labels[i % labels.length],
      nguoiPhuTrach: staffRows[i % Math.max(1, staffRows.length)]?.hoTen || identity.displayName,
      thoiHan: i < 2 ? `Quá hạn ${i + 2} ngày` : `Còn ${8 + i * 5} ngày`,
    }));
  }, [identity.displayName, info, staffRows]);

  const soLine: React.CSSProperties = {
    padding: "8px 10px",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    fontFamily: F,
    fontSize: 12,
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
  };

  const fieldLabel: React.CSSProperties = { display: "block", fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 5 };

  return (
    <div style={{ padding: 20, background: "#f8fafc", height: "100%", overflow: "auto", fontFamily: F }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>Trang chủ / Dashboard Vụ GĐ,KT</div>

      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ margin: 0, color: TEXT, fontSize: 19 }}>Dashboard {info.tenRutGon}</h2>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>
              {identity.displayName} · {profile.label} · Phạm vi: <strong style={{ color: TEXT }}>{scopeLabel}</strong>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>Kỳ theo dõi: {periodLabel(khoangTG, tuNgay, denNgay)}</div>
          </div>
          <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: RED, color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: F, fontSize: 12, fontWeight: 600 }}>
            <Printer size={14} /> In báo cáo
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px,1.25fr) minmax(150px,.7fr) minmax(160px,.8fr) minmax(150px,.75fr)", gap: 10, marginTop: 14 }}>
          <label>
            <span style={fieldLabel}>Tài khoản phân quyền</span>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountTypeId)} style={{ ...soLine, cursor: "pointer" }}>
              {ACCOUNT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>

          <label>
            <span style={fieldLabel}>Đơn vị</span>
            <select value={vu} onChange={(e) => setUserRole?.(e.target.value as VuId)} style={{ ...soLine, cursor: "pointer" }}>
              <option value="vu-1">Vụ I · Hình sự</option>
              <option value="vu-2">Vụ II · Dân sự</option>
              <option value="vu-3">Vụ III · KDTM và lĩnh vực liên quan</option>
              <option value="vu-4">Vụ IV · Hành chính</option>
            </select>
          </label>

          <label>
            <span style={fieldLabel}>Thời gian</span>
            <select value={khoangTG} onChange={(e) => setKhoangTG(e.target.value as KhoangThoiGian)} style={{ ...soLine, cursor: "pointer" }}>
              <option value="hom-nay">Hôm nay</option>
              <option value="7-ngay">7 ngày gần đây</option>
              <option value="thang">Tháng hiện tại</option>
              <option value="quy">Quý hiện tại</option>
              <option value="nam">Năm hiện tại</option>
              <option value="tuy-chon">Tùy chọn</option>
            </select>
          </label>

          <label>
            <span style={fieldLabel}>Cấp xét xử</span>
            <select value={capXX} onChange={(e) => setCapXX(e.target.value as CapXetXu)} style={{ ...soLine, cursor: "pointer" }}>
              <option value="tat-ca">Tất cả</option>
              <option value="gdt">Giám đốc thẩm</option>
              <option value="tai-tham">Tái thẩm</option>
            </select>
          </label>
        </div>

        {khoangTG === "tuy-chon" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(160px,220px) minmax(160px,220px)", gap: 10, marginTop: 10 }}>
            <label>
              <span style={fieldLabel}>Từ ngày</span>
              <input type="date" value={tuNgay} max={denNgay || undefined} onChange={(e) => setTuNgay(e.target.value)} style={soLine} />
            </label>
            <label>
              <span style={fieldLabel}>Đến ngày</span>
              <input type="date" value={denNgay} min={tuNgay || undefined} onChange={(e) => setDenNgay(e.target.value)} style={soLine} />
            </label>
          </div>
        )}
      </div>

      {perm.readOnly && (
        <div style={{ marginBottom: 12, padding: "8px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 12, color: "#1d4ed8", fontFamily: F }}>
          Tài khoản báo cáo thống kê: xem số liệu toàn Vụ và thông tin trích ngang; không mở màn nghiệp vụ có quyền sửa/phê duyệt.
        </div>
      )}
      {perm.dataScope === "assigned-scope" && (
        <div style={{ marginBottom: 12, padding: "8px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 6, fontSize: 12, color: "#9a3412", fontFamily: F }}>
          Phó Vụ trưởng đang xem đúng tập vụ việc/lĩnh vực được giao phụ trách trong mockup; số liệu không còn được tạo bằng cách lấy phần trăm toàn Vụ.
        </div>
      )}

      {/* 8 KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 12 }}>
        <KpiCard icon={<ClipboardList size={13} color="#fff" />} label={perm.choPheDuyetLabel.toUpperCase()} value={kpi.choPheDuyet} bg="#fdf4ff" color="#a21caf" onClick={openApprovalBreakdown} />
        {perm.showChuaPhanCongTTVAdmin ? (
          <KpiCard icon={<UserX size={13} color="#fff" />} label="CHƯA PHÂN CÔNG TTV" value={kpi.chuaPhanCongTTV} bg="#fef2f2" color={RED} onClick={() => drill("phan-cong-ttv", "Trích ngang: hồ sơ chưa phân công TTV")} />
        ) : (
          <KpiCard icon={<ClipboardList size={13} color="#fff" />} label="ĐANG NGHIÊN CỨU" value={Math.round(kpi.dangGiaiQuyet * 0.35)} bg="#eff6ff" color="#1d4ed8" onClick={() => drill("quan-ly-vu-an", "Trích ngang: hồ sơ đang nghiên cứu")} />
        )}
        <KpiCard icon={<AlertTriangle size={13} color="#fff" />} label="ÁN QUÁ HẠN" value={kpi.quaHan} bg="#fff1f2" color="#e11d48" onClick={openOverdueBreakdown} />
        <KpiCard icon={<Clock size={13} color="#fff" />} label="CÒN THỜI HIỆU < 3 THÁNG" value={kpi.conThoiHieu3Thang} bg="#fff7ed" color="#c2410c" onClick={() => drill("an-thoi-hieu", "Trích ngang: còn thời hiệu < 3 tháng")} />
        <KpiCard icon={<FileWarning size={13} color="#fff" />} label="VỤ ÁN ĐANG GIẢI QUYẾT" value={kpi.dangGiaiQuyet} bg="#f0fdf4" color="#16a34a" onClick={() => drill("quan-ly-vu-an", "Trích ngang: vụ án đang giải quyết")} />
        <KpiCard icon={<Gavel size={13} color="#fff" />} label="ÁN QUỐC HỘI" value={kpi.anQuocHoi} bg="#f5f3ff" color="#7c3aed" onClick={() => drill("an-quoc-hoi", "Trích ngang: án Quốc hội")} />
        <KpiCard icon={<Scale size={13} color="#fff" />} label="CHƯA XÉT XỬ" value={kpi.chuaXetXu} bg="#ecfeff" color="#0e7490" onClick={() => drill("quan-ly-vu-xet-xu", "Trích ngang: chưa xét xử")} />
        <KpiCard icon={<CheckCircle2 size={13} color="#fff" />} label="ĐÃ GIẢI QUYẾT TRONG KỲ" value={kpi.daGiaiQuyetTrongKy} bg="#f7fee7" color="#4d7c0f" onClick={() => drill("quan-ly-vu-an", "Trích ngang: đã giải quyết trong kỳ")} />
      </div>

      {/* Tiến độ */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Tiến độ giải quyết vụ án</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pipeline.map((p, i) => (
            <button
              type="button"
              key={p.label}
              onClick={() => p.label === "Đang trình / chờ ý kiến" ? openApprovalBreakdown() : drill(p.target, `Trích ngang: ${p.label}`)}
              style={{ flex: "1 1 140px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 7, padding: 9, cursor: "pointer", fontFamily: F, textAlign: "left" }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10.5, color: MUTED }}>{i + 1}. {p.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{p.value}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <MiniBarChart
          title={`${perm.choPheDuyetLabel} — phân bố theo cấp/trạng thái chờ`}
          categories={approvalCategories}
          values={approvalValues}
          color="#a21caf"
          onItemClick={(_, __, index) => {
            if (index === 0) drill("don-cho-phe-duyet", "Trích ngang: chờ Vụ trưởng");
            else if (index === 1) drill("cho-y-kien", "Trích ngang: chờ xin ý kiến");
            else drill("quan-ly-vu-an", "Trích ngang: tờ trình / dự thảo đang chờ");
          }}
        />
        <GroupedBarChart
          title="Tình hình xét xử GĐT/TT"
          categories={xetXuCats}
          series={[{ name: "Số vụ", color: RED, values: xetXuVals }]}
          onBarClick={(_, category) => drill("quan-ly-vu-xet-xu", `Trích ngang: ${category}`)}
        />
      </div>

      {/* Cảnh báo */}
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
              <tr key={r.ma} style={{ cursor: "pointer" }} onClick={() => drill(r.target, `Trích ngang: ${r.ma}`)}>
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
        <GroupedBarChart
          title="Theo dõi thời hạn giải quyết"
          categories={thoiHanCats}
          series={[
            { name: "Quá hạn", color: "#dc2626", values: [thoiHanVals[0], 0, 0] },
            { name: "Còn < 3 tháng", color: "#f59e0b", values: [0, thoiHanVals[1], 0] },
            { name: "Còn > 3 tháng", color: "#16a34a", values: [0, 0, thoiHanVals[2]] },
          ]}
          onBarClick={(seriesName, category, value) => {
            if (value <= 0) return;
            if (seriesName === "Quá hạn" || category === "Quá hạn") openOverdueBreakdown();
            else if (seriesName.includes("< 3") || category.includes("dưới 3")) drill("an-thoi-hieu", "Trích ngang: còn thời hiệu < 3 tháng");
            else drill("quan-ly-vu-an", "Trích ngang: còn thời hiệu > 3 tháng");
          }}
        />
        <GroupedBarChart
          title="Án Quốc hội / Còn thời hiệu < 3 tháng theo loại án"
          categories={loaiAnCats}
          series={[anQHSeries, anTHSeries]}
          onBarClick={(seriesName, category, value) => {
            if (value <= 0) return;
            if (seriesName === "Án Quốc hội") drill("an-quoc-hoi", `Trích ngang: Án Quốc hội · ${category}`);
            else drill("an-thoi-hieu", `Trích ngang: Còn thời hiệu < 3 tháng · ${category}`);
          }}
        />
      </div>

      {perm.showHieuSuatCanBo && (
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, overflowX: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
            Hiệu suất cán bộ {perm.dataScope === "assigned-scope" ? "(phạm vi phụ trách)" : "(toàn Vụ)"}
            {perm.readOnly && <span style={{ fontSize: 11, fontWeight: 400, color: MUTED }}> — chỉ xem</span>}
          </div>
          {perm.dataScope === "assigned-scope" && (
            <div style={{ fontSize: 10.5, color: MUTED, marginBottom: 10 }}>Chỉ hiển thị cán bộ nằm trong tập phân công phụ trách mẫu của Phó Vụ trưởng.</div>
          )}
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
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: MUTED, border: `1px solid ${BORDER}` }}>Không có dữ liệu trong phạm vi đang chọn</td></tr>
              ) : staffRows.map((r) => (
                <tr key={r.taiKhoan}>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.hoTen}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}` }}>{r.chucVu}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", cursor: "pointer" }} onClick={() => drill("quan-ly-vu-an", `Trích ngang: ${r.hoTen} · đang giải quyết`)}>{r.dangGiaiQuyet}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", color: r.quaHan > 0 ? "#dc2626" : TEXT, cursor: "pointer" }} onClick={() => drill("quan-ly-vu-an", `Trích ngang: ${r.hoTen} · quá hạn`)}>{r.quaHan}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", cursor: "pointer" }} onClick={() => drill("an-thoi-hieu", `Trích ngang: ${r.hoTen} · còn < 3 tháng`)}>{r.con3Thang}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", cursor: "pointer" }} onClick={openApprovalBreakdown}>{r.choPheDuyet}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", cursor: "pointer" }} onClick={() => drill("quan-ly-vu-xet-xu", `Trích ngang: ${r.hoTen} · chưa xét xử`)}>{r.chuaXetXu}</td>
                  <td style={{ padding: 9, border: `1px solid ${BORDER}`, textAlign: "center", cursor: "pointer" }} onClick={() => drill("quan-ly-vu-an", `Trích ngang: ${r.hoTen} · đã giải quyết`)}>{r.daGiaiQuyet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ fontSize: 10, color: MUTED, marginTop: 10, lineHeight: 1.5 }}>
        Dashboard Vụ GĐ,KT — mockup kiểm thử 5 nhóm quyền × 4 Vụ. Tài khoản mô phỏng: {identity.accountName}. Dữ liệu là dữ liệu demo; quyền thật phải được kiểm tra lại ở API/server khi triển khai.
      </div>

      {breakdown && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setBreakdown(null)}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, width: "min(520px,100%)", boxShadow: "0 18px 50px rgba(0,0,0,.2)", fontFamily: F }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{breakdown.title}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.45 }}>{breakdown.note}</div>
              </div>
              <button onClick={() => setBreakdown(null)} style={{ border: 0, background: "transparent", cursor: "pointer", padding: 2 }}><X size={18} color={MUTED} /></button>
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
              {breakdown.items.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setBreakdown(null);
                    drill(item.target, item.popupLabel);
                  }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 7, background: "#fff", cursor: "pointer", fontFamily: F, textAlign: "left" }}
                >
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{item.label}</span>
                  <strong style={{ fontSize: 14, color: RED }}>{item.value}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {trichNgang && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setTrichNgang(null)}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, maxWidth: 880, width: "100%", fontFamily: F, boxShadow: "0 18px 50px rgba(0,0,0,.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>Thông tin trích ngang phục vụ báo cáo thống kê</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{trichNgang.title}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
                  {info.tenRutGon} · {periodLabel(khoangTG, tuNgay, denNgay)} · {capXX === "tat-ca" ? "Tất cả cấp xét xử" : capXX === "gdt" ? "Giám đốc thẩm" : "Tái thẩm"}
                </div>
              </div>
              <button onClick={() => setTrichNgang(null)} style={{ border: 0, background: "transparent", cursor: "pointer", padding: 2 }}><X size={18} color={MUTED} /></button>
            </div>

            <div style={{ marginTop: 14, overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 7 }}>
              <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: BG }}>
                    {["Mã vụ việc", "Loại án", "Trạng thái", "Người phụ trách", "Tình trạng thời hạn"].map((h) => (
                      <th key={h} style={{ padding: 9, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, textAlign: "left", fontWeight: 700, color: TEXT }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trichNgangRows.map((r) => (
                    <tr key={r.ma}>
                      <td style={{ padding: 9, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontWeight: 700, color: "#2563eb" }}>{r.ma}</td>
                      <td style={{ padding: 9, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{r.loaiAn}</td>
                      <td style={{ padding: 9, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{r.trangThai}</td>
                      <td style={{ padding: 9, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{r.nguoiPhuTrach}</td>
                      <td style={{ padding: 9, borderBottom: `1px solid ${BORDER}`, color: r.thoiHan.startsWith("Quá hạn") ? "#dc2626" : "#c2410c", fontWeight: 600 }}>{r.thoiHan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 10, fontStyle: "italic" }}>Bảng này chỉ đọc; không có thao tác sửa/phê duyệt và không điều hướng sang màn nghiệp vụ.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function isNhieuLoaiAn(info: ReturnType<typeof getDepartmentInfo>): boolean {
  return info.loaiAnList.length > 1;
}
