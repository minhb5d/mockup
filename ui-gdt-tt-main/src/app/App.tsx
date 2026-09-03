import { useState } from "react";
import { Search, Grid3X3, Bell, Moon } from "lucide-react";
import Sidebar, { type View } from "./Sidebar";
import { TAB_CONFIG, getCasesByTab, type TabId } from "./data";
import { F, RED, BORDER, MUTED, type UserRoleType } from "./shared";
import PhanCongHDXXView from "./PhanCongHDXXView";
import CongVanTraoDoiView from "./CongVanTraoDoiView";
import QuanLyVuXetXuView from "./QuanLyVuXetXuView";
import PheDuyetDeXuatView from "./PheDuyetDeXuatView";
import HoSoTuHinhView from "./HoSoTuHinhView";
import { PhanCongTTVView } from "./PhanCongTTVView";
import { PhanCongThamPhanView } from "./PhanCongThamPhanView";
import { PhanCongTPTCView } from "./PhanCongTPTCView";
import { AnQuocHoiView, AnThoiHieuView } from "./AnBaoCaoViews";
import { QuanLyKhieuNaiView } from "./QuanLyKhieuNaiView";
import HoSoKhangNghiView from "./HoSoKhangNghiView";
import QuanLyVuAnView, { ChiTietVuAnView, type ChiTietTab } from "./QuanLyVuAnView";
import NhanDonTLVuAnView from "./NhanDonTLVuAnView";
import CauHinhTTVView from "./CauHinhTTVView";
import GiaoTieuHoSoView from "./GiaoTieuHoSoView";
import { PrintReportModal, type BieuMauIn } from "./PrintReportModal";


// ── Thông tin đơn cell ───────────────────────────────────────────────────────

function TopBar() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 10, padding: "0 20px", height: 48,
        borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0,
      }}
    >
      <div />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Search size={17} color={MUTED} style={{ cursor: "pointer" }} />
        <Grid3X3 size={17} color={MUTED} style={{ cursor: "pointer" }} />
        <span style={{ position: "relative" }}>
          <Bell size={17} color={MUTED} style={{ cursor: "pointer" }} />
          <span style={{
            position: "absolute", top: -5, right: -6,
            background: RED, color: "#fff", borderRadius: 20,
            fontSize: 9, padding: "1px 4px", fontFamily: F, fontWeight: 700,
          }}>3</span>
        </span>
        <Moon size={17} color={MUTED} style={{ cursor: "pointer" }} />
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 12, color: "#374151", fontFamily: F, fontWeight: 600,
        }}>
          A
        </div>
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

type AppView = "list" | "giao-tieu-ho-so" | "phan-cong-ttv" | "phan-cong-tham-phan" | "phan-cong-tptc" | "cau-hinh-ttv" | "quan-ly-vu-an" | "chi-tiet-vu-an" | "cong-van-trao-doi" | "phan-cong-hdxx" | "quan-ly-vu-xet-xu" | "phe-duyet-de-xuat" | "quan-ly-khieu-nai" | "chi-tiet-khieu-nai" | "ho-so-khang-nghi" | "ho-so-tu-hinh" | "don-xin-an-giam" | "an-quoc-hoi" | "an-thoi-hieu";


const DON_REPORTS: BieuMauIn[] = [
  {
    id: "danh-sach-don",
    ten: "Báo cáo danh sách đơn GĐT,TT",
    tieuChi: [
      { key: "khoangNgay", label: "Từ ngày – Đến ngày", type: "date-range" },
      { key: "loaiAn", label: "Loại án", type: "select", options: ["Hình sự", "Dân sự", "Kinh doanh thương mại", "Lao động", "Hôn nhân gia đình", "Hành chính"] },
      { key: "trangThai", label: "Trạng thái", type: "select", options: ["Đơn chờ phê duyệt", "Chờ xin ý kiến", "Đã có vụ án"] },
    ],
  },
];

