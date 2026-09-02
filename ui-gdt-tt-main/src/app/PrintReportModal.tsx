import React, { useState } from "react";
import { X, Printer } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG } from "./shared";

// ─────────────────────────────────────────────────────────────────────────────
// In báo cáo (dùng chung cho toàn hệ thống GĐ,KT)
// THIẾU [Cao] — SRS "In báo cáo": chọn biểu mẫu + hộp tiêu chí in + tiêu đề BC tự sinh
// ─────────────────────────────────────────────────────────────────────────────

export type TieuChiIn = {
  key: string;
  label: string;
  type: "text" | "date" | "date-range" | "select";
  options?: string[];
};

export type BieuMauIn = {
  id: string;
  ten: string;
  moTa?: string;
  tieuChi: TieuChiIn[];
};

const inpSt: React.CSSProperties = {
  width: "100%",
  padding: "6px 9px",
  fontSize: 12,
  fontFamily: F,
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  outline: "none",
  boxSizing: "border-box" as const,
  background: "#fff",
};

const lblSt: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: MUTED,
  marginBottom: 4,
  fontFamily: F,
};

/** Tiêu đề báo cáo tự sinh theo biểu mẫu + khoảng thời gian đã chọn (SRS). */
export function sinhTieuDeBaoCao(bieuMau: BieuMauIn | undefined, giaTri: Record<string, string>): string {
  if (!bieuMau) return "";
  const tu = giaTri["tuNgay"];
  const den = giaTri["denNgay"];
  const fmt = (d?: string) => {
    if (!d) return "";
    const [y, m, dd] = d.split("-");
    return y && m && dd ? `${dd}/${m}/${y}` : d;
  };
  if (tu && den) return `${bieuMau.ten} từ ngày ${fmt(tu)} đến ngày ${fmt(den)}`;
  if (tu) return `${bieuMau.ten} từ ngày ${fmt(tu)}`;
  if (den) return `${bieuMau.ten} đến ngày ${fmt(den)}`;
  return bieuMau.ten;
}

