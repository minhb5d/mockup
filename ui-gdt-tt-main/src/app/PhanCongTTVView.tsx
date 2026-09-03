import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  X,
  UserCheck,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";
import { PlatformModalFrame, TableEmptyState } from "./components/platform";

const DANH_SACH_TTV = [
  "Nguyễn Thị Thúy Hường - 12/03/1984 / Thẩm tra viên",
  "Vũ Xuân Hiền - 06/09/1981 / Thẩm tra viên chính",
  "Nguyễn Thị Hường - 20/11/1986 / Thẩm tra viên",
  "Nguyễn Đức Thiện - 14/02/1983 / Thẩm tra viên",
  "Vũ Diệu Thúy - 01/07/1988 / Thẩm tra viên",
  "Đặng Thị Mai - 18/04/1985 / Thẩm tra viên",
  "Trần Văn Hưng - 23/08/1982 / Thẩm tra viên chính",
  "Lê Thị Lan - 05/05/1987 / Thẩm tra viên",
  "Hoàng Ngọc Chiêu - 10/10/1980 / Thẩm tra viên cao cấp",
  "Đinh Thị Vân Anh - 09/01/1989 / Thẩm tra viên",
  // CR28/8: danh sách TTV phải bao gồm cả TTV biệt phái
  "Bùi Thanh Tùng - 22/07/1990 / Thẩm tra viên (biệt phái)",
  "Phạm Hồng Nhung - 03/12/1986 / Thẩm tra viên (biệt phái)",
];

const DANH_SACH_LANH_DAO = [
  "Phạm Thị Bích Ngọc - 04/04/1977 / Phó Vụ trưởng, Thẩm phán",
  "Lê Thị Thu Hiền - 16/08/1978 / Phó Vụ trưởng, Thẩm phán",
  "Nguyễn Như Thắng - 11/11/1973 / Vụ trưởng, Thẩm phán",
  "Nguyễn Biên Thùy - 21/02/1975 / Phó Vụ trưởng, Thẩm phán",
  "Trần Hồng Hà - 19/06/1974 / Vụ trưởng, Thẩm phán",
  "Nguyễn Văn Cường - 30/09/1976 / Phó Vụ trưởng, Thẩm phán",
  // CR28/8: danh sách TP phải bao gồm cả TP biệt phái
  "Đỗ Mạnh Cường - 14/05/1979 / Thẩm phán (biệt phái)",
];

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const LD_BY_TTV: Record<string, string> = {
  "Nguyễn Thị Thúy Hường": DANH_SACH_LANH_DAO[0],
  "Vũ Xuân Hiền": DANH_SACH_LANH_DAO[1],
  "Nguyễn Thị Hường": DANH_SACH_LANH_DAO[2],
  "Nguyễn Đức Thiện": DANH_SACH_LANH_DAO[2],
  "Vũ Diệu Thúy": DANH_SACH_LANH_DAO[3],
  "Đặng Thị Mai": DANH_SACH_LANH_DAO[0],
};
const getName = (v: string) => v.split(" - ")[0];

// Drawio 2.6 – metadata phục vụ phân công tự động TTV/LĐV.
// Không phân công cán bộ đang nghỉ/không đủ điều kiện; ưu tiên người đã xử lý vụ việc trước đó,
// sau đó cân bằng số vụ đang xử lý và cuối cùng theo thứ tự tên tiếng Việt.
type TTVMeta = { value: string; currentCases: number; unavailableReason?: string };
const TTV_META: TTVMeta[] = DANH_SACH_TTV.map((value, index) => ({
  value,
  currentCases: [6, 3, 5, 4, 2, 7, 3, 5, 4, 6][index] ?? 0,
  unavailableReason: index === 7 ? "Đang tham gia đào tạo trên 01 tháng" : undefined,
}));

