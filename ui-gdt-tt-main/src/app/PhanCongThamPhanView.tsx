import React from "react";
import { Search, RotateCcw, Printer, X, Users, Pencil, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";

const TODAY = new Date().toISOString().slice(0, 10);
const todayVi = () => new Date().toLocaleDateString("vi-VN");

type JudgeLevel = "bac-3" | "toi-cao";
type FormType = "ho-so-khang-nghi" | "don-tpb3-gq" | "ho-so-tu-hinh" | "cong-van-trao-doi";
type UserPermission = "pho-chanh-an" | "vu-truong" | "tham-phan";

interface JudgeMeta {
  name: string; birthDate: string; title: string; activeCases: number; specialty: string; level: JudgeLevel; office?: string;
  suspendedCases: number; overdueCases: number; overturnedSubjective1Y: number; unavailableReason?: string;
}
const ALL_JUDGES: JudgeMeta[] = [
  { name: "Lê Thị Thu Hiền", birthDate: "12/03/1972", title: "Thẩm phán TAND tối cao", activeCases: 6, suspendedCases: 2, overdueCases: 0, overturnedSubjective1Y: 0, specialty: "Hình sự, GĐT/TT", level: "toi-cao" },
  { name: "Nguyễn Văn A", birthDate: "08/09/1970", title: "Thẩm phán TAND tối cao", activeCases: 4, suspendedCases: 1, overdueCases: 0, overturnedSubjective1Y: 1, specialty: "Dân sự, KDTM", level: "toi-cao" },
  { name: "Trần Văn B", birthDate: "21/05/1974", title: "Thẩm phán TAND tối cao", activeCases: 7, suspendedCases: 3, overdueCases: 1, overturnedSubjective1Y: 0, specialty: "Hành chính", level: "toi-cao" },
  { name: "Phạm Văn C", birthDate: "17/11/1971", title: "Chánh án", activeCases: 2, suspendedCases: 0, overdueCases: 0, overturnedSubjective1Y: 0, specialty: "Quản lý", level: "toi-cao" },
  { name: "Nguyễn Thị Hương", birthDate: "04/02/1975", title: "Thẩm phán bậc 3", activeCases: 3, suspendedCases: 2, overdueCases: 0, overturnedSubjective1Y: 0, specialty: "Hình sự", level: "bac-3" },
  { name: "Vũ Đức Thiện", birthDate: "29/07/1973", title: "Thẩm phán bậc 3", activeCases: 4, suspendedCases: 1, overdueCases: 1, overturnedSubjective1Y: 0, specialty: "Dân sự", level: "bac-3" },
  { name: "Hoàng Ngọc Chiêu", birthDate: "15/01/1976", title: "Thẩm phán bậc 3", activeCases: 2, suspendedCases: 0, overdueCases: 0, overturnedSubjective1Y: 0, specialty: "Hành chính", level: "bac-3" },
  { name: "Đinh Văn Phúc", birthDate: "05/08/1971", title: "Thẩm phán TAND tối cao", activeCases: 5, suspendedCases: 1, overdueCases: 0, overturnedSubjective1Y: 0, specialty: "Dân sự", level: "toi-cao", office: "Tòa Phúc thẩm" },
];
const eligibleJudges = (level: JudgeLevel) => ALL_JUDGES.filter(j => j.level === level && j.title !== "Chánh án" && !(level === "toi-cao" && j.office === "Tòa Phúc thẩm") && !j.unavailableReason);

const caseSpecialty = (r: DonRecord): string => {
  const key = `${r.soBA} ${r.hinhThucDon}`.toUpperCase();
  if (key.includes("HS")) return "Hình sự";
  if (key.includes("HC")) return "Hành chính";
  if (key.includes("KDTM")) return "KDTM";
  if (key.includes("DS")) return "Dân sự";
  return "";
};

// Drawio "Tiêu chí phân công TP": loại trừ trước; ưu tiên chuyên môn; cân bằng vụ đang xử lý;
// nếu bằng nhau: nhiều vụ tạm đình chỉ hơn → ít án quá hạn hơn → ít án bị hủy/sửa do lỗi chủ quan hơn → tên tiếng Việt.
const chooseJudgeByDrawio = (r: DonRecord, level: JudgeLevel, dynamicLoad: Record<string, number>): JudgeMeta | undefined => {
  const all = eligibleJudges(level);
  const specialty = caseSpecialty(r);
  const matched = specialty ? all.filter(j => j.specialty.toLowerCase().includes(specialty.toLowerCase())) : [];
  const pool = matched.length ? matched : all;
  return [...pool].sort((a,b) => {
    const loadA = a.activeCases + (dynamicLoad[a.name] || 0);
    const loadB = b.activeCases + (dynamicLoad[b.name] || 0);
    if (loadA !== loadB) return loadA - loadB;
    if (a.suspendedCases !== b.suspendedCases) return b.suspendedCases - a.suspendedCases;
    if (a.overdueCases !== b.overdueCases) return a.overdueCases - b.overdueCases;
    if (a.overturnedSubjective1Y !== b.overturnedSubjective1Y) return a.overturnedSubjective1Y - b.overturnedSubjective1Y;
    return a.name.localeCompare(b.name, "vi");
  })[0];
};
const judgeLabel = (name: string) => { const j = ALL_JUDGES.find(x => x.name === name); return j ? `${j.name} - ${j.birthDate} / ${j.title}` : name; };
const FORM_LABEL: Record<FormType,string> = { "ho-so-khang-nghi":"Hồ sơ kháng nghị GĐT, TT", "don-tpb3-gq":"Đơn TPB3 GQ cần phân công TPTC", "ho-so-tu-hinh":"Hồ sơ tử hình", "cong-van-trao-doi":"Công văn trao đổi" };
const formOptions = (level: JudgeLevel): FormType[] => level === "bac-3" ? ["cong-van-trao-doi"] : ["ho-so-khang-nghi","don-tpb3-gq","ho-so-tu-hinh","cong-van-trao-doi"];

interface DonRecord {
  id: number; form: FormType; soThuLy: string; ngayThuLy: string; nguoiDungDon: string; hinhThucDon: string;
  soBA: string; ngayBA: string; toaBA: string; thoiHieu: string; ngayPhanCong: string; thamPhan: string; ghiChu: string;
  soKhangNghi?: string; ngayKhangNghi?: string; nguoiKhangNghi?: string; soLuongBiAn?: number; soCV?: string; ngayCV?: string; noiGui?: string;
  soToTrinhThayDoi?: string; suggestedJudge?: string; level: JudgeLevel; status: "random"|"manual"|"assigned";
}
const BASE: DonRecord[] = [
  { id:1, form:"ho-so-khang-nghi", soThuLy:"4/2026/TL-GĐT", ngayThuLy:"29/06/2026", nguoiDungDon:"Chu Văn An", hinhThucDon:"Hồ sơ kháng nghị", soBA:"123/2026/HS-PT", ngayBA:"23/06/2026", toaBA:"TAND tỉnh Cần Thơ", thoiHieu:"3 năm", ngayPhanCong:"-", thamPhan:"-", ghiChu:"", soKhangNghi:"15/KN-VKS", ngayKhangNghi:"25/06/2026", nguoiKhangNghi:"VKSND tối cao", level:"toi-cao", status:"manual" },
  { id:2, form:"don-tpb3-gq", soThuLy:"5/2026/TL-GĐT", ngayThuLy:"29/06/2026", nguoiDungDon:"Nguyễn Văn Minh", hinhThucDon:"Đơn đề nghị GĐT,TT", soBA:"102/2026/DS-PT", ngayBA:"20/06/2026", toaBA:"TAND TP Hà Nội", thoiHieu:"3 năm - còn 28 ngày", ngayPhanCong:"-", thamPhan:"-", ghiChu:"Vụ án TPB3 giải quyết có đề xuất kháng nghị", suggestedJudge:"Nguyễn Văn A", level:"toi-cao", status:"manual" },
  { id:3, form:"ho-so-tu-hinh", soThuLy:"12/2026/TL-TH", ngayThuLy:"02/07/2026", nguoiDungDon:"Trần Thị Mai", hinhThucDon:"Hồ sơ tử hình", soBA:"88/2026/HS-PT", ngayBA:"15/06/2026", toaBA:"TAND TP Đà Nẵng", thoiHieu:"Không xác định", ngayPhanCong:"-", thamPhan:"-", ghiChu:"", soLuongBiAn:2, level:"toi-cao", status:"manual" },
  { id:4, form:"cong-van-trao-doi", soThuLy:"18/2026/TL-CV", ngayThuLy:"05/07/2026", nguoiDungDon:"-", hinhThucDon:"Công văn trao đổi", soBA:"-", ngayBA:"-", toaBA:"-", thoiHieu:"-", ngayPhanCong:"-", thamPhan:"-", ghiChu:"", soCV:"125/CV-TANDTC", ngayCV:"05/07/2026", noiGui:"TAND tỉnh Bắc Ninh", level:"bac-3", status:"random" },
  { id:5, form:"cong-van-trao-doi", soThuLy:"19/2026/TL-CV", ngayThuLy:"06/07/2026", nguoiDungDon:"-", hinhThucDon:"Công văn trao đổi", soBA:"-", ngayBA:"-", toaBA:"-", thoiHieu:"-", ngayPhanCong:"-", thamPhan:"-", ghiChu:"", soCV:"126/CV-VKS", ngayCV:"06/07/2026", noiGui:"VKSND tối cao", level:"toi-cao", status:"random" },
];

interface Batch { id:number; ngay:string; ids:number[]; account:string; receiveRange:string; mode:string; }

const field: React.CSSProperties = { width:"100%",boxSizing:"border-box",padding:"7px 9px",border:`1px solid ${BORDER}`,borderRadius:4,fontFamily:F,fontSize:12,background:"#fff",color:TEXT };
const label: React.CSSProperties = { fontSize:11,fontWeight:600,color:MUTED,display:"block",marginBottom:4 };
const primary: React.CSSProperties = { border:0,background:RED,color:"#fff",borderRadius:4,padding:"7px 16px",cursor:"pointer",fontFamily:F,fontWeight:700,fontSize:12 };
const secondary: React.CSSProperties = { border:`1px solid ${BORDER}`,background:"#fff",color:TEXT,borderRadius:4,padding:"7px 14px",cursor:"pointer",fontFamily:F,fontWeight:600,fontSize:12 };

function DynamicInfo({ r }: { r:DonRecord }) {
  if (r.form === "ho-so-khang-nghi") return <div><b>Số/Ngày thụ lý XX:</b> {r.soThuLy} - {r.ngayThuLy}<br/><b>Kháng nghị:</b> {r.soKhangNghi} - {r.ngayKhangNghi}<br/><b>Người kháng nghị:</b> {r.nguoiKhangNghi}<br/><b>Loại:</b> Hồ sơ kháng nghị</div>;
  if (r.form === "ho-so-tu-hinh") return <div><b>BA/QĐ:</b> {r.soBA} - {r.ngayBA}<br/><b>Tòa:</b> {r.toaBA}<br/><b>Số lượng bị án tử hình:</b> {r.soLuongBiAn}</div>;
  if (r.form === "cong-van-trao-doi") return <div><b>Số CV:</b> {r.soCV}<br/><b>Ngày CV:</b> {r.ngayCV}<br/><b>Nơi gửi:</b> {r.noiGui}</div>;
  return <div><b>Số/Ngày thụ lý:</b> {r.soThuLy} - {r.ngayThuLy}<br/><b>Người đứng đơn:</b> {r.nguoiDungDon}<br/><b>BA/QĐ:</b> {r.soBA} - {r.ngayBA}<br/><b>Thời hiệu:</b> {r.thoiHieu}</div>;
}

function JudgeListModal({ onClose }: { onClose:()=>void }) { return <div style={{position:"fixed",inset:0,zIndex:5000,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"#fff",width:"100%",maxWidth:780,borderRadius:8,overflow:"hidden"}}><div style={{padding:14,display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`}}><b style={{color:RED}}><Users size={17} style={{verticalAlign:"middle"}}/> Danh sách thẩm phán</b><button onClick={onClose} style={{border:0,background:"none"}}><X/></button></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH_STYLE}>STT</th><th style={TH_STYLE}>Thẩm phán</th><th style={TH_STYLE}>Chức danh</th><th style={TH_STYLE}>Lĩnh vực xử lý chuyên môn</th><th style={TH_STYLE}>Số vụ đang giải quyết</th><th style={TH_STYLE}>Tạm đình chỉ</th><th style={TH_STYLE}>Quá hạn</th><th style={TH_STYLE}>Hủy/sửa lỗi chủ quan 1 năm</th></tr></thead><tbody>{ALL_JUDGES.filter(j=>j.title!=="Chánh án" && j.office!=="Tòa Phúc thẩm").map((j,i)=><tr key={j.name}><td style={TD_STYLE}>{i+1}</td><td style={TD_STYLE}><b>{j.name}</b><br/><small>{j.birthDate}</small></td><td style={TD_STYLE}>{j.title}</td><td style={TD_STYLE}>{j.specialty}</td><td style={TD_STYLE}>{j.activeCases} vụ</td><td style={TD_STYLE}>{j.suspendedCases}</td><td style={TD_STYLE}>{j.overdueCases}</td><td style={TD_STYLE}>{j.overturnedSubjective1Y}</td></tr>)}</tbody></table><div style={{padding:12,textAlign:"right"}}><button onClick={onClose} style={secondary}>Đóng</button></div></div></div>; }

function EditBatchModal({ batch, records, setRecords, onClose }: { batch:Batch; records:DonRecord[]; setRecords:React.Dispatch<React.SetStateAction<DonRecord[]>>; onClose:()=>void }) {
  const batchRows=records.filter(r=>batch.ids.includes(r.id)); const [selected,setSelected]=React.useState(batchRows.map(r=>r.id)); const [judge,setJudge]=React.useState(batchRows[0]?.thamPhan || ""); const original=batchRows[0]?.thamPhan || "";
  const [requester,setRequester]=React.useState(""); const [reason,setReason]=React.useState(""); const [dirty,setDirty]=React.useState(false); const [error,setError]=React.useState(false);
  const changed=judge!==original;
  const close=()=>{ if(dirty && !confirm("Bạn chưa lưu thay đổi phân công. Thoát?")) return; onClose(); };
  const save=()=>{ if(changed && (!requester.trim()||!reason.trim())){setError(true);alert("Bổ sung các thông tin bắt buộc trước khi Lưu sửa đổi");return;} setRecords(prev=>prev.map(r=>selected.includes(r.id)?{...r,thamPhan:judge,ngayPhanCong:todayVi(),ghiChu:changed?`${requester}: ${reason}`:r.ghiChu,soToTrinhThayDoi:changed?`${100+r.id}/TT-PC`:(r.soToTrinhThayDoi||"-")}:r)); setDirty(false); alert(`Thay đổi thẩm phán cho ${selected.length} đơn/vụ`); };
  return <div style={{position:"fixed",inset:0,zIndex:5100,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}><div style={{background:"#fff",width:"100%",maxWidth:1120,maxHeight:"94vh",overflow:"auto",borderRadius:8,fontFamily:F}}><div style={{padding:14,display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`}}><b style={{color:RED}}>Sửa kết quả phân công</b><button onClick={close} style={{border:0,background:"none"}}><X/></button></div>
  <div style={{padding:18,display:"grid",gap:14}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>{["Bậc thẩm phán","Thời gian phân công","Hình thức phân công","Người đứng đơn","Số BA/QĐ","Ngày BA/QĐ","Tòa ra BA/QĐ","Số thụ lý"].map(x=><div key={x}><span style={label}>{x}</span><input placeholder={x} style={field}/></div>)}</div>
  <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH_STYLE}></th><th style={TH_STYLE}>Thông tin hồ sơ</th><th style={TH_STYLE}>Số tờ trình (thay đổi phân công)</th><th style={TH_STYLE}>Ngày phân công</th><th style={TH_STYLE}>Thẩm phán</th><th style={TH_STYLE}>Ghi chú</th></tr></thead><tbody>{batchRows.map(r=><tr key={r.id}><td style={TD_STYLE}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></td><td style={TD_STYLE}><DynamicInfo r={r}/></td><td style={TD_STYLE}>{r.soToTrinhThayDoi||"-"}</td><td style={TD_STYLE}>{r.ngayPhanCong}</td><td style={TD_STYLE}>{judgeLabel(r.thamPhan)}</td><td style={TD_STYLE}>{r.ghiChu||"-"}</td></tr>)}</tbody></table>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><div><span style={label}>Ngày phân công</span><input value={TODAY} readOnly style={{...field,background:"#f3f4f6"}}/></div><div><span style={label}>Thẩm phán</span><select value={judge} onChange={e=>{setJudge(e.target.value);setDirty(true)}} style={field}>{eligibleJudges(batchRows[0]?.level||"toi-cao").map(j=><option key={j.name}>{j.name}</option>)}</select></div><div/></div>
  {changed&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:12,background:"#fff1f2",border:"1px solid #fecdd3",borderRadius:6}}><div><span style={label}>Người yêu cầu thay đổi *</span><input value={requester} onChange={e=>{setRequester(e.target.value);setDirty(true);setError(false)}} style={{...field,background:"#fff7f8",borderColor:error&&!requester?RED:BORDER}}/></div><div><span style={label}>Lý do thay đổi *</span><input value={reason} onChange={e=>{setReason(e.target.value);setDirty(true);setError(false)}} style={{...field,background:"#fff7f8",borderColor:error&&!reason?RED:BORDER}}/></div></div>}
  </div><div style={{padding:12,borderTop:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between"}}><button onClick={close} style={secondary}>Quay lại</button><div style={{display:"flex",gap:8}}><button onClick={()=>window.print()} style={secondary}><Printer size={13}/> In danh sách TP</button><button onClick={save} style={primary}>Lưu sửa đổi</button></div></div></div></div>;
}

export function PhanCongThamPhanView() {
  const [activeTab,setActiveTab]=React.useState<"ngau-nhien"|"chi-dinh"|"ket-qua">("chi-dinh"); const [level,setLevel]=React.useState<JudgeLevel>("toi-cao"); const [form,setForm]=React.useState<FormType>("don-tpb3-gq"); const [records,setRecords]=React.useState(BASE);
  const [selected,setSelected]=React.useState<number[]>([1]); const [bulkJudge,setBulkJudge]=React.useState(""); const [permission,setPermission]=React.useState<UserPermission>("pho-chanh-an"); const canEdit=permission==="pho-chanh-an";
  const [batches,setBatches]=React.useState<Batch[]>([{id:1,ngay:"08/07/2026 09:15",ids:[1,2],account:"PCA.NGUYENVANTI",receiveRange:"29/06/2026 - 02/07/2026",mode:"Chỉ định"}]); const [editBatch,setEditBatch]=React.useState<Batch|null>(null); const [judgeModal,setJudgeModal]=React.useState(false); const [dirty,setDirty]=React.useState(false);
  const [filters,setFilters]=React.useState({soBA:"",soTL:"",nguoi:""}); const [searched,setSearched]=React.useState(false);
  React.useEffect(()=>{ const opts=formOptions(level); if(!opts.includes(form)) setForm(opts[0]); },[level]);
  const askTab=(t:typeof activeTab)=>{ if(dirty&&!confirm("Bạn chưa lưu thay đổi phân công. Thoát?"))return;setDirty(false);setActiveTab(t);setSelected([]); };
  const candidates=records.filter(r=>r.status===(activeTab==="ngau-nhien"?"random":"manual")&&r.level===level&&r.form===form).filter(r=>!searched||((!filters.soBA||r.soBA.includes(filters.soBA))&&(!filters.soTL||r.soThuLy.includes(filters.soTL))&&(!filters.nguoi||r.nguoiDungDon.toLowerCase().includes(filters.nguoi.toLowerCase()))));
  const assign=()=>{
    if(!canEdit){alert("Tài khoản chỉ có quyền xem.");return;}
    const ids=activeTab==="ngau-nhien"?candidates.map(r=>r.id):selected;
    if(!ids.length){alert("Vui lòng chọn hồ sơ cần phân công.");return;}
    if(activeTab==="ngau-nhien"){
      const dynamicLoad:Record<string,number>={};
      const assignedById:Record<number,string>={};
      candidates.filter(r=>ids.includes(r.id)).forEach(r=>{
        const j=chooseJudgeByDrawio(r,level,dynamicLoad);
        if(j){assignedById[r.id]=j.name;dynamicLoad[j.name]=(dynamicLoad[j.name]||0)+1;}
      });
      if(Object.keys(assignedById).length!==ids.length){alert("Không tìm được đủ Thẩm phán đáp ứng tiêu chí phân công.");return;}
      setRecords(prev=>prev.map(r=>assignedById[r.id]?{...r,status:"assigned",thamPhan:assignedById[r.id],ngayPhanCong:todayVi()}:r));
      const b={id:Date.now(),ngay:new Date().toLocaleString("vi-VN"),ids,account:"PCA.NGUYENVANTI",receiveRange:"Từ ngày nhận sớm nhất đến muộn nhất",mode:"Ngẫu nhiên theo tiêu chí Drawio"};
      setBatches(x=>[b,...x]);setSelected([]);setDirty(false);alert(`Đã phân công ${ids.length} hồ sơ theo tiêu chí Drawio.`);setActiveTab("ket-qua");return;
    }
    const judge=bulkJudge;
    if(!judge){alert("Vui lòng chọn Thẩm phán.");return;}
    setRecords(prev=>prev.map(r=>ids.includes(r.id)?{...r,status:"assigned",thamPhan:judge,ngayPhanCong:todayVi()}:r));
    const b={id:Date.now(),ngay:new Date().toLocaleString("vi-VN"),ids,account:"PCA.NGUYENVANTI",receiveRange:"Từ ngày nhận sớm nhất đến muộn nhất",mode:"Chỉ định"};
    setBatches(x=>[b,...x]);setSelected([]);setDirty(false);alert(`Đã phân công ${ids.length} hồ sơ cho ${judge}`);setActiveTab("ket-qua");
  };
  const deleteBatch=(b:Batch)=>{ if(!canEdit){alert("Tài khoản chỉ có quyền xem.");return;} if(!confirm("Bạn có chắc chắn muốn hủy kết quả phân công?"))return; setRecords(prev=>prev.map(r=>b.ids.includes(r.id)?{...r,status:"manual",thamPhan:"-",ngayPhanCong:"-"}:r)); setBatches(x=>x.filter(y=>y.id!==b.id)); alert("Đã hủy kết quả phân công, hồ sơ được trả về danh sách chưa phân công."); };
  return <div style={{height:"100%",overflow:"auto",background:"#f8fafc",fontFamily:F}}><div style={{padding:"10px 24px",background:"#fff",borderBottom:`1px solid ${BORDER}`,fontSize:12,color:MUTED}}>Trang chủ / Giám đốc, kiểm tra / <b style={{color:TEXT}}>Phân công thẩm phán</b></div><div style={{padding:22,display:"grid",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1 style={{fontSize:18,margin:0}}>Phân công thẩm phán</h1><label style={{fontSize:12}}>Vai trò demo: <select value={permission} onChange={e=>setPermission(e.target.value as UserPermission)} style={{...field,width:180}}><option value="pho-chanh-an">Phó Chánh án - thao tác</option><option value="vu-truong">Vụ trưởng - chỉ xem</option><option value="tham-phan">Thẩm phán được PC - chỉ xem</option></select></label></div>
    <div style={{display:"flex",gap:26,borderBottom:`1px solid ${BORDER}`}}>{[["ngau-nhien","DS chưa phân công ngẫu nhiên"],["chi-dinh","DS chưa phân công chỉ định"],["ket-qua","Quản lý kết quả phân công"]].map(([id,l])=><button key={id} onClick={()=>askTab(id as any)} style={{padding:"10px 4px",border:0,borderBottom:activeTab===id?`3px solid ${RED}`:"3px solid transparent",background:"none",color:activeTab===id?RED:MUTED,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
    {activeTab!=="ket-qua"?<>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,padding:15,display:"grid",gap:12}}><div style={{display:"flex",gap:24}}><label><input type="radio" checked={level==="bac-3"} onChange={()=>setLevel("bac-3")}/> Thẩm phán bậc 3</label><label><input type="radio" checked={level==="toi-cao"} onChange={()=>setLevel("toi-cao")}/> Thẩm phán tối cao</label></div><div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr",gap:10}}><div><span style={label}>Hình thức phân công</span><select value={form} onChange={e=>setForm(e.target.value as FormType)} style={field}>{formOptions(level).map(x=><option key={x} value={x}>{FORM_LABEL[x]}</option>)}</select></div><div><span style={label}>Số BA/QĐ</span><input value={filters.soBA} onChange={e=>setFilters(f=>({...f,soBA:e.target.value}))} style={field}/></div><div><span style={label}>Số thụ lý</span><input value={filters.soTL} onChange={e=>setFilters(f=>({...f,soTL:e.target.value}))} style={field}/></div><div><span style={label}>Người đứng đơn</span><input value={filters.nguoi} onChange={e=>setFilters(f=>({...f,nguoi:e.target.value}))} style={field}/></div></div><div style={{display:"flex",justifyContent:"space-between"}}><button onClick={()=>setJudgeModal(true)} style={{border:0,background:"none",color:"#2563eb",cursor:"pointer"}}>Danh sách thẩm phán</button><div style={{display:"flex",gap:8}}><button onClick={()=>setSearched(true)} style={primary}><Search size={13}/> Tìm kiếm</button><button onClick={()=>{setFilters({soBA:"",soTL:"",nguoi:""});setSearched(false)}} style={secondary}><RotateCcw size={13}/> Xóa bộ lọc</button></div></div></section>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:MUTED}}>{activeTab==="ngau-nhien"?"Phân công ngẫu nhiên không cần chọn từng dòng":`Đã chọn ${selected.length} hồ sơ`}</span><div style={{display:"flex",gap:8}}>{activeTab==="chi-dinh"&&<select value={bulkJudge} onChange={e=>{setBulkJudge(e.target.value);setDirty(true)}} disabled={!canEdit} style={{...field,width:290}}><option value="">-- Chọn thẩm phán --</option>{eligibleJudges(level).map(j=><option key={j.name} value={j.name}>{judgeLabel(j.name)}</option>)}</select>}<button onClick={assign} disabled={!canEdit} style={{...primary,opacity:canEdit?1:.5}}>Phân công {activeTab==="ngau-nhien"?"ngẫu nhiên":"chỉ định"}</button></div></div>
      {activeTab==="ngau-nhien"&&<div style={{padding:"9px 12px",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:6,color:"#065f46",fontSize:11}}>Drawio – Tiêu chí phân công TP: loại người không đủ điều kiện → ưu tiên đúng chuyên môn → ít vụ đang xử lý → nhiều vụ tạm đình chỉ → ít án quá hạn → ít án bị hủy/sửa do lỗi chủ quan → thứ tự tên tiếng Việt. Mỗi hồ sơ được tính lại tải sau khi phân công.</div>}
      <div style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:1050}}><thead><tr>{activeTab==="chi-dinh"&&<th style={TH_STYLE}></th>}<th style={TH_STYLE}>STT</th><th style={TH_STYLE}>Thông tin hồ sơ theo hình thức</th><th style={TH_STYLE}>Thông tin BA/QĐ</th><th style={TH_STYLE}>Thời hiệu</th><th style={TH_STYLE}>Ngày phân công</th><th style={TH_STYLE}>Thẩm phán</th><th style={TH_STYLE}>Ghi chú</th></tr></thead><tbody>{candidates.length?candidates.map((r,i)=><tr key={r.id} style={{background:selected.includes(r.id)?"#fef2f2":"#fff"}}>{activeTab==="chi-dinh"&&<td style={TD_STYLE}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></td>}<td style={TD_STYLE}>{i+1}</td><td style={TD_STYLE}><DynamicInfo r={r}/></td><td style={TD_STYLE}>Số: {r.soBA}<br/>Ngày: {r.ngayBA}<br/>Tại: {r.toaBA}</td><td style={TD_STYLE}>{r.thoiHieu}</td><td style={TD_STYLE}>{r.form==="ho-so-tu-hinh"?<input value={TODAY} readOnly style={{...field,background:"#f3f4f6"}}/>:"Mặc định realtime khi lưu"}</td><td style={TD_STYLE}>{r.suggestedJudge&&<div style={{fontSize:10,color:MUTED}}>Gợi ý từ tờ trình: {r.suggestedJudge}</div>}<span>{r.thamPhan}</span></td><td style={TD_STYLE}>{r.form==="don-tpb3-gq"?(r.ghiChu||"Vụ án TPB3 giải quyết có đề xuất kháng nghị"):r.ghiChu||"-"}</td></tr>):<tr><td colSpan={8} style={{...TD_STYLE,textAlign:"center",padding:28}}>Không có dữ liệu phù hợp.</td></tr>}</tbody></table></div>
    </>:<>
      <section style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,padding:15}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}><div><span style={label}>Bậc thẩm phán phân công</span><select style={field}><option>Tất cả</option><option>Thẩm phán bậc 3</option><option>Thẩm phán tối cao</option></select></div><div><span style={label}>Thời gian phân công</span><input type="date" style={field}/></div><div><span style={label}>Hình thức phân công</span><select style={field}><option>Tất cả</option>{Object.entries(FORM_LABEL).map(([k,v])=><option key={k}>{v}</option>)}</select></div><div><span style={label}>Thẩm phán</span><select style={field}><option>Tất cả</option>{ALL_JUDGES.filter(j=>j.title!=="Chánh án"&&j.office!=="Tòa Phúc thẩm").map(j=><option key={j.name}>{judgeLabel(j.name)}</option>)}</select></div></div></section>
      <div style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:7,overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH_STYLE}>Ngày phân công</th><th style={TH_STYLE}>Số lượng đơn/vụ/hồ sơ</th><th style={TH_STYLE}>TK thực hiện</th><th style={TH_STYLE}>Thời gian nhận đơn</th><th style={TH_STYLE}>Hình thức PC</th><th style={TH_STYLE}>Thao tác</th></tr></thead><tbody>{batches.map(b=><tr key={b.id}><td style={TD_STYLE}>{b.ngay}</td><td style={TD_STYLE}>{b.ids.length}</td><td style={TD_STYLE}>{b.account}</td><td style={TD_STYLE}>{b.receiveRange}</td><td style={TD_STYLE}>{b.mode}</td><td style={TD_STYLE}><div style={{display:"flex",gap:6}}><button title="Sửa" disabled={!canEdit} onClick={()=>setEditBatch(b)} style={{border:0,background:"none",cursor:"pointer"}}><Pencil size={15}/></button><button title="In" onClick={()=>window.print()} style={{border:0,background:"none",cursor:"pointer"}}><Printer size={15}/></button><button title="Xóa" disabled={!canEdit} onClick={()=>deleteBatch(b)} style={{border:0,background:"none",cursor:"pointer",color:RED}}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>
    </>}
  </div>{judgeModal&&<JudgeListModal onClose={()=>setJudgeModal(false)}/>} {editBatch&&<EditBatchModal batch={editBatch} records={records} setRecords={setRecords} onClose={()=>setEditBatch(null)}/>}</div>;
}
export default PhanCongThamPhanView;
