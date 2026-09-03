import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  FileSignature,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";

const DANH_SACH_TPB3 = [
  "Lê Thị Thu Hiền", "Nguyễn Văn A", "Trần Văn B", "Phạm Văn C", "Đinh Thị Vân Anh",
  "Nguyễn Thị Hương", "Vũ Đức Thiện", "Hoàng Ngọc Chiêu", "Lê Minh Tuấn", "Phạm Thị Bích Ngọc",
];

const DANH_SACH_TOA_AN = [
  "Tòa án nhân dân tối cao",
  "Tòa án nhân dân cấp cao tại Hà Nội",
  "Tòa án nhân dân cấp cao tại Đà Nẵng",
  "Tòa án nhân dân cấp cao tại TP Hồ Chí Minh",
  "Tòa án nhân dân TP Hà Nội",
  "Tòa án nhân dân tỉnh Bắc Ninh",
  "Tòa án nhân dân tỉnh Cần Thơ",
];

interface CaseTPTCRow {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  soDon: string;
  moTaDon: string;
  soBA: string;
  ngayBA: string;
  toaBA: string;
  capXetXu: string;
  qhpl?: string;
  ndkn: string;
  ndd: string;
  ttv: string;
  ldv: string;
  tp: string;
  soLanTrinhTPB3: number;
  soLanTrinh: number;
  soToTrinh: string;
  ngayToTrinh: string;
  nguoiTrinh: string;
  trangThaiKy: string;
  daTaoToTrinh: boolean;
}

const INITIAL_CHUA_TAO_TT: CaseTPTCRow[] = [
  {
    id: 1,
    soThuLy: "2329813",
    ngayThuLy: "10/06/2026",
    soDon: "Số đơn 3",
    moTaDon: "(2 đơn TLM)",
    soBA: "CVKN_GĐT",
    ngayBA: "20/07/2026",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "VŨ HUY HOÀNG",
    ndd: "NGUYỄN MINH PHONG",
    ttv: "Đinh Thị Vân Anh",
    ldv: "Lê Thị Thu Hiền",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 0,
    soLanTrinh: 0,
    soToTrinh: "-",
    ngayToTrinh: "-",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Chờ ký",
    daTaoToTrinh: false,
  },
  {
    id: 2,
    soThuLy: "2329813",
    ngayThuLy: "10/06/2026",
    soDon: "Số đơn 3",
    moTaDon: "(2 đơn TLM)",
    soBA: "CVKN_GĐT",
    ngayBA: "20/07/2026",
    toaBA: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "VŨ HUY HOÀNG",
    ndd: "NGUYỄN MINH PHONG",
    ttv: "Đinh Thị Vân Anh",
    ldv: "Lê Thị Thu Hiền",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 0,
    soLanTrinh: 0,
    soToTrinh: "-",
    ngayToTrinh: "-",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Chờ ký",
    daTaoToTrinh: false,
  },
];

