import React, { useState } from "react";
import {
  Search, RefreshCw, Eye, Calendar,
  ChevronDown, ChevronUp, RotateCcw, X, Save, Printer,
} from "lucide-react";
import {
  TAB_CONFIG, getCasesByTab, countByTab,
  type DonCase, type TabId, type VuAnAction,
} from "./data";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, VuAnBtn, Tag, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { getPartyLabels, isVu234, getQuanHePhapLuat } from "./App";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { TraDonModal } from "./NhanDonModals";

// ── Thông tin đơn cell ───────────────────────────────────────────────────────

function CellThongTinDon({ c, tab }: { c: DonCase; tab?: TabId }) {
  const isDaCoVuAn = tab === "da-co-vu-an" || c.tabs?.includes("da-co-vu-an") || c.daThuLy;
  const isDonChoPheDuyet = tab === "don-cho-phe-duyet" || c.tabs?.includes("don-cho-phe-duyet");
  const isBac3Tab = tab === "da-co-vu-an" || isDonChoPheDuyet;
  const hasButPhe = Boolean(c.yKienLD?.length);
  const showDuKien = !hasButPhe;

  const capThamPhanText = isBac3Tab ? "TPB3" : c.capThamPhan;
  const tpBac3List = ["Nguyễn Biên Thuỳ", "Trần Minh Đức", "Lê Văn Minh", "Chu Thị Thu Hiền", "Nguyễn Thị Hoa"];
  const thamPhanText = isBac3Tab ? (tpBac3List[c.id % tpBac3List.length] || c.thamPhan) : c.thamPhan;

  let hinhThucText = c.hinhThuc;
  if (tab === "da-co-vu-an" && (hinhThucText.toLowerCase().includes("kháng nghị") || hinhThucText.toLowerCase().includes("hồ sơ"))) {
    hinhThucText = c.soCV ? "CV kiến nghị GĐT/TT" : "Đơn đề nghị GĐT/TT";
  }

  if (tab === "cho-y-kien") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>Mã đơn: {c.maDon || c.maVanThuDen}</span>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Hình thức: {hinhThucText}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.type === "don" ? (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã đơn: {c.maDon}
          </span>
          {c.daThuLy ? (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Đã thụ lý</span>
          ) : (
            <>
              {c.soCV && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  CV chuyển: {c.soCV} - {c.ngayCV}
                </span>
              )}
              {c.thuLyMoi && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  Thụ lý mới: {c.thuLyMoi}
                </span>
              )}
            </>
          )}
          {isDaCoVuAn && c.soToTrinh && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Số tờ trình - Ngày tờ trình: <b>{c.soToTrinh}</b> - {c.ngayToTrinh || "-"}
            </span>
          )}
          {hinhThucText.toLowerCase().includes("công văn") || hinhThucText.toLowerCase().includes("cv ") ? (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Đơn vị gửi công văn - số - ngày: {c.donViGuiCongVan || "-"} - {c.soCV || "-"} - {c.ngayCV || "-"}
            </span>
          ) : null}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {thamPhanText} ({capThamPhanText})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {hinhThucText}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã văn thư đến: {c.maVanThuDen} - {c.ngayVanThuDen}
          </span>
          {c.soHSKN && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Số HSKN: {c.soHSKN} - {c.ngayHSKN}
            </span>
          )}
          {c.thuLyXetXu && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Thụ lý xét xử: {c.thuLyXetXu}
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {thamPhanText} ({capThamPhanText})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {hinhThucText}
          </span>
        </>
      )}
      {c.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2, alignItems: "flex-start" }}>
          {c.tags.map((t) => <Tag key={t} type={t} />)}
        </div>
      )}
    </div>
  );
}

// ── Đương sự cell ────────────────────────────────────────────────────────────

function CellDuongSu({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  const { label1, label2 } = getPartyLabels(c.loaiAn, userRole);
  const nguoiDungDon = c.ndd
    ? (c.id % 4 === 0 ? [c.ndd, "Nguyễn Văn B", "Trần Thị C", "Lê Văn D"] : [c.ndd])
    : [];
  const visibleNdd = nguoiDungDon.slice(0, 3);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.nguoiKhieuNai && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label1}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhieuNai}</span>
        </span>
      )}
      {c.biCao && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label2}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.biCao}</span>
        </span>
      )}
      {nguoiDungDon.length > 0 && (
        <>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Người đứng đơn: <b>{visibleNdd.join(", ")}</b>
            {nguoiDungDon.length > 3 && (
              <span title={nguoiDungDon.join(", ")} style={{ color: "#2563eb", cursor: "help", marginLeft: 4 }}>…</span>
            )}
          </span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Địa chỉ: {c.diaChiNguoiDungDon || "-"}</span>
        </>
      )}
      {c.nguoiKhangNghi && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Người kháng nghị: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhangNghi}</span>
        </span>
      )}
    </div>
  );
}

