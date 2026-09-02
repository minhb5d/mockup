import React, { useState } from "react";
import {
  Search, Eye, ChevronDown, ChevronUp, ChevronRight, RotateCcw, X, Save, Printer,
  FileText, Send, Archive, RefreshCw, Download, Trash2, Pencil,
} from "lucide-react";
import { TableEmptyState } from "./components/platform";
import { type LoaiAn } from "./data";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, Tag, TaiKhoanPhanQuyenBar, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { getPartyLabels, isVu234, getQuanHePhapLuat } from "./AppHelpers";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import { TabThongTin } from "./TabThongTin";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoLuuTruView } from "./HoSoLuuTruView";

import { ThemKetQuaModal, ThemQuyetDinhHoanModal } from "./ThemKetQuaModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import { TabToTrinh } from "./TabToTrinh";

// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface VuAnRow {
  stt: number; lan: string;
  soThuLy: string; ngayThuLy: string;
  soBA: string; ngayBA: string;
  toa: string; capXetXu: string;
  thoiHieu?: string;
  anLoai?: "chi-dao" | "quoc-hoi" | "tvtn" | "tu-hinh" | string;
  loaiAn?: string;
  quanHePhapLuat?: string;
  nkn: string; biCao: string; ndd: string;
  ttv: string; lanhDao: string;
  kqgq: "chua-phan-cong" | "trinh-pho-chanh-an" | "trinh-tham-phan";
  trangThaiHoSo: "chua-co" | "dang-muon" | "da-co" | "da-tra" | "da-chuyen";
  kqGiaiQuyet: "chua-co" | "da-co" | "da-co-con-don" | "chap-nhan" | "khong-chap-nhan" | "xep-don";
  trangThaiToTrinh: "chua-co" | "dang-trinh" | "da-duyet" | "bi-tra-lai";
  soToTrinh: number;
  thamPhan?: string;
  // TH-060: thông tin bổ sung ở cột "Thông tin đơn & thụ lý"
  congVanChinh?: string;        // [Đơn vị gửi] - [Số CV] - [Ngày CV]
  yKienChiDao?: string;         // [Tên lãnh đạo] - [Chức vụ]: nội dung chỉ đạo
  congVanChuyenDon?: string;    // công văn chuyển đơn / kiến nghị GĐT
  thongBaoTinhThe?: string;     // TBTT: [Số TB] - [Ngày TB]
  // TH-061: danh sách bị cáo được đề nghị GĐT,TT
  biCaoDeNghi?: string[];
  // TH-062: kết quả giải quyết của đơn
  kqgqDon?: { loai: string; so: string; ngay: string };
  // TH-064: địa chỉ người đứng đơn
  diaChiNDD?: string;
  extraTags?: string[];
}

export interface VuAnGroup {
  id: string;
  maSo: string;
  tenVuAn: string;
  soVuAnGiaiQuyet: number;
  loaiAn?: LoaiAn | string;
  rows: VuAnRow[];
}

export function filterVuAnListByRole(groups: VuAnGroup[], userRole?: UserRoleType): VuAnGroup[] {
  if (!userRole || userRole === "toan-bo") return groups;
  if (userRole === "vu-1" || userRole === "hinh-su") {
    return groups.filter(g => g.loaiAn === "Hình sự" || (!g.loaiAn && !g.id.includes("DS") && !g.id.includes("KDTM") && !g.id.includes("HC") && !g.id.includes("LD") && !g.id.includes("HNGD")));
  }
  if (userRole === "vu-2" || userRole === "dan-su") {
    return groups.filter(g => g.loaiAn === "Dân sự" || g.id.includes("DS"));
  }
  if (userRole === "vu-3") {
    return groups.filter(g => g.loaiAn === "Kinh doanh thương mại" || g.loaiAn === "Lao động" || g.loaiAn === "Hôn nhân gia đình" || g.loaiAn === "Phá sản" || g.loaiAn === "Sở hữu trí tuệ" || g.id.includes("KDTM") || g.id.includes("LD") || g.id.includes("HNGD") || g.id.includes("PS"));
  }
  if (userRole === "vu-4" || userRole === "hanh-chinh") {
    return groups.filter(g => g.loaiAn === "Hành chính" || g.id.includes("HC"));
  }
  return groups;
}

