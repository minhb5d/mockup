import React, { useMemo, useState } from "react";
import { FileText, Hash, Printer, Send, X } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE, Badge } from "./shared";

type DocType =
  | "Giấy xác nhận" | "Giấy xác nhận cơ quan chuyển đơn" | "Công văn chuyển đơn"
  | "Công văn chuyển nội bộ" | "Công văn chuyển tòa khác" | "Công văn chuyển ngoài"
  | "Trả lại đơn" | "Tờ trình phân công Thẩm phán" | "Tờ trình khác"
  | "Thông báo phân công TP" | "Yêu cầu bổ sung";

type Row = { id:number; maDon:string; trangThai:string; hinhThucPC:string; thamPhan:string; vu:string; chuyen?:string; coCoQuanChuyen?:boolean; vanBanStatus?:string };
const DOC_TYPES:DocType[]=["Giấy xác nhận","Giấy xác nhận cơ quan chuyển đơn","Công văn chuyển đơn","Công văn chuyển nội bộ","Công văn chuyển tòa khác","Công văn chuyển ngoài","Trả lại đơn","Tờ trình phân công Thẩm phán","Tờ trình khác","Thông báo phân công TP","Yêu cầu bổ sung"];
const ROWS:Row[]=[
  {id:1,maDon:"DON-2026/00881",trangThai:"Thụ lý mới",hinhThucPC:"Ngẫu nhiên",thamPhan:"Nguyễn Văn A",vu:"Vụ I",vanBanStatus:"Chưa có"},
  {id:2,maDon:"DON-2026/00882",trangThai:"Thụ lý mới",hinhThucPC:"Chỉ định",thamPhan:"Lê Thị Thu Hiền",vu:"Vụ I",vanBanStatus:"Bị trả lại"},
  {id:3,maDon:"DON-2026/00883",trangThai:"Chưa đủ điều kiện",hinhThucPC:"-",thamPhan:"-",vu:"Vụ II",vanBanStatus:"Chưa có"},
  {id:4,maDon:"DON-2026/00884",trangThai:"Chuyển đơn",hinhThucPC:"-",thamPhan:"-",vu:"Vụ III",chuyen:"Chuyển Tòa khác",vanBanStatus:"Chưa có"},
  {id:5,maDon:"DON-2026/00885",trangThai:"Chuyển đơn",hinhThucPC:"-",thamPhan:"-",vu:"Vụ IV",chuyen:"Chuyển ngoài Tòa án",coCoQuanChuyen:true,vanBanStatus:"Đã huỷ"},
  {id:6,maDon:"DON-2026/00886",trangThai:"Trả lại đơn",hinhThucPC:"-",thamPhan:"-",vu:"Vụ II",vanBanStatus:"Chưa có"},
];

function eligible(r:Row,t:DocType){
  const available=!r.vanBanStatus||["Chưa có","Bị trả lại","Đã huỷ"].includes(r.vanBanStatus);
  if(!available)return false;
  if(t==="Tờ trình phân công Thẩm phán") return r.trangThai.includes("Thụ lý mới")&&r.hinhThucPC==="Ngẫu nhiên"&&r.thamPhan!=="-";
  if(t==="Thông báo phân công TP") return r.trangThai.includes("Thụ lý mới")&&r.thamPhan!=="-";
  if(t==="Yêu cầu bổ sung") return r.trangThai.includes("Chưa đủ điều kiện");
  if(t==="Công văn chuyển tòa khác") return r.chuyen==="Chuyển Tòa khác";
  if(t==="Công văn chuyển ngoài") return r.chuyen==="Chuyển ngoài Tòa án";
  if(t==="Trả lại đơn") return r.trangThai==="Trả lại đơn";
  if(t==="Giấy xác nhận cơ quan chuyển đơn") return !!r.coCoQuanChuyen;
  return true;
}

