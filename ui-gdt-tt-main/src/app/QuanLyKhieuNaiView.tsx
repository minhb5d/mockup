import React, { useState } from "react";
import {
  Printer,
  FileText,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import {
  F,
  RED,
  BORDER,
  TEXT,
  MUTED,
  TH_STYLE,
  TD_STYLE,
  Badge,
  CapXetXu,
  TaiKhoanPhanQuyenBar,
} from "./shared";
import { formatSoBA, isVu234, getQuanHePhapLuat, getPartyLabels } from "./AppHelpers";
import type { UserRoleType } from "./shared";
import {
  KHIEU_NAI_LIST,
  filterVuAnListByRole,
  type ChiTietTab,
  type VuAnGroup,
  QuickViewDanhSachDonModal,
} from "./QuanLyVuAnView";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import { PrintReportModal, type BieuMauIn } from "./PrintReportModal";

// SRS mục 1 "Chức năng In báo cáo" — 4 loại danh sách, mỗi loại 1 bảng tiêu chí riêng
// (22/17/13/13 tiêu chí đầy đủ theo SRS; ở đây gom các tiêu chí chính để dựng popup thật,
// thay cho nút "In biểu đồ" chỉ gọi window.print() trước đây).
const BIEU_MAU_KHIEU_NAI: BieuMauIn[] = [
  {
    id: "quan-ly-vu-khieu-nai",
    ten: "Quản lý vụ khiếu nại",
    tieuChi: [
      { key: "khoangNgay", label: "Ngày thụ lý (Từ – Đến)", type: "date-range" },
      { key: "toaRaBA", label: "Tòa ra BA/QĐ", type: "text" },
      { key: "soBA", label: "Số BA/QĐ", type: "text" },
      { key: "loaiAn", label: "Loại án", type: "select", options: ["Hình sự", "Dân sự", "Kinh doanh, thương mại", "Lao động", "Hôn nhân gia đình", "Hành chính"] },
      { key: "nguyenDon", label: "Nguyên đơn", type: "text" },
      { key: "biDon", label: "Bị đơn", type: "text" },
      { key: "trangThaiThuLy", label: "Trạng thái thụ lý", type: "select", options: ["Thụ lý mới", "Đã thụ lý"] },
      { key: "ketQuaThuLy", label: "Kết quả thụ lý", type: "select", options: ["Chưa có kết quả", "Đã có kết quả"] },
      { key: "ttv", label: "Thẩm tra viên", type: "text" },
      { key: "lanhDao", label: "Lãnh đạo phụ trách", type: "text" },
    ],
  },
  {
    id: "ds-to-trinh",
    ten: "Danh sách tờ trình",
    tieuChi: [
      { key: "khoangNgay", label: "Ngày trình lãnh đạo (Từ – Đến)", type: "date-range" },
      { key: "soToTrinh", label: "Số tờ trình", type: "text" },
      { key: "capTrinh", label: "Cấp trình", type: "text" },
      { key: "trangThaiTrinh", label: "Trạng thái trình", type: "select", options: ["Chưa có tờ trình", "Chưa trình", "Đang trình", "Đã duyệt"] },
      { key: "nguoiLap", label: "Người lập tờ trình", type: "text" },
    ],
  },
  {
    id: "quan-ly-ho-so",
    ten: "Quản lý hồ sơ",
    tieuChi: [
      { key: "khoangNgay", label: "Ngày lập phiếu (Từ – Đến)", type: "date-range" },
      { key: "loaiPhieu", label: "Loại phiếu", type: "select", options: ["Phiếu mượn", "Phiếu trả", "Phiếu chuyển", "Phiếu nhận"] },
      { key: "trangThaiHoSo", label: "Trạng thái hồ sơ", type: "select", options: ["Chưa có hồ sơ", "Đang mượn hồ sơ", "Đã có hồ sơ", "Đã trả hồ sơ"] },
      { key: "donViGiuHoSo", label: "Đơn vị giữ hồ sơ", type: "select", options: ["TAND", "VKS", "Trại giam", "Trại tạm giam", "Khác"] },
    ],
  },
  {
    id: "giai-quyet-don",
    ten: "Giải quyết đơn",
    tieuChi: [
      { key: "khoangNgay", label: "Ngày giải quyết (Từ – Đến)", type: "date-range" },
      { key: "loaiKetQua", label: "Loại kết quả", type: "select", options: ["Chấp nhận khiếu nại", "Không chấp nhận khiếu nại", "Xếp đơn"] },
      { key: "thamQuyen", label: "Kết quả xác định thẩm quyền", type: "select", options: ["Đúng thẩm quyền", "Không đúng thẩm quyền - chuyển đơn vị khác", "Đang xác minh thẩm quyền"] },
      { key: "nguoiKy", label: "Người ký ban hành", type: "text" },
    ],
  },
];

const paginBtn: React.CSSProperties = {
  padding: "4px 10px",
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontFamily: F,
  color: TEXT,
};

export type KhieuNaiTabId = "tat-ca" | "chap-nhan";

// SRS: Thời hạn giải quyết đếm ngược — Hình sự 7 ngày, Dân sự 15 ngày kể từ ngày thụ lý.
// Trả về số ngày còn lại (âm = đã quá hạn); null nếu không đọc được ngày thụ lý.
function tinhSoNgayConLai(ngayThuLy: string | undefined, soNgayHan: number): number | null {
  if (!ngayThuLy) return null;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ngayThuLy.trim());
  if (!m) return null;
  const thuLy = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const han = new Date(thuLy);
  han.setDate(han.getDate() + soNgayHan);
  const homNay = new Date();
  homNay.setHours(0, 0, 0, 0);
  han.setHours(0, 0, 0, 0);
  return Math.round((han.getTime() - homNay.getTime()) / 86400000);
}

