import React, { useState } from "react";
import { Search, RotateCcw, Eye } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";

type DSTMTrangThai = "cho-ky-duyet" | "da-duyet";
type DSTMTab = "tat-ca" | "cho-ky-duyet" | "da-duyet";

interface DSTMRow {
  id: number;
  so?: string;
  ngayLap?: string;
  loaiHoiDong: "Hội đồng 5" | "Hội đồng toàn thể";
  chuToa: string;
  thanhPhan: string[];
  thamPhanChuToa: string;
  trangThai: DSTMTrangThai;
}

const DSTM_ROWS: DSTMRow[] = [
  { id: 1, loaiHoiDong: "Hội đồng 5", chuToa: "Nguyễn Văn Quảng", thanhPhan: ["Nguyễn Văn Quảng"], thamPhanChuToa: "Nguyễn Văn Quảng", trangThai: "da-duyet" },
  { id: 2, so: "857", ngayLap: "28/08/2026", loaiHoiDong: "Hội đồng 5", chuToa: "Lê Thị Thu Hiền", thanhPhan: ["Lê Thị Thu Hiền", "Nguyễn Biên Thùy", "Nguyễn Hải Trâm", "Trần Kiến Xương", "Phạm Thị Bích Ngọc"], thamPhanChuToa: "Lê Thị Thu Hiền", trangThai: "da-duyet" },
  { id: 3, so: "837", ngayLap: "27/08/2026", loaiHoiDong: "Hội đồng 5", chuToa: "Phạm Thị Bích Ngọc", thanhPhan: ["Phạm Thị Bích Ngọc", "Nguyễn Như Thắng", "Lê Thị Thu Hiền", "Nguyễn Thị Thu", "Cao Văn Mạnh"], thamPhanChuToa: "Phạm Thị Bích Ngọc", trangThai: "da-duyet" },
  { id: 4, so: "799", ngayLap: "25/08/2026", loaiHoiDong: "Hội đồng 5", chuToa: "Phạm Thị Bích Ngọc", thanhPhan: ["Phạm Thị Bích Ngọc", "Nguyễn Biên Thùy"], thamPhanChuToa: "Phạm Thị Bích Ngọc", trangThai: "da-duyet" },
  { id: 5, so: "852", ngayLap: "28/08/2026", loaiHoiDong: "Hội đồng toàn thể", chuToa: "Nguyễn Như Thắng", thanhPhan: [], thamPhanChuToa: "Nguyễn Như Thắng", trangThai: "cho-ky-duyet" },
  { id: 6, so: "849", ngayLap: "28/08/2026", loaiHoiDong: "Hội đồng toàn thể", chuToa: "Nguyễn Như Thắng", thanhPhan: [], thamPhanChuToa: "Nguyễn Như Thắng", trangThai: "cho-ky-duyet" },
  { id: 7, so: "812", ngayLap: "26/08/2026", loaiHoiDong: "Hội đồng 5", chuToa: "Nguyễn Như Thắng", thanhPhan: ["Nguyễn Như Thắng"], thamPhanChuToa: "Nguyễn Như Thắng", trangThai: "cho-ky-duyet" },
  { id: 8, loaiHoiDong: "Hội đồng 5", chuToa: "Nguyễn Như Thắng", thanhPhan: ["Nguyễn Như Thắng"], thamPhanChuToa: "Nguyễn Như Thắng", trangThai: "cho-ky-duyet" },
];

const DSTM_THAM_PHAN_OPTIONS = Array.from(new Set(DSTM_ROWS.map(r => r.chuToa)));