// ── BA/QĐ cell ───────────────────────────────────────────────────────────────

function CellBA({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  if (!c.soBA && !c.toa) return <span style={{ color: TEXT, fontSize: 11, fontFamily: F }}>-</span>;
  const showQHPL = isVu234(userRole, c.loaiAn);
  const qhplText = getQuanHePhapLuat(c);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.soBA && (
        <span style={{ fontSize: 11, fontFamily: F }}>
          <span style={{ color: TEXT }}>Số BA: </span>
          <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(c.soBA, c.loaiAn)}</span>
          {c.ngayBA && (
            <>
              <span style={{ color: TEXT }}> Ngày: </span>
              <span style={{ color: "#2563eb" }}>{c.ngayBA}</span>
            </>
          )}
        </span>
      )}
      {c.toa && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Tại: </span>{c.toa}
        </span>
      )}
      {c.thoiHieu && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Thời hiệu: </span>
          <span style={{ color: c.thoiHieu === "Không xác định thời hiệu" ? "#047857" : "#c2410c", fontWeight: 600 }}>{c.thoiHieu}</span>
        </span>
      )}
      {showQHPL && (
        <span style={{ fontSize: 11, color: "#047857", fontFamily: F, fontWeight: 500 }}>
          <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{qhplText}
        </span>
      )}
      <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: F, fontStyle: "italic" }}>Các bản án khác liên quan</span>
      {c.loaiAn === "Hình sự" ? (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }} title={c.biCao ? `${c.biCao}, Nguyễn Văn B, Trần Văn C, Lê Văn D` : ""}>
          Bị cáo: {c.biCao || "-"}{c.id % 4 === 0 ? " + 3 người khác" : ""}
        </span>
      ) : c.loaiAn === "Hành chính" ? (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }} title={`${c.nguoiKhieuNai || "-"} / ${c.biCao || "-"}`}>Người khởi kiện: {c.nguoiKhieuNai || "-"}; Người bị kiện: {c.biCao || "-"}</span>
      ) : (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }} title={`${c.nguoiKhieuNai || "-"} / ${c.biCao || "-"}`}>Nguyên đơn: {c.nguoiKhieuNai || "-"}; Bị đơn: {c.biCao || "-"}</span>
      )}
    </div>
  );
}

// ── Thông tin vụ án cell ─────────────────────────────────────────────────────

