import React, { useMemo, useState } from "react";
import { BarChart3, CalendarDays, FileText, Gavel, Printer, Scale, Users } from "lucide-react";
import { BORDER, F, MUTED, RED, TEXT, type UserRoleType } from "./shared";

type DashboardTarget = "don-cho-phe-duyet" | "quan-ly-vu-an" | "quan-ly-vu-xet-xu" | "an-quoc-hoi" | "an-thoi-hieu";

const VU_LABEL: Record<string, string> = {
  "vu-1": "Vụ I - Hình sự", "hinh-su": "Vụ I - Hình sự",
  "vu-2": "Vụ II - Dân sự", "dan-su": "Vụ II - Dân sự",
  "vu-3": "Vụ III - KDTM/Lao động/HNGĐ",
  "vu-4": "Vụ IV - Hành chính", "hanh-chinh": "Vụ IV - Hành chính",
  "toan-bo": "Vụ GĐ,KT",
};

const processRows = [
  ["Phân công TTV", 9, 48, 5, 7],
  ["Hồ sơ", 11, 46, 4, 8],
  ["Chưa có tờ trình", 12, 21, 3, 5],
  ["Phó vụ trưởng", 4, 13, 1, 2],
  ["Vụ trưởng", 3, 10, 1, 2],
  ["TP có ý kiến", 2, 8, 1, 1],
  ["TP không có ý kiến", 1, 4, 0, 1],
  ["Xác minh, bổ sung", 3, 6, 1, 1],
  ["Phó CA", 1, 3, 0, 1],
  ["Tổ TP / Chánh án / HĐTP", 2, 5, 1, 1],
];

const staff = [
  ["Nguyễn Văn A", "TTV chính", 14, 6, 20, 13, 4, 2, 19, "65%", "79%"],
  ["Trần Thị B", "Thẩm tra viên", 9, 4, 13, 10, 2, 1, 13, "77%", "81%"],
  ["Lê Văn C", "TPB3", 7, 5, 12, 9, 2, 2, 13, "75%", "87%"],
  ["Phạm Thị D", "Phó Vụ trưởng", 5, 2, 7, 6, 1, 1, 8, "86%", "89%"],
];

function StatCard({ icon, label, value, note, onClick }: { icon: React.ReactNode; label: string; value: number; note?: string; onClick?: () => void }) {
  return <button onClick={onClick} style={{ textAlign: "left", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, cursor: onClick ? "pointer" : "default", minHeight: 105, fontFamily: F }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, color: MUTED }}>{label}</span>{icon}</div>
    <div style={{ fontSize: 28, lineHeight: 1.25, fontWeight: 800, color: TEXT, marginTop: 8 }}>{value.toLocaleString("vi-VN")}</div>
    {note && <div style={{ fontSize: 10.5, color: MUTED, marginTop: 4 }}>{note}</div>}
  </button>;
}