const INITIAL_DA_TAO_TT: CaseTPTCRow[] = [
  {
    id: 101,
    soThuLy: "2330114",
    ngayThuLy: "15/06/2026",
    soDon: "Số đơn 1",
    moTaDon: "(1 đơn TLM)",
    soBA: "112/2026/HS-ST",
    ngayBA: "10/06/2026",
    toaBA: "Tòa án nhân dân TP Đà Nẵng",
    capXetXu: "Sơ thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "TRẦN VĂN ĐỒNG",
    ndd: "LÊ VĂN THUẬN",
    ttv: "Nguyễn Thị Hường",
    ldv: "Phạm Thị Bích Ngọc",
    tp: "Nguyễn Văn Cường",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "15/TT-TA",
    ngayToTrinh: "25/06/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 102,
    soThuLy: "2330452",
    ngayThuLy: "18/06/2026",
    soDon: "Số đơn 2",
    moTaDon: "(2 đơn TLM)",
    soBA: "78/2026/DS-PT",
    ngayBA: "12/06/2026",
    toaBA: "Tòa án nhân dân TP Hải Phòng",
    capXetXu: "Phúc thẩm",
    qhpl: "Tranh chấp hợp đồng dân sự",
    ndkn: "HOÀNG THỊ THỦY",
    ndd: "VŨ ĐÌNH TRỌNG",
    ttv: "Vũ Xuân Hiền",
    ldv: "Lê Thị Thu Hiền",
    tp: "Trần Hồng Hà",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "18/TT-TA",
    ngayToTrinh: "28/06/2026",
    nguoiTrinh: "Nguyễn Như Thắng - Vụ trưởng",
    trangThaiKy: "Đã trình ký",
    daTaoToTrinh: true,
  },
  {
    id: 103,
    soThuLy: "2330890",
    ngayThuLy: "20/06/2026",
    soDon: "Số đơn 4",
    moTaDon: "(3 đơn TLM)",
    soBA: "45/2026/HC-ST",
    ngayBA: "14/06/2026",
    toaBA: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Sơ thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "ĐỖ VĂN NAM",
    ndd: "UBND TỈNH VĨNH PHÚC",
    ttv: "Nguyễn Đức Thiện",
    ldv: "Nguyễn Biên Thùy",
    tp: "Lê Thị Thu Hiền",
    soLanTrinhTPB3: 2,
    soLanTrinh: 2,
    soToTrinh: "22/TT-TA",
    ngayToTrinh: "02/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 104,
    soThuLy: "2331200",
    ngayThuLy: "22/06/2026",
    soDon: "Số đơn 1",
    moTaDon: "(1 đơn TLM)",
    soBA: "90/2026/KDTM-ST",
    ngayBA: "18/06/2026",
    toaBA: "Tòa án nhân dân TP Hồ Chí Minh",
    capXetXu: "Sơ thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "CÔNG TY CP TÂN PHÁT",
    ndd: "NGUYỄN VĂN THÀNH",
    ttv: "Vũ Diệu Thúy",
    ldv: "Phạm Thị Bích Ngọc",
    tp: "Nguyễn Văn Cường",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "26/TT-TA",
    ngayToTrinh: "05/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
  {
    id: 105,
    soThuLy: "2331560",
    ngayThuLy: "25/06/2026",
    soDon: "Số đơn 2",
    moTaDon: "(1 đơn TLM)",
    soBA: "105/2026/HS-PT",
    ngayBA: "20/06/2026",
    toaBA: "TAND cấp cao tại Đà Nẵng",
    capXetXu: "Phúc thẩm",
    qhpl: "Tranh chấp hợp đồng dân sự",
    ndkn: "LÊ HOÀNG YẾN",
    ndd: "TRẦN MINH TÂM",
    ttv: "Đặng Thị Mai",
    ldv: "Nguyễn Như Thắng",
    tp: "Trần Hồng Hà",
    soLanTrinhTPB3: 1,
    soLanTrinh: 1,
    soToTrinh: "30/TT-TA",
    ngayToTrinh: "10/07/2026",
    nguoiTrinh: "Nguyễn Văn A - Phó CA",
    trangThaiKy: "Đã duyệt ký",
    daTaoToTrinh: true,
  },
];

export function PhanCongTPTCView() {
  const [activeTab, setActiveTab] = useState<"chua-tao" | "da-tao">("chua-tao");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Search Filter form states
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fTPB3, setFTPB3] = useState("");
  const [fNguyenDon, setFNguyenDon] = useState("");
  const [fBiDon, setFBiDon] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");

  // Table selections
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [chuaTaoRows, setChuaTaoRows] = useState<CaseTPTCRow[]>(INITIAL_CHUA_TAO_TT);
  const [daTaoRows, setDaTaoRows] = useState<CaseTPTCRow[]>(INITIAL_DA_TAO_TT);

  // Modals
  const [showThemToTrinhModal, setShowThemToTrinhModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [showViewToTrinhModal, setShowViewToTrinhModal] = useState<CaseTPTCRow | null>(null);

  // Form input for Them To Trinh
  const [inputSoTT, setInputSoTT] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [inputNgayTT, setInputNgayTT] = useState("09/08/2026");
  const [inputNguoiKyBanHanh, setInputNguoiKyBanHanh] = useState("Nguyễn Như Thắng - Vụ trưởng");
  const [inputNguoiTrinh, setInputNguoiTrinh] = useState("Nguyễn Văn A - Phó CA");
  const [inputGhiChuTT, setInputGhiChuTT] = useState("…nhận thấy có căn cứ kháng nghị");
  const [inputNgayTrinh, setInputNgayTrinh] = useState("09/08/2026");
  const [inputCapTrinh, setInputCapTrinh] = useState("Phó Chánh án");
  const [inputNguoiDaTrinh, setInputNguoiDaTrinh] = useState("Nguyễn Như Thắng - Vụ trưởng");
  const [inputTPTCDeXuat, setInputTPTCDeXuat] = useState("Hoàng Ngọc Chiêu - TPTC");
  // Draw.io page 10 / 2.9: tờ trình có cả nhánh phân công TPTC lần đầu và
  // nhánh phân công lại khi TPB3/Lãnh đạo Vụ/Phó Chánh án không đồng quan điểm.
  const [inputNguonDeXuat, setInputNguonDeXuat] = useState("Phân công TPTC lần đầu");
  const [inputCanCu, setInputCanCu] = useState("Quyết định số 75/QĐ-CA ngày 06/4/2026 của TANDTC; Điều 15");
  const [noiNhanTT, setNoiNhanTT] = useState([
    { id: 1, noiNhan: "Khác", chiTiet: "Như kính gửi", ghiChu: "" },
    { id: 2, noiNhan: "Khác", chiTiet: "Lưu: Vụ GĐKT1", ghiChu: "" },
  ]);

  const currentRows = [...(activeTab === "chua-tao" ? chuaTaoRows : daTaoRows)].sort((a,b)=>{
    const parse=(d:string)=>{const [dd,mm,yy]=d.split("/").map(Number); return new Date(yy,mm-1,dd).getTime();};
    const primary=parse(b.ngayToTrinh !== "-" ? b.ngayToTrinh : b.ngayThuLy)-parse(a.ngayToTrinh !== "-" ? a.ngayToTrinh : a.ngayThuLy);
    return primary || (parse(b.ngayThuLy)-parse(a.ngayThuLy));
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentRows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setFSoBA("");
    setFNgayBA("");
    setFToaRaBA("");
    setFTPB3("");
    setFNguyenDon("");
    setFBiDon("");
    setFLoaiAn("");
  };

  const handleConfirmThemToTrinh = () => {
    if (selectedIds.length !== 1) {
      alert("Thêm tờ trình phải thực hiện từ đúng 1 vụ án.");
      return;
    }

    const createdRows: CaseTPTCRow[] = [];
    const remainingRows: CaseTPTCRow[] = [];

    chuaTaoRows.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        createdRows.push({
          ...r,
          soToTrinh: inputSoTT,
          ngayToTrinh: inputNgayTT,
          nguoiTrinh: inputNguoiTrinh,
          trangThaiKy: "Đã tạo tờ trình",
          daTaoToTrinh: true,
          soLanTrinh: r.soLanTrinh + 1,
        });
      } else {
        remainingRows.push(r);
      }
    });

    setChuaTaoRows(remainingRows);
    setDaTaoRows((prev) => [...createdRows, ...prev]);
    setSelectedIds([]);
    setShowThemToTrinhModal(false);
    alert(`Đã thêm tờ trình phân công TPTC thành công cho ${createdRows.length} vụ án!`);
    setActiveTab("da-tao");
  };

  const handleConfirmTrinhKy = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 vụ án để trình ký!");
      return;
    }

    setDaTaoRows((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, trangThaiKy: "Đã trình ký" } : r
      )
    );

    setChuaTaoRows((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, trangThaiKy: "Đã trình ký" } : r
      )
    );

    setSelectedIds([]);
    setShowTrinhKyModal(false);
    alert("Đã gửi trình ký tờ trình lên Lãnh đạo thành công!");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 11px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;/&nbsp; <b style={{ color: TEXT }}>Danh sách vụ án phân công TPTC</b>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Danh sách vụ án phân công TPTC
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 32, borderBottom: `1px solid ${BORDER}`, background: "transparent" }}>
          <button
            onClick={() => {
              setActiveTab("chua-tao");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chua-tao" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chua-tao" ? RED : MUTED,
              fontWeight: activeTab === "chua-tao" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS chưa tạo tờ trình ({chuaTaoRows.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("da-tao");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "da-tao" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "da-tao" ? RED : MUTED,
              fontWeight: activeTab === "da-tao" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            DS đã tạo tờ trình ({daTaoRows.length})
          </button>
        </div>

        {/* Search Filter Box */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1: Số BA | Ngày BA | Tòa ra BA | Thẩm phán bậc 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Số bản án/quyết định</label>
                  <input
                    placeholder="Số bản án/quyết định"
                    value={fSoBA}
                    onChange={(e) => { const v=e.target.value; setFSoBA(v); if(v.trim()){ setFNgayBA("20/07/2026"); setFToaRaBA("Tòa án nhân dân cấp cao tại Hà Nội"); } }}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày bản án/quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Ngày bản án/quyết định"
                      value={fNgayBA}
                      onChange={(e) => setFNgayBA(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={14} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tòa ra bản án/quyết định</label>
                  <select
                    value={fToaRaBA}
                    onChange={(e) => setFToaRaBA(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    {DANH_SACH_TOA_AN.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Thẩm phán bậc 3</label>
                  <input
                    list="tptc-tpb3-options"
                    value={fTPB3}
                    onChange={(e) => setFTPB3(e.target.value)}
                    placeholder="Nhập/chọn Thẩm phán bậc 3"
                    style={inputStyle}
                  />
                  <datalist id="tptc-tpb3-options">
                    {DANH_SACH_TPB3.map((tp) => (
                      <option key={tp} value={tp} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Row 2: Nguyên đơn | Bị đơn | Loại án | Empty */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>{fLoaiAn === "Hình sự" ? "Người khiếu nại" : fLoaiAn === "Hành chính" ? "Người khởi kiện" : "Nguyên đơn"}</label>
                  <input
                    placeholder={fLoaiAn === "Hình sự" ? "Người khiếu nại" : fLoaiAn === "Hành chính" ? "Người khởi kiện" : "Nguyên đơn"}
                    value={fNguyenDon}
                    onChange={(e) => setFNguyenDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{fLoaiAn === "Hình sự" ? "Bị cáo" : fLoaiAn === "Hành chính" ? "Người bị kiện" : "Bị đơn"}</label>
                  <input
                    placeholder={fLoaiAn === "Hình sự" ? "Bị cáo" : fLoaiAn === "Hành chính" ? "Người bị kiện" : "Bị đơn"}
                    value={fBiDon}
                    onChange={(e) => setFBiDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Loại án</label>
                  <select
                    value={fLoaiAn}
                    onChange={(e) => setFLoaiAn(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn</option>
                    {LOAI_AN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div />
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: filterExpanded ? 14 : 0 }}>
            <button
              onClick={() => setFilterExpanded(!filterExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "#2563eb",
                fontFamily: F,
                padding: 0,
                fontWeight: 500,
              }}
            >
              {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {filterExpanded ? "Thu gọn" : "Mở rộng"}
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => alert("Đang tìm kiếm danh sách vụ án phân công TPTC...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </button>

              <button
                onClick={handleResetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#fff",
                  color: TEXT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Table Action Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={() => window.print()} style={{padding:"7px 14px",background:"#fff",border:`1px solid ${BORDER}`,borderRadius:4,cursor:"pointer",fontSize:12}}>In danh sách</button>
          <button
            onClick={() => {
              if (selectedIds.length !== 1) {
                alert("Vui lòng chọn đúng 1 vụ án để thêm tờ trình!");
                return;
              }
              setShowThemToTrinhModal(true);
            }}
            style={{
              padding: "7px 18px",
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Thêm tờ trình
          </button>

          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                alert("Vui lòng chọn ít nhất 1 vụ án để trình ký!");
                return;
              }
              setShowTrinhKyModal(true);
            }}
            style={{
              padding: "7px 18px",
              background: "#800000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Trình ký
          </button>

          <button
            onClick={() => alert("Đã làm mới danh sách!")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              color: TEXT,
            }}
            title="Làm mới"
          >
            <RotateCcw size={14} color={MUTED} />
          </button>
        </div>

        {/* Main Data Table */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ ...TH_STYLE, width: 36, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>
                    <input
                      type="checkbox"
                      checked={currentRows.length > 0 && selectedIds.length === currentRows.length}
                      onChange={handleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ ...TH_STYLE, width: 44, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>STT</th>
                  <th style={{ ...TH_STYLE, width: "13%", borderRight: `1px solid ${BORDER}` }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_STYLE, width: "23%", borderRight: `1px solid ${BORDER}` }}>Thông tin bản án/quyết định và QHPL</th>
                  <th style={{ ...TH_STYLE, width: "16%", borderRight: `1px solid ${BORDER}` }}>Đương sự & Người đứng đơn</th>
                  <th style={{ ...TH_STYLE, width: "18%", borderRight: `1px solid ${BORDER}` }}>Phân công & Thông tin trình TP</th>
                  <th style={{ ...TH_STYLE, width: "18%", borderRight: `1px solid ${BORDER}` }}>Thông tin tờ trình phân công</th>
                  <th style={{ ...TH_STYLE, width: 60, textAlign: "center", borderRight: "none" }}>Tờ trình</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", padding: 36, color: MUTED }}>
                      Không có bản ghi nào trong danh sách
                    </td>
                  </tr>
                ) : (
                  currentRows.map((r, index) => {
                    const isSelected = selectedIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        style={{
                          background: isSelected ? "#eff6ff" : index % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ ...TD_STYLE, textAlign: "center", borderRight: `1px solid ${BORDER}` }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(r.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center", fontWeight: 600, color: MUTED, borderRight: `1px solid ${BORDER}` }}>
                          {index + 1}
                        </td>

                        {/* Số & Ngày thụ lý */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div>
                            <div><b>Số:</b> {r.soThuLy}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Ngày TL:</b> {r.ngayThuLy}</div>
                            <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 11 }}>
                                {r.soDon}
                              </span>
                              <span style={{ color: "#2563eb", fontSize: 11 }}>
                                {r.moTaDon}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Thông tin bản án / quyết định */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                              <span style={{background:"#fef3c7",color:"#92400e",padding:"1px 5px",borderRadius:10,fontSize:10}}>Án Quốc hội</span>
                              {r.id % 2 === 0 && <span style={{background:"#fee2e2",color:"#991b1b",padding:"1px 5px",borderRadius:10,fontSize:10}}>Án chỉ đạo</span>}
                              {r.soBA.includes("HS") && <span style={{background:"#fce7f3",color:"#9d174d",padding:"1px 5px",borderRadius:10,fontSize:10}}>Án tử hình</span>}
                            </div>
                            <div><b>Số BA:</b> {r.soBA} &nbsp; <b>Ngày:</b> {r.ngayBA}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Tại:</b> {r.toaBA}</div>
                            <div style={{marginTop:3,fontSize:11}}><b>Thời hiệu:</b> 3 năm <span style={{color:"#dc2626",fontWeight:700}}>• còn 24 ngày</span></div>
                            {r.capXetXu && (
                              <div style={{ marginTop: 4 }}><span style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>Cấp xét xử: {r.capXetXu}</span></div>
                            )}
                            <div style={{ marginTop: 4, fontSize: 11 }}><b>QHPL:</b> {r.qhpl || "-"}</div>
                          </div>
                        </td>

                        {/* Đương sự & Người đề nghị */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                            <div><b>Người đứng đơn:</b> {r.ndkn}</div>
                            <div style={{ marginTop: 2 }}><b>Bị cáo/Bị đơn:</b> {r.ndd}</div>
                          </div>
                        </td>

                        {/* Phân công & Thông tin trình TP */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                            <div><b>TTV:</b> {r.ttv || "TTV"}</div>
                            <div><b>LĐV:</b> {r.ldv || "LĐV"}</div>
                            <div><b>TP:</b> {r.tp || "TP"}</div>
                            <div style={{ color: MUTED, marginTop: 2 }}>Số lần trình TPB3: <b>{r.soLanTrinhTPB3}</b></div>
                            <div style={{ color: MUTED }}>Số lần trình: <b>{r.soLanTrinh}</b></div>
                            <button onClick={()=>setShowViewToTrinhModal(r)} style={{border:0,background:"none",padding:0,color:"#2563eb",fontSize:11,textDecoration:"underline",cursor:"pointer"}}>Xem tờ trình giải quyết</button>
                          </div>
                        </td>

                        {/* Thông tin tờ trình phân công */}
                        <td style={{ ...TD_STYLE, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                            <div><b>Số tờ trình:</b> {r.soToTrinh}</div>
                            <div><b>Ngày tờ trình:</b> {r.ngayToTrinh}</div>
                            <div style={{ fontWeight: 600, color: TEXT, marginTop: 2 }}>{r.nguoiTrinh}</div>
                            <div style={{fontSize:11,color:MUTED}}>Ngày ký: {r.trangThaiKy.includes("Đã") ? r.ngayToTrinh : "-"}</div>
                            <div style={{ marginTop: 4 }}>
                              <span
                                style={{
                                  background: r.trangThaiKy === "Đã duyệt ký" ? "#d1fae5" : "#f3f4f6",
                                  color: r.trangThaiKy === "Đã duyệt ký" ? "#065f46" : "#4b5563",
                                  border: `1px solid ${r.trangThaiKy === "Đã duyệt ký" ? "#6ee7b7" : "#e5e7eb"}`,
                                  padding: "1px 8px",
                                  borderRadius: 12,
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {r.trangThaiKy}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Tờ trình icon */}
                        <td style={{ ...TD_STYLE, textAlign: "center", borderRight: "none", verticalAlign: "middle" }}>
                          <div style={{ display:"flex", justifyContent:"center", gap:4 }}>
                            <button onClick={() => setShowViewToTrinhModal(r)} style={{ background:"none",border:"none",cursor:"pointer",padding:5 }} title="Xem / sửa thông tin tờ trình"><Eye size={17} color="#2563eb" /></button>
                            <button onClick={() => alert(r.trangThaiKy === "Chờ ký" || r.trangThaiKy === "Đã tạo tờ trình" ? "Mở tờ trình dạng Word để chỉnh sửa" : "Mở tờ trình dạng PDF") } style={{ background:"none",border:"none",cursor:"pointer",padding:5 }} title="Xem tờ trình Word/PDF"><FileText size={18} color="#4b5563" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
            <div>
              Hiển thị 1-{currentRows.length} trong tổng {currentRows.length} bản ghi
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>‹</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${RED}`, background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>1</button>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>›</button>
              <select style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", outline: "none", marginLeft: 8 }}>
                <option>10 / trang</option>
                <option>20 / trang</option>
                <option>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm tờ trình */}
      {showThemToTrinhModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 620, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: RED }}>
                <FileSignature size={18} /> Thêm tờ trình phân công Thẩm phán Tối cao
              </div>
              <button onClick={() => setShowThemToTrinhModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 14px", borderRadius: 6, fontSize: 12, color: "#1e40af" }}>
                Đang tạo tờ trình cho <b>01</b> vụ án đã chọn.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                    Số tờ trình (*)
                  </label>
                  <input
                    value={inputSoTT}
                    onChange={(e) => setInputSoTT(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                    Ngày tờ trình (*)
                  </label>
                  <input
                    value={inputNgayTT}
                    onChange={(e) => setInputNgayTT(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><label style={{ fontSize:12,fontWeight:600,color:TEXT,display:"block",marginBottom:6 }}>Người ký ban hành (*)</label>
                  <select value={inputNguoiKyBanHanh} onChange={e=>setInputNguoiKyBanHanh(e.target.value)} style={inputStyle}><option>Nguyễn Như Thắng - Vụ trưởng</option><option>Nguyễn Văn Hiền - Vụ trưởng</option></select>
                </div>
                <div><label style={{ fontSize:12,fontWeight:600,color:TEXT,display:"block",marginBottom:6 }}>Kính gửi (*)</label>
                  <select value={inputNguoiTrinh} onChange={e=>setInputNguoiTrinh(e.target.value)} style={inputStyle}><option value="Nguyễn Văn A - Phó CA">Nguyễn Văn A - Phó Chánh án</option><option value="Lê Văn B - Phó CA">Lê Văn B - Phó Chánh án</option></select>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <div><label style={labelStyle}>Ngày trình tờ trình (*)</label><input value={inputNgayTrinh} onChange={e=>setInputNgayTrinh(e.target.value)} style={inputStyle}/></div>
                <div><label style={labelStyle}>Cấp trình gần nhất (*)</label><input value={inputCapTrinh} onChange={e=>setInputCapTrinh(e.target.value)} style={inputStyle}/></div>
                <div><label style={labelStyle}>Người đã trình gần nhất (*)</label><input value={inputNguoiDaTrinh} onChange={e=>setInputNguoiDaTrinh(e.target.value)} style={inputStyle}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={labelStyle}>Thẩm phán tối cao đề xuất (*)</label><select value={inputTPTCDeXuat} onChange={e=>setInputTPTCDeXuat(e.target.value)} style={inputStyle}><option>Hoàng Ngọc Chiêu - TPTC</option><option>Nguyễn Văn Cường - TPTC</option></select></div>
                <div><label style={labelStyle}>Căn cứ quyết định (*)</label><input value={inputCanCu} onChange={e=>setInputCanCu(e.target.value)} style={inputStyle}/></div>
              </div>
              <div>
                <label style={labelStyle}>Nguồn / lý do đề xuất TPTC (*)</label>
                <select value={inputNguonDeXuat} onChange={e=>setInputNguonDeXuat(e.target.value)} style={inputStyle}>
                  <option>Phân công TPTC lần đầu</option>
                  <option>Phân công lại TPTC do TPB3 không đồng quan điểm với Vụ trưởng</option>
                  <option>Phân công lại TPTC theo ý kiến Phó Chánh án</option>
                  <option>Phân công lại TPTC sau phiên họp Tổ Thẩm phán</option>
                </select>
                {inputNguonDeXuat.includes("Phân công lại") && (
                  <div style={{marginTop:6,padding:"7px 10px",border:"1px solid #fde68a",background:"#fffbeb",borderRadius:5,fontSize:11,color:"#92400e"}}>
                    Theo Draw.io 2.9/2.14: đây là tờ trình <b>phân công lại TPTC</b>; sau khi Vụ trưởng và Phó Chánh án ký, Phó Chánh án thực hiện phân công và hồ sơ được chuyển cho TPTC mới.
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Nội dung tờ trình
                </label>
                <textarea
                  rows={4}
                  value={inputGhiChuTT}
                  onChange={(e) => setInputGhiChuTT(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                />
              </div>
            </div>

            <div style={{padding:"0 20px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><b style={{fontSize:12}}>Nơi nhận</b><button onClick={()=>setNoiNhanTT(v=>[...v,{id:Date.now(),noiNhan:"Khác",chiTiet:"",ghiChu:""}])}>+ Thêm</button></div>
              <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Nơi nhận","Nơi nhận chi tiết","Ghi chú",""].map(h=><th key={h} style={TH_STYLE}>{h}</th>)}</tr></thead><tbody>{noiNhanTT.map(row=><tr key={row.id}><td style={TD_STYLE}><select value={row.noiNhan} onChange={e=>setNoiNhanTT(v=>v.map(x=>x.id===row.id?{...x,noiNhan:e.target.value}:x))}><option>Tòa án nhân dân</option><option>Khác</option></select></td><td style={TD_STYLE}><input value={row.chiTiet} onChange={e=>setNoiNhanTT(v=>v.map(x=>x.id===row.id?{...x,chiTiet:e.target.value}:x))}/></td><td style={TD_STYLE}><input value={row.ghiChu} onChange={e=>setNoiNhanTT(v=>v.map(x=>x.id===row.id?{...x,ghiChu:e.target.value}:x))}/></td><td style={TD_STYLE}><button onClick={()=>setNoiNhanTT(v=>v.filter(x=>x.id!==row.id))}>Xóa</button></td></tr>)}</tbody></table>
            </div>
            <div style={{padding:"0 20px 12px",display:"flex",gap:8}}><button onClick={()=>{if(daLaySo){setDaLaySo(false);setInputSoTT("");}else{setDaLaySo(true);setInputSoTT("36/TB-TA");}}}>{daLaySo?"Hủy lấy số":"Lấy số"}</button></div>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowThemToTrinhModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmThemToTrinh}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                ✓ Lưu tờ trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trình ký */}
      {showTrinhKyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 500, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "#800000" }}>
                <CheckCircle2 size={18} /> Xác nhận trình ký tờ trình
              </div>
              <button onClick={() => setShowTrinhKyModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
              Bạn có chắc chắn muốn gửi <b>trình ký</b> tờ trình phân công Thẩm phán Tối cao cho <b>{selectedIds.length}</b> vụ án đã chọn lên Lãnh đạo Tòa án nhân dân tối cao duyệt ký?
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowTrinhKyModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmTrinhKy}
                style={{ padding: "7px 20px", border: "none", background: "#800000", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                ✓ Xác nhận trình ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Tờ Trình */}
      {showViewToTrinhModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: RED }}>
                📄 Tờ trình phân công Thẩm phán Tòa án nhân dân tối cao
              </div>
              <button onClick={() => setShowViewToTrinhModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, fontSize: 12, lineHeight: 1.7, background: "#fff" }}>
              <div style={{ textAlign: "center", borderBottom: `1px dashed ${BORDER}`, paddingBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ fontWeight: 600, color: RED, marginTop: 4, fontSize: 14 }}>TỜ TRÌNH PHÂN CÔNG THẨM PHÁN TỐI CAO</div>
                <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>Số: {showViewToTrinhModal.soToTrinh !== "-" ? showViewToTrinhModal.soToTrinh : "Chưa lấy số"} &nbsp;•&nbsp; Ngày: {showViewToTrinhModal.ngayToTrinh !== "-" ? showViewToTrinhModal.ngayToTrinh : "-"}</div>
                <div style={{marginTop:4,fontSize:11,color:showViewToTrinhModal.trangThaiKy.includes("Đã")?"#7c3aed":"#2563eb"}}>{showViewToTrinhModal.trangThaiKy.includes("Đã") ? "Chế độ PDF - chỉ xem" : "Chế độ Word - cho phép sửa"}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Vụ án thụ lý số:</span>
                <span><b>{showViewToTrinhModal.soThuLy}</b> (Ngày {showViewToTrinhModal.ngayThuLy})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Bản án đề nghị:</span>
                <span>{showViewToTrinhModal.soBA} – Ngày {showViewToTrinhModal.ngayBA} ({showViewToTrinhModal.toaBA})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Đương sự:</span>
                <span>NĐKN: {showViewToTrinhModal.ndkn} &nbsp;•&nbsp; NĐD: {showViewToTrinhModal.ndd}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm phán Bậc 3:</span>
                <span>{showViewToTrinhModal.tp}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm tra viên:</span>
                <span>{showViewToTrinhModal.ttv}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Người trình ký:</span>
                <span><b>{showViewToTrinhModal.nguoiTrinh}</b></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 8 }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Trạng thái ký duyệt:</span>
                <span style={{ color: "#065f46", fontWeight: 700 }}>{showViewToTrinhModal.trangThaiKy}</span>
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => window.print()}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                In tờ trình
              </button>
              <button
                onClick={() => setShowViewToTrinhModal(null)}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhanCongTPTCView;