export default function DanhSachThamMuuXetXuView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<DSTMTab>("tat-ca");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [fSoDanhSach, setFSoDanhSach] = useState("");
  const [fTuNgay, setFTuNgay] = useState("");
  const [fDenNgay, setFDenNgay] = useState("");
  const [fThamPhan, setFThamPhan] = useState("");
  const [fThamPhanChuToa, setFThamPhanChuToa] = useState("");
  const [applied, setApplied] = useState({ soDanhSach: "", tuNgay: "", denNgay: "", thamPhan: "", thamPhanChuToa: "" });

  const countTatCa = DSTM_ROWS.length;
  const countChoKy = DSTM_ROWS.filter(r => r.trangThai === "cho-ky-duyet").length;
  const countDaDuyet = DSTM_ROWS.filter(r => r.trangThai === "da-duyet").length;

  const tabRows = DSTM_ROWS.filter(r => tab === "tat-ca" || (tab === "cho-ky-duyet" ? r.trangThai === "cho-ky-duyet" : r.trangThai === "da-duyet"));

  const visibleRows = tabRows.filter(r =>
    (!applied.soDanhSach || (r.so || "").includes(applied.soDanhSach)) &&
    (!applied.thamPhan || r.thanhPhan.includes(applied.thamPhan) || r.chuToa === applied.thamPhan) &&
    (!applied.thamPhanChuToa || r.thamPhanChuToa === applied.thamPhanChuToa)
  );

  const timKiem = () => setApplied({ soDanhSach: fSoDanhSach, tuNgay: fTuNgay, denNgay: fDenNgay, thamPhan: fThamPhan, thamPhanChuToa: fThamPhanChuToa });
  const xoaBoLoc = () => {
    setFSoDanhSach(""); setFTuNgay(""); setFDenNgay(""); setFThamPhan(""); setFThamPhanChuToa("");
    setApplied({ soDanhSach: "", tuNgay: "", denNgay: "", thamPhan: "", thamPhanChuToa: "" });
  };

  const toggleAll = (checked: boolean) => setSelectedIds(checked ? visibleRows.map(r => r.id) : []);
  const toggleOne = (id: number, checked: boolean) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));

  const tabBtnSt = (active: boolean): React.CSSProperties => ({
    padding: "9px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400,
    background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED,
    borderBottom: active ? `2.5px solid ${RED}` : "2.5px solid transparent", marginBottom: -1, whiteSpace: "nowrap",
  });
  const selSt: React.CSSProperties = { padding: "6px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f9fafb", fontFamily: F }}>
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        <span>Trang chủ</span> &nbsp;›&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;›&nbsp; <span onClick={onBack} style={{ cursor: "pointer" }}>Quản lý xét xử GĐT</span> &nbsp;›&nbsp; <b style={{ color: TEXT }}>Xem danh sách hội đồng xét xử</b>
      </div>

      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT, fontSize: 16, padding: 0 }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách tham mưu vụ xét xử GĐT</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={tabBtnSt(tab === "tat-ca")} onClick={() => setTab("tat-ca")}>
            Tất cả <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: tab === "tat-ca" ? RED : "#e5e7eb", color: tab === "tat-ca" ? "#fff" : MUTED, fontWeight: 600 }}>{countTatCa}</span>
          </button>
          <button style={tabBtnSt(tab === "cho-ky-duyet")} onClick={() => setTab("cho-ky-duyet")}>
            Chờ ký duyệt <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: tab === "cho-ky-duyet" ? RED : "#e5e7eb", color: tab === "cho-ky-duyet" ? "#fff" : MUTED, fontWeight: 600 }}>{countChoKy}</span>
          </button>
          <button style={tabBtnSt(tab === "da-duyet")} onClick={() => setTab("da-duyet")}>
            Đã ký duyệt <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: tab === "da-duyet" ? RED : "#e5e7eb", color: tab === "da-duyet" ? "#fff" : MUTED, fontWeight: 600 }}>{countDaDuyet}</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Số danh sách</span>
            <input value={fSoDanhSach} onChange={e => setFSoDanhSach(e.target.value)} placeholder="Nhập số danh sách" style={selSt} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Ngày lập danh sách</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input type="date" value={fTuNgay} onChange={e => setFTuNgay(e.target.value)} style={{ ...selSt, flex: 1 }} />
              <span style={{ color: MUTED, fontSize: 11 }}>–</span>
              <input type="date" value={fDenNgay} onChange={e => setFDenNgay(e.target.value)} style={{ ...selSt, flex: 1 }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Thẩm phán</span>
            <select value={fThamPhan} onChange={e => setFThamPhan(e.target.value)} style={selSt}>
              <option value="">Vui lòng chọn</option>
              {DSTM_THAM_PHAN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Thẩm phán chủ tọa</span>
            <select value={fThamPhanChuToa} onChange={e => setFThamPhanChuToa(e.target.value)} style={selSt}>
              <option value="">Vui lòng chọn</option>
              {DSTM_THAM_PHAN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={timKiem} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
          <button onClick={xoaBoLoc} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <RotateCcw size={13} /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Bảng */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...TH_STYLE, width: 36 }}>
                <input type="checkbox" checked={visibleRows.length > 0 && selectedIds.length === visibleRows.length} onChange={e => toggleAll(e.target.checked)} />
              </th>
              <th style={{ ...TH_STYLE, width: 50 }}>STT</th>
              <th style={TH_STYLE}>Số &amp; Ngày lập DS</th>
              <th style={TH_STYLE}>Thông tin hội đồng xét xử</th>
              <th style={TH_STYLE}>Trạng thái</th>
              <th style={{ ...TH_STYLE, textAlign: "center", width: 80 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, idx) => (
              <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={e => toggleOne(r.id, e.target.checked)} />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{idx + 1}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>
                  {r.so ? <>Số: <b>{r.so}</b><br />Ngày: {r.ngayLap}</> : <span style={{ color: MUTED }}>–</span>}
                </td>
                <td style={TD_STYLE}>
                  <div style={{ fontSize: 12, color: TEXT, fontFamily: F, lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700 }}>{r.loaiHoiDong}</div>
                    <div>Chủ tọa: {r.chuToa}</div>
                    {r.thanhPhan.length > 0 && <div>Thành phần: {r.thanhPhan.join(", ")}</div>}
                    <a href="#" onClick={e => e.preventDefault()} style={{ color: "#2563eb", textDecoration: "underline", fontSize: 11.5 }}>Thông tin phân công HĐXX</a>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  {r.trangThai === "da-duyet" ? (
                    <span style={{ padding: "3px 12px", border: "1px solid #86efac", color: "#166534", background: "#f0fdf4", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: F }}>Đã duyệt</span>
                  ) : (
                    <span style={{ padding: "3px 12px", border: "1px solid #93c5fd", color: "#1d4ed8", background: "#eff6ff", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: F }}>Chờ duyệt</span>
                  )}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button title="Xem chi tiết" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr><td colSpan={6} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 24 }}>Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{visibleRows.length} trong tổng {visibleRows.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }} disabled>‹</button>
          <button style={{ padding: "4px 10px", border: `1px solid ${RED}`, borderRadius: 4, background: RED, color: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F }}>1</button>
          <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}
