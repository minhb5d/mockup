import React from "react";
import { X, Search, RotateCcw, Save, Eye } from "lucide-react";
import { BORDER, F, MUTED, RED, TEXT, TH_STYLE, TD_STYLE } from "./shared";
import type { DonCase } from "./data";

const today = () => new Date().toLocaleDateString("vi-VN");
const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "7px 9px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12, color: TEXT, background: "#fff" };
const label: React.CSSProperties = { fontSize: 11, fontFamily: F, color: MUTED, marginBottom: 4, display: "block", fontWeight: 600 };
const primary: React.CSSProperties = { border: 0, background: RED, color: "#fff", borderRadius: 4, padding: "8px 18px", cursor: "pointer", fontFamily: F, fontWeight: 700, fontSize: 12 };
const secondary: React.CSSProperties = { border: `1px solid ${BORDER}`, background: "#fff", color: TEXT, borderRadius: 4, padding: "8px 18px", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12 };

function Shell({ title, children, onClose, width = 900 }: { title: string; children: React.ReactNode; onClose: () => void; width?: number }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 6500, background: "rgba(15,23,42,.48)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div style={{ width: "100%", maxWidth: width, maxHeight: "92vh", overflow: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 24px 70px rgba(0,0,0,.28)", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <b style={{ color: RED, fontSize: 15 }}>{title}</b>
        <button onClick={onClose} style={{ border: 0, background: "none", cursor: "pointer" }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>;
}

export function TraDonModal({ cases, onClose, onSuccess }: { cases: DonCase[]; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState(false);
  const submit = () => {
    if (!reason.trim()) { setError(true); return; }
    alert("Trả đơn thành công.");
    onSuccess();
    onClose();
  };
  return <Shell title="Trả đơn" onClose={onClose} width={980}>
    <div style={{ padding: 18, display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>
        <div><span style={label}>Ngày trả đơn</span><input value={today()} readOnly style={{ ...field, background: "#f3f4f6" }} /></div>
        <div><span style={label}>Lý do <span style={{ color: RED }}>*</span></span><textarea value={reason} onChange={e => { setReason(e.target.value); setError(false); }} rows={3} style={{ ...field, resize: "vertical", borderColor: error ? RED : BORDER }} />{error && <small style={{ color: RED }}>Lý do là bắt buộc.</small>}</div>
      </div>
      <b style={{ fontSize: 12 }}>Tổng số đơn: {cases.length}</b>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={TH_STYLE}>STT</th><th style={TH_STYLE}>Mã đơn</th><th style={TH_STYLE}>Hình thức</th><th style={TH_STYLE}>BA/QĐ</th><th style={TH_STYLE}>Người đứng đơn</th></tr></thead>
          <tbody>{cases.map((c,i)=><tr key={c.id}><td style={TD_STYLE}>{i+1}</td><td style={TD_STYLE}>{c.maDon || c.maVanThuDen}</td><td style={TD_STYLE}>{c.hinhThuc}</td><td style={TD_STYLE}>{c.soBA} - {c.ngayBA}</td><td style={TD_STYLE}>{c.ndd || c.nguoiKhieuNai || "-"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
    <div style={{ padding: "12px 18px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8 }}><button onClick={onClose} style={secondary}>Đóng</button><button onClick={submit} style={primary}>Trả đơn</button></div>
  </Shell>;
}

const CANDIDATE_CASES = [
  { id: "VA26-010301", ten: "Vụ án Nguyễn Văn Anh và đồng phạm", soBA: "108/2026/HS-ST", ngayBA: "12/06/2026", toa: "TAND tỉnh Hà Nam", qhpl: "Tội cố ý gây thương tích", ttv: "Nguyễn Thị Thúy Hường", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Biên Thùy", total: 3 },
  { id: "VA26-010515", ten: "Vụ án Trần Thị Bảo", soBA: "42/2026/HC-ST", ngayBA: "19/05/2026", toa: "TAND TP Đà Nẵng", qhpl: "Khiếu kiện quyết định thu hồi đất", ttv: "Vũ Xuân Hiền", ldv: "Lê Thị Thu Hiền", tp: "Trần Minh Đức", total: 2 },
  { id: "VA26-010889", ten: "Vụ án Phạm Quốc Cường", soBA: "78/2026/DS-ST", ngayBA: "01/06/2026", toa: "TAND tỉnh Vĩnh Phúc", qhpl: "Tranh chấp đất đai", ttv: "Nguyễn Đức Thiện", ldv: "Nguyễn Như Thắng", tp: "Lê Văn Minh", total: 4 },
];

function CasePicker({ source, actionLabel, onClose, onSuccess }: { source: DonCase; actionLabel: string; onClose: () => void; onSuccess: (id: string) => void }) {
  const [toa, setToa] = React.useState(""); const [so, setSo] = React.useState(""); const [ngay, setNgay] = React.useState(""); const [selected, setSelected] = React.useState("");
  const [searched, setSearched] = React.useState(CANDIDATE_CASES);
  const search = () => setSearched(CANDIDATE_CASES.filter(x => (!toa || x.toa.toLowerCase().includes(toa.toLowerCase())) && (!so || x.soBA.toLowerCase().includes(so.toLowerCase())) && (!ngay || x.ngayBA === ngay)));
  return <>
    <div style={{ padding: 18, display: "grid", gap: 14 }}>
      <div style={{ padding: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 5, fontSize: 12 }}>Đơn đang xử lý: <b>{source.maDon || source.maVanThuDen}</b> — {source.soBA} / {source.toa}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 10, alignItems: "end" }}>
        <div><span style={label}>Tòa ra BA/QĐ</span><input value={toa} onChange={e=>setToa(e.target.value)} style={field}/></div>
        <div><span style={label}>Số BA/QĐ</span><input value={so} onChange={e=>setSo(e.target.value)} style={field}/></div>
        <div><span style={label}>Ngày BA/QĐ</span><input type="date" value={ngay} onChange={e=>setNgay(e.target.value)} style={field}/></div>
        <button onClick={search} style={primary}><Search size={13} style={{ verticalAlign: "middle" }}/> Tìm kiếm</button>
        <button onClick={()=>{setToa("");setSo("");setNgay("");setSearched(CANDIDATE_CASES)}} style={secondary}><RotateCcw size={13} style={{ verticalAlign: "middle" }}/> Làm lại</button>
      </div>
      <b style={{ fontSize: 12 }}>{actionLabel === "Ghép đơn" ? `Ghép đơn ${source.maDon || source.id} với vụ án` : "Chọn vụ án đích"}</b>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={TH_STYLE}></th><th style={TH_STYLE}>Tên vụ án</th><th style={TH_STYLE}>Thông tin BA/QĐ & QHPL</th><th style={TH_STYLE}>Phân công</th><th style={TH_STYLE}>Số lượng đơn</th><th style={TH_STYLE}>Thao tác</th></tr></thead><tbody>
        {searched.map(x=><tr key={x.id}><td style={TD_STYLE}><input type="radio" name="case" checked={selected===x.id} onChange={()=>setSelected(x.id)}/></td><td style={TD_STYLE}><b>{x.ten}</b><div style={{color:MUTED,fontSize:10}}>{x.id}</div></td><td style={TD_STYLE}>Số: {x.soBA} - {x.ngayBA}<br/>Tại: {x.toa}<br/>QHPL: {x.qhpl}</td><td style={TD_STYLE}>TTV: {x.ttv}<br/>LĐV: {x.ldv}<br/>TP: {x.tp}</td><td style={{...TD_STYLE,textAlign:"center"}}>{x.total}</td><td style={{...TD_STYLE,textAlign:"center"}}><button title="Xem" style={{border:0,background:"none",cursor:"pointer"}}><Eye size={15}/></button></td></tr>)}
      </tbody></table></div>
    </div>
    <div style={{ padding: "12px 18px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8 }}><button onClick={onClose} style={secondary}>Đóng</button><button onClick={()=>{if(!selected){alert("Vui lòng chọn một vụ án.");return;} onSuccess(selected); onClose();}} style={primary}>{actionLabel}</button></div>
  </>;
}

export function GhepVuAnModal({ source, onClose }: { source: DonCase; onClose: () => void }) { return <Shell title="Ghép vụ án" onClose={onClose} width={1100}><CasePicker source={source} actionLabel="Ghép đơn" onClose={onClose} onSuccess={id=>alert(`Ghép đơn vào vụ án ${id} thành công.`)}/></Shell>; }
export function ChuyenVuAnModal({ source, onClose }: { source: DonCase; onClose: () => void }) { return <Shell title="Chuyển vụ án" onClose={onClose} width={1100}><CasePicker source={source} actionLabel="Chuyển vụ án" onClose={onClose} onSuccess={id=>alert(`Chuyển đơn/vụ sang ${id} thành công.`)}/></Shell>; }

export function ThemMoiVuAnScreen({ onClose }: { onClose: () => void }) {
  const [form, setForm] = React.useState({ hinhThuc: "Đơn đề nghị GĐT/TT", thuTuc: "Giám đốc thẩm", loaiBanAn: "Bản án", loaiAn: "Hình sự", soThuLy: "", ngayThuLy: "", nguoiDungDon: "", diaChi: "", ngayDon: "", ngayNhan: "", soBA: "", ngayBA: "", toa: "", qhpl: "", qhplTranhChap: "", ttv: "", ldv: "" });
  const [parties, setParties] = React.useState([{ hoTen: "", vaiTro: "Bị cáo", diaChi: "" }]);
  const [dirty, setDirty] = React.useState(false); const [errors, setErrors] = React.useState<Record<string,string>>({});
  const set = (k: string, v: string) => { setForm(f=>({...f,[k]:v})); setDirty(true); setErrors(e=>({...e,[k]:""})); };
  const lookup = () => {
    if (!form.soBA && !form.ngayBA && !form.toa) { alert("Nhập ít nhất Số/Ngày/Tòa BA/QĐ để tra cứu."); return; }
    setForm(f=>({...f, qhpl: f.loaiAn === "Hình sự" ? "Tội cố ý gây thương tích" : "Tranh chấp quyền sử dụng đất", qhplTranhChap: f.loaiAn === "Hình sự" ? "" : "Quyền sử dụng đất" }));
    setParties([{ hoTen: "Nguyễn Văn A", vaiTro: form.loaiAn === "Hình sự" ? "Bị cáo" : "Nguyên đơn", diaChi: "Hà Nội" }, { hoTen: "Trần Thị B", vaiTro: form.loaiAn === "Hình sự" ? "Bị hại" : "Bị đơn", diaChi: "Hà Nam" }]);
    setDirty(true); alert("Đã tìm thấy bản án và tự động điền QHPL, người liên quan.");
  };
  const save = () => {
    const required = ["hinhThuc","thuTuc","loaiBanAn","loaiAn","soThuLy","ngayThuLy","nguoiDungDon","ngayNhan","soBA","ngayBA","toa","ttv","ldv"];
    const e: Record<string,string> = {}; required.forEach(k=>{ if(!(form as any)[k]?.trim()) e[k] = `${k} là bắt buộc`; });
    if (Object.keys(e).length) { setErrors(e); alert("Vui lòng bổ sung các trường bắt buộc."); return; }
    setDirty(false); alert("Lưu vụ án thành công.");
  };
  const close = () => { if (dirty && !confirm("Chưa Lưu Vụ Án, bạn có chắc chắn Đóng?")) return; onClose(); };
  const Field = ({ k, title, type="text", children }: { k: keyof typeof form; title: string; type?: string; children?: React.ReactNode }) => <div><span style={label}>{title} {errors[k] && <span style={{color:RED}}>*</span>}</span>{children || <input type={type} value={form[k]} onChange={e=>set(String(k),e.target.value)} style={{...field,borderColor:errors[k]?RED:BORDER}}/>}{errors[k] && <small style={{color:RED}}>{title} là bắt buộc</small>}</div>;
  return <div style={{ flex: 1, overflow: "auto", background: "#f8fafc", fontFamily: F }}>
    <div style={{ padding: "10px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, color: MUTED, fontSize: 12 }}>Trang chủ › Nhận đơn và TL vụ án › <b style={{color:TEXT}}>Thêm mới vụ án</b></div>
    <div style={{ padding: 20, display: "grid", gap: 16 }}>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:16}}><h3 style={{margin:"0 0 14px",fontSize:14,color:RED}}>A. Thông tin chung</h3><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Field k="hinhThuc" title="Hình thức"><select value={form.hinhThuc} onChange={e=>set("hinhThuc",e.target.value)} style={field}><option>Đơn đề nghị GĐT/TT</option><option>CV kiến nghị GĐT/TT</option></select></Field>
        <Field k="thuTuc" title="Thủ tục giải quyết"><select value={form.thuTuc} onChange={e=>set("thuTuc",e.target.value)} style={field}><option>Giám đốc thẩm</option><option>Tái thẩm</option></select></Field>
        <Field k="loaiBanAn" title="Loại bản án"><select value={form.loaiBanAn} onChange={e=>set("loaiBanAn",e.target.value)} style={field}><option>Bản án</option><option>Quyết định</option></select></Field>
        <Field k="loaiAn" title="Loại án"><select value={form.loaiAn} onChange={e=>set("loaiAn",e.target.value)} style={field}><option>Hình sự</option><option>Dân sự</option><option>Hành chính</option><option>Kinh doanh thương mại</option><option>Lao động</option><option>Hôn nhân và gia đình</option><option>Phá sản</option><option>Sở hữu trí tuệ</option></select></Field>
        <Field k="soThuLy" title="Số thụ lý"/><Field k="ngayThuLy" title="Ngày thụ lý" type="date"/><Field k="nguoiDungDon" title="Người đứng đơn"/><Field k="diaChi" title="Địa chỉ"/>
        <Field k="ngayDon" title="Ngày ghi trên đơn" type="date"/><Field k="ngayNhan" title="Ngày nhận đơn" type="date"/>
      </div></section>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:16}}><h3 style={{margin:"0 0 14px",fontSize:14,color:RED}}>B. Quá trình giải quyết / Bản án quyết định</h3><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,alignItems:"end"}}><Field k="soBA" title="Số BA/QĐ"/><Field k="ngayBA" title="Ngày BA/QĐ" type="date"/><Field k="toa" title="Tòa ra BA/QĐ"/><button onClick={lookup} style={primary}><Search size={13}/> Tra cứu bản án</button><Field k="qhpl" title="QHPL"/><Field k="qhplTranhChap" title="QHPL tranh chấp"/></div></section>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{margin:"0 0 14px",fontSize:14,color:RED}}>C. Đương sự / Người có quyền lợi, nghĩa vụ liên quan</h3><button onClick={()=>{setParties(p=>[...p,{hoTen:"",vaiTro:"Người liên quan",diaChi:""}]);setDirty(true)}} style={secondary}>+ Thêm</button></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH_STYLE}>STT</th><th style={TH_STYLE}>Họ tên</th><th style={TH_STYLE}>Vai trò</th><th style={TH_STYLE}>Địa chỉ</th><th style={TH_STYLE}>Thao tác</th></tr></thead><tbody>{parties.map((r,i)=><tr key={i}><td style={TD_STYLE}>{i+1}</td><td style={TD_STYLE}><input value={r.hoTen} onChange={e=>{const a=[...parties];a[i]={...a[i],hoTen:e.target.value};setParties(a);setDirty(true)}} style={field}/></td><td style={TD_STYLE}><input value={r.vaiTro} onChange={e=>{const a=[...parties];a[i]={...a[i],vaiTro:e.target.value};setParties(a);setDirty(true)}} style={field}/></td><td style={TD_STYLE}><input value={r.diaChi} onChange={e=>{const a=[...parties];a[i]={...a[i],diaChi:e.target.value};setParties(a);setDirty(true)}} style={field}/></td><td style={TD_STYLE}><button onClick={()=>setParties(p=>p.filter((_,x)=>x!==i))} style={{border:0,background:"none",color:RED,cursor:"pointer"}}>Xóa</button></td></tr>)}</tbody></table></section>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:16}}><h3 style={{margin:"0 0 14px",fontSize:14,color:RED}}>D. Phân công</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field k="ttv" title="Thẩm tra viên"><select value={form.ttv} onChange={e=>set("ttv",e.target.value)} style={field}><option value="">-- Chọn --</option><option>Nguyễn Thị Thúy Hường</option><option>Vũ Xuân Hiền</option></select></Field><Field k="ldv" title="Lãnh đạo"><select value={form.ldv} onChange={e=>set("ldv",e.target.value)} style={field}><option value="">-- Chọn --</option><option>Phạm Thị Bích Ngọc</option><option>Lê Thị Thu Hiền</option></select></Field></div></section>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}><button onClick={close} style={secondary}>Đóng</button><button onClick={save} style={primary}><Save size={14} style={{verticalAlign:"middle"}}/> Lưu</button></div>
    </div>
  </div>;
}
