import React, { useState } from "react";
import { Eye, RotateCcw, X, Printer, FileText, Send, Archive, RefreshCw, Download, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, Badge, type UserRoleType } from "./shared";
import { isVu234 } from "./AppHelpers";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import type { VuAnDetailData } from "./QuanLyVuAnView";


function XemBieuMauToTrinhVuAnModal({
  onClose,
  detail,
  soToTrinh,
  ngayLap,
  loaiToTrinh,
  daKySo,
}: {
  onClose: () => void;
  detail?: VuAnDetailData;
  soToTrinh?: string;
  ngayLap?: string;
  loaiToTrinh?: string;
  daKySo?: boolean;
}) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const getDoiTuongText = () => {
    const loai = ((detail?.loaiAn || (detail as any)?.linhVuc || (detail as any)?.tenVuAn || detail?.maVuAn || "") + "").toLowerCase();
    if (loai.includes("hành chính") || loai.includes("hc")) {
      const nkk = (detail as any)?.nguoiKhoiKien || (detail as any)?.nkk || (detail as any)?.ndkn || "Nguyễn Văn A";
      const nbk = (detail as any)?.nguoiBiKien || (detail as any)?.nbk || (detail as any)?.ndd || "Ủy ban nhân dân tỉnh X";
      return `Người khởi kiện (NKK): ${nkk} – Người bị kiện (NBK): ${nbk}`;
    } else if (loai.includes("dân sự") || loai.includes("ds") || loai.includes("hôn nhân") || loai.includes("lao động") || loai.includes("kinh doanh") || loai.includes("kdtm")) {
      const nguyenDon = (detail as any)?.nguyenDon || (detail as any)?.ndkn || "Trần Thị B";
      const biDon = (detail as any)?.biDon || (detail as any)?.ndd || "Nguyễn Văn C";
      return `Nguyên đơn: ${nguyenDon} – Bị đơn: ${biDon}`;
    } else if (loai.includes("khiếu nại") || loai.includes("kn")) {
      const nkn = (detail as any)?.nguoiKhieuNai || (detail as any)?.nkn || (detail as any)?.ndkn || "Lê Văn D";
      const nbkn = (detail as any)?.nguoiBiKhieuNai || "Tòa án nhân dân cấp cao";
      return `Người khiếu nại: ${nkn} – Người bị khiếu nại: ${nbkn}`;
    } else {
      const biCan = (detail as any)?.tenBiCan || (detail as any)?.biCan || (detail as any)?.biCao || (detail as any)?.ndd || "Phan Văn Thành";
      return `Bị can/Bị cáo: ${biCan}`;
    }
  };

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT, display: "inline-flex", alignItems: "center", gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", cursor: "pointer",
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 18, background: BORDER, margin: "0 2px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f1f5f9", zIndex: 3500, display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: F }}>
      <div style={{ background: "#2b579a", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Tờ trình thẩm tra vụ án đề xuất kháng nghị Giám đốc thẩm.docx</span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>Chế độ chỉnh sửa Word trực tiếp</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => alert("Đã lưu nội dung Tờ trình Word thành công!")} style={{ padding: "7px 20px", background: "#15803d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <X size={22} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", fontSize: 12, fontFamily: F }}>
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại">↪ Làm lại</button>
        <div style={sepSt} />

        <select onChange={e => { setFontFamily(e.target.value); execCmd("fontName", e.target.value); }} value={fontFamily} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
        </select>

        <select onChange={e => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="13.5pt">13.5 pt</option>
          <option value="14pt">14 pt</option>
          <option value="16pt">16 pt</option>
        </select>
        <div style={sepSt} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân"><u>U</u></button>
        <div style={sepSt} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều">☰</button>
        <div style={sepSt} />

        <button onClick={() => window.print()} style={tbBtnSt}><Printer size={13} /> In</button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", fontWeight: 600 }}>
          <Download size={13} /> Tải file Word
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cbd5e1" }}>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794, minHeight: 1123, background: "#fff", boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
            padding: "54px 64px", boxSizing: "border-box", transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            fontFamily: fontFamily, color: "#000", lineHeight: 1.6, fontSize: fontSize, outline: "none", cursor: "text",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>VỤ GIÁM ĐỐC, KIỂM TRA I</div>
                  <div style={{ fontSize: "12pt", marginTop: 4 }}>
                    Số: {soToTrinh || "...... /TTr-TANDTC-V1"}
                  </div>
                </td>
                <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>Độc lập – Tự do – Hạnh phúc</div>
                  <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                    Hà Nội, ngày {ngayLap ? ngayLap.split("/")[0] || "..." : "..."} tháng {ngayLap ? ngayLap.split("/")[1] || "..." : "..."} năm 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center", margin: "24px 0 14px" }}>
            <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>
              {isKhieuNai ? "TỜ TRÌNH THẨM TRA VỤ VIỆC KHIẾU NẠI" : "TỜ TRÌNH THẨM TRA VỤ ÁN"}
            </div>
            <div style={{ fontSize: "13pt", fontWeight: "bold", marginTop: 4 }}>
              {isKhieuNai
                ? `Về việc giải quyết đơn khiếu nại của đương sự đối với ${detail?.tenVuAn || "Vụ việc"}`
                : `Về việc giải quyết đơn đề nghị giám đốc thẩm đối với ${detail?.tenVuAn || "Vụ án"}`}
            </div>
            <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 2, color: "#374151" }}>
              ({getDoiTuongText()})
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", marginBottom: 20 }}>
            Kính gửi: Đồng chí Phó Chánh án Tòa án nhân dân tối cao
          </div>

          <div style={{ textAlign: "justify", lineHeight: 1.65 }}>
            <p style={{ fontWeight: "bold", margin: "10px 0 4px" }}>
              {isKhieuNai ? "I. TÓM TẮT NỘI DUNG ĐƠN KHIẾU NẠI VÀ QUÁ TRÌNH XỬ LÝ:" : "I. TÓM TẮT NỘI DUNG VỤ ÁN VÀ QUÁ TRÌNH TỐ TỤNG:"}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Đương sự / Đối tượng trong vụ việc:</b> {getDoiTuongText()}</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Thụ lý đơn khiếu nại của đương sự đối với quyết định/hành vi tố tụng của Tòa án nhân dân cấp dưới."
                : "- Thụ lý đơn đề nghị giám đốc thẩm số 09D732899 của đương sự đối với Bản án phúc thẩm số 89/2026/PT của Tòa án nhân dân cấp cao."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Tóm tắt nội dung khiếu nại và các tài liệu, chứng cứ có liên quan do người khiếu nại cung cấp."
                : "- Tóm tắt hành vi phạm tội và các chứng cứ đã được thu thập trong quá trình điều tra, truy tố, xét xử sơ thẩm và phúc thẩm."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>II. QUAN ĐIỂM THẨM TRA CỦA THẨM TRA VIÊN:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>Qua nghiên cứu toàn diện hồ sơ và các tài liệu chứng cứ có liên quan, Thẩm tra viên nhận thấy:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "1. Căn cứ quy định của pháp luật về khiếu nại trong hoạt động tố tụng, việc khiếu nại của đương sự là có cơ sở xem xét."
                : "1. Tòa án cấp sơ thẩm và phúc thẩm có vi phạm nghiêm trọng thủ tục tố tụng trong việc đánh giá chứng cứ và không triệu tập đầy đủ người có quyền lợi, nghĩa vụ liên quan."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "2. Các tài liệu xác minh cho thấy nội dung yêu cầu khiếu nại phù hợp với các quy định pháp luật hiện hành."
                : "2. Kết luận trong bản án không phù hợp với những tình tiết khách quan của vụ án, gây thiệt hại nghiêm trọng đến quyền và lợi ích hợp pháp của đương sự."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>III. KIẾN NGHỊ VÀ ĐỀ XUẤT XỬ LÝ:</p>
            {isKhieuNai ? (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Luật Khiếu nại và các quy định pháp luật về tố tụng, kính trình Đồng chí Lãnh đạo xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Phương án đề xuất:</b> Chấp nhận khiếu nại của đương sự.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Ban hành quyết định giải quyết khiếu nại theo đúng trình tự thủ tục quy định của pháp luật.</p>
              </>
            ) : (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Điều 371 và Điều 373 Bộ luật Tố tụng hình sự năm 2015, kính trình Đồng chí Phó Chánh án Tòa án nhân dân tối cao xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Ban hành Quyết định kháng nghị giám đốc thẩm</b> đối với Bản án hình sự phúc thẩm số 89/2026/HS-PT.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Đề nghị Hội đồng Thẩm phán Tòa án nhân dân tối cao xét xử hủy bản án phúc thẩm để điều tra, xét xử lại theo đúng quy định của pháp luật.</p>
              </>
            )}

            <p style={{ fontStyle: "italic", margin: "14px 0 24px" }}>
              (Đính kèm: Dự thảo văn bản giải quyết và toàn bộ tài liệu hồ sơ có liên quan).
            </p>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>Ý KIẾN CỦA THẨM PHÁN</div>
                  <div style={{ height: 70 }} />
                  <div style={{ fontWeight: "bold" }}>{detail?.thamPhan || "Nguyễn Biên Thuỳ"}</div>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>THẨM TRA VIÊN BÁO CÁO</div>
                  <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {daKySo && (
                      <div style={{ border: "2px solid #dc2626", color: "#dc2626", padding: "3px 10px", borderRadius: 4, fontSize: "10pt", fontWeight: "bold", transform: "rotate(-5deg)" }}>
                        ✓ KÝ SỐ: Lý Thái Phúc
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: "bold" }}>{detail?.thamTraVien || "Lý Thái Phúc"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TaoToTrinhModal({
  onClose,
  onSave,
  detail,
  userRole,
}: {
  onClose: () => void;
  onSave?: (data: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => void;
  onKySo?: () => void;
  detail?: VuAnDetailData;
  userRole?: UserRoleType;
}) {
  const isVu234Role = isVu234(userRole, detail?.loaiAn);
  const isKhieuNai =
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"));

  const [ngayLap, setNgayLap] = useState("09/08/2026");
  const [tomTatNoiDung, setTomTatNoiDung] = useState("");
  const [dienBienQuaTrinh, setDienBienQuaTrinh] = useState("");

  const [donXuLyList, setDonXuLyList] = useState([
    {
      id: 1,
      nguoiGui: (detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng",
      tlm: "TLM: 10 – 22/05/2026",
      deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
      noiDung: isKhieuNai
        ? "Đề xuất Lãnh đạo Vụ xem xét, trình Chánh án TANDTC chấp nhận nội dung khiếu nại của đương sự, ban hành quyết định giải quyết khiếu nại theo quy định."
        : "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC.",
    },
  ]);

  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleAddDonXuLy = () => {
    const newId = Date.now();
    setDonXuLyList(prev => [
      ...prev,
      {
        id: newId,
        nguoiGui: "Nguyễn Văn Minh (Đương sự)",
        tlm: `TLM: 11 – ${new Date().toLocaleDateString("vi-VN")}`,
        deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
        noiDung: isKhieuNai
          ? "Đề xuất chấp nhận khiếu nại của đương sự."
          : "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC.",
      },
    ]);
  };

  const handleDeleteDon = (id: number) => {
    if (donXuLyList.length <= 1) {
      alert("Phải có ít nhất 1 đơn xử lý trong tờ trình!");
      return;
    }
    setDonXuLyList(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateDon = (id: number, field: string, value: string) => {
    setDonXuLyList(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ daDinhKemHoSo: true, countHoSo: donXuLyList.length, soTT: "12/TTr-TANDTC-V1" });
    }
    alert("Đã lưu tờ trình thành công!");
    onClose();
  };

  const maVuAn = detail?.maVuAn || (isKhieuNai ? "KN26-002039" : "VA26-002039");
  const tenVuAn = detail?.tenVuAn || (isKhieuNai ? "Vụ việc khiếu nại của ông/bà Nguyễn Văn Minh" : "Vụ án Nguyễn Văn Minh – Tội cướp tài sản");
  const tenBiCan = "Nguyễn Văn Minh";
  const toiDanh = "Tội cướp tài sản";
  const soBA = "124/2025/HSPT";
  const ngayBA = "20/12/2025";
  const toaXetXu = "Tòa án nhân dân cấp cao tại Hà Nội";
  const toaAnGiaiQuyet = "Tòa án nhân dân tối cao";
  const trangThai = isKhieuNai ? "Chưa có kết quả giải quyết khiếu nại" : "Chưa có kết quả giải quyết đơn";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1400, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      {showBieuMau && (
        <XemBieuMauToTrinhVuAnModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          soToTrinh="12/2026/TTr-TANDTC-V1"
          ngayLap={ngayLap}
          loaiToTrinh={isKhieuNai ? "Tờ trình thẩm tra đề xuất giải quyết khiếu nại" : "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm"}
          daKySo={true}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 780, boxShadow: "0 10px 40px rgba(0,0,0,0.25)", marginBottom: 24, overflow: "hidden", fontFamily: F }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F, flex: 1 }}>
            {isKhieuNai ? "Thêm mới tờ trình khiếu nại" : "Thêm mới tờ trình vụ án"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, display: "flex", alignItems: "center" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "82vh", overflowY: "auto" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "14px 18px", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.95fr", gap: "10px 18px", fontSize: 12, fontFamily: F, lineHeight: 1.5 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ fontWeight: 700, color: "#111827" }}>{maVuAn}</span></div>
                <div><span style={{ color: "#374151" }}>Tên {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{tenVuAn}</span></div>
                {isKhieuNai ? (
                  <>
                    <div><span style={{ color: "#374151" }}>Người khiếu nại: </span><span style={{ fontWeight: 600, color: "#111827" }}>{(detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng"}</span></div>
                    <div><span style={{ color: "#374151" }}>Nội dung KN: </span><span style={{ fontWeight: 600, color: "#111827" }}>Khiếu nại quyết định giải quyết</span></div>
                  </>
                ) : !isVu234Role ? (
                  <>
                    <div><span style={{ color: "#374151" }}>Tên bị can đầu vụ: </span><span style={{ fontWeight: 600, color: "#111827" }}>{tenBiCan}</span></div>
                    <div><span style={{ color: "#374151" }}>Tội danh chính: </span><span style={{ fontWeight: 600, color: "#111827" }}>{toiDanh}</span></div>
                  </>
                ) : (
                  <>
                    <div><span style={{ color: "#374151" }}>Nguyên đơn: </span><span style={{ fontWeight: 600, color: "#111827" }}>{detail?.nguyenDon || "Nguyễn Văn A"}</span></div>
                    <div><span style={{ color: "#374151" }}>Bị đơn: </span><span style={{ fontWeight: 600, color: "#111827" }}>{detail?.biDon || "Trần Thị B"}</span></div>
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Số BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{soBA}</span></div>
                <div><span style={{ color: "#374151" }}>Ngày ra BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{ngayBA}</span></div>
                <div><span style={{ color: "#374151" }}>Tòa xét xử: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaXetXu}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Tòa án giải quyết: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaAnGiaiQuyet}</span></div>
                <div><span style={{ color: "#374151" }}>Trạng thái: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{trangThai}</span></div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Ngày lập tờ trình</label>
            <input type="text" value={ngayLap} onChange={e => setNgayLap(e.target.value)} placeholder="dd/mm/yyyy" style={{ padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, width: 200, outline: "none", background: "#fff", boxSizing: "border-box", color: "#111827" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginBottom: 10 }}>
              {isKhieuNai ? "I. NỘI DUNG ĐƠN KHIẾU NẠI" : "I. NỘI DUNG VỤ ÁN"}
            </div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
              <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Tóm tắt nội dung
            </label>
            <textarea value={tomTatNoiDung} onChange={e => setTomTatNoiDung(e.target.value)} placeholder={isKhieuNai ? "Nhập tóm tắt nội dung đơn khiếu nại và yêu cầu của người khiếu nại" : "Nhập tóm tắt nội dung vụ án"} rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginBottom: 10 }}>II. QUÁ TRÌNH GIẢI QUYẾT</div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Diễn biến quá trình giải quyết</label>
            <textarea value={dienBienQuaTrinh} onChange={e => setDienBienQuaTrinh(e.target.value)} placeholder="Nhập quá trình giải quyết vụ án" rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          {isKhieuNai ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, background: RED, borderRadius: 2 }} />
                  III. ĐỀ XUẤT GIẢI QUYẾT KHIẾU NẠI
                </span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: F, display: "block", marginBottom: 8 }}>
                    <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                    {[
                      "Chấp nhận khiếu nại",
                      "Không chấp nhận khiếu nại",
                      "Xếp đơn",
                      "Nghiên cứu, xác minh, bổ sung",
                    ].map(opt => {
                      const isChecked = (donXuLyList[0]?.deXuat || "Chấp nhận khiếu nại") === opt;
                      return (
                        <label
                          key={opt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                            fontSize: 13,
                            fontFamily: F,
                            color: "#111827",
                          }}
                        >
                          <input
                            type="radio"
                            name="de-xuat-khieu-nai"
                            checked={isChecked}
                            onChange={() => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", opt)}
                            style={{ accentColor: "#1d4ed8", width: 16, height: 16, cursor: "pointer" }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết / Căn cứ giải quyết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung phân tích căn cứ và đề xuất chi tiết giải quyết khiếu nại..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#111827" }}
                  />
                </div>
              </div>
            </div>
          ) : isVu234Role ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <select
                    value={donXuLyList[0]?.deXuat || "Kháng nghị"}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13, fontFamily: F, background: "#fff", color: "#111827", outline: "none", cursor: "pointer", width: 340 }}
                  >
                    <option value="Kháng nghị">Kháng nghị</option>
                    <option value="Không kháng nghị">Không kháng nghị (Thông báo không kháng nghị)</option>
                    <option value="Yêu cầu xác minh">Yêu cầu xác minh / Bổ sung hồ sơ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung đề xuất giải quyết vụ án..."
                    rows={4}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#111827" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button type="button" onClick={handleAddDonXuLy} style={{ background: "#800000", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>Thêm đơn xử lý</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "8px 10px", width: 50, textAlign: "center", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>STT</th>
                    <th style={{ padding: "8px 12px", width: 180, textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>Đơn</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>Đề xuất giải quyết</th>
                    <th style={{ padding: "8px 10px", width: 80, textAlign: "center", fontWeight: 600, color: "#374151" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {donXuLyList.map((item, idx) => (
                    <tr key={item.id} style={{ background: "#fff", borderBottom: idx < donXuLyList.length - 1 ? "1px solid #e5e7eb" : "none", verticalAlign: "top" }}>
                      <td style={{ padding: "12px 10px", textAlign: "center", color: "#374151", borderRight: "1px solid #e5e7eb", fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#4b5563", marginTop: -1 }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 600, color: "#111827", fontSize: 12 }}>{item.nguoiGui}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.tlm}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <select value={item.deXuat} onChange={e => handleUpdateDon(item.id, "deXuat", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", color: "#111827", outline: "none", cursor: "pointer", width: "100%" }}>
                            <option value="Kháng nghị">Kháng nghị</option>
                            <option value="Không kháng nghị">Không kháng nghị (Trả lời đơn)</option>
                            <option value="Yêu cầu xác minh">Yêu cầu xác minh / Bổ sung</option>
                            <option value="Khác">Khác</option>
                          </select>

                          <textarea value={item.noiDung} onChange={e => handleUpdateDon(item.id, "noiDung", e.target.value)} rows={3} style={{ width: "100%", padding: "6px 10px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", lineHeight: 1.5, boxSizing: "border-box", resize: "vertical", color: "#111827" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                          <button type="button" onClick={() => setShowBieuMau(true)} title="Xem biểu mẫu" style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, padding: 2 }}>◇</button>
                          <button type="button" onClick={() => handleDeleteDon(item.id)} title="Xóa đơn" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: 2 }}><Trash2 size={14} color="#ef4444" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "14px 20px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <button type="button" onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>Đóng</button>
          <button type="button" onClick={handleSave} style={{ padding: "7px 32px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

function ThuHoiConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</button>
        </div>
      </div>
    </div>
  );
}

export function TabToTrinh({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);

  const [lichSuData, setLichSuData] = useState([
    {
      ngayTrinh: "09/08/2026", lanh: detail?.thamPhan || "Nguyễn Biên Thuỳ", capTrinh: "Thẩm phán phụ trách", vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị GĐT", yKien: "Đồng ý với đề xuất của TTV. Chuyển Lãnh đạo Vụ xem xét trình Chánh án.", ngayDuyet: "09/08/2026", trangThai: "da-duyet", subRows: [] as { label: string; ngayDuyet: string }[],
    },
    {
      ngayTrinh: "05/08/2026", lanh: "Lãnh đạo Vụ Giám đốc, kiểm tra I", capTrinh: "Phó Vụ trưởng", vanBan: "Tờ trình xin ý kiến hướng giải quyết", yKien: "Yêu cầu TTV thẩm tra kỹ tình tiết lời khai nhân chứng tại BL 45-50 trước khi báo cáo lại.", ngayDuyet: "06/08/2026", trangThai: "tu-choi", subRows: [],
    },
  ]);

  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const [vanBanList, setVanBanList] = useState([
    { stt: 1, loai: "to-trinh", vanBan: "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm", don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (TTV)", trangThai: "–", daDinhKemHoSo: true, soHoSo: 5 },
    { stt: 2, loai: "du-thao", vanBan: "Dự thảo Quyết định kháng nghị giám đốc thẩm", don: `${detail?.maVuAn || "VA26-002621"} - Đơn 09D732899`, ngayTao: "09/08/2026", nguoiKy: "–", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 },
    { stt: 3, loai: "du-thao", vanBan: "Dự thảo Thông báo trả lời đơn đề nghị", don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "08/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (TTV)", trangThai: "Đã ký số", daDinhKemHoSo: true, soHoSo: 1 },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => {
    const toTrinhCount = vanBanList.filter(x => x.vanBan.includes("Tờ trình")).length + 1;
    const count = data?.countHoSo ?? 5;
    const isAttached = data?.daDinhKemHoSo ?? true;

    const newRow = { stt: 1, loai: "to-trinh", vanBan: `Tờ trình thẩm tra vụ án số ${toTrinhCount}`, don: `${detail?.maVuAn || "VA26-002621"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (TTV)", trangThai: "–", daDinhKemHoSo: isAttached, soHoSo: count };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
    }
  };

  const handleTrinhVanBanClick = () => {
    const hasMissingHoSo = vanBanList.some(r => r.vanBan.includes("Tờ trình") && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình văn bản! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }
    const hasUnsigned = vanBanList.some(
      r => !r.vanBan.toLowerCase().includes("tờ trình") && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số")
    );
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Các văn bản Dự thảo phải được KÝ SỐ trước khi ấn Trình văn bản!");
      return;
    }
    setShowTrinhKy(true);
  };

  const allDonOptions = Array.from(new Set(lichSuData.flatMap(r => (r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean)))));
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => {
    const matchDon = !filterDon || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  const handleSaveDuThao = (data?: any) => {
    let tenDuThao = "Dự thảo Thông báo trả lời đơn đề nghị";
    if (data?.ketQuaGQ === "khang-nghi") {
      tenDuThao = "Dự thảo Quyết định kháng nghị giám đốc thẩm";
    } else if (data?.ketQuaGQ === "xep-don") {
      tenDuThao = "Dự thảo Thông báo xếp đơn đề nghị";
    } else if (data?.ketQuaGQ === "vks-dang-giai-quyet") {
      tenDuThao = "Dự thảo Thông báo Viện kiểm sát đang giải quyết";
    }
    const newRow = { stt: 1, loai: "du-thao", vanBan: tenDuThao, don: `${detail?.maVuAn || "VA26-00321"} - ${detail?.tenVuAn || "Nguyễn Văn A"}`, ngayTao: data?.ngayQuyetDinh || "09/08/2026", nguoiKy: data?.nguoiKy || "Nguyễn Biên Thuỳ", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} detail={detail} userRole={userRole} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} detail={detail} onSave={handleSaveDuThao} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản & Tờ trình</span>
          <button onClick={handleTrinhVanBanClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Send size={13} /> Trình văn bản
          </button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            + Tạo dự thảo
          </button>
          <button onClick={() => setShowTaoTT(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <RefreshCw size={13} /> Tạo tờ trình
          </button>
          <button onClick={() => setShowHoSo(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Archive size={13} /> Hồ sơ tờ trình
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 600 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "TÊN VĂN BẢN", !isVu234(userRole, detail?.loaiAn) ? "ĐƠN / VỤ ÁN" : "VỤ ÁN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanBanList.map((r, idx) => {
                const isToTrinh = r.loai === "to-trinh" || r.vanBan.toLowerCase().includes("tờ trình");
                return (
                  <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                    <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>
                      📄 {r.vanBan}
                      {r.soHoSo ? (
                        <div style={{ fontSize: 11, color: MUTED, fontWeight: 400, marginTop: 2 }}>
                          📎 Đính kèm {r.soHoSo} hồ sơ tài liệu
                        </div>
                      ) : null}
                    </td>
                    <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.don}</td>
                    <td style={TD}>{r.ngayTao}</td>
                    <td style={TD}>{r.nguoiKy}</td>
                    <td style={TD}>
                      {isToTrinh ? (
                        <span style={{ color: MUTED }}>–</span>
                      ) : r.trangThai === "Chưa ký số" ? (
                        <Badge color="#991b1b" bg="#fee2e2">Chưa ký số</Badge>
                      ) : (
                        <Badge
                          color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                          bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}
                        >
                          {r.trangThai}
                        </Badge>
                      )}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isToTrinh && (
                          <button onClick={() => setShowTrinhKy(true)} title="Trình lại tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}>
                            <RotateCcw size={14} color="#1d4ed8" />
                          </button>
                        )}
                        {isToTrinh && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        )}
                        {!isToTrinh && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số") && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa dự thảo" style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        )}
                        <button onClick={() => { if (isToTrinh) setShowTaoTT(true); else setShowTaoDuThao(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title={isToTrinh ? "Xem chi tiết tờ trình" : "Xem chi tiết dự thảo"}>
                          <Eye size={14} color="#0e7490" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {!isVu234(userRole, detail?.loaiAn) && (
            <select value={filterDon} onChange={e => setFilterDon(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
              <option value="">Lọc theo đơn</option>
              {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN/ĐƠN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r) => {
                const realIdx = lichSuData.indexOf(r);
                return (
                  <React.Fragment key={"main-" + realIdx}>
                    <tr style={{ background: "#fff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                      <td style={TD}>{r.ngayTrinh}</td>
                      <td style={TD}>{r.lanh}</td>
                      <td style={TD}>{r.capTrinh}</td>
                      <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                      <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" }}>{r.yKien}</td>
                      <td style={TD}>{r.ngayDuyet}</td>
                      <td style={TD}>
                        {r.trangThai === "cho-duyet"
                          ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                          : r.trangThai === "tu-choi"
                            ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                            : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                            <Eye size={13} color="#0e7490" />
                          </button>
                          {r.trangThai === "cho-duyet" && (
                            <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                          {r.trangThai === "tu-choi" ? (
                            <button title="Trình lại tờ trình" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                              <RotateCcw size={13} color="#1d4ed8" />
                            </button>
                          ) : (
                            <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                              <Send size={13} color={RED} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