export default function App() {
  const [globalUserRole, setGlobalUserRole] = useState<UserRoleType>("hinh-su");
  const [appView, setAppView] = useState<AppView>("list");
  const [activeTab, setActiveTab] = useState<TabId>("don-cho-phe-duyet");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [selectedVuAnId, setSelectedVuAnId] = useState<string>("VA26-002621");

  const sidebarView: View =
    appView === "giao-tieu-ho-so" ? "giao-tieu-ho-so"
        : appView === "phan-cong-tham-phan" ? "phan-cong-tham-phan"
          : appView === "phan-cong-ttv" ? "phan-cong-ttv"
            : appView === "phan-cong-tptc" ? "phan-cong-tptc"
              : appView === "cau-hinh-ttv" ? "cau-hinh-ttv"
                : appView === "quan-ly-vu-an" || appView === "chi-tiet-vu-an" ? "quan-ly-vu-an"
                  : appView === "quan-ly-khieu-nai" || appView === "chi-tiet-khieu-nai" ? "quan-ly-khieu-nai"
                    : appView === "cong-van-trao-doi" ? "cong-van-trao-doi"
                      : appView === "phan-cong-hdxx" ? "phan-cong-hdxx"
                        : appView === "quan-ly-vu-xet-xu" ? "quan-ly-vu-xet-xu"
                          : appView === "phe-duyet-de-xuat" ? "phe-duyet-de-xuat"
                            : appView === "don-xin-an-giam" ? "don-xin-an-giam"
                              : appView === "ho-so-tu-hinh" ? "ho-so-tu-hinh"
                                : appView === "an-quoc-hoi" ? "an-quoc-hoi"
                                  : appView === "an-thoi-hieu" ? "an-thoi-hieu"
                                    : appView === "ho-so-khang-nghi" ? "ho-so-khang-nghi"
                                      : activeTab === "cho-y-kien" ? "cho-y-kien"
                                        : activeTab === "da-co-vu-an" ? "da-co-vu-an"
                                          : "don-cho-phe-duyet";

  const handleSidebarNav = (v: View) => {
    if (v === "phan-cong-tham-phan") { setAppView("phan-cong-tham-phan"); return; }
    if (v === "phan-cong-ttv") { setAppView("phan-cong-ttv"); return; }
    if (v === "phan-cong-tptc") { setAppView("phan-cong-tptc"); return; }
    if (v === "cau-hinh-ttv") { setAppView("cau-hinh-ttv"); return; }
    if (v === "quan-ly-vu-an") { setAppView("quan-ly-vu-an"); return; }
    if (v === "quan-ly-khieu-nai") { setAppView("quan-ly-khieu-nai"); return; }
    if (v === "giao-tieu-ho-so") { setAppView("giao-tieu-ho-so"); return; }
    if (v === "cong-van-trao-doi") { setAppView("cong-van-trao-doi"); return; }
    if (v === "phan-cong-hdxx") { setAppView("phan-cong-hdxx"); return; }
    if (v === "quan-ly-vu-xet-xu") { setAppView("quan-ly-vu-xet-xu"); return; }
    if (v === "phe-duyet-de-xuat") { setAppView("phe-duyet-de-xuat"); return; }
    if (v === "ho-so-khang-nghi") { setAppView("ho-so-khang-nghi"); return; }
    if (v === "don-xin-an-giam") { setAppView("don-xin-an-giam"); return; }
    if (v === "ho-so-tu-hinh") { setAppView("ho-so-tu-hinh"); return; }
    if (v === "an-quoc-hoi") { setAppView("an-quoc-hoi"); return; }
    if (v === "an-thoi-hieu") { setAppView("an-thoi-hieu"); return; }
    setAppView("list");
    const tabMap: Record<string, TabId> = {
      "don-cho-phe-duyet": "don-cho-phe-duyet",
      "cho-y-kien": "cho-y-kien",
      "da-co-vu-an": "da-co-vu-an",
    };
    if (tabMap[v]) setActiveTab(tabMap[v]);
  };

  const [selectedVuAnTab, setSelectedVuAnTab] = useState<ChiTietTab>("thong-tin");

  const handleSelectVuAn = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedVuAnId(id);
    setSelectedVuAnTab(tab);
    setAppView("chi-tiet-vu-an");
  };

  const [selectedKhieuNaiId, setSelectedKhieuNaiId] = useState<string>("VA26-002621");
  const [selectedKhieuNaiTab, setSelectedKhieuNaiTab] = useState<ChiTietTab>("danh-sach-don");
  const [showDonReport, setShowDonReport] = useState(false);

  const handleSelectKhieuNai = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedKhieuNaiId(id);
    setSelectedKhieuNaiTab(tab);
    setAppView("chi-tiet-khieu-nai");
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: F, overflow: "hidden", background: "#f9fafb" }}>
      <Sidebar currentView={sidebarView} onNavigate={handleSidebarNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar />

        {appView === "phan-cong-tham-phan" ? (
          <PhanCongThamPhanView />
        ) : appView === "phan-cong-ttv" ? (
          <PhanCongTTVView />
        ) : appView === "phan-cong-tptc" ? (
          <PhanCongTPTCView />
        ) : appView === "cau-hinh-ttv" ? (
          <CauHinhTTVView />
        ) : appView === "quan-ly-vu-an" ? (
          <QuanLyVuAnView userRole={globalUserRole} setUserRole={setGlobalUserRole} onSelectVuAn={handleSelectVuAn} />
        ) : appView === "chi-tiet-vu-an" ? (
          <ChiTietVuAnView key={selectedVuAnId + selectedVuAnTab} vuAnId={selectedVuAnId} userRole={globalUserRole} onBack={() => setAppView("quan-ly-vu-an")} initialTab={selectedVuAnTab} />
        ) : appView === "quan-ly-khieu-nai" ? (
          <QuanLyKhieuNaiView userRole={globalUserRole} setUserRole={setGlobalUserRole} onSelectKhieuNai={handleSelectKhieuNai} />
        ) : appView === "chi-tiet-khieu-nai" ? (
          <ChiTietVuAnView
            key={selectedKhieuNaiId + selectedKhieuNaiTab}
            vuAnId={selectedKhieuNaiId}
            userRole={globalUserRole}
            onBack={() => setAppView("quan-ly-khieu-nai")}
            initialTab={selectedKhieuNaiTab}
            moduleLabel="Quản lý khiếu nại"
            detailLabel="Chi tiết khiếu nại"
            entityWord="Khiếu nại"
          />
        ) : appView === "phan-cong-hdxx" ? (
          <PhanCongHDXXView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "quan-ly-vu-xet-xu" ? (
          <QuanLyVuXetXuView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "phe-duyet-de-xuat" ? (
          <PheDuyetDeXuatView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "cong-van-trao-doi" ? (
          <CongVanTraoDoiView userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "ho-so-khang-nghi" ? (
          <HoSoKhangNghiView userRole={globalUserRole} />
        ) : appView === "don-xin-an-giam" ? (
          <HoSoTuHinhView initialTab="don-xin-an-giam" userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "ho-so-tu-hinh" ? (
          <HoSoTuHinhView initialTab="ho-so-tu-hinh" userRole={globalUserRole} setUserRole={setGlobalUserRole} />
        ) : appView === "an-quoc-hoi" ? (
          <AnQuocHoiView />
        ) : appView === "an-thoi-hieu" ? (
          <AnThoiHieuView />
        ) : appView === "giao-tieu-ho-so" ? (
          <GiaoTieuHoSoView onClose={() => setAppView("list")} userRole={globalUserRole} />
        ) : (
          <NhanDonTLVuAnView
            userRole={globalUserRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filterExpanded={filterExpanded}
            setFilterExpanded={setFilterExpanded}
            onGiaoTieuHoSo={() => setAppView("giao-tieu-ho-so")}
            onInBaoCao={() => setShowDonReport(true)}
          />
        )}
      </div>
      {showDonReport && (
        <PrintReportModal
          onClose={() => setShowDonReport(false)}
          tieuDeMan="In báo cáo danh sách đơn"
          bieuMauList={DON_REPORTS}
        />
      )}
    </div>
  );
}
