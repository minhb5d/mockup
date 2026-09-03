import React from "react";
import type { DonCase, VuAnAction } from "./data";

export const F = "'Be Vietnam Pro', sans-serif";
export const RED = "#8b0000";
export const BORDER = "#e5e7eb";
export const TEXT = "#111827";
export const MUTED = "#6b7280";
export const BG = "#f9fafb";

// ── small helpers ────────────────────────────────────────────────────────────

export function Badge({
  color,
  bg,
  children,
}: {
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 500, fontFamily: F,
        color, background: bg, whiteSpace: "nowrap",
        alignSelf: "flex-start",
      }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: DonCase["trangThai"] | undefined }) {
  if (!status) return null;
  const map = {
    "don-cho-phe-duyet": { label: "Đơn chờ phê duyệt", color: "#92400e", bg: "#fef3c7" },
    "da-co-vu-an": { label: "Đã có vụ án", color: "#065f46", bg: "#d1fae5" },
    "thong-bao-giai-quyet": { label: "Đã có Thông báo giải quyết", color: "#065f46", bg: "#d1fae5" },
    "chua-co-hs": { label: "Chưa có hồ sơ liên hành", color: "#92400e", bg: "#fef3c7" },
  };
  const s = map[status];
  if (!s) return null;
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

export function VuAnBtn({ action, onClick }: { action: VuAnAction; onClick?: () => void }) {
  const map: Record<VuAnAction, { label: string; color: string; bg: string; border: string }> = {
    "huy-ghep": { label: "Hủy ghép vụ án", color: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  };
  const s = map[action];
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500,
        color: s.color, background: s.bg, border: `1px solid ${s.border}`,
        cursor: "pointer", fontFamily: F, whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </button>
  );
}

export function Tag({ type }: { type: string }) {
  if (type === "an-dan-de" || type === "an-chi-dao" || type === "Án chỉ đạo")
    return (
      <Badge color="#854d0e" bg="#fefce8">
        ★ Án chỉ đạo
      </Badge>
    );
  if (type === "an-quoc-hoi" || type === "an-qh" || type === "Án quốc hội")
    return (
      <Badge color="#3730a3" bg="#e0e7ff">
        🏛️ Án quốc hội
      </Badge>
    );
  if (type === "an-tvtn" || type === "Án TVTN")
    return (
      <Badge color="#065f46" bg="#d1fae5">
        📋 Án TVTN
      </Badge>
    );
  if (type === "an-tu-hinh" || type === "Án tử hình")
    return (
      <Badge color="#7f1d1d" bg="#fee2e2">
        ● Án tử hình
      </Badge>
    );
  return null;
}

export function getAnDacThuOptions(userRole?: UserRoleType, loaiAnStr?: string) {
  const loai = (loaiAnStr || "").toLowerCase();
  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || loai.includes("hình sự");
  const isOtherVu = userRole === "vu-2" || userRole === "vu-3" || userRole === "vu-4" || userRole === "dan-su" || userRole === "hanh-chinh";

  if (isVu1) {
    return ["Án quốc hội", "Án chỉ đạo", "Án TVTN", "Án tử hình"];
  } else if (isOtherVu) {
    return ["Án quốc hội", "Án chỉ đạo"];
  } else {
    return ["Án quốc hội", "Án chỉ đạo", "Án TVTN", "Án tử hình"];
  }
}

export function getThoiHieuOptions(userRole?: UserRoleType, loaiAnStr?: string) {
  const loai = (loaiAnStr || "").toLowerCase();

  if (loai.includes("hình sự")) {
    return [
      { val: "1 năm", label: "1 năm" },
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
      { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    ];
  }

  if (loai && !loai.includes("hình sự")) {
    return [
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
    ];
  }

  // Nếu chưa chọn loại án cụ thể, xét theo tài khoản phân quyền userRole
  const isHinhSuRole = userRole === "vu-1" || userRole === "hinh-su";
  const isOtherRole = userRole === "vu-2" || userRole === "vu-3" || userRole === "vu-4" || userRole === "dan-su" || userRole === "hanh-chinh";

  if (isHinhSuRole) {
    return [
      { val: "1 năm", label: "1 năm" },
      { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    ];
  }

  if (isOtherRole) {
    return [
      { val: "3 năm", label: "3 năm" },
      { val: "5 năm", label: "5 năm" },
    ];
  }

  return [
    { val: "1 năm", label: "1 năm" },
    { val: "Không xác định thời hiệu", label: "Không xác định thời hiệu" },
    { val: "3 năm", label: "3 năm" },
    { val: "5 năm", label: "5 năm" },
  ];
}

export function CapXetXu({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 500,
        color: "#92400e", background: "#fef3c7",
        fontFamily: F, alignSelf: "flex-start",
      }}
    >
      {/* Cấp xét xử: {label} */}
    </span>
  );
}

// ── Table header / row ───────────────────────────────────────────────────────

export const TH_STYLE: React.CSSProperties = {
  padding: "8px 8px",
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  background: "#f9fafb",
  borderBottom: `1px solid ${BORDER}`,
  textAlign: "left" as const,
  fontFamily: F,
  borderRight: `1px solid ${BORDER}`,
  wordBreak: "break-word",
  lineHeight: 1.3,
};

export const TD_STYLE: React.CSSProperties = {
  padding: "10px 8px",
  verticalAlign: "top",
  borderBottom: `1px solid ${BORDER}`,
  borderRight: `1px solid ${BORDER}`,
  fontFamily: F,
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

export type UserRoleType = "vu-1" | "vu-2" | "vu-3" | "vu-4" | "toan-bo" | "hinh-su" | "dan-su" | "hanh-chinh";

export interface DepartmentInfo {
  code: string;
  maDonVi: string;
  tenDayDu: string;
  tenRutGon: string;
  loaiAnChinh: string;
  loaiAnList: string[];
  donViNhanMacDinh: string;
  nguoiLienQuanLabels: {
    ben1: string;
    ben2: string;
    ben3: string;
  };
}

export function getDepartmentInfo(role: UserRoleType): DepartmentInfo {
  if (role === "vu-1" || role === "hinh-su") {
    return {
      code: "D01.106",
      maDonVi: "D01",
      tenDayDu: "Vụ Giám đốc kiểm tra về hình sự",
      tenRutGon: "Vụ Giám đốc, kiểm tra I",
      loaiAnChinh: "Hình sự",
      loaiAnList: ["Hình sự"],
      donViNhanMacDinh: "Vụ Giám đốc, kiểm tra I (TANDTC)",
      nguoiLienQuanLabels: {
        ben1: "Bị cáo",
        ben2: "Bị hại",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-2" || role === "dan-su") {
    return {
      code: "D01.107",
      maDonVi: "D01",
      tenDayDu: "Vụ Giám đốc kiểm tra về dân sự",
      tenRutGon: "Vụ Giám đốc, kiểm tra II",
      loaiAnChinh: "Dân sự",
      loaiAnList: ["Dân sự"],
      donViNhanMacDinh: "Vụ Giám đốc, kiểm tra II (TANDTC)",
      nguoiLienQuanLabels: {
        ben1: "Nguyên đơn",
        ben2: "Bị đơn",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-3") {
    return {
      code: "D01.108",
      maDonVi: "D01",
      tenDayDu: "Vụ Giám đốc, kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên",
      tenRutGon: "Vụ Giám đốc, kiểm tra III",
      loaiAnChinh: "Kinh doanh thương mại",
      loaiAnList: ["Kinh doanh thương mại", "Phá sản", "Lao động", "Hôn nhân gia đình", "Sở hữu trí tuệ"],
      donViNhanMacDinh: "Vụ Giám đốc, kiểm tra III (TANDTC)",
      nguoiLienQuanLabels: {
        ben1: "Nguyên đơn",
        ben2: "Bị đơn",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  if (role === "vu-4" || role === "hanh-chinh") {
    return {
      code: "D01.109",
      maDonVi: "D01",
      tenDayDu: "Vụ Giám đốc, kiểm tra về hành chính",
      tenRutGon: "Vụ Giám đốc, kiểm tra IV",
      loaiAnChinh: "Hành chính",
      loaiAnList: ["Hành chính"],
      donViNhanMacDinh: "Vụ Giám đốc, kiểm tra IV (TANDTC)",
      nguoiLienQuanLabels: {
        ben1: "Người khởi kiện",
        ben2: "Người bị kiện",
        ben3: "Người có quyền lợi và nghĩa vụ liên quan",
      },
    };
  }
  return {
    code: "TANDTC",
    maDonVi: "D01",
    tenDayDu: "Lãnh đạo TAND tối cao / Quản trị viên hệ thống",
    tenRutGon: "Toàn bộ Vụ án (4 Vụ)",
    loaiAnChinh: "Toàn bộ các loại án",
    loaiAnList: ["Hình sự", "Dân sự", "Kinh doanh thương mại", "Hành chính", "Lao động", "Hôn nhân gia đình"],
    donViNhanMacDinh: "Tòa án nhân dân tối cao",
    nguoiLienQuanLabels: {
      ben1: "Nguyên đơn / Bị cáo / Người khởi kiện",
      ben2: "Bị đơn / Bị hại / Người bị kiện",
      ben3: "Người có quyền lợi và nghĩa vụ liên quan",
    },
  };
}
