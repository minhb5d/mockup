import React from "react";
import { Search, RotateCcw, Users, X, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";

const todayVi = () => new Date().toLocaleDateString("vi-VN");

type JudgeLevel = "bac-3" | "toi-cao";
type FormType = "ho-so-khang-nghi" | "don-tpb3-gq" | "ho-so-tu-hinh" | "cong-van-trao-doi";
const FORM_LABEL: Record<FormType, string> = {
  "ho-so-khang-nghi": "Hồ sơ kháng nghị GĐT-TT",
  "don-tpb3-gq": "Đơn TPB3 GQ cần phân công TPTC",
  "ho-so-tu-hinh": "Hồ sơ tử hình",
  "cong-van-trao-doi": "Công văn trao đổi",
};

const LOAI_AN_CHECKBOX = ["Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại", "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản", "Phục hồi"];

interface JudgeMeta {
  name: string; title: string; level: JudgeLevel;
}
const ALL_JUDGES: JudgeMeta[] = [
  { name: "Lê Thị Thu Hiền", title: "Thẩm phán TAND tối cao", level: "toi-cao" },
  { name: "Nguyễn Văn A", title: "Thẩm phán TAND tối cao", level: "toi-cao" },
  { name: "Trần Văn B", title: "Thẩm phán TAND tối cao", level: "toi-cao" },
  { name: "Nguyễn Thị Hương", title: "Thẩm phán bậc 3", level: "bac-3" },
  { name: "Vũ Đức Thiện", title: "Thẩm phán bậc 3", level: "bac-3" },
  { name: "Hoàng Ngọc Chiêu", title: "Thẩm phán bậc 3", level: "bac-3" },
];
const eligibleJudges = (level: JudgeLevel) => ALL_JUDGES.filter((j) => j.level === level);

interface HoSoRecord {
  id: number;
  soKhangNghi: string; ngayKhangNghi: string; nguoiKhangNghi: string;
  soBA: string; ngayBA: string; toa: string;
  loaiAn: string; level: JudgeLevel;
  thamPhan: string; ngayPhanCong: string;
}
const BASE: HoSoRecord[] = [
  { id: 1, soKhangNghi: "QĐKN_2808_0901", ngayKhangNghi: "28/08/2026", nguoiKhangNghi: "Viện trưởng viện kiểm sát nhân dân tối cao", soBA: "HKTT_2808_0901", ngayBA: "28/08/2026", toa: "Tòa án nhân dân khu vực 9 - Cần Thơ", loaiAn: "Hình sự", level: "toi-cao", thamPhan: "", ngayPhanCong: "" },
  { id: 2, soKhangNghi: "1836576", ngayKhangNghi: "28/08/2026", nguoiKhangNghi: "Viện trưởng viện kiểm sát nhân dân tối cao", soBA: "164563456", ngayBA: "28/08/2026", toa: "Tòa án nhân dân cấp cao", loaiAn: "Hình sự", level: "toi-cao", thamPhan: "", ngayPhanCong: "" },
  { id: 3, soKhangNghi: "156245", ngayKhangNghi: "28/08/2026", nguoiKhangNghi: "Viện trưởng viện kiểm sát nhân dân tối cao", soBA: "14564", ngayBA: "28/08/2026", toa: "Tòa án nhân dân cấp cao", loaiAn: "Hình sự", level: "toi-cao", thamPhan: "", ngayPhanCong: "" },
  { id: 4, soKhangNghi: "KN-DS-2026-004", ngayKhangNghi: "20/08/2026", nguoiKhangNghi: "Viện trưởng viện kiểm sát nhân dân cấp cao", soBA: "21/2026/DS-ST", ngayBA: "18/08/2026", toa: "Tòa án nhân dân tỉnh Bắc Ninh", loaiAn: "Dân sự", level: "bac-3", thamPhan: "Nguyễn Thị Hương", ngayPhanCong: "22/08/2026" },
];

const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "7px 9px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12, background: "#fff", color: TEXT };
const label: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 };
const primary: React.CSSProperties = { border: 0, background: RED, color: "#fff", borderRadius: 4, padding: "7px 16px", cursor: "pointer", fontFamily: F, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 6 };
const secondary: React.CSSProperties = { border: `1px solid ${BORDER}`, background: "#fff", color: TEXT, borderRadius: 4, padding: "7px 14px", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 6 };
const linkBtn: React.CSSProperties = { border: 0, background: "none", color: "#2563eb", cursor: "pointer", fontFamily: F, fontSize: 12, fontWeight: 600, padding: 0 };

function JudgeListModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 620, borderRadius: 8, overflow: "hidden", fontFamily: F }}>
        <div style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
          <b style={{ color: RED, display: "flex", alignItems: "center", gap: 6 }}><Users size={16} /> Danh sách thẩm phán</b>
          <button onClick={onClose} style={{ border: 0, background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={TH_STYLE}>STT</th><th style={TH_STYLE}>Thẩm phán</th><th style={TH_STYLE}>Chức danh</th></tr></thead>
          <tbody>
            {ALL_JUDGES.map((j, i) => (
              <tr key={j.name}><td style={TD_STYLE}>{i + 1}</td><td style={TD_STYLE}><b>{j.name}</b></td><td style={TD_STYLE}>{j.title}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: 12, textAlign: "right" }}><button onClick={onClose} style={secondary}>Đóng</button></div>
      </div>
    </div>
  );
}

// ── Bộ lọc dùng chung (kiểu dáng theo STG: grid 4 cột) ─────────────────────
function FilterField({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function PhanCongThamPhanView() {
  const [activeTab, setActiveTab] = React.useState<"chi-dinh" | "ket-qua">("chi-dinh");
  const [level, setLevel] = React.useState<JudgeLevel | "tat-ca">("toi-cao");
  const [form, setForm] = React.useState<FormType>("ho-so-khang-nghi");
  const [records, setRecords] = React.useState(BASE);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [bulkJudge, setBulkJudge] = React.useState("");
  const [bulkReason, setBulkReason] = React.useState("");
  const [expanded, setExpanded] = React.useState(true);
  const [judgeModal, setJudgeModal] = React.useState(false);
  const [loaiAnChecked, setLoaiAnChecked] = React.useState<string[]>([]);
  const [searched, setSearched] = React.useState(false);

  const switchTab = (t: "chi-dinh" | "ket-qua") => {
    setActiveTab(t);
    setSelected([]);
    setLevel(t === "ket-qua" ? "tat-ca" : "toi-cao");
  };

  const chuaPhanCong = records.filter((r) => !r.thamPhan);
  const daPhanCong = records.filter((r) => !!r.thamPhan);

  const byLevel = (list: HoSoRecord[]) => level === "tat-ca" ? list : list.filter((r) => r.level === level);
  const candidates = byLevel(activeTab === "chi-dinh" ? chuaPhanCong : daPhanCong);

  const assign = () => {
    if (!selected.length) { alert("Vui lòng chọn hồ sơ cần phân công."); return; }
    if (!bulkJudge) { alert("Vui lòng chọn Thẩm phán."); return; }
    setRecords((prev) => prev.map((r) => selected.includes(r.id) ? { ...r, thamPhan: bulkJudge, ngayPhanCong: todayVi() } : r));
    setSelected([]); setBulkJudge(""); setBulkReason("");
    alert(`Đã phân công ${selected.length} hồ sơ cho ${bulkJudge}`);
  };

  const huyPhanCong = () => {
    if (!selected.length) { alert("Vui lòng chọn hồ sơ cần hủy phân công."); return; }
    if (!confirm("Bạn có chắc chắn muốn hủy kết quả phân công đã chọn?")) return;
    setRecords((prev) => prev.map((r) => selected.includes(r.id) ? { ...r, thamPhan: "", ngayPhanCong: "" } : r));
    setSelected([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Phân công thẩm phán › Danh sách
      </div>

      <div style={{ flex: 1, overflow: "auto", background: "#f8fafc" }}>
        <div style={{ padding: "14px 20px 0", background: "#fff" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 12px" }}>Danh sách</h2>
          <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${BORDER}` }}>
            <button onClick={() => switchTab("chi-dinh")} style={{ padding: "0 0 10px", border: 0, borderBottom: activeTab === "chi-dinh" ? `2px solid ${RED}` : "2px solid transparent", background: "none", color: activeTab === "chi-dinh" ? RED : MUTED, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F }}>
              DS chưa phân công chỉ định
            </button>
            <button onClick={() => switchTab("ket-qua")} style={{ padding: "0 0 10px", border: 0, borderBottom: activeTab === "ket-qua" ? `2px solid ${RED}` : "2px solid transparent", background: "none", color: activeTab === "ket-qua" ? RED : MUTED, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F }}>
              Quản lý kết quả phân công
            </button>
          </div>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Radio bậc thẩm phán */}
          <div style={{ display: "flex", gap: 24, fontSize: 13, fontFamily: F, color: TEXT }}>
            {activeTab === "ket-qua" && (
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="radio" checked={level === "tat-ca"} onChange={() => setLevel("tat-ca")} /> Tất cả
              </label>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="radio" checked={level === "toi-cao"} onChange={() => setLevel("toi-cao")} /> Thẩm phán tối cao
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="radio" checked={level === "bac-3"} onChange={() => setLevel("bac-3")} /> Thẩm phán bậc 3
            </label>
          </div>

          {expanded && (
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {activeTab === "chi-dinh" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    <FilterField><span style={label}>Tên tòa án</span><input style={field} placeholder="nhập dữ liệu" /></FilterField>
                    <FilterField>
                      <span style={label}>Thời gian nhập đơn</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="date" style={field} /><span style={{ fontSize: 11, color: MUTED }}>→</span><input type="date" style={field} />
                      </div>
                    </FilterField>
                    <FilterField>
                      <span style={label}>Hình thức phân công</span>
                      <select value={form} onChange={(e) => setForm(e.target.value as FormType)} style={field}>
                        {(Object.keys(FORM_LABEL) as FormType[]).map((k) => <option key={k} value={k}>{FORM_LABEL[k]}</option>)}
                      </select>
                    </FilterField>
                    <FilterField><span style={label}>Số thụ lý</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    <FilterField><span style={label}>Số BA/QĐ</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                    <FilterField>
                      <span style={label}>Ngày thụ lý</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="date" style={field} /><span style={{ fontSize: 11, color: MUTED }}>→</span><input type="date" style={field} />
                      </div>
                    </FilterField>
                  </div>
                  <div>
                    <span style={label}>Loại án</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                      {LOAI_AN_CHECKBOX.map((l) => (
                        <label key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: F, color: TEXT, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={loaiAnChecked.includes(l)}
                            onChange={() => setLoaiAnChecked((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l])}
                          />
                          {l}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    <FilterField>
                      <span style={label}>Thời gian phân công</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="date" style={field} /><span style={{ fontSize: 11, color: MUTED }}>→</span><input type="date" style={field} />
                      </div>
                    </FilterField>
                    <FilterField>
                      <span style={label}>Hình thức phân công</span>
                      <select value={form} onChange={(e) => setForm(e.target.value as FormType)} style={field}>
                        {(Object.keys(FORM_LABEL) as FormType[]).map((k) => <option key={k} value={k}>{FORM_LABEL[k]}</option>)}
                      </select>
                    </FilterField>
                    <FilterField><span style={label}>Người đứng đơn</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                    <FilterField><span style={label}>Số BA/QĐ</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    <FilterField><span style={label}>Ngày BA/QĐ</span><input type="date" style={field} /></FilterField>
                    <FilterField><span style={label}>Tòa ra QĐ BA/QĐ</span><select style={field}><option>- Chọn -</option></select></FilterField>
                    <FilterField><span style={label}>Số thụ lý</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                    <FilterField>
                      <span style={label}>Ngày thụ lý</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="date" style={field} /><span style={{ fontSize: 11, color: MUTED }}>→</span><input type="date" style={field} />
                      </div>
                    </FilterField>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    <FilterField>
                      <span style={label}>Thẩm phán</span>
                      <select style={field}><option>- Chọn -</option>{ALL_JUDGES.map((j) => <option key={j.name}>{j.name}</option>)}</select>
                    </FilterField>
                    <FilterField><span style={label}>Số tờ trình</span><input style={field} placeholder="Nhập dữ liệu" /></FilterField>
                    <FilterField>
                      <span style={label}>Ngày tờ trình</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="date" style={field} /><span style={{ fontSize: 11, color: MUTED }}>→</span><input type="date" style={field} />
                      </div>
                    </FilterField>
                    <FilterField><span style={label}>Người nhập đơn</span><select style={field}><option>- Chọn -</option></select></FilterField>
                  </div>
                </>
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setExpanded((v) => !v)} style={linkBtn}>{expanded ? "▴ Thu gọn" : "▾ Mở rộng"}</button>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSearched(true)} style={primary}><Search size={13} /> Tìm kiếm</button>
              <button onClick={() => { setSearched(false); setLoaiAnChecked([]); }} style={secondary}><RotateCcw size={13} /> Xóa bộ lọc</button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {activeTab === "ket-qua" && (
              <button onClick={huyPhanCong} style={secondary}><Trash2 size={13} /> Xóa</button>
            )}
            <button onClick={() => setJudgeModal(true)} style={secondary}><Users size={13} /> Danh sách thẩm phán</button>
          </div>

          {activeTab === "chi-dinh" && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <select value={bulkJudge} onChange={(e) => setBulkJudge(e.target.value)} style={{ ...field, width: 260 }}>
                <option value="">-- Chọn thẩm phán --</option>
                {eligibleJudges(level === "tat-ca" ? "toi-cao" : level).map((j) => <option key={j.name} value={j.name}>{j.name}</option>)}
              </select>
              <input value={bulkReason} onChange={(e) => setBulkReason(e.target.value)} style={{ ...field, width: 260 }} placeholder="Lý do phân công (chung)" />
              <button onClick={assign} style={primary}>Phân công</button>
            </div>
          )}

          {/* Bảng */}
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>
                    <input
                      type="checkbox"
                      checked={candidates.length > 0 && selected.length === candidates.length}
                      onChange={(e) => setSelected(e.target.checked ? candidates.map((r) => r.id) : [])}
                    />
                  </th>
                  <th style={{ ...TH_STYLE, textAlign: "center" }}>STT</th>
                  <th style={TH_STYLE}>HỒ SƠ KHÁNG NGHỊ</th>
                  <th style={TH_STYLE}>SỐ - NGÀY KHÁNG NGHỊ</th>
                  <th style={TH_STYLE}>NGƯỜI KHÁNG NGHỊ</th>
                  <th style={TH_STYLE}>THÔNG TIN BA/QĐ</th>
                  <th style={TH_STYLE}>LOẠI ÁN</th>
                  {activeTab === "ket-qua" && <th style={TH_STYLE}>NGÀY PHÂN CÔNG</th>}
                  <th style={TH_STYLE}>THẨM PHÁN</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length ? candidates.map((r, i) => (
                  <tr key={r.id} style={{ background: selected.includes(r.id) ? "#fef2f2" : "#fff" }}>
                    <td style={TD_STYLE}>
                      <input type="checkbox" checked={selected.includes(r.id)} onChange={() => setSelected((v) => v.includes(r.id) ? v.filter((x) => x !== r.id) : [...v, r.id])} />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>{i + 1}</td>
                    <td style={TD_STYLE}>–</td>
                    <td style={TD_STYLE}>Số: {r.soKhangNghi}<br />Ngày: {r.ngayKhangNghi}</td>
                    <td style={TD_STYLE}>{r.nguoiKhangNghi}</td>
                    <td style={TD_STYLE}><b>Số:</b> {r.soBA}<br /><b>Ngày:</b> {r.ngayBA}<br /><b>Tòa:</b> {r.toa}</td>
                    <td style={TD_STYLE}>{r.loaiAn}</td>
                    {activeTab === "ket-qua" && <td style={TD_STYLE}>{r.ngayPhanCong || "-"}</td>}
                    <td style={TD_STYLE}>{r.thamPhan || <span style={{ color: MUTED }}>Chưa phân công</span>}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={9} style={{ ...TD_STYLE, textAlign: "center", padding: 28, color: MUTED }}>Không có dữ liệu phù hợp.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {judgeModal && <JudgeListModal onClose={() => setJudgeModal(false)} />}
    </div>
  );
}
export default PhanCongThamPhanView;