// Tìm kiếm nhanh + Tìm kiếm nâng cao (15 trường) — khớp đúng màn "Quản lý khiếu nại" trên STG
function KhieuNaiSearchPanel() {
  const [advOpen, setAdvOpen] = useState(false);
  const inSt: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 5, padding: "6px 10px", fontSize: 12, fontFamily: F, outline: "none", background: "#fff", color: TEXT, width: "100%", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 4 };
  const col = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column" }}><label style={lbl}>{label}</label>{children}</div>
  );
  const rangeRow = (label: string) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input type="date" style={{ ...inSt, flex: 1 }} />
        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>–</span>
        <input type="date" style={{ ...inSt, flex: 1 }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0, fontFamily: F }}>
      {/* Tìm kiếm nhanh */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <input placeholder="Nhập từ khóa tìm kiếm..." style={{ ...inSt, paddingLeft: 30 }} />
          <Search size={14} color={MUTED} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
        </div>
        <button
          onClick={() => setAdvOpen((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0, fontWeight: 500 }}
        >
          {advOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Tìm kiếm nâng cao
        </button>
      </div>

      {/* Tìm kiếm nâng cao — 15 trường */}
      {advOpen && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
            {col("Tòa ra BA/QĐ", <select style={inSt}><option value="">– Tất cả –</option><option>TAND Tối cao</option><option>TAND Cấp cao HN</option><option>TAND Cấp cao TP.HCM</option></select>)}
            {col("Số BA/QĐ", <input placeholder="Nhập số BA/QĐ" style={inSt} />)}
            {rangeRow("Ngày BA/QĐ")}
            {rangeRow("Nhận đơn")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
            {rangeRow("Thụ lý")}
            {col("Trạng thái hồ sơ", <select style={inSt}><option value="">– Tất cả –</option><option>Chưa có hồ sơ</option><option>Đang mượn hồ sơ</option><option>Đã có hồ sơ</option><option>Đã trả hồ sơ</option></select>)}
            {rangeRow("Tờ trình")}
            {col("Tờ trình lãnh đạo", <select style={inSt}><option value="">– Tất cả –</option><option>Chưa trình</option><option>Đang trình</option><option>Đã duyệt</option></select>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
            {col("Ý kiến lãnh đạo", <input placeholder="Nhập ý kiến" style={inSt} />)}
            {col("Yêu cầu trình tiếp", <select style={inSt}><option value="">– Tất cả –</option><option>Có</option><option>Không</option></select>)}
            {col("Trạng thái thụ lý", <select style={inSt}><option value="">– Tất cả –</option><option>Thụ lý mới</option><option>Đã thụ lý</option></select>)}
            {col("Kết quả thụ lý", <select style={inSt}><option value="">– Tất cả –</option><option>Chưa có kết quả</option><option>Đã có kết quả</option></select>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
            {col("Kết quả giải quyết", <select style={inSt}><option value="">– Tất cả –</option><option>Chấp nhận khiếu nại</option><option>Không chấp nhận khiếu nại</option><option>Xếp đơn</option></select>)}
            {col("Thẩm tra viên giải quyết", <select style={inSt}><option value="">– Tất cả –</option><option>Nguyễn Thu Hằng</option><option>Lý Văn An</option></select>)}
            {col("Lãnh đạo phụ trách", <select style={inSt}><option value="">Vui lòng chọn</option><option>Nguyễn Văn Minh</option><option>Vũ Đình Tuấn</option></select>)}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
            <button
              onClick={() => setAdvOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0, fontWeight: 500 }}
            >
              <ChevronUp size={14} /> Thu gọn
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                <Search size={13} /> Tìm kiếm
              </button>
              <button style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuanLyKhieuNaiView({
  userRole,
  setUserRole,
  onSelectKhieuNai,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectKhieuNai: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<KhieuNaiTabId>("tat-ca");
  const [quickViewDonGroup, setQuickViewDonGroup] = useState<VuAnGroup | null>(null);
  const [showInBaoCao, setShowInBaoCao] = useState(false);

  const roleGroups = filterVuAnListByRole(KHIEU_NAI_LIST, userRole);
  const filteredGroups = roleGroups
    .map((group) => {
      if (activeTab === "tat-ca") return group;
      if (activeTab === "chap-nhan") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "chap-nhan");
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      return group;
    })
    .filter(Boolean) as VuAnGroup[];

  const countTatCa = roleGroups.length;
  const countChapNhan = roleGroups.filter((g) => g.rows.some((r) => r.kqGiaiQuyet === "chap-nhan")).length;

  const tabs: { id: KhieuNaiTabId; label: string; count: number }[] = [
    { id: "tat-ca", label: "Tất cả", count: countTatCa },
    { id: "chap-nhan", label: "Chấp nhận khiếu nại", count: countChapNhan },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        <span>Trang chủ</span> &nbsp;›&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;›&nbsp; <span>Quản lý khiếu nại</span> &nbsp;›&nbsp; <b style={{ color: TEXT }}>Danh sách</b>
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Quản lý khiếu nại
          </h1>
          {userRole && setUserRole && (
            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 16px",
                  fontSize: 13,
                  fontFamily: F,
                  fontWeight: active ? 600 : 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? RED : MUTED,
                  borderBottom: active ? `2.5px solid ${RED}` : "2.5px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}{" "}
                <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tìm kiếm nhanh + Tìm kiếm nâng cao (15 trường) — khớp STG */}
      <KhieuNaiSearchPanel />

      {/* Table Section */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
              <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.flatMap((group, groupIdx) =>
              group.rows.map((row, idx) => {
                const rowKey = `${group.id}-${row.stt}`;
                const globalIdx = groupIdx * group.rows.length + idx;
                return (
                  <tr
                    key={rowKey}
                    style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                  >
                    {/* Checkbox */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <input type="checkbox" />
                    </td>

                    {/* STT */}
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                      {globalIdx + 1}
                    </td>

                    {/* Số & Ngày thụ lý */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Số: <b>{row.soThuLy}</b>
                        </span>
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewDonGroup(group);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: 11,
                            color: "#2563eb",
                            fontFamily: F,
                            textDecoration: "underline",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                          title="Xem nhanh danh sách đơn và thông tin trình"
                        >
                          Số đơn {group.rows.length}
                        </button>
                      </div>
                    </td>

                    {/* Thông tin BA/QĐ & QHPL */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Số BA: </span>
                          <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(row.soBA, row.loaiAn)}</span>
                          {row.ngayBA && (
                            <>
                              <span style={{ color: TEXT }}> Ngày: </span>
                              <span style={{ color: "#2563eb" }}>{row.ngayBA}</span>
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                        </span>
                        {/* <CapXetXu label={row.capXetXu} /> */}
                        {row.thoiHieu && (
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Thời hiệu: </span>
                            <span style={{ color: row.thoiHieu === "Không xác định thời hiệu" || row.thoiHieu === "Không có thời hiệu giải quyết" ? "#047857" : "#c2410c", fontWeight: 600 }}>
                              {row.thoiHieu}
                            </span>
                          </span>
                        )}
                        {isVu234(userRole, row.loaiAn) && (
                          <span style={{ fontSize: 11, color: "#047857", fontFamily: F, fontWeight: 500 }}>
                            <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{getQuanHePhapLuat(row)}
                          </span>
                        )}
                        {row.thongBaoTinhThe && (
                          <span style={{ fontSize: 11, color: "#92400e", fontFamily: F }}>{row.thongBaoTinhThe}</span>
                        )}
                        {row.congVanChinh && (
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: MUTED }}>CV chính: </span>{row.congVanChinh}
                          </span>
                        )}
                        {row.yKienChiDao && (
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: MUTED }}>Ý kiến chỉ đạo: </span>{row.yKienChiDao}
                          </span>
                        )}
                        {row.congVanChuyenDon && (
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: MUTED }}>CV chuyển đơn: </span>{row.congVanChuyenDon}
                          </span>
                        )}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                          {row.anLoai === "chi-dao" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                          {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án Quốc hội</Badge>}
                          {row.anLoai === "tvtn" && <Badge color="#065f46" bg="#d1fae5">Án Người chưa thành niên</Badge>}
                          {row.anLoai === "tu-hinh" && <Badge color="#991b1b" bg="#fee2e2">Án tử hình</Badge>}
                        </div>
                      </div>
                    </td>

                    {/* Người khiếu nại & NĐĐ */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {row.ndd && (
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT, fontWeight: 600 }}>Người đứng đơn:</span>{" "}
                            <span style={{ color: TEXT }}>{row.ndd}</span>
                          </span>
                        )}
                        {row.diaChiNDD && (
                          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Địa chỉ: {row.diaChiNDD}</span>
                        )}
                      </div>
                    </td>

                    {/* Phân công */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>TTV: </span>{row.ttv}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>TP: </span>
                          {row.thamPhan || "–"}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* — Trình ký — */}
                        {row.kqgq === "chua-phan-cong"
                          ? <Badge color="#374151" bg="#f3f4f6">Chưa phân công TTV</Badge>
                          : row.kqgq === "trinh-tham-phan"
                            ? <Badge color="#0f766e" bg="#ccfbf1">Trình Thẩm phán</Badge>
                            : <Badge color="#1e40af" bg="#dbeafe">Trình Phó Chánh án</Badge>}

                        {/* — Tờ trình — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tờ trình</span>
                          {row.kqgq === "chua-phan-cong" ? (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có tờ trình</span>
                          ) : row.kqgq === "trinh-tham-phan" ? (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa trình</span>
                          ) : (
                            <>
                              <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                TT-{row.soThuLy?.replace(/\D/g, "").slice(-4) || "0000"}/2026 - {row.ngayThuLy}
                              </span>
                              <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F, textDecoration: "underline", cursor: "pointer" }}
                                onClick={() => onSelectKhieuNai(group.id, "to-trinh" as ChiTietTab)}>
                                Tờ trình giải quyết khiếu nại - {row.ngayThuLy}
                              </span>
                              <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                Trình Phó Chánh án - Chờ cho ý kiến
                              </span>
                            </>
                          )}
                        </div>

                        {/* — Thời hạn giải quyết — */}
                        {row.kqGiaiQuyet !== "da-co" && (() => {
                          const soNgayHan = row.loaiAn === "Hình sự" ? 7 : 15;
                          const conLai = tinhSoNgayConLai(row.ngayThuLy, soNgayHan);
                          if (conLai === null) return null;
                          const quaHan = conLai < 0;
                          return (
                            <div style={{ borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                              <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Thời hạn giải quyết</span>{" "}
                              <Badge color={quaHan ? "#991b1b" : conLai <= 2 ? "#92400e" : "#065f46"} bg={quaHan ? "#fee2e2" : conLai <= 2 ? "#fef3c7" : "#d1fae5"}>
                                {quaHan ? `Quá hạn ${Math.abs(conLai)} ngày` : `Còn ${conLai} ngày`}
                              </Badge>
                            </div>
                          );
                        })()}

                        {/* — Trạng thái hồ sơ — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Hồ sơ</span>
                          {row.trangThaiHoSo === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có hồ sơ</span>
                          )}
                          {row.trangThaiHoSo === "dang-muon" && (
                            <Badge color="#92400e" bg="#fef3c7">Đang mượn hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-co" && (
                            <Badge color="#065f46" bg="#d1fae5">Đã có hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-tra" && (
                            <Badge color="#1e40af" bg="#dbeafe">Đã trả hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-chuyen" && (
                            <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>
                          )}
                        </div>

                        {/* — Kết quả giải quyết khiếu nại — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kết quả giải quyết</span>
                          {row.kqGiaiQuyet === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có kết quả</span>
                          )}
                          {row.kqGiaiQuyet === "chap-nhan" && (
                            <Badge color="#065f46" bg="#d1fae5">Chấp nhận khiếu nại</Badge>
                          )}
                          {row.kqGiaiQuyet === "khong-chap-nhan" && (
                            <Badge color="#991b1b" bg="#fee2e2">Không chấp nhận khiếu nại</Badge>
                          )}
                          {row.kqGiaiQuyet === "xep-don" && (
                            <Badge color="#4b5563" bg="#f3f4f6">Xếp đơn</Badge>
                          )}
                          {/* SRS: "da-co" là TRẠNG THÁI (đã có KQGQ), không phải LOẠI kết quả —
                              trước đây bị gộp chung với "chap-nhan" và render nhầm badge kết quả. */}
                          {row.kqGiaiQuyet === "da-co" && (
                            <Badge color="#1e40af" bg="#dbeafe">Đã có kết quả giải quyết</Badge>
                          )}
                          {/* "da-co-con-don": đã có KQGQ nhưng vụ còn đơn thụ lý mới chưa xử lý —
                              đây cũng là TRẠNG THÁI, trước đây bị hiển thị nhầm thành "Không chấp nhận khiếu nại". */}
                          {row.kqGiaiQuyet === "da-co-con-don" && (
                            <Badge color="#92400e" bg="#fef3c7">Đã có KQGQ - còn đơn thụ lý mới</Badge>
                          )}
                          {row.kqgqDon && (
                            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                              KQGQ: {row.kqgqDon.loai} - {row.kqgqDon.so} - {row.kqgqDon.ngay}
                            </span>
                          )}
                        </div>


                      </div>
                    </td>

                    {/* Thao tác */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {row.kqGiaiQuyet && row.kqGiaiQuyet !== "chua-co" && (
                          <button
                            onClick={() => onSelectKhieuNai(group.id, "giai-quyet-van-ban" as ChiTietTab)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, color: "#0f766e", display: "flex", alignItems: "center" }}
                            title="Xem kết quả giải quyết"
                          >
                            <FileText size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectKhieuNai(group.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            fontSize: 18,
                            color: MUTED,
                            lineHeight: 1,
                          }}
                          title="Tùy chọn chi tiết"
                        >
                          ⋮
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.reduce((s, g) => s + g.rows.length, 0)} trong tổng {filteredGroups.reduce((s, g) => s + g.rows.length, 0)} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>

      {quickViewDonGroup && (
        <QuickViewDanhSachDonModal
          group={quickViewDonGroup}
          onClose={() => setQuickViewDonGroup(null)}
          onSelectVuAn={(id, tab) => onSelectKhieuNai(id, tab)}
          userRole={userRole}
          isKhieuNai={true}
        />
      )}
    </div>
  );
}

export default QuanLyKhieuNaiView;