function MiniBars({ title, items, onClick }: { title: string; items: { label: string; value: number }[]; onClick?: (label: string) => void }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, minHeight: 250 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 14 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(i => <button key={i.label} onClick={() => onClick?.(i.label)} style={{ display: "grid", gridTemplateColumns: "150px 1fr 42px", alignItems: "center", gap: 8, border: 0, background: "transparent", padding: 0, cursor: onClick ? "pointer" : "default", fontFamily: F }}>
        <span style={{ textAlign: "left", fontSize: 11, color: TEXT }}>{i.label}</span>
        <span style={{ height: 12, background: "#f3f4f6", borderRadius: 20, overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${Math.max(4, i.value / max * 100)}%`, background: "#8b0000", borderRadius: 20 }} /></span>
        <b style={{ fontSize: 11, color: TEXT, textAlign: "right" }}>{i.value}</b>
      </button>)}
    </div>
  </div>;
}

export default function DashboardGDKTView({ userRole = "toan-bo", onNavigate }: { userRole?: UserRoleType; onNavigate?: (v: DashboardTarget) => void }) {
  const [period, setPeriod] = useState("Tháng");
  const [staffFilter, setStaffFilter] = useState("Tất cả");
  const vu = VU_LABEL[userRole] || VU_LABEL["toan-bo"];
  const stats = useMemo(() => ({ don: 37, vu: 86, qh: 14, th: 19 }), [period, userRole]);
  const gqd = [
    { label: "Đã giải quyết", value: 42 }, { label: "Đã có tờ trình", value: 18 }, { label: "Chưa có tờ trình", value: 14 }, { label: "Chưa phân công TTV", value: 12 }, { label: "Tổng vụ GQĐ", value: 86 },
  ];
  const xx = [
    { label: "Quá hạn chưa xét xử", value: 7 }, { label: "Chưa xét xử", value: 23 }, { label: "Rút kháng nghị", value: 5 }, { label: "Chuyển thẩm quyền", value: 4 }, { label: "Đã xét xử", value: 39 },
  ];
  const thoiHieu = [
    { label: "Vụ án khác >3 tháng", value: 47 }, { label: "Án thời hiệu <3 tháng", value: 19 }, { label: "Án quá hạn", value: 8 }, { label: "Tổng phải giải quyết", value: 86 },
  ];
  return <div style={{ padding: 20, background: "#f8fafc", height: "100%", overflow: "auto", fontFamily: F }}>
    <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>Trang chủ › Dashboard Vụ GĐ,KT</div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
      <div style={{ flex: 1 }}><h2 style={{ margin: 0, color: TEXT, fontSize: 20 }}>{vu}: Đang giải quyết (86)</h2><div style={{ color: MUTED, fontSize: 11, marginTop: 3 }}>Tổng quan nhận đơn, giải quyết đơn và xét xử GĐT/TT</div></div>
      <label style={{ fontSize: 11, color: MUTED }}>Thời gian&nbsp;
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: "7px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F }}>
          {["Tùy chọn", "Hôm nay", "Tuần", "Tháng", "Quý", "Năm"].map(x => <option key={x}>{x}</option>)}
        </select>
      </label>
      <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontFamily: F }}><Printer size={14}/>In báo cáo</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, marginBottom: 12 }}>
      <StatCard icon={<FileText size={19} color="#2563eb"/>} label="Tổng đơn chưa thuộc vụ án" value={stats.don} onClick={() => onNavigate?.("don-cho-phe-duyet")} />
      <StatCard icon={<Scale size={19} color="#047857"/>} label="Tổng vụ án đang giải quyết" value={stats.vu} onClick={() => onNavigate?.("quan-ly-vu-an")} />
      <StatCard icon={<Gavel size={19} color="#7c3aed"/>} label="Án Quốc Hội đang giải quyết" value={stats.qh} onClick={() => onNavigate?.("an-quoc-hoi")} />
      <StatCard icon={<CalendarDays size={19} color="#c2410c"/>} label="Án thời hiệu <3 tháng" value={stats.th} note="Tính theo quy tắc thời hiệu trong SRS" onClick={() => onNavigate?.("an-thoi-hieu")} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
      <MiniBars title="Trạng thái thụ lý giải quyết đơn" items={gqd} onClick={() => onNavigate?.("quan-ly-vu-an")} />
      <MiniBars title="Trạng thái thụ lý xét xử" items={xx} onClick={() => onNavigate?.("quan-ly-vu-xet-xu")} />
    </div>

    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, marginBottom: 12, overflowX: "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Thông tin quá trình vụ giải quyết đơn theo loại án</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: "#f8fafc" }}>{["Quá trình", "Hình sự", "Dân sự", "KDTM/LĐ/HNGĐ", "Hành chính"].map(h => <th key={h} style={{ padding: 8, border: `1px solid ${BORDER}`, textAlign: "left" }}>{h}</th>)}</tr></thead><tbody>
        {processRows.map((r,i)=><tr key={String(r[0])} style={{ background: i%2?"#fff":"#fcfcfc" }}>{r.map((v,j)=><td key={j} style={{ padding: 8, border: `1px solid ${BORDER}`, textAlign:j?"center":"left", color:j?TEXT:MUTED }}>{v}</td>)}</tr>)}
      </tbody></table>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
      <MiniBars title="Thống kê vụ án đang giải quyết theo thời hiệu" items={thoiHieu} onClick={(l) => onNavigate?.(l.includes("<3") ? "an-thoi-hieu" : "quan-ly-vu-an")} />
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Án Quốc Hội / Án thời hiệu &lt;3 tháng theo loại án</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{background:"#f8fafc"}}>{["Loại án","Án QH","<3 tháng"].map(h=><th key={h} style={{padding:7,border:`1px solid ${BORDER}`,textAlign:"left"}}>{h}</th>)}</tr></thead><tbody>
          {[['Hình sự',5,7],['Dân sự',4,6],['KDTM/LĐ/HNGĐ',3,4],['Hành chính',2,2],['Tổng',14,19]].map((r,i)=><tr key={String(r[0])}><td style={{padding:7,border:`1px solid ${BORDER}`,fontWeight:i===4?700:400}}>{r[0]}</td><td style={{padding:7,border:`1px solid ${BORDER}`,textAlign:'center'}}>{r[1]}</td><td style={{padding:7,border:`1px solid ${BORDER}`,textAlign:'center'}}>{r[2]}</td></tr>)}
        </tbody></table>
      </div>
    </div>

    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Users size={17} color={RED}/><b style={{ fontSize: 13 }}>Hiệu suất giải quyết đơn của cán bộ Vụ GĐ,KT</b><span style={{ flex: 1 }}/><select value={staffFilter} onChange={e=>setStaffFilter(e.target.value)} style={{padding:"6px 8px",border:`1px solid ${BORDER}`,borderRadius:4,fontFamily:F}}>{["Tất cả","TTV chính/TPB1/TPB2","Thẩm tra viên","TPB3","TPTC","Phó vụ trưởng","Vụ trưởng"].map(x=><option key={x}>{x}</option>)}</select></div>
      <table style={{ width: "100%", minWidth: 950, borderCollapse: "collapse", fontSize: 10.5 }}><thead><tr style={{background:"#f8fafc"}}>{["Họ tên","Chức vụ/chức danh","Cũ còn lại","Mới nhận","Phải GQ","Trả lời đơn","Kháng nghị","Xử lý khác","Đã GQ","Tỷ lệ GQ","Tỷ lệ XX"].map(h=><th key={h} style={{padding:7,border:`1px solid ${BORDER}`}}>{h}</th>)}</tr></thead><tbody>{staff.map((r,i)=><tr key={String(r[0])}>{r.map((v,j)=><td key={j} style={{padding:7,border:`1px solid ${BORDER}`,textAlign:j>1?'center':'left'}}>{v}</td>)}</tr>)}</tbody></table>
    </div>
    <div style={{fontSize:10,color:MUTED,marginTop:10}}>Ghi chú đối chiếu: các chỉ tiêu đã bị gạch bỏ trong SRS ("đơn chờ tiếp nhận/quá hạn tiếp nhận") không được dựng thành ô thống kê riêng. Click số/biểu đồ thực hiện drill-down sang danh sách tương ứng ở mức mockup.</div>
  </div>;
}