function CellVuAn({ c, onThemHoSo, onVuAnAction, onXuLyTBGQ }: { c: DonCase; onThemHoSo?: () => void; onVuAnAction?: (action: VuAnAction, c: DonCase) => void; onXuLyTBGQ?: (c: DonCase) => void }) {
  const hasGiaiQuyet = !!(c.thongBaoBoSung || c.ttvGiaiQuyet || c.tpGiaiQuyet);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {(c.tenVuAn || c.ttv) && (
        <div style={{ textAlign: "left" }}>
          {c.tenVuAn && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4, display: "block" }}>
              Tên vụ án: {c.tenVuAn}
            </span>
          )}
          {c.ttv && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV: {c.ttv}
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>LĐV: {c.lanhDaoVu || "-"}</span>
          <span style={{ fontSize: 11, color: c.trangThaiGiaoTHS === "Đã giao THS" ? "#047857" : "#b45309", fontFamily: F, display: "block", fontWeight: 600 }}>
            {c.trangThaiGiaoTHS || "Chưa giao THS"}
          </span>
        </div>
      )}
      {hasGiaiQuyet && (
        <div style={{
          marginTop: 2, padding: "6px 8px",
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 5, display: "flex", flexDirection: "column", gap: 3,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#15803d", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {(() => {
              const raw = c.thongBaoBoSung || "Thông báo giải quyết";
              const match = raw.match(/^(.*?)(?:\s+số\s+(.+))$/i);
              const loai = (match?.[1] || raw).trim();
              const so = (match?.[2] || "-").trim();
              const ngay = c.ngayTra || c.ngayThaoTac || "--/--/----";
              return `Đã có TBGQ: ${loai} - ${so} - ${ngay}`;
            })()}
          </span>
          {c.ttvGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV giải quyết: <strong>{c.ttvGiaiQuyet}</strong>
            </span>
          )}
          {c.tpGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TP giải quyết: <strong>{c.tpGiaiQuyet}</strong>
            </span>
          )}
        </div>
      )}
      {hasGiaiQuyet && onXuLyTBGQ && (
        <button onClick={() => onXuLyTBGQ(c)} style={{alignSelf:"flex-start",padding:"3px 7px",fontSize:10,border:"1px solid #93c5fd",background:"#eff6ff",color:"#1d4ed8",borderRadius:4,cursor:"pointer"}}>
          Xử lý vụ việc đã có TBGQ
        </button>
      )}
      {c.vuAnActions && c.vuAnActions.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {c.vuAnActions.map((a) => (
            <VuAnBtn
              key={a}
              action={a}
              onClick={a === "them-vu-an" ? onThemHoSo : () => onVuAnAction?.(a, c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Ý kiến lãnh đạo cell ─────────────────────────────────────────────────────

function CellYKienLD({ c }: { c: DonCase }) {
  if (!c.yKienLD?.length)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      {c.yKienLD.map((y, i) => {
        const isTraLai = y.decision === "tra-lai";
        const isThuLy = y.decision === "thuy-moi";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Badge color={isTraLai ? "#9a3412" : isThuLy ? "#065f46" : "#991b1b"} bg={isTraLai ? "#ffedd5" : isThuLy ? "#d1fae5" : "#fee2e2"}>
              {isTraLai ? "Trả lại" : isThuLy ? "Thụ lý mới" : "Không thụ lý"}
            </Badge>
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{y.name} – {y.role}</span>
            <span style={{ fontSize: 11, color: isTraLai ? "#c2410c" : "#16a34a", fontFamily: F }}>
              {isTraLai ? "Đã trả lại" : "Đã duyệt"} - {y.date}
            </span>
            {isTraLai && y.reason && <span style={{ fontSize: 11, color: "#9a3412", fontFamily: F }}>Lý do: {y.reason}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Nhận/Trả cell ────────────────────────────────────────────────────────────

function CellNhanTra({ c, tab }: { c: DonCase; tab?: TabId }) {
  if (tab === "da-co-vu-an") {
    const ngayDuyet =
      (c as any).ngayDuyetToTrinh ||
      c.yKienLD?.[0]?.date ||
      c.ngayThaoTac ||
      c.ngayNhan ||
      "24/07/2026";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500 }}>
          {ngayDuyet}
        </span>
      </div>
    );
  }

  const hasData = c.ngayNhan || c.nguoiThaoTac || c.nguoiTra;
  if (!hasData)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {c.ngayNhan && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày nhận: {c.ngayNhan}
        </span>
      )}
      {c.nguoiThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người thao tác: {c.nguoiThaoTac}
        </span>
      )}
      {c.ngayThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày thao tác: {c.ngayThaoTac}
        </span>
      )}
      {c.nguoiTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người trả: {c.nguoiTra}
        </span>
      )}
      {c.ngayTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày trả: {c.ngayTra}
        </span>
      )}
    </div>
  );
}

// ── Action bar ───────────────────────────────────────────────────────────────

function ActionBar({
  tab,
  selectedCases,
  onTraDon,
  onGiaoTieuHoSo,
  onInBaoCao,
}: {
  tab: TabId;
  selectedCases: DonCase[];
  onTraDon: () => void;
  onGiaoTieuHoSo: () => void;
  onInBaoCao?: () => void;
}) {
  const canGiaoTHS = tab === "da-co-vu-an" && selectedCases.length > 0 && selectedCases.every((c) => c.daThuLy || c.tabs.includes("da-co-vu-an"));

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 20px", background: "#fff",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ flex: 1 }} />
      <button
        onClick={onTraDon}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: RED,
          border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        ↩ Trả đơn
      </button>
      {tab === "da-co-vu-an" && (
        <button
          onClick={canGiaoTHS ? onGiaoTieuHoSo : () => alert("Vui lòng chọn đơn đã có vụ án và đủ điều kiện giao tiểu hồ sơ.")}
          disabled={!canGiaoTHS}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: canGiaoTHS ? "#16a34a" : "#d1d5db", color: "#fff",
            border: "none", borderRadius: 4, cursor: canGiaoTHS ? "pointer" : "not-allowed",
            fontSize: 12, fontWeight: 600, fontFamily: F,
          }}
        >
          ✓ Giao tiểu hồ sơ
        </button>
      )}
      <button
        onClick={onInBaoCao}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: "#374151",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        <Printer size={13} /> In danh sách
      </button>
      <button
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, background: "#fff",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
        }}
      >
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );
}