export const VU_AN_LIST: VuAnGroup[] = [
  // ── Vụ I: Hình sự (Thời hiệu: 1 năm / Không xác định thời hiệu) ──
  {
    id: "VA26-002621", maSo: "VA26-002621",
    tenVuAn: "Vụ án Đặng Thị Dương – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682424", ngayThuLy: "20/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
        diaChiNDD: "Số 12, đường Trần Phú, Phường Kinh Bắc, Tỉnh Bắc Ninh",
        congVanChinh: "Ủy ban Tư pháp Quốc hội - 152/UBTP - 15/07/2026",
        yKienChiDao: "Nguyễn Văn A - Phó Chánh án: Khẩn trương xem xét, báo cáo trước 30/08",
        congVanChuyenDon: "Công văn chuyển đơn số 88/CV-VKS ngày 10/07/2026",
        thongBaoTinhThe: "45/TBTT - 18/07/2026",
        biCaoDeNghi: ["Hoàng Ngọc Hoa", "Trần Văn Bình", "Lê Thị Cúc", "Phạm Văn Dũng", "Ngô Thị Em"],
        kqgqDon: { loai: "Trả lời đơn", so: "231/TB-TA", ngay: "05/08/2026" },
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682425", ngayThuLy: "22/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002138", maSo: "VA26-002138",
    tenVuAn: "Vụ án Hoàng Hoa Thám – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 3,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 3, lan: "Lần 1: Số đơn 3 (1 đơn TLM)",
        soThuLy: "5:4684H06", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 2,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Nguyễn Thị Bình", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 1,
      },
      {
        stt: 1, lan: "Lần 1: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ II: Dân sự (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001543-DS", maSo: "VA26-001543",
    tenVuAn: "Vụ án Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681543", ngayThuLy: "03/07/2026",
        soBA: "21/2026/DS-ST", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        nkn: "Ngô Mai Trang", biCao: "Công ty TNHH Bất động sản Hoàng Gia", ndd: "Luật sư Trần Văn Nam",
        ttv: "Trần Thị Mai", lanhDao: "Trần Thị Hoa", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002300-DS", maSo: "VA26-002300",
    tenVuAn: "Vụ án Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54682300", ngayThuLy: "28/06/2026",
        soBA: "77/2026/DS-PT", ngayBA: "28/06/2026",
        toa: "Tòa án nhân dân TP Đà Nẵng", capXetXu: "Phúc thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        nkn: "Lê Văn Hùng", biCao: "Lê Thị Bích", ndd: "Luật sư Phạm Quốc Tuấn",
        ttv: "Vũ Xuân Hiển", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ III: Kinh doanh thương mại (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001890-KDTM", maSo: "VA26-001890",
    tenVuAn: "Vụ án Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681890", ngayThuLy: "19/06/2026",
        soBA: "45/2026/KDTM-ST", ngayBA: "19/06/2026",
        toa: "Tòa án nhân dân TP Hồ Chí Minh", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "chi-dao",
        nkn: "Ngân hàng TMCP Ngoại thương Việt Nam", biCao: "Công ty CP Xây lắp Dầu khí", ndd: "Nguyễn Văn Thắng",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  // ── Vụ IV: Hành chính (Thời hiệu: 1 năm / 3 năm / 5 năm) ──
  {
    id: "VA26-001104-HC", maSo: "VA26-001104",
    tenVuAn: "Vụ án Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681104", ngayThuLy: "25/07/2026",
        soBA: "12/2026/HC-ST", ngayBA: "25/07/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Giang", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        nkn: "Phạm Văn Cường", biCao: "Ủy ban nhân dân huyện Yên Dũng", ndd: "Hoàng Minh Tâm",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "VA26-003005-HS", maSo: "VA26-003005",
    tenVuAn: "Vụ án Lê Anh Tuấn – Tội cướp tài sản có tổ chức theo khoản 4 Điều 168 Bộ luật Hình sự",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54683005", ngayThuLy: "18/07/2026",
        soBA: "57/2026/HS-ST", ngayBA: "16/07/2026",
        toa: "Tòa án nhân dân tỉnh Thanh Hóa", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Lê Anh Tuấn", biCao: "Ngô Văn Quyết", ndd: "Luật sư Đặng Minh Tuấn",
        ttv: "Nguyễn Thị Bình", lanhDao: "Nguyễn Như Thắng", thamPhan: "Lê Văn Minh",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

export const KHIEU_NAI_LIST: VuAnGroup[] = [
  {
    id: "KN26-004128", maSo: "KN26-004128",
    tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TANDTC của TAND tỉnh Hà Nam",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn khiếu nại)",
        soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân tỉnh Hà Nam", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (Đơn khiếu nại bổ sung)",
        soThuLy: "KN-2026/00143", ngayThuLy: "20/06/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân tỉnh Hà Nam", capXetXu: "Sơ thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "quoc-hoi",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-005230-DS", maSo: "KN26-005230",
    tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai Bắc Ninh",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thông báo)",
        soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026",
        soBA: "54681139", ngayBA: "03/05/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Giám đốc thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại TB giải quyết"],
        nkn: "Phạm Văn Hùng (KN-74291)", biCao: "Ngô Quỳnh Trang", ndd: "Nguyễn Văn Hùng",
        ttv: "Nguyễn Thị Hoa", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-003891-KDTM", maSo: "KN26-003891",
    tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại biện pháp khẩn cấp)",
        soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026",
        soBA: "08/2026/QĐ-KDTM", ngayBA: "18/07/2026",
        toa: "Tòa án nhân dân TP. Đà Nẵng", capXetXu: "Sơ thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        extraTags: ["Khẩn cấp"],
        nkn: "Trần Minh Đức (ĐD Công ty CP Minh Phát)", biCao: "Công ty TNHH Hoàng Gia", ndd: "Đặng Quốc Tuấn",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "KN26-006102-HC", maSo: "KN26-006102",
    tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thời hạn)",
        soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026",
        soBA: "19/2026/HC-PT", ngayBA: "12/04/2026",
        toa: "Tòa án nhân dân tối cao", capXetXu: "Giám đốc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại thời hạn giải quyết"],
        nkn: "Hoàng Thị Thu", biCao: "Ủy ban nhân dân tỉnh Thanh Hóa", ndd: "Nguyễn Văn Tiến",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

export interface VuAnDetailData {
  maVuAn: string; tenVuAn: string;
  loaiBienAn: string; namGiaiQuyet: string;
  soNgayBanAn: string; loaiAn: string; toaXetXu: string;
  danhSachDon: Array<{
    stt: number; maDon: string; thongTinGQ: string;
    soThuLy: string; ngayThuLy: string; ngayNhan: string;
    nguoiDung: string; phanLoai: string; loaiDon: string; noiDung: string;
  }>;
  muonTraHoSo: Array<{
    stt: number; loaiPhieu: string; soPhieu: string; soBuLuc: string;
    ngayGhiPhieu: string; ngayTao: string; canBo: string; chucVu: string;
    donVi: string; nguoiKyDuyet: string; trangThaiKy: string; ghiChu: string;
  }>;
  thamPhan?: string;
  thamTraVien?: string;
  id?: string;
  nguyenDon?: string;
  biDon?: string;
  isKhieuNai?: boolean;
  entityWord?: string;
  moduleLabel?: string;
}

const VU_AN_DETAILS: Record<string, VuAnDetailData> = {
  "KN26-004128": {
    maVuAn: "KN26-004128", tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TANDTC của TAND tỉnh Hà Nam",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HS-ST – 10/04/2026", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân tỉnh Hà Nam",
    danhSachDon: [
      { stt: 1, maDon: "KN-88421", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026", ngayNhan: "15/05/2026", nguoiDung: "Nguyễn Thị Lan", phanLoai: "Đơn khiếu nại tố tụng", loaiDon: "DON_CHINH", noiDung: "Khiếu nại hành vi tố tụng và Quyết định trả lại đơn đề nghị giám đốc thẩm đối với bản án hình sự sơ thẩm số 12/2026/HS-ST." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-KN-001", soBuLuc: "08", ngayGhiPhieu: "18/05/2026", ngayTao: "18/05/2026", canBo: "Vũ Diệu Thúy", chucVu: "Thẩm tra viên", donVi: "Vụ 1 - TANDTC", nguoiKyDuyet: "Phạm Thị Bích Ngọc", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ khiếu nại" },
    ],
  },
  "KN26-005230-DS": {
    maVuAn: "KN26-005230", tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai Bắc Ninh",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "128/TB-TA – 03/05/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-74291", thongTinGQ: "Đã thụ lý", soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026", ngayNhan: "02/06/2026", nguoiDung: "Phạm Văn Hùng", phanLoai: "Khiếu nại TB giải quyết", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét lại Thông báo không kháng nghị giám đốc thẩm liên quan đến diện tích 350m2 đất thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "KN26-003891-KDTM": {
    maVuAn: "KN26-003891", tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "08/2026/QĐ-KDTM – 18/07/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân TP. Đà Nẵng",
    danhSachDon: [
      { stt: 1, maDon: "KN-90214", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026", ngayNhan: "20/07/2026", nguoiDung: "Trần Minh Đức", phanLoai: "Khiếu nại biện pháp khẩn cấp", loaiDon: "DON_CHINH", noiDung: "Khiếu nại việc áp dụng biện pháp khẩn cấp tạm thời phong tỏa tài khoản ngân hàng không đúng quy định." },
    ],
    muonTraHoSo: [],
  },
  "KN26-006102-HC": {
    maVuAn: "KN26-006102", tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "19/2026/HC-PT – 12/04/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân tối cao",
    danhSachDon: [
      { stt: 1, maDon: "KN-61020", thongTinGQ: "Đã có KQ", soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026", ngayNhan: "10/08/2026", nguoiDung: "Hoàng Thị Thu", phanLoai: "Khiếu nại thời hạn giải quyết", loaiDon: "DON_CHINH", noiDung: "Khiếu nại thời hạn giải quyết đơn đề nghị giám đốc thẩm kéo dài quá quy định pháp luật." },
    ],
    muonTraHoSo: [],
  },
  "VA26-002621": {
    maVuAn: "VA26-002039", tenVuAn: "Nguyễn Văn Minh – Tội cướp tài sản",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "6988", thongTinGQ: "Thụ lý mới", soThuLy: "5434565D", ngayThuLy: "21/07/2026", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ và có địa thiếu tố áp dụng theo quy định..." },
      { stt: 2, maDon: "7005", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
      { stt: 3, maDon: "7004", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-2026-001", soBuLuc: "12", ngayGhiPhieu: "20/07/2026", ngayTao: "20/07/2026", canBo: "Lý Thái Phúc", chucVu: "Thẩm tra viên", donVi: "Viện kiểm sát nhân dân tối cao", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Đã ký", ghiChu: "Kèm hồ sơ vụ án" },
      { stt: 2, loaiPhieu: "Phiếu trả", soPhieu: "PT-2026-001", soBuLuc: "12", ngayGhiPhieu: "25/07/2026", ngayTao: "25/07/2026", canBo: "Lý Thái Phúc", chucVu: "Thẩm tra viên", donVi: "Viện kiểm sát nhân dân tối cao", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Chờ ký", ghiChu: "Trả hồ sơ sau khi nghiên cứu" },
    ],
  },
  "VA26-002138": {
    maVuAn: "VA26-002138", tenVuAn: "Phùng Văn Nam – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ của người khác",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "–", soBuLuc: "–", ngayGhiPhieu: "–", ngayTao: "24/07/2026", canBo: "Vũ Xuân Hiển", chucVu: "Thẩm tra viên chính", donVi: "Viện kiểm sát nhân dân khu vực 11", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Chờ ký", ghiChu: "Ghi chú" },
    ],
  },
  "VA26-001543-DS": {
    maVuAn: "VA26-001543", tenVuAn: "Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "21/2026/DS-ST – 03/07/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân tỉnh Bắc Ninh",
    danhSachDon: [
      { stt: 1, maDon: "7122", thongTinGQ: "Thụ lý mới", soThuLy: "54681543", ngayThuLy: "03/07/2026", ngayNhan: "03/07/2026", nguoiDung: "Ngô Mai Trang", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án sơ thẩm về tranh chấp quyền sử dụng đất và nhà ở do vi phạm nghiêm trọng thủ tục tố tụng." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-DS-001", soBuLuc: "15", ngayGhiPhieu: "05/07/2026", ngayTao: "05/07/2026", canBo: "Trần Thị Mai", chucVu: "Thẩm tra viên", donVi: "TAND tỉnh Bắc Ninh", nguoiKyDuyet: "Trần Thị Hoa", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ gốc vụ án" },
    ],
  },
  "VA26-002300-DS": {
    maVuAn: "VA26-002300", tenVuAn: "Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    loaiBienAn: "Phúc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "77/2026/DS-PT – 28/06/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân TP Đà Nẵng",
    danhSachDon: [
      { stt: 1, maDon: "7150", thongTinGQ: "Thụ lý mới", soThuLy: "54682300", ngayThuLy: "28/06/2026", ngayNhan: "28/06/2026", nguoiDung: "Lê Văn Hùng", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị kháng nghị Giám đốc thẩm bản án phúc thẩm về phân chia di sản thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001890-KDTM": {
    maVuAn: "VA26-001890", tenVuAn: "Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "45/2026/KDTM-ST – 19/06/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân TP Hồ Chí Minh",
    danhSachDon: [
      { stt: 1, maDon: "7210", thongTinGQ: "Thụ lý mới", soThuLy: "54681890", ngayThuLy: "19/06/2026", ngayNhan: "19/06/2026", nguoiDung: "Ngân hàng TMCP Ngoại thương", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Yêu cầu Giám đốc thẩm do áp dụng sai quy định về nghĩa vụ bảo lãnh và lãi suất nợ quá hạn." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001104-HC": {
    maVuAn: "VA26-001104", tenVuAn: "Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HC-ST – 25/07/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân tỉnh Bắc Giang",
    danhSachDon: [
      { stt: 1, maDon: "7305", thongTinGQ: "Thụ lý mới", soThuLy: "54681104", ngayThuLy: "25/07/2026", ngayNhan: "25/07/2026", nguoiDung: "Phạm Văn Cường", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Khiếu kiện quyết định thu hồi đất không đúng thẩm quyền và giá bồi thường chưa thỏa đáng." },
    ],
    muonTraHoSo: [],
  },
};

// ── Popup Xem nhanh danh sách đơn kèm Thông tin trình (Trình đến ai) ───────────
export function QuickViewDanhSachDonModal({
  group,
  onClose,
  onSelectVuAn,
  userRole,
  isKhieuNai = false,
}: {
  group: VuAnGroup;
  onClose: () => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
  userRole?: UserRoleType;
  isKhieuNai?: boolean;
}) {
  const detail = VU_AN_DETAILS[group.id] || VU_AN_DETAILS["VA26-002621"];

  const donList = (detail?.danhSachDon && detail.danhSachDon.length > 0)
    ? detail.danhSachDon.map((d, i) => {
      const row = group.rows[i] || group.rows[0];
      const isTrinhPhoCA = row?.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row?.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row?.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TANDTC (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TANDTC (${row?.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row?.lanhDao || "Nguyễn Thị Bình - Vụ trưởng"})`;

      const trangThaiTrinh = (d as any).trangThaiTrinh || (row?.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row?.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : row?.soToTrinh ? "Đã duyệt" : "Chưa trình");
      const ngayTrinh = (d as any).ngayTrinh || row?.ngayThuLy || "20/07/2026";

      return {
        ...d,
        trinhDenAi,
        trangThaiTrinh,
        ngayTrinh,
      };
    })
    : group.rows.map((row, idx) => {
      const isTrinhPhoCA = row.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TANDTC (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TANDTC (${row.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row.lanhDao || "Nguyễn Thị Bình - Vụ trưởng"})`;

      return {
        stt: idx + 1,
        maDon: (6988 + idx) + "",
        thongTinGQ: idx === 0 ? "Thụ lý mới" : "Đã thụ lý",
        soThuLy: row.soThuLy,
        ngayThuLy: row.ngayThuLy,
        ngayNhan: row.ngayThuLy,
        nguoiDung: row.ndd || row.nkn,
        phanLoai: isKhieuNai ? "Đơn khiếu nại tố tụng" : "Đơn đề nghị GĐT, TT",
        loaiDon: idx === 0 ? "DON_CHINH" : "DON_TRUNG",
        trinhDenAi,
        trangThaiTrinh: row.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : "Chưa trình",
        ngayTrinh: row.ngayThuLy,
        noiDung: `Đề nghị xem xét bản án số ${row.soBA} theo thủ tục Giám đốc thẩm do có vi phạm tố tụng và tình tiết mới.`,
      };
    });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: F,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "100%",
          maxWidth: 1080,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} color="#800000" />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Danh sách đơn – {group.tenVuAn || group.maSo}
            </span>
            <Badge color="#1e40af" bg="#dbeafe">{donList.length} đơn</Badge>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: MUTED,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Strip */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "10px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div>
            <span style={{ color: MUTED }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span>
            <b style={{ color: "#800000" }}>{group.maSo}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Loại án: </span>
            <b style={{ color: TEXT }}>{group.loaiAn || "Hình sự"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Thẩm tra viên: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.ttv || "Lý Thái Phúc"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Thẩm phán: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.thamPhan || "Nguyễn Biên Thuỳ"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số BA/QĐ: </span>
            <b style={{ color: "#2563eb" }}>{formatSoBA(group.rows[0]?.soBA, group.loaiAn) || "12/2026/HS-PT"}</b>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 35 }} />
              <col style={{ width: 85 }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>MÃ ĐƠN</th>
                <th style={TH_STYLE}>THÔNG TIN THỤ LÝ</th>
                <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>PHÂN LOẠI</th>
                <th style={TH_STYLE}>THÔNG TIN TRÌNH (TRÌNH ĐẾN AI)</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>KẾT QUẢ GIẢI QUYẾT</th>
              </tr>
            </thead>
            <tbody>
              {donList.map((d, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: `1px solid #f3f4f6`,
                  }}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={{ ...TD_STYLE, color: "#2563eb", fontWeight: 700 }}>{d.maDon}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#065f46" : TEXT }}>
                        {d.thongTinGQ}
                      </span>
                      {d.soThuLy && <span style={{ fontSize: 11, color: TEXT }}>Số: {d.soThuLy}</span>}
                      {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED }}>Ngày TL: {d.ngayThuLy}</span>}
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontWeight: 600, color: "#111827" }}>{d.nguoiDung}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: TEXT }}>{d.phanLoai}</span>
                      <Badge color={d.loaiDon === "DON_CHINH" ? "#1e40af" : "#991b1b"} bg={d.loaiDon === "DON_CHINH" ? "#dbeafe" : "#fee2e2"}>
                        {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                      </Badge>
                      {d.thongTinGQ === "Thụ lý đi kèm" && (
                        <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontStyle: "italic" }}>
                          Đơn thụ lý đi kèm (không xem chi tiết được)
                        </span>
                      )}
                      {d.phanLoai?.includes("Quốc hội") && (
                        <span style={{ fontSize: 10, color: "#3730a3", fontFamily: F, fontStyle: "italic" }}>Ghi chú 2 – Án quốc hội</span>
                      )}
                      {d.phanLoai?.includes("chỉ đạo") && (
                        <span style={{ fontSize: 10, color: "#854d0e", fontFamily: F, fontStyle: "italic" }}>Ghi chú 3 – Án chỉ đạo</span>
                      )}
                    </div>
                  </td>
                  {/* Cột Thông tin trình (Trình đến ai) */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                          👤 {d.trinhDenAi}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <Badge
                          color={d.trangThaiTrinh === "Đã duyệt" ? "#065f46" : d.trangThaiTrinh === "Đang trình" ? "#92400e" : "#4b5563"}
                          bg={d.trangThaiTrinh === "Đã duyệt" ? "#d1fae5" : d.trangThaiTrinh === "Đang trình" ? "#fef3c7" : "#f3f4f6"}
                        >
                          {d.trangThaiTrinh}
                        </Badge>
                        {d.ngayTrinh && (
                          <span style={{ fontSize: 10, color: MUTED }}>
                            Ngày: {d.ngayTrinh}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Cột Kết quả giải quyết */}
                  <td style={TD_STYLE}>
                    {(() => {
                      const kqType = (d as any).ketQuaGiaiQuyetType || (idx % 4 === 0 ? "khang-nghi" : idx % 4 === 1 ? "tra-loi-don" : idx % 4 === 2 ? "vks-giai-quyet" : "xep-don");

                      if (kqType === "khang-nghi") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#065f46" bg="#d1fae5">⚖ Kháng nghị</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số: {(d as any).khangNghiSo || `${102 + idx}/2026/QĐ-KN-HS`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày QĐ: {(d as any).khangNghiNgay || "15/07/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "tra-loi-don") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#1e40af" bg="#dbeafe">📩 Trả lời đơn</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số: {(d as any).traLoiSo || `${45 + idx}/TB-TANDTC`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày BH: {(d as any).traLoiNgay || "20/06/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "vks-giai-quyet") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#92400e" bg="#fef3c7">🏛 VKS đang giải quyết</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số CV: {(d as any).vksSo || `${210 + idx}/CV-VKSTC`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày CV: {(d as any).vksNgay || "08/08/2026"}</span>
                          </div>
                        );
                      }
                      // xep-don
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Badge color="#374151" bg="#f3f4f6">📁 Xếp đơn</Badge>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>QĐ số: {(d as any).xepDonSo || `${12 + idx}/QĐ-XD`}</span>
                          <span style={{ fontSize: 10, color: MUTED }}>Ngày xếp: {(d as any).xepDonNgay || "02/05/2026"}</span>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${BORDER}`,
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: MUTED }}>
            Tổng cộng: <b style={{ color: TEXT }}>{donList.length} đơn</b> thuộc {isKhieuNai ? "vụ việc khiếu nại" : "vụ án"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                onClose();
                onSelectVuAn(group.id, "danh-sach-don");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 18px",
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
              Xem toàn bộ chi tiết {isKhieuNai ? "khiếu nại" : "vụ án"} →
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
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
        </div>
      </div>
    </div>
  );
}

// Drawio 2.2 / 2.3: hai nguồn tạo vụ không đi qua màn Nhận đơn VPHCTP.
// Việc tạo/ghép/chuyển ở Màn nhận đã bị đánh dấu đỏ trong bảng đối chiếu,
// nên chỉ đặt thao tác này tại đúng module Quản lý vụ án.
function TaoVuTheoNguonDrawioModal({ onClose, onCreate }: { onClose:()=>void; onCreate:(g:VuAnGroup)=>void }) {
  const [nguon,setNguon]=useState<"rut-ho-so"|"chu-dong">("rut-ho-so");
  const [loaiAn,setLoaiAn]=useState("Hình sự");
  const [soBA,setSoBA]=useState("");
  const [ngayBA,setNgayBA]=useState("");
  const [toa,setToa]=useState("");
  const [ten,setTen]=useState("");
  const [qhpl,setQhpl]=useState("");
  const inp:React.CSSProperties={width:"100%",padding:"7px 9px",border:`1px solid ${BORDER}`,borderRadius:4,fontFamily:F,fontSize:12,boxSizing:"border-box"};
  const save=()=>{
    if(!soBA.trim()||!ngayBA||!toa.trim()||!ten.trim()){alert("Vui lòng nhập đủ Số BA/QĐ, Ngày BA/QĐ, Tòa và Tên vụ án");return;}
    const id=`VA-${Date.now()}`;
    onCreate({
      id, maSo:id, tenVuAn:ten, soVuAnGiaiQuyet:1, loaiAn,
      rows:[{stt:1,lan:nguon==="rut-ho-so"?"Rút hồ sơ đoàn kiểm tra":"Chủ động GĐT qua bản án",soThuLy:"Chưa cấp",ngayThuLy:"-",soBA,ngayBA,toa,capXetXu:"Chưa xác định",thoiHieu:"Theo loại án",loaiAn,quanHePhapLuat:qhpl,nkn:"-",biCao:"-",ndd:"-",ttv:"Chưa phân công",lanhDao:"Chưa phân công",thamPhan:"Chưa phân công",kqgq:"chua-phan-cong",trangThaiHoSo:"chua-co",kqGiaiQuyet:"chua-co",trangThaiToTrinh:"chua-co",soToTrinh:0}]
    });
  };
  return <div style={{position:"fixed",inset:0,zIndex:2500,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:720,maxWidth:"95vw",background:"#fff",borderRadius:8,boxShadow:"0 16px 45px rgba(0,0,0,.25)",fontFamily:F}}><div style={{padding:"14px 18px",borderBottom:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><b style={{color:RED}}>Tạo vụ án theo nguồn nghiệp vụ</b><div style={{fontSize:11,color:MUTED,marginTop:3}}>Drawio 2.2 / 2.3 — không phải thao tác Thêm vụ án tại màn Nhận đơn</div></div><button onClick={onClose} style={{border:0,background:"none",cursor:"pointer"}}><X size={18}/></button></div><div style={{padding:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600}}>Nguồn tạo vụ *</label><div style={{display:"flex",gap:20,marginTop:6}}><label><input type="radio" checked={nguon==="rut-ho-so"} onChange={()=>setNguon("rut-ho-so")}/> Rút hồ sơ đoàn kiểm tra</label><label><input type="radio" checked={nguon==="chu-dong"} onChange={()=>setNguon("chu-dong")}/> Chủ động GĐT qua bản án</label></div></div><div><label style={{fontSize:12,fontWeight:600}}>Loại án *</label><select value={loaiAn} onChange={e=>setLoaiAn(e.target.value)} style={inp}>{["Hình sự","Dân sự","Hành chính","Kinh doanh thương mại","Lao động","Hôn nhân gia đình"].map(x=><option key={x}>{x}</option>)}</select></div><div><label style={{fontSize:12,fontWeight:600}}>Số BA/QĐ *</label><input value={soBA} onChange={e=>setSoBA(e.target.value)} style={inp}/></div><div><label style={{fontSize:12,fontWeight:600}}>Ngày BA/QĐ *</label><input type="date" value={ngayBA} onChange={e=>setNgayBA(e.target.value)} style={inp}/></div><div><label style={{fontSize:12,fontWeight:600}}>Tòa ra BA/QĐ *</label><input value={toa} onChange={e=>setToa(e.target.value)} style={inp}/></div><div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600}}>Tên vụ án *</label><input value={ten} onChange={e=>setTen(e.target.value)} style={inp}/></div><div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600}}>Quan hệ pháp luật / Tội danh</label><input value={qhpl} onChange={e=>setQhpl(e.target.value)} style={inp}/></div></div><div style={{padding:"12px 18px",borderTop:`1px solid ${BORDER}`,display:"flex",justifyContent:"flex-end",gap:8}}><button onClick={onClose} style={{padding:"7px 16px",border:`1px solid ${BORDER}`,background:"#fff",borderRadius:4}}>Hủy</button><button onClick={save} style={{padding:"7px 16px",border:0,background:RED,color:"#fff",borderRadius:4,fontWeight:700}}>Tạo vụ</button></div></div></div>;
}

// ── Quản lý vụ án – Main View Component ───────────────────────────────────────
export type VuAnTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet";
export type ChiTietTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "muon-tra-ho-so" | "to-trinh" | "giai-quyet-vb" | "tai-lieu" | "ho-so-luu-tru";

export default function QuanLyVuAnView({
  userRole,
  setUserRole,
  onSelectVuAn,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<VuAnTabId>("dang-giai-quyet");
  const [quickViewDonGroup, setQuickViewDonGroup] = useState<VuAnGroup | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showTaoVuTheoNguon, setShowTaoVuTheoNguon] = useState(false);
  const [createdGroups, setCreatedGroups] = useState<VuAnGroup[]>([]);

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isHinhSu = !userRole || userRole === "vu-1" || userRole === "hinh-su" || userRole === "toan-bo";

  const roleGroups = filterVuAnListByRole([...createdGroups, ...VU_AN_LIST], userRole);
  const filteredGroups = roleGroups
    .map((group) => {
      if (activeTab === "tat-ca") return group;
      if (activeTab === "dang-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "chua-co" || r.kqGiaiQuyet === "da-co-con-don" || !r.kqGiaiQuyet);
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      if (activeTab === "da-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "da-co");
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      return group;
    })
    .filter(Boolean) as VuAnGroup[];

  const tabs = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
  ];

  const paginBtn: React.CSSProperties = {
    padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Quản lý vụ án
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Quản lý vụ án</h2>
          {userRole && setUserRole && (
            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as VuAnTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Panel */}
      <VuAnSearchFilterPanel
        userRole={userRole}
        onSearch={() => alert("Đang tìm kiếm danh sách vụ án...")}
      />

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowTaoVuTheoNguon(true)} title="Drawio 2.2 / 2.3: Rút hồ sơ đoàn kiểm tra hoặc Chủ động GĐT qua bản án" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Tạo vụ theo nguồn GĐKT
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
          <Printer size={13} /> In danh sách
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>THÔNG TIN ĐƠN & THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
              <th style={TH_STYLE}>ĐƯƠNG SỰ & NGƯỜI ĐỀ NGHỊ</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {isHinhSu
              ? filteredGroups.map((group, groupIdx) => {
                const isCollapsed = collapsedGroups[group.id];
                return (
                  <React.Fragment key={group.id}>
                    {/* Header Vụ án (Level 1: Dòng Mã Vụ Án hồng nhạt tinh gọn) */}
                    <tr
                      style={{
                        background: "#fef2f2",
                        borderTop: `1px solid #fecdd3`,
                        borderBottom: `1px solid #fecdd3`,
                      }}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center", background: "#fef2f2", padding: "4px 8px" }}>
                        <input type="checkbox" style={{ cursor: "pointer" }} />
                      </td>
                      <td colSpan={6} style={{ ...TD_STYLE, background: "#fef2f2", padding: "5px 10px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
                          onClick={() => toggleGroupCollapse(group.id)}
                        >
                          {isCollapsed ? <ChevronRight size={14} color="#2563eb" /> : <ChevronDown size={14} color="#2563eb" />}
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", fontFamily: F }}>
                            {groupIdx + 1}.
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", fontFamily: F }}>
                            {group.maSo || group.id}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: F }}>
                            – {group.tenVuAn}
                          </span>
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: F }}>
                            ({group.rows.length} đơn đã thụ lý)
                          </span>
                          {group.rows[0] && (
                            <span style={{ fontSize: 11, color: "#475569", fontFamily: F }}>
                              · BA/QĐ {group.rows[0].soBA} – {group.rows[0].ngayBA} – {group.rows[0].toa}
                            </span>
                          )}
                          {group.rows[0] && (
                            <Badge
                              color={group.rows[0].trangThaiHoSo === "da-co" || group.rows[0].trangThaiHoSo === "da-tra" ? "#065f46" : "#92400e"}
                              bg={group.rows[0].trangThaiHoSo === "da-co" || group.rows[0].trangThaiHoSo === "da-tra" ? "#d1fae5" : "#fef3c7"}
                            >
                              {group.rows[0].trangThaiHoSo === "da-co" || group.rows[0].trangThaiHoSo === "da-tra" ? "Đã có hồ sơ" : "Chưa có hồ sơ"}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Danh sách các đơn thuộc Vụ án (1 dòng = 1 đơn) */}
                    {!isCollapsed &&
                      group.rows.map((row, idx) => {
                        const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Hình sự";
                        const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                        const rowKey = `${group.id}-${row.stt}-${idx}`;
                        const isFirst = idx === 0;
                        const totalRows = group.rows.length;

                        return (
                          <tr
                            key={rowKey}
                            style={{ background: "#ffffff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                          >
                            <td style={{ ...TD_STYLE, textAlign: "center", padding: "4px 8px" }}>
                              <input type="checkbox" style={{ cursor: "pointer" }} />
                            </td>

                            {/* Cột gộp chung: STT, THÔNG TIN ĐƠN & THỤ LÝ */}
                            <td style={{ ...TD_STYLE, padding: "5px 8px", lineHeight: 1.35 }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                {/* <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: F, marginTop: 1 }}>↳</span> */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                    Số TL: <b style={{ color: "#0f172a" }}>{row.soThuLy}</b>
                                  </span>
                                  <span style={{ fontSize: 10.5, color: MUTED, fontFamily: F }}>
                                    Ngày TL: {row.ngayThuLy}
                                  </span>
                                  <span style={{ fontSize: 10.5, color: "#64748b", fontFamily: F }}>
                                    Ngày đơn: {row.ngayThuLy}
                                  </span>
                                  {row.anLoai && (
                                    <Tag type={row.anLoai} />
                                  )}
                                  {row.congVanChinh && (
                                    <span style={{ fontSize: 10.5, color: "#64748b", fontFamily: F }}>
                                      CV chính: {row.congVanChinh}
                                    </span>
                                  )}
                                  {row.yKienChiDao && (
                                    <span style={{ fontSize: 10.5, color: "#b45309", fontFamily: F }}>
                                      Chỉ đạo: {row.yKienChiDao}
                                    </span>
                                  )}
                                  {row.congVanChuyenDon && (
                                    <span style={{ fontSize: 10.5, color: "#64748b", fontFamily: F }}>
                                      CV chuyển đơn: {row.congVanChuyenDon}
                                    </span>
                                  )}
                                  {row.thongBaoTinhThe && (
                                    <span style={{ fontSize: 10.5, color: "#64748b", fontFamily: F }}>
                                      TBTT: {row.thongBaoTinhThe}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* 3 Cột chung (Thông tin bản án, Đương sự, Phân công) gộp ô theo rowSpan */}
                            {isFirst && (
                              <>
                                {/* Cột 2: Thông tin Bản án / QĐ & QHPL */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: TEXT }}>Số BA: </span>
                                      <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(row.soBA, effectiveLoaiAn)}</span>
                                      {row.ngayBA && (
                                        <>
                                          <span style={{ color: TEXT }}> Ngày: </span>
                                          <span style={{ color: "#2563eb" }}>{row.ngayBA}</span>
                                        </>
                                      )}
                                    </span>
                                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                      <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                                    </span>
                                    {row.thoiHieu && (
                                      <span style={{ fontSize: 10.5, color: "#b45309", fontFamily: F }}>
                                        Thời hiệu: {row.thoiHieu}
                                      </span>
                                    )}
                                    {row.biCaoDeNghi && row.biCaoDeNghi.length > 0 && (
                                      <span
                                        style={{ fontSize: 10.5, color: "#64748b", fontFamily: F }}
                                        title={row.biCaoDeNghi.join("; ")}
                                      >
                                        Đề nghị GĐT: {row.biCaoDeNghi.slice(0, 3).join(", ")}
                                        {row.biCaoDeNghi.length > 3 && ` và ${row.biCaoDeNghi.length - 3} bị cáo khác`}
                                      </span>
                                    )}
                                    {/* <div style={{ display: "inline-block", background: "#fef9c3", border: "1px solid #fef08a", borderRadius: 3, padding: "0px 6px", width: "fit-content", fontSize: 10.5, color: "#854d0e", fontWeight: 600 }}>
                                      Cấp xét xử: {row.capXetXu || "Tái thẩm"}
                                    </div> */}
                                  </div>
                                </td>

                                {/* Cột 3: Đương sự & Người đứng đơn */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {row.nkn && (
                                      <span style={{ fontSize: 11, fontFamily: F }} title={row.nkn}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>{label1}:</span>{" "}
                                        <span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span>
                                      </span>
                                    )}
                                    {row.biCao && (
                                      <span style={{ fontSize: 11, fontFamily: F }} title={row.biCao}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>{label2}:</span>{" "}
                                        <span style={{ fontWeight: 600, color: TEXT }}>{row.biCao}</span>
                                      </span>
                                    )}
                                    {row.ndd && (
                                      <span style={{ fontSize: 11, fontFamily: F }}>
                                        <span style={{ color: TEXT, fontWeight: 500 }}>NĐĐ:</span>{" "}
                                        <span style={{ color: TEXT }}>{row.ndd}</span>
                                      </span>
                                    )}
                                    {row.diaChiNDD && (
                                      <span style={{ fontSize: 10.5, color: MUTED, fontFamily: F }}>
                                        Địa chỉ: {row.diaChiNDD}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Cột 4: Phân công */}
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: MUTED }}>TTV: </span>
                                      <span style={{ fontWeight: 600, color: TEXT }}>{row.ttv}</span>
                                    </span>
                                    <span style={{ fontSize: 11, fontFamily: F }}>
                                      <span style={{ color: MUTED }}>LĐ: </span>
                                      <span style={{ color: TEXT }}>{row.lanhDao}</span>
                                    </span>
                                    {row.thamPhan && (
                                      <span style={{ fontSize: 11, fontFamily: F }}>
                                        <span style={{ color: MUTED }}>TP: </span>
                                        <span style={{ color: TEXT }}>{row.thamPhan}</span>
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}

                            {/* Cột 5: Trạng thái (Tờ trình) */}
                            <td style={{ ...TD_STYLE, padding: "5px 8px" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewDonGroup(group);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  fontSize: 11,
                                  color: "#2563eb",
                                  fontFamily: F,
                                  textDecoration: "underline",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  fontWeight: 600,
                                }}
                              >
                                📄 {row.soToTrinh || 1} tờ trình
                              </button>
                              {row.kqgqDon && (
                                <div style={{ fontSize: 10.5, color: "#065f46", fontFamily: F, marginTop: 3 }}>
                                  KQGQ: {row.kqgqDon.loai} ({row.kqgqDon.so} – {row.kqgqDon.ngay})
                                </div>
                              )}
                            </td>

                            {/* Cột 6: Thao tác */}
                            <td style={{ ...TD_STYLE, textAlign: "center", padding: "5px 8px" }}>
                              <button
                                onClick={() => onSelectVuAn(group.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4 }}
                                title="Xem chi tiết"
                              >
                                <Eye size={14} color="#6b7280" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
              : filteredGroups.flatMap((group) =>
                group.rows.map((row, idx) => {
                  const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Dân sự";
                  const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                  const rowKey = `${group.id}-${row.stt}-${idx}`;
                  const globalIdx = filteredGroups.indexOf(group) * group.rows.length + idx;
                  return (
                    <tr
                      key={rowKey}
                      style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                        {globalIdx + 1}
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            Số: <b>{row.soThuLy}</b>
                          </span>
                          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewDonGroup(group);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 11,
                              color: "#2563eb",
                              fontFamily: F,
                              textDecoration: "underline",
                              textAlign: "left",
                              fontWeight: 600,
                            }}
                            title="Xem nhanh danh sách đơn và thông tin trình"
                          >
                            Số đơn {group.rows.length}
                          </button>
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Số BA: </span>
                            <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(row.soBA, effectiveLoaiAn)}</span>
                            {row.ngayBA && (
                              <>
                                <span style={{ color: TEXT }}> Ngày: </span>
                                <span style={{ color: "#2563eb" }}>{row.ngayBA}</span>
                              </>
                            )}
                          </span>
                          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                            <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                          </span>
                          {row.thoiHieu && (
                            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                              <span style={{ color: TEXT }}>Thời hiệu: </span>
                              <span style={{ color: row.thoiHieu === "Không xác định thời hiệu" || row.thoiHieu === "Không có thời hiệu giải quyết" ? "#047857" : "#c2410c", fontWeight: 600 }}>
                                {row.thoiHieu}
                              </span>
                            </span>
                          )}
                          {isVu234(userRole, row.loaiAn) && (
                            <span style={{ fontSize: 11, color: "#047857", fontFamily: F, fontWeight: 500 }}>
                              <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{getQuanHePhapLuat(row)}
                            </span>
                          )}
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                            {row.anLoai === "chi-dao" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                            {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án Quốc hội</Badge>}
                            {row.anLoai === "tvtn" && <Badge color="#065f46" bg="#d1fae5">Án TVTN</Badge>}
                            {row.anLoai === "tu-hinh" && <Badge color="#991b1b" bg="#fee2e2">Án tử hình</Badge>}
                          </div>
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: TEXT, fontWeight: 600 }}>{label1}:</span>{" "}
                            <span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span>
                          </span>
                          {row.biCao && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: TEXT, fontWeight: 600 }}>{label2}:</span>{" "}
                              <span style={{ fontWeight: 600, color: TEXT }}>{row.biCao}</span>
                            </span>
                          )}
                          {row.ndd && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: TEXT, fontWeight: 600 }}>NĐĐ:</span>{" "}
                              <span style={{ color: TEXT }}>{row.ndd}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>TTV: </span>{row.ttv}
                            </span>
                          )}
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: MUTED }}>TP: </span>
                            {row.thamPhan || "–"}
                          </span>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {row.kqgq === "chua-phan-cong"
                            ? <Badge color="#374151" bg="#f3f4f6">Chưa phân công TTV</Badge>
                            : row.kqgq === "trinh-tham-phan"
                              ? <Badge color="#0f766e" bg="#ccfbf1">Trình Thẩm phán</Badge>
                              : <Badge color="#1e40af" bg="#dbeafe">Trình Phó Chánh án</Badge>}

                          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                            <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Hồ sơ</span>
                            {row.trangThaiHoSo === "chua-co" && (
                              <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có hồ sơ</span>
                            )}
                            {row.trangThaiHoSo === "dang-muon" && (
                              <Badge color="#92400e" bg="#fef3c7">Đang mượn hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-co" && (
                              <Badge color="#065f46" bg="#d1fae5">Đã có hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-tra" && (
                              <Badge color="#1e40af" bg="#dbeafe">Đã trả hồ sơ</Badge>
                            )}
                            {row.trangThaiHoSo === "da-chuyen" && (
                              <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                            <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kết quả GQ</span>
                            {row.kqGiaiQuyet === "chua-co" && (
                              <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có kết quả</span>
                            )}
                            {row.kqGiaiQuyet === "da-co" && (
                              <Badge color="#065f46" bg="#d1fae5">Đã có kết quả</Badge>
                            )}
                            {row.kqGiaiQuyet === "da-co-con-don" && (
                              <Badge color="#92400e" bg="#fef3c7">Đã có KQ – còn đơn TLM</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <button
                          onClick={() => onSelectVuAn(group.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, lineHeight: 1 }}
                          title="Xem chi tiết"
                        >
                          <Eye size={15} color={MUTED} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.length} trong tổng {filteredGroups.length} vụ án</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option><option>20 / trang</option><option>50 / trang</option><option>100 / trang</option></select>
        </div>
      </div>

      {quickViewDonGroup && (
        <QuickViewDanhSachDonModal
          group={quickViewDonGroup}
          onClose={() => setQuickViewDonGroup(null)}
          onSelectVuAn={onSelectVuAn}
          userRole={userRole}
        />
      )}
      {showTaoVuTheoNguon && (
        <TaoVuTheoNguonDrawioModal
          onClose={() => setShowTaoVuTheoNguon(false)}
          onCreate={(g) => {
            setCreatedGroups(prev => [g, ...prev]);
            setShowTaoVuTheoNguon(false);
            setActiveTab("dang-giai-quyet");
            alert("Đã tạo vụ theo nguồn nghiệp vụ Drawio 2.2/2.3");
          }}
        />
      )}
    </div>
  );
}

// ── Sub-components for ChiTietVuAn ──────────────────────────────────────────

export function ThongTinChungVuAnCard({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN CHUNG CỦA VỤ ÁN</span>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
        <Badge color="#854d0e" bg="#fefce8">⭐ Án chỉ đạo</Badge>
        <Badge color="#6b21a8" bg="#f3e8ff">🏛️ ÁN QH</Badge>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: 10 }}>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
        </colgroup>
        <tbody>
          {/* 27.08 đỏ: bỏ Mã vụ án và Loại bản án */}

          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{detail?.namGiaiQuyet || "Giám đốc thẩm"}</td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{detail?.soNgayBanAn || "12/4/2026/HSPT – 30/12/2025"}</td>
          </tr>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Loại án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}` }}>{detail?.loaiAn || "Hình sự"}</td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
            <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{detail?.toaXetXu || "Tòa án nhân dân cấp cao tại Hà Nội"}</td>
          </tr>
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Công văn</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, borderRight: `1px solid ${BORDER}`, lineHeight: 1.7 }}>
              <b>Số 124/CV-VKSTC – 15/07/2026</b><br />
              Viện kiểm sát nhân dân tối cao<br />
              <span style={{ color: MUTED, fontStyle: "italic" }}>(Công văn kiến nghị GĐT)</span>
            </td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Chỉ đạo</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, lineHeight: 1.7, verticalAlign: "top" }}>
              <b>Nguyễn Văn A</b><br />
              Phó Chánh án TANDTC<br />
              <span style={{ color: MUTED }}>Xem xét kỹ hồ sơ đánh giá thương tích và yếu tố phòng vệ chính đáng</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TabDanhSachDon({ detail }: { detail: VuAnDetailData }) {
  const danhSachDon = detail?.danhSachDon || [];
  const [selectedDon, setSelectedDon] = useState<number[]>([]);
  const [showTachVuAn, setShowTachVuAn] = useState(false);
  const [canhBao, setCanhBao] = useState("");

  const toggleDon = (stt: number) =>
    setSelectedDon(prev => (prev.includes(stt) ? prev.filter(x => x !== stt) : [...prev, stt]));
  const toggleAll = () =>
    setSelectedDon(prev => (prev.length === danhSachDon.length ? [] : danhSachDon.map(d => d.stt)));

  const handleTachVuAn = () => {
    if (selectedDon.length === 0) {
      setCanhBao("Chọn đơn để tách vụ án");
      return;
    }
    setCanhBao("");
    setShowTachVuAn(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách đơn</h3>
          <div style={{ flex: 1 }} />
          {canhBao && (
            <span style={{ fontSize: 12, color: "#dc2626", fontFamily: F, marginRight: 10 }}>{canhBao}</span>
          )}
          {/* SRS 1.2.4 [Thấp]: nút In danh sách */}
          <button onClick={() => window.print()} style={{ marginRight: 8, display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            In danh sách
          </button>
          <button onClick={handleTachVuAn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Tách vụ án{selectedDon.length > 0 ? ` (${selectedDon.length})` : ""}
          </button>
          <button style={{ marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} /><col style={{ width: 40 }} /><col style={{ width: 60 }} />
            <col style={{ width: "18%" }} /><col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>
                <input type="checkbox" checked={danhSachDon.length > 0 && selectedDon.length === danhSachDon.length}
                  onChange={toggleAll} style={{ cursor: "pointer" }} />
              </th>
              {["STT", "Mã đơn", "Thông tin giải quyết đơn", "Ngày nhận đơn", "Người đứng đơn", "Phân loại", "Nội dung", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {danhSachDon.length === 0 && (
              <tr><td colSpan={9} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {danhSachDon.map((d, idx) => (
              <tr key={d.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <input type="checkbox" checked={selectedDon.includes(d.stt)} onChange={() => toggleDon(d.stt)} style={{ cursor: "pointer" }} />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: "#2563eb", fontSize: 12, fontWeight: 600 }}>{d.maDon}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#065f46" : MUTED, fontFamily: F }}>{d.thongTinGQ}</span>
                    {d.soThuLy && <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: {d.soThuLy}</span>}
                    {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{d.ngayThuLy}</span>}
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.ngayNhan}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.nguoiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{d.phanLoai}</span>
                    <Badge color={d.loaiDon === "DON_CHINH" ? "#1e40af" : "#991b1b"} bg={d.loaiDon === "DON_CHINH" ? "#dbeafe" : "#fee2e2"}>
                      {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                    </Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{d.noiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem"><Eye size={14} color={MUTED} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TH-073: popup xác nhận tách vụ án */}
      {showTachVuAn && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 460, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", fontFamily: F }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: RED, flex: 1 }}>Xác nhận tách vụ án</span>
              <button onClick={() => setShowTachVuAn(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={16} color={MUTED} />
              </button>
            </div>
            <div style={{ padding: 16, fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
              Bạn có chắc chắn muốn tách <b>{selectedDon.length}</b> đơn đã chọn thành vụ án mới không?
              <div style={{ marginTop: 10, fontSize: 12, color: MUTED }}>
                Đơn được tách: {danhSachDon.filter(d => selectedDon.includes(d.stt)).map(d => d.maDon).join(", ")}
              </div>
            </div>
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowTachVuAn(false)}
                style={{ padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                Đóng
              </button>
              <button onClick={() => { setShowTachVuAn(false); setSelectedDon([]); }}
                style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                Tách vụ án
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── XemBieuMauScreen – Word editor popup for phieu templates ────────────────
function XemBieuMauScreen({ loaiPhieu, onClose }: { loaiPhieu: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13pt");
  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const execCmd = (cmd: string, val?: string) => document.execCommand(cmd, false, val);
  const today = new Date();
  const todayStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const tbBtnSt: React.CSSProperties = { padding: "4px 9px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 4 };
  const sepSt: React.CSSProperties = { width: 1, height: 18, background: BORDER, margin: "0 3px" };

  const isPhieuTra = loaiPhieu === "Phiếu trả";
  const isPhieuMuon = loaiPhieu === "Phiếu mượn" || loaiPhieu === "Phiếu chuyển";
  const isCongVan = loaiPhieu === "Công văn XM, BS" || loaiPhieu === "Công văn khác" || loaiPhieu === "Công văn xác minh";
  const title = isPhieuTra ? "PHIẾU TRẢ HỒ SƠ" : isPhieuMuon ? (loaiPhieu === "Phiếu chuyển" ? "PHIẾU CHUYỂN HỒ SƠ" : "PHIẾU MƯỢN HỒ SƠ") : "CÔNG VĂN XÁC MINH";
  const soHieu = hasNumber ? (isPhieuTra ? "18/2026/PT-TANDTC" : isPhieuMuon ? "12/2026/PM-TANDTC" : "527/2026/CV-TANDTC") : `.../${isPhieuTra ? "PT" : isPhieuMuon ? "PM" : "CV"}-TANDTC`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 12px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 980, boxShadow: "0 24px 70px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <FileText size={16} color={RED} />
          <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>Xem biểu mẫu – {loaiPhieu}</span>
          {isSaved && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>✓ Đã lưu</span>}
          {hasNumber && <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>🔢 Số: {soHieu}</span>}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setIsSaved(true); }} style={{ padding: "5px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>💾 Lưu</button>
            <button onClick={() => setHasNumber(v => !v)} style={{ padding: "5px 14px", background: hasNumber ? "#dc2626" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>{hasNumber ? "✕ Hủy số" : "🔢 Lấy số"}</button>
            <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>📩 Trình ký</button>
            <button onClick={onClose} style={{ padding: "5px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>✕ Đóng</button>
          </div>
        </div>

        {/* Ribbon toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={() => execCmd("undo")} style={tbBtnSt}>↩ Hoàn tác</button>
          <button onClick={() => execCmd("redo")} style={tbBtnSt}>↪ Làm lại</button>
          <div style={sepSt} />
          <select onChange={e => execCmd("fontName", e.target.value)} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
          </select>
          <select onChange={e => setFontSize(e.target.value)} value={fontSize} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            {["11pt", "12pt", "13pt", "14pt"].map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={sepSt} />
          <button onClick={() => execCmd("bold")} style={tbBtnSt}><b>B</b></button>
          <button onClick={() => execCmd("italic")} style={tbBtnSt}><i>I</i></button>
          <button onClick={() => execCmd("underline")} style={tbBtnSt}><u>U</u></button>
          <div style={sepSt} />
          <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt}>⬅</button>
          <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt}>↔</button>
          <button onClick={() => execCmd("justifyRight")} style={tbBtnSt}>➡</button>
          <button onClick={() => execCmd("justifyFull")} style={tbBtnSt}>☰</button>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Zoom:</span>
            <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflowY: "auto", background: "#94a3b8", padding: "24px 16px", display: "flex", justifyContent: "center" }}>
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              background: "#fff", width: "100%", maxWidth: 750,
              minHeight: 1050, padding: "60px 72px 70px 72px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: fontSize, color: "#000", lineHeight: 1.65,
              outline: "none", boxSizing: "border-box",
              transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            }}
          >
            {/* Quốc hiệu */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ textAlign: "center", width: "46%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontSize: 12, marginTop: 4 }}>Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soHieu}</span></div>
              </div>
              <div style={{ textAlign: "center", width: "52%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập – Tự do – Hạnh phúc</div>
                <div style={{ width: 160, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>Hà Nội, {todayStr}</div>
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17, margin: "28px 0 20px", letterSpacing: 0.5 }}>{title}</div>

            {/* Content */}
            {isPhieuTra && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tối cao</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao trả lại hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> về Viện kiểm sát nhân dân tối cao theo quy định của pháp luật.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân tỉnh Hải Phòng"],
                      ["Giai đoạn", "Giám đốc thẩm, tái thẩm"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Thành phần hồ sơ trả về:</b> Hồ sơ vụ án (bao gồm biên bản, quyết định, bản án và các tài liệu liên quan).
                </div>
              </>
            )}
            {isPhieuMuon && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tối cao</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao đề nghị mượn hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> để phục vụ công tác nghiên cứu, giải quyết theo thủ tục giám đốc thẩm.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân tỉnh Hải Phòng"],
                      ["Thời hạn mượn", "30 ngày kể từ ngày nhận hồ sơ"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Mục đích mượn:</b> Nghiên cứu hồ sơ phục vụ xét xử giám đốc thẩm theo quy định pháp luật tố tụng hình sự.
                </div>
              </>
            )}
            {isCongVan && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tỉnh Hải Phòng</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao nhận được đề nghị giám đốc thẩm vụ án <b>Phan Văn Thành – Bức cung</b>. Để có cơ sở xem xét, giải quyết, Tòa án nhân dân tối cao đề nghị Viện kiểm sát nhân dân tỉnh Hải Phòng xác minh, bổ sung một số thông tin sau:
                </div>
                <div style={{ paddingLeft: 30, marginBottom: 14, lineHeight: 1.8 }}>
                  <div>1. Xác minh quá trình điều tra, truy tố, xét xử vụ án;</div>
                  <div>2. Bổ sung tài liệu, chứng cứ liên quan đến tội danh bức cung;</div>
                  <div>3. Cung cấp biên bản các phiên tòa sơ thẩm và phúc thẩm.</div>
                </div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Đề nghị Viện kiểm sát nhân dân tỉnh Hải Phòng trả lời bằng văn bản trong thời hạn <b>30 ngày</b> kể từ ngày nhận công văn này./.
                </div>
              </>
            )}

            {/* Signature */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
              <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.7, width: "45%" }}>
                <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                <div>– Như kính gửi;</div>
                <div>– Đ/c Chánh án TANDTC (để b/c);</div>
                <div>– Lưu: VT, Vụ GĐ,KT.</div>
              </div>
              <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
                <div>TL. CHÁNH ÁN</div>
                <div>KT. CHÁNH VĂN PHÒNG</div>
                <div>PHÓ CHÁNH VĂN PHÒNG</div>
                <div style={{ height: 70 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Danh mục đơn vị giữ hồ sơ và đơn vị cụ thể tương ứng (SRS - Hồ sơ, mục 3)
const DON_VI_GIU_HO_SO: Record<string, string[]> = {
  "Tòa án nhân dân": ["Tòa án nhân dân tối cao", "Tòa án nhân dân cấp cao tại Hà Nội", "Tòa án nhân dân cấp cao tại Đà Nẵng", "Tòa án nhân dân cấp cao tại TP. Hồ Chí Minh", "Tòa án nhân dân tỉnh Bắc Ninh"],
  "Viện kiểm sát nhân dân": ["Viện kiểm sát nhân dân tối cao", "Viện kiểm sát nhân dân cấp cao tại Hà Nội", "Viện kiểm sát nhân dân tỉnh Bắc Ninh"],
  "Trại giam": ["Trại giam Nam Hà", "Trại giam Thanh Xuân", "Trại giam Hoàng Tiến"],
  "Trại tạm giam": ["Trại tạm giam số 1 Hà Nội", "Trại tạm giam số 2 Hà Nội"],
  "Khác": [],
};

function TaoPhieuModal({ onClose }: { onClose: () => void }) {
  const [loaiPhieu, setLoaiPhieu] = useState("");
  const [donViGiuHoSo, setDonViGiuHoSo] = useState("");
  const [donViCuThe, setDonViCuThe] = useState("");
  const [noiDungHoSo, setNoiDungHoSo] = useState("");
  const [taiLieuRows, setTaiLieuRows] = useState<Array<{ id: number; ten: string; loai: string; ngayTao: string; nguoiTao: string }>>([]);
  const [coThayDoiPhieu, setCoThayDoiPhieu] = useState(false);
  const [canhBaoDong, setCanhBaoDong] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [diinhKem, setDinhKem] = useState(false);
  const [soPhieu, setSoPhieu] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const generatedNo = loaiPhieu === "Công văn xác minh"
        ? "527/2026/CV-TANDTC"
        : loaiPhieu === "Phiếu trả"
          ? "18/2026/PT-TANDTC"
          : "1/2026/CV-TANDTC";
      setSoPhieu(generatedNo);
      setDaLaySo(true);
    } else {
      setSoPhieu("");
      setDaLaySo(false);
    }
  };

  const inSt: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };
  const lbl = (text: string, required = false) => (
    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3, display: "block" }}>
      {required && <span style={{ color: RED }}>* </span>}{text}
    </span>
  );

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14 }}>✏</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>
              {loaiPhieu === "Công văn XM, BS" ? "Tạo công văn xác minh, bổ sung" : loaiPhieu === "Công văn khác" ? "Tạo công văn" : loaiPhieu ? `Tạo ${loaiPhieu.toLowerCase()}` : "Tạo phiếu"}
            </span>
            <button onClick={() => { if (coThayDoiPhieu) { setCanhBaoDong(true); return; } onClose(); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><X size={18} color={MUTED} /></button>
          </div>

          <div style={{ padding: "16px 20px", overflowY: "auto" }}>
            <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-00321</b></span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên vụ án: </span>Vụ án Phan Văn Thành – bức cung</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Phan Văn Thành</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tội danh chính: </span>Bức cung</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>050526_CTH02</b></span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>05/05/2026</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân tỉnh Hải Phòng</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Giai đoạn: </span>Giám đốc thẩm, tái thẩm</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Tòa án giải quyết: </span>Tòa án nhân dân tối cao</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Chưa có kết quả giải quyết đơn</span></span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Loại phiếu</span>
              </div>
              <div style={{ maxWidth: 300 }}>
                {lbl("Loại phiếu", true)}
                <select value={loaiPhieu} onChange={e => { setLoaiPhieu(e.target.value); setCoThayDoiPhieu(true); }} style={selSt}>
                  <option value="">Chọn loại phiếu</option>
                  <option value="Phiếu rút hồ sơ">Phiếu rút hồ sơ</option>
                  <option value="Phiếu mượn">Phiếu mượn</option>
                  <option value="Phiếu trả">Phiếu trả</option>
                  <option value="Phiếu chuyển">Phiếu chuyển</option>
                  <option value="Nhận hồ sơ">Nhận hồ sơ</option>
                  <option value="Công văn XM, BS">Công văn xác minh, bổ sung</option>
                  <option value="Công văn khác">Công văn khác</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl(loaiPhieu === "Nhận hồ sơ" ? "Ngày nhận" : "Ngày lập phiếu", true)}
                  <input placeholder="Chọn ngày quyết định" style={inSt} />
                </div>
                <div>
                  {lbl("Số phiếu")}
                  <input value={soPhieu} readOnly placeholder="Hệ thống cấp khi bấm Lấy số" style={{ ...inSt, background: "#f3f4f6", cursor: "not-allowed" }} />
                </div>
                <div>
                  {lbl("Người ký", true)}
                  <select style={selSt}><option value="">Chọn người ký</option><option>Nguyễn Văn A</option></select>
                </div>
                {["Phiếu trả", "Phiếu chuyển", "Nhận hồ sơ"].includes(loaiPhieu) && (
                  <div>
                    {lbl("Số bút lục")}
                    <input placeholder="Nhập số bút lục" style={inSt} />
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl("Đơn vị giữ hồ sơ", true)}
                  <select value={donViGiuHoSo} onChange={e => { setDonViGiuHoSo(e.target.value); setDonViCuThe(""); }} style={selSt}>
                    <option value="">Chọn Đơn vị giữ hồ sơ</option>
                    {Object.keys(DON_VI_GIU_HO_SO).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  {lbl("Đơn vị cụ thể", true)}
                  {donViGiuHoSo === "Khác" ? (
                    <input value={donViCuThe} onChange={e => setDonViCuThe(e.target.value)} placeholder="Nhập tên đơn vị" style={inSt} />
                  ) : (
                    <select value={donViCuThe} onChange={e => setDonViCuThe(e.target.value)} style={selSt} disabled={!donViGiuHoSo}>
                      <option value="">{donViGiuHoSo ? "Chọn đơn vị cụ thể" : "Chọn Đơn vị giữ hồ sơ trước"}</option>
                      {(DON_VI_GIU_HO_SO[donViGiuHoSo] || []).map(dv => <option key={dv} value={dv}>{dv}</option>)}
                    </select>
                  )}
                </div>
              </div>
              {/* TH-079: tài liệu đính kèm */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Tài liệu đính kèm</span>
                  <button
                    onClick={() => setTaiLieuRows(p => [...p, { id: Date.now(), ten: "", loai: "Bản scan", ngayTao: "27/08/2026", nguoiTao: "Lý Thái Phúc" }])}
                    style={{ padding: "4px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>
                    + Thêm tài liệu
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Tên tài liệu", "Loại tài liệu", "Ngày tạo", "Người tạo", ""].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {taiLieuRows.length === 0 && (
                      <tr><td colSpan={5} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 12 }}>Chưa có tài liệu đính kèm</td></tr>
                    )}
                    {taiLieuRows.map((r, i) => (
                      <tr key={r.id}>
                        <td style={TD_STYLE}>
                          <input value={r.ten} onChange={e => setTaiLieuRows(p => p.map((x, j) => j === i ? { ...x, ten: e.target.value } : x))}
                            placeholder="Nhập tên tài liệu" style={{ width: "100%", border: "none", fontSize: 12, outline: "none", fontFamily: F }} />
                        </td>
                        <td style={TD_STYLE}>
                          <select value={r.loai} onChange={e => setTaiLieuRows(p => p.map((x, j) => j === i ? { ...x, loai: e.target.value } : x))}
                            style={{ width: "100%", border: "none", fontSize: 12, outline: "none", fontFamily: F }}>
                            <option>Bản scan</option><option>Bản mềm</option><option>Biểu mẫu</option>
                          </select>
                        </td>
                        <td style={{ ...TD_STYLE, fontSize: 12, textAlign: "center" }}>{r.ngayTao}</td>
                        <td style={{ ...TD_STYLE, fontSize: 12 }}>{r.nguoiTao}</td>
                        <td style={{ ...TD_STYLE, textAlign: "center" }}>
                          <button onClick={() => setTaiLieuRows(p => p.filter((_, j) => j !== i))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11 }}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {loaiPhieu === "Phiếu trả" && (
                <div style={{ marginBottom: 10 }}>
                  {lbl("Nội dung hồ sơ", true)}
                  <textarea value={noiDungHoSo} onChange={e => setNoiDungHoSo(e.target.value)}
                    placeholder="Mô tả nội dung hồ sơ trả lại"
                    style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
                </div>
              )}
              <div>
                {lbl(loaiPhieu === "Công văn xác minh" ? "Nội dung" : "Ghi chú")}
                <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú"
                  style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
              </div>
            </div>

            {["Phiếu rút hồ sơ", "Phiếu trả", "Phiếu chuyển", "Công văn XM, BS", "Công văn khác"].includes(loaiPhieu) && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>
                  <span style={{ color: RED }}>* </span>Nơi nhận
                </span>
                <button
                  onClick={() => setAddingRow(true)}
                  style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                  Thêm nơi nhận
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: 110 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
                      <th key={h} style={TH_STYLE}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noiNhanRows.map((r, idx) => (
                    <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.noiNhan}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.chiTiet}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F }}>✏ Sửa</button>
                          <button onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#ef4444", fontFamily: F }}>🗑 Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {addingRow && (
                    <tr style={{ background: "#f0f9ff" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{noiNhanRows.length + 1}</td>
                      <td style={TD_STYLE}>
                        <select value={newRow.noiNhan} onChange={e => setNewRow(p => ({ ...p, noiNhan: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn nơi nhận</option>
                          <option>Viện kiểm sát</option>
                          <option>Tòa án</option>
                          <option>Cơ quan điều tra</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select value={newRow.chiTiet} onChange={e => setNewRow(p => ({ ...p, chiTiet: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn</option>
                          <option>VKSNDTC</option>
                          <option>VKSND cấp cao</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <input value={newRow.ghiChu} onChange={e => setNewRow(p => ({ ...p, ghiChu: e.target.value }))} placeholder="Nhập ghi chú" style={{ ...inSt, fontSize: 11 }} />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button onClick={() => { if (newRow.noiNhan) { setNoiNhanRows(p => [...p, { id: Date.now(), ...newRow, editing: false }]); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); setAddingRow(false); } }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#0f766e", fontFamily: F, fontWeight: 600 }}>Lưu</button>
                          <button onClick={() => { setAddingRow(false); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: F }}>Hủy</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div onClick={() => setDinhKem(v => !v)} style={{ width: 36, height: 20, borderRadius: 10, background: diinhKem ? "#0f766e" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: diinhKem ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Đính kèm tài liệu, hồ sơ</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
              <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
              <button style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lưu</button>
              {/* SRS 1.4.3 mục 5: Phiếu nhận không cần Lấy số/Trình ký (không phải văn bản phát hành) */}
              {loaiPhieu !== "Nhận hồ sơ" && (
                <>
                  <button onClick={handleToggleLaySo} style={{ padding: "7px 20px", background: daLaySo ? "#fef2f2" : "#fff", color: daLaySo ? "#dc2626" : "#374151", border: `1px solid ${daLaySo ? "#fca5a5" : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    {daLaySo ? "✕ Hủy cấp số" : "Lấy số"}
                  </button>
                  <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
                </>
              )}
              <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
            </div>
          </div>
        </div>
      </div>
      {canhBaoDong && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 420, fontFamily: F, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 700, color: RED }}>Xác nhận</div>
            <div style={{ padding: 16, fontSize: 13, color: TEXT }}>Bạn có chắc chắn đóng khi chưa Lưu?</div>
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setCanhBaoDong(false)}
                style={{ padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Quay lại</button>
              <button onClick={() => { setCanhBaoDong(false); onClose(); }}
                style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
      {showBieuMau && <XemBieuMauScreen loaiPhieu={loaiPhieu} onClose={() => setShowBieuMau(false)} />}
    </>
  );
}

// Trạng thái phiếu theo SRS: Đang tạo / Chờ ký / Đã có hiệu lực / Trả lại
const TRANG_THAI_PHIEU: Record<string, string> = {
  "Đã ký": "Đã có hiệu lực",
  "Chờ ký": "Chờ ký",
  "Đang tạo": "Đang tạo",
  "Trả lại": "Trả lại",
};
// Sửa và Xóa chỉ cho phép khi phiếu chưa trình ký
const CHUA_TRINH_KY = (tt: string) => tt !== "Chờ ký" && tt !== "Đã ký";

function TabMuonTraHoSo({ detail }: { detail: VuAnDetailData }) {
  const [showModal, setShowModal] = useState(false);
  const muonTraHoSo = detail?.muonTraHoSo || [];
  return (
    <div style={{ padding: 20 }}>
      {showModal && <TaoPhieuModal onClose={() => setShowModal(false)} />}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F }}>Tổng số phiếu: {muonTraHoSo.length}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            + Tạo phiếu
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In danh sách
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} /><col style={{ width: "14%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Loại phiếu", "Thông tin phiếu", "Ngày ghi trên phiếu", "Người thao tác", "Đơn vị giữ/chuyển hồ sơ", "Người ký", "Ghi chú", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {muonTraHoSo.length === 0 && (
              <tr><td colSpan={9} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {muonTraHoSo.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>
                  {r.loaiPhieu} {muonTraHoSo.slice(0, idx + 1).filter(x => x.loaiPhieu === r.loaiPhieu).length}
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1, fontSize: 11, fontFamily: F }}>
                    <span style={{ color: TEXT, fontWeight: 600 }}>Số phiếu: {r.soPhieu}</span>
                    <span style={{ color: MUTED }}>Ngày tạo: {r.ngayTao}</span>
                    <span style={{ color: MUTED }}>Số bút lục: {r.soBuLuc}</span>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.ngayGhiPhieu}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>{r.canBo}</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{r.chucVu}</span>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.donVi}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  {r.loaiPhieu === "Nhận hồ sơ" ? (
                    <span style={{ color: MUTED }}>-</span>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{r.nguoiKyDuyet}</span>
                      <Badge color="#92400e" bg="#fef3c7">{TRANG_THAI_PHIEU[r.trangThaiKy] || r.trangThaiKy}</Badge>
                    </div>
                  )}
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    {CHUA_TRINH_KY(r.trangThaiKy) && (
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Sửa"><Pencil size={13} color={MUTED} /></button>
                    )}
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="In"><Printer size={13} color={MUTED} /></button>
                    {CHUA_TRINH_KY(r.trangThaiKy) && (
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><X size={13} color="#ef4444" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabPhanCong({ detail }: { detail: VuAnDetailData }) {
  const thamPhanRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Chiêu", chucDanh: "TPTC", ngayPC: "21/07/2026", nguoiTT: "Nguyễn Văn Hiển – Phó CA", thoiGianTT: "14:30 – 21/07/2026", ghiChu: "Phân công lại do TPB3 đề xuất kháng nghị" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Ngã", chucDanh: "TPB3", ngayPC: "01/07/2026", nguoiTT: "Nguyễn Văn Hòa – Phó CA", thoiGianTT: "14:30 – 01/07/2026", ghiChu: "TP về hưu" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Hoa", chucDanh: "TPB3", ngayPC: "21/06/2026", nguoiTT: "Nguyễn Văn Hiển – Trưởng phòng VP HCTP", thoiGianTT: "14:30 – 21/06/2026", ghiChu: "–" },
  ];

  const ttvRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Chiêu", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/07/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/07/2026", nguoiThaoTac: "Nguyễn Cao Thắng" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Ngã", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "01/07/2026", hoTenLD: "Nguyễn Văn Hòa", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "01/07/2026", nguoiThaoTac: "Nguyễn Cao Thắng" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Hoa", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/06/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/06/2026", nguoiThaoTac: "Lý Thái Phúc" },
  ];

  const sectionHdr = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
      <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ marginBottom: 24 }}>
        {sectionHdr("Lịch sử phân công Thẩm phán")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "HỌ VÀ TÊN THẨM PHÁN", "NGÀY PHÂN CÔNG", "NGƯỜI THAO TÁC", "GHI CHÚ"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...thamPhanRows].sort((a, b) => b.stt - a.stt).map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, fontFamily: F }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTen}</span>
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPC}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                    <div>{r.nguoiTT}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.thoiGianTT}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED }}>{r.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        {sectionHdr("Lịch sử phân công TTV và LĐV")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "HỌ VÀ TÊN TTV", "NGÀY PHÂN CÔNG TTV", "HỌ VÀ TÊN LÃNH ĐẠO", "NGÀY PHÂN CÔNG LĐ", "NGƯỜI THAO TÁC"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...ttvRows].sort((a, b) => b.stt - a.stt).map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, fontFamily: F }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTenTTV}</span>
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCTTV}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, fontFamily: F }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTenLD}</span>
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.nguoiThaoTac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabGiaiQuyetVB({ detail }: { detail?: VuAnDetailData }) {
  // Án hình sự: SRS đổi tên thành "Quyết định tạm đình chỉ thi hành án" và bỏ checkbox
  const isHinhSuDetail = (detail?.loaiAn || "").toLowerCase().includes("hình sự");
  // TH-085: popup xác nhận xóa kết quả giải quyết
  const [xoaKetQua, setXoaKetQua] = useState<string | null>(null);
  // TH-089 (BR-05): mọi đơn trong vụ đã có kết quả giải quyết hay chưa
  const donChuaCoKQ = (detail?.danhSachDon || []).filter(d => d.thongTinGQ === "Thụ lý mới");
  const moiDonDaCoKQ = (detail?.danhSachDon || []).length > 0 && donChuaCoKQ.length === 0;
  const [showThemKetQua, setShowThemKetQua] = useState(false);
  const [showThemHoan, setShowThemHoan] = useState(false);
  const [showTaiLieuHoSoModal, setShowTaiLieuHoSoModal] = useState(false);
  const [searchHoan, setSearchHoan] = useState("");
  const [isHoanChecked, setIsHoanChecked] = useState(true);
  const [quyetDinhHoanList, setQuyetDinhHoanList] = useState<Array<{
    stt: number;
    biCao: string;
    tenQuyetDinh: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    ngayPhatHanh?: string;
    nguoiKy: string;
    nguoiTao: string;
  }>>([]);

  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleAddQuyetDinhHoan = (newItem: any) => {
    setQuyetDinhHoanList(prev => [
      ...prev,
      {
        stt: prev.length + 1,
        ...newItem,
      },
    ]);
  };

  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const groups = isKhieuNai ? [
    {
      id: "chap-nhan-khieu-nai", title: "Chấp nhận khiếu nại",
      items: [
        {
          stt: 1, maDon: "1531", soQuyetDinh: "179/2026/QĐ-GQKN", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
      ],
    },
    {
      id: "khong-chap-nhan-khieu-nai", title: "Không chấp nhận khiếu nại",
      items: [
        {
          stt: 1, maDon: "1532, 1432", soQuyetDinh: "180/2026/QĐ-GQKN", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
    {
      // SRS 1.5.3: nhóm kết quả "Xếp đơn" cho khiếu nại — trước đây mockup chỉ có
      // Chấp nhận / Không chấp nhận, thiếu hẳn nhóm này.
      id: "xep-don-khieu-nai", title: "Xếp đơn",
      items: [
        {
          stt: 1, maDon: "1533", soQuyetDinh: "14/QĐ-XD", ngayQuyetDinh: "10/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 10/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "10/07/2026 09:12:00" },
        },
      ],
    },
  ] : [
    {
      id: "tra-loi-don", title: "Trả lời đơn",
      items: [
        {
          stt: 1, maDon: "1531", soQuyetDinh: "179/2026/TB-TA", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
        {
          stt: 2, maDon: "1234", soQuyetDinh: "179/2026/TB-TA", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:00:38" },
        },
      ],
    },
    {
      id: "khang-nghi", title: "Kháng nghị",
      items: [
        {
          stt: 1, maDon: "1532, 1432", soQuyetDinh: "179/2026/KN-HS", ngayQuyetDinh: "09/07/2026", ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPTC", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ];

  const thSt: React.CSSProperties = { padding: "10px 8px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: F, whiteSpace: "nowrap" };
  const tdSt: React.CSSProperties = { padding: "10px 8px", fontSize: 12, fontFamily: F, verticalAlign: "top" };

  return (
    <div style={{ padding: 20, fontFamily: F }}>
      {!isKhieuNai && showThemHoan && (
        <ThemQuyetDinhHoanModal
          onClose={() => setShowThemHoan(false)}
          detail={detail}
          onSave={handleAddQuyetDinhHoan}
        />
      )}

      {/* Modal Xem / Quản lý tài liệu hồ sơ số hóa */}
      {showTaiLieuHoSoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 16px", background: "#800000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>📁 Quản lý tài liệu hồ sơ số hóa - Vụ án {detail?.maVuAn || "VA26-00321"}</span>
            <button onClick={() => setShowTaiLieuHoSoModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: F }}>
              <X size={16} /> Đóng xem hồ sơ
            </button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TaiLieuHoSoView vuAnId={detail?.maVuAn || "VA26-00321"} tenVuAn={detail?.tenVuAn || "Vụ án"} onBack={() => setShowTaiLieuHoSoModal(false)} />
          </div>
        </div>
      )}

      {/* Thông tin quyết định hoãn thi hành án – Chỉ hiển thị cho Vụ án, không hiển thị cho Khiếu nại */}
      {!isKhieuNai && (
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Thông tin quyết định hoãn thi hành án
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {isHinhSuDetail ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F }}>
                  Quyết định tạm đình chỉ thi hành án
                </span>
              ) : (
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: F }}>
                  <input
                    type="checkbox"
                    checked={isHoanChecked}
                    onChange={e => setIsHoanChecked(e.target.checked)}
                    style={{ accentColor: "#800000", cursor: "pointer" }}
                  />
                  <span>Quyết định hoãn thi hành án</span>
                </label>
              )}
              <div style={{ position: "relative", width: 220 }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchHoan}
                  onChange={e => setSearchHoan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 28px",
                    fontSize: 12,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontFamily: F,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Search size={13} color={MUTED} style={{ position: "absolute", left: 8, top: 7, pointerEvents: "none" }} />
              </div>
            </div>

            <button
              onClick={() => setShowThemHoan(true)}
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
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              + Thêm mới
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                  <th style={{ ...thSt }}>Tên quyết định</th>
                  <th style={{ ...thSt, width: 120 }}>Ngày phát hành</th>
                  <th style={{ ...thSt, width: 120 }}>Số QĐ</th>
                  <th style={{ ...thSt, width: 110 }}>Ngày ra QĐ</th>
                  <th style={{ ...thSt, width: 160 }}>Người ký</th>
                  <th style={{ ...thSt, width: 140 }}>Người tạo</th>
                  <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quyetDinhHoanList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "28px 16px", color: MUTED, fontSize: 13, fontStyle: "italic", borderBottom: "1px solid #f3f4f6" }}>
                      Chưa có quyết định hoãn thi hành án
                    </td>
                  </tr>
                ) : (
                  quyetDinhHoanList
                    .filter(r => !searchHoan || r.tenQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()) || r.biCao.toLowerCase().includes(searchHoan.toLowerCase()) || r.soQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
                        <td style={{ ...tdSt, textAlign: "center", color: "#6b7280" }}>{r.stt}</td>
                        <td style={{ ...tdSt, color: "#2563eb", fontWeight: 500 }}>{r.tenQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#6b7280" }}>{r.ngayPhatHanh || "–"}</td>
                        <td style={{ ...tdSt, fontWeight: 500 }}>{r.soQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#374151" }}>{r.ngayQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#374151" }}>{r.nguoiKy}</td>
                        <td style={{ ...tdSt, color: "#6b7280" }}>{r.nguoiTao}</td>
                        <td style={{ ...tdSt, textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem chi tiết">
                              <Eye size={14} color="#0e7490" />
                            </button>
                            <button onClick={() => setQuyetDinhHoanList(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa">
                              <Trash2 size={14} color="#dc2626" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showThemKetQua && (
        <ThemKetQuaModal
          onClose={() => { setShowThemKetQua(false); setSelectedDetail(null); }}
          detail={selectedDetail || detail}
        />
      )}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: isKhieuNai ? 0 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: F }}>
            {isKhieuNai ? "Kết quả giải quyết khiếu nại" : "Kết quả giải quyết đơn"}
          </span>
          {/* TH-089 (BR-05): ẩn nút khi tất cả đơn trong vụ đã có kết quả giải quyết */}
          {!moiDonDaCoKQ ? (
            <button onClick={() => { setSelectedDetail(detail); setShowThemKetQua(true); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>
              + Thêm kết quả giải quyết
            </button>
          ) : (
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F, fontStyle: "italic" }}>
              Tất cả đơn trong vụ đã có kết quả giải quyết
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groups.map(g => {
            const isCollapsed = !!collapsedGroups[g.id];
            return (
              <div key={g.id} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                  <div onClick={() => toggleGroup(g.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>{g.title}</span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{isCollapsed ? "▼" : "▲"}</span>
                  </div>
                  {(g.id === "khang-nghi" || g.title.toLowerCase().includes("kháng nghị")) && (
                    <button
                      type="button"
                      onClick={() => setShowTaiLieuHoSoModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#800000",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: F,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      + Thêm hồ sơ
                    </button>
                  )}
                </div>

                {!isCollapsed && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                      <thead>
                        <tr style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                          <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                          <th style={{ ...thSt, width: 100 }}>Mã đơn</th>
                          <th style={{ ...thSt, width: 140 }}>Số quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày phát hành</th>
                          <th style={{ ...thSt, width: 220 }}>Người duyệt</th>
                          <th style={{ ...thSt, width: 200 }}>Người ký</th>
                          <th style={{ ...thSt, width: 180 }}>Người tạo</th>
                          <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
                            <td style={{ ...tdSt, textAlign: "center", color: "#6b7280" }}>{r.stt}</td>
                            <td style={{ ...tdSt, color: "#111827" }}>{r.maDon}</td>
                            <td style={{ ...tdSt }}>
                              <span onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ color: "#1d4ed8", fontWeight: 500, cursor: "pointer" }}>
                                {r.soQuyetDinh}
                              </span>
                            </td>
                            <td style={{ ...tdSt, color: "#374151" }}>{r.ngayQuyetDinh}</td>
                            <td style={{ ...tdSt, color: "#6b7280" }}>{r.ngayPhatHanh}</td>
                            <td style={{ ...tdSt }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {r.nguoiDuyet.map((nd, i) => (
                                  <div key={i} style={{ lineHeight: 1.3 }}>
                                    <div style={{ color: "#111827", fontWeight: 500 }}>{nd.ten}</div>
                                    <div style={{ color: "#16a34a", fontSize: 11 }}>{nd.status}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiKy.ten}</div>
                                <div style={{ color: r.nguoiKy.isDone ? "#16a34a" : "#6b7280", fontSize: 11 }}>{r.nguoiKy.status}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiTao.ten}</div>
                                <div style={{ color: "#6b7280", fontSize: 11 }}>{r.nguoiTao.thoiGian}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt, textAlign: "center" }}>
                              <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                                <button onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem chi tiết">
                                  <Eye size={15} color="#6b7280" />
                                </button>
                                <button onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Sửa">
                                  <Pencil size={15} color="#6b7280" />
                                </button>
                                <button onClick={() => setXoaKetQua(r.soQuyetDinh)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xóa">
                                  <X size={15} color="#ef4444" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TH-085: popup xác nhận xóa kết quả giải quyết */}
      {xoaKetQua && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 440, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", fontFamily: F }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 700, color: RED }}>
              Xác nhận xóa
            </div>
            <div style={{ padding: 16, fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
              Bạn có chắc chắn muốn xóa kết quả giải quyết đơn <b>{xoaKetQua}</b> không?
            </div>
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setXoaKetQua(null)}
                style={{ padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                Đóng
              </button>
              <button onClick={() => setXoaKetQua(null)}
                style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabTaiLieu({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <TaiLieuHoSoView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

function TabHoSoLuuTru({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <HoSoLuuTruView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

// ── Chi tiết vụ án View Component ───────────────────────────────────────────
export function ChiTietVuAnView({
  vuAnId,
  userRole,
  onBack,
  initialTab = "thong-tin",
  moduleLabel = "Quản lý vụ án",
  detailLabel = "Chi tiết vụ án",
  entityWord = "Vụ án"
}: {
  vuAnId: string;
  userRole?: UserRoleType;
  onBack: () => void;
  initialTab?: ChiTietTab;
  moduleLabel?: string;
  detailLabel?: string;
  entityWord?: string;
}) {
  const [activeTab, setActiveTab] = useState<ChiTietTab>(initialTab);
  // TH-090: chặn sang tab khác khi tab Thông tin vụ án còn thiếu trường bắt buộc
  const [duThongTinBatBuoc, setDuThongTinBatBuoc] = useState(true);
  const [canhBaoBatBuoc, setCanhBaoBatBuoc] = useState("");
  const safeVuAnId = vuAnId || "VA26-002621";
  const rawDetail = VU_AN_DETAILS[safeVuAnId] || VU_AN_DETAILS["VA26-002621"];
  const detail = {
    ...rawDetail,
    maVuAn: (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")) ? safeVuAnId : (rawDetail?.maVuAn || safeVuAnId),
    moduleLabel,
    detailLabel,
    entityWord,
    isKhieuNai: moduleLabel === "Quản lý khiếu nại" || entityWord === "Khiếu nại" || (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")),
  };

  const tabs: Array<{ id: ChiTietTab; label: string; count?: number }> = [
    { id: "thong-tin", label: "Thông tin vụ án" },
    // TH-075: SRS – ẩn tab Danh sách đơn với vụ "Rút hồ sơ đoàn kiểm tra" và "Chủ động GĐT qua bản án"
    ...(["Rút hồ sơ đoàn kiểm tra", "Chủ động GĐT qua Bản án"].includes(detail?.loaiBienAn || "")
      ? []
      : [{ id: "danh-sach-don" as ChiTietTab, label: "Danh sách đơn", count: detail?.danhSachDon?.length || 3 }]),
    { id: "phan-cong", label: "Phân công" },
    { id: "muon-tra-ho-so", label: "Hồ sơ", count: detail?.muonTraHoSo?.length || 2 },
    { id: "to-trinh", label: "Tờ trình", count: 3 },
    { id: "giai-quyet-vb", label: "Giải quyết văn bản đề nghị", count: 3 },
    { id: "tai-lieu", label: "Tài liệu vụ án", count: 4 },
    { id: "ho-so-luu-tru", label: "Hồ sơ lưu trữ" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", overflow: "hidden", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Quay lại
          </button>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › {moduleLabel} › <b style={{ color: TEXT }}>{detailLabel}: {detail.maVuAn}</b>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Tên {entityWord.toLowerCase()}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", fontFamily: F }}>{detail.tenVuAn}</span>
          <Badge color="#065f46" bg="#d1fae5">Đang giải quyết</Badge>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0, overflowX: "auto" }}>
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (t.id !== "thong-tin" && !duThongTinBatBuoc) {
                  setActiveTab("thong-tin");
                  setCanhBaoBatBuoc("Bổ sung các thông tin bắt buộc để tiếp tục thao tác");
                  return;
                }
                setCanhBaoBatBuoc("");
                setActiveTab(t.id);
              }}
              style={{
                padding: "12px 18px", fontSize: 13, fontFamily: F,
                fontWeight: isActive ? 700 : 500,
                background: "none", border: "none", cursor: "pointer",
                color: isActive ? RED : MUTED,
                borderBottom: isActive ? `2px solid ${RED}` : "2px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {canhBaoBatBuoc && (
          <div style={{ margin: "12px 20px 0", padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, color: "#b91c1c", fontFamily: F }}>
            {canhBaoBatBuoc}
          </div>
        )}
        {activeTab === "thong-tin" && <TabThongTin detail={detail} userRole={userRole} onRequiredChange={setDuThongTinBatBuoc} />}
        {activeTab === "danh-sach-don" && <TabDanhSachDon detail={detail} />}
        {activeTab === "phan-cong" && <TabPhanCong detail={detail} />}
        {activeTab === "muon-tra-ho-so" && <TabMuonTraHoSo detail={detail} />}
        {activeTab === "to-trinh" && <TabToTrinh detail={detail} userRole={userRole} />}
        {activeTab === "giai-quyet-vb" && <TabGiaiQuyetVB detail={detail} />}
        {activeTab === "tai-lieu" && <TabTaiLieu detail={detail} />}
        {activeTab === "ho-so-luu-tru" && <TabHoSoLuuTru detail={detail} />}
      </div>
    </div>
  );
}
