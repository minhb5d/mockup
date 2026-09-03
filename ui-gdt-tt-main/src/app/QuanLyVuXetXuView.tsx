import React, { useState, useRef, useEffect } from "react";
import { PrintReportModal, BIEU_MAU_VU_XET_XU } from "./PrintReportModal";
import { Search, RotateCcw, ChevronDown, ChevronUp, MoreVertical, X, Eye, Pencil, Printer, FileText, Trash2, Calendar, Save, Send } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, TaiKhoanPhanQuyenBar, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { TrinhKyModal, HoSoToTrinhModal } from "./TrinhKyModal";
import { LichXetXuModal } from "./PhanCongHDXXView";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { LOAI_AN_OPTIONS } from "./data";
import {
  DANH_SACH_TOA_AN_FILTER,
  DANH_SACH_LANH_DAO_FILTER,
  DANH_SACH_TTV_FILTER,
} from "./VuAnSearchFilterPanel";

// ── Types ─────────────────────────────────────────────────────────────────────

type TrangThai =
  | "chua-xx-chua-ds"       // Chưa xét xử – chưa có danh sách
  | "chua-xx-da-ds"         // Chưa xét xử – đã có danh sách
  | "chua-thu-ly"           // Chưa thụ lý xét xử
  | "hoan-xet-xu"           // Hoãn xét xử (SRS tách trạng thái riêng)
  | "rut-khang-nghi"        // Rút kháng nghị
  | "da-xx"                 // Đã xét xử
  | "chuyen-tham-quyen";    // Chuyển thẩm quyền xét xử

type DetailTab = "thong-tin" | "thu-ly" | "to-trinh" | "phan-cong" | "qd-bi-cao" | "qd-vu-an" | "ket-qua" | "tai-lieu-vu-an" | "ho-so-vu-an" | "don-gdt-tt";

type VuXetXuRow = {
  id: number;
  maVuAn: string;
  tenVuAn: string;
  // List display fields (image-12)
  soThuLy: string;              // e.g. "54681978"
  ngayThuLy: string;            // e.g. "09/07/2026"
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;             // e.g. "Sơ thẩm"
  thoiHieu: string;             // e.g. "5 năm"
  tag?: "an-qh" | "an-quoc-hoi" | "an-tu-hinh" | "an-chi-dao" | "an-tvtn";
  ndkn: string;
  ndd: string;
  ttv: string;
  ldv: string;
  tp: string;
  trangThai: TrangThai;
  thoiHanXX?: string;
  soQD?: string;
  ngayQD?: string;
  // Detail view fields (kept for backward compat)
  soNgayBAQD: string;
  toaRABAQD: string;
  soNgayKhangNghi: string;
  nguoiKhangNghi: string;
  soNgayThuLy: string;
  vienKiemSat: string;
  toaAnGiaiQuyet: string;
  biCao: string;
  loaiAn: string;
  chuToa: string;
  hdxx: string;
  ngayXX: string;
  phongXX: string;
  // THIẾU [TB]: bổ sung QHPL (bắt buộc) + QHPL thống kê — SRS mục A.5–A.11
  qhpl?: string;
  qhplThongKe?: string;
  // Đối chiếu STG: tab Kết quả xét xử thiếu 2 trường này so với STG
  lienQuanBanAnSoTham?: string;
  toaAnThuLy?: string;
};

// ── Helper to resolve party labels & values by department/case type ─────────
export function getVuXetXuPartyInfo(row: VuXetXuRow | ModalVuAnRow | any, userRole?: UserRoleType) {
  const loai = (row.loaiAn || "").toLowerCase();
  const soBA = (row.soBA || "").toUpperCase();
  const isHinhSu = loai.includes("hình sự") || soBA.includes("HS") || (!row.loaiAn && (userRole === "vu-1" || userRole === "hinh-su"));
  const isHanhChinh = loai.includes("hành chính") || soBA.includes("HC") || (!row.loaiAn && (userRole === "vu-4" || userRole === "hanh-chinh"));
  const isPhaSan = loai.includes("phá sản") || soBA.includes("PS");

  if (isHinhSu) {
    return {
      label1: "Người khiếu nại",
      val1: row.ndkn || row.nkn || row.nguoiKhieuNai || row.nguoiKhoiKien,
      label2: "Bị cáo",
      val2: row.biCao || row.ndd || row.nguoiBiKien,
    };
  } else if (isHanhChinh) {
    return {
      label1: "Người khởi kiện",
      val1: row.ndkn || row.nkn || row.nguoiKhoiKien,
      label2: "Người bị kiện",
      val2: row.ndd || row.biCao || row.nguoiBiKien,
    };
  } else if (isPhaSan) {
    return {
      label1: "Người yêu cầu",
      val1: row.ndkn || row.nkn || row.nguoiKhoiKien,
      label2: "Doanh nghiệp bị yêu cầu",
      val2: row.ndd || row.biCao || row.nguoiBiKien,
    };
  } else {
    // Dân sự, Hôn nhân gia đình, Kinh doanh thương mại, Lao động, Sở hữu trí tuệ (Vụ 2, Vụ 3)
    return {
      label1: "Nguyên đơn",
      val1: row.ndkn || row.nkn || row.nguyenDon || row.nguoiKhoiKien,
      label2: "Bị đơn",
      val2: row.ndd || row.biDon || row.biCao || row.nguoiBiKien,
    };
  }
}

// ── Data ──────────────────────────────────────────────────────────────────────