// ── Pagination button style ───────────────────────────────────────────────────

const paginBtn: React.CSSProperties = {
  padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
  background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
};

// ── Main list table ───────────────────────────────────────────────────────────

function CaseTable({
  tab,
  onGiaoTieuHoSo,
  onThemHoSo,
  overrideCases,
  userRole,
  selectedIds,
  onSelectedIdsChange,
  onVuAnAction,
  onXuLyTBGQ,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  overrideCases?: DonCase[];
  userRole?: UserRoleType;
  selectedIds: number[];
  onSelectedIdsChange: (ids: number[]) => void;
  onVuAnAction?: (action: VuAnAction, c: DonCase) => void;
  onXuLyTBGQ?: (c: DonCase) => void;
}) {
  const cases = overrideCases ?? getCasesByTab(tab, userRole);

  const lastColHeader =
    tab === "cho-y-kien" ? "Ý KIẾN LÃNH ĐẠO" : "THÔNG TIN VỤ ÁN";

  const duongSuHeader =
    userRole === "vu-1" || userRole === "hinh-su"
      ? "NGƯỜI KHIẾU NẠI & BỊ CÁO"
      : userRole === "vu-4" || userRole === "hanh-chinh"
        ? "NGƯỜI KHỞI KIỆN & NGƯỜI BỊ KIỆN"
        : userRole === "vu-2" || userRole === "vu-3" || userRole === "dan-su"
          ? "NGUYÊN ĐƠN & BỊ ĐƠN"
          : "ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN";

  const baHeader = isVu234(userRole)
    ? "THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT & QHPL"
    : "THÔNG TIN BA/QĐ ĐỂ NGHỊ GĐT,TT";

  // Đối chiếu 27.08: bỏ cột THÔNG TIN NHẬN/TRẢ và NGÀY DUYỆT TỜ TRÌNH khỏi bảng danh sách.
  const hasNhanTraCol = false;

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        {hasNhanTraCol ? (
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: 52 }} />
          </colgroup>
        ) : (
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: 52 }} />
          </colgroup>
        )}
        <thead>
          <tr>
            <th style={TH_STYLE}>
              <input type="checkbox" checked={cases.length > 0 && cases.every((c) => selectedIds.includes(c.id))} onChange={(e) => onSelectedIdsChange(e.target.checked ? cases.map((c) => c.id) : [])} />
            </th>
            <th style={TH_STYLE}>STT</th>
            <th style={TH_STYLE}>THÔNG TIN ĐƠN</th>
            <th style={TH_STYLE}>{duongSuHeader}</th>
            <th style={TH_STYLE}>{baHeader}</th>
            <th style={TH_STYLE}>{lastColHeader}</th>
            {hasNhanTraCol && <th style={TH_STYLE}>{nhanTraHeader}</th>}
            <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={hasNhanTraCol ? 8 : 7} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>
                Không có dữ liệu phù hợp với điều kiện tìm kiếm.
              </td>
            </tr>
          )}
          {cases.map((c, idx) => (
            <tr
              key={c.id}
              style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#fafafa")
              }
            >
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={(e) => { e.stopPropagation(); onSelectedIdsChange(e.target.checked ? [...selectedIds, c.id] : selectedIds.filter((id) => id !== c.id)); }} />
              </td>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 13, fontFamily: F }}>
                {idx + 1}
              </td>
              <td style={TD_STYLE}><CellThongTinDon c={c} tab={tab} /></td>
              <td style={TD_STYLE}><CellDuongSu c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}><CellBA c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}>
                {tab === "cho-y-kien" ? (
                  <CellYKienLD c={c} />
                ) : (
                  <CellVuAn c={c} onThemHoSo={onThemHoSo} onVuAnAction={onVuAnAction} onXuLyTBGQ={onXuLyTBGQ} />
                )}
              </td>
              {hasNhanTraCol && (
                <td style={TD_STYLE}>
                  {tab === "tra-lai" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: RED, fontFamily: F }}>
                        Lý do trả:
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4 }}>
                        {c.lyDoTraLai || "Đơn không thuộc thẩm quyền giải quyết theo thủ tục giám đốc thẩm, tái thẩm"}
                      </span>
                      {c.ngayTra && (
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}>
                          Ngày trả: {c.ngayTra}
                        </span>
                      )}
                    </div>
                  ) : (
                    <CellNhanTra c={c} tab={tab} />
                  )}
                </td>
              )}
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 3 }}>
                  <button
                    onClick={() => alert(`Xem chi tiết ${c.maDon || c.maVanThuDen || c.id}`)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}
                    title="Xem chi tiết"
                  >
                    <Eye size={15} color="#6b7280" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderTop: `1px solid ${BORDER}`,
          background: "#fff", fontSize: 12, color: MUTED, fontFamily: F,
        }}
      >
        <span>Hiển thị 1–{Math.min(cases.length, 10)} trong tổng {cases.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>
    </div>
  );
}

