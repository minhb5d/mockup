import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, RotateCcw, Calendar } from "lucide-react";
import { F, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";


function GiaoTieuHoSoView({ onClose, userRole }: { onClose: () => void; userRole?: UserRoleType }) {
  const [activeTab, setActiveTab] = useState<"nhan-vphctp" | "giao-ttv">("giao-ttv");
  const [expanded, setExpanded] = useState(true);

  const mainTabs = [
    { id: "nhan-vphctp", label: "Nhận THS từ VPHCTP" },
    { id: "giao-ttv", label: "Giao THS đến TTV" },
  ] as const;

  const giaoCases = [
    {
      maDon: "6966",
      soCV: "514 - 20/07/2026",
      thuLyMoi: "54682424",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt",
      biCao: "Vũ Hòa Hảo",
      ndd: "NGUYỄN TRUNG HÒA",
      soBA: "12/2026/HS-PT",
      ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân cấp cao tại Hà Nội",
      thoiHieu: "1 năm",
      loaiAn: "Hình sự",
    },
    {
      maDon: "6965",
      soCV: "513 - 20/07/2026",
      thuLyMoi: "54682424",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt",
      biCao: "Vũ Hòa Hảo",
      ndd: "NGUYỄN TRUNG HÒA",
      soBA: "12/2026/HS-PT",
      ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân cấp cao tại Hà Nội",
      thoiHieu: "2 năm",
      loaiAn: "Hình sự",
    },
  ];

  const filterInputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    padding: "0 8px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  const cellInputStyle: React.CSSProperties = {
    width: "100%",
    height: 30,
    padding: "0 8px",
    fontSize: 11,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  const DateInputBox = ({ placeholder }: { placeholder: string }) => (
    <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          ...filterInputStyle,
          paddingRight: 28,
        }}
      />
      <Calendar size={13} color="#9ca3af" style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
    </div>
  );

  const SelectBox = ({ placeholder, options = [] }: { placeholder: string; options?: string[] }) => (
    <select
      defaultValue=""
      style={filterInputStyle}
    >
      <option value="" disabled>{placeholder}</option>
      <option value="all">Tất cả</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0 }}>
        Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án › <b style={{ color: TEXT }}>Giao tiểu hồ sơ</b>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, padding: "0 20px", background: "#fff", flexShrink: 0 }}>
        {mainTabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontFamily: F,
                fontWeight: active ? 700 : 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: active ? "#800000" : "#6b7280",
                borderBottom: active ? `2px solid #800000` : "2px solid transparent",
                marginBottom: -1,
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Filter Panel Box */}
      <div style={{ padding: "14px 20px", flexShrink: 0 }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "14px 16px" }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: expanded ? 10 : 0 }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Người đứng đơn</div>
              <input placeholder="Người gửi đơn" style={filterInputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Số bản án/quyết định</div>
              <input placeholder="Số bản án/quyết định" style={filterInputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày bản án/quyết định</div>
              <DateInputBox placeholder="Vui lòng chọn" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Tòa ra bản án/quyết định</div>
              <SelectBox placeholder="Vui lòng chọn" options={["TAND Cấp cao tại Hà Nội", "TAND Cấp cao tại Đà Nẵng", "TAND Cấp cao tại TP.HCM", "TAND tỉnh Bắc Ninh", "TAND tỉnh Hà Nam"]} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày nhận đơn</div>
              <DateInputBox placeholder="Vui lòng chọn" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Thụ lý đơn</div>
              <SelectBox placeholder="Thụ lý đơn" options={["Thụ lý mới", "Đã thụ lý", "Chưa thụ lý"]} />
            </div>
          </div>

          {/* Row 2 (Collapsible) */}
          {expanded && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Số công văn chuyển</div>
                <input placeholder="Số công văn chuyển" style={filterInputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày công văn chuyển</div>
                <DateInputBox placeholder="Ngày công văn chuyển" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Thẩm phán</div>
                <SelectBox placeholder="Chọn cán bộ giải quyết" options={["Nguyễn Biên Thuỳ", "Trần Minh Đức", "Lê Văn Minh", "Chu Thị Thu Hiền"]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Loại án</div>
                <SelectBox placeholder="Loại án" options={["Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại", "Hôn nhân gia đình", "Lao động"]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Giao tiểu hồ sơ</div>
                <SelectBox placeholder="Giao tiểu hồ sơ" options={["Chưa giao tiểu hồ sơ", "Đã giao tiểu hồ sơ"]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Thẩm tra viên</div>
                <SelectBox placeholder="TTV giải quyết" options={["Lý Thái Phúc", "Vũ Biêu Thư", "Trần Thị Mai", "Vũ Xuân Hiển", "Đỗ Thị Thu Hằng"]} />
              </div>
            </div>
          )}

          {/* Filter Footer Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
            <button
              onClick={() => setExpanded((v) => !v)}
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
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {expanded ? "Thu gọn" : "Mở rộng"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: "#800000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#fff",
                  color: "#374151",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar Above Table */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "0 20px 10px", flexShrink: 0 }}>
        <button
          style={{
            padding: "7px 22px",
            background: "#800000",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F,
          }}
        >
          Lưu
        </button>
        <button
          style={{
            padding: "7px 18px",
            background: "#0088a9",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: F,
          }}
        >
          In danh sách
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "7px 20px",
            background: "#fff",
            color: "#374151",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          Đóng
        </button>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "20%" }} />
              {activeTab === "giao-ttv" ? (
                <>
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "12%" }} />
                </>
              ) : (
                <>
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                </>
              )}
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>Thông tin đơn</th>
                <th style={TH_STYLE}>Đương sự và người đứng đơn</th>
                <th style={TH_STYLE}>Thông tin BA/QĐ đề nghị GĐT,TT</th>
                {activeTab === "giao-ttv" ? (
                  <>
                    <th style={TH_STYLE}>Người giao Vụ GĐ,KT</th>
                    <th style={TH_STYLE}>Ngày Vụ nhận</th>
                    <th style={TH_STYLE}>TTV nhận</th>
                    <th style={TH_STYLE}>Ngày TTV nhận</th>
                    <th style={TH_STYLE}>Ghi chú</th>
                  </>
                ) : (
                  <>
                    <th style={TH_STYLE}>Người giao VPHCTP</th>
                    <th style={TH_STYLE}>Người nhận Vụ GĐ,KT</th>
                    <th style={TH_STYLE}>Ngày Vụ nhận</th>
                    <th style={TH_STYLE}>Ghi chú</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {giaoCases.map((gc, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: `1px solid #f3f4f6`,
                  }}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{idx + 1}</td>

                  {/* Cột 1: Thông tin đơn */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, borderLeft: "3px solid #059669", paddingLeft: 6 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Mã đơn: <b>{gc.maDon}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        CV chuyển: {gc.soCV}
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Thụ lý mới: <b>{gc.thuLyMoi}</b>
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>
                        Hình thức: {gc.hinhThuc}
                      </span>
                    </div>
                  </td>

                  {/* Cột 2: Đương sự và người đứng đơn */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Người khiếu nại: <b>{gc.nguoiKhieuNai}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Bị cáo: <b>{gc.biCao}</b>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        NĐD: <b>{gc.ndd}</b>
                      </span>
                    </div>
                  </td>

                  {/* Cột 3: Thông tin BA/QĐ */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Số BA: <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(gc.soBA, gc.loaiAn)}</span>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Ngày: <span style={{ color: "#2563eb" }}>{gc.ngayBA}</span>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Tại: {gc.toa}
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        Thời hiệu: <b style={{ color: "#047857" }}>{gc.thoiHieu}</b>
                      </span>
                    </div>
                  </td>

                  {/* Các cột tương tác */}
                  {activeTab === "giao-ttv" ? (
                    <>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Vũ Diệu Thúy</option>
                          <option value="2">Phạm Thị Bích Ngọc</option>
                          <option value="3">Nguyễn Văn A</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Lý Thái Phúc</option>
                          <option value="2">Vũ Biêu Thư</option>
                          <option value="3">Trần Minh Đức</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <input placeholder="Nhập ghi chú" style={cellInputStyle} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người giao</option>
                          <option value="1">Cán bộ VPHCTP 1</option>
                          <option value="2">Cán bộ VPHCTP 2</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Vũ Diệu Thúy</option>
                          <option value="2">Phạm Thị Bích Ngọc</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input placeholder="dd/mm/yyyy" style={{ ...cellInputStyle, paddingRight: 22 }} />
                          <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 6, pointerEvents: "none" }} />
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <input placeholder="Nhập ghi chú" style={cellInputStyle} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED }}>
            <span>Hiển thị 1–{giaoCases.length} trong tổng {giaoCases.length} bản ghi</span>
            <div style={{ flex: 1 }} />
            <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>‹</button>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: "1px solid #800000", color: "#800000", fontSize: 12, fontWeight: 700 }}>
              1
            </span>
            <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>›</button>
            <select style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 11, outline: "none" }}>
              <option>10 / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────


export default GiaoTieuHoSoView;