// LỆCH (SRS): Hội đồng toàn thể cố định 11 thẩm phán, hiển thị xám, không thêm/bớt
const SO_TP_HOI_DONG_TOAN_THE = 11;
const DANH_SACH_THAM_PHAN = [
  { id: "tp1", ten: "Lê Thị Thu Hiển", chucVu: "Chánh án TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp2", ten: "Nguyễn Như Thắng", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp3", ten: "Nguyễn Biên Thùy", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp4", ten: "Trần Hồng Hà", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp5", ten: "Ngô Hồng Phúc", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp6", ten: "Lê Thanh Phong", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp7", ten: "Nguyễn Văn Cường", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp8", ten: "Lê Văn Minh", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp9", ten: "Phạm Văn Nam", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp10", ten: "Trịnh Thị Minh Trang", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra I" },
  { id: "tp11", ten: "Phạm Thị Bích Ngọc", chucVu: "Thẩm phán cao cấp", donVi: "Tòa hình sự TAND cấp cao" },
  { id: "tp12", ten: "Võ Thị Thùy Giang", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp13", ten: "Trịnh Đức Minh", chucVu: "Thẩm phán cao cấp", donVi: "Vụ Giám đốc kiểm tra II" },
  { id: "tp14", ten: "Vũ Diệu Thùy", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra I" },
  { id: "tp15", ten: "Hoàng Quỳnh Trang", chucVu: "Thẩm phán cao cấp", donVi: "Tòa hình sự TAND cấp cao" },
  { id: "tp16", ten: "Lê Hồng Quang", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp17", ten: "Nguyễn Duy Giảng", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp18", ten: "Trương Việt Toàn", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp19", ten: "Phạm Quốc Anh", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra III" },
];

const ROWS: VuXetXuRow[] = [
  // ── 1. HÌNH SỰ (Vụ I) ──────────────────────────────────────────────────────────
  {
    id: 1,
    maVuAn: "VA26-002148", tenVuAn: "ĐẶNG THIÊN DƯƠNG – Tội cố ý gây thương tích",
    soThuLy: "54681978", ngayThuLy: "09/07/2026",
    soBA: "5469/2026/HS-ST", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "1 năm", tag: "an-qh",
    ndkn: "Trần Văn Hải", ndd: "Nguyễn Đơn Hải",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "5469/2026/HS-ST – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2707 – 27/07/2026", soNgayThuLy: "54681978 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Văn Hải", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 2,
    maVuAn: "VA26-002012", tenVuAn: "ĐẶNG THÌN DƯƠNG – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ",
    soThuLy: "54681923", ngayThuLy: "09/07/2026",
    soBA: "54681139/2026/HS-PT", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Phúc thẩm", thoiHieu: "Không xác định thời hiệu", tag: "an-tu-hinh",
    ndkn: "Phan Văn Hùng", ndd: "Nguyễn Văn Đạt",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Biên Thùy",
    trangThai: "chua-xx-da-ds", thoiHanXX: "19 ngày",
    soNgayBAQD: "54681139/2026/HS-PT – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    nguoiKhangNghi: "Phan Văn Hùng",
    soNgayKhangNghi: "QDKN_1111 – 11/11/2024", soNgayThuLy: "54681923 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Phan Văn Hùng", loaiAn: "Hình sự", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "28/07/2026", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 3,
    maVuAn: "VA26-001888", tenVuAn: "Tội vi phạm quy định về quản lý, sử dụng tài sản Nhà nước gây thất thoát",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "112/2026/HS-ST", ngayBA: "15/06/2026",
    toa: "Tòa án nhân dân TP Hà Nội",
    capXetXu: "Sơ thẩm", thoiHieu: "1 năm", tag: "an-chi-dao",
    ndkn: "Trần Minh Quang", ndd: "Lê Thanh Tùng",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "112/2026/HS-ST – 15/06/2026", toaRABAQD: "Tòa án nhân dân TP Hà Nội",
    soNgayKhangNghi: "QDKN_1888 – 20/06/2026", soNgayThuLy: "–",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Minh Quang", loaiAn: "Hình sự", chuToa: "–",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 4,
    maVuAn: "VA26-001201", tenVuAn: "Tham ô tài sản nhà nước đặc biệt nghiêm trọng",
    soThuLy: "54681813", ngayThuLy: "09/07/2026",
    soBA: "18/2026/HS-ST", ngayBA: "08/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "Không xác định thời hiệu", tag: "an-tvtn",
    ndkn: "Đỗ Thành Công", ndd: "Phan Kim Ngân",
    ttv: "Nguyễn Thị Hương", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "rut-khang-nghi", soQD: "54/2026/QĐ-CA", ngayQD: "09/07/2026",
    soNgayBAQD: "18/2026/HS-ST – 08/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_1201 – 01/05/2026", soNgayThuLy: "54681813 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Đỗ Thành Công", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },
  {
    id: 5,
    maVuAn: "VA26-001402", tenVuAn: "Tội lừa đảo chiếm đoạt tài sản quy mô lớn",
    soThuLy: "54681555", ngayThuLy: "10/05/2026",
    soBA: "99/2026/HS-PT", ngayBA: "20/04/2026",
    toa: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Phúc thẩm", thoiHieu: "1 năm", tag: "an-tu-hinh",
    ndkn: "Bùi Thị Tuyết", ndd: "Hoàng Văn Nam",
    ttv: "Hoàng Quỳnh Trang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Biên Thùy",
    trangThai: "da-xx", soQD: "102/2026/QĐ-GĐT", ngayQD: "25/06/2026",
    soNgayBAQD: "99/2026/HS-PT – 20/04/2026", toaRABAQD: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_1402 – 05/05/2026", soNgayThuLy: "54681555 – 10/05/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Bùi Thị Tuyết", loaiAn: "Hình sự", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "20/06/2026", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 6,
    maVuAn: "VA26-001600", tenVuAn: "Tội vận chuyển trái phép chất ma túy qua biên giới",
    soThuLy: "54681600", ngayThuLy: "01/06/2026",
    soBA: "45/2026/HS-ST", ngayBA: "12/05/2026",
    toa: "Tòa án nhân dân tỉnh Quảng Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "Không xác định thời hiệu", tag: "an-tu-hinh",
    ndkn: "Nguyễn Văn Lợi", ndd: "Trần Đức Tiến",
    ttv: "Vũ Diệu Thúy", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chuyen-tham-quyen", soQD: "18/2026/QĐ-CTQ", ngayQD: "15/06/2026",
    soNgayBAQD: "45/2026/HS-ST – 12/05/2026", toaRABAQD: "Tòa án nhân dân tỉnh Quảng Ninh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_1600 – 20/05/2026", soNgayThuLy: "54681600 – 01/06/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Nguyễn Văn Lợi", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng toàn thể", ngayXX: "–", phongXX: "–",
  },

  // ── 2. DÂN SỰ (Vụ II) ─────────────────────────────────────────────────────────
  {
    id: 7,
    maVuAn: "VA26-001543", tenVuAn: "Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "21/2026/DS-ST", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Ngô Mai Trang", ndd: "Phạm Văn Thành, Lê Thị Nhải",
    ttv: "Hoàng Quỳnh Trang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "21/2026/DS-ST – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_1543 – 15/06/2026", soNgayThuLy: "–",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ngô Mai Trang", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 8,
    maVuAn: "VA26-000987", tenVuAn: "Tranh chấp quyền sử dụng đất và tài sản gắn liền với đất",
    soThuLy: "54681748", ngayThuLy: "08/07/2026",
    soBA: "08/2026/DS-ST", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Nguyễn Quốc Huy", ndd: "Lâm Gia Bảo",
    ttv: "Vũ Diệu Thúy", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Như Thắng",
    trangThai: "da-xx", soQD: "88/2026/QĐ-GĐT", ngayQD: "08/07/2026",
    soNgayBAQD: "08/2026/DS-ST – 08/07/2025", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_0987 – 10/04/2026", soNgayThuLy: "54681748 – 08/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Nguyễn Quốc Huy", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng toàn thể", ngayXX: "18/06/2026", phongXX: "Phòng xét xử số 3",
  },
  {
    id: 9,
    maVuAn: "VA26-002300", tenVuAn: "Tranh chấp thừa kế tài sản và yêu cầu hủy giấy chứng nhận quyền sử dụng đất",
    soThuLy: "54682300", ngayThuLy: "12/07/2026",
    soBA: "77/2026/DS-PT", ngayBA: "28/06/2026",
    toa: "Tòa án nhân dân TP Đà Nẵng",
    capXetXu: "Phúc thẩm", thoiHieu: "5 năm", tag: "an-qh",
    ndkn: "Lê Văn Hùng", ndd: "Lê Thị Hồng",
    ttv: "Vô Thị Thúy Giang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "77/2026/DS-PT – 28/06/2026", toaRABAQD: "Tòa án nhân dân TP Đà Nẵng",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2300 – 05/07/2026", soNgayThuLy: "54682300 – 12/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Lê Văn Hùng", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 10,
    maVuAn: "VA26-002410", tenVuAn: "Tranh chấp hợp đồng vay tài sản và hợp đồng thế chấp quyền sử dụng đất",
    soThuLy: "54682410", ngayThuLy: "14/07/2026",
    soBA: "105/2026/DS-ST", ngayBA: "30/06/2026",
    toa: "Tòa án nhân dân tỉnh Bình Dương",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Ngân hàng Thương mại Cổ phần Á Châu", ndd: "Trần Quốc Toản",
    ttv: "Nguyễn Thị Hương", ldv: "Phạm Thị Bích Ngọc", tp: "Trịnh Đức Minh",
    trangThai: "chua-xx-da-ds", thoiHanXX: "25 ngày",
    soNgayBAQD: "105/2026/DS-ST – 30/06/2026", toaRABAQD: "Tòa án nhân dân tỉnh Bình Dương",
    nguoiKhangNghi: "Ngân hàng Thương mại Cổ phần Á Châu",
    soNgayKhangNghi: "QDKN_2410 – 08/07/2026", soNgayThuLy: "54682410 – 14/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Quốc Toản", loaiAn: "Dân sự", chuToa: "Trịnh Đức Minh",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "10/08/2026", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 11,
    maVuAn: "VA26-002511", tenVuAn: "Tranh chấp quyền sở hữu trí tuệ và bồi thường thiệt hại ngoài hợp đồng",
    soThuLy: "54682511", ngayThuLy: "15/07/2026",
    soBA: "34/2026/DS-PT", ngayBA: "02/07/2026",
    toa: "Tòa án nhân dân TP Hồ Chí Minh",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Công ty Cổ phần Công nghệ ABC", ndd: "Công ty TNHH Truyền thông XYZ",
    ttv: "Trịnh Thị Minh Trang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "rut-khang-nghi", soQD: "72/2026/QĐ-CA", ngayQD: "18/07/2026",
    soNgayBAQD: "34/2026/DS-PT – 02/07/2026", toaRABAQD: "Tòa án nhân dân TP Hồ Chí Minh",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2511 – 10/07/2026", soNgayThuLy: "54682511 – 15/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Công ty TNHH Truyền thông XYZ", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },

  // ── 3. HÀNH CHÍNH (Vụ IV) ──────────────────────────────────────────────────────
  {
    id: 12,
    maVuAn: "VA26-000654", tenVuAn: "Khiếu kiện quyết định xử phạt vi phạm hành chính trong quản lý đất đai",
    soThuLy: "54681800", ngayThuLy: "08/07/2026",
    soBA: "0807/2026/HC-ST", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân quận Ninh Kiều",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "NGHIÊM THỊ XUÂN", ndd: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Như Thắng",
    trangThai: "chuyen-tham-quyen", soQD: "29/2026/QĐ-CTQ", ngayQD: "12/07/2026",
    soNgayBAQD: "0807/2026/HC-ST – 08/07/2025", toaRABAQD: "Tòa án nhân dân quận Ninh Kiều",
    soNgayKhangNghi: "QDKN_0654 – 20/03/2026", soNgayThuLy: "54681800 – 08/07/2026",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU", loaiAn: "Hành chính", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng toàn thể", ngayXX: "–", phongXX: "–",
  },
  {
    id: 13,
    maVuAn: "VA26-002613", tenVuAn: "Khiếu kiện quyết định thu hồi đất và cưỡng chế giải phóng mặt bằng",
    soThuLy: "54682613", ngayThuLy: "10/07/2026",
    soBA: "18/2026/HC-ST", ngayBA: "08/07/2026",
    toa: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm", tag: "an-chi-dao",
    ndkn: "Đỗ Thành Công", ndd: "Ủy ban nhân dân tỉnh Bắc Ninh",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "hoan-xet-xu",
    soNgayBAQD: "18/2026/HC-ST – 08/07/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại Hà Nội",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2613 – 09/07/2026", soNgayThuLy: "54682613 – 10/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân tỉnh Bắc Ninh", loaiAn: "Hành chính", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 14,
    maVuAn: "VA26-002714", tenVuAn: "Khiếu kiện quyết định phê duyệt phương án bồi thường, hỗ trợ tái định cư",
    soThuLy: "54682714", ngayThuLy: "12/07/2026",
    soBA: "52/2026/HC-PT", ngayBA: "25/06/2026",
    toa: "Tòa án nhân dân cấp cao tại TP.HCM",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Phạm Văn Minh", ndd: "Ủy ban nhân dân TP Thủ Đức",
    ttv: "Hoàng Quỳnh Trang", ldv: "Phạm Thị Bích Ngọc", tp: "Trịnh Đức Minh",
    trangThai: "chua-xx-da-ds", thoiHanXX: "14 ngày",
    soNgayBAQD: "52/2026/HC-PT – 25/06/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại TP.HCM",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2714 – 02/07/2026", soNgayThuLy: "54682714 – 12/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân TP Thủ Đức", loaiAn: "Hành chính", chuToa: "Trịnh Đức Minh",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "05/08/2026", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 15,
    maVuAn: "VA26-002815", tenVuAn: "Khiếu kiện quyết định cấp giấy chứng nhận quyền sử dụng đất trái pháp luật",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "99/2026/HC-ST", ngayBA: "12/07/2026",
    toa: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Nguyễn Văn Thanh", ndd: "Ủy ban nhân dân huyện Yên Lạc",
    ttv: "Vũ Diệu Thúy", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "99/2026/HC-ST – 12/07/2026", toaRABAQD: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    soNgayKhangNghi: "QDKN_2815 – 15/07/2026", soNgayThuLy: "–",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân huyện Yên Lạc", loaiAn: "Hành chính", chuToa: "–",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 16,
    maVuAn: "VA26-002916", tenVuAn: "Khiếu kiện quyết định áp dụng biện pháp ngăn chặn hành chính",
    soThuLy: "54682916", ngayThuLy: "05/06/2026",
    soBA: "14/2026/HC-ST", ngayBA: "10/05/2026",
    toa: "Tòa án nhân dân tỉnh Hải Dương",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Hoàng Văn Tuấn", ndd: "Cục trưởng Cục Thuế tỉnh Hải Dương",
    ttv: "Nguyễn Thị Hương", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Biên Thùy",
    trangThai: "da-xx", soQD: "44/2026/QĐ-GĐT", ngayQD: "28/06/2026",
    soNgayBAQD: "14/2026/HC-ST – 10/05/2026", toaRABAQD: "Tòa án nhân dân tỉnh Hải Dương",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    soNgayKhangNghi: "QDKN_2916 – 20/05/2026", soNgayThuLy: "54682916 – 05/06/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Cục trưởng Cục Thuế tỉnh Hải Dương", loaiAn: "Hành chính", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "20/06/2026", phongXX: "Phòng xét xử số 3",
  },
  {
    id: 17,
    maVuAn: "VA26-003017", tenVuAn: "Khiếu kiện hành vi hành chính từ chối giải quyết thủ tục đăng ký biến động đất đai",
    soThuLy: "54683017", ngayThuLy: "15/06/2026",
    soBA: "28/2026/HC-PT", ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Trần Thị Mai", ndd: "Văn phòng Đăng ký đất đai tỉnh Hòa Bình",
    ttv: "Vô Thị Thúy Giang", ldv: "Lê Thị Thu Hiển", tp: "Lê Thị Thu Hiển",
    trangThai: "rut-khang-nghi", soQD: "81/2026/QĐ-CA", ngayQD: "02/07/2026",
    soNgayBAQD: "28/2026/HC-PT – 01/06/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại Hà Nội",
    soNgayKhangNghi: "QDKN_3017 – 10/06/2026", soNgayThuLy: "54683017 – 15/06/2026",
    nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Văn phòng Đăng ký đất đai tỉnh Hòa Bình", loaiAn: "Hành chính", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },
];

const paginBtn: React.CSSProperties = { padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT };

const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "thong-tin", label: "Thông tin vụ án" },
  { key: "thu-ly", label: "Thụ lý" },
  { key: "don-gdt-tt", label: "Đơn GĐT,TT" },
  { key: "to-trinh", label: "Tờ trình" },
  { key: "phan-cong", label: "Phân công" },
  { key: "qd-bi-cao", label: "Quyết định bị cáo" },
  { key: "qd-vu-an", label: "Quyết định vụ án" },
  { key: "ket-qua", label: "Kết quả xét xử" },
  { key: "tai-lieu-vu-an", label: "Tài liệu vụ án" },
  { key: "ho-so-vu-an", label: "Hồ sơ vụ án" },
];

// ── Trạng thái cell (rich – matches image-5) ─────────────────────────────────

function TrangThaiCell({ row }: { row: VuXetXuRow }) {
  switch (row.trangThai) {
    case "chua-xx-chua-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Chưa có danh sách vụ xét xử</span>
        </div>
      );
    case "chua-xx-da-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Đã có danh sách vụ xét xử</span>
          {row.thoiHanXX && (
            <span style={{ fontSize: 11, color: RED, fontFamily: F, fontStyle: "italic" }}>Thời hạn xét xử: {row.thoiHanXX}</span>
          )}
        </div>
      );
    case "chua-thu-ly":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid ${RED}`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: RED, background: "#fff" }}>Chưa thụ lý xét xử</span>
        </div>
      );
    case "hoan-xet-xu":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #d97706", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#b45309", background: "#fffbeb" }}>Hoãn xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Lịch cũ được gỡ; lập lịch mới khi có thời gian/địa điểm theo quyết định hoãn</span>
        </div>
      );
    case "rut-khang-nghi":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #0891b2", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#0891b2", background: "#ecfeff" }}>Rút kháng nghị</span>
          {row.soQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số QĐ: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "da-xx":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #6b7280", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#374151", background: "#f3f4f6" }}>Đã xét xử</span>
          {row.soQD !== undefined && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "chuyen-tham-quyen":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #2563eb", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#2563eb", background: "#eff6ff" }}>Chuyển thẩm quyền xét xử</span>
        </div>
      );
  }
}

// ── Info grid ─────────────────────────────────────────────────────────────────

function InfoGrid({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {rows.map(([l1, v1, l2, v2], i) => (
          <tr key={i}>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}`, width: "32%" }}>{v1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l2}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}` }}>{v2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ThongTinChungBlock({ row }: { row: VuXetXuRow }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
        <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin chung của vụ án</span>
      </div>
      {open && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
          </div>
          <InfoGrid rows={[
            ["Số – Ngày thụ lý XX", row.soNgayThuLy || "–", "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
            ["Số – Ngày BAST (hoặc QĐST)", row.soNgayBAQD, "Người kháng nghị", row.nguoiKhangNghi || "Viện trưởng Viện kiểm sát nhân dân tối cao"],
            ["Tòa ra BA/QĐ", row.toaRABAQD, "Tòa án giải quyết", row.toaAnGiaiQuyet],
          ]} />
        </div>
      )}
    </div>
  );
}

// ── Tab: Thông tin vụ án ─────────────────────────────────────────────────────

function TabThongTin({ row, userRole, onDirtyChange }: { row: VuXetXuRow; userRole?: UserRoleType; onDirtyChange?: (dirty: boolean) => void }) {
  const [sec1Open, setSec1Open] = useState(true);
  const [sec2Open, setSec2Open] = useState(true);
  // THIẾU [TB]: cảnh báo "Các thông tin thay đổi chưa được Lưu" khi rời tab lúc đang sửa
  const [kSuaOpenRaw, setKSuaOpenRaw] = useState(false);
  const kSuaOpen = kSuaOpenRaw;
  const setKSuaOpen = (v: boolean) => { setKSuaOpenRaw(v); onDirtyChange?.(v); };
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px" };
  const inp: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 4, padding: "7px 10px", fontSize: 12, fontFamily: F, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" as const };

  // LỆCH (SRS): thao tác dòng người tham gia tố tụng là Sửa + Biểu mẫu (không phải Xem + Xóa)
  const actBtns = <div style={{ display: "flex", gap: 4 }}><button title="Sửa" style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb" }}><Pencil size={14} /></button><button title="Biểu mẫu" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button></div>;

  const PTab = ({ cols, rows, noData }: { cols: string[]; rows: React.ReactNode[][]; noData?: boolean }) => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{cols.map(c => <th key={c} style={TH}>{c}</th>)}</tr></thead>
      <tbody>
        {(noData || rows.length === 0)
          ? <tr><td colSpan={cols.length} style={{ padding: 16, textAlign: "center" as const, fontSize: 12, color: MUTED, fontFamily: F }}>Không có dữ liệu</td></tr>
          : rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>{r.map((c, j) => <td key={j} style={TD}>{c}</td>)}</tr>)
        }
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Section 1 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec1Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin đề nghị Giám đốc thẩm / Tái thẩm</span>
        </div>
        {sec1Open && (
          <>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
              </div>
              <InfoGrid rows={[
                ["Số – Ngày thụ lý XX", row.soNgayThuLy || "–", "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
                ["Số – Ngày BAST (hoặc QĐST)", row.soNgayBAQD, "Người kháng nghị", row.nguoiKhangNghi],
                ["Tòa ra BA/QĐ", row.toaRABAQD, "Tòa án giải quyết", row.toaAnGiaiQuyet],
                // THIẾU [TB]: bổ sung Trạng thái, VKS giải quyết, Thời hiệu giải quyết, QHPL, QHPL thống kê — SRS mục A.5–A.11
                ["Trạng thái", row.trangThai, "Viện kiểm sát giải quyết", row.vienKiemSat || "–"],
                ["Thời hiệu giải quyết", row.thoiHieu || "–", "QHPL", row.qhpl || "–"],
                ["QHPL thống kê", row.qhplThongKe || "–", "", ""],
              ]} />
            </div>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin Hồ sơ Kháng nghị</span>
                <button onClick={() => setKSuaOpen(!kSuaOpen)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: kSuaOpen ? "#fee2e2" : "#fff", border: `1px solid ${kSuaOpen ? RED : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: kSuaOpen ? RED : TEXT }}>
                  <Pencil size={12} /> Sửa
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px 16px" }}>
                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ngày VKS chuyển hồ sơ:</label>
                    <input style={inp} defaultValue="27/07/2026" readOnly={!kSuaOpen} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Số bút lục VKS chuyển HS:</label>
                    <input style={inp} defaultValue="BL-2026/05" placeholder="Nhập số bút lục chuyển" readOnly={!kSuaOpen} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ghi chú chuyển HS:</label>
                    <input style={inp} placeholder="Nhập ghi chú" readOnly={!kSuaOpen} />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ngày VKS trả hồ sơ:</label>
                    <input style={inp} defaultValue="05/08/2026" readOnly={!kSuaOpen} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Số bút lục VKS trả HS:</label>
                    <input style={inp} defaultValue="BL-2026/18" placeholder="Nhập số bút lục trả" readOnly={!kSuaOpen} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ghi chú trả HS:</label>
                    <input style={inp} placeholder="Nhập ghi chú" readOnly={!kSuaOpen} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Section 2 */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec2Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin người liên quan</span>
        </div>
        {sec2Open && (
          <>
            {((row.loaiAn === "Hành chính" || userRole === "vu-4" || userRole === "hanh-chinh") ? [
              { title: "* Người khởi kiện", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Phạm Văn Cường", "1975", "Phường Hoàng Văn Thụ, TP. Bắc Giang", actBtns]] },
              { title: "* Người bị kiện", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", row.biCao || "Ủy ban nhân dân huyện Yên Dũng", "-", "Thị trấn Nham Biền, Huyện Yên Dũng", actBtns]] },
              { title: "Người có quyền lợi và nghĩa vụ liên quan", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Sở Tài nguyên và Môi trường tỉnh Bắc Giang", "-", "TP. Bắc Giang, Tỉnh Bắc Giang", actBtns]] },
            ] : (row.loaiAn === "Dân sự" || row.loaiAn === "Kinh doanh thương mại" || row.loaiAn === "Hôn nhân gia đình" || row.loaiAn === "Lao động" || userRole === "vu-2" || userRole === "vu-3" || userRole === "dan-su") ? [
              { title: "* Nguyên đơn", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Dương Thu Hằng", "2002", "Số 7, Xã Trường Sơn, Tỉnh Bắc Ninh", actBtns]] },
              { title: "* Bị đơn", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", row.biCao || "Nguyễn Thành Đô", "1997", "Số 10, Phường Chũ, Tỉnh Bắc Ninh", actBtns]] },
              { title: "Người có quyền lợi và nghĩa vụ liên quan", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Trần Anh Tuấn", "1988", "Xã Vân Sơn, Tỉnh Bắc Ninh", actBtns]] },
            ] : [
              { title: "* Người khiếu nại", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Phan Mai Hoa", "", "Tổ 3, phường Yên Nghĩa, TP Hà Nội", actBtns]] },
              // THIẾU [TB]: cột "Người được khiếu nại" + ràng buộc "Nội dung khiếu nại bắt buộc" — SRS mục C.8
              { title: "Người được khiếu nại", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Nội dung khiếu nại *", "Địa chỉ", "Thao tác"], rows: [["1", "Trần Văn Hải", "Khiếu nại về mức hình phạt tuyên tại bản án", "Tổ 7, Xã Yên Định, Tỉnh Bắc Ninh", actBtns]] },
              {
                title: "* Bị cáo", req: true, cols: ["STT", "Họ và tên (ngày sinh – CCCD)", "Tư cách tố tụng", "Thông tin bổ sung hình phạt", "Địa chỉ", "Thao tác"],
                rows: [["1", <div key="ht" style={{ fontSize: 12, lineHeight: 1.5, fontFamily: F }}><div style={{ fontWeight: 600 }}>{row.biCao}</div><div style={{ color: MUTED, fontSize: 11 }}>NS: 2000 · CCCD: 027200001234</div></div>, "Bị cáo đầu vụ", <div key="td" style={{ fontSize: 11, lineHeight: 1.5, fontFamily: F }}><div><b>Tội che giấu tội phạm (Tội danh chính)</b> Khoản 1 Điểm a</div><div style={{ color: MUTED }}>Tù có thời hạn – 15 năm, 6 tháng; Phạt tiền, khi không áp dụng hình phạt là phạt chính</div></div>, "Tổ 7, Xã Yên Định, Tỉnh Bắc Ninh", actBtns]]
              },
              { title: "Bị hại", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [] as React.ReactNode[][] },
              { title: "Người có quyền lợi và nghĩa vụ liên quan", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [] as React.ReactNode[][] },
            ]).map(sec => (
              <div key={sec.title} style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
                    {!sec.req && <input type="checkbox" style={{ cursor: "pointer" }} defaultChecked />}
                    {sec.title}
                  </label>
                  <button style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>+ Thêm mới</button>
                </div>
                <PTab cols={sec.cols} rows={sec.rows as React.ReactNode[][]} noData={sec.rows.length === 0} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Popup Sửa tội danh / hình phạt (THIẾU [Cao] – SRS Xét xử GĐT,TT) ──────────

const NHOM_TOI_DANH: { nhom: string; options: string[] }[] = [
  { nhom: "Giữ nguyên", options: ["Giữ nguyên tội danh", "Giữ nguyên hình phạt chính", "Giữ nguyên hình phạt bổ sung", "Giữ nguyên hình phạt tổng hợp", "Giữ nguyên trách nhiệm dân sự"] },
  { nhom: "Thay đổi", options: ["Đổi tội danh", "Đổi khoản/điểm", "Tăng hình phạt", "Giảm hình phạt", "Đổi hình phạt chính", "Đổi hình phạt bổ sung"] },
  { nhom: "Hủy / Đình chỉ", options: ["Hủy để điều tra lại", "Hủy để xét xử lại", "Đình chỉ vụ án", "Đình chỉ đối với bị cáo", "Miễn trách nhiệm hình sự"] },
];
const NAM_BO_LUAT_OPTIONS = ["1985", "1999", "2015", "2015 (sửa đổi 2017)"];

function SuaToiDanhModal({ onClose, tenBiCao }: { onClose: () => void; tenBiCao: string }) {
  const [anPhi, setAnPhi] = useState("");
  const [ngayNhanBA, setNgayNhanBA] = useState("");
  const [ngayHieuLuc, setNgayHieuLuc] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [dieuChinh, setDieuChinh] = useState<string[]>([]);
  const [namBoLuat, setNamBoLuat] = useState("2015");
  const [dieuLuat, setDieuLuat] = useState("");
  const [khoan, setKhoan] = useState("");
  const [toiDanhChinh, setToiDanhChinh] = useState(true);

  // SRS: hệ thống TỰ TÍCH "Xét xử lại" / "Đổi hình phạt" theo lựa chọn điều chỉnh
  const autoXetXuLai = dieuChinh.some(d => d.includes("xét xử lại") || d.includes("điều tra lại"));
  const autoDoiHinhPhat = dieuChinh.some(d => d.includes("hình phạt") && !d.startsWith("Giữ nguyên"));

  const toggle = (opt: string) =>
    setDieuChinh(prev => (prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]));

  const inp: React.CSSProperties = { width: "100%", padding: "6px 9px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", boxSizing: "border-box" as const, background: "#fff" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 4, fontFamily: F };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 6, width: 900, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 34px rgba(0,0,0,0.22)" }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>Sửa tội danh / hình phạt – {tenBiCao}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex" }}><X size={17} /></button>
        </div>

        <div style={{ padding: "14px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Hàng thông tin chung */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Án phí</label><input value={anPhi} onChange={e => setAnPhi(e.target.value)} placeholder="Nhập án phí" style={inp} /></div>
            <div><label style={lbl}>Ngày nhận bản án</label><input type="date" value={ngayNhanBA} onChange={e => setNgayNhanBA(e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Ngày hiệu lực</label><input type="date" value={ngayHieuLuc} onChange={e => setNgayHieuLuc(e.target.value)} style={inp} /></div>
          </div>
          <div><label style={lbl}>Lý do</label><textarea value={lyDo} onChange={e => setLyDo(e.target.value)} rows={2} placeholder="Nhập lý do sửa tội danh / hình phạt" style={{ ...inp, resize: "vertical" as const }} /></div>

          {/* Đối chiếu so sánh */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: BG, borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: TEXT, textTransform: "uppercase" as const }}>Đối chiếu so sánh</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Nội dung", "Bản án / Quyết định", "Cáo trạng"].map(h => <th key={h} style={{ ...TH_STYLE, fontSize: 11, padding: "8px 10px" }}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ["Tội danh", "Tội che giấu tội phạm", "Tội che giấu tội phạm"],
                  ["Điều luật", "Điều 389 – Khoản 1 – Điểm a", "Điều 389 – Khoản 1"],
                  ["Hình phạt chính", "Tù có thời hạn – 15 năm 6 tháng", "Đề nghị 14–16 năm"],
                  ["Hình phạt bổ sung", "Phạt tiền – 2.000.000 VNĐ", "–"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD_STYLE, fontSize: 12, fontWeight: 600 }}>{r[0]}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12 }}>{r[1]}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Điều chỉnh tội danh */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: BG, borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: TEXT, textTransform: "uppercase" as const }}>Điều chỉnh tội danh</div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {NHOM_TOI_DANH.map(g => (
                <div key={g.nhom}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 5 }}>{g.nhom}</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px 16px" }}>
                    {g.options.map(o => (
                      <label key={o} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: TEXT, cursor: "pointer" }}>
                        <input type="checkbox" checked={dieuChinh.includes(o)} onChange={() => toggle(o)} style={{ accentColor: RED, width: 14, height: 14 }} />
                        {o}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Căn cứ pháp lý + tội danh chính */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, alignItems: "end" }}>
            <div>
              <label style={lbl}>Năm bộ luật</label>
              <select value={namBoLuat} onChange={e => setNamBoLuat(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {NAM_BO_LUAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Điều luật</label><input value={dieuLuat} onChange={e => setDieuLuat(e.target.value)} placeholder="VD: Điều 389" style={inp} /></div>
            <div><label style={lbl}>Khoản</label><input value={khoan} onChange={e => setKhoan(e.target.value)} placeholder="VD: 1" style={inp} /></div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, cursor: "pointer", paddingBottom: 7 }}>
              <input type="checkbox" checked={toiDanhChinh} onChange={e => setToiDanhChinh(e.target.checked)} style={{ accentColor: RED, width: 15, height: 15 }} />
              Tội danh chính
            </label>
          </div>

          {/* Kết quả tự tích (SRS) */}
          <div style={{ padding: "10px 12px", background: "#f9fafb", border: `1px dashed ${BORDER}`, borderRadius: 4, display: "flex", gap: 20, fontSize: 12, color: TEXT }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" readOnly checked={autoXetXuLai} style={{ accentColor: RED, width: 14, height: 14 }} /> Xét xử lại <span style={{ color: MUTED, fontSize: 11 }}>(hệ thống tự tích)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" readOnly checked={autoDoiHinhPhat} style={{ accentColor: RED, width: 14, height: 14 }} /> Đổi hình phạt <span style={{ color: MUTED, fontSize: 11 }}>(hệ thống tự tích)</span>
            </label>
          </div>
        </div>

        <div style={{ padding: "12px 18px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "7px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          <button onClick={onClose} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Đơn GĐT,TT (THIẾU [Cao] – SRS Xem chi tiết vụ XX) ────────────────────

type DonGDTRow = {
  maDon: string;
  thongTinGQ: "Thụ lý mới" | "TLM trùng TP" | "Đã thụ lý";
  nguoiDungDon: string;
  phanLoai: "Đơn chính" | "Đơn trùng" | "Thụ lý đi kèm";
  ghiChuPhanLoai?: string;
  kqgq?: string;
  coQDKhangNghi: boolean;
};

const DON_GDT_TT_ROWS: DonGDTRow[] = [
  { maDon: "09D732899", thongTinGQ: "Thụ lý mới", nguoiDungDon: "Nguyễn Văn Minh", phanLoai: "Đơn chính", ghiChuPhanLoai: "Án chỉ đạo", kqgq: "Kháng nghị", coQDKhangNghi: true },
  { maDon: "09D732901", thongTinGQ: "TLM trùng TP", nguoiDungDon: "Trần Thị Hường", phanLoai: "Đơn trùng", kqgq: "", coQDKhangNghi: false },
  { maDon: "09D733010", thongTinGQ: "Đã thụ lý", nguoiDungDon: "Lê Văn Hòa", phanLoai: "Thụ lý đi kèm", ghiChuPhanLoai: "Án QH", kqgq: "", coQDKhangNghi: false },
];

function TabDonGDTTT({ row }: { row: VuXetXuRow }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  return (
    <div>
      <ThongTinChungBlock row={row} />
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>
            Danh sách đơn GĐT, TT
          </span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{DON_GDT_TT_ROWS.length} đơn</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Mã đơn", "Thông tin giải quyết đơn", "Người đứng đơn", "Phân loại", "KQGQ đơn", "Thao tác"].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DON_GDT_TT_ROWS.map((d, i) => (
              <tr key={d.maDon} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, fontWeight: 600, color: "#2563eb" }}>{d.maDon}</td>
                <td style={TD}>{d.thongTinGQ}</td>
                <td style={TD}>{d.nguoiDungDon}</td>
                <td style={TD}>
                  <div>{d.phanLoai}</div>
                  {d.ghiChuPhanLoai && (
                    <span style={{ display: "inline-block", marginTop: 3, padding: "1px 7px", background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                      {d.ghiChuPhanLoai}
                    </span>
                  )}
                </td>
                {/* SRS: KQGQ đơn chỉ hiển thị với đơn đã có QĐ kháng nghị */}
                <td style={TD}>{d.coQDKhangNghi ? (d.kqgq || "–") : <span style={{ color: MUTED }}>–</span>}</td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <button title="Xem đơn scan" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Thụ lý ───────────────────────────────────────────────────────────────

function TabThuLy({ row }: { row: VuXetXuRow }) {
  const [ketQuaOpen, setKetQuaOpen] = useState(true);
  // THIẾU [Cao]: luồng nhập & Lưu Số/Ngày thụ lý xét xử (SRS Thụ lý B.1, B.2, B.5)
  const [soThuLyXX, setSoThuLyXX] = useState(row.soThuLy || "");
  const [ngayThuLyXX, setNgayThuLyXX] = useState(row.ngayThuLy || "");
  const [quaHanLuatDinh, setQuaHanLuatDinh] = useState("Không"); // THIẾU [Cao] SRS Thụ lý B.3
  const [daLuuThuLy, setDaLuuThuLy] = useState(Boolean(row.soThuLy && row.ngayThuLy));
  const [loiThuLy, setLoiThuLy] = useState("");
  const SO_TRONG_GAN_NHAT = "54682699"; // SRS: gợi ý số trống gần nhất
  const handleLuuThuLy = () => {
    if (!soThuLyXX.trim() || !ngayThuLyXX.trim()) {
      setLoiThuLy("Số thụ lý và Ngày thụ lý xét xử là bắt buộc.");
      return;
    }
    setLoiThuLy("");
    setDaLuuThuLy(true);
  };
  const inpTL: React.CSSProperties = { padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none" };
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  return (
    <div>
      <ThongTinChungBlock row={row} />
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Thông tin thụ lý vụ án GĐT, TT</span>
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, fontSize: 12, fontFamily: F, alignItems: "flex-end" }}>
            <div>
              <div style={{ color: MUTED, fontWeight: 700, marginBottom: 4 }}><span style={{ color: RED }}>*</span> Số thụ lý GĐT, TT</div>
              <input value={soThuLyXX} onChange={e => { setSoThuLyXX(e.target.value); setLoiThuLy(""); }} placeholder="Nhập số thụ lý" style={{ ...inpTL, width: 150 }} />
              <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>
                Số trống gần nhất: <button onClick={() => setSoThuLyXX(SO_TRONG_GAN_NHAT)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0, fontSize: 10, fontFamily: F }}>{SO_TRONG_GAN_NHAT}</button>
              </div>
            </div>
            <div>
              <div style={{ color: MUTED, fontWeight: 700, marginBottom: 4 }}><span style={{ color: RED }}>*</span> Ngày thụ lý</div>
              <input value={ngayThuLyXX} onChange={e => { setNgayThuLyXX(e.target.value); setLoiThuLy(""); }} placeholder="dd/mm/yyyy" style={{ ...inpTL, width: 130 }} />
            </div>
            <div>
              <div style={{ color: MUTED, fontWeight: 700, marginBottom: 4 }}>Quá hạn luật định</div>
              <select value={quaHanLuatDinh} onChange={e => setQuaHanLuatDinh(e.target.value)} style={{ ...inpTL, width: 180, cursor: "pointer", background: "#fff" }}>
                <option>Không</option>
                <option>Quá hạn chủ quan</option>
                <option>Quá hạn khách quan</option>
              </select>
            </div>
            <div>
              <div style={{ color: MUTED, fontWeight: 700, marginBottom: 4 }}>Chuyển thẩm quyền xét xử</div>
              <span style={{ color: TEXT, display: "inline-block", padding: "5px 0" }}>Không</span>
            </div>
            <button onClick={handleLuuThuLy} style={{ padding: "6px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              Lưu
            </button>
          </div>
          {loiThuLy && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, fontSize: 12, color: "#991b1b", fontFamily: F }}>⚠ {loiThuLy}</div>
          )}
          {!daLuuThuLy && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 4, fontSize: 12, color: "#92400e", fontFamily: F }}>
              Chưa có số thụ lý xét xử – các tab sau (Phân công, Quyết định, Kết quả xét xử) sẽ bị ẩn cho đến khi lưu số thụ lý.
            </div>
          )}
        </div>
      </div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setKetQuaOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, color: TEXT }}>—</button>
          <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Kết quả theo giai đoạn</span>
        </div>
        {ketQuaOpen && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["STT", "Giai đoạn", "Thông tin thụ lý", "Bị cáo/Bị cáo & Tội danh", "Tòa án & Thẩm phán", "Kết quả"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              <tr style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>1</td>
                <td style={TD}><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, background: "#dbeafe", color: "#1e40af" }}>Giám đốc thẩm</span></td>
                <td style={TD}><div>Số thụ lý: <b>54682698</b></div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Ngày: 27/07/2026</div></td>
                <td style={{ ...TD, fontWeight: 600 }}>{row.biCao}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{row.toaAnGiaiQuyet}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{row.chuToa}</div></td>
                <td style={TD}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Tab: Phân công ────────────────────────────────────────────────────────────

function TabPhanCong({ row }: { row: VuXetXuRow }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  const [thuKyTen, setThuKyTen] = useState("Hoàng Văn Toàn");
  const [isEditingThuKy, setIsEditingThuKy] = useState(false);
  // THIẾU [Thấp]: biểu mẫu "Phiếu kết quả phân công" cho TTV — SRS Phân công B.7
  const [showPhieuKQPC, setShowPhieuKQPC] = useState(false);

  const DANH_SACH_THU_KY = [
    "Hoàng Văn Toàn",
    "Lý Văn An",
    "Nguyễn Thu Hằng",
    "Đỗ Thị Kim Oanh",
    "Phan Thanh Nhã",
  ];

  const PC_ROWS = [
    { vai: "Thẩm phán", ngay: "10/04/2026\n06/04/2026", ten: "Trịnh Đức Minh", phu: "Lê Đức Hòa", chuc: "Phó Chánh án", nguoi: "Nguyễn Xuân Thành\n10/04/2026 – 10:20:10", hasDoc: true, isThuKy: false, isTTV: false },
    { vai: "Lãnh đạo vụ", ngay: "14/04/2026", ten: "Hoàng Văn Hòa", phu: "", chuc: "Phó Vụ trưởng", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: false, isThuKy: false, isTTV: false },
    // THIẾU [Thấp]: hasDoc=true cho TTV để mở biểu mẫu "Phiếu kết quả phân công" — SRS Phân công B.7
    { vai: "Thẩm tra viên", ngay: "16/04/2026", ten: "Nguyễn Ngọc Ngan", phu: "", chuc: "Thẩm tra viên chính", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: true, isThuKy: false, isTTV: true },
    { vai: "Thư ký phiên tòa", ngay: "18/04/2026", ten: thuKyTen, phu: "", chuc: "Thư ký tòa án", nguoi: "Nguyễn Xuân Thành\n18/04/2026 – 08:30:00", hasDoc: true, isThuKy: true, isTTV: false },
  ];
  const HDXX_ROWS = [
    { vai: "Thẩm phán chủ tọa", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Phó Chánh án – Thẩm phán TAND tối cao", ngay: "12/02/2026" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Trần Hồng Hà – 10/05/1982", chuc: "Thẩm phán TAND tối cao", ngay: "12/02/2026" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Ngô Hồng Phúc – 18/08/1985", chuc: "Thẩm phán cao cấp", ngay: "12/02/2026" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Lê Thanh Phong – 22/11/1980", chuc: "Thẩm phán cao cấp", ngay: "12/02/2026" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Nguyễn Văn Cường – 05/03/1984", chuc: "Thẩm phán cao cấp", ngay: "12/02/2026" },
  ];
  const QD_ROWS = [
    { so: "12345681/2026/QĐ-TA", ngay: "31/03/2026", ten: "Quyết định thành lập hội đồng xét xử", nguoiKy: "Trần Văn Hành", chucVu: "Chánh tòa", tt: "Đã cấp số" },
    // THIẾU [Thấp]: trạng thái "Hủy Quyết Định" ở bảng QĐ phân công — SRS Phân công C.6
    { so: "12345650/2026/QĐ-TA", ngay: "15/02/2026", ten: "Quyết định thành lập hội đồng xét xử", nguoiKy: "Trần Văn Hành", chucVu: "Chánh tòa", tt: "Hủy Quyết Định" },
  ];

  const Sec = ({ title }: { title: string }) => (
    <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>{title}</span>
    </div>
  );

  return (
    <div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Số – Ngày thụ lý XX", row.soNgayThuLy || "–", "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày BAST (hoặc QĐST)", row.soNgayBAQD, "Người kháng nghị", row.nguoiKhangNghi || "Viện trưởng Viện kiểm sát nhân dân tối cao"],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Phân công giải quyết" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* LỆCH (SRS mục 8): gộp "Họ và tên – ngày phân công" thành 1 cột thay vì tách 2 cột */}
          <thead><tr>{["STT", "Vai trò", "Họ và tên – Ngày phân công", "Chức danh/Chức vụ", "Người phân công/sửa", "Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {PC_ROWS.map((r, i) => (
              <tr key={i} style={{ background: r.isThuKy ? "#f0f9ff" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={{ ...TD, fontWeight: r.isThuKy ? 700 : 400, color: r.isThuKy ? "#0369a1" : TEXT }}>{r.vai}</td>
                <td style={TD}>
                  {r.isThuKy && isEditingThuKy ? (
                    <select
                      value={thuKyTen}
                      onChange={e => setThuKyTen(e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff" }}
                    >
                      {DANH_SACH_THU_KY.map(tk => (
                        <option key={tk} value={tk}>{tk}</option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      {r.ten && <div style={{ fontWeight: 600, color: r.isThuKy ? "#0369a1" : TEXT }}>{r.ten}</div>}
                      {r.phu && <div style={{ fontSize: 11, color: MUTED }}>{r.phu}</div>}
                      {r.ngay && <div style={{ fontSize: 11, color: MUTED, whiteSpace: "pre-line" as const }}>{r.ngay}</div>}
                    </div>
                  )}
                </td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11 }}>{r.nguoi}</td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                    {r.hasDoc && (
                      <button
                        onClick={() => { if (r.isTTV) setShowPhieuKQPC(true); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}
                        title={r.isTTV ? "Xem Phiếu kết quả phân công" : "Xem tài liệu"}
                      >
                        <FileText size={14} />
                      </button>
                    )}
                    {r.isThuKy && (
                      isEditingThuKy ? (
                        <button
                          onClick={() => setIsEditingThuKy(false)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", background: "#0284c7", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: F }}
                        >
                          ✓ Lưu
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditingThuKy(true)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "#fff", color: "#0369a1", border: `1px solid #7dd3fc`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}
                        >
                          ✏ Đổi Thư ký
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Thành phần hội đồng xét xử" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "Vai trò", "Người được phân công", "Chức vụ – Chức danh tư pháp", "Ngày phân công"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {HDXX_ROWS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.vai}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{r.nguoi}</td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <Sec title="Quyết định phân công" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "Số quyết định", "Ngày quyết định", "Tên biểu mẫu", "Người ký", "Trạng thái cấp số", "Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {QD_ROWS.map((r, i) => (
              <tr key={i} style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.so}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
                <td style={TD}>{r.ten}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{r.nguoiKy}</div><div style={{ fontSize: 11, color: MUTED }}>{r.chucVu}</div></td>
                <td style={TD}>
                  {r.tt === "Hủy Quyết Định"
                    ? <Badge color="#991b1b" bg="#fee2e2">{r.tt}</Badge>
                    : <Badge color="#15803d" bg="#dcfce7">{r.tt}</Badge>}
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* THIẾU [Thấp]: biểu mẫu "Phiếu kết quả phân công" cho TTV — SRS Phân công B.7 */}
      {showPhieuKQPC && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}
          onClick={() => setShowPhieuKQPC(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 8, width: 460, boxShadow: "0 8px 48px rgba(0,0,0,0.22)", fontFamily: F, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Phiếu kết quả phân công</span>
              <button onClick={() => setShowPhieuKQPC(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <InfoGrid rows={[
                ["Vụ án", row.tenVuAn || row.maVuAn, "Số – Ngày thụ lý XX", row.soNgayThuLy || "–"],
                ["Thẩm tra viên", "Nguyễn Ngọc Ngan", "Chức danh", "Thẩm tra viên chính"],
                ["Ngày phân công", "16/04/2026", "Người phân công", "Nguyễn Xuân Thành"],
              ]} />
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowPhieuKQPC(false)} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>Đóng</button>
              <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>In phiếu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Tờ trình (copy vụ án, bỏ thông tin đơn) ────────────────────────────

function TabToTrinhXX({ row: _row }: { row: VuXetXuRow }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình xét xử vụ án số 2", yKien: "–", ngayDuyet: "–", trangThai: "cho-duyet", subRows: [] as { label: string; ngayDuyet: string }[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–", ngayDuyet: "07/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–", ngayDuyet: "08/07/2026", trangThai: "da-duyet", subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "Hồ sơ chưa đầy đủ, đề nghị bổ sung tài liệu", ngayDuyet: "06/07/2026", trangThai: "tu-choi", subRows: [] },
  ]);
  const [filterVanBan, setFilterVanBan] = useState("");

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình xét xử vụ án số 1", loai: "Tờ trình", ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo xét xử số 1", loai: "Thông báo", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành" },
    { stt: 3, vanBan: "Thông báo xét xử số 2", loai: "Thông báo", ngayTao: "09/07/2026", nguoiKy: "–", trangThai: "Chờ ký số" },
  ];

  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => !filterVanBan || r.vanBan === filterVanBan);

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" as const };

  /* ── Hồ sơ tờ trình modal ── */
  function HoSoToTrinhFileModal({ onClose }: { onClose: () => void }) {
    return <HoSoToTrinhModal onClose={onClose} />;
  }

  /* ── Modal Thêm mới tờ trình vụ xét xử chuẩn theo mẫu ảnh ── */
  function ThemMoiToTrinhVuXetXuModal({
    onClose,
    onSave,
  }: {
    onClose: () => void;
    onSave?: (data: any) => void;
  }) {
    const [ngayLap, setNgayLap] = useState("08/04/2026");
    const [noiDungVuAn, setNoiDungVuAn] = useState("");
    const [quaTrinhGQ, setQuaTrinhGQ] = useState("");
    const [giaiQuyetRutGon, setGiaiQuyetRutGon] = useState(false);
    const [noiDungDeXuat, setNoiDungDeXuat] = useState("");

    const handleSave = () => {
      if (!noiDungDeXuat.trim()) {
        alert("Vui lòng nhập nội dung đề xuất!");
        return;
      }
      if (onSave) {
        onSave({
          ngayLap,
          noiDungVuAn,
          quaTrinhGQ,
          giaiQuyetRutGon,
          noiDungDeXuat,
        });
      }
      alert("Đã tạo tờ trình mới thành công!");
      onClose();
    };

    const textareaSt: React.CSSProperties = {
      width: "100%",
      minHeight: 100,
      padding: "10px 12px",
      fontSize: 13,
      fontFamily: F,
      border: "1px solid #d1d5db",
      borderRadius: 4,
      outline: "none",
      boxSizing: "border-box",
      resize: "vertical",
      color: "#111827",
      background: "#fff",
    };

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            width: "min(840px, 95vw)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            fontFamily: F,
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Thêm mới tờ trình
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Ngày lập tờ trình */}
            <div style={{ maxWidth: 220 }}>
              <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: F }}>
                <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Ngày lập tờ trình
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={ngayLap}
                  onChange={e => setNgayLap(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 36px 8px 12px",
                    fontSize: 13,
                    fontFamily: F,
                    border: "1px solid #d1d5db",
                    borderRadius: 4,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#111827",
                    background: "#fff",
                  }}
                />
                <Calendar size={16} color="#6b7280" style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
              </div>
            </div>

            {/* Section I */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>
                I. NỘI DUNG VỤ ÁN
              </div>
              <textarea
                value={noiDungVuAn}
                onChange={e => setNoiDungVuAn(e.target.value)}
                placeholder="Nhập tóm tắt nội dung vụ án..."
                style={textareaSt}
              />
            </div>

            {/* Section II */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>
                II. QUÁ TRÌNH GIẢI QUYẾT
              </div>
              <textarea
                value={quaTrinhGQ}
                onChange={e => setQuaTrinhGQ(e.target.value)}
                placeholder="Nhập quá trình giải quyết vụ án..."
                style={textareaSt}
              />
            </div>

            {/* Section III */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>
                  III. NHẬN ĐỊNH VÀ ĐỀ XUẤT GIẢI QUYẾT
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#800000", fontWeight: 500, fontFamily: F }}>
                  <input
                    type="checkbox"
                    checked={giaiQuyetRutGon}
                    onChange={e => setGiaiQuyetRutGon(e.target.checked)}
                    style={{ accentColor: "#800000", cursor: "pointer", width: 16, height: 16 }}
                  />
                  <span>Giải quyết theo thủ tục rút gọn</span>
                </label>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, color: "#800000", fontWeight: 700, marginBottom: 6, fontFamily: F }}>
                  <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Nội dung đề xuất
                </label>
                <textarea
                  value={noiDungDeXuat}
                  onChange={e => setNoiDungDeXuat(e.target.value)}
                  placeholder="Nhập nội dung đề xuất..."
                  style={textareaSt}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              padding: "14px 24px",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "7px 20px",
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: F,
                color: "#374151",
                fontWeight: 500,
              }}
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: "7px 20px",
                background: "#800000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Lưu tờ trình
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── mini modal stubs ── */
  const Modal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12, color: MUTED, fontFamily: F, marginBottom: 16 }}>Chức năng đang phát triển...</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {showTaoTT && (
        <ThemMoiToTrinhVuXetXuModal
          onClose={() => setShowTaoTT(false)}
          onSave={data => {
            const nextNum = lichSuData.length + 1;
            setLichSuData(prev => [
              {
                ngayTrinh: data.ngayLap || "08/04/2026",
                lanh: "Nguyễn Văn A",
                capTrinh: "Thẩm phán",
                vanBan: `Tờ trình xét xử vụ án số ${nextNum}`,
                yKien: data.noiDungDeXuat || "–",
                ngayDuyet: "–",
                trangThai: "cho-duyet",
                subRows: [],
              },
              ...prev,
            ]);
          }}
        />
      )}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhFileModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 380, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: 14, fontFamily: F, marginBottom: 20 }}>Bạn có chắc muốn thu hồi tờ trình này?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setThuHoiIdx(null)} style={{ padding: "6px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
              <button onClick={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }} style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "TÊN VĂN BẢN", "LOẠI", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {vanBanRows.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                <td style={TD}>{r.loai}</td>
                <td style={TD}>{r.ngayTao}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                    bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}>
                    {r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={14} color="#0e7490" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff" }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filteredLichSu.map((r, realIdx) => (
                <React.Fragment key={realIdx}>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{realIdx + 1}</td>
                    <td style={TD}>{r.ngayTrinh}</td>
                    <td style={TD}>{r.lanh}</td>
                    <td style={TD}>{r.capTrinh}</td>
                    <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                    <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" as const }}>{r.yKien}</td>
                    <td style={TD}>{r.ngayDuyet}</td>
                    <td style={TD}>
                      {r.trangThai === "cho-duyet"
                        ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                        : r.trangThai === "tu-choi"
                          ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                          : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                    </td>
                    <td style={{ ...TD, textAlign: "center" as const }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }} title="Xem"><Eye size={13} color="#0e7490" /></button>
                        {r.trangThai === "cho-duyet" && (
                          <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <RotateCcw size={13} color="#dc2626" />
                          </button>
                        )}
                        <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Send size={13} color={RED} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {r.subRows.map((sub, si) => (
                    <tr key={si} style={{ background: "#fafafa" }}>
                      <td style={{ ...TD, textAlign: "center" as const, color: MUTED }} />
                      <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td>
                      <td colSpan={3} style={{ ...TD, fontSize: 11, color: MUTED }}>Ngày: {sub.ngayDuyet}</td>
                      <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                      <td style={{ ...TD, textAlign: "center" as const }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={13} color="#0e7490" /></button>
                          <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <Send size={13} color={RED} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Shared: NoiNhanTable ─────────────────────────────────────────────────────

type NoiNhanRow = { id: number; noi: string; noiCT: string; ghiChu: string; editing: boolean };

const NOI_NHAN_OPTS = ["Viện kiểm sát", "Tòa án", "Cơ quan thi hành án", "Lưu hồ sơ", "Đương sự", "Luật sư"];
const NOI_CT_OPTS: Record<string, string[]> = {
  "Viện kiểm sát": ["VKSNDTC", "VKS cấp tỉnh", "VKS cấp huyện"],
  "Tòa án": ["TAND Tối cao", "TAND cấp tỉnh", "TAND cấp huyện"],
};

const nnSelSt: React.CSSProperties = { padding: "5px 28px 5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff", appearance: "none" as const, cursor: "pointer" };
const nnInpSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
const nnTH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 12px", textAlign: "left" as const };
const nnTD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "8px 10px", verticalAlign: "middle" as const };

function NoiNhanTable({ rows, setRows }: { rows: NoiNhanRow[]; setRows: React.Dispatch<React.SetStateAction<NoiNhanRow[]>> }) {
  const add = () => setRows(p => [...p, { id: Date.now(), noi: "", noiCT: "", ghiChu: "", editing: true }]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <span style={{ color: RED }}>*</span> Nơi nhận
        </label>
        <button onClick={add} style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
          Thêm nơi nhận
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
        <thead>
          <tr style={{ background: BG }}>
            {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
              <th key={h} style={{ ...nnTH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: "#fff" }}>
              <td style={{ ...nnTD, width: 40, textAlign: "center" as const, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{i + 1}</td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noi}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noi: e.target.value, noiCT: "" } : x))}>
                      <option value="">Chọn nơi nhận</option>
                      {NOI_NHAN_OPTS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noi}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noiCT}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noiCT: e.target.value } : x))}>
                      <option value="">Chọn</option>
                      {(NOI_CT_OPTS[r.noi] ?? []).map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noiCT}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing
                  ? <input placeholder="Nhập ghi chú" style={nnInpSt} value={r.ghiChu}
                    onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, ghiChu: e.target.value } : x))} />
                  : r.ghiChu}
              </td>
              <td style={{ ...nnTD, textAlign: "center" as const, whiteSpace: "nowrap" as const, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: false } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F }}>Lưu</button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontFamily: F }}>Hủy</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: true } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Pencil size={12} /> Sửa
                    </button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal: Xem biểu mẫu Quyết định / Biên bản (Word format) ───────────────────

function XemBieuMauQuyetDinhWordModal({
  tenQD,
  row,
  data,
  onClose,
}: {
  tenQD: string;
  row: VuXetXuRow;
  data: any;
  onClose: () => void;
}) {
  const exportToWord = () => {
    const content = document.getElementById("qd-word-doc-preview")?.innerHTML;
    if (!content) return;

    const htmlDoc = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${tenQD}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; text-align: left; vertical-align: top; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tenQD.replace(/[/\\?%*:|"<>]/g, '_')}_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isBienBan = tenQD.toLowerCase().includes("biên bản");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1400, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 44, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={18} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>
            📄 Biểu mẫu: {tenQD}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={exportToWord}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            <Printer size={14} /> Tải file Word (.docx)
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            🖨️ In văn bản
          </button>
          <button
            onClick={onClose}
            style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Ribbon */}
      <div style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, padding: "6px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 12, fontFamily: F, flexShrink: 0 }}>
        <span style={{ fontWeight: 700, color: "#1e40af" }}>Times New Roman</span>
        <span style={{ color: MUTED }}>|</span>
        <span>Cỡ chữ: <b>13pt</b></span>
        <span style={{ color: MUTED }}>|</span>
        <span style={{ color: "#166534", fontWeight: 600 }}>✓ Định dạng chuẩn văn bản tố tụng TANDTC</span>
      </div>

      {/* A4 Page */}
      <div style={{ flex: 1, overflowY: "auto", background: "#e2e8f0", padding: "30px 20px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            padding: "25mm 20mm",
            boxSizing: "border-box",
            fontFamily: "'Times New Roman', Times, serif",
            color: "#000",
            lineHeight: 1.5,
          }}
        >
          <div id="qd-word-doc-preview">
            {/* Header 2 columns */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ width: "45%", textAlign: "center", verticalAlign: "top", border: "none", padding: 0 }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: "bold" }}>HỘI ĐỒNG THẨM PHÁN</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Số: <b>{data.soQD || "....."}/{data.hauTo || "2026/QĐ-CA"}</b></div>
                    <div style={{ borderBottom: "1px solid #000", width: 120, margin: "6px auto 0" }} />
                  </td>
                  <td style={{ width: "55%", textAlign: "center", verticalAlign: "top", border: "none", padding: 0 }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: "bold", fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ borderBottom: "1px solid #000", width: 160, margin: "6px auto 0" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 8 }}>Hà Nội, ngày {data.ngayQD || "27 tháng 07 năm 2026"}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Document Title */}
            <div style={{ textAlign: "center", marginBottom: 22, marginTop: 10 }}>
              <div style={{ fontWeight: "bold", fontSize: 15, textTransform: "uppercase", marginBottom: 6 }}>
                {isBienBan ? "BIÊN BẢN" : "QUYẾT ĐỊNH"}
              </div>
              <div style={{ fontWeight: "bold", fontSize: 14, textTransform: "uppercase" }}>
                {tenQD}
              </div>
              <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                (Về việc giải quyết vụ án: <b>{row.tenVuAn || row.maVuAn}</b>)
              </div>
            </div>

            {/* Document Body */}
            <div style={{ fontSize: 13, textAlign: "justify", display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <b>TÒA ÁN NHÂN DÂN TỐI CAO</b>
              </div>
              <div>
                Căn cứ vào các quy định của pháp luật tố tụng về thẩm quyền giám đốc thẩm, tái thẩm;
              </div>
              <div>
                Xét Bản án/Quyết định số: <b>{formatSoBA(row.soBA)}</b> ngày {row.ngayBA} của {row.toa};
              </div>
              <div>
                Xét Quyết định kháng nghị số: <b>{row.soNgayKhangNghi || "QDKN-2026"}</b> của {row.nguoiKhangNghi || "Viện trưởng Viện kiểm sát nhân dân tối cao"};
              </div>

              {/* Dynamic content */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: "bold", textTransform: "uppercase", marginBottom: 4 }}>
                  {isBienBan ? "I. THÀNH PHẦN THAM GIA VÀ NỘI DUNG:" : "NHẬN THẤY:"}
                </div>
                <p style={{ textIndent: 28, margin: "4px 0" }}>
                  {data.nhanThay || data.lyDo || "Sau khi nghiên cứu hồ sơ vụ án và các văn bản tố tụng liên quan, Hội đồng nhận thấy việc đề nghị và các căn cứ pháp luật phù hợp với quy định của pháp luật hiện hành."}
                </p>
              </div>

              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: "bold", textTransform: "uppercase", marginBottom: 4 }}>
                  {isBienBan ? "II. KẾT LUẬN / BIỂU QUYẾT:" : "QUYẾT ĐỊNH:"}
                </div>
                <p style={{ textIndent: 28, margin: "4px 0" }}>
                  {data.noiDungQD || data.ketLuan || `1. Chấp nhận các nội dung theo ${tenQD} đối với vụ án ${row.tenVuAn || row.maVuAn}.`}
                </p>
                <p style={{ textIndent: 28, margin: "4px 0" }}>
                  2. Quyết định có hiệu lực thi hành kể từ ngày ký ban hành.
                </p>
              </div>

              {/* Footer signatures */}
              <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "45%" }}>
                  {!isBienBan && (
                    <>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>Nơi nhận:</div>
                      <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                        - Các đương sự;<br />
                        - Viện kiểm sát nhân dân tối cao;<br />
                        - Tòa án nhân dân xét xử sơ thẩm/phúc thẩm;<br />
                        - Lưu: Hồ sơ vụ án, Vụ GĐKT.
                      </div>
                    </>
                  )}
                </div>
                <div style={{ width: "50%", textAlign: "center" }}>
                  <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                    {isBienBan ? "THƯ KÝ / CHỦ TỌA PHIÊN TÒA" : "CHÁNH ÁN / CHỦ TỌA PHIÊN TÒA"}
                  </div>
                  <div style={{ fontStyle: "italic", fontSize: 12 }}>(Ký, ghi rõ họ tên và đóng dấu)</div>
                  <div style={{ height: 70 }} />
                  <div style={{ fontWeight: "bold" }}>{data.nguoiKy || "Lê Thị Thu Hiển"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component Modal Tạo biên bản nghị án (Chính xác theo mockup) ────────────

export function TaoBienBanNghiAnModal({
  row,
  initialData,
  onClose,
  onSave,
}: {
  row: any;
  initialData?: any;
  onClose: () => void;
  onSave: (record: any) => void;
}) {
  const [ngayQD, setNgayQD] = useState(initialData?.ngayQD || "2023-10-15");
  const [soQD, setSoQD] = useState(initialData?.soQD || "");
  const [daLaySo, setDaLaySo] = useState(Boolean(initialData?.soQD));
  const [nguoiKy, setNguoiKy] = useState(initialData?.nguoiKy || "");
  const [noiDungThongNhat, setNoiDungThongNhat] = useState(initialData?.noiDungQD || initialData?.noiDungThongNhat || "");

  const [hdxxList, setHdxxList] = useState<Array<{ id: number; hoTen: string; chucVu: string; bieuQuyet: string }>>([
    { id: 1, hoTen: "Nguyễn Văn A", chucVu: "Thẩm phán chủ tọa", bieuQuyet: "Đồng ý" },
    { id: 2, hoTen: "Trần Thị B", chucVu: "Hội thẩm nhân dân", bieuQuyet: "" },
  ]);

  const [noiNhanList, setNoiNhanList] = useState<Array<{ id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }>>([
    { id: 1, noiNhan: "Tòa án", noiNhanChiTiet: "TAND Tối cao", ghiChu: "Lưu hồ sơ" },
  ]);

  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleLaySoToggle = () => {
    if (daLaySo) {
      setSoQD("");
      setDaLaySo(false);
    } else {
      const generated = `${125 + Math.floor(Math.random() * 500)}/2026/BB-NA`;
      setSoQD(generated);
      setDaLaySo(true);
    }
  };

  const handleSave = () => {
    const finalSo = soQD || `${125 + Math.floor(Math.random() * 500)}/2026/BB-NA`;
    onSave({
      id: initialData?.id || Date.now(),
      tenQD: "Biên bản nghị án",
      soQD: finalSo,
      ngayQD: ngayQD || "15/10/2023",
      nguoiKy: nguoiKy || "Nguyễn Văn A",
      nguoiTao: "Nguyễn Văn Tiến",
      ngayTao: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN"),
      noiDungQD: noiDungThongNhat || "Hội đồng xét xử thống nhất biểu quyết chấp nhận kháng nghị.",
      hdxxList,
      noiNhanList,
    });
    onClose();
  };

  return (
    <>
      {showTrinhKy && (
        <TrinhKyModal
          title="Trình ký Biên bản nghị án"
          onClose={() => setShowTrinhKy(false)}
          onSuccess={() => {
            setShowTrinhKy(false);
            handleSave();
          }}
        />
      )}
      {showBieuMau && (
        <XemBieuMauQuyetDinhWordModal
          tenQD="Biên bản nghị án"
          row={row}
          data={{ soQD: soQD || "125/2026/BB-NA", ngayQD, nguoiKy, noiDungQD: noiDungThongNhat }}
          onClose={() => setShowBieuMau(false)}
        />
      )}

      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, width: 880, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const, fontFamily: F }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#800000" }}>Tạo biên bản nghị án</span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>

          {/* Info Card */}
          <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.1fr 1fr", gap: "6px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Tên vụ án: </span><b>{row?.tenVuAn || "Chu Văn An - Nguyễn Anh Minh tranh chấp đất đai"}</b></div>
                <div><span style={{ color: MUTED }}>Nguyên đơn </span><b>{row?.nguyenDon || row?.ndkn || row?.ndd || "Chu Văn An"}</b></div>
                <div><span style={{ color: MUTED }}>Bị đơn </span><b>{row?.biDon || row?.biCao || "Nguyễn Anh Minh"}</b></div>
                <div><span style={{ color: MUTED }}>Quan hệ pháp luật: </span><span>{row?.qhpl || "Tranh chấp đất đai"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>{row?.soBA ? formatSoBA(row.soBA) : "125/2023/HS-ST"}</b></div>
                <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span><span>{row?.ngayBA || "15/10/2023"}</span></div>
                <div><span style={{ color: MUTED }}>Tòa xét xử: </span><span>{row?.toa || "Tòa án nhân dân tỉnh Long An"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#059669", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
                <div><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#059669", fontWeight: 600 }}>Tòa án nhân dân tối cao</span></div>
                <div><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#ea580c", fontWeight: 600 }}>Chưa có kết quả xét xử</span></div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {/* 1. Thông tin quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Thông tin quyết định
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Ngày quyết định
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Số quyết định</label>
                  <input placeholder="Nhập số quyết định" value={soQD} onChange={e => setSoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box", background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Người ký ban hành
                  </label>
                  <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", boxSizing: "border-box", background: "#fff" }}>
                    <option value="">Chọn người ký</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                    <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy</option>
                    <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Hội đồng xét xử */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Hội đồng xét xử
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 50 }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "40%" }} />
                    <col style={{ width: "25%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>HỌ VÀ TÊN</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>CHỨC VỤ</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>BIỂU QUYẾT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hdxxList.map((rowItem, idx) => (
                      <tr key={rowItem.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, fontWeight: 500 }}>{rowItem.hoTen}</td>
                        <td style={{ ...TD_STYLE, color: MUTED }}>{rowItem.chucVu}</td>
                        <td style={{ ...TD_STYLE, padding: "6px 10px" }}>
                          <select
                            value={rowItem.bieuQuyet}
                            onChange={e => setHdxxList(prev => prev.map(x => x.id === rowItem.id ? { ...x, bieuQuyet: e.target.value } : x))}
                            style={{ width: "100%", padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff" }}
                          >
                            <option value="">Chọn biểu quyết</option>
                            <option value="Đồng ý">Đồng ý</option>
                            <option value="Không đồng ý">Không đồng ý</option>
                            <option value="Ý kiến khác">Ý kiến khác</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Nội dung thống nhất */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Nội dung thống nhất
              </div>
              <textarea
                placeholder="Nhập nội dung thống nhất của hội đồng xét xử..."
                value={noiDungThongNhat}
                onChange={e => setNoiDungThongNhat(e.target.value)}
                style={{ width: "100%", minHeight: 90, padding: "8px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* 4. Nơi nhận */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Nơi nhận</div>
                <button
                  type="button"
                  onClick={() => setNoiNhanList(prev => [...prev, { id: Date.now(), noiNhan: "Tòa án", noiNhanChiTiet: "", ghiChu: "" }])}
                  style={{ padding: "5px 14px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
                >
                  Thêm nơi nhận
                </button>
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: 50 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN CHI TIẾT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>GHI CHÚ</th>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((rowItem, idx) => (
                      <tr key={rowItem.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <select
                            value={rowItem.noiNhan}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhan: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          >
                            <option value="Tòa án">Tòa án</option>
                            <option value="Viện kiểm sát">Viện kiểm sát</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Tên đơn vị nhận"
                            value={rowItem.noiNhanChiTiet}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhanChiTiet: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Nhập ghi chú"
                            value={rowItem.ghiChu}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, ghiChu: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== rowItem.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 2 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, background: "#fff" }}>
            <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
              Đóng
            </button>
            <button onClick={handleSave} style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              Lưu
            </button>
            <button
              onClick={handleLaySoToggle}
              style={{
                padding: "7px 22px",
                background: "#fff",
                color: daLaySo ? "#dc2626" : TEXT,
                border: `1px dashed ${daLaySo ? "#dc2626" : BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              {daLaySo ? "Hủy lấy số" : "Lấy số"}
            </button>
            <button
              onClick={() => setShowTrinhKy(true)}
              style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
            >
              Trình ký
            </button>
            <button
              onClick={() => setShowBieuMau(true)}
              style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}
            >
              Xem biểu mẫu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Modal: Thêm / Sửa Quyết định vụ án & Biên bản ─────────────────────────────

// ── Component Modal Quyết định hoãn phiên tòa dùng cho HĐXX (Chính xác theo mockup) ─

export function TaoQuyetDinhHoanHDXXModal({
  row,
  initialData,
  onClose,
  onSave,
}: {
  row: any;
  initialData?: any;
  onClose: () => void;
  onSave: (record: any) => void;
}) {
  const [ngayQD, setNgayQD] = useState(initialData?.ngayQD || "2023-10-15");
  const [soQD, setSoQD] = useState(initialData?.soQD || "");
  const [daLaySo, setDaLaySo] = useState(Boolean(initialData?.soQD));
  const [nguoiKy, setNguoiKy] = useState(initialData?.nguoiKy || "");

  // Căn cứ & Xét thấy
  const [canCuNgayPhanCong, setCanCuNgayPhanCong] = useState(initialData?.canCuNgayPhanCong || "");
  const [canCuDieu, setCanCuDieu] = useState(initialData?.canCuDieu || "");
  const [noiDungXetThay, setNoiDungXetThay] = useState(initialData?.nhanThay || initialData?.noiDungXetThay || "");

  // Phiên tòa mở lại
  const [ngayMoPhienToa, setNgayMoPhienToa] = useState(initialData?.ngayMoPhienToa || "");
  const [gioMoPhienToa, setGioMoPhienToa] = useState(initialData?.gioMoPhienToa || "");
  const [diaDiemToChuc, setDiaDiemToChuc] = useState(initialData?.diaDiemToChuc || "");

  // HĐXX List
  const [hdxxList] = useState<Array<{ id: number; chucDanh: string; ten: string }>>([
    { id: 1, chucDanh: "Thẩm phán - Chủ tọa phiên tòa", ten: "Nguyễn Văn A" },
    { id: 2, chucDanh: "Thẩm phán", ten: "Trần Thị B" },
    { id: 3, chucDanh: "Hội thẩm nhân dân", ten: "Lê Văn C" },
  ]);

  // Bị cáo List
  const [biCaoList, setBiCaoList] = useState<Array<{ id: number; tenBiCao: string; toaSoTham: string; toiDanhTruyTo: string; toiDanhXetXu: string; diem: string; khoan: string; dieu: string; blhs: string; hinhPhat: string }>>([]);

  // Nơi nhận List
  const [noiNhanList, setNoiNhanList] = useState<Array<{ id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }>>([
    { id: 1, noiNhan: "Viện kiểm sát", noiNhanChiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án" },
  ]);

  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleLaySoToggle = () => {
    if (daLaySo) {
      setSoQD("");
      setDaLaySo(false);
    } else {
      const generated = `${12 + Math.floor(Math.random() * 80)}/2026/QĐ-HĐXX`;
      setSoQD(generated);
      setDaLaySo(true);
    }
  };

  const handleSave = () => {
    const finalSo = soQD || `${12 + Math.floor(Math.random() * 80)}/2026/QĐ-HĐXX`;
    onSave({
      id: initialData?.id || Date.now(),
      tenQD: "Quyết định hoãn phiên tòa của HĐXX",
      soQD: finalSo,
      ngayQD: ngayQD || "15/10/2023",
      nguoiKy: nguoiKy || "Nguyễn Văn A",
      nguoiTao: "Trịnh Thị Minh Trang",
      ngayTao: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN"),
      nhanThay: noiDungXetThay || "Vắng mặt người tham gia tố tụng cần thiết.",
      noiDungQD: `Hoãn phiên tòa xét xử giám đốc thẩm. Mở lại vào ${gioMoPhienToa || "08:30"} ngày ${ngayMoPhienToa || "15/08/2026"} tại ${diaDiemToChuc || "Phòng xử án TANDTC"}.`,
      canCuNgayPhanCong,
      canCuDieu,
      ngayMoPhienToa,
      gioMoPhienToa,
      diaDiemToChuc,
      hdxxList,
      biCaoList,
      noiNhanList,
    });
    onClose();
  };

  return (
    <>
      {showTrinhKy && (
        <TrinhKyModal
          title="Trình ký Quyết định hoãn phiên tòa dùng cho HĐXX"
          onClose={() => setShowTrinhKy(false)}
          onSuccess={() => {
            setShowTrinhKy(false);
            handleSave();
          }}
        />
      )}
      {showBieuMau && (
        <XemBieuMauQuyetDinhWordModal
          tenQD="Quyết định hoãn phiên tòa của HĐXX"
          row={row}
          data={{ soQD: soQD || "12/2026/QĐ-HĐXX", ngayQD, nguoiKy, nhanThay: noiDungXetThay, noiDungQD: `Hoãn phiên tòa. Mở lại: ${ngayMoPhienToa}` }}
          onClose={() => setShowBieuMau(false)}
        />
      )}

      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, width: 880, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const, fontFamily: F }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#800000" }}>Quyết định hoãn phiên tòa dùng cho HĐXX</span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>

          {/* Info Card */}
          <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.1fr 1fr", gap: "6px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Tên vụ án: </span><b>{row?.tenVuAn || "Chu Văn An - Nguyễn Anh Minh tranh chấp đất đai"}</b></div>
                <div><span style={{ color: MUTED }}>Nguyên đơn </span><b>{row?.nguyenDon || row?.ndkn || row?.ndd || "Chu Văn An"}</b></div>
                <div><span style={{ color: MUTED }}>Bị đơn </span><b>{row?.biDon || row?.biCao || "Nguyễn Anh Minh"}</b></div>
                <div><span style={{ color: MUTED }}>Quan hệ pháp luật: </span><span>{row?.qhpl || "Tranh chấp đất đai"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>{row?.soBA ? formatSoBA(row.soBA) : "125/2023/HS-ST"}</b></div>
                <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span><span>{row?.ngayBA || "15/10/2023"}</span></div>
                <div><span style={{ color: MUTED }}>Tòa xét xử: </span><span>{row?.toa || "Tòa án nhân dân tỉnh Long An"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#059669", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
                <div><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#059669", fontWeight: 600 }}>Tòa án nhân dân tối cao</span></div>
                <div><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#ea580c", fontWeight: 600 }}>Chưa có kết quả xét xử</span></div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {/* 1. Thông tin quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Thông tin quyết định
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Ngày quyết định
                  </label>
                  <input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Số quyết định</label>
                  <input placeholder="Nhập số quyết định" value={soQD} onChange={e => setSoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box", background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Người ký ban hành
                  </label>
                  <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", boxSizing: "border-box", background: "#fff" }}>
                    <option value="">Chọn người ký</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                    <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy</option>
                    <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Danh sách Hội đồng xét xử */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Danh sách Hội đồng xét xử
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 50 }} />
                    <col style={{ width: "50%" }} />
                    <col style={{ width: "45%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>CHỨC DANH</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>TÊN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hdxxList.map((item, idx) => (
                      <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, fontWeight: 500 }}>{item.chucDanh}</td>
                        <td style={{ ...TD_STYLE, color: TEXT }}>{item.ten}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Căn cứ */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Căn cứ
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>Căn cứ Quyết định phân công Hội đồng xét xử ngày</label>
                  <input type="date" value={canCuNgayPhanCong} onChange={e => setCanCuNgayPhanCong(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>Căn cứ điều</label>
                  <input placeholder="Nhập căn cứ điều" value={canCuDieu} onChange={e => setCanCuDieu(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>

            {/* 4. Xét thấy */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Xét thấy
              </div>
              <textarea
                placeholder="Nhập nội dung xét thấy..."
                value={noiDungXetThay}
                onChange={e => setNoiDungXetThay(e.target.value)}
                style={{ width: "100%", minHeight: 80, padding: "8px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* 5. Danh sách bị cáo */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                  Danh sách bị cáo
                </div>
                <button
                  type="button"
                  onClick={() => setBiCaoList(prev => [...prev, { id: Date.now(), tenBiCao: "Hoàng Minh Đức", toaSoTham: "TAND tỉnh Long An", toiDanhTruyTo: "Buôn lậu", toiDanhXetXu: "Buôn lậu", diem: "a", khoan: "2", dieu: "188", blhs: "2015", hinhPhat: "12 năm tù" }])}
                  style={{ padding: "4px 12px", background: "none", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}
                >
                  + Thêm bị cáo
                </button>
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      {["STT", "TÊN BỊ CÁO", "TÒA ÁN SƠ THẨM", "TỘI DANH TRUY TỐ", "TỘI DANH ĐƯA RA XÉT XỬ", "ĐIỂM", "KHOẢN", "ĐIỀU", "BLHS", "HÌNH PHẠT"].map(h => (
                        <th key={h} style={{ ...TH_STYLE, fontSize: 10, padding: "8px 6px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {biCaoList.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: "24px 0", textAlign: "center", color: MUTED, fontSize: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 24, color: "#d1d5db" }}>📦</span>
                            <span>Trống</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      biCaoList.map((item, idx) => (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 11 }}>{idx + 1}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600 }}>{item.tenBiCao}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11 }}>{item.toaSoTham}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11 }}>{item.toiDanhTruyTo}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11 }}>{item.toiDanhXetXu}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{item.diem}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{item.khoan}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{item.dieu}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>{item.blhs}</td>
                          <td style={{ ...TD_STYLE, fontSize: 11 }}>{item.hinhPhat}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Lịch phiên tòa mở lại */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>Ngày mở phiên tòa</label>
                <input type="date" value={ngayMoPhienToa} onChange={e => setNgayMoPhienToa(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>Giờ mở phiên tòa</label>
                <input type="time" value={gioMoPhienToa} onChange={e => setGioMoPhienToa(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>Địa điểm tổ chức</label>
                <select value={diaDiemToChuc} onChange={e => setDiaDiemToChuc(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", background: "#fff", boxSizing: "border-box" }}>
                  <option value="">Vui lòng chọn</option>
                  <option value="Phòng xử án số 1 TANDTC">Phòng xử án số 1 TANDTC</option>
                  <option value="Phòng xử án số 2 TANDTC">Phòng xử án số 2 TANDTC</option>
                  <option value="Trụ sở TANDTC">Trụ sở TANDTC</option>
                </select>
              </div>
            </div>

            {/* 7. Nơi nhận */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Nơi nhận</div>
                <button
                  type="button"
                  onClick={() => setNoiNhanList(prev => [...prev, { id: Date.now(), noiNhan: "Tòa án", noiNhanChiTiet: "", ghiChu: "" }])}
                  style={{ padding: "5px 14px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
                >
                  Thêm nơi nhận
                </button>
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: 70 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN CHI TIẾT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>GHI CHÚ</th>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((rowItem, idx) => (
                      <tr key={rowItem.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <select
                            value={rowItem.noiNhan}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhan: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          >
                            <option value="Viện kiểm sát">Viện kiểm sát</option>
                            <option value="Tòa án">Tòa án</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Tên đơn vị nhận"
                            value={rowItem.noiNhanChiTiet}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhanChiTiet: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Nhập ghi chú"
                            value={rowItem.ghiChu}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, ghiChu: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            <button
                              type="button"
                              onClick={() => { }}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 11, fontFamily: F }}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== rowItem.id))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, fontFamily: F }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, background: "#fff" }}>
            <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
              Đóng
            </button>
            <button onClick={handleSave} style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              Lưu
            </button>
            <button
              onClick={handleLaySoToggle}
              style={{
                padding: "7px 22px",
                background: "#fff",
                color: daLaySo ? "#dc2626" : TEXT,
                border: `1px dashed ${daLaySo ? "#dc2626" : BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              {daLaySo ? "Hủy lấy số" : "Lấy số"}
            </button>
            <button
              onClick={() => setShowTrinhKy(true)}
              style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
            >
              Trình ký
            </button>
            <button
              onClick={() => setShowBieuMau(true)}
              style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}
            >
              Xem biểu mẫu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Component Modal Quyết định đình chỉ xét xử do rút kháng nghị (Chính xác theo mockup) ──

export function TaoQuyetDinhDinhChiDoRutKNModal({
  row,
  initialData,
  onClose,
  onSave,
}: {
  row: any;
  initialData?: any;
  onClose: () => void;
  onSave: (record: any) => void;
}) {
  const [ngayQD, setNgayQD] = useState(initialData?.ngayQD || "2023-10-15");
  const [soQD, setSoQD] = useState(initialData?.soQD || "");
  const [daLaySo, setDaLaySo] = useState(Boolean(initialData?.soQD));
  const [nguoiKy, setNguoiKy] = useState(initialData?.nguoiKy || "");

  // Xét thấy & Quyết định
  const [noiDungXetThay, setNoiDungXetThay] = useState(
    initialData?.nhanThay || initialData?.noiDungXetThay || ""
  );
  const [noiDungQuyetDinh, setNoiDungQuyetDinh] = useState(
    initialData?.noiDungQD || initialData?.noiDungQuyetDinh || ""
  );

  // Nơi nhận List
  const [noiNhanList, setNoiNhanList] = useState<Array<{ id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }>>([
    { id: 1, noiNhan: "Viện kiểm sát", noiNhanChiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án" },
  ]);

  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleLaySoToggle = () => {
    if (daLaySo) {
      setSoQD("");
      setDaLaySo(false);
    } else {
      const generated = `${35 + Math.floor(Math.random() * 80)}/2026/QĐ-ĐC`;
      setSoQD(generated);
      setDaLaySo(true);
    }
  };

  const handleSave = () => {
    const finalSo = soQD || `${35 + Math.floor(Math.random() * 80)}/2026/QĐ-ĐC`;
    onSave({
      id: initialData?.id || Date.now(),
      tenQD: "Quyết định đình chỉ do rút kháng nghị",
      soQD: finalSo,
      ngayQD: ngayQD || "15/10/2023",
      nguoiKy: nguoiKy || "Lê Thị Thu Hiển",
      nguoiTao: "Nguyễn Văn Tiến",
      ngayTao: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN"),
      nhanThay: noiDungXetThay || "Người kháng nghị có văn bản rút toàn bộ kháng nghị giám đốc thẩm.",
      noiDungQD: noiDungQuyetDinh || "Đình chỉ việc xét xử giám đốc thẩm đối với vụ án.",
      noiNhanList,
    });
    onClose();
  };

  return (
    <>
      {showTrinhKy && (
        <TrinhKyModal
          title="Trình ký Quyết định đình chỉ xét xử do rút kháng nghị"
          onClose={() => setShowTrinhKy(false)}
          onSuccess={() => {
            setShowTrinhKy(false);
            handleSave();
          }}
        />
      )}
      {showBieuMau && (
        <XemBieuMauQuyetDinhWordModal
          tenQD="Quyết định đình chỉ do rút kháng nghị"
          row={row}
          data={{ soQD: soQD || "35/2026/QĐ-ĐC", ngayQD, nguoiKy, nhanThay: noiDungXetThay, noiDungQD: noiDungQuyetDinh }}
          onClose={() => setShowBieuMau(false)}
        />
      )}

      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, width: 880, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const, fontFamily: F }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#800000" }}>Quyết định đình chỉ xét xử do rút kháng nghị</span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>

          {/* Info Card */}
          <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.1fr 1fr", gap: "6px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Tên vụ án: </span><b>{row?.tenVuAn || "Chu Văn An - Nguyễn Anh Minh tranh chấp đất đai"}</b></div>
                <div><span style={{ color: MUTED }}>Nguyên đơn </span><b>{row?.nguyenDon || row?.ndkn || row?.ndd || "Chu Văn An"}</b></div>
                <div><span style={{ color: MUTED }}>Bị đơn </span><b>{row?.biDon || row?.biCao || "Nguyễn Anh Minh"}</b></div>
                <div><span style={{ color: MUTED }}>Quan hệ pháp luật: </span><span>{row?.qhpl || "Tranh chấp đất đai"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>{row?.soBA ? formatSoBA(row.soBA) : "125/2023/HS-ST"}</b></div>
                <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span><span>{row?.ngayBA || "15/10/2023"}</span></div>
                <div><span style={{ color: MUTED }}>Tòa xét xử: </span><span>{row?.toa || "Tòa án nhân dân tỉnh Long An"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Giai đoạn: </span><span style={{ color: "#059669", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
                <div><span style={{ color: MUTED }}>Tòa án giải quyết: </span><span style={{ color: "#059669", fontWeight: 600 }}>Tòa án nhân dân tối cao</span></div>
                <div><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#ea580c", fontWeight: 600 }}>Chưa có kết quả xét xử</span></div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {/* 1. Thông tin quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Thông tin quyết định
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Ngày quyết định
                  </label>
                  <input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Số quyết định</label>
                  <input placeholder="Nhập số quyết định" value={soQD} onChange={e => setSoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box", background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Người ký ban hành
                  </label>
                  <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", boxSizing: "border-box", background: "#fff" }}>
                    <option value="">Chọn người ký</option>
                    <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Xét thấy */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Xét thấy
              </div>
              <textarea
                placeholder="Nhập nội dung xét thấy..."
                value={noiDungXetThay}
                onChange={e => setNoiDungXetThay(e.target.value)}
                style={{ width: "100%", minHeight: 90, padding: "8px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* 3. Quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 3, height: 14, background: "#800000" }}></span>
                Quyết định
              </div>
              <textarea
                placeholder="Nhập nội dung quyết định"
                value={noiDungQuyetDinh}
                onChange={e => setNoiDungQuyetDinh(e.target.value)}
                style={{ width: "100%", minHeight: 90, padding: "8px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* 4. Nơi nhận */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Nơi nhận</div>
                <button
                  type="button"
                  onClick={() => setNoiNhanList(prev => [...prev, { id: Date.now(), noiNhan: "Tòa án", noiNhanChiTiet: "", ghiChu: "" }])}
                  style={{ padding: "5px 14px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
                >
                  Thêm nơi nhận
                </button>
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: 70 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN CHI TIẾT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>GHI CHÚ</th>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((rowItem, idx) => (
                      <tr key={rowItem.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <select
                            value={rowItem.noiNhan}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhan: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          >
                            <option value="Viện kiểm sát">Viện kiểm sát</option>
                            <option value="Tòa án">Tòa án</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Tên đơn vị nhận"
                            value={rowItem.noiNhanChiTiet}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhanChiTiet: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                          <input
                            placeholder="Nhập ghi chú"
                            value={rowItem.ghiChu}
                            onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, ghiChu: e.target.value } : x))}
                            style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                          />
                        </td>
                        <td style={{ ...TD_STYLE, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            <button
                              type="button"
                              onClick={() => {}}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 11, fontFamily: F }}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== rowItem.id))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, fontFamily: F }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, background: "#fff" }}>
            <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
              Đóng
            </button>
            <button onClick={handleSave} style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              Lưu
            </button>
            <button
              onClick={handleLaySoToggle}
              style={{
                padding: "7px 22px",
                background: "#fff",
                color: daLaySo ? "#dc2626" : TEXT,
                border: `1px dashed ${daLaySo ? "#dc2626" : BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              {daLaySo ? "Hủy lấy số" : "Lấy số"}
            </button>
            <button
              onClick={() => setShowTrinhKy(true)}
              style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
            >
              Trình ký
            </button>
            <button
              onClick={() => setShowBieuMau(true)}
              style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}
            >
              Xem biểu mẫu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Component Modal Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT (MS57) ──

export function TaoQuyetDinhThayDoiKNModal({
  row,
  initialData,
  onClose,
  onSave,
}: {
  row: any;
  initialData?: any;
  onClose: () => void;
  onSave: (record: any) => void;
}) {
  const [ngayQD, setNgayQD] = useState(initialData?.ngayQD || "2026-05-05");
  const [soQD, setSoQD] = useState(initialData?.soQD || "");
  const [daLaySo, setDaLaySo] = useState(Boolean(initialData?.soQD));
  const [nguoiKy, setNguoiKy] = useState(initialData?.nguoiKy || "");

  const [loaiThayDoi, setLoaiThayDoi] = useState<"bo-sung" | "rut-khang-nghi" | "thay-doi">(
    initialData?.loaiThayDoi || "rut-khang-nghi"
  );
  const [noiDungNhanThay, setNoiDungNhanThay] = useState(
    initialData?.nhanThay || initialData?.noiDungNhanThay || ""
  );

  // Nơi nhận List
  const [noiNhanList, setNoiNhanList] = useState<Array<{ id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string; editing?: boolean }>>([
    { id: 1, noiNhan: "Viện kiểm sát", noiNhanChiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
    { id: 2, noiNhan: "", noiNhanChiTiet: "", ghiChu: "", editing: true },
  ]);

  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const handleLaySoToggle = () => {
    if (daLaySo) {
      setSoQD("");
      setDaLaySo(false);
    } else {
      const generated = `${57 + Math.floor(Math.random() * 40)}/2026/QĐ-TĐKN`;
      setSoQD(generated);
      setDaLaySo(true);
    }
  };

  const handleSave = () => {
    const finalSo = soQD || `${57 + Math.floor(Math.random() * 40)}/2026/QĐ-TĐKN`;
    onSave({
      id: initialData?.id || Date.now(),
      tenQD: "Quyết định thay đổi/bổ sung/rút kháng nghị GĐT",
      soQD: finalSo,
      ngayQD: ngayQD || "05/05/2026",
      nguoiKy: nguoiKy || "Lê Thị Thu Hiển",
      nguoiTao: "Nguyễn Văn Tiến",
      ngayTao: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN"),
      loaiThayDoi,
      nhanThay: noiDungNhanThay || "Sau khi xét lại nội dung kháng nghị...",
      noiDungQD: loaiThayDoi === "bo-sung" ? "Bổ sung kháng nghị giám đốc thẩm." : loaiThayDoi === "rut-khang-nghi" ? "Rút toàn bộ kháng nghị giám đốc thẩm." : "Thay đổi nội dung kháng nghị.",
      noiNhanList,
    });
    onClose();
  };

  return (
    <>
      {showTrinhKy && (
        <TrinhKyModal
          title="Trình ký Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT"
          onClose={() => setShowTrinhKy(false)}
          onSuccess={() => {
            setShowTrinhKy(false);
            handleSave();
          }}
        />
      )}
      {showBieuMau && (
        <XemBieuMauQuyetDinhWordModal
          tenQD="Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT"
          row={row}
          data={{ soQD: soQD || "57/2026/QĐ-TĐKN", ngayQD, nguoiKy, nhanThay: noiDungNhanThay }}
          onClose={() => setShowBieuMau(false)}
        />
      )}

      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, width: 880, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const, fontFamily: F }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔨</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#800000" }}>
                Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT (MS57) - GĐT
              </span>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>

          {/* Info Card */}
          <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.1fr 1fr", gap: "6px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Mã vụ án : </span><b style={{ color: "#16a34a" }}>{row?.maVuAn || "VA26-00321"}</b></div>
                <div><span style={{ color: MUTED }}>Tên vụ án : </span><b style={{ color: "#16a34a" }}>{row?.tenVuAn || "Vụ án Phan Văn Thành - bức cung"}</b></div>
                <div><span style={{ color: MUTED }}>Tên bị can đầu vụ : </span><b style={{ color: "#16a34a" }}>{row?.biCao || row?.biCan || "Phan Văn Thành"}</b></div>
                <div><span style={{ color: MUTED }}>Tội danh chính : </span><b style={{ color: "#16a34a" }}>{row?.toiDanh || "Bức cung"}</b></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Số BA/QĐ : </span><b>{row?.soBA ? formatSoBA(row.soBA) : "050526_CTH02"}</b></div>
                <div><span style={{ color: MUTED }}>Ngày ra BA/QĐ : </span><span>{row?.ngayBA || "05/05/2026"}</span></div>
                <div><span style={{ color: MUTED }}>Tòa xét xử : </span><span>{row?.toa || "Tòa án nhân dân tỉnh Hải Phòng"}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div><span style={{ color: MUTED }}>Giai đoạn : </span><span style={{ color: "#059669", fontWeight: 600 }}>Giám đốc thẩm, tái thẩm</span></div>
                <div><span style={{ color: MUTED }}>Tòa án giải quyết : </span><span style={{ color: "#059669", fontWeight: 600 }}>Tòa án nhân dân tối cao</span></div>
                <div><span style={{ color: MUTED }}>Trạng thái : </span><span style={{ color: "#ea580c", fontWeight: 600 }}>Chưa có kết quả xét xử</span></div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {/* 1. Thông tin quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>➖</span>
                Thông tin quyết định
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: MUTED, marginBottom: 4 }}>Ngày quyết định</label>
                  <input type="date" value={ngayQD} onChange={e => setNgayQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: MUTED, marginBottom: 4 }}>Số quyết định</label>
                  <input placeholder="Nhập số quyết định" value={soQD} onChange={e => setSoQD(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box", background: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Người ký ban hành
                  </label>
                  <select value={nguoiKy} onChange={e => setNguoiKy(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, cursor: "pointer", boxSizing: "border-box", background: "#fff" }}>
                    <option value="">Chọn người ký ban hành</option>
                    <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Nội dung quyết định */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>➖</span>
                Nội dung quyết định
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
                    <span style={{ color: RED }}>* </span>Loại thay đổi
                  </label>
                  <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                      <input type="radio" name="loai-thay-doi-kn" checked={loaiThayDoi === "bo-sung"} onChange={() => setLoaiThayDoi("bo-sung")} style={{ accentColor: "#800000" }} />
                      Bổ sung
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                      <input type="radio" name="loai-thay-doi-kn" checked={loaiThayDoi === "rut-khang-nghi"} onChange={() => setLoaiThayDoi("rut-khang-nghi")} style={{ accentColor: "#800000" }} />
                      Rút kháng nghị
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                    <span style={{ color: RED }}>* </span>Nhận thấy
                  </label>
                  <textarea
                    placeholder="Nhập nội dung nhận thấy..."
                    value={noiDungNhanThay}
                    onChange={e => setNoiDungNhanThay(e.target.value)}
                    style={{ width: "100%", minHeight: 90, padding: "8px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Nơi nhận */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>
                  <span style={{ color: RED }}>* </span>Nơi nhận
                </div>
                <button
                  type="button"
                  onClick={() => setNoiNhanList(prev => [...prev, { id: Date.now(), noiNhan: "", noiNhanChiTiet: "", ghiChu: "", editing: true }])}
                  style={{ padding: "5px 14px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
                >
                  Thêm nơi nhận
                </button>
              </div>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 45 }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: 90 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>NƠI NHẬN CHI TIẾT</th>
                      <th style={{ ...TH_STYLE, fontSize: 11 }}>GHI CHÚ</th>
                      <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noiNhanList.map((rowItem, idx) => (
                      <tr key={rowItem.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                        {rowItem.editing ? (
                          <>
                            <td style={{ ...TD_STYLE, padding: "4px 6px" }}>
                              <select
                                value={rowItem.noiNhan}
                                onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhan: e.target.value } : x))}
                                style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                              >
                                <option value="">Chọn nơi nhận</option>
                                <option value="Viện kiểm sát">Viện kiểm sát</option>
                                <option value="Tòa án">Tòa án</option>
                                <option value="Khác">Khác</option>
                              </select>
                            </td>
                            <td style={{ ...TD_STYLE, padding: "4px 6px" }}>
                              <select
                                value={rowItem.noiNhanChiTiet}
                                onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, noiNhanChiTiet: e.target.value } : x))}
                                style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                              >
                                <option value="">Chọn</option>
                                <option value="VKSNDTC">VKSNDTC</option>
                                <option value="TAND Tối cao">TAND Tối cao</option>
                              </select>
                            </td>
                            <td style={{ ...TD_STYLE, padding: "4px 6px" }}>
                              <input
                                placeholder="Nhập ghi chú"
                                value={rowItem.ghiChu}
                                onChange={e => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, ghiChu: e.target.value } : x))}
                                style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, background: "#fff" }}
                              />
                            </td>
                            <td style={{ ...TD_STYLE, textAlign: "center" }}>
                              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, editing: false } : x))}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 11, fontFamily: F }}
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== rowItem.id))}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 11, fontFamily: F }}
                                >
                                  Hủy
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ ...TD_STYLE }}>{rowItem.noiNhan}</td>
                            <td style={{ ...TD_STYLE }}>{rowItem.noiNhanChiTiet}</td>
                            <td style={{ ...TD_STYLE, color: MUTED }}>{rowItem.ghiChu}</td>
                            <td style={{ ...TD_STYLE, textAlign: "center" }}>
                              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => setNoiNhanList(prev => prev.map(x => x.id === rowItem.id ? { ...x, editing: true } : x))}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 11, fontFamily: F }}
                                >
                                  Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNoiNhanList(prev => prev.filter(x => x.id !== rowItem.id))}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, fontFamily: F }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, background: "#fff" }}>
            <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
              Đóng
            </button>
            <button onClick={handleSave} style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
              Lưu
            </button>
            <button
              onClick={handleLaySoToggle}
              style={{
                padding: "7px 22px",
                background: "#fff",
                color: daLaySo ? "#dc2626" : TEXT,
                border: `1px dashed ${daLaySo ? "#dc2626" : BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              {daLaySo ? "Hủy lấy số" : "Lấy số"}
            </button>
            <button
              onClick={() => setShowTrinhKy(true)}
              style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
            >
              Trình ký
            </button>
            <button
              onClick={() => setShowBieuMau(true)}
              style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}
            >
              Xem biểu mẫu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ModalQuyetDinhVuAn({
  row,
  tenQuyetDinh,
  initialData,
  onClose,
  onSave,
  userRole,
}: {
  row: VuXetXuRow;
  tenQuyetDinh: string;
  initialData?: any;
  onClose: () => void;
  onSave: (record: any) => void;
  userRole?: UserRoleType;
}) {
  if (tenQuyetDinh === "Biên bản nghị án") {
    return (
      <TaoBienBanNghiAnModal
        row={row}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }

  if (tenQuyetDinh === "Quyết định hoãn phiên tòa của HĐXX") {
    return (
      <TaoQuyetDinhHoanHDXXModal
        row={row}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }

  if (tenQuyetDinh === "Quyết định đình chỉ do rút kháng nghị" || tenQuyetDinh.includes("đình chỉ do rút")) {
    return (
      <TaoQuyetDinhDinhChiDoRutKNModal
        row={row}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }

  if (tenQuyetDinh === "Quyết định thay đổi/bổ sung/rút kháng nghị GĐT" || tenQuyetDinh.includes("thay đổi")) {
    return (
      <TaoQuyetDinhThayDoiKNModal
        row={row}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }
  const isBienBan = tenQuyetDinh.toLowerCase().includes("biên bản");
  const isHoan = tenQuyetDinh.includes("hoãn phiên tòa");
  const isThayDoiKN = tenQuyetDinh.includes("thay đổi") || tenQuyetDinh.includes("bổ sung") || tenQuyetDinh.includes("rút kháng nghị GĐT");
  const isDinhChiChanhAn = tenQuyetDinh.includes("Chánh án");
  const isDinhChiHDXX = tenQuyetDinh.includes("HĐXX") && tenQuyetDinh.includes("đình chỉ");
  const isDinhChiDoRutKN = tenQuyetDinh.includes("đình chỉ do rút kháng nghị");
  const isBBNghiAn = tenQuyetDinh.includes("nghị án");

  const [soQD, setSoQD] = useState(initialData?.soQD || "");
  const [ngayQD, setNgayQD] = useState(initialData?.ngayQD || "27/07/2026");
  const [hauTo, setHauTo] = useState(
    initialData?.hauTo ||
    (isDinhChiChanhAn ? "QĐ-CA" : isDinhChiHDXX || isHoan ? "QĐ-HĐXX" : isBienBan ? (isBBNghiAn ? "BB-NA" : "BB-PTHS") : isDinhChiDoRutKN ? "QĐ-ĐC" : "QĐ-TANDTC")
  );
  const [nguoiKy, setNguoiKy] = useState(initialData?.nguoiKy || (isDinhChiChanhAn ? "Lê Thị Thu Hiển" : "Nguyễn Như Thắng"));
  const [loaiThayDoi, setLoaiThayDoi] = useState<"bo-sung" | "rut-khang-nghi" | "thay-doi">(initialData?.loaiThayDoi || "rut-khang-nghi");
  const [nhanThay, setNhanThay] = useState(
    initialData?.nhanThay ||
    (isHoan
      ? "Cần hoãn phiên tòa do vắng mặt người tham gia tố tụng cần thiết và cần xác minh thêm một số tài liệu chứng cứ của vụ án."
      : isDinhChiChanhAn || isDinhChiDoRutKN
        ? "Viện kiểm sát nhân dân tối cao có văn bản rút toàn bộ Quyết định kháng nghị giám đốc thẩm đối với vụ án theo đúng quy định pháp luật."
        : isDinhChiHDXX
          ? "Tại phiên tòa giám đốc thẩm, đại diện Viện kiểm sát nhân dân tối cao đã rút toàn bộ kháng nghị giám đốc thẩm."
          : isBBNghiAn
            ? "Hội đồng Thẩm phán đã tiến hành thảo luận, phân tích toàn diện các chứng cứ tài liệu và biểu quyết các vấn đề cần giải quyết."
            : "Sau khi nghiên cứu hồ sơ vụ án và xét các căn cứ pháp luật có liên quan...")
  );
  const [noiDungQD, setNoiDungQD] = useState(
    initialData?.noiDungQD ||
    (isHoan
      ? "Hoãn phiên tòa xét xử giám đốc thẩm. Thời gian mở lại phiên tòa: 08h30 ngày 15/08/2026 tại Phòng xử án số 1 TANDTC."
      : isDinhChiChanhAn || isDinhChiHDXX || isDinhChiDoRutKN
        ? `Đình chỉ xét xử giám đốc thẩm đối với vụ án ${row.tenVuAn || row.maVuAn}.`
        : isBBNghiAn
          ? "Nhất trí 5/5 Thẩm phán: Hủy một phần bản án phúc thẩm để xét xử lại theo thủ tục chung."
          : `Quyết định áp dụng các biện pháp tố tụng theo đúng quy định pháp luật đối với vụ án.`)
  );
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>(initialData?.noiNhan || [
    { id: 1, noi: "Viện kiểm sát", noiCT: "VKSNDTC", ghiChu: "Gửi kiểm sát", editing: false },
    { id: 2, noi: "Tòa án", noiCT: "TAND Tối cao", ghiChu: "Lưu hồ sơ", editing: false },
  ]);
  const [showWordPreview, setShowWordPreview] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);

  const INP: React.CSSProperties = { padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
  const LBL: React.CSSProperties = { fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, marginBottom: 4, display: "flex", alignItems: "center", gap: 2 };
  const REQ = <span style={{ color: RED }}>*</span>;
  const Fld = ({ label, req: r = true, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
      <label style={LBL}>{r && REQ} {label}</label>
      {children}
    </div>
  );

  const handleLaySo = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setSoQD(`5468${randomNum}`);
  };

  const handleSave = () => {
    const finalSo = soQD || `5468${Math.floor(1000 + Math.random() * 9000)}`;
    const fullSoQD = `${finalSo}/2026/${hauTo}`;
    onSave({
      id: initialData?.id || Date.now(),
      tenQD: tenQuyetDinh,
      soQD: fullSoQD,
      ngayQD,
      nguoiKy,
      nguoiTao: "Nguyễn Văn Tiến",
      ngayTao: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN"),
      hauTo,
      loaiThayDoi,
      nhanThay,
      noiDungQD,
      noiNhan,
    });
    onClose();
  };

  return (
    <>
      {showWordPreview && (
        <XemBieuMauQuyetDinhWordModal
          tenQD={tenQuyetDinh}
          row={row}
          data={{ soQD, ngayQD, hauTo, nguoiKy, nhanThay, noiDungQD, noiNhan }}
          onClose={() => setShowWordPreview(false)}
        />
      )}
      {showTrinhKy && (
        <TrinhKyModal
          title={`Trình ký ${tenQuyetDinh}`}
          onClose={() => setShowTrinhKy(false)}
          onSuccess={() => {
            setShowTrinhKy(false);
            handleSave();
          }}
        />
      )}

      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, width: 920, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" as const }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
              {tenQuyetDinh} – GĐT/TT
            </span>
            <div style={{ flex: 1 }} />
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>

          {/* Info block */}
          <div style={{ margin: "14px 20px 0", padding: "12px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: F }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 24px" }}>
              <span style={{ color: "#16a34a", fontWeight: 600 }}>Mã vụ án : <span style={{ color: TEXT, fontWeight: 400 }}>{row.maVuAn}</span></span>
              <span>Số BA/QĐ : <span style={{ fontWeight: 600 }}>{formatSoBA(row.soBA)}</span></span>
              <span style={{ color: "#16a34a" }}>Giai đoạn : <span style={{ color: TEXT }}>Giám đốc thẩm, tái thẩm</span></span>
              <span style={{ color: "#16a34a" }}>Tên vụ án : <span style={{ color: TEXT }}>{row.tenVuAn}</span></span>
              <span>Ngày ra BA/QĐ : <span style={{ fontWeight: 600 }}>{row.ngayBA}</span></span>
              <span style={{ color: "#16a34a" }}>Tòa án giải quyết : <span style={{ color: TEXT }}>{row.toaAnGiaiQuyet || "Tòa án nhân dân tối cao"}</span></span>
              <span style={{ color: "#16a34a" }}>Đương sự / Bị cáo : <span style={{ color: TEXT }}>{row.biCao || row.ndkn || row.ndd}</span></span>
              <span>Tòa xét xử : <span style={{ fontWeight: 600 }}>{row.toa}</span></span>
              <span style={{ color: "#16a34a" }}>Kháng nghị : <span style={{ color: "#2563eb", fontWeight: 600 }}>{row.soNgayKhangNghi || "QDKN-2026"}</span></span>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {/* Section: Thông tin quyết định / biên bản */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
                <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>
                  {isBienBan ? "Thông tin biên bản" : "Thông tin quyết định"}
                </span>
              </div>
              <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 1.5fr", gap: 12 }}>
                <Fld label={isBienBan ? "Ngày lập biên bản" : "Ngày quyết định"}>
                  <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                    <input value={ngayQD} onChange={e => setNgayQD(e.target.value)} placeholder="Chọn ngày" style={{ ...INP, border: "none", borderRadius: 0, flex: 1 }} />
                    <Calendar size={14} color={MUTED} style={{ marginRight: 8 }} />
                  </div>
                </Fld>
                <Fld label={isBienBan ? "Số biên bản" : "Số quyết định"} req={false}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <input value={soQD} onChange={e => setSoQD(e.target.value)} placeholder="Nhập hoặc Lấy số" style={INP} />
                    {/* <button
                      type="button"
                      onClick={handleLaySo}
                      style={{ padding: "0 10px", background: "#eff6ff", color: "#1e40af", border: "1px solid #93c5fd", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Lấy số
                    </button> */}
                  </div>
                </Fld>
                <Fld label="Hậu tố" req={false}>
                  <input value={hauTo} onChange={e => setHauTo(e.target.value)} style={INP} />
                </Fld>
                <Fld label={isBienBan ? "Người lập / Chủ tọa" : "Người ký ban hành"}>
                  <div style={{ position: "relative" as const }}>
                    <select
                      value={nguoiKy}
                      onChange={e => setNguoiKy(e.target.value)}
                      style={{ ...INP, appearance: "none" as const, cursor: "pointer", fontWeight: 500 }}
                    >
                      <option value="Lê Thị Thu Hiển">Lê Thị Thu Hiển – Chánh án TAND tối cao</option>
                      <option value="Nguyễn Như Thắng">Nguyễn Như Thắng – Thẩm phán TAND tối cao</option>
                      <option value="Nguyễn Biên Thùy">Nguyễn Biên Thùy – Thẩm phán TAND tối cao</option>
                      <option value="Trần Hồng Hà">Trần Hồng Hà – Thẩm phán TAND tối cao</option>
                      <option value="Ngô Hồng Phúc">Ngô Hồng Phúc – Thẩm phán TAND tối cao</option>
                      <option value="Lê Thanh Phong">Lê Thanh Phong – Thẩm phán TAND tối cao</option>
                      <option value="Viện trưởng VKSNDTC">Viện trưởng VKSNDTC</option>
                    </select>
                    <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </Fld>
              </div>
            </div>

            {/* Section: Danh sách Hội đồng xét xử (Hiển thị cho các Quyết định của HĐXX) */}
            {(isDinhChiHDXX || tenQuyetDinh.includes("HĐXX")) && (
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
                  <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>
                    Danh sách Hội đồng xét xử
                  </span>
                </div>
                <div style={{ padding: 14 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                      <col style={{ width: 50 }} />
                      <col style={{ width: "50%" }} />
                      <col style={{ width: "45%" }} />
                    </colgroup>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                        <th style={{ ...TH_STYLE, fontSize: 11, textAlign: "center" }}>STT</th>
                        <th style={{ ...TH_STYLE, fontSize: 11 }}>CHỨC DANH</th>
                        <th style={{ ...TH_STYLE, fontSize: 11 }}>TÊN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, chucDanh: "Thẩm phán - Chủ tọa phiên tòa", ten: "Nguyễn Văn A" },
                        { id: 2, chucDanh: "Thẩm phán", ten: "Trần Thị B" },
                        { id: 3, chucDanh: "Hội thẩm nhân dân", ten: "Lê Văn C" },
                      ].map((item, idx) => (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{idx + 1}</td>
                          <td style={{ ...TD_STYLE, fontSize: 12, fontWeight: 500 }}>{item.chucDanh}</td>
                          <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{item.ten}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section: Nội dung quyết định / biên bản */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
                <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>
                  {isBienBan ? "Nội dung biên bản" : "Nội dung quyết định"}
                </span>
              </div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {isThayDoiKN && (
                  <div>
                    <label style={{ ...LBL, marginBottom: 8 }}>{REQ} Loại thay đổi</label>
                    <div style={{ display: "flex", gap: 24 }}>
                      {(["bo-sung", "rut-khang-nghi", "thay-doi"] as const).map(v => (
                        <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F }}>
                          <input
                            type="radio"
                            name="loai-thay-doi"
                            checked={loaiThayDoi === v}
                            onChange={() => setLoaiThayDoi(v)}
                            style={{ accentColor: "#1d4ed8", width: 15, height: 15 }}
                          />
                          {v === "bo-sung" ? "Bổ sung kháng nghị" : v === "rut-khang-nghi" ? "Rút kháng nghị" : "Thay đổi nội dung kháng nghị"}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Fld label={isBienBan ? "Diễn biến / Lý do" : "Nhận thấy / Căn cứ ra quyết định"}>
                  <textarea
                    value={nhanThay}
                    onChange={e => setNhanThay(e.target.value)}
                    placeholder="Nhập nội dung nhận thấy, lý do căn cứ..."
                    rows={4}
                    style={{ ...INP, resize: "vertical" as const, lineHeight: 1.5 }}
                  />
                </Fld>

                <Fld label={isBienBan ? "Kết luận / Biểu quyết của HĐXX" : "Nội dung Quyết định"}>
                  <textarea
                    value={noiDungQD}
                    onChange={e => setNoiDungQD(e.target.value)}
                    placeholder="Nhập nội dung quyết định..."
                    rows={4}
                    style={{ ...INP, resize: "vertical" as const, lineHeight: 1.5 }}
                  />
                </Fld>

                {!isBienBan && <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10, background: "#fff", position: "sticky", bottom: 0 }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
              Đóng
            </button>
            <button onClick={handleSave} style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
              Lưu
            </button>
            <button onClick={handleLaySo} style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
              Lấy số
            </button>
            <button onClick={() => setShowTrinhKy(true)} style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
              Trình ký
            </button>
            <button onClick={() => setShowWordPreview(true)} style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
              Xem biểu mẫu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Tab: Quyết định vụ án ─────────────────────────────────────────────────────

function TabQuyetDinhVuAn({ row, userRole }: { row: VuXetXuRow; userRole?: UserRoleType }) {
  const [search, setSearch] = useState("");
  const [loaiBM, setLoaiBM] = useState("");
  const [selectedLoaiQD, setSelectedLoaiQD] = useState<string | null>(null);
  const [editingQD, setEditingQD] = useState<any | null>(null);
  const [wordPreviewQD, setWordPreviewQD] = useState<any | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const ddRef2 = useRef<HTMLDivElement>(null);

  // Determine if case is Hình sự or non-Hình sự (Vụ 2, 3, 4)
  const isVu234 =
    userRole === "vu-2" ||
    userRole === "vu-3" ||
    userRole === "vu-4" ||
    userRole === "dan-su" ||
    userRole === "hanh-chinh" ||
    (row?.loaiAn && row.loaiAn !== "Hình sự") ||
    (row?.soBA && !row.soBA.toUpperCase().includes("HS") && (row.soBA.toUpperCase().includes("DS") || row.soBA.toUpperCase().includes("HC") || row.soBA.toUpperCase().includes("KDTM")));

  const isHinhSu = !isVu234;

  const HINH_SU_QD_OPTIONS = [
    "Quyết định đình chỉ trước phiên tòa của Chánh án",
    "Quyết định đình chỉ tại phiên tòa của HĐXX",
    "Quyết định hoãn phiên tòa của HĐXX",
    "Quyết định hoãn phiên tòa của Chánh án",
    "Quyết định thay đổi/bổ sung/rút kháng nghị GĐT",
    "Biên bản phiên tòa hình sự GĐT",
  ];

  const OTHER_QD_OPTIONS = [
    "Quyết định đình chỉ do rút kháng nghị",
    "Biên bản nghị án",
    "Quyết định hoãn phiên tòa của HĐXX",
  ];

  const dropdownOptions = isHinhSu ? HINH_SU_QD_OPTIONS : OTHER_QD_OPTIONS;

  // Initial mock data tailored to case type
  const [qdList, setQdList] = useState<any[]>(() => {
    if (isHinhSu) {
      return [
        {
          id: 1,
          tenQD: "Quyết định đình chỉ trước phiên tòa của Chánh án",
          soQD: "54682704/2026/QĐ-CA",
          ngayQD: "27/07/2026",
          nguoiKy: "Lê Thị Thu Hiển",
          nguoiTao: "Nguyễn Văn Tiến",
          ngayTao: "27/07/2026 18:15:46",
          nhanThay: "Viện kiểm sát nhân dân tối cao có văn bản rút toàn bộ kháng nghị.",
          noiDungQD: "Đình chỉ việc xét xử theo thủ tục giám đốc thẩm đối với bản án.",
        },
        {
          id: 2,
          tenQD: "Quyết định hoãn phiên tòa của HĐXX",
          soQD: "12/2026/QĐ-HĐXX",
          ngayQD: "15/07/2026",
          nguoiKy: "Nguyễn Biên Thùy",
          nguoiTao: "Trịnh Thị Minh Trang",
          ngayTao: "15/07/2026 09:30:12",
          nhanThay: "Vắng mặt người tham gia tố tụng cần thiết.",
          noiDungQD: "Hoãn phiên tòa xét xử giám đốc thẩm. Mở lại vào 08h30 ngày 15/08/2026.",
        },
        {
          id: 3,
          tenQD: "Biên bản phiên tòa hình sự GĐT",
          soQD: "01/2026/BB-PTHS",
          ngayQD: "28/07/2026",
          nguoiKy: "Nguyễn Biên Thùy",
          nguoiTao: "Trịnh Thị Minh Trang",
          ngayTao: "28/07/2026 16:45:10",
          nhanThay: "Phiên tòa diễn ra đúng trình tự thủ tục tố tụng hình sự.",
          noiDungQD: "Hội đồng xét xử tiến hành nghị án và tuyên quyết định.",
        },
      ];
    } else {
      return [
        {
          id: 1,
          tenQD: "Quyết định đình chỉ do rút kháng nghị",
          soQD: "35/2026/QĐ-ĐC",
          ngayQD: "18/07/2026",
          nguoiKy: "Lê Thị Thu Hiển",
          nguoiTao: "Nguyễn Văn Tiến",
          ngayTao: "18/07/2026 10:15:20",
          nhanThay: "Người kháng nghị có văn bản rút toàn bộ kháng nghị giám đốc thẩm.",
          noiDungQD: "Đình chỉ việc xét xử giám đốc thẩm đối với vụ án.",
        },
        {
          id: 2,
          tenQD: "Biên bản nghị án",
          soQD: "04/2026/BB-NA",
          ngayQD: "08/07/2026",
          nguoiKy: "Nguyễn Như Thắng",
          nguoiTao: "Vũ Diệu Thúy",
          ngayTao: "08/07/2026 15:30:00",
          nhanThay: "HĐXX đã thảo luận, biểu quyết theo đa số các nội dung.",
          noiDungQD: "Nhất trí 5/5 Thẩm phán chấp nhận kháng nghị giám đốc thẩm.",
        },
      ];
    }
  });

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef2.current && !ddRef2.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const filtered = qdList.filter(r => {
    const matchesSearch = !search || r.tenQD.toLowerCase().includes(search.toLowerCase()) || r.soQD.toLowerCase().includes(search.toLowerCase()) || r.nguoiKy.toLowerCase().includes(search.toLowerCase());
    const matchesBM = !loaiBM || r.tenQD === loaiBM;
    return matchesSearch && matchesBM;
  });

  const handleSaveQD = (record: any) => {
    setQdList(prev => {
      const exists = prev.some(item => item.id === record.id);
      if (exists) {
        return prev.map(item => item.id === record.id ? record : item);
      }
      return [record, ...prev];
    });
  };

  const handleDeleteQD = (id: number) => {
    setQdList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      {/* Dynamic Modal for Create / Edit */}
      {selectedLoaiQD && (
        <ModalQuyetDinhVuAn
          row={row}
          tenQuyetDinh={selectedLoaiQD}
          initialData={editingQD}
          userRole={userRole}
          onClose={() => {
            setSelectedLoaiQD(null);
            setEditingQD(null);
          }}
          onSave={handleSaveQD}
        />
      )}

      {/* Word Preview Modal */}
      {wordPreviewQD && (
        <XemBieuMauQuyetDinhWordModal
          tenQD={wordPreviewQD.tenQD}
          row={row}
          data={wordPreviewQD}
          onClose={() => setWordPreviewQD(null)}
        />
      )}

      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Số – Ngày thụ lý XX", row.soNgayThuLy || "–", "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày BAST (hoặc QĐST)", row.soNgayBAQD, "Người kháng nghị", row.nguoiKhangNghi || "Viện trưởng Viện kiểm sát nhân dân tối cao"],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Table section */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "visible" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>▬</span> Quyết định vụ án & Biên bản
          </span>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, position: "relative" as const }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập từ khóa tìm kiếm"
              style={{ padding: "5px 10px", fontSize: 12, fontFamily: F, border: "none", outline: "none", width: 220 }} />
            <button style={{ padding: "5px 10px", background: RED, border: "none", cursor: "pointer" }}><Search size={13} color="#fff" /></button>
          </div>
          <div style={{ flex: 1 }} />
          <div ref={ddRef2} style={{ position: "relative" as const }}>
            <button onClick={() => setShowDropdown(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>
              + Thêm quyết định <ChevronDown size={13} color="#fff" />
            </button>
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                zIndex: 1200,
                minWidth: 340,
                overflow: "hidden",
              }}>
                {dropdownOptions.map((label, i) => (
                  <button key={label}
                    onClick={() => {
                      setShowDropdown(false);
                      setEditingQD(null);
                      setSelectedLoaiQD(label);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left" as const,
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: F,
                      color: TEXT,
                      display: "block",
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden", position: "relative" }}>
            <select
              value={loaiBM}
              onChange={e => setLoaiBM(e.target.value)}
              style={{ padding: "5px 28px 5px 12px", fontSize: 12, fontFamily: F, border: "none", outline: "none", background: "#fff", cursor: "pointer", appearance: "none" as const }}
            >
              <option value="">Tất cả loại biểu mẫu</option>
              {dropdownOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} color={MUTED} style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
          </div>
          <button
            onClick={() => { setSearch(""); setLoaiBM(""); }}
            title="Đặt lại bộ lọc"
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", color: MUTED }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["STT", "TÊN QUYẾT ĐỊNH / BIÊN BẢN", "SỐ QĐ/BB", "NGÀY RA QĐ", "NGƯỜI KÝ", "NGƯỜI TẠO", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{r.tenQD}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.soQD}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngayQD}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <div style={{ fontWeight: 600, fontFamily: F }}>{r.nguoiTao}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayTao}</div>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      title="Xem / Chỉnh sửa"
                      onClick={() => {
                        setEditingQD(r);
                        setSelectedLoaiQD(r.tenQD);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb" }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      title="Xem biểu mẫu Word"
                      onClick={() => setWordPreviewQD(r)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#059669" }}
                    >
                      <FileText size={15} />
                    </button>
                    <button
                      title="Xóa"
                      onClick={() => handleDeleteQD(r.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: RED }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1-{filtered.length} / {filtered.length}</span>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>‹</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${RED}`, borderRadius: 4, background: RED, color: "#fff", fontWeight: 700, cursor: "pointer" }}>1</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>›</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Hồ sơ vụ án ─────────────────────────────────────────────────────────

function TabHoSoVuAn({ row }: { row: VuXetXuRow }) {
  const [phamVi, setPhamVi] = React.useState<"hien-tai" | "tat-ca">("hien-tai");
  const [hienThiTheo, setHienThiTheo] = React.useState<"but-luc" | "tai-lieu">("but-luc");
  const [selectedDoc, setSelectedDoc] = React.useState<any | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);

  // Sample data for demo when items are present
  const mockDocs = [
    { id: 1, ten: "Bút lục 01: Bản án sơ thẩm 125/2023/HS-ST", trang: "01-15", ngay: "15/10/2023" },
    { id: 2, ten: "Bút lục 02: Bản án phúc thẩm 42/2024/HS-PT", trang: "16-30", ngay: "20/01/2024" },
    { id: 3, ten: "Bút lục 03: Kết luận điều tra số 45/KL-ĐT", trang: "31-50", ngay: "05/08/2023" },
  ];

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, display: "flex", flexDirection: "column", height: "calc(100vh - 210px)", minHeight: 560, overflow: "hidden", fontFamily: F }}>
      {/* Container main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* PANEL TRÁI: Hồ sơ lưu trữ */}
        <div style={{ width: 280, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>

          {/* Header trái */}
          <div style={{ height: 42, padding: "0 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Hồ sơ lưu trữ</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex", alignItems: "center" }} title="Tùy chọn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
                <circle cx="8" cy="6" r="2" fill="#fff"></circle>
                <circle cx="16" cy="12" r="2" fill="#fff"></circle>
                <circle cx="10" cy="18" r="2" fill="#fff"></circle>
              </svg>
            </button>
          </div>

          {/* Controls filtering */}
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>

            {/* 1. Phạm vi tải */}
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Phạm vi tải</div>
              <div style={{ background: "#f3f4f6", borderRadius: 6, padding: 3, display: "flex", gap: 2 }}>
                <button
                  onClick={() => setPhamVi("hien-tai")}
                  style={{
                    flex: 1, padding: "6px 4px", fontSize: 11, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: phamVi === "hien-tai" ? "#fff" : "transparent",
                    color: phamVi === "hien-tai" ? TEXT : MUTED,
                    fontWeight: phamVi === "hien-tai" ? 600 : 400,
                    boxShadow: phamVi === "hien-tai" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Giai đoạn hiện tại
                </button>
                <button
                  onClick={() => setPhamVi("tat-ca")}
                  style={{
                    flex: 1, padding: "6px 4px", fontSize: 11, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: phamVi === "tat-ca" ? "#fff" : "transparent",
                    color: phamVi === "tat-ca" ? TEXT : MUTED,
                    fontWeight: phamVi === "tat-ca" ? 600 : 400,
                    boxShadow: phamVi === "tat-ca" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Tất cả giai đoạn
                </button>
              </div>
            </div>

            {/* 2. Hiển thị theo */}
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Hiển thị theo</div>
              <div style={{ background: "#f3f4f6", borderRadius: 6, padding: 3, display: "flex", gap: 2 }}>
                <button
                  onClick={() => setHienThiTheo("but-luc")}
                  style={{
                    flex: 1, padding: "6px 4px", fontSize: 11, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: hienThiTheo === "but-luc" ? "#fff" : "transparent",
                    color: hienThiTheo === "but-luc" ? TEXT : MUTED,
                    fontWeight: hienThiTheo === "but-luc" ? 600 : 400,
                    boxShadow: hienThiTheo === "but-luc" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Bút lục
                </button>
                <button
                  onClick={() => setHienThiTheo("tai-lieu")}
                  style={{
                    flex: 1, padding: "6px 4px", fontSize: 11, fontFamily: F, border: "none", borderRadius: 4, cursor: "pointer",
                    background: hienThiTheo === "tai-lieu" ? "#fff" : "transparent",
                    color: hienThiTheo === "tai-lieu" ? TEXT : MUTED,
                    fontWeight: hienThiTheo === "tai-lieu" ? 600 : 400,
                    boxShadow: hienThiTheo === "tai-lieu" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  Tài liệu
                </button>
              </div>
            </div>

          </div>

          {/* Danh sách / Empty state trong panel trái */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {selectedDoc ? (
              <div style={{ width: "100%" }}>
                {mockDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 6,
                      background: selectedDoc?.id === doc.id ? "#eff6ff" : "#f9fafb",
                      border: `1px solid ${selectedDoc?.id === doc.id ? "#bfdbfe" : BORDER}`
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>📄 {doc.ten}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>Trang: {doc.trang} · Ngày: {doc.ngay}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 18H44V46H20V18Z" stroke="#d1d5db" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M14 24H50V52H14V24Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="22" y1="32" x2="42" y2="32" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                    <line x1="22" y1="40" x2="34" y2="40" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Chưa có hồ sơ lưu trữ</div>
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button
              onClick={() => setSelectedDoc(mockDocs[0])}
              style={{
                width: "100%", padding: "7px 12px", background: "#fff", color: TEXT,
                border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12,
                fontFamily: F, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <span>⤓</span> Tải hồ sơ xuống
            </button>
          </div>

        </div>

        {/* PANEL PHẢI: Nội dung tài liệu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>

          {/* Header panel phải */}
          <div style={{ height: 42, padding: "0 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
              {selectedDoc ? selectedDoc.ten : "Chưa chọn tài liệu"}
            </span>
          </div>

          {/* Body Viewer Area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", overflow: "auto" }}>
            {selectedDoc ? (
              <div style={{ padding: 40, width: "100%", maxWidth: 650, background: "#fff", border: `1px solid ${BORDER}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h3 style={{ textAlign: "center", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{selectedDoc.ten}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: TEXT }}>
                  Nội dung chi tiết tài liệu {selectedDoc.ten} đang được tải hiển thị tại đây...
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="12" width="28" height="40" rx="2" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="24" y1="22" x2="38" y2="22" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="28" x2="40" y2="28" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="34" x2="34" y2="34" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="40" x2="38" y2="40" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>Chưa có hồ sơ lưu trữ</div>
              </div>
            )}
          </div>

        </div>

        {/* FAR RIGHT: Lịch sử Vertical Tab Strip */}
        <div style={{ width: 36, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", alignItems: "center", background: "#fff", flexShrink: 0 }}>
          <button
            onClick={() => setShowHistory(v => !v)}
            style={{ width: 36, height: 42, background: "none", border: "none", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}
            title="Làm mới / Lịch sử"
          >
            <RotateCcw size={14} />
          </button>

          <div
            onClick={() => setShowHistory(v => !v)}
            style={{
              writingMode: "vertical-rl", transform: "rotate(180deg)", cursor: "pointer",
              padding: "16px 4px", fontSize: 12, color: TEXT, fontFamily: F, letterSpacing: 0.5,
              userSelect: "none"
            }}
          >
            Lịch sử
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Tab: Quyết định bị cáo (Theo đúng mẫu ảnh) ──────────────────────────────────
function TabQuyetDinhBiCao({ row }: { row?: VuXetXuRow }) {
  const [search, setSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);

  const [dataList, setDataList] = useState([
    {
      id: 1,
      stt: 1,
      tenBiCao: "Trần Văn Hải – 2000 – Tội che giấu tội phạm",
      tenQuyetDinh: "Quyết định tiếp tục tạm giam",
      soQD: "–",
      ngayQD: "–",
      nguoiKy: { ten: "Phạm Quốc Hưng – Phó CA", status: "Chưa có hiệu lực", isDone: false },
      nguoiTao: { ten: "Vũ Diệu Thúy", thoiGian: "27/07/2026 14:40:05" },
    },
    {
      id: 2,
      stt: 2,
      tenBiCao: "Trần Văn Hải – 2000 – Tội che giấu tội phạm",
      tenQuyetDinh: "Quyết định tiếp tục tạm giam",
      soQD: "54682703/2026/THAHS-QĐ",
      ngayQD: "27/07/2026",
      nguoiKy: { ten: "Phạm Quốc Hưng – Phó CA", status: "Đã có hiệu lực", isDone: true },
      nguoiTao: { ten: "Vũ Diệu Thúy", thoiGian: "27/07/2026 14:40:05" },
    },
    {
      id: 3,
      stt: 3,
      tenBiCao: "Trần Văn Hải – 2000 – Tội che giấu tội phạm",
      tenQuyetDinh: "Quyết định tiếp tục tạm giam",
      soQD: "54682694/2026/THAHS-QĐ",
      ngayQD: "27/07/2026",
      nguoiKy: { ten: "Phạm Quốc Hưng – Phó CA", status: "Chờ ký", isDone: false },
      nguoiTao: { ten: "Hoàng Ngọc Chiêu", thoiGian: "27/07/2026 14:35:36" },
    },
  ]);

  const handleAddQuyetDinh = () => {
    setShowAddMenu(false);
    setShowTaoDuThao(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa quyết định này?")) {
      setDataList(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredData = dataList.filter(item =>
    !search.trim() ||
    item.tenBiCao.toLowerCase().includes(search.toLowerCase()) ||
    item.tenQuyetDinh.toLowerCase().includes(search.toLowerCase()) ||
    item.soQD.toLowerCase().includes(search.toLowerCase())
  );

  const thSt: React.CSSProperties = {
    padding: "10px 8px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#374151",
    fontFamily: F,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  };

  const tdSt: React.CSSProperties = {
    padding: "10px 8px",
    fontSize: 12,
    fontFamily: F,
    verticalAlign: "middle",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: F }}>
      {showTaoDuThao && (
        <TaoDuThaoModal
          onClose={() => setShowTaoDuThao(false)}
          detail={{
            maVuAn: row?.maVuAn || "VA26-002148",
            tenVuAn: row?.tenVuAn || "Vụ án Trần Văn Hải",
            soBA: "5469 - 03/07/2026",
            // THIẾU [TB]: đánh dấu loại văn bản để TaoDuThaoModal hiện thêm bảng Căn cứ điều luật
            // + Cơ sở trại giam/trại tạm giam — SRS QĐ Bị cáo C.5, C.6
            loaiVanBan: "tiep-tuc-tam-giam",
          }}
          onSave={d => {
            const nextId = Date.now();
            setDataList(prev => [
              ...prev,
              {
                id: nextId,
                stt: prev.length + 1,
                tenBiCao: "Trần Văn Hải – 2000 – Tội che giấu tội phạm",
                tenQuyetDinh: "Quyết định tiếp tục tạm giam",
                soQD: d.soQuyetDinh || "54682800/2026/THAHS-QĐ",
                ngayQD: d.ngayQuyetDinh || "09/08/2026",
                nguoiKy: { ten: d.nguoiKy || "Phạm Quốc Hưng – Phó CA", status: "Chờ ký", isDone: false },
                nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "Vừa xong" },
              },
            ]);
          }}
        />
      )}

      {/* Top Info Card Grid */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", padding: "12px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "8px 24px",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div>
            <span style={{ color: MUTED }}>Số - Ngày thụ lý XX: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>{row?.maVuAn || "VA26-002148"}</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số - Ngày BAST (hoặc QĐST): </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>5469 - 03/07/2026</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Tòa ra BA/QĐ: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>Tòa án nhân dân khu vực 5 - Bắc Ninh</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số - Ngày Kháng nghị: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>QĐKN_2707 - 27/07/2026</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số - Ngày thụ lý xét xử: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>54681978 - 09/07/2026</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Trạng thái: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>Chưa xét xử</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Viện kiểm sát giải quyết: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>Viện kiểm sát nhân dân tối cao</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Tòa án giải quyết: </span>
            <span style={{ color: "#111827", fontWeight: 600 }}>Tòa án nhân dân tối cao</span>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {/* Controls Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: `1px solid ${BORDER}`,
            gap: 12,
          }}
        >
          {/* Left Title + Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#800000", fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
              ▼ Quyết định bị cáo
            </span>
            <div style={{ display: "flex", alignItems: "center", maxWidth: 260, width: "100%" }}>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: "5px 10px",
                  fontSize: 12,
                  fontFamily: F,
                  border: "1px solid #d1d5db",
                  borderRight: "none",
                  borderRadius: "4px 0 0 4px",
                  outline: "none",
                  width: "100%",
                }}
              />
              <button
                style={{
                  background: "#800000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  padding: "6px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* Right Action Menu */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <button
              onClick={() => setShowAddMenu(o => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
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
              + Thêm quyết định <ChevronDown size={14} />
            </button>

            {/* Dropdown menu - ONLY contains Quyết định tiếp tục tạm giam per user instruction */}
            {showAddMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 32,
                  zIndex: 200,
                  marginTop: 4,
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  minWidth: 200,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={handleAddQuyetDinh}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: 12,
                    fontFamily: F,
                    color: "#111827",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                >
                  Quyết định tiếp tục tạm giam
                </button>
              </div>
            )}

            <button
              style={{
                background: "none",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "5px 8px",
                cursor: "pointer",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
              }}
              title="Làm mới"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
                <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                <th style={{ ...thSt, width: 220 }}>Tên bị cáo</th>
                <th style={{ ...thSt, width: 200 }}>Tên quyết định</th>
                <th style={{ ...thSt, width: 160 }}>Số QĐ</th>
                <th style={{ ...thSt, width: 110 }}>Ngày ra QĐ</th>
                <th style={{ ...thSt, width: 180 }}>Người ký</th>
                <th style={{ ...thSt, width: 170 }}>Người tạo</th>
                <th style={{ ...thSt, width: 100, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
                  <td style={{ ...tdSt, textAlign: "center", color: "#6b7280" }}>{idx + 1}</td>
                  <td style={{ ...tdSt, color: "#111827", fontWeight: 600 }}>{r.tenBiCao}</td>
                  <td style={{ ...tdSt, color: "#111827" }}>{r.tenQuyetDinh}</td>
                  <td style={{ ...tdSt, color: "#111827" }}>{r.soQD}</td>
                  <td style={{ ...tdSt, color: "#111827" }}>{r.ngayQD}</td>
                  <td style={{ ...tdSt }}>
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiKy.ten}</div>
                      <div style={{ color: r.nguoiKy.isDone ? "#16a34a" : "#6b7280", fontSize: 11 }}>
                        {r.nguoiKy.status}
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdSt }}>
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiTao.ten}</div>
                      <div style={{ color: "#6b7280", fontSize: 11 }}>{r.nguoiTao.thoiGian}</div>
                    </div>
                  </td>
                  <td style={{ ...tdSt, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <button
                        onClick={() => setShowTaoDuThao(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#6b7280" }}
                        title="Xem chi tiết"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setShowTaoDuThao(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#6b7280" }}
                        title="Xem văn bản"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#dc2626" }}
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 24, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                    Không tìm thấy quyết định bị cáo phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            padding: "10px 16px",
            fontSize: 12,
            color: "#6b7280",
            fontFamily: F,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <span>Hiển thị 1-{filteredData.length} / {filteredData.length}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              disabled
              style={{
                background: "none",
                border: "none",
                color: "#d1d5db",
                cursor: "not-allowed",
                padding: "2px 6px",
              }}
            >
              &lt;
            </button>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#800000",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              1
            </span>
            <button
              disabled
              style={{
                background: "none",
                border: "none",
                color: "#d1d5db",
                cursor: "not-allowed",
                padding: "2px 6px",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Tài liệu vụ án ──────────────────────────────────────────────────────
function TabTaiLieuVuAn({ row }: { row?: VuXetXuRow }) {
  return (
    <div style={{ height: "calc(100vh - 210px)", minHeight: 560, width: "100%", overflow: "hidden" }}>
      <TaiLieuHoSoView vuAnId={row?.maVuAn} tenVuAn={row?.tenVuAn} />
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function ChiTietVuXetXuView({ row, userRole, onBack, initialTab, onGoToThamMuu }: { row: VuXetXuRow; userRole?: UserRoleType; onBack: () => void; initialTab?: DetailTab; onGoToThamMuu?: () => void }) {
  const [tab, setTab] = useState<DetailTab>(initialTab || "thong-tin");
  // THIẾU [TB]: cảnh báo "Các thông tin thay đổi chưa được Lưu" khi rời tính năng lúc đang sửa dở
  const [thongTinDangSua, setThongTinDangSua] = useState(false);
  const handleBackWithConfirm = () => {
    if (thongTinDangSua && !window.confirm("Các thông tin thay đổi chưa được Lưu. Bạn có chắc chắn muốn rời khỏi màn hình?")) return;
    onBack();
  };

  const isHinhSuDetail =
    userRole === "vu-1" ||
    userRole === "hinh-su" ||
    (row?.loaiAn === "Hình sự") ||
    (!row?.loaiAn && !userRole);

  // THIẾU [Cao]: tab "Đơn GĐT,TT" – ẩn khi vụ XX là Hồ sơ kháng nghị (SRS Xem chi tiết vụ XX)
  const laHoSoKhangNghi = (row as any)?.laHoSoKhangNghi === true || row.trangThai === "rut-khang-nghi";
  const activeDetailTabs = DETAIL_TABS.filter(
    t => (isHinhSuDetail || t.key !== "qd-bi-cao") && (t.key !== "don-gdt-tt" || !laHoSoKhangNghi)
  );

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0 }}>
        Trang chủ › Quản lý GĐT/TT › Quản lý vụ xét xử GĐT › Chi tiết vụ xét xử
      </div>
      <div style={{ background: "#fff", padding: "14px 20px 0", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <button onClick={handleBackWithConfirm} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, padding: 0, marginBottom: 12 }}>
          ← Chi tiết án xét xử – {row.maVuAn}
        </button>
        <div style={{ display: "flex", flexWrap: "nowrap" as const, overflowX: "auto" as const }}>
          {activeDetailTabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: F, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? RED : "#4b5563",
              borderBottom: tab === t.key ? `2px solid ${RED}` : "2px solid transparent",
              whiteSpace: "nowrap" as const, marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {tab === "thong-tin" && <TabThongTin row={row} userRole={userRole} onDirtyChange={setThongTinDangSua} />}
        {tab === "thu-ly" && <TabThuLy row={row} />}
        {tab === "don-gdt-tt" && !laHoSoKhangNghi && <TabDonGDTTT row={row} />}
        {tab === "to-trinh" && <TabToTrinhXX row={row} />}
        {tab === "phan-cong" && <TabPhanCong row={row} />}
        {tab === "qd-bi-cao" && isHinhSuDetail && <TabQuyetDinhBiCao row={row} />}
        {tab === "qd-vu-an" && <TabQuyetDinhVuAn row={row} userRole={userRole} />}
        {tab === "ket-qua" && <TabKetQua row={row} onGoToThamMuu={onGoToThamMuu} />}
        {tab === "tai-lieu-vu-an" && <TabTaiLieuVuAn row={row} />}
        {tab === "ho-so-vu-an" && <TabHoSoVuAn row={row} />}
      </div>
    </div>
  );
}

// ── Tab: Kết quả xét xử ──────────────────────────────────────────────────────

// ── TabKetQua helpers (module-level to avoid React re-mount issues) ───────────

const kqInpSt: React.CSSProperties = {
  padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`,
  borderRadius: 4, outline: "none", width: "100%", background: "#fff",
};
const kqSelSt: React.CSSProperties = { ...kqInpSt, appearance: "none" as const, cursor: "pointer" };
const kqLblSt: React.CSSProperties = { fontSize: 12, fontFamily: F, fontWeight: 600, color: TEXT, display: "flex", alignItems: "center", gap: 2 };

function KqField({ label, required: r = true, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, minWidth: 0 }}>
      <label style={kqLblSt}>{r && <span style={{ color: RED }}>*</span>} {label}</label>
      {children}
    </div>
  );
}

function KqSelect({ placeholder: ph }: { placeholder: string }) {
  return (
    <div style={{ position: "relative" as const, width: "100%" }}>
      <select style={kqSelSt}><option value="">{ph}</option></select>
      <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

// THIẾU [Cao] – SRS mục B.12: bảng Điều luật nhiều dòng
type DieuLuatRow = { id: number; boLuat: string; dieuLuat: string[]; khoan: string; diem: string };
const BO_LUAT_OPTIONS = ["Bộ luật Hình sự 2015", "Bộ luật Dân sự 2015", "Bộ luật Tố tụng hình sự 2015", "Bộ luật Tố tụng dân sự 2015", "Luật Tố tụng hành chính 2015"];
const DIEU_LUAT_OPTIONS = ["Điều 371", "Điều 372", "Điều 388", "Điều 391", "Điều 393", "Điều 398", "Điều 400"];

function TabKetQua({ row, onGoToThamMuu }: { row: VuXetXuRow; onGoToThamMuu?: () => void }) {
  // THIẾU [Thấp]: trạng thái nút theo luồng ký — SRS mục E
  const [trangThaiKy, setTrangThaiKy] = useState<"chua-co-kq" | "cho-ky" | "da-ky">("chua-co-kq");
  const [apAnLe, setApAnLe] = useState<"khong" | "co">("khong");
  const [toaXetXuLai, setToaXetXuLai] = useState(""); // THIẾU [Cao] – SRS mục B.11
  const [suaToiDanh, setSuaToiDanh] = useState<string | null>(null); // THIẾU [Cao] – popup sửa tội danh
  const [dieuLuatRows, setDieuLuatRows] = useState<DieuLuatRow[]>([
    { id: 1, boLuat: "Bộ luật Tố tụng hình sự 2015", dieuLuat: ["Điều 388"], khoan: "1", diem: "a" },
  ]);
  const [dlEditId, setDlEditId] = useState<number | null>(null);
  const [dlDraft, setDlDraft] = useState<DieuLuatRow>({ id: 0, boLuat: BO_LUAT_OPTIONS[0], dieuLuat: [], khoan: "", diem: "" });
  const batDauThemDL = () => { setDlDraft({ id: Date.now(), boLuat: BO_LUAT_OPTIONS[0], dieuLuat: [], khoan: "", diem: "" }); setDlEditId(-1); };
  const luuDL = () => {
    if (!dlDraft.dieuLuat.length) return;
    setDieuLuatRows(prev => dlEditId && dlEditId > 0 ? prev.map(r => r.id === dlEditId ? { ...dlDraft, id: dlEditId } : r) : [...prev, dlDraft]);
    setDlEditId(null);
  };
  const [congBoBA, setCongBoBA] = useState<"co" | "khong">("co");
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([
    { id: 1, noi: "Viện kiểm sát", noiCT: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [vatChung] = useState<{ id: number; ten: string }[]>([]);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px", textAlign: "center" as const };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 10px", verticalAlign: "middle" as const };

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Số – Ngày thụ lý XX", row.soNgayThuLy || "–", "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày BAST (hoặc QĐST)", row.soNgayBAQD, "Người kháng nghị", row.nguoiKhangNghi || "Viện trưởng Viện kiểm sát nhân dân tối cao"],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Tòa án giải quyết", row.toaAnGiaiQuyet],
          // LỆCH (SRS): InfoGrid tab Kết quả trước dùng lại y hệt InfoGrid tab Thông tin,
          // thiếu Thủ tục giải quyết/Trạng thái/VKS giải quyết — bổ sung ở đây.
          ["Thủ tục giải quyết", "Giám đốc thẩm, tái thẩm", "Trạng thái", row.trangThai],
          ["VKS giải quyết", row.vienKiemSat || "–", "Tòa án thụ lý", row.toaAnThuLy || row.toaAnGiaiQuyet || "–"],
          ["Liên quan bản án sơ thẩm", row.lienQuanBanAnSoTham || row.soNgayBAQD || "–", "", ""],
        ]} />
      </div>

      {/* Kết quả giám đốc thẩm / tái thẩm */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Kết quả giám đốc thẩm, tái thẩm</span>
          </div>
          {onGoToThamMuu && (
            <button
              type="button"
              onClick={onGoToThamMuu}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${RED}`, color: RED, borderRadius: 4, padding: "6px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer" }}
            >
              Danh sách tham mưu
            </button>
          )}
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Ngày mở phiên tòa">
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Địa điểm">
              <KqSelect placeholder="Chọn địa điểm" />
            </KqField>
            <KqField label="Ngày quyết định" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input defaultValue="22/07/2026" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Số quyết định" required={false}>
              <input placeholder="nhập dữ liệu" style={kqInpSt} />
            </KqField>
          </div>
          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Người ký">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Ngày phát hành" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Tòa án xét xử lại" required={false}>
              <input value={toaXetXuLai} onChange={e => setToaXetXuLai(e.target.value)} placeholder="Nhập tòa án xét xử lại" style={kqInpSt} />
            </KqField>
            <div />
          </div>

          {/* THIẾU [Cao] – SRS mục B.12: bảng Điều luật nhiều dòng */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: TEXT, textTransform: "uppercase" as const, fontFamily: F }}>Căn cứ điều luật</span>
              <button onClick={batDauThemDL} style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>+ Thêm dòng</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Bộ luật", "Điều luật", "Khoản", "Điểm", "Thao tác"].map(h => (
                  <th key={h} style={{ ...TH_STYLE, fontSize: 11, padding: "8px 10px" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {dieuLuatRows.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD_STYLE, fontSize: 12 }}>{r.boLuat}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12 }}>{r.dieuLuat.join(", ")}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12 }}>{r.khoan || "–"}</td>
                    <td style={{ ...TD_STYLE, fontSize: 12 }}>{r.diem || "–"}</td>
                    <td style={{ ...TD_STYLE, textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
                      <button title="Sửa" onClick={() => { setDlDraft(r); setDlEditId(r.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", marginRight: 6 }}><Pencil size={13} /></button>
                      <button title="Xóa" onClick={() => setDieuLuatRows(prev => prev.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
                {dlEditId !== null && (
                  <tr style={{ background: "#fffbeb" }}>
                    <td style={{ ...TD_STYLE }}>
                      <select value={dlDraft.boLuat} onChange={e => setDlDraft(d => ({ ...d, boLuat: e.target.value }))} style={{ ...kqInpSt, cursor: "pointer" }}>
                        {BO_LUAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td style={{ ...TD_STYLE }}>
                      <select
                        multiple
                        value={dlDraft.dieuLuat}
                        onChange={e => setDlDraft(d => ({ ...d, dieuLuat: Array.from(e.target.selectedOptions).map(o => o.value) }))}
                        style={{ ...kqInpSt, height: 66, cursor: "pointer" }}
                      >
                        {DIEU_LUAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                    <td style={{ ...TD_STYLE }}>
                      <input value={dlDraft.khoan} onChange={e => setDlDraft(d => ({ ...d, khoan: e.target.value }))} placeholder="Khoản" style={kqInpSt} />
                    </td>
                    <td style={{ ...TD_STYLE }}>
                      <input value={dlDraft.diem} onChange={e => setDlDraft(d => ({ ...d, diem: e.target.value }))} placeholder="Điểm" style={kqInpSt} />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
                      <button onClick={luuDL} style={{ padding: "4px 10px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, marginRight: 5 }}>Lưu</button>
                      <button onClick={() => setDlEditId(null)} style={{ padding: "4px 10px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>Hủy</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Kết quả GĐT,TT">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Nguyên nhân">
              <KqSelect placeholder="Chọn nguyên nhân" />
            </KqField>
            <KqField label="Áp dụng án lệ" required={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["khong", "co"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="ap-an-le" checked={apAnLe === v} onChange={() => setApAnLe(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "khong" ? "Không" : "Có"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>
          {/* Row 4 – Có công bố bản án */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 12 }}>
            <KqField label="Có công bố bản án">
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["co", "khong"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="cong-bo" checked={congBoBA === v} onChange={() => setCongBoBA(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "co" ? "Có" : "Không"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>

          {/* Nơi nhận */}
          <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
        </div>
      </div>

      {/* Thông tin liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Thông tin liên quan</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nội dung vụ án</label>
            <textarea placeholder="Nhập nội dung vụ án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nhận định tòa án</label>
            <textarea placeholder="Nhập nhận định của tòa án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
        </div>
      </div>

      {/* Danh sách quyết định liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách quyết định liên quan</span>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: BG }}>
                <th rowSpan={3} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: 40 }}>STT</th>
                <th colSpan={2} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bị cáo/bị cáo</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>BA/QĐ sơ thẩm (PT/GĐT,TT)</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Quyết định GĐT,TT</th>
                <th rowSpan={3} style={{ ...TH, borderBottom: `1px solid ${BORDER}` }}>Thao tác</th>
              </tr>
              <tr style={{ background: BG }}>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Xét xử lại</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đổi hình phạt</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tên</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>1</td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Trần Phi Hùng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, textAlign: "center" as const, borderBottom: `1px solid ${BORDER}` }}>
                  <button onClick={() => setSuaToiDanh("Trần Phi Hùng")} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}><Pencil size={12} /> Sửa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Xử lý vật chứng */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Xử lý vật chứng</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm mới</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["STT", "Tên vật chứng, đồ vật, tài liệu", "Số lượng", "Tình trạng", "Thuộc sở hữu của", "Mô tả", "Nơi lưu giữ", "Hình thức xử lý", "Trả lại cho", "Thao tác"].map(h => (
                <th key={h} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vatChung.length === 0 && (
              <tr><td colSpan={10} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có vật chứng</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trách nhiệm dân sự */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Trách nhiệm dân sự</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm quan hệ bồi thường</button>
        </div>
        <div style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F, lineHeight: 1.8 }}>
          Chưa có mối quan hệ bồi thường nào. Nhấn "Thêm quan hệ bồi thường" để bắt đầu.
        </div>
      </div>

      {/* THIẾU [Thấp]: khối Thông tin thống kê — SRS mục G (SRS ghi "đang phát triển") */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin thống kê</span>
        </div>
        <div style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>
          Chức năng đang phát triển.
        </div>
      </div>

      {/* Footer actions */}
      {/* THIẾU [Thấp]: nhóm nút Thêm mới KQ/Cập nhật KQ/Chỉnh sửa thông tin vụ án + trạng thái nút theo luồng ký — SRS mục E */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, paddingBottom: 8 }}>
        {trangThaiKy === "chua-co-kq" ? (
          <button onClick={() => setTrangThaiKy("cho-ky")} style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>+ Thêm mới kết quả</button>
        ) : trangThaiKy === "cho-ky" ? (
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Cập nhật kết quả</button>
        ) : (
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, color: MUTED }} disabled>Cập nhật kết quả (đã ký, khóa sửa)</button>
        )}
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Chỉnh sửa thông tin vụ án</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
        {trangThaiKy !== "da-ky" && (
          <button onClick={() => setTrangThaiKy("da-ky")} style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
        )}
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
      </div>

      {suaToiDanh && <SuaToiDanhModal tenBiCao={suaToiDanh} onClose={() => setSuaToiDanh(null)} />}
    </div>
  );
}

// ── Context menu ──────────────────────────────────────────────────────────────

function HDXXDropdownSelectorPopover({
  soThuLy,
  chuToaName,
  initialSelected,
  onClose,
  onSave,
}: {
  soThuLy: string;
  chuToaName: string;
  initialSelected: string[];
  onClose: () => void;
  onSave: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([...initialSelected]);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const filteredJudges = DANH_SACH_THAM_PHAN.filter(
    j =>
      j.ten.toLowerCase().includes(search.toLowerCase()) ||
      j.chucVu.toLowerCase().includes(search.toLowerCase()) ||
      j.donVi.toLowerCase().includes(search.toLowerCase())
  );

  const allNonPresidingJudges = DANH_SACH_THAM_PHAN.filter(j => j.ten !== chuToaName);
  // LỆCH (SRS): Hội đồng toàn thể = đúng 11 TP (chủ tọa + 10 thành viên), danh sách cố định
  const hoiDongToanThe = allNonPresidingJudges.slice(0, SO_TP_HOI_DONG_TOAN_THE - 1);
  const isAllSelected =
    selected.length === hoiDongToanThe.length && hoiDongToanThe.every(j => selected.includes(j.ten));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(hoiDongToanThe.map(j => j.ten));
    }
  };

  const selectPreset5 = () => {
    const preset4 = allNonPresidingJudges.slice(0, 4).map(j => j.ten);
    setSelected(preset4);
  };

  const toggleOne = (name: string) => {
    if (name === chuToaName) return; // Presiding judge is fixed
    setSelected(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 4,
        width: 380,
        zIndex: 1500,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
        border: "1px solid #cbd5e1",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
        textAlign: "left" as const,
      }}
    >
      {/* Header Dropdown */}
      <div style={{ padding: "10px 12px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>
          Chọn Thẩm phán thành viên HĐXX
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Quick Mode Controls */}
      <div style={{ padding: "8px 12px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={toggleAll}
            style={{
              flex: 1,
              padding: "6px 10px",
              background: isAllSelected ? "#dbeafe" : "#fff",
              border: `1px solid ${isAllSelected ? "#2563eb" : BORDER}`,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              color: isAllSelected ? "#1e40af" : TEXT,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            🏛️ Hội đồng toàn thể (11 TP)
          </button>
          <button
            type="button"
            onClick={() => setSelected(allNonPresidingJudges.slice(0, 4).map(j => j.ten))}
            style={{
              padding: "6px 10px",
              background: selected.length === 4 ? "#eff6ff" : "#fff",
              border: `1px solid ${selected.length === 4 ? "#2563eb" : BORDER}`,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: selected.length === 4 ? "#1e40af" : TEXT,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            HĐ 5 thẩm phán
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, fontFamily: F }}>
          <span style={{ color: isAllSelected ? "#15803d" : "#1e40af", fontWeight: 700 }}>
            {isAllSelected ? "✓ Hội đồng toàn thể – 11 thẩm phán (Chủ tọa: Chánh án TANDTC)" : selected.length === 4 ? "✓ Hội đồng 5 thẩm phán" : `Đã chọn: ${selected.length} thành viên`}
          </span>
          <span style={{ color: MUTED }}>Tổng: {selected.length + 1} Thẩm phán</span>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: "6px 12px", background: "#f9fafb", borderBottom: `1px solid ${BORDER}` }}>
        <input
          placeholder="Tìm tên Thẩm phán..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box" }}
        />
      </div>

      {/* Judges checklist */}
      <div style={{ maxHeight: 210, overflowY: "auto", padding: "6px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredJudges.map(j => {
          const isPresiding = j.ten === chuToaName;
          const isChecked = selected.includes(j.ten);
          const isDisabled = isPresiding;
          return (
            <div
              key={j.id}
              onClick={() => {
                if (!isDisabled) toggleOne(j.ten);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 4,
                border: `1px solid ${isPresiding ? "#fde68a" : isChecked ? "#bfdbfe" : "#f1f5f9"}`,
                background: isPresiding ? "#fffbeb" : isChecked ? "#eff6ff" : "#fff",
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked || isPresiding}
                disabled={isDisabled}
                onChange={() => { }}
                style={{ cursor: isDisabled ? "not-allowed" : "pointer", width: 14, height: 14, accentColor: isPresiding ? "#92400e" : "#2563eb" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: isChecked ? 700 : 500, color: isPresiding ? "#92400e" : isChecked ? "#1e40af" : TEXT }}>
                    {j.ten}
                  </span>
                  {isPresiding && (
                    <span style={{ fontSize: 9, padding: "0 4px", background: "#fef3c7", color: "#92400e", borderRadius: 2, fontWeight: 700 }}>
                      CHỦ TỌA
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {j.chucVu}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 12px", background: "#fafafa", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setSelected([])}
          style={{ background: "none", border: "none", color: RED, cursor: "pointer", fontSize: 11, padding: 0 }}
        >
          Xóa tất cả ({selected.length})
        </button>
        <button
          onClick={() => {
            onSave(selected);
            onClose();
          }}
          style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        >
          Áp dụng ({selected.length} TV)
        </button>
      </div>
    </div>
  );
}

export function XemBieuMauChuongTrinhWordModal({
  userRole = "hinh-su",
  rows = [],
  lichXXInfo,
  soVanBan,
  onClose,
}: {
  userRole?: string;
  rows?: any[];
  lichXXInfo?: { ngayXX: string; thu: string; gioXX: string; phongXX: string };
  soVanBan?: string;
  onClose: () => void;
}) {
  // Lọc dữ liệu theo đúng phân quyền vai trò được chọn
  const displayModalRows = rows.filter(r => {
    const isHinhSu = (r.soBA && r.soBA.includes("HS")) || (r.qhpl && (r.qhpl.includes("BLHS") || r.qhpl.includes("Tội"))) || (r.tenVuAn && (r.tenVuAn.includes("BLHS") || r.tenVuAn.includes("Tội")));
    const isDanSu = (r.soBA && r.soBA.includes("DS")) || (r.qhpl && r.qhpl.includes("hợp đồng")) || (r.tenVuAn && r.tenVuAn.includes("hợp đồng"));
    const isHanhChinh = (r.soBA && r.soBA.includes("HC")) || (r.qhpl && r.qhpl.includes("Khiếu kiện")) || (r.tenVuAn && r.tenVuAn.includes("Khiếu kiện"));

    if (userRole === "hinh-su") return isHinhSu;
    if (userRole === "dan-su") return isDanSu || (!isHinhSu && !isHanhChinh);
    if (userRole === "hanh-chinh") return isHanhChinh;
    return true;
  });

  // Tập hợp danh sách tất cả các Thẩm phán (Chủ tọa + Thành viên HĐXX) trong danh sách
  const allJudgesSet = new Set<string>();
  displayModalRows.forEach(r => {
    const chuToa = r.chuToa || r.tp;
    if (chuToa && chuToa !== "–") allJudgesSet.add(chuToa);
    if (r.hdxxThanhVien && Array.isArray(r.hdxxThanhVien)) {
      r.hdxxThanhVien.forEach((tv: string) => {
        if (tv && tv !== "–") allJudgesSet.add(tv);
      });
    }
  });
  const danhSachThanhVienHDXX = Array.from(allJudgesSet).length > 0
    ? Array.from(allJudgesSet).join(", ")
    : "Trần Hồng Hà, Ngô Hồng Phúc, Lê Thanh Phong, Nguyễn Văn Cường, Lê Văn Minh";

  const workingTimeText = lichXXInfo
    ? `${lichXXInfo.thu} – Ngày ${lichXXInfo.ngayXX} (${lichXXInfo.gioXX})`
    : "Thứ Sáu – Ngày 05/6/2026 (buổi sáng từ 08h00 đến 12h00, buổi chiều từ 14h00 đến 17h30)";

  const getVuInfo = (role: string) => {
    if (role === "hinh-su") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA I",
        subTitle: "Vụ Giám đốc, kiểm tra I",
        loaiAn: "Hình sự",
        hauTo: "Vụ GĐKT I",
      };
    }
    if (role === "dan-su") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA II",
        subTitle: "Vụ Giám đốc, kiểm tra II",
        loaiAn: "Dân sự",
        hauTo: "Vụ GĐKT II",
      };
    }
    if (role === "hanh-chinh") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA IV",
        subTitle: "Vụ Giám đốc, kiểm tra IV",
        loaiAn: "Hành chính",
        hauTo: "Vụ GĐKT IV",
      };
    }
    return {
      headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA",
      subTitle: "các Vụ Giám đốc, kiểm tra",
      loaiAn: "Hình sự, Dân sự và Hành chính",
      hauTo: "Vụ GĐKT",
    };
  };

  const vuInfo = getVuInfo(userRole);

  const exportToWord = () => {
    const content = document.getElementById("word-doc-preview-area")?.innerHTML;
    if (!content) return;

    const htmlDoc = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Chương trình làm việc HĐXX</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; text-align: left; vertical-align: top; }
          th { font-weight: bold; background-color: #f2f2f2; text-align: center; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chuong_Trinh_Lam_Viec_HDXX_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1400, display: "flex", flexDirection: "column" }}>
      {/* Top bar (Word style) */}
      <div style={{ background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 44, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={18} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>
            📄 Biểu mẫu: Chương trình làm việc Hội đồng xét xử năm Thẩm phán TANDTC ({vuInfo.loaiAn})
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={exportToWord}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            <Printer size={14} /> Tải file Word (.docx)
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            🖨️ In văn bản
          </button>
          <button
            onClick={onClose}
            style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Ribbon toolbar mock */}
      <div style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, padding: "6px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 12, fontFamily: F, flexShrink: 0 }}>
        <span style={{ fontWeight: 700, color: "#1e40af" }}>Times New Roman</span>
        <span style={{ color: MUTED }}>|</span>
        <span>Cỡ chữ: <b>13pt</b></span>
        <span style={{ color: MUTED }}>|</span>
        <span style={{ color: "#166534", fontWeight: 600 }}>✓ Định dạng chuẩn văn bản TANDTC</span>
      </div>

      {/* A4 Paper Container */}
      <div style={{ flex: 1, overflowY: "auto", background: "#e2e8f0", padding: "30px 20px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            padding: "25mm 20mm",
            boxSizing: "border-box",
            fontFamily: "'Times New Roman', Times, serif",
            color: "#000",
            lineHeight: 1.4,
          }}
        >
          <div id="word-doc-preview-area">
            {/* Header 2 columns */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ width: "45%", textAlign: "center", verticalAlign: "top", border: "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: "bold" }}>{vuInfo.headerTitle}</div>
                    <div style={{ fontSize: 11, marginTop: 3 }}>Số: {soVanBan ? <b>{soVanBan}/2026/{vuInfo.hauTo}</b> : `......./2026/${vuInfo.hauTo}`}</div>
                    <div style={{ borderBottom: "1px solid #000", width: 120, margin: "6px auto 0" }} />
                  </td>
                  <td style={{ width: "55%", textAlign: "center", verticalAlign: "top", border: "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: "bold", fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ borderBottom: "1px solid #000", width: 160, margin: "6px auto 0" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 8 }}>Hà Nội, ngày 05 tháng 06 năm 2026</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Document Title */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: "bold", fontSize: 15, textTransform: "uppercase", marginBottom: 4 }}>
                CHƯƠNG TRÌNH LÀM VIỆC
              </div>
              <div style={{ fontWeight: "bold", fontSize: 14, textTransform: "uppercase", marginBottom: 6 }}>
                CỦA HỘI ĐỒNG XÉT XỬ GỒM NĂM THẨM PHÁN TÒA ÁN NHÂN DÂN TỐI CAO
              </div>
              <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 6 }}>
                Xét xử các vụ án {vuInfo.loaiAn} do {vuInfo.subTitle} trình
              </div>
              <div style={{ fontSize: 12, fontStyle: "italic", marginBottom: 4 }}>
                Hội đồng xét xử gồm các Thẩm phán: <b>{danhSachThanhVienHDXX}</b>
              </div>
              <div style={{ fontSize: 12, fontStyle: "italic" }}>
                Thời gian làm việc: <b>{workingTimeText}</b>
              </div>
            </div>

            {/* Table - khớp với bảng bên ngoài, không có cột Thẩm phán thành viên HĐXX */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, border: "1px solid #000" }}>
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "5%", fontWeight: "bold" }}>STT</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: userRole === "hinh-su" ? "22%" : "18%", fontWeight: "bold" }}>
                    Thông tin bản án/ Tòa án xét xử
                  </th>
                  {userRole !== "hinh-su" && (
                    <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "20%", fontWeight: "bold" }}>
                      Quan hệ pháp luật
                    </th>
                  )}
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: (userRole === "hinh-su" || userRole === "vu-1") ? "18%" : "15%", fontWeight: "bold" }}>
                    {(userRole === "hinh-su" || userRole === "vu-1")
                      ? "Người khiếu nại"
                      : (userRole === "dan-su" || userRole === "vu-2" || userRole === "vu-3")
                        ? "Nguyên đơn"
                        : "Người khởi kiện"}
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: (userRole === "hinh-su" || userRole === "vu-1") ? "18%" : "15%", fontWeight: "bold" }}>
                    {(userRole === "hinh-su" || userRole === "vu-1")
                      ? "Bị cáo"
                      : (userRole === "dan-su" || userRole === "vu-2" || userRole === "vu-3")
                        ? "Bị đơn"
                        : "Người bị kiện"}
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "18%", fontWeight: "bold" }}>
                    Kháng nghị
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "15%", fontWeight: "bold" }}>
                    Thẩm phán Chủ tọa phiên tòa
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayModalRows.length === 0 ? (
                  <tr>
                    <td colSpan={(userRole === "hinh-su" || userRole === "vu-1") ? 6 : 7} style={{ border: "1px solid #000", padding: 20, textAlign: "center", fontStyle: "italic" }}>
                      Không có vụ án nào trong chương trình làm việc
                    </td>
                  </tr>
                ) : (
                  displayModalRows.map((r, i) => {
                    const partyInfo = getVuXetXuPartyInfo(r, userRole as any);
                    return (
                      <tr key={i}>
                        <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", fontWeight: "bold" }}>{i + 1}</td>
                        <td style={{ border: "1px solid #000", padding: "6px 6px" }}>
                          <div><b>Số BA: {formatSoBA(r.soBA)}</b></div>
                          <div>Ngày: {r.ngayBA}</div>
                          <div style={{ color: "#444" }}>Tại: {r.tai || r.toa}</div>
                        </td>
                        {(userRole !== "hinh-su" && userRole !== "vu-1") && (
                          <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.qhpl || r.tenVuAn}</td>
                        )}
                        <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{partyInfo.val1 || r.nguoiKhoiKien || r.ndkn}</td>
                        <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{partyInfo.val2 || r.nguoiBiKien || r.biCao || r.ndd}</td>
                        <td style={{ border: "1px solid #000", padding: "6px 6px" }}>
                          <div>Số KN: <b>{r.soKhangNghi || r.soKN || "28/QĐ-VKSTC-V1"}</b></div>
                          <div>Ngày: {r.ngayKhangNghi || r.ngayKN || "27/07/2026"}</div>
                          {(r.nguoiKhangNghi || r.loaiKhangNghi) && <div style={{ color: "#444" }}>{r.nguoiKhangNghi || r.loaiKhangNghi}</div>}
                        </td>
                        <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", fontWeight: "bold" }}>{r.chuToa || r.tp || "–"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


type ModalVuAnRow = {
  stt: number;
  maVuAn?: string;
  soThuLy: string;
  soBA: string;
  ngayBA: string;
  tai: string;
  toa?: string;
  qhpl: string;
  tenVuAn?: string;
  nguoiKhoiKien: string;
  ndkn?: string;
  nguoiBiKien: string;
  biCao?: string;
  ndd?: string;
  soKhangNghi: string;
  soKN?: string;
  ngayKhangNghi: string;
  ngayKN?: string;
  nguoiKhangNghi: string;
  loaiKhangNghi?: string;
  chuToa: string;
  tp?: string;
  chuToaChucVu: string;
  hdxxThanhVien: string[];
  hdxxTen: string;
};

const MODAL_ROWS: ModalVuAnRow[] = [
  // ── Hình sự ──
  {
    stt: 1,
    maVuAn: "VA26-002148",
    soThuLy: "54681978",
    soBA: "5469/2026/HS-ST",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tội cố ý gây thương tích (BLHS)",
    nguoiKhoiKien: "Trần Văn Hải",
    nguoiBiKien: "Nguyễn Đơn Hải",
    soKhangNghi: "28/QĐ-VKSTC-V1",
    ngayKhangNghi: "27/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 2,
    maVuAn: "VA26-002012",
    soThuLy: "54681923",
    soBA: "54681139/2026/HS-PT",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tội cố ý gây thương tích hoặc gây tổn hại cho sức khỏe",
    nguoiKhoiKien: "Phan Văn Hùng",
    nguoiBiKien: "Nguyễn Văn Đạt",
    soKhangNghi: "11/QĐ-VKSTC-V1",
    ngayKhangNghi: "11/11/2024",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Biên Thùy",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 3,
    maVuAn: "VA26-001201",
    soThuLy: "54681813",
    soBA: "18/2026/HS-ST",
    ngayBA: "08/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tham ô tài sản nhà nước đặc biệt nghiêm trọng",
    nguoiKhoiKien: "Đỗ Thành Công",
    nguoiBiKien: "Phan Kim Ngân",
    soKhangNghi: "05/QĐ-VKSTC-V1",
    ngayKhangNghi: "01/05/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh", "Phạm Văn Nam"],
    hdxxTen: "Hội đồng toàn thể",
  },
  // ── Dân sự ──
  {
    stt: 4,
    maVuAn: "VA26-001543",
    soThuLy: "54681543",
    soBA: "21/2026/DS-ST",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất",
    nguoiKhoiKien: "Ngô Mai Trang",
    nguoiBiKien: "Phạm Văn Thành, Lê Thị Nhải",
    soKhangNghi: "15/QĐ-VKSTC-V2",
    ngayKhangNghi: "15/06/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 5,
    maVuAn: "VA26-002300",
    soThuLy: "54682300",
    soBA: "77/2026/DS-PT",
    ngayBA: "28/06/2026",
    tai: "Tòa án nhân dân TP Đà Nẵng",
    qhpl: "Tranh chấp thừa kế tài sản và hủy GCN QSDĐ",
    nguoiKhoiKien: "Lê Văn Hùng",
    nguoiBiKien: "Lê Thị Hồng",
    soKhangNghi: "33/QĐ-VKSTC-V2",
    ngayKhangNghi: "05/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Lê Thị Thu Hiển", "Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  // ── Hành chính ──
  {
    stt: 6,
    maVuAn: "VA26-000654",
    soThuLy: "54681800",
    soBA: "0807/2026/HC-ST",
    ngayBA: "08/07/2025",
    tai: "Tòa án nhân dân quận Ninh Kiều",
    qhpl: "Khiếu kiện quyết định xử phạt VPHC trong quản lý đất đai",
    nguoiKhoiKien: "NGHIÊM THỊ XUÂN",
    nguoiBiKien: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU",
    soKhangNghi: "20/QĐ-VKSTC-V4",
    ngayKhangNghi: "20/03/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Lê Thị Thu Hiển", "Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh"],
    hdxxTen: "Hội đồng toàn thể",
  },
  {
    stt: 7,
    maVuAn: "VA26-002613",
    soThuLy: "54682613",
    soBA: "18/2026/HC-ST",
    ngayBA: "08/07/2026",
    tai: "Tòa án nhân dân cấp cao tại Hà Nội",
    qhpl: "Khiếu kiện quyết định thu hồi đất và cưỡng chế GPMB",
    nguoiKhoiKien: "Đỗ Thành Công",
    nguoiBiKien: "Ủy ban nhân dân tỉnh Bắc Ninh",
    soKhangNghi: "42/QĐ-VKSTC-V4",
    ngayKhangNghi: "09/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
];

function ThemVuXetXuModal({ userRole = "hinh-su", onClose }: { userRole?: string; onClose: () => void }) {
  const [rows, setRows] = useState(MODAL_ROWS);
  const [selectingRowKey, setSelectingRowKey] = useState<string | null>(null);
  const [showBieuMauWord, setShowBieuMauWord] = useState(false);
  const [showLichXXModal, setShowLichXXModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [hasSelectedLich, setHasSelectedLich] = useState(false);
  const [isCapSo, setIsCapSo] = useState(false);
  const [soVanBan, setSoVanBan] = useState("");
  const [lichXXInfo, setLichXXInfo] = useState({
    ngayXX: "05/06/2026",
    thu: "Thứ Sáu",
    gioXX: "Buổi sáng: 08h00 - 12h00; Buổi chiều: 14h00 - 17h30",
    phongXX: "Phòng xét xử số 1",
  });

  const getRowKey = (r: ModalVuAnRow) => r.maVuAn || r.soBA || String(r.stt);

  const displayRows = rows.filter(r => {
    const isHinhSu = r.soBA.includes("HS") || r.qhpl.includes("BLHS") || r.qhpl.includes("Tội");
    if (userRole === "hinh-su") return isHinhSu;
    if (userRole === "dan-su") return !isHinhSu;
    return true;
  });

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px", whiteSpace: "nowrap" as const };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const trangThaiBadge = (key: string) => {
    if (key === "chua-xx") return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff", whiteSpace: "nowrap" as const }}>CHƯA XÉT XỬ</span>;
    if (key === "da-xx") return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff", whiteSpace: "nowrap" as const }}>ĐÃ XÉT XỬ</span>;
    return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #2563eb`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#2563eb", background: "#eff6ff", whiteSpace: "nowrap" as const }}>RÚT KHÁNG NGHỊ</span>;
  };

  const btn = (label: string, bg: string, color: string, border: string, onClick?: () => void) => (
    <button onClick={onClick ?? onClose} style={{ padding: "7px 18px", background: bg, color, border: `1px solid ${border}`, borderRadius: 4, fontSize: 13, fontFamily: F, fontWeight: 500, cursor: "pointer" }}>
      {label}
    </button>
  );

  const CHANH_AN_NAME = "Lê Thị Thu Hiển";

  const getHDXXName = (memberCount: number) => {
    if (memberCount === 0) return "Chưa chọn HĐXX";
    if (memberCount === 4) return "Hội đồng 5 thẩm phán";
    if (memberCount >= SO_TP_HOI_DONG_TOAN_THE - 1) return "Hội đồng toàn thể";
    return `Hội đồng ${memberCount + 1} thẩm phán`;
  };

  const updateJudgesForRow = (rowKey: string, newJudges: string[]) => {
    const isToanThe = newJudges.length >= SO_TP_HOI_DONG_TOAN_THE - 1;
    const chanhAnObj = DANH_SACH_THAM_PHAN.find(j => j.ten === CHANH_AN_NAME) || { chucVu: "Chánh án TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" };

    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;

        // Nếu chọn Hội đồng toàn thể, Chủ tọa tự động đổi thành Chánh án TAND tối cao
        const targetChuToa = isToanThe ? CHANH_AN_NAME : r.chuToa;
        const targetChuToaChucVu = isToanThe ? `${chanhAnObj.chucVu} (${chanhAnObj.donVi})` : r.chuToaChucVu;

        let finalMembers = isToanThe
          ? DANH_SACH_THAM_PHAN.filter(j => j.ten !== CHANH_AN_NAME).slice(0, SO_TP_HOI_DONG_TOAN_THE - 1).map(j => j.ten)
          : newJudges.filter(name => name !== targetChuToa);

        return {
          ...r,
          chuToa: targetChuToa,
          chuToaChucVu: targetChuToaChucVu,
          hdxxThanhVien: finalMembers,
          hdxxTen: getHDXXName(finalMembers.length),
        };
      })
    );
  };

  const updateChuToaForRow = (rowKey: string, judgeName: string) => {
    const judgeObj = DANH_SACH_THAM_PHAN.find(j => j.ten === judgeName);
    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;
        const updatedMembers = r.hdxxThanhVien.filter(name => name !== judgeName);
        return {
          ...r,
          chuToa: judgeName,
          chuToaChucVu: judgeObj ? `${judgeObj.chucVu} (${judgeObj.donVi})` : r.chuToaChucVu,
          hdxxThanhVien: updatedMembers,
          hdxxTen: getHDXXName(updatedMembers.length),
        };
      })
    );
  };

  const removeJudgeFromRow = (rowKey: string, judgeName: string) => {
    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;
        const updated = r.hdxxThanhVien.filter(name => name !== judgeName);
        return {
          ...r,
          hdxxThanhVien: updated,
          hdxxTen: getHDXXName(updated.length),
        };
      })
    );
  };

  const removeRowFromList = (rowKey: string) => {
    setRows(prev => prev.filter(r => getRowKey(r) !== rowKey));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "95vw", maxWidth: 1280, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18, color: RED }}>⚠</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách vụ xét xử đã chọn</span>

          {/* Nút Chọn Lịch Xét Xử */}
          <button
            onClick={() => setShowLichXXModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: hasSelectedLich ? "#f0fdf4" : "#eff6ff",
              color: hasSelectedLich ? "#166534" : "#1e40af",
              border: `1px solid ${hasSelectedLich ? "#bbf7d0" : "#93c5fd"}`,
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: F,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Calendar size={14} color={hasSelectedLich ? "#166534" : "#2563eb"} />
            {hasSelectedLich ? `✓ Đã chọn lịch: ${lichXXInfo.ngayXX}` : "Chọn lịch xét xử"}
          </button>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
        </div>

        {/* Status bar Lịch xét xử & Cấp số */}
        {(hasSelectedLich || isCapSo) && (
          <div style={{ padding: "8px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0, fontSize: 12, fontFamily: F }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {hasSelectedLich && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "#1e40af", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, border: "1px solid #bfdbfe", fontSize: 11 }}>
                  📅 Lịch xét xử: {lichXXInfo.thu} – {lichXXInfo.ngayXX}
                </span>
              )}
              {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
              {hasSelectedLich && <span><b>Phòng:</b> {lichXXInfo.phongXX}</span>}
              {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
              {hasSelectedLich && <span style={{ color: "#475569" }}><b>Thời gian:</b> {lichXXInfo.gioXX}</span>}
              {isCapSo && (
                <>
                  {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "2px 8px", borderRadius: 4, border: "1px solid #86efac", fontSize: 11 }}>
                    📄 Đã cấp số văn bản: {soVanBan}/2026/Vụ GĐKT
                  </span>
                </>
              )}
            </div>
            {hasSelectedLich && (
              <button
                onClick={() => setShowLichXXModal(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, fontWeight: 600, textDecoration: "underline", padding: 0 }}
              >
                Sửa lịch ✎
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
            <thead>
              <tr>
                {userRole === "hinh-su" || userRole === "vu-1"
                  ? ["STT", "Thông tin bản án/ Tòa án xét xử", "Người khiếu nại", "Bị cáo", "Kháng nghị", "Thẩm phán chủ tọa phiên tòa", "Thẩm phán Hội đồng xét xử", "Thao tác"].map(h => (<th key={h} style={TH}>{h}</th>))
                  : userRole === "dan-su" || userRole === "vu-2" || userRole === "vu-3"
                    ? ["STT", "Thông tin bản án/ Tòa án xét xử", "Quan hệ pháp luật", "Nguyên đơn", "Bị đơn", "Kháng nghị", "Thẩm phán chủ tọa phiên tòa", "Thẩm phán Hội đồng xét xử", "Thao tác"].map(h => (<th key={h} style={TH}>{h}</th>))
                    : ["STT", "Thông tin bản án/ Tòa án xét xử", "Quan hệ pháp luật", "Người khởi kiện", "Người bị kiện", "Kháng nghị", "Thẩm phán chủ tọa phiên tòa", "Thẩm phán Hội đồng xét xử", "Thao tác"].map(h => (<th key={h} style={TH}>{h}</th>))
                }
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={(userRole === "hinh-su" || userRole === "vu-1") ? 8 : 9} style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>
                    Không có vụ án nào trong danh sách
                  </td>
                </tr>
              )}
              {displayRows.map((r, i) => {
                const rowKey = getRowKey(r);
                const partyInfo = getVuXetXuPartyInfo(r, userRole as any);
                return (
                  <tr key={rowKey} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                    {/* STT */}
                    <td style={{ ...TD, textAlign: "center" as const, fontWeight: 700, color: TEXT, fontSize: 12 }}>{i + 1}</td>

                    {/* Thông tin BA/QĐ */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div>Số BA: <b>{formatSoBA(r.soBA)}</b></div>
                        <div style={{ color: MUTED }}>Ngày: {r.ngayBA}</div>
                        <div style={{ color: MUTED }}>Tại: {r.tai}</div>
                      </div>
                    </td>

                    {/* Quan hệ pháp luật (chỉ hiện khi Dân sự / Hành chính) */}
                    {(userRole !== "hinh-su" && userRole !== "vu-1") && (
                      <td style={TD}>
                        <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 500, fontFamily: F, lineHeight: 1.6 }}>
                          {r.qhpl}
                        </div>
                      </td>
                    )}

                    {/* Đương sự 1 */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600, color: TEXT }}>
                          {partyInfo.val1 || r.nguoiKhoiKien || r.ndkn}
                        </div>
                      </div>
                    </td>

                    {/* Đương sự 2 */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600, color: TEXT }}>
                          {partyInfo.val2 || r.nguoiBiKien || r.biCao || r.ndd}
                        </div>
                      </div>
                    </td>

                    {/* Kháng nghị */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div>Số KN: <b style={{ color: TEXT }}>{r.soKhangNghi}</b></div>
                        <div>Ngày kháng nghị: <span style={{ color: TEXT }}>{r.ngayKhangNghi}</span></div>
                        <div>Người kháng nghị: <span style={{ color: TEXT }}>{r.nguoiKhangNghi}</span></div>
                      </div>
                    </td>

                    {/* Thẩm phán chủ tọa phiên tòa */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6, minWidth: 180 }}>
                        <select
                          value={r.chuToa}
                          onChange={e => updateChuToaForRow(rowKey, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "5px 8px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#1e3a8a",
                            border: `1px solid #93c5fd`,
                            borderRadius: 4,
                            background: "#eff6ff",
                            fontFamily: F,
                            outline: "none",
                            cursor: "pointer",
                            boxSizing: "border-box" as const,
                            marginBottom: 3,
                          }}
                        >
                          {!DANH_SACH_THAM_PHAN.some(j => j.ten === r.chuToa) && (
                            <option value={r.chuToa}>{r.chuToa} (TP được phân công)</option>
                          )}
                          {DANH_SACH_THAM_PHAN.map(j => (
                            <option key={j.id} value={j.ten}>
                              {j.ten} – {j.chucVu}
                            </option>
                          ))}
                        </select>

                        <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.3 }}>
                          {r.chuToaChucVu}
                        </div>
                      </div>
                    </td>

                    {/* Thẩm phán Hội đồng xét xử */}
                    <td style={{ ...TD, position: "relative" as const }}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6, minWidth: 200 }}>
                        <div style={{ marginBottom: 6, position: "relative" }}>
                          <button
                            onClick={() => setSelectingRowKey(selectingRowKey === rowKey ? null : rowKey)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              padding: "5px 8px",
                              background: selectingRowKey === rowKey ? "#eff6ff" : "#fff",
                              color: "#1e3a8a",
                              border: `1px solid ${selectingRowKey === rowKey ? "#2563eb" : "#93c5fd"}`,
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: F,
                              cursor: "pointer",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                              boxSizing: "border-box" as const,
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                              🏛️ {r.hdxxTen}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                              <span style={{ fontSize: 10, padding: "1px 5px", background: "#dbeafe", color: "#1e40af", borderRadius: 3, fontWeight: 600 }}>
                                {(r.hdxxThanhVien || []).length} TV
                              </span>
                              <ChevronDown size={13} style={{ color: "#2563eb", transform: selectingRowKey === rowKey ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
                            </div>
                          </button>

                          {selectingRowKey === rowKey && (
                            <HDXXDropdownSelectorPopover
                              soThuLy={r.soThuLy}
                              chuToaName={r.chuToa}
                              initialSelected={r.hdxxThanhVien || []}
                              onClose={() => setSelectingRowKey(null)}
                              onSave={selected => updateJudgesForRow(rowKey, selected)}
                            />
                          )}
                        </div>

                        {(!r.hdxxThanhVien || r.hdxxThanhVien.length === 0) ? (
                          <div style={{ fontSize: 11, color: MUTED, fontStyle: "italic", padding: "4px 0" }}>
                            Chưa chọn thành viên (Chủ tọa: {r.chuToa})
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {(r.hdxxThanhVien || []).map((tv, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "2px 6px", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                                  <span style={{ color: MUTED, fontSize: 10 }}>•</span>
                                  <span style={{ fontWeight: 500, fontSize: 11 }}>{tv}</span>
                                </div>
                                <button
                                  title={`Xóa ${tv} khỏi Hội đồng`}
                                  onClick={() => removeJudgeFromRow(rowKey, tv)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: "0 2px", fontSize: 13, lineHeight: 1, fontWeight: 700 }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = RED; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thao tác xóa khỏi danh sách */}
                    <td style={{ ...TD, textAlign: "center" as const, verticalAlign: "middle" as const }}>
                      <button
                        title="Xóa vụ án khỏi danh sách trình ký"
                        onClick={() => removeRowFromList(rowKey)}
                        style={{
                          background: "#fef2f2",
                          color: RED,
                          border: `1px solid #fca5a5`,
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F, flex: 1 }}>
            Đã chọn <b style={{ color: TEXT }}>{displayRows.length}</b> vụ án xét xử cho danh sách trình ký.
          </span>
          {btn("Đóng", "#fff", TEXT, BORDER, onClose)}
          {btn("Lưu", RED, "#fff", RED)}
          {isCapSo ? (
            <button
              onClick={() => {
                setIsCapSo(false);
                setSoVanBan("");
              }}
              style={{
                padding: "7px 16px",
                background: "#fff1f2",
                color: "#e11d48",
                border: "1px solid #fca5a5",
                borderRadius: 4,
                fontSize: 13,
                fontFamily: F,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              ✕ Hủy cấp số
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCapSo(true);
                setSoVanBan("128");
              }}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                fontSize: 13,
                fontFamily: F,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Lấy số
            </button>
          )}
          {/* LỆCH (SRS): popup tạo DS tham mưu dùng nút "Trình duyệt" (gửi đồng thời sang
              Công tác lãnh đạo của PCA và màn DS phân công HĐXX), không phải "Trình ký". */}
          {btn("Trình duyệt", RED, "#fff", RED, () => setShowTrinhKyModal(true))}
          {btn("Xem biểu mẫu", "#fff", TEXT, BORDER, () => setShowBieuMauWord(true))}
        </div>
      </div>
      {showLichXXModal && (
        <LichXetXuModal
          onClose={() => setShowLichXXModal(false)}
          onSelectDate={(dateStr) => {
            setHasSelectedLich(true);
            setLichXXInfo(prev => ({
              ...prev,
              ngayXX: dateStr,
              thu: "Thứ Sáu",
            }));
            setShowLichXXModal(false);
          }}
        />
      )}
      {showBieuMauWord && <XemBieuMauChuongTrinhWordModal userRole={userRole} rows={displayRows} lichXXInfo={hasSelectedLich ? lichXXInfo : undefined} soVanBan={isCapSo ? (soVanBan || "128") : undefined} onClose={() => setShowBieuMauWord(false)} />}
      {showTrinhKyModal && <TrinhKyModal onClose={() => setShowTrinhKyModal(false)} />}
    </div>
  );
}

export default function QuanLyVuXetXuView({
  userRole: propUserRole,
  setUserRole: propSetUserRole,
  onGoToThamMuu,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onGoToThamMuu?: () => void;
} = {}) {
  const [internalRole, setInternalRole] = useState<UserRoleType>("vu-1");
  const userRole = propUserRole ?? internalRole;
  const setUserRole = propSetUserRole ?? setInternalRole;
  const [activeTab, setActiveTab] = useState("tat-ca");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [detail, setDetail] = useState<VuXetXuRow | null>(null);
  // THIẾU [TB]: nút "Xem kết quả xét xử" trên hàng danh sách — SRS phần Phân tab
  const [detailInitialTab, setDetailInitialTab] = useState<DetailTab | undefined>(undefined);
  const [showThemModal, setShowThemModal] = useState(false);
  const [showBieuMauMain, setShowBieuMauMain] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // 8 Search Filter states
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fThuocAn, setFThuocAn] = useState("");
  const [fLanhDaoVu, setFLanhDaoVu] = useState("");
  const [fTTV, setFTTV] = useState("");
  const [fQuaHanXX, setFQuaHanXX] = useState("");
  const [showInBaoCao, setShowInBaoCao] = useState(false);
  // THIẾU [Cao]: 12/21 trường tìm kiếm theo SRS Quản lý vụ XX mục A
  const [fNguyenDonBiDon, setFNguyenDonBiDon] = useState("");
  const [fSoThuLyXX, setFSoThuLyXX] = useState("");
  const [fThuLyTuNgay, setFThuLyTuNgay] = useState("");
  const [fThuLyDenNgay, setFThuLyDenNgay] = useState("");
  const [fXetXuTuNgay, setFXetXuTuNgay] = useState("");
  const [fXetXuDenNgay, setFXetXuDenNgay] = useState("");
  const [fTrangThaiXX, setFTrangThaiXX] = useState("");
  const [fThamPhan, setFThamPhan] = useState("");
  const [fHoanTHA, setFHoanTHA] = useState("");
  const [fSoKhangNghi, setFSoKhangNghi] = useState("");
  const [fNgayKhangNghi, setFNgayKhangNghi] = useState("");
  const [fNguoiKhangNghi, setFNguoiKhangNghi] = useState("");
  const [fThamQuyenXX, setFThamQuyenXX] = useState("");
  const [fAnLe, setFAnLe] = useState("");

  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || !userRole;
  const thuocAnOptions = isVu1
    ? ["Án Quốc hội", "Án chỉ đạo", "Án TVTN", "Án tử hình"]
    : ["Án Quốc hội", "Án chỉ đạo"];

  const handleResetFilters = () => {
    setFToaRaBA("");
    setFSoBA("");
    setFNgayBA("");
    setFLoaiAn("");
    setFThuocAn("");
    setFLanhDaoVu("");
    setFTTV("");
    setFQuaHanXX("");
    setFNguyenDonBiDon(""); setFSoThuLyXX(""); setFThuLyTuNgay(""); setFThuLyDenNgay("");
    setFXetXuTuNgay(""); setFXetXuDenNgay(""); setFTrangThaiXX(""); setFThamPhan("");
    setFHoanTHA(""); setFSoKhangNghi(""); setFNgayKhangNghi(""); setFNguoiKhangNghi("");
    setFThamQuyenXX(""); setFAnLe("");
  };

  const inSt: React.CSSProperties = {
    padding: "6px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box" as const,
  };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  const filteredByRole = ROWS.filter(r => {
    const isHinhSu = r.loaiAn === "Hình sự" || r.soBA.includes("HS");
    const isHanhChinh = r.loaiAn === "Hành chính" || r.soBA.includes("HC") || r.tenVuAn.toLowerCase().includes("khiếu kiện");
    const isVu3 = r.loaiAn === "Kinh doanh thương mại" || r.loaiAn === "Phá sản" || r.loaiAn === "Lao động" || r.loaiAn === "Hôn nhân gia đình" || r.loaiAn === "Sở hữu trí tuệ" ||
      r.soBA.includes("KDTM") || r.soBA.includes("HNGĐ") || r.soBA.includes("LĐ") || r.soBA.includes("PS") || r.soBA.includes("SHTT") ||
      r.tenVuAn.toLowerCase().includes("sở hữu trí tuệ") || r.tenVuAn.toLowerCase().includes("vay tài sản") || r.tenVuAn.toLowerCase().includes("thương mại");
    const isDanSu = (r.loaiAn === "Dân sự" || r.soBA.includes("DS")) && !isHinhSu && !isHanhChinh && !isVu3;

    if (userRole === "vu-1" || userRole === "hinh-su") return isHinhSu;
    if (userRole === "vu-2" || userRole === "dan-su") return isDanSu;
    if (userRole === "vu-3") return isVu3;
    if (userRole === "vu-4" || userRole === "hanh-chinh") return isHanhChinh;
    return true;
  });

  const listTabs = [
    { id: "tat-ca", label: "Tất cả", count: filteredByRole.length },
    { id: "chua-xx-chua-ds", label: "Chưa có DS xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-xx-chua-ds").length },
    { id: "chua-xx-da-ds", label: "Đã có DS xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-xx-da-ds").length },
    { id: "chua-thu-ly", label: "Chưa thụ lý xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-thu-ly").length },
    { id: "hoan-xet-xu", label: "Hoãn xét xử", count: filteredByRole.filter(r => r.trangThai === "hoan-xet-xu").length },
    { id: "rut-khang-nghi", label: "Rút kháng nghị", count: filteredByRole.filter(r => r.trangThai === "rut-khang-nghi").length },
    { id: "da-xx", label: "Đã xét xử", count: filteredByRole.filter(r => r.trangThai === "da-xx").length },
    { id: "chuyen-tham-quyen", label: "Chuyển thẩm quyền", count: filteredByRole.filter(r => r.trangThai === "chuyen-tham-quyen").length },
  ];

  const filtered = filteredByRole.filter(r => {
    // 1. Lọc theo Tab trạng thái
    if (activeTab !== "tat-ca" && r.trangThai !== activeTab) return false;

    // 2. Lọc theo 8 tiêu chí
    if (fToaRaBA && !r.toa.toLowerCase().includes(fToaRaBA.toLowerCase())) return false;
    if (fSoBA && !r.soBA.toLowerCase().includes(fSoBA.toLowerCase())) return false;
    if (fNgayBA && !r.ngayBA.includes(fNgayBA)) return false;
    if (fLoaiAn && r.loaiAn !== fLoaiAn) return false;
    if (fThuocAn && (r as any).tag && !(r as any).tag.includes(fThuocAn.toLowerCase())) return false;
    if (fLanhDaoVu && !r.ldv.toLowerCase().includes(fLanhDaoVu.toLowerCase())) return false;
    if (fTTV && !r.ttv.toLowerCase().includes(fTTV.toLowerCase())) return false;
    if (fQuaHanXX === "Quá hạn" && !(r as any).isQuaHan) return false;
    if (fQuaHanXX === "Không quá hạn" && (r as any).isQuaHan) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (detail) return <ChiTietVuXetXuView row={detail} userRole={userRole} initialTab={detailInitialTab} onBack={() => { setDetail(null); setDetailInitialTab(undefined); }} onGoToThamMuu={onGoToThamMuu} />;

  return (
    <>
      {showThemModal && <ThemVuXetXuModal userRole={userRole} onClose={() => setShowThemModal(false)} />}
      {showBieuMauMain && <XemBieuMauChuongTrinhWordModal userRole={userRole} rows={filtered} onClose={() => setShowBieuMauMain(false)} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
          Trang chủ › Quản lý án GĐT/TT › Quản lý xét xử GĐT › Danh sách vụ xét xử
        </div>

        {/* Title + Phân quyền tài khoản + tabs */}
        <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Quản lý vụ án xét xử</h2>

            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, overflowX: "auto" as const }}>
            {listTabs.map(t => {
              const active = t.id === activeTab;
              return (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setPage(1); }}
                  style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" as const }}>
                  {t.label}{" "}
                  <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter - 8 trường tìm kiếm chuẩn */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px", flexShrink: 0, fontFamily: F }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Hàng 1 (1-4): Tòa ra BA/QĐ | Số BA/QĐ | Ngày BA/QĐ | Loại án */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
              {/* 1. Tòa ra BA/QĐ */}
              <div>
                <label style={labelStyle}>Tòa ra BA/QĐ</label>
                <select
                  value={fToaRaBA}
                  onChange={(e) => setFToaRaBA(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  {DANH_SACH_TOA_AN_FILTER.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* 2. Số BA/QĐ */}
              <div>
                <label style={labelStyle}>Số BA/QĐ</label>
                <input
                  placeholder="Nhập số BA/QĐ"
                  value={fSoBA}
                  onChange={(e) => setFSoBA(e.target.value)}
                  style={inSt}
                />
              </div>

              {/* 3. Ngày BA/QĐ */}
              <div>
                <label style={labelStyle}>Ngày BA/QĐ</label>
                <div style={{ position: "relative" }}>
                  <input
                    placeholder="dd/mm/yyyy"
                    value={fNgayBA}
                    onChange={(e) => setFNgayBA(e.target.value)}
                    style={inSt}
                  />
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* 4. Loại án */}
              <div>
                <label style={labelStyle}>Loại án</label>
                <select
                  value={fLoaiAn}
                  onChange={(e) => setFLoaiAn(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  {LOAI_AN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng 2 (5-8): Thuộc án | Lãnh đạo vụ | Thẩm tra viên | Quá hạn xét xử */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
              {/* 5. Thuộc án */}
              <div>
                <label style={labelStyle}>Thuộc án</label>
                <select
                  value={fThuocAn}
                  onChange={(e) => setFThuocAn(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  {thuocAnOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 6. Lãnh đạo vụ */}
              <div>
                <label style={labelStyle}>Lãnh đạo vụ</label>
                <select
                  value={fLanhDaoVu}
                  onChange={(e) => setFLanhDaoVu(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  {DANH_SACH_LANH_DAO_FILTER.map((ld) => (
                    <option key={ld} value={ld}>{ld}</option>
                  ))}
                </select>
              </div>

              {/* 7. Thẩm tra viên */}
              <div>
                <label style={labelStyle}>Thẩm tra viên</label>
                <select
                  value={fTTV}
                  onChange={(e) => setFTTV(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  {DANH_SACH_TTV_FILTER.map((ttv) => (
                    <option key={ttv} value={ttv}>{ttv}</option>
                  ))}
                </select>
              </div>

              {/* 8. Quá hạn xét xử */}
              <div>
                <label style={labelStyle}>Quá hạn xét xử</label>
                <select
                  value={fQuaHanXX}
                  onChange={(e) => setFQuaHanXX(e.target.value)}
                  style={selSt}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Không quá hạn">Không quá hạn</option>
                  <option value="Quá hạn">Quá hạn</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Số kháng nghị</label>
                <input value={fSoKhangNghi} onChange={e => setFSoKhangNghi(e.target.value)} placeholder="Nhập số kháng nghị" style={inSt} />
              </div>
              <div>
                <label style={labelStyle}>Ngày kháng nghị</label>
                <input type="date" value={fNgayKhangNghi} onChange={e => setFNgayKhangNghi(e.target.value)} style={inSt} />
              </div>
              <div>
                <label style={labelStyle}>Người kháng nghị</label>
                <select value={fNguoiKhangNghi} onChange={e => setFNguoiKhangNghi(e.target.value)} style={selSt}>
                  <option value="">– Tất cả –</option>
                  <option>Chánh án Tòa án nhân dân tối cao</option>
                  <option>Viện trưởng Viện kiểm sát nhân dân tối cao</option>
                  <option>Chánh án Tòa án nhân dân cấp tỉnh</option>
                  <option>Viện trưởng Viện kiểm sát nhân dân cấp tỉnh</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Thẩm quyền xét xử</label>
                <select value={fThamQuyenXX} onChange={e => setFThamQuyenXX(e.target.value)} style={selSt}>
                  <option value="">– Tất cả –</option>
                  <option>Ủy ban Thẩm phán TAND cấp cao</option>
                  <option>Hội đồng Thẩm phán TAND tối cao</option>
                  <option>Tòa chuyên trách TAND cấp cao</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Án lệ áp dụng</label>
                <input value={fAnLe} onChange={e => setFAnLe(e.target.value)} placeholder="Nhập số án lệ" style={inSt} />
              </div>
            </div>

            {/* Filter Footer Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
              <button
                onClick={() => alert("Đang lọc danh sách vụ xét xử GĐT...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: RED,
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

        {/* Action bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ flex: 1 }} />
          {/* <button onClick={() => setShowBieuMauMain(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#1e40af", border: `1px solid #93c5fd`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <FileText size={13} /> Xem biểu mẫu Word
          </button> */}
          <button onClick={() => setShowThemModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            Tạo danh sách vụ xét xử
          </button>
          {/* THIẾU [Cao]: In báo cáo (2 biểu mẫu + hộp tiêu chí in + tiêu đề BC tự sinh) */}
          <button onClick={() => setShowInBaoCao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In báo cáo
          </button>
          {/* THỪA so với SRS – giữ lại, chờ Lead xác nhận */}
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> Xuất Excel
          </button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" as const }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 36 }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH_STYLE}><input type="checkbox" /></th>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>THÔNG TIN VỤ XÉT XỬ</th>
                <th style={TH_STYLE}>THÔNG TIN BẢN ÁN</th>
                <th style={TH_STYLE}>PHÂN CÔNG</th>
                <th style={TH_STYLE}>TRẠNG THÁI</th>
                <th style={{ ...TH_STYLE, textAlign: "center" as const }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
              )}
              {paginated.map((row, idx) => (
                <tr key={row.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                  onClick={() => setDetail(row)}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" style={{ cursor: "pointer" }} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" as const, color: MUTED, fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                  {/* LỆCH: cột "Thông tin vụ xét xử" theo SRS – Kháng nghị, Người KN, gạch ngang, Số & ngày thụ lý XX */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                        <b>Kháng nghị:</b> {row.soQD || "–"}{row.ngayQD ? ` – ${row.ngayQD}` : ""}
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>
                        <b>Người KN:</b> {row.nguoiKhangNghi || "Viện trưởng VKSNDTC"}
                      </span>
                      <div style={{ borderTop: `1px solid ${BORDER}`, margin: "2px 0" }} />
                      <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F, fontWeight: 600 }}>Số: {row.soThuLy}</span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Ngày: {row.ngayThuLy}</span>
                    </div>
                  </td>

                  {/* Thông tin BA/QĐ */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 600, color: TEXT }}>Số BA: {formatSoBA(row.soBA)}</span>
                        <span style={{ color: MUTED }}> Ngày: {row.ngayBA}</span>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Tại: {row.toa}</div>
                      {(row.loaiAn !== "Hình sự" && userRole !== "hinh-su" && userRole !== "vu-1") && (
                        <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 500, fontFamily: F }}>
                          QHPL: {row.tenVuAn}
                        </div>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                        <span style={{ display: "inline-block", padding: "1px 7px", background: "#dcfce7", color: "#15803d", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                          Thời hiệu: {row.thoiHieu}
                        </span>
                        {(row.tag === "an-qh" || row.tag === "an-quoc-hoi") && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            🏛️ Án quốc hội
                          </span>
                        )}
                        {row.tag === "an-tu-hinh" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fef2f2", color: RED, border: `1px solid ${RED}`, borderRadius: 10, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            ● Án tử hình
                          </span>
                        )}
                        {row.tag === "an-chi-dao" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            ★ Án chỉ đạo
                          </span>
                        )}
                        {row.tag === "an-tvtn" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#d1fae5", color: "#065f46", border: "1px solid #a7f3d0", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            📋 Án TVTN
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phân công */}
                  <td style={TD_STYLE}>
                    <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.8 }}>
                      <div><span style={{ color: MUTED }}>TTV: </span>{row.ttv}</div>
                      <div><span style={{ color: MUTED }}>LĐV: </span>{row.ldv}</div>
                      <div><span style={{ color: MUTED }}>TP: </span>{row.tp}</div>
                    </div>
                  </td>

                  <td style={TD_STYLE}>
                    <TrangThaiCell row={row} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setDetail(row)}
                      title="Xem chi tiết"
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, borderRadius: 4 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      <Eye size={15} />
                    </button>
                    {/* THIẾU [TB]: nút "Xem kết quả xét xử" trên hàng danh sách — SRS phần Phân tab */}
                    {row.trangThai === "da-xx" && (
                      <button
                        onClick={() => { setDetailInitialTab("ket-qua"); setDetail(row); }}
                        title="Xem kết quả xét xử"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#166534", padding: 4, borderRadius: 4, marginLeft: 2 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                      >
                        <FileText size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
            <span>Hiển thị {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trong tổng {filtered.length} bản ghi</span>
            <div style={{ flex: 1 }} />
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...paginBtn, color: page === 1 ? MUTED : TEXT, cursor: page === 1 ? "default" : "pointer" }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ ...paginBtn, background: p === page ? RED : "#fff", color: p === page ? "#fff" : TEXT, border: `1px solid ${p === page ? RED : BORDER}`, fontWeight: p === page ? 700 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...paginBtn, color: page === totalPages ? MUTED : TEXT, cursor: page === totalPages ? "default" : "pointer" }}>›</button>
            <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
          </div>
        </div>
      </div>

      {showInBaoCao && (
        <PrintReportModal
          onClose={() => setShowInBaoCao(false)}
          bieuMauList={BIEU_MAU_VU_XET_XU}
          tieuDeMan="In báo cáo – Quản lý vụ xét xử GĐT, TT"
        />
      )}
    </>
  );
}