export default function LuuSoVanBanView(){
  const [docType,setDocType]=useState<DocType>("Tờ trình phân công Thẩm phán");
  const [selected,setSelected]=useState<number[]>([]);
  const [approver,setApprover]=useState(""); const [signer,setSigner]=useState(""); const [priority,setPriority]=useState("Bình thường");
  const [note,setNote]=useState(""); const [companions,setCompanions]=useState<string[]>([]); const [created,setCreated]=useState(false); const [numbered,setNumbered]=useState(false);
  const rows=useMemo(()=>ROWS.filter(r=>eligible(r,docType)),[docType]);
  const grouped=useMemo(()=>{const m=new Map<string,Row[]>();rows.filter(r=>selected.includes(r.id)).forEach(r=>{const k=`${r.vu} + ${r.thamPhan}`;(m.get(k)||m.set(k,[]).get(k)!).push(r)});return [...m.entries()]},[rows,selected]);
  const st:React.CSSProperties={width:"100%",padding:"7px 9px",border:`1px solid ${BORDER}`,borderRadius:4,fontFamily:F,fontSize:12,boxSizing:"border-box"};
  const submit=()=>{if(!selected.length){alert("Bắt buộc chọn ít nhất 01 đơn hợp lệ");return} if(!approver||!signer){alert("Người duyệt và Người ký là bắt buộc");return} setCreated(true);alert("Đã tạo cây Văn bản → Danh sách đơn → Đơn theo SRS")};
  return <div style={{height:"100%",overflow:"auto",background:"#f8fafc",fontFamily:F}}>
    <div style={{padding:"9px 20px",background:"#fff",borderBottom:`1px solid ${BORDER}`,fontSize:12,color:MUTED}}>Trang chủ / Quản lý đơn / <b style={{color:TEXT}}>Lưu số văn bản & In báo cáo</b></div>
    <div style={{padding:20,display:"grid",gap:14}}>
      <div><h2 style={{margin:"0 0 4px",fontSize:20}}>Lưu số văn bản & In báo cáo</h2><div style={{fontSize:12,color:MUTED}}>Drawio “Lưu số văn bản” + SRS: lọc đơn theo loại văn bản, dựng cây 3 tầng, duyệt/ký/lấy số/in.</div></div>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,padding:14,display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:10}}>
        <div><label>Loại văn bản *</label><select value={docType} onChange={e=>{setDocType(e.target.value as DocType);setSelected([]);setCreated(false);setNumbered(false)}} style={st}>{DOC_TYPES.map(x=><option key={x}>{x}</option>)}</select></div>
        <div><label>Người tạo</label><input value="Lý Thái Phúc - Cán bộ VPHCTP" readOnly style={{...st,background:"#f3f4f6"}}/></div>
        <div><label>Người duyệt *</label><select value={approver} onChange={e=>setApprover(e.target.value)} style={{...st,borderColor:approver?BORDER:RED}}><option value="">Chọn người duyệt</option><option>Trần Văn B - Trưởng phòng - 15/04/1980</option><option>Lê Thị C - Phó phòng - 22/09/1985</option></select></div>
        <div><label>Người ký *</label><select value={signer} onChange={e=>setSigner(e.target.value)} style={{...st,borderColor:signer?BORDER:RED}}><option value="">Chọn người ký</option><option>Nguyễn Minh An - Phó CVP - 01/03/1975</option><option>Hoàng Kim Long - CVP - 10/08/1970</option></select></div>
        <div><label>Mức độ ưu tiên</label><select value={priority} onChange={e=>setPriority(e.target.value)} style={st}><option>Cao</option><option>Bình thường</option><option>Thấp</option></select></div>
        <div style={{gridColumn:"span 2"}}><label>Văn bản đi kèm</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Giấy xác nhận","Công văn chuyển đơn","Thông báo phân công TP"].filter(x=>x!==docType).map(x=><label key={x} style={{fontSize:11}}><input type="checkbox" checked={companions.includes(x)} onChange={e=>setCompanions(v=>e.target.checked?[...v,x]:v.filter(y=>y!==x))}/>{x}</label>)}</div></div>
        <div><label>Ý kiến trình</label><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Điều muốn lưu ý người duyệt…" style={{...st,minHeight:38,resize:"vertical"}}/></div>
      </section>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,overflow:"hidden"}}><div style={{padding:10,display:"flex",alignItems:"center",borderBottom:`1px solid ${BORDER}`}}><b style={{flex:1}}>Danh sách đơn hợp lệ theo BR5 ({rows.length})</b><button onClick={()=>setSelected(selected.length===rows.length?[]:rows.map(r=>r.id))}>Chọn tất cả</button></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH_STYLE}></th><th style={TH_STYLE}>Mã đơn</th><th style={TH_STYLE}>Trạng thái</th><th style={TH_STYLE}>Hình thức PC</th><th style={TH_STYLE}>Thẩm phán dự kiến</th><th style={TH_STYLE}>Vụ chuyển đến</th><th style={TH_STYLE}>VB cùng loại trước đó</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td style={TD_STYLE}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></td><td style={TD_STYLE}>{r.maDon}</td><td style={TD_STYLE}>{r.trangThai}</td><td style={TD_STYLE}>{r.hinhThucPC}</td><td style={TD_STYLE}>{r.thamPhan}</td><td style={TD_STYLE}>{r.vu}</td><td style={TD_STYLE}><Badge color="#166534" bg="#dcfce7">{r.vanBanStatus||"Chưa có"}</Badge></td></tr>)}</tbody></table></section>
      {docType==="Tờ trình phân công Thẩm phán"&&selected.length>0&&<section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,padding:12}}><b>Nhóm Layer 2 theo (Vụ chuyển đến + Thẩm phán)</b>{grouped.map(([k,list])=><div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${BORDER}`,fontSize:12}}><b>{k}</b> — {list.map(x=>x.maDon).join(", ")}</div>)}</section>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>window.print()}><Printer size={13}/> In báo cáo</button><button disabled={!created} onClick={()=>setNumbered(v=>!v)} style={{padding:"7px 14px"}}><Hash size={13}/> {numbered?"Hủy cấp số":"Lấy số"}</button><button onClick={submit} style={{background:RED,color:"#fff",border:0,borderRadius:4,padding:"7px 16px",fontWeight:700}}><FileText size={13}/> Lưu số văn bản</button><button disabled={!created||!approver||!signer} onClick={()=>alert("Đã trình duyệt văn bản") } style={{padding:"7px 14px"}}><Send size={13}/> Trình duyệt</button></div>
      {created&&<div style={{padding:12,background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:6,color:"#065f46"}}>✓ Đã tạo 01 văn bản chính ({docType}) với {selected.length} đơn; {companions.length} văn bản đi kèm. {numbered?"Đã cấp số demo.":"Chưa cấp số."}</div>}
    </div>
  </div>
}