const chooseTTVByDrawio = (row: CaseRow, dynamicLoad: Record<string, number>): string => {
  const previous = row.previousTTV;
  const previousMeta = previous ? TTV_META.find(m => m.value === previous) : undefined;
  if (previousMeta && !previousMeta.unavailableReason) return previousMeta.value;

  const eligible = TTV_META
    .filter(m => !m.unavailableReason)
    .sort((a, b) => {
      const loadA = a.currentCases + (dynamicLoad[a.value] || 0);
      const loadB = b.currentCases + (dynamicLoad[b.value] || 0);
      if (loadA !== loadB) return loadA - loadB;
      return getName(a.value).localeCompare(getName(b.value), "vi");
    });
  return eligible[0]?.value || DANH_SACH_TTV[0];
};
const toInputDate = (v: string) => {
  if (!v || v === "-") return TODAY_ISO;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}` : TODAY_ISO;
};

interface CaseRow {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  giaiDoan: string;
  qhpl: string;
  ndkn: string;
  nbk: string;
  ngayNhanTHS: string;
  giaiDoanPC: string;
  ngayPCTTV: string;
  ttv: string;
  ngayPCLD: string;
  lanhDao: string;
  hasVuGiaiQuyet?: boolean;
  donChoPheDuyet?: boolean;
  previousTTV?: string;
  previousLD?: string;
  canhBaoThoiHieu?: string;
  isKhieuNai?: boolean;
}

const INITIAL_CHUA_PHAN_CONG: CaseRow[] = [
  {
    id: 1,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp về thừa kế tài sản",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 2,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 3,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "thu",
    ngayBA: "07/08/2026",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "Xử phạt vi phạm hành chính",
    ndkn: "f",
    nbk: "sdfdsf",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 4,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "-",
    ngayBA: "-",
    toaAn: "-",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 5,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "108/2026/HS-ST",
    ngayBA: "12/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Hà Nam",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tội cố ý gây thương tích",
    ndkn: "Nguyễn Văn Tuấn",
    nbk: "Vũ Thị Hương",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 6,
    soThuLy: "-",
    ngayThuLy: "-",
    soBA: "42/2026/HC-ST",
    ngayBA: "19/05/2026",
    toaAn: "Tòa án nhân dân TP Đà Nẵng",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện quyết định thu hồi đất",
    ndkn: "Lê Văn Hùng",
    nbk: "UBND quận Hải Châu",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
].map((r, i) => ({
  ...r,
  hasVuGiaiQuyet: i % 2 === 0,
  donChoPheDuyet: i % 3 === 1,
  previousTTV: i % 2 === 0 ? DANH_SACH_TTV[(i + 1) % DANH_SACH_TTV.length] : undefined,
  previousLD: i % 2 === 0 ? DANH_SACH_LANH_DAO[i % DANH_SACH_LANH_DAO.length] : undefined,
  canhBaoThoiHieu: i === 0 ? "Còn 18 ngày" : i === 2 ? "Còn 27 ngày" : undefined,
  isKhieuNai: i === 3,
}));

const INITIAL_DA_PHAN_CONG: CaseRow[] = [
  {
    id: 101,
    soThuLy: "3539",
    ngayThuLy: "25/05/2026",
    soBA: "3504",
    ngayBA: "25/05/2026",
    toaAn: "Tòa án nhân dân tỉnh An Giang",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Nguyễn Văn Rô",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Thị Thúy Hường",
    ngayPCLD: "25/06/2026",
    lanhDao: "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  },
  {
    id: 102,
    soThuLy: "2328917",
    ngayThuLy: "02/06/2026",
    soBA: "32",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân khu vực 5 - Bắc Ninh",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Vũ Xuân Hiền",
    ngayPCLD: "25/06/2026",
    lanhDao: "Lê Thị Thu Hiền - Phó Vụ trưởng",
  },
  {
    id: 103,
    soThuLy: "239872",
    ngayThuLy: "27/05/2026",
    soBA: "2809",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân khu vực 1 - An Giang",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Hoàng Anh Test",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Thị Hường",
    ngayPCLD: "25/06/2026",
    lanhDao: "Nguyễn Như Thắng - Vụ trưởng",
  },
  {
    id: 104,
    soThuLy: "23715",
    ngayThuLy: "27/05/2026",
    soBA: "GĐT-2026-0158",
    ngayBA: "23/05/2026",
    toaAn: "Tòa án nhân dân thành phố Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "",
    ndkn: "Nguyễn Văn Bình",
    nbk: "",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "25/06/2026",
    ttv: "Nguyễn Đức Thiện",
    ngayPCLD: "25/06/2026",
    lanhDao: "Nguyễn Như Thắng - Vụ trưởng",
  },
  {
    id: 105,
    soThuLy: "5468112",
    ngayThuLy: "08/06/2026",
    soBA: "78/2026/DS-ST",
    ngayBA: "01/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp đất đai",
    ndkn: "Đỗ Văn Hải",
    nbk: "Trần Thị Nga",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "28/06/2026",
    ttv: "Vũ Diệu Thúy",
    ngayPCLD: "28/06/2026",
    lanhDao: "Nguyễn Biên Thùy - Phó Vụ trưởng",
  },
  {
    id: 106,
    soThuLy: "5468190",
    ngayThuLy: "15/06/2026",
    soBA: "112/2026/HC-ST",
    ngayBA: "10/06/2026",
    toaAn: "Tòa án nhân dân TP Cần Thơ",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện bồi thường",
    ndkn: "Lê Thị Tuyết",
    nbk: "UBND TP Cần Thơ",
    ngayNhanTHS: "-",
    giaiDoanPC: "GĐ Xét xử GĐT, TT",
    ngayPCTTV: "30/06/2026",
    ttv: "Đặng Thị Mai",
    ngayPCLD: "30/06/2026",
    lanhDao: "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  },
].map((r, i) => ({ ...r, hasVuGiaiQuyet: i % 2 === 0, previousTTV: r.ttv, previousLD: r.lanhDao, canhBaoThoiHieu: i === 1 ? "Còn 22 ngày" : undefined }));

export function PhanCongTTVView() {
  const [activeTab, setActiveTab] = useState<"chua-phan-cong" | "da-phan-cong">("chua-phan-cong");
  const [phanCongMode, setPhanCongMode] = useState<"ngau-nhien" | "chi-dinh">("ngau-nhien");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Form Filter states
  const [fNgayTLTu, setFNgayTLTu] = useState("");
  const [fNgayTLDen, setFNgayTLDen] = useState("");
  const [fSoTL, setFSoTL] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fGiaiDoan, setFGiaiDoan] = useState("");
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fNguoiKN, setFNguoiKN] = useState("");
  const [fBiDon, setFBiDon] = useState("");
  const [fTTV, setFTTV] = useState("");
  const [fLanhDao, setFLanhDao] = useState("");
  const [fHinhThucPC, setFHinhThucPC] = useState("Theo đơn");
  const [fTinhTrang, setFTinhTrang] = useState("");

  // Table row data
  const [chuaPCRows, setChuaPCRows] = useState<CaseRow[]>(INITIAL_CHUA_PHAN_CONG);
  const [daPCRows, setDaPCRows] = useState<CaseRow[]>(INITIAL_DA_PHAN_CONG);
  const [dirtyIds, setDirtyIds] = useState<number[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);

  // Selected row checkbox IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Popups
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CaseRow | null>(null);

  // Modal assign inputs
  const [assignTTV, setAssignTTV] = useState(DANH_SACH_TTV[0]);
  const [assignLD, setAssignLD] = useState(DANH_SACH_LANH_DAO[0]);

  const updateRow = (id: number, patch: Partial<CaseRow>) => {
    const setter = activeTab === "chua-phan-cong" ? setChuaPCRows : setDaPCRows;
    setter((rows) => rows.map((r) => r.id === id ? { ...r, ...patch } : r));
    setDirtyIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  };

  const handleResetFilters = () => {
    setFNgayTLTu("");
    setFNgayTLDen("");
    setFSoTL("");
    setFLoaiAn("");
    setFGiaiDoan("");
    setFToaRaBA("");
    setFSoBA("");
    setFNgayBA("");
    setFNguoiKN("");
    setFBiDon("");
    setFTTV("");
    setFLanhDao("");
    setFTinhTrang("");
    setFilterApplied(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, list: CaseRow[]) => {
    if (e.target.checked) {
      setSelectedIds(list.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecutePhanCong = () => {
    const idsToAssign = phanCongMode === "ngau-nhien" ? chuaPCRows.map(r => r.id) : selectedIds;
    if (idsToAssign.length === 0) {
      alert("Không có vụ việc được Phân công TTV/LĐ");
      return;
    }
    if (phanCongMode === "ngau-nhien") {
      const dynamicLoad: Record<string, number> = {};
      const assignedRows = chuaPCRows.map((r) => {
        const ttv = chooseTTVByDrawio(r, dynamicLoad);
        dynamicLoad[ttv] = (dynamicLoad[ttv] || 0) + 1;
        const ld = r.previousTTV === ttv && r.previousLD
          ? r.previousLD
          : (LD_BY_TTV[getName(ttv)] || DANH_SACH_LANH_DAO[0]);
        return { ...r, giaiDoanPC: r.isKhieuNai ? "Giải quyết khiếu nại" : "Giai đoạn giải quyết đơn", ngayPCTTV: TODAY_ISO, ttv, ngayPCLD: TODAY_ISO, lanhDao: ld };
      });
      setChuaPCRows([]); setDaPCRows(prev => [...assignedRows, ...prev]); setSelectedIds([]); setDirtyIds([]);
      try { localStorage.setItem("gdt-phan-cong-ttv", JSON.stringify(assignedRows)); } catch {}
      alert("Phân công TTV/LĐ thành công"); setActiveTab("da-phan-cong"); return;
    }
    // Chỉ định: cho phép chỉnh từng dòng trước khi lưu; nếu chưa chỉnh thì mở modal hỗ trợ.
    setShowAssignModal(true);
  };

  const handleConfirmChiDinh = () => {
    if (!selectedIds.length) { alert("Không có vụ việc được Phân công TTV/LĐ"); return; }
    const ldAuto = LD_BY_TTV[getName(assignTTV)] || assignLD;
    const assignedRows: CaseRow[] = []; const remainingRows: CaseRow[] = [];
    chuaPCRows.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        const allowedTTV = r.hasVuGiaiQuyet && r.previousTTV ? r.previousTTV : assignTTV;
        assignedRows.push({ ...r, giaiDoanPC: r.isKhieuNai ? "Giải quyết khiếu nại" : "Giai đoạn giải quyết đơn", ngayPCTTV: TODAY_ISO, ttv: allowedTTV, ngayPCLD: TODAY_ISO, lanhDao: allowedTTV === assignTTV ? ldAuto : (r.previousLD || ldAuto) });
      } else remainingRows.push(r);
    });
    if (assignedRows.some(r => !r.ngayPCTTV || !r.ttv || !r.ngayPCLD || !r.lanhDao || [r.ngayPCTTV,r.ttv,r.ngayPCLD,r.lanhDao].includes("-"))) { alert("Điền đầy đủ thông tin trước khi lưu phân công"); return; }
    setChuaPCRows(remainingRows); setDaPCRows(prev => [...assignedRows, ...prev]); setSelectedIds([]); setShowAssignModal(false); setDirtyIds([]);
    try { localStorage.setItem("gdt-phan-cong-ttv", JSON.stringify(assignedRows)); } catch {}
    alert("Phân công TTV/LĐ thành công"); setActiveTab("da-phan-cong");
  };

  const saveInlineAssignments = () => {
    const rows = activeTab === "chua-phan-cong" ? chuaPCRows.filter(r => dirtyIds.includes(r.id)) : daPCRows.filter(r => dirtyIds.includes(r.id));
    if (!rows.length) { alert("Không có vụ việc được Phân công TTV/LĐ"); return; }
    const invalid = rows.find(r => !r.ngayPCTTV || !r.ttv || !r.ngayPCLD || !r.lanhDao || [r.ngayPCTTV,r.ttv,r.ngayPCLD,r.lanhDao].includes("-"));
    if (invalid) { alert("Điền đầy đủ thông tin trước khi lưu phân công"); return; }
    if (activeTab === "chua-phan-cong") {
      setChuaPCRows(prev => prev.filter(r => !dirtyIds.includes(r.id)));
      setDaPCRows(prev => [...rows, ...prev]);
      setActiveTab("da-phan-cong");
    }
    try { localStorage.setItem("gdt-phan-cong-ttv", JSON.stringify(rows)); } catch {}
    setDirtyIds([]); alert("Phân công TTV/LĐ thành công");
  };

  const currentRowsRaw = activeTab === "chua-phan-cong" ? chuaPCRows : daPCRows;
  const currentRows = [...currentRowsRaw].filter(r => {
    if (!filterApplied) return true;
    return (!fSoTL || r.soThuLy.toLowerCase().includes(fSoTL.toLowerCase())) && (!fSoBA || r.soBA.toLowerCase().includes(fSoBA.toLowerCase())) && (!fNguoiKN || r.ndkn.toLowerCase().includes(fNguoiKN.toLowerCase())) && (!fBiDon || r.nbk.toLowerCase().includes(fBiDon.toLowerCase())) && (!fTTV || r.ttv.includes(getName(fTTV))) && (!fLanhDao || r.lanhDao.includes(getName(fLanhDao)));
  }).sort((a,b) => {
    const parse = (v:string) => { const m=v.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m ? new Date(+m[3],+m[2]-1,+m[1]).getTime() : 0; };
    return parse(b.ngayThuLy) - parse(a.ngayThuLy);
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
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

  const TH_CUSTOM: React.CSSProperties = {
    ...TH_STYLE,
    padding: "9px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#374151",
    background: "#f8fafc",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    whiteSpace: "nowrap",
  };

  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirtyIds.length) { e.preventDefault(); e.returnValue = "Bạn chưa lưu thay đổi phân công"; } };
    window.addEventListener("beforeunload", handler); return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyIds]);

  const requestTabChange = (next: "chua-phan-cong" | "da-phan-cong") => {
    if (dirtyIds.length && !confirm("Chưa Lưu phân công. Bạn có muốn Thoát mà không lưu?")) return;
    setDirtyIds([]); setActiveTab(next); setSelectedIds([]);
  };

  const TD_CUSTOM: React.CSSProperties = {
    ...TD_STYLE,
    padding: "10px 12px",
    fontSize: 12,
    color: TEXT,
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    verticalAlign: "top",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;/&nbsp; <span style={{ color: TEXT, fontWeight: 600 }}>Danh sách phân công TTV</span>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Danh sách phân công TTV
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${BORDER}`, background: "transparent" }}>
          <button
            onClick={() => {
              requestTabChange("chua-phan-cong");
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chua-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chua-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "chua-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Chưa phân công TTV
          </button>
          <button
            onClick={() => {
              requestTabChange("da-phan-cong");
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "da-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "da-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "da-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Đã phân công TTV
          </button>
        </div>

        {/* Hình thức phân công */}
        <div style={{ maxWidth: 260 }}>
          <label style={labelStyle}>Hình thức phân công</label>
          <select value={fHinhThucPC} onChange={(e) => setFHinhThucPC(e.target.value)} style={inputStyle}>
            <option value="Theo đơn">Theo đơn</option>
          </select>
        </div>

        {/* Radio Option for Tab 1 */}
        {activeTab === "chua-phan-cong" && (
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: -4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="phan-cong-mode"
                checked={phanCongMode === "ngau-nhien"}
                onChange={() => setPhanCongMode("ngau-nhien")}
                style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
              />
              Phân công ngẫu nhiên
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="phan-cong-mode"
                checked={phanCongMode === "chi-dinh"}
                onChange={() => setPhanCongMode("chi-dinh")}
                style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
              />
              Phân công chỉ định
            </label>
          </div>
        )}

        {/* Search Filter Box */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Ngày thụ lý</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      placeholder="Từ ngày"
                      value={fNgayTLTu}
                      onChange={(e) => setFNgayTLTu(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        placeholder="Đến ngày"
                        value={fNgayTLDen}
                        onChange={(e) => setFNgayTLDen(e.target.value)}
                        style={inputStyle}
                      />
                      <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Số thụ lý</label>
                  <input
                    placeholder="Số thụ lý"
                    value={fSoTL}
                    onChange={(e) => setFSoTL(e.target.value)}
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
                    <option value="">Vui lòng chọn</option>
                    {LOAI_AN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Giai đoạn</label>
                  <select
                    value={fGiaiDoan}
                    onChange={(e) => setFGiaiDoan(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Giai đoạn giải quyết đơn">Giai đoạn giải quyết đơn</option>
                    <option value="Giai đoạn xét xử GĐT,TT">Giai đoạn xét xử GĐT,TT</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Tòa ra bản án/quyết định</label>
                  <select
                    value={fToaRaBA}
                    onChange={(e) => setFToaRaBA(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn tòa ra bản án/quyết định</option>
                    <option value="TAND tối cao">Tòa án nhân dân tối cao</option>
                    <option value="TAND cấp cao tại Hà Nội">Tòa án nhân dân cấp cao tại Hà Nội</option>
                    <option value="TAND TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
                    <option value="TAND tỉnh Bắc Ninh">Tòa án nhân dân tỉnh Bắc Ninh</option>
                    <option value="TAND tỉnh An Giang">Tòa án nhân dân tỉnh An Giang</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Số bản án/quyết định</label>
                  <input
                    placeholder="Nhập số bản án/quyết định"
                    value={fSoBA}
                    onChange={(e) => setFSoBA(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày bản án/quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Vui lòng chọn"
                      value={fNgayBA}
                      onChange={(e) => setFNgayBA(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tình trạng vụ án</label>
                  <select
                    value={fTinhTrang}
                    onChange={(e) => setFTinhTrang(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Đang giải quyết">Đang giải quyết</option>
                    <option value="Đã có kết quả">Đã có kết quả</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Nguyên đơn/Người khiếu nại</label>
                  <input
                    placeholder="Nhập tên"
                    value={fNguoiKN}
                    onChange={(e) => setFNguoiKN(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Bị đơn/Bị cáo</label>
                  <input
                    placeholder="Nhập tên"
                    value={fBiDon}
                    onChange={(e) => setFBiDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {activeTab === "da-phan-cong" && (
                <div>
                  <label style={labelStyle}>Thẩm tra viên giải quyết</label>
                  <select
                    value={fTTV}
                    onChange={(e) => setFTTV(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn thẩm tra viên</option>
                    {DANH_SACH_TTV.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                )}
              </div>

              {activeTab === "da-phan-cong" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Lãnh đạo phụ trách</label>
                  <select
                    value={fLanhDao}
                    onChange={(e) => setFLanhDao(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn lãnh đạo vụ</option>
                    {DANH_SACH_LANH_DAO.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div />
              </div>
              )}
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
                onClick={() => setFilterApplied(true)}
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
          {activeTab === "chua-phan-cong" ? (
            <button
              onClick={phanCongMode === "ngau-nhien" ? handleExecutePhanCong : saveInlineAssignments}
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
              {phanCongMode === "ngau-nhien" ? "Phân công ngẫu nhiên" : "Lưu phân công"}
            </button>
          ) : (
            <button
              onClick={saveInlineAssignments}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              Phân công
            </button>
          )}

          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              background: activeTab === "da-phan-cong" ? RED : "#fff",
              color: activeTab === "da-phan-cong" ? "#fff" : TEXT,
              border: activeTab === "da-phan-cong" ? "none" : `1px solid ${BORDER}`,
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            <Printer size={13} /> In báo cáo
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
                <tr>
                  <th style={{ ...TH_CUSTOM, width: 36, textAlign: "center" }}>
                    {(activeTab === "da-phan-cong" || phanCongMode === "chi-dinh") && <input
                      type="checkbox"
                      checked={selectedIds.length === currentRows.length && currentRows.length > 0}
                      onChange={(e) => handleSelectAll(e, currentRows)}
                      style={{ cursor: "pointer" }}
                    />}
                  </th>
                  <th style={{ ...TH_CUSTOM, width: 44, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_CUSTOM, width: "12%" }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_CUSTOM, width: "23%" }}>Thông tin bản án/quyết định và QHPL</th>
                  <th style={{ ...TH_CUSTOM, width: "14%" }}>Đương sự</th>
                  <th style={{ ...TH_CUSTOM, width: "10%" }}>Ngày TTV nhận THS</th>
                  <th style={{ ...TH_CUSTOM, width: "11%" }}>Ngày phân công TTV</th>
                  <th style={{ ...TH_CUSTOM, width: "13%" }}>Thẩm tra viên (TTV)</th>
                  <th style={{ ...TH_CUSTOM, width: "11%" }}>Ngày phân công LĐ</th>
                  <th style={{ ...TH_CUSTOM, width: "14%" }}>Lãnh đạo vụ (LĐV)</th>
                  <th style={{ ...TH_CUSTOM, width: 60, textAlign: "center", borderRight: "none" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <TableEmptyState colSpan={11} text="Không có bản ghi nào" style={{ ...TD_CUSTOM, padding: 36 }} />
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
                        <td style={{ ...TD_CUSTOM, textAlign: "center" }}>
                          {(activeTab === "da-phan-cong" || phanCongMode === "chi-dinh") && <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(r.id)}
                            style={{ cursor: "pointer" }}
                          />}
                        </td>
                        <td style={{ ...TD_CUSTOM, textAlign: "center", fontWeight: 600, color: MUTED }}>
                          {index + 1}
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.hasVuGiaiQuyet && <div style={{ marginBottom: 4 }}><span style={{ padding: "2px 6px", borderRadius: 10, background: "#dcfce7", color: "#166534", fontSize: 10, fontWeight: 700 }}>Đã có vụ giải quyết</span></div>}
                          {r.donChoPheDuyet && <div style={{ marginBottom: 4 }}><span style={{ padding: "2px 6px", borderRadius: 10, background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700 }}>Đơn chờ phê duyệt</span></div>}
                          {r.soThuLy !== "-" ? <div><div><b>Số:</b> {r.soThuLy}</div><div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Ngày TL:</b> {r.ngayThuLy}</div></div> : <span style={{ color: MUTED }}>-</span>}
                          {r.canhBaoThoiHieu && <div style={{ marginTop: 5, color: "#b91c1c", fontSize: 10, fontWeight: 700 }}>⚠ Thời hiệu giải quyết: {r.canhBaoThoiHieu}</div>}
                        </td>
                        <td style={TD_CUSTOM}>
                          <div>
                            <div><b>Số BA:</b> {r.soBA} &nbsp; <b>Ngày:</b> {r.ngayBA}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Tại:</b> {r.toaAn}</div>
                            {r.giaiDoan && (
                              <div style={{ marginTop: 4 }}>
                                <span style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
                                  Giai đoạn: {r.giaiDoan}
                                </span>
                              </div>
                            )}
                            {r.qhpl && (
                              <div style={{ color: "#2563eb", marginTop: 4, fontSize: 11, fontWeight: 500 }}>
                                <b>QHPL:</b> {r.qhpl}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.isKhieuNai ? <span style={{ color: MUTED }}>-</span> : (r.ndkn || r.nbk) ? (
                            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                              {r.ndkn && <div><b>NĐ/NKK:</b> {r.ndkn}</div>}
                              {r.nbk && <div><b>BĐ/NBK:</b> {r.nbk}</div>}
                            </div>
                          ) : (
                            <span style={{ color: MUTED }}>-</span>
                          )}
                        </td>
                        <td style={TD_CUSTOM}>
                          <input type="date" value={toInputDate(r.ngayNhanTHS)} onChange={(e) => { updateRow(r.id, { ngayNhanTHS: e.target.value }); try { localStorage.setItem(`gdt-ngay-nhan-ths-${r.id}`, e.target.value); } catch {} }} style={{ ...inputStyle, fontSize: 11 }} />
                        </td>
                        <td style={TD_CUSTOM}>
                          <div style={{ fontSize: 10, color: "#1e40af", fontWeight: 700, marginBottom: 4 }}>{r.isKhieuNai ? "Giải quyết khiếu nại" : r.giaiDoanPC}</div>
                          <input type="date" value={toInputDate(r.ngayPCTTV)} onChange={(e) => updateRow(r.id, { ngayPCTTV: e.target.value })} style={{ ...inputStyle, fontSize: 11, borderColor: dirtyIds.includes(r.id) && (!r.ngayPCTTV || r.ngayPCTTV === "-") ? RED : BORDER }} />
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.previousTTV && <div onClick={() => { const ttv=r.previousTTV!; updateRow(r.id,{ttv,lanhDao:r.previousLD || LD_BY_TTV[getName(ttv)] || "-",ngayPCTTV:toInputDate(r.ngayPCTTV),ngayPCLD:toInputDate(r.ngayPCLD)}); }} style={{ fontSize: 10, color: MUTED, marginBottom: 4, cursor: "pointer" }} title="Click để chọn lại">Gợi ý lần trước: {getName(r.previousTTV)}</div>}
                          <select value={r.ttv === "-" ? "" : r.ttv} onChange={(e) => { const ttv=e.target.value; updateRow(r.id,{ttv,lanhDao:LD_BY_TTV[getName(ttv)] || r.lanhDao,ngayPCTTV:toInputDate(r.ngayPCTTV),ngayPCLD:toInputDate(r.ngayPCLD)}); }} style={{ ...inputStyle, fontSize: 11 }} disabled={phanCongMode === "chi-dinh" && !!r.hasVuGiaiQuyet && !!r.previousTTV}>
                            <option value="">-- Chọn TTV --</option>
                            {(phanCongMode === "chi-dinh" && r.hasVuGiaiQuyet && r.previousTTV ? [r.previousTTV] : DANH_SACH_TTV).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td style={TD_CUSTOM}>
                          <div style={{ fontSize: 10, color: "#1e40af", fontWeight: 700, marginBottom: 4 }}>{r.isKhieuNai ? "Giải quyết khiếu nại" : r.giaiDoanPC}</div>
                          <input type="date" value={toInputDate(r.ngayPCLD)} onChange={(e) => updateRow(r.id, { ngayPCLD: e.target.value })} style={{ ...inputStyle, fontSize: 11 }} />
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.previousLD && <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Gợi ý lần trước: {getName(r.previousLD)}</div>}
                          <select value={r.lanhDao === "-" ? "" : r.lanhDao} onChange={(e) => updateRow(r.id,{lanhDao:e.target.value})} style={{ ...inputStyle, fontSize: 11 }}>
                            <option value="">-- Chọn LĐV --</option>{DANH_SACH_LANH_DAO.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </td>
                        <td style={{ ...TD_CUSTOM, textAlign: "center", borderRight: "none" }}>
                          <button
                            onClick={() => { alert(`Mở bản scan đơn/hồ sơ của bản ghi ${r.id}`); setShowDetailModal(r); }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#2563eb",
                              padding: 4,
                              borderRadius: 4,
                            }}
                            title="Xem đơn scan"
                          >
                            <Eye size={16} />
                          </button>
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
              Hiển thị 1-{currentRows.length} trong tổng {activeTab === "chua-phan-cong" ? "9" : "641"} bản ghi
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>‹</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${RED}`, background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>1</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>2</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>3</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>4</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>5</button>
              <span>...</span>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>65</button>
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

      {/* Modal Phân công chỉ định */}
      {showAssignModal && (
        <PlatformModalFrame
          zIndex={4000}
          overlayStyle={{ background: "rgba(0,0,0,0.5)", padding: 20 }}
          cardStyle={{ borderRadius: 10, width: "100%", maxWidth: 560, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", fontFamily: F }}
        >
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: RED }}>
                <UserCheck size={18} /> Phân công chỉ định Thẩm tra viên & Lãnh đạo vụ
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 14px", borderRadius: 6, fontSize: 12, color: "#1e40af" }}>
                Đang phân công cho <b>{selectedIds.length}</b> vụ án đã chọn.
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Chọn Thẩm tra viên (TTV) giải quyết (*)
                </label>
                <select
                  value={assignTTV}
                  onChange={(e) => setAssignTTV(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                >
                  {DANH_SACH_TTV.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Chọn Lãnh đạo vụ (LĐV) phụ trách (*)
                </label>
                <select
                  value={assignLD}
                  onChange={(e) => setAssignLD(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                >
                  {DANH_SACH_LANH_DAO.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmChiDinh}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                ✓ Xác nhận phân công
              </button>
            </div>
        </PlatformModalFrame>
      )}

      {/* Modal Xem chi tiết vụ án */}
      {showDetailModal && (
        <PlatformModalFrame
          zIndex={4000}
          overlayStyle={{ background: "rgba(0,0,0,0.5)", padding: 20 }}
          cardStyle={{ borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", fontFamily: F }}
        >
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: RED }}>
                📄 Xem đơn scan / Thông tin hồ sơ
              </div>
              <button onClick={() => setShowDetailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày thụ lý:</span>
                <span>{showDetailModal.soThuLy} – {showDetailModal.ngayThuLy}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày bản án:</span>
                <span>{showDetailModal.soBA} – {showDetailModal.ngayBA}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Tòa án ra bản án:</span>
                <span>{showDetailModal.toaAn}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Quan hệ pháp luật:</span>
                <span>{showDetailModal.qhpl || "Chưa cập nhật"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Đương sự:</span>
                <span>{showDetailModal.ndkn ? `NĐ/NKK: ${showDetailModal.ndkn} - BĐ/NBK: ${showDetailModal.nbk}` : "Chưa cập nhật"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm tra viên (TTV):</span>
                <span style={{ fontWeight: 600, color: "#1e40af" }}>{showDetailModal.ttv}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0" }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Lãnh đạo vụ (LĐV):</span>
                <span style={{ fontWeight: 600, color: "#1e40af" }}>{showDetailModal.lanhDao}</span>
              </div>
            </div>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDetailModal(null)}
                style={{ padding: "7px 20px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Đóng
              </button>
            </div>
        </PlatformModalFrame>
      )}
    </div>
  );
}

export default PhanCongTTVView;
