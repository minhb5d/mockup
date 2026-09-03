import React from "react";
import { Search, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { F, BORDER, TEXT, MUTED, type UserRoleType } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";

type FieldType = "input" | "select" | "date" | "dateRange";
interface FieldDef { label: string; type: FieldType; placeholder?: string; options?: string[]; }
type RowCell = FieldDef | "diaChi" | "trangThai" | null;

const NHAN_DON_ROWS: RowCell[][] = [
  [
    { label: "Người đứng đơn", type: "input", placeholder: "Người đứng đơn" },
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },
    { label: "Ngày BA/QĐ", type: "date" },
  ],
  [
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "--- Chọn ---" },
    { label: "Thời gian nhận đơn", type: "dateRange" },
    { label: "Thẩm phán", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    "diaChi",
    { label: "Chi tiết", type: "input", placeholder: "Chi tiết" },
    { label: "Số CMND", type: "input", placeholder: "Số CMND / CCCD" },
  ],
  [
    { label: "Mã đơn", type: "input", placeholder: "Mã đơn" },
    { label: "Hình thức đơn", type: "select", placeholder: "--- Tất cả ---" },
    { label: "Thời gian thụ lý", type: "dateRange" },
  ],
  [
    { label: "Số thụ lý", type: "input", placeholder: "Số thụ lý" },
    { label: "Thụ lý đơn", type: "select", placeholder: "--Tất cả--", options: ["Thụ lý mới", "Đã thụ lý"] },
    { label: "Cán bộ giải quyết đơn", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    { label: "Loại án", type: "select", placeholder: "--- Tất cả ---", options: [...LOAI_AN_OPTIONS] },
    { label: "Giao THS", type: "select", placeholder: "--Tất cả--", options: ["Đã giao THS", "Chưa giao THS"] },
    "trangThai",
  ],
  [
    { label: "Số tờ trình phân công", type: "input", placeholder: "Số tờ trình phân công" },
    { label: "Ngày tờ trình phân công", type: "date" },
    null,
  ],
];

const HSKN_ROWS: RowCell[][] = [
  [
    { label: "Mã văn thư", type: "input", placeholder: "Mã văn thư" },
    { label: "Số kháng nghị", type: "input", placeholder: "Số kháng nghị" },
    { label: "Ngày kháng nghị", type: "dateRange" },
  ],
  [
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },
    { label: "Ngày BA/QĐ", type: "date" },
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "-- Chọn --" },
  ],
  [
    { label: "Khoảng thời gian văn thư", type: "dateRange" },
    { label: "Thẩm phán", type: "select", placeholder: "-- Tất cả --" },
    { label: "TTV giải quyết", type: "select", placeholder: "-- Tất cả --" },
  ],
  [
    { label: "Loại án", type: "select", placeholder: "-- Tất cả --", options: [...LOAI_AN_OPTIONS] },
    { label: "Nơi chuyển", type: "select", placeholder: "-- Tất cả --", options: ["VKSND tối cao", "TAND cấp tỉnh", "Khác"] },
    "trangThai",
  ],
];

export function SearchFilterPanel({
  expanded,
  onToggle,
  userRole: _userRole,
  mode = "nhan-don",
}: {
  expanded: boolean;
  onToggle: () => void;
  userRole?: UserRoleType;
  mode?: "nhan-don" | "hskn";
}) {
  const [selectedLoaiAn, setSelectedLoaiAn] = React.useState<string>("");
  const rows = mode === "hskn" ? HSKN_ROWS : NHAN_DON_ROWS;
  const visibleRows = expanded ? rows : rows.slice(0, mode === "hskn" ? 1 : 2);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "6px 10px", fontSize: 12, border: `1px solid ${BORDER}`,
    borderRadius: 4, fontFamily: F, color: TEXT, outline: "none", background: "#fff", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", cursor: "pointer", color: MUTED };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 4, display: "block" };

  const renderField = ({ label, type, placeholder, options }: FieldDef) => (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>{label}</span>
      {type === "select" ? (
        <select
          style={selectStyle}
          defaultValue=""
          value={label === "Loại án" ? selectedLoaiAn : undefined}
          onChange={label === "Loại án" ? e => setSelectedLoaiAn(e.target.value) : undefined}
        >
          <option value="">{placeholder ?? "--- Tất cả ---"}</option>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "dateRange" ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="date" style={{ ...inputStyle, flex: 1 }} />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>đến</span>
          <input type="date" style={{ ...inputStyle, flex: 1 }} />
        </div>
      ) : (
        <input type={type === "date" ? "date" : "text"} placeholder={placeholder ?? label} style={inputStyle} />
      )}
    </div>
  );

  const diaChiGui = (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>Địa chỉ gửi</span>
      <div style={{ display: "flex", gap: 8 }}>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue=""><option value="">--- Tỉnh/Thành ---</option></select>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue=""><option value="">--- Quận/Huyện ---</option></select>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 16px", marginBottom: 12 }}>
        {visibleRows.flatMap((row, rowIdx) => row.map((cell, colIdx) => {
          const key = `${rowIdx}-${colIdx}`;
          if (cell === null) return <div key={key} />;
          if (cell === "diaChi") return <React.Fragment key={key}>{diaChiGui}</React.Fragment>;
          if (cell === "trangThai") return (
            <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={labelStyle}>Trạng thái</span>
              <select style={selectStyle} defaultValue="">
                <option value="">-- Tất cả --</option>
                {mode === "hskn" ? <><option>Chưa chuyển</option><option>Đã chuyển</option><option>Đã nhận</option><option>Đã trả</option></> : <><option>Chưa nhận</option><option>Đã nhận</option><option>Trả lại</option></>}
              </select>
            </div>
          );
          return <React.Fragment key={key}>{renderField(cell)}</React.Fragment>;
        }))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <button onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0, fontWeight: 500 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{expanded ? "Thu gọn" : "Mở rộng"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}><Search size={13} />Tìm kiếm</button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}><RotateCcw size={13} />Xóa bộ lọc</button>
        </div>
      </div>
    </div>
  );
}