export function PrintReportModal({
  onClose,
  bieuMauList,
  tieuDeMan = "In báo cáo",
}: {
  onClose: () => void;
  bieuMauList: BieuMauIn[];
  tieuDeMan?: string;
}) {
  const [bieuMauId, setBieuMauId] = useState(bieuMauList[0]?.id ?? "");
  const [giaTri, setGiaTri] = useState<Record<string, string>>({});
  const [loi, setLoi] = useState("");

  const bieuMau = bieuMauList.find(b => b.id === bieuMauId);
  const tieuDe = sinhTieuDeBaoCao(bieuMau, giaTri);

  const set = (k: string, v: string) => {
    setGiaTri(p => ({ ...p, [k]: v }));
    setLoi("");
  };

  const handleIn = () => {
    if (!bieuMau) {
      setLoi("Phải chọn biểu mẫu báo cáo.");
      return;
    }
    setLoi("");
    alert(`Đang kết xuất báo cáo:\n${tieuDe}`);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 6, width: 620, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 34px rgba(0,0,0,0.22)" }}>
        {/* Header */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F }}>{tieuDeMan}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex" }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Chọn biểu mẫu */}
          <div>
            <label style={lblSt}><span style={{ color: RED }}>*</span> Biểu mẫu báo cáo</label>
            <select value={bieuMauId} onChange={e => { setBieuMauId(e.target.value); setGiaTri({}); setLoi(""); }} style={{ ...inpSt, cursor: "pointer" }}>
              {bieuMauList.map(b => (
                <option key={b.id} value={b.id}>{b.ten}</option>
              ))}
            </select>
            {bieuMau?.moTa && (
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{bieuMau.moTa}</div>
            )}
          </div>

          {/* Hộp tiêu chí in */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: BG, borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: TEXT, textTransform: "uppercase" as const }}>
              Tiêu chí in
            </div>
            <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px" }}>
              {(bieuMau?.tieuChi ?? []).map(tc => (
                <div key={tc.key} style={tc.type === "date-range" ? { gridColumn: "1 / -1" } : undefined}>
                  <label style={lblSt}>{tc.label}</label>
                  {tc.type === "date-range" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="date" value={giaTri["tuNgay"] ?? ""} onChange={e => set("tuNgay", e.target.value)} style={inpSt} />
                      <span style={{ fontSize: 12, color: MUTED }}>–</span>
                      <input type="date" value={giaTri["denNgay"] ?? ""} onChange={e => set("denNgay", e.target.value)} style={inpSt} />
                    </div>
                  ) : tc.type === "select" ? (
                    <select value={giaTri[tc.key] ?? ""} onChange={e => set(tc.key, e.target.value)} style={{ ...inpSt, cursor: "pointer" }}>
                      <option value="">– Tất cả –</option>
                      {(tc.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={tc.type === "date" ? "date" : "text"}
                      value={giaTri[tc.key] ?? ""}
                      onChange={e => set(tc.key, e.target.value)}
                      style={inpSt}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tiêu đề báo cáo tự sinh */}
          <div>
            <label style={lblSt}>Tiêu đề báo cáo (tự sinh)</label>
            <div style={{ padding: "8px 10px", background: "#f9fafb", border: `1px dashed ${BORDER}`, borderRadius: 4, fontSize: 12, color: TEXT, fontFamily: F, minHeight: 20 }}>
              {tieuDe || "—"}
            </div>
          </div>

          {loi && (
            <div style={{ padding: "8px 10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, fontSize: 12, color: "#991b1b" }}>⚠ {loi}</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "7px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          <button onClick={handleIn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Printer size={13} /> In báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}

/** Biểu mẫu in của màn Quản lý vụ xét xử GĐT/TT (SRS). */
export const BIEU_MAU_VU_XET_XU: BieuMauIn[] = [
  {
    id: "bm-vu-xet-xu",
    ten: "Biểu mẫu vụ xét xử GĐT,TT",
    moTa: "Danh sách các vụ án đưa ra xét xử theo thủ tục giám đốc thẩm, tái thẩm.",
    tieuChi: [
      { key: "khoangNgay", label: "Từ ngày – Đến ngày", type: "date-range" },
      { key: "loaiAn", label: "Loại án", type: "select", options: ["Hình sự", "Dân sự", "Kinh doanh, thương mại", "Lao động", "Hôn nhân gia đình", "Hành chính"] },
      { key: "trangThaiXX", label: "Trạng thái xét xử", type: "select", options: ["Chưa có danh sách xét xử", "Đã có danh sách xét xử", "Đã xét xử"] },
      { key: "thamQuyen", label: "Thẩm quyền xét xử", type: "select", options: ["Ủy ban Thẩm phán TAND cấp cao", "Hội đồng Thẩm phán TAND tối cao"] },
      { key: "donVi", label: "Đơn vị", type: "text" },
      { key: "thamPhan", label: "Thẩm phán", type: "text" },
    ],
  },
  {
    id: "bm-rut-khang-nghi",
    ten: "Biểu mẫu vụ rút kháng nghị",
    moTa: "Danh sách các vụ án có quyết định rút kháng nghị.",
    tieuChi: [
      { key: "khoangNgay", label: "Từ ngày – Đến ngày", type: "date-range" },
      { key: "loaiAn", label: "Loại án", type: "select", options: ["Hình sự", "Dân sự", "Kinh doanh, thương mại", "Lao động", "Hôn nhân gia đình", "Hành chính"] },
      { key: "nguoiKhangNghi", label: "Người kháng nghị", type: "select", options: ["Chánh án Tòa án nhân dân tối cao", "Viện trưởng Viện kiểm sát nhân dân tối cao"] },
      { key: "soKhangNghi", label: "Số kháng nghị", type: "text" },
    ],
  },
];
