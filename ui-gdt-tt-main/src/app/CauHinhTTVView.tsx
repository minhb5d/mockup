import React, { useState } from "react";
import { Search, Save } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";


const paginBtn: React.CSSProperties = {
  padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
  background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
};

// ── Giao tiểu hồ sơ view ─────────────────────────────────────────────────────

const CAU_HINH_DATA = [
  { id: 1, hoTen: "Bùi Nguyễn Khánh (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Tiến Mạnh - Phó Vụ trưởng" },
  { id: 2, hoTen: "Bùi Quang Huy (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 3, hoTen: "Bùi Thị Vân Anh (TP)", chucDanh: "Thẩm phán bậc 1", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 4, hoTen: "Bùi Việt Anh (TP)", chucDanh: "Thẩm phán bậc 2", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 5, hoTen: "Chi Thị Đức (TK)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 6, hoTen: "Chu Thị Thoam (TP)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 7, hoTen: "Chị Thị Nhụng (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 8, hoTen: "Dương Thảo Phương (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "" },
  { id: 9, hoTen: "Giáng Tiêu Thọ (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
  { id: 10, hoTen: "Hoàng Ngô An (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 11, hoTen: "Hoàng Ngọc Điệu (TTV)", chucDanh: "Thẩm tra viên chính", nghiepVu: "Giải quyết án", lanhDao: "Trần Quốc Hành - Phó Vụ trưởng" },
  { id: 12, hoTen: "Hoàng Thanh Thủy (TK)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 13, hoTen: "Hoàng Thị Nhã Phương (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 14, hoTen: "Lê Thanh Tùng (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
];

const CHUC_DANH_OPTIONS = ["Thư ký Tòa án", "Thẩm phán bậc 1", "Thẩm phán bậc 2", "Thẩm tra viên", "Thẩm tra viên chính", "Thẩm tra viên cao cấp"];
const NGHIEP_VU_OPTIONS = ["Giải quyết án", "Xử lý nghiệp vụ"];
const LANH_DAO_OPTIONS = [
  "Nguyễn Tiến Mạnh - Phó Vụ trưởng",
  "Nguyễn Văn Hiền - Phó Vụ trưởng",
  "Trần Quốc Hành - Phó Vụ trưởng",
];

function CauHinhTTVView() {
  const [showBanner, setShowBanner] = useState(false);
  const [rows, setRows] = useState(CAU_HINH_DATA.map((r) => ({ ...r })));

  const selSt: React.CSSProperties = {
    width: "100%", padding: "5px 6px", fontSize: 11,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, outline: "none", background: "#fff", cursor: "pointer",
  };

  const update = (id: number, key: keyof typeof CAU_HINH_DATA[0], val: string) =>
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [key]: val } : r));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Cấu hình TTV báo cáo
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Lãnh đạo</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Thẩm tra viên</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {CAU_HINH_DATA.map((r) => <option key={r.id}>{r.hoTen}</option>)}
            </select>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
        </div>
      </div>

      {/* Banner + Lưu cấu hình */}
      <div style={{ padding: "8px 20px", background: BG, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        {showBanner && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 6, fontSize: 12, color: "#166534", fontFamily: F, fontWeight: 500 }}>
            <span style={{ fontSize: 16 }}>✓</span>
            Cập nhật dữ liệu thành công!
            <button onClick={() => setShowBanner(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#166534", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}
        {!showBanner && <div style={{ flex: 1 }} />}
        <button
          onClick={() => setShowBanner(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, flexShrink: 0 }}
        >
          <Save size={13} /> Lưu cấu hình
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>Họ và tên</th>
              <th style={TH_STYLE}>Chức danh</th>
              <th style={TH_STYLE}>Nghiệp vụ Thẩm tra viên</th>
              <th style={TH_STYLE}>Lãnh đạo</th>
              <th style={TH_STYLE}>Người thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, fontWeight: 500 }}>{r.hoTen}</td>
                <td style={TD_STYLE}>
                  <select value={r.chucDanh} onChange={(e) => update(r.id, "chucDanh", e.target.value)} style={selSt}>
                    {CHUC_DANH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.nghiepVu} onChange={(e) => update(r.id, "nghiepVu", e.target.value)} style={selSt}>
                    {NGHIEP_VU_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.lanhDao} onChange={(e) => update(r.id, "lanhDao", e.target.value)} style={selSt}>
                    <option value="">-- Chọn lãnh đạo --</option>
                    {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Nguyễn Văn A</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>11/06/2026</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{rows.length} trong tổng {rows.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}


export default CauHinhTTVView;