// ── Giao tiểu hồ sơ view ─────────────────────────────────────────────────────

export function GiaoTieuHoSoView({ onClose, userRole }: { onClose: () => void; userRole?: UserRoleType }) {
  const [activeTab, setActiveTab] = useState<"nhan-vphctp" | "giao-ttv">("nhan-vphctp");
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
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
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
                          <option value="1">Vũ Diệu Thúy, 01/07/1988 / Thẩm tra viên</option>
                          <option value="2">Phạm Thị Bích Ngọc, 04/04/1977 / Phó Vụ trưởng, Thẩm phán</option>
                          <option value="3">Nguyễn Văn A, 12/08/1985 / Cán bộ Vụ GĐ,KT</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Lý Thái Phúc, 05/10/1986 / Thẩm tra viên</option>
                          <option value="2">Vũ Biêu Thư, 03/02/1984 / Thẩm tra viên</option>
                          <option value="3">Trần Minh Đức, 19/11/1979 / Thẩm phán</option>
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
                          <option value="1">Nguyễn Văn Hùng, 12/04/1982 / Chuyên viên VPHCTP</option>
                          <option value="2">Trần Thị Mai, 08/06/1987 / Chuyên viên VPHCTP</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select defaultValue="" style={cellInputStyle}>
                          <option value="" disabled>Chọn người nhận</option>
                          <option value="1">Vũ Diệu Thúy, 01/07/1988 / Thẩm tra viên</option>
                          <option value="2">Phạm Thị Bích Ngọc, 04/04/1977 / Phó Vụ trưởng, Thẩm phán</option>
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

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ extra }: { extra?: string }) {
  return (
    <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
      Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án{extra ? ` › ${extra}` : ""} › Danh sách
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
  userRole,
}: {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  userRole?: UserRoleType;
}) {
  return (
    <div
      style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`,
        background: "#fff", padding: "0 20px", flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      {TAB_CONFIG.map((t) => {
        const active = t.id === activeTab;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _count = countByTab(t.id as TabId, userRole);
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id as TabId)}
            style={{
              padding: "12px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400,
              background: "none", border: "none", cursor: "pointer",
              color: active ? RED : MUTED,
              borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
              marginBottom: -1, whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}


function XuLyTBGQCuModal({ c, onClose }: { c: DonCase; onClose: () => void }) {
  const [buoc, setBuoc] = useState(1);
  const [ketQua, setKetQua] = useState<"tiep-tuc" | "tra-ket-qua" | "">("");
  const steps = [
    "Vụ GĐ,KT nhận danh sách đơn từ VPHCTP",
    "Kiểm tra điều kiện và xác định vụ việc đã có Thông báo giải quyết",
    "Vụ trưởng tạo tờ trình trình Phó Chánh án",
    "Phó Chánh án xem xét, cho ý kiến",
    "Vụ trưởng gửi kết quả lại VPHCTP",
    "VPHCTP quyết định tiếp tục thụ lý hoặc trả lời kết quả cũ",
  ];
  return <div style={{position:"fixed",inset:0,zIndex:4500,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"min(760px,96vw)",background:"#fff",borderRadius:9,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,.25)",fontFamily:F}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <b style={{color:RED}}>Xử lý đơn thuộc vụ việc đã có Thông báo giải quyết</b><button onClick={onClose}>×</button>
      </div>
      <div style={{padding:16}}>
        <div style={{padding:"8px 10px",background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:5,fontSize:11,color:"#075985",marginBottom:12}}>
          Luồng chuẩn Draw.io page 7 / mục 2.4. Đơn: <b>{c.maDon || c.maVanThuDen || c.id}</b>. TBGQ hiện có: <b>{c.thongBaoBoSung || "Thông báo giải quyết trước"}</b>.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{steps.map((x,i)=><button key={x} onClick={()=>setBuoc(i+1)} style={{textAlign:"left",padding:8,border:`1px solid ${buoc>=i+1?"#86efac":BORDER}`,background:buoc>=i+1?"#f0fdf4":"#fff",borderRadius:5,fontSize:11}}><b>{i+1}.</b> {x}</button>)}</div>
        <div style={{marginTop:14,padding:12,border:`1px solid ${BORDER}`,borderRadius:6}}><b style={{fontSize:12}}>Kết quả tại VPHCTP</b><div style={{display:"flex",gap:14,marginTop:8,fontSize:12}}><label><input type="radio" name="tbgq-kq" checked={ketQua==="tiep-tuc"} onChange={()=>setKetQua("tiep-tuc")}/> Tiếp tục thụ lý → Thụ lý đơn → chuyển lại Vụ GĐ,KT</label><label><input type="radio" name="tbgq-kq" checked={ketQua==="tra-ket-qua"} onChange={()=>setKetQua("tra-ket-qua")}/> Không tiếp tục → trả lời kết quả giải quyết đơn</label></div></div>
      </div>
      <div style={{padding:"10px 16px",borderTop:`1px solid ${BORDER}`,textAlign:"right"}}><button onClick={onClose} style={{marginRight:8}}>Đóng</button><button onClick={()=>{if(!ketQua){alert("Chọn kết quả xử lý tại VPHCTP");return;} alert(ketQua==="tiep-tuc"?"Đã ghi nhận tiếp tục thụ lý và chuyển lại Vụ GĐ,KT":"Đã ghi nhận trả lời theo kết quả giải quyết trước");onClose();}} style={{background:RED,color:"#fff",border:0,padding:"7px 14px",borderRadius:4}}>Lưu kết quả</button></div>
    </div>
  </div>;
}

// ── Main "Nhận đơn và TL vụ án" view ─────────────────────────────────────────

export default function NhanDonTLVuAnView({
  userRole,
  activeTab,
  setActiveTab,
  filterExpanded,
  setFilterExpanded,
  onGiaoTieuHoSo,
  onThemHoSo,
  onInBaoCao,
}: {
  userRole?: UserRoleType;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  filterExpanded: boolean;
  setFilterExpanded: (v: boolean | ((prev: boolean) => boolean)) => void;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  onInBaoCao?: (tabId: TabId) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showTraDon, setShowTraDon] = useState(false);
  const [tbgqCase, setTbgqCase] = useState<DonCase | null>(null);
  const currentCases = getCasesByTab(activeTab, userRole);
  const visibleCases = currentCases;
  const selectedCases = currentCases.filter((c) => selectedIds.includes(c.id));

  const handleTraDon = () => {
    if (selectedCases.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn để trả.");
      return;
    }
    const invalid = selectedCases.find((c) => !c.ngayNhan && !c.nguoiThaoTac && !c.daThuLy);
    if (invalid) {
      alert(`Đơn ${invalid.maDon || invalid.id} chưa ở trạng thái đã nhận tại Vụ GĐ,KT nên không thể trả.`);
      return;
    }
    setShowTraDon(true);
  };

  const handleVuAnAction = (_action: VuAnAction, _c: DonCase) => {
    // CẦ-045: giữ nguyên nút Hủy ghép như mockup hiện tại; TH-018 màu đỏ nên không bổ sung popup/handler mới.
  };

  return (
    <>
      <Breadcrumb />
      <TabBar activeTab={activeTab} userRole={userRole} onTabChange={setActiveTab} />
      <SearchFilterPanel expanded={filterExpanded} userRole={userRole} onToggle={() => setFilterExpanded((v) => !v)} />
      <ActionBar tab={activeTab} selectedCases={selectedCases} onTraDon={handleTraDon} onGiaoTieuHoSo={onGiaoTieuHoSo} onInBaoCao={() => onInBaoCao?.(activeTab)} />
      <CaseTable tab={activeTab} userRole={userRole} onGiaoTieuHoSo={onGiaoTieuHoSo} onThemHoSo={onThemHoSo} overrideCases={visibleCases} selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} onVuAnAction={handleVuAnAction} onXuLyTBGQ={setTbgqCase} />
      {showTraDon && <TraDonModal cases={selectedCases} onClose={() => setShowTraDon(false)} onSuccess={() => setSelectedIds([])} />}
      {tbgqCase && <XuLyTBGQCuModal c={tbgqCase} onClose={() => setTbgqCase(null)} />}
    </>
  );
}
