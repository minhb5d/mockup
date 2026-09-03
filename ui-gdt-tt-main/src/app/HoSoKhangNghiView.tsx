import React, { useState } from "react";
import {
  Eye, RotateCcw, X, CheckCircle2, Send, Printer,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, type UserRoleType } from "./shared";
import { SearchFilterPanel } from "./SearchFilterPanel";

// ── Modal Trả hồ sơ ───────────────────────────────────────────────────────────
function ModalTraHoSo({ onClose, onConfirm }: { onClose: () => void; onConfirm: (lyDo: string) => void }) {
  const [ngayThaoTac, setNgayThaoTac] = useState("07/08/2026");
  const [canBo, setCanBo] = useState("Lý Thái Phúc");
  const [lyDo, setLyDo] = useState("");

  const handleConfirmTra = () => {
    if (!lyDo.trim()) {
      alert("Vui lòng nhập lý do trả hồ sơ!");
      return;
    }
    onConfirm(lyDo);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontFamily: F }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Trả lại hồ sơ kháng nghị đến
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
          <button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </button>
        </div>
      </div>
    </div>
  );
}





// ── Component Hồ sơ kháng nghị View ──────────────────────────────────────────
export function HoSoKhangNghiView({ userRole }: { userRole?: UserRoleType }) {
  const [activeSubTab, setActiveSubTab] = useState<"di" | "den">("di");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showTraHoSoModal, setShowTraHoSoModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [listDi, setListDi] = useState([
    {
      id: 1,
      maDon: "KN-DI-001",
      soKhangNghi: "10/2026/QĐKN",
      ngayKhangNghi: "25/07/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      maVanThuDen: "VT-2026/0590",
      ngayVanThuDen: "21/07/2026",
      soBA: "124/2026/HS-ST",
      ngayBA: "20/07/2026",
      toaRaBanAn: "TAND tỉnh Hà Nam",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Đặng Thị Dương",
      donViNhan: "Viện kiểm sát nhân dân tối cao",
      ngayChuyen: "22/07/2026",
      trangThai: "Đã chuyển",
    },
    {
      id: 2,
      maDon: "KN-DI-002",
      soKhangNghi: "12/2026/QĐKN",
      ngayKhangNghi: "18/06/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      maVanThuDen: "VT-2026/0412",
      ngayVanThuDen: "17/06/2026",
      soBA: "102/2026/DS-ST",
      ngayBA: "18/06/2026",
      toaRaBanAn: "TAND quận Hoàn Kiếm, Hà Nội",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Dương Thu Hằng",
      donViNhan: "Tòa án nhân dân TP Hà Nội",
      ngayChuyen: "25/07/2026",
      trangThai: "Chưa chuyển",
    },
    {
      id: 3,
      maDon: "KN-DI-003",
      soKhangNghi: "15/2026/QĐKN-HC",
      ngayKhangNghi: "10/05/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      maVanThuDen: "VT-2026/0298",
      ngayVanThuDen: "09/05/2026",
      soBA: "45/2026/HC-PT",
      ngayBA: "10/05/2026",
      toaRaBanAn: "TAND tỉnh Vĩnh Phúc",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Phạm Văn Cường",
      donViNhan: "Tòa án nhân dân tỉnh Vĩnh Phúc",
      ngayChuyen: "--",
      trangThai: "Chưa chuyển",
    },
    {
      id: 4,
      maDon: "KN-DI-004",
      soKhangNghi: "19/2026/QĐKN",
      ngayKhangNghi: "05/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      maVanThuDen: "VT-2026/0655",
      ngayVanThuDen: "02/08/2026",
      soBA: "78/2026/HS-PT",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND tỉnh Bắc Ninh",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Nguyễn Văn Tuấn",
      donViNhan: "Tòa án nhân dân Cấp cao tại Hà Nội",
      ngayChuyen: "--",
      trangThai: "Chưa chuyển",
    },
    {
      id: 5,
      maDon: "KN-DI-005",
      soKhangNghi: "22/2026/QĐKN",
      ngayKhangNghi: "06/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      maVanThuDen: "VT-2026/0680",
      ngayVanThuDen: "04/08/2026",
      soBA: "115/2026/DS-ST",
      ngayBA: "30/07/2026",
      toaRaBanAn: "TAND tỉnh Bình Dương",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Công ty Cổ phần Thương mại Sài Gòn",
      donViNhan: "Viện kiểm sát nhân dân tối cao",
      ngayChuyen: "--",
      trangThai: "Chưa chuyển",
    },
    {
      id: 6,
      maDon: "KN-DI-006",
      soKhangNghi: "25/2026/QĐKN",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      maVanThuDen: "VT-2026/0710",
      ngayVanThuDen: "05/08/2026",
      soBA: "33/2026/KDTM-PT",
      ngayBA: "01/08/2026",
      toaRaBanAn: "TAND TP Hồ Chí Minh",
      loaiAn: "Kinh doanh thương mại",
      nguoiKhieuNai: "Tập đoàn Đầu tư & Phát triển Đông Dương",
      donViNhan: "Tòa án nhân dân Cấp cao tại TP.HCM",
      ngayChuyen: "--",
      trangThai: "Chưa chuyển",
    },
    {
      id: 7,
      maDon: "KN-DI-007",
      soKhangNghi: "28/2026/QĐKN-HC",
      ngayKhangNghi: "02/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      maVanThuDen: "VT-2026/0730",
      ngayVanThuDen: "30/07/2026",
      soBA: "62/2026/HC-ST",
      ngayBA: "25/07/2026",
      toaRaBanAn: "TAND tỉnh Khánh Hòa",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Hoàng Văn Minh",
      donViNhan: "Tòa án nhân dân tỉnh Khánh Hòa",
      ngayChuyen: "05/08/2026",
      trangThai: "Chưa chuyển",
    },
    {
      id: 8,
      maDon: "KN-DI-008",
      soKhangNghi: "32/2026/QĐKN-HC",
      ngayKhangNghi: "04/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      maVanThuDen: "VT-2026/0755",
      ngayVanThuDen: "01/08/2026",
      soBA: "18/2026/HC-PT",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND TP Hà Nội",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Đinh Xuân Bách",
      donViNhan: "Viện kiểm sát nhân dân tối cao",
      ngayChuyen: "06/08/2026",
      trangThai: "Đã chuyển",
    },
  ]);

  const handleChuyenHoSoDi = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 hồ sơ kháng nghị để thực hiện chuyển!");
      return;
    }

    const selectedRecords = listDi.filter(item => selectedItems.includes(item.id));

    setListDi(prev =>
      prev.map(item =>
        selectedItems.includes(item.id)
          ? {
              ...item,
              trangThai: "Đã chuyển",
              ngayChuyen: item.ngayChuyen === "--" ? "07/08/2026" : item.ngayChuyen,
              maVanThuDi: (item as any).maVanThuDi || `VT-DI-${String(item.id).padStart(4, "0")}/2026`,
              ngayVanThuDi: (item as any).ngayVanThuDi || "07/08/2026",
              nguoiPhatHanh: (item as any).nguoiPhatHanh || "Cán bộ Văn thư",
            }
          : item
      )
    );

    alert(`Đã chuyển hồ sơ kháng nghị thành công! Trạng thái cập nhật sang "Đã chuyển".`);
  };


  const handleChuyenMotHoSo = (row: any) => {
    setListDi(prev => prev.map(item => item.id === row.id ? {
      ...item,
      trangThai: "Đã chuyển",
      ngayChuyen: item.ngayChuyen === "--" ? "07/08/2026" : item.ngayChuyen,
      maVanThuDi: (item as any).maVanThuDi || `VT-DI-${String(item.id).padStart(4, "0")}/2026`,
      ngayVanThuDi: (item as any).ngayVanThuDi || "07/08/2026",
      nguoiPhatHanh: (item as any).nguoiPhatHanh || "Cán bộ Văn thư",
    } : item));
    alert("Đã chuyển hồ sơ kháng nghị thành công.");
  };

  const [listDen, setListDen] = useState([
    {
      id: 101,
      maDon: "KN-DEN-001",
      soKhangNghi: "08/2026/QĐKN",
      ngayKhangNghi: "03/07/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Bắc Ninh",
      maVanThuDen: "VT-2026/0582",
      ngayVanThuDen: "20/07/2026",
      soBA: "236/2026/HS-PT",
      ngayBA: "03/07/2026",
      toaRaBanAn: "TAND tỉnh Bắc Ninh",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Nguyễn Văn Bình",
      donViGui: "Viện kiểm sát nhân dân tỉnh Bắc Ninh",
      ngayNhan: "24/07/2026",
      nguoiNhan: "Lý Thái Phúc",
      trangThai: "Đã nhận",
    },
    {
      id: 102,
      maDon: "KN-DEN-002",
      soKhangNghi: "14/2026/QĐKN",
      ngayKhangNghi: "25/04/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tỉnh Bắc Ninh",
      maVanThuDen: "VT-2026/0614",
      ngayVanThuDen: "24/04/2026",
      soBA: "18/2026/KDTM-ST",
      ngayBA: "25/04/2026",
      toaRaBanAn: "TAND tỉnh Bắc Ninh",
      loaiAn: "Kinh doanh thương mại",
      nguoiKhieuNai: "Công ty Cổ phần Thương mại Á Châu",
      donViGui: "TAND tỉnh Bắc Ninh",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 103,
      maDon: "KN-DEN-003",
      soKhangNghi: "21/2026/QĐKN",
      ngayKhangNghi: "12/03/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân quận Đống Đa",
      maVanThuDen: "VT-2026/0341",
      ngayVanThuDen: "11/03/2026",
      soBA: "88/2026/HNGĐ-PT",
      ngayBA: "12/03/2026",
      toaRaBanAn: "TAND quận Đống Đa, Hà Nội",
      loaiAn: "Hôn nhân gia đình",
      nguoiKhieuNai: "Lê Thị Mai",
      donViGui: "Văn phòng Luật sư Trí Đức",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 104,
      maDon: "KN-DEN-004",
      soKhangNghi: "27/2026/QĐKN",
      ngayKhangNghi: "01/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      maVanThuDen: "VT-2026/0698",
      ngayVanThuDen: "31/07/2026",
      soBA: "174/2026/HS-ST",
      ngayBA: "28/07/2026",
      toaRaBanAn: "TAND tỉnh Hưng Yên",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Trần Đình Phước",
      donViGui: "Viện kiểm sát nhân dân tối cao",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 105,
      maDon: "KN-DEN-005",
      soKhangNghi: "31/2026/QĐKN",
      ngayKhangNghi: "04/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tỉnh Bình Dương",
      maVanThuDen: "VT-2026/0724",
      ngayVanThuDen: "03/08/2026",
      soBA: "55/2026/DS-PT",
      ngayBA: "02/08/2026",
      toaRaBanAn: "TAND tỉnh Bình Dương",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Công ty TNHH Xây dựng Thịnh Phát",
      donViGui: "TAND tỉnh Bình Dương",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 106,
      maDon: "KN-DEN-006",
      soKhangNghi: "33/2026/QĐKN-HC",
      ngayKhangNghi: "05/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Đà Nẵng",
      maVanThuDen: "VT-2026/0741",
      ngayVanThuDen: "04/08/2026",
      soBA: "62/2026/HC-ST",
      ngayBA: "01/08/2026",
      toaRaBanAn: "TAND TP Đà Nẵng",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Phạm Ngọc Ánh",
      donViGui: "Viện kiểm sát nhân dân tỉnh Đà Nẵng",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 107,
      maDon: "KN-DEN-007",
      soKhangNghi: "36/2026/QĐKN",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tỉnh Long An",
      maVanThuDen: "VT-2026/0762",
      ngayVanThuDen: "06/08/2026",
      soBA: "22/2026/LĐ-PT",
      ngayBA: "05/08/2026",
      toaRaBanAn: "TAND tỉnh Long An",
      loaiAn: "Lao động",
      nguoiKhieuNai: "Nguyễn Thanh Tùng",
      donViGui: "TAND tỉnh Long An",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 108,
      maDon: "KN-DEN-008",
      soKhangNghi: "38/2026/QĐKN",
      ngayKhangNghi: "08/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Quảng Nam",
      maVanThuDen: "VT-2026/0785",
      ngayVanThuDen: "07/08/2026",
      soBA: "91/2026/HS-ST",
      ngayBA: "04/08/2026",
      toaRaBanAn: "TAND tỉnh Quảng Nam",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Lê Minh Khải",
      donViGui: "Viện kiểm sát nhân dân tỉnh Quảng Nam",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 109,
      maDon: "KN-DEN-009",
      soKhangNghi: "41/2026/QĐKN-HC",
      ngayKhangNghi: "06/08/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tỉnh Lâm Đồng",
      maVanThuDen: "VT-2026/0792",
      ngayVanThuDen: "05/08/2026",
      soBA: "29/2026/HC-PT",
      ngayBA: "02/08/2026",
      toaRaBanAn: "TAND tỉnh Lâm Đồng",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Công ty TNHH Phương Đông",
      donViGui: "TAND tỉnh Lâm Đồng",
      ngayNhan: "07/08/2026",
      nguoiNhan: "Nguyễn Tiến Mạnh",
      trangThai: "Đã nhận",
    },
    {
      id: 110,
      maDon: "KN-DEN-010",
      soKhangNghi: "45/2026/QĐKN-HC",
      ngayKhangNghi: "07/08/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Quảng Ninh",
      maVanThuDen: "VT-2026/0815",
      ngayVanThuDen: "06/08/2026",
      soBA: "38/2026/HC-ST",
      ngayBA: "03/08/2026",
      toaRaBanAn: "TAND tỉnh Quảng Ninh",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Nguyễn Tiến Dũng",
      donViGui: "Viện kiểm sát nhân dân tỉnh Quảng Ninh",
      ngayNhan: "08/08/2026",
      nguoiNhan: "Trần Quốc Hành",
      trangThai: "Đã nhận",
    },
  ]);

  const handleOpenNhanHoSo = (rowTarget?: any) => {
    let targetIds: number[] = [];

    if (rowTarget && rowTarget.id) {
      targetIds = [rowTarget.id];
    } else if (selectedItems.length > 0) {
      targetIds = selectedItems;
    } else {
      const choNhan = listDen.find(item => item.trangThai === "Chờ nhận");
      if (choNhan) {
        targetIds = [choNhan.id];
      } else {
        alert("Tất cả các hồ sơ kháng nghị đến đều đã được nhận!");
        return;
      }
    }

    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã nhận",
            nguoiNhan: item.nguoiNhan === "--" || !item.nguoiNhan ? "Lý Thái Phúc" : item.nguoiNhan,
            ngayNhan: item.ngayNhan === "--" || !item.ngayNhan ? "07/08/2026" : item.ngayNhan,
          }
          : item
      )
    );

    alert("Đã nhận hồ sơ kháng nghị thành công!");
  };

  const handleConfirmTraHoSo = (lyDo: string) => {
    const targetIds = selectedRecord ? [selectedRecord.id] : (selectedItems.length > 0 ? selectedItems : [102]);
    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã trả",
          }
          : item
      )
    );
    setShowTraHoSoModal(false);
    alert(`Đã trả lại ${targetIds.length} hồ sơ kháng nghị đến thành công!\nLý do: ${lyDo}\nTrạng thái cập nhật sang "Đã trả".`);
  };

  const filteredDi = listDi;

  const filteredDen = listDen;

  const currentList = activeSubTab === "di" ? filteredDi : filteredDen;

  const paginBtn: React.CSSProperties = {
    padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "auto", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F }}>
        Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị
      </div>

      {/* 2 Sub-Tabs Header */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0 }}>
        <button
          onClick={() => setActiveSubTab("di")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "di" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "di" ? RED : MUTED,
            borderBottom: activeSubTab === "di" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đi
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "di" ? RED : "#e5e7eb",
            color: activeSubTab === "di" ? "#fff" : MUTED, fontWeight: 600,
          }}>{filteredDi.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("den")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "den" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "den" ? RED : MUTED,
            borderBottom: activeSubTab === "den" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đến
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "den" ? RED : "#e5e7eb",
            color: activeSubTab === "den" ? "#fff" : MUTED, fontWeight: 600,
          }}>{filteredDen.length}</span>
        </button>
      </div>

      {/* Search filter panel */}
      <SearchFilterPanel mode="hskn" expanded={filterExpanded} onToggle={() => setFilterExpanded(v => !v)} />

      {/* Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
            {activeSubTab === "di" ? "Danh sách Hồ sơ kháng nghị" : "Danh sách Hồ sơ kháng nghị"}
          </span>
          <Badge color="#1e40af" bg="#dbeafe">{currentList.length} hồ sơ</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activeSubTab === "di" && (
            <>
              

              

              <button
                onClick={handleChuyenHoSoDi}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Chuyển hồ sơ
              </button>
            </>
          )}

          {activeSubTab === "den" && (
            <>
              <button
                onClick={() => handleOpenNhanHoSo()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#0f766e", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                <CheckCircle2 size={14} /> Nhận hồ sơ
              </button>

              <button
                onClick={() => { setSelectedRecord(null); setShowTraHoSoModal(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#fff", color: RED,
                  border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                <RotateCcw size={14} /> Trả hồ sơ
              </button>
            </>
          )}

          <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={14} /> In danh sách
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, padding: "12px 20px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ ...TH_STYLE, width: 40, textAlign: "center" }}>
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) setSelectedItems(currentList.map(item => item.id));
                  else setSelectedItems([]);
                }} />
              </th>
              <th style={{ ...TH_STYLE, width: 45, textAlign: "center" }}>STT</th>
              <th style={{ ...TH_STYLE, width: 145 }}>{activeSubTab === "di" ? "THÔNG TIN VĂN THƯ ĐI" : "MÃ VĂN THƯ ĐẾN"}</th>
              <th style={{ ...TH_STYLE, width: 160 }}>THÔNG TIN KHÁNG NGHỊ</th>
              <th style={{ ...TH_STYLE, width: 145 }}>SỐ BẢN ÁN / QĐ</th>
              <th style={{ ...TH_STYLE, width: 210 }}>{activeSubTab === "di" ? "ĐƠN VỊ NHẬN / THÔNG TIN CHUYỂN" : "ĐƠN VỊ GỬI / NGƯỜI NHẬN"}</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((row, idx) => (
              <tr
                key={row.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(p => [...p, row.id]);
                      else setSelectedItems(p => p.filter(i => i !== row.id));
                    }}
                  />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>{idx + 1}</td>

                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  {activeSubTab === "di" ? (
                    <>
                      <div style={{ color: "#0f766e", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Mã VT đi: </span>{(row as any).maVanThuDi || "Chưa phát hành"}</div>
                      <div style={{ fontSize: 11, color: TEXT, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày VT đi: </span>{(row as any).ngayVanThuDi || "-"}</div>
                      <div style={{ fontSize: 11, color: TEXT, marginTop: 2 }}><span style={{ color: MUTED }}>Người phát hành: </span>{(row as any).nguoiPhatHanh || "-"}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: "#0f766e", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Mã VT: </span>{(row as any).maVanThuDen || "VT-2026/0582"}</div>
                      <div style={{ fontSize: 11, color: TEXT, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày VT: </span>{(row as any).ngayVanThuDen || "20/07/2026"}</div>
                    </>
                  )}
                </td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: RED, fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số KN: </span>{(row as any).soKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày KN: </span>{(row as any).ngayKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Người KN: </span>{(row as any).nguoiKhangNghi}</div>
                </td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: "#2563eb", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số BA/QĐ: </span>{row.soBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày bản án: </span>{row.ngayBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Tòa ra bản án: </span>{(row as any).toaRaBanAn}</div>
                </td>
                <td style={{ ...TD_STYLE, color: TEXT, fontSize: 11, fontFamily: F }}>
                  {activeSubTab === "di" ? (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị nhận:</b> {(row as any).donViNhan || "-"}</div>
                      <div><b>Ngày chuyển:</b> {(row as any).ngayChuyen || "-"}</div>
                    </>
                  ) : (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị gửi:</b> {(row as any).donViGui}</div>
                      <div><b style={{ fontFamily: F }}>Người nhận:</b> {(row as any).nguoiNhan} ({(row as any).ngayNhan})</div>
                    </>
                  )}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <Badge
                    color={
                      row.trangThai.includes("Đã")
                        ? "#065f46"
                        : row.trangThai === "Chưa chuyển"
                          ? "#991b1b"
                          : "#92400e"
                    }
                    bg={
                      row.trangThai.includes("Đã")
                        ? "#d1fae5"
                        : row.trangThai === "Chưa chuyển"
                          ? "#fee2e2"
                          : "#fef3c7"
                    }
                  >
                    {row.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {activeSubTab === "di" ? (
                      <>
                        <button onClick={() => alert(`Xem hồ sơ kháng nghị ${row.soKhangNghi}`)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem/Sửa"><Eye size={14} color="#0284c7" /></button>
                        {row.trangThai !== "Đã chuyển" && (
                          <button onClick={() => handleChuyenMotHoSo(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Chuyển hồ sơ"><Send size={14} color={RED} /></button>
                        )}
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleOpenNhanHoSo(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Tiếp nhận hồ sơ"><CheckCircle2 size={14} color="#0f766e" /></button>
                        <button onClick={() => { setSelectedRecord(row); setShowTraHoSoModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Trả lại hồ sơ"><RotateCcw size={14} color={RED} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
        <span>Hiển thị 1–{currentList.length} trong tổng {currentList.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>

      {/* Modal Trả lại hồ sơ */}
      {showTraHoSoModal && <ModalTraHoSo onClose={() => setShowTraHoSoModal(false)} onConfirm={handleConfirmTraHoSo} />}
    </div>
  );
}

export default HoSoKhangNghiView;
