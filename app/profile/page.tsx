"use client";

import { useState, useEffect } from "react";
import { ChevronRight, User, Users, Gift, CreditCard, Mail, Save, Home, ArrowLeft, Lock, LogOut, Wallet, ShieldCheck, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "@/components/airline/change-password-form";
import { DepositModal } from "@/components/airline/deposit-modal";
import { TransactionHistoryModal } from "@/components/airline/transaction-history-modal";

const menuItems = [
  { label: "Thông tin cá nhân", icon: User, href: "#", active: true },
  { label: "Sở thích", icon: User, href: "#" },
  { label: "Thay đổi mật khẩu", icon: Lock, href: "#", active: false },
  { label: "Chuyến bay của tôi", icon: Users, href: "#" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "preferences" | "password" | "flights">("personal");
  const [flightSubTab, setFlightSubTab] = useState<"upcoming" | "history">("upcoming");
  const [ticketU2Status, setTicketU2Status] = useState("PENDING");
  const [activeMenuItem, setActiveMenuItem] = useState("Thông tin cá nhân");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdminHistoryOpen, setIsAdminHistoryOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer state for unpaid ticket demo
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  useEffect(() => {
    const expireKey = "booking_expire_U2PBZ3";
    const storedExpire = localStorage.getItem(expireKey);
    if (!storedExpire) {
      const expireTime = Date.now() + 3600 * 1000;
      localStorage.setItem(expireKey, expireTime.toString());
    } else {
      const remaining = Math.floor((parseInt(storedExpire) - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
    
    const tStatus = localStorage.getItem("ticket_U2PBZ3_status");
    if (tStatus) {
      setTicketU2Status(tStatus);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "flights") return;
    const timer = setInterval(() => {
      const storedExpire = localStorage.getItem("booking_expire_U2PBZ3");
      if (storedExpire) {
        const remaining = Math.floor((parseInt(storedExpire) - Date.now()) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // State form
  const [formData, setFormData] = useState({
    title: "Ông",
    lastName: "Lê",
    firstName: "Viết Phạm Sang",
    middleName: "",
    gender: "Nam",
    dateOfBirth: "1995-06-15",
    displayName: "LE VIET PHAM SANG",
    language: "Tiếng Việt",
    nationality: "Việt Nam",
    idNumber: "001234567890",
    idIssuePlace: "Cục Cảnh sát Quản lý Hành chính về Trật tự xã hội",
    idIssueDate: "2020-01-15",
    company: "Công ty TNHH ABC",
    addressDetails: "Tòa nhà Landmark 81, Quận 1",
    address: "123 Đường Nguyễn Huệ",
    province: "TP. Hồ Chí Minh",
    ward: "Phường Bến Nghé",
    postalCode: "700000",
    email: "sang.leviet@example.com",
    phoneNumber: "0909123456"
  });

  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setWalletBalance(user.walletBalance || 0);

      // Populate form data
      let dob = "";
      if (user.dateOfBirth) {
        const d = new Date(user.dateOfBirth);
        if (!isNaN(d.getTime())) dob = d.toISOString().split('T')[0];
      }
      
      let idDate = "";
      if (user.idIssueDate) {
        const d = new Date(user.idIssueDate);
        if (!isNaN(d.getTime())) idDate = d.toISOString().split('T')[0];
      }

      setFormData({
        title: user.title || "Ông",
        lastName: user.lastName || (user.fullName ? user.fullName.split(" ").shift() : ""),
        firstName: user.firstName || (user.fullName ? user.fullName.split(" ").slice(1).join(" ") : ""),
        middleName: user.middleName || "",
        gender: user.gender || "Nam",
        dateOfBirth: dob,
        displayName: user.displayName || user.fullName?.toUpperCase() || "",
        language: user.language || "Tiếng Việt",
        nationality: user.nationality || "Việt Nam",
        idNumber: user.idNumber || "",
        idIssuePlace: user.idIssuePlace || "",
        idIssueDate: idDate,
        company: user.company || "",
        addressDetails: user.addressDetails || "",
        address: user.address || "",
        province: user.province || "",
        ward: user.ward || "",
        postalCode: user.postalCode || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || user.phone?.replace(/^\+84/, '') || ""
      });
    }
  }, []);

  const handleDepositSuccess = (newBalance: number) => {
    setWalletBalance(newBalance);
    if (currentUser) {
      const updatedUser = { ...currentUser, walletBalance: newBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          ...formData
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Lưu thông tin thành công!");
        const updatedUser = { ...currentUser, ...data.user };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      } else {
        alert(data.message || "Lỗi cập nhật.");
      }
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar Menu */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[#005f73] text-white rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-white/10">
                <h2 className="text-lg font-bold">Lotusmiles</h2>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenuItem(item.label);
                      if (item.label === "Thông tin cá nhân") {
                        setActiveTab("personal");
                      } else if (item.label === "Thay đổi mật khẩu") {
                        setActiveTab("password");
                      } else if (item.label === "Sở thích") {
                        setActiveTab("preferences");
                      } else if (item.label === "Chuyến bay của tôi") {
                        setActiveTab("flights");
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeMenuItem === item.label
                        ? "bg-white/10 text-white border-l-2 border-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {activeMenuItem !== item.label && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Nút đăng xuất */}
            <div className="mt-4">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl transition-all shadow-sm"
              >
                <LogOut className="w-5 h-5" /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === "password" ? "Thay Đổi Mật Khẩu" : activeTab === "preferences" ? "Sở Thích" : activeTab === "flights" ? "Chuyến Bay Của Tôi" : "Thông Tin Cá Nhân"}
              </h1>
            </div>

            {activeTab === "personal" && (
              <div className="space-y-6">
                {/* Số dư ví (Wallet Balance Card) */}
                <div className="bg-gradient-to-r from-[#1c6478] to-[#005f73] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Wallet className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-cyan-100 mb-1">Số dư ví điện tử (LS Wallet)</h3>
                    <div className="text-4xl font-bold tracking-tight mb-2">
                      {walletBalance.toLocaleString()} <span className="text-xl font-normal opacity-80">VND</span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setIsDepositOpen(true)} className="bg-white text-[#005f73] hover:bg-cyan-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                        Nạp tiền
                      </button>
                      <button onClick={() => setIsHistoryOpen(true)} className="bg-transparent border border-cyan-200 text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Lịch sử giao dịch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin Features */}
                {currentUser?.role === 'admin' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        Khu vực Quản trị viên
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">Tra cứu biến động số dư và giao dịch của khách hàng.</p>
                    </div>
                    <button onClick={() => setIsAdminHistoryOpen(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                      Tra cứu Khách hàng
                    </button>
                  </div>
                )}

                <DepositModal 
                  isOpen={isDepositOpen} 
                  onClose={() => setIsDepositOpen(false)} 
                  userId={currentUser?._id || ""}
                  onSuccess={handleDepositSuccess}
                />

                <TransactionHistoryModal 
                  isOpen={isHistoryOpen} 
                  onClose={() => setIsHistoryOpen(false)} 
                  userId={currentUser?._id || ""}
                />

                <TransactionHistoryModal 
                  isOpen={isAdminHistoryOpen} 
                  onClose={() => setIsAdminHistoryOpen(false)} 
                  isAdminMode={true}
                />

                {/* Thông tin cá nhân */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Danh xưng</label>
                      <select name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option value="Ông">Ông</option>
                        <option value="Bà">Bà</option>
                        <option value="Anh">Anh</option>
                        <option value="Chị">Chị</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Họ</label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Đệm và Tên</label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Giới tính</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Ngày sinh</label>
                      <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Tên hiển thị trên thẻ</label>
                      <input name="displayName" value={formData.displayName} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Chọn ngôn ngữ</label>
                      <select name="language" value={formData.language} onChange={handleChange} className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Quốc tịch</label>
                      <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Giấy tờ tùy thân */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Giấy tờ tùy thân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Loại giấy tờ</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>CCCD</option>
                        <option>Hộ chiếu</option>
                        <option>Giấy phép lái xe</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Số CCCD/Hộ chiếu</label>
                      <input name="idNumber" value={formData.idNumber} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Nơi cấp</label>
                      <input name="idIssuePlace" value={formData.idIssuePlace} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Ngày cấp</label>
                      <input name="idIssueDate" value={formData.idIssueDate} onChange={handleChange} type="date" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Địa chỉ thư tín */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Địa chỉ thư tín</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Cơ quan</label>
                      <input name="company" value={formData.company} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Chỉ dẫn chi tiết</label>
                      <input name="addressDetails" value={formData.addressDetails} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Địa chỉ</label>
                      <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Quốc gia/Vùng</label>
                      <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option value="Việt Nam">Việt Nam</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                      <input name="province" value={formData.province} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" placeholder="VD: Hà Nội, TP.HCM..." />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Phường/Xã</label>
                      <input name="ward" value={formData.ward} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" placeholder="VD: Phường Bến Nghé" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Mã bưu chính</label>
                      <input name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Thông tin liên hệ */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                      <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Quốc gia/Vùng</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>+84 (Việt Nam)</option>
                        <option>+1 (United States)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                        <span className="text-sm text-gray-600">Tôi đồng ý nhận thông tin truyền thông, ưu đãi và khuyến mại từ LS Airlines qua email và tin nhắn.</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button onClick={handleSaveProfile} disabled={isSaving} className="inline-flex items-center gap-2 rounded-full bg-[#005f73] px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#004d61] disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Đang lưu..." : "Lưu thông tin"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <ChangePasswordForm />
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                
                {/* 1. Sở thích ghế ngồi */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">1. Sở thích ghế ngồi (Seat Preferences)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Vị trí ghế</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không chọn ưu tiên</option>
                        <option>Cửa sổ (Window)</option>
                        <option>Lối đi (Aisle)</option>
                        <option>Hàng ghế có chỗ để chân rộng (Extra legroom)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Khu vực trên máy bay</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không chọn ưu tiên</option>
                        <option>Đầu khoang (lên/xuống nhanh)</option>
                        <option>Giữa khoang (gần cánh, ít rung lắc)</option>
                        <option>Đuôi khoang</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Sở thích suất ăn & Dị ứng */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">2. Sở thích suất ăn & Dị ứng (Meal & Dietary Preferences)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Chế độ ăn chay/kiêng</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Suất ăn tiêu chuẩn</option>
                        <option>Ăn chay thuần (Vegan)</option>
                        <option>Chay có trứng sữa</option>
                        <option>Ăn kiêng Gluten (GFML)</option>
                        <option>Ít muối</option>
                        <option>Thực đơn cho người tiểu đường</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Yêu cầu tôn giáo</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không yêu cầu</option>
                        <option>Suất ăn Hồi giáo (Halal)</option>
                        <option>Kosher</option>
                        <option>Hindu</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Cảnh báo dị ứng</label>
                      <input 
                        type="text" 
                        placeholder="VD: Đậu phộng, hải sản, lactose,... để phi hành đoàn chuẩn bị trước" 
                        className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Thói quen bay & Chặng bay quen thuộc */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">3. Thói quen bay & Chặng bay quen thuộc</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Sân bay khởi hành mặc định</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không chọn mặc định</option>
                        <option>SGN - Tân Sơn Nhất, TP.HCM</option>
                        <option>HAN - Nội Bài, Hà Nội</option>
                        <option>DAD - Đà Nẵng</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Hạng vé ưu tiên</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Phổ thông tiết kiệm</option>
                        <option>Phổ thông linh hoạt</option>
                        <option>Phổ thông đặc biệt</option>
                        <option>Thương gia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Dịch vụ hỗ trợ đặc biệt */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">4. Dịch vụ hỗ trợ đặc biệt (Special Assistance)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Hỗ trợ di chuyển</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không yêu cầu</option>
                        <option>Yêu cầu xe lăn tại sân bay</option>
                        <option>Yêu cầu xe lăn lúc lên thang máy bay</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Hành lý đặc thù</label>
                      <select className="w-full rounded-lg bg-gray-100 border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#005f73]/20 outline-none">
                        <option>Không mang theo</option>
                        <option>Nhạc cụ</option>
                        <option>Dụng cụ thể thao (gậy golf, xe đạp)</option>
                        <option>Thú cưng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Tùy chọn nhận thông báo */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">5. Tùy chọn nhận thông báo (Notification Preferences)</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Kênh nhận tin</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">SMS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">Zalo / Push notification</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 mt-2 block text-sm font-medium text-gray-700">Nội dung quan tâm</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">Nhận báo giá rẻ cho chặng bay yêu thích</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">Thay đổi cổng ra máy bay, giờ bay</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#005f73] focus:ring-[#005f73]" />
                          <span className="text-sm text-gray-600">Các chương trình ưu đãi hội viên</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#005f73] px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#004d61]">
                    <Save className="h-4 w-4" />
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {activeTab === "flights" && (
              <div className="space-y-6">
                
                {/* Tabs Switcher */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setFlightSubTab("upcoming")}
                    className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${
                      flightSubTab === "upcoming" ? "text-[#005f73]" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    🛫 Chuyến bay sắp tới
                    {flightSubTab === "upcoming" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#005f73] rounded-t-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setFlightSubTab("history")}
                    className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${
                      flightSubTab === "history" ? "text-[#005f73]" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    🕒 Lịch sử chuyến bay
                    {flightSubTab === "history" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#005f73] rounded-t-full"></span>
                    )}
                  </button>
                </div>

                {flightSubTab === "upcoming" && (
                  <div className="space-y-6">
                    {/* Đã thanh toán - Sắp tới */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="bg-[#1da040] px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          Thông tin vé đã thanh toán
                        </h3>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">Hoàn tất</span>
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="border border-green-100 rounded-xl p-5 bg-green-50/50 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#1da040]"></div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-[#006079] text-white text-xs font-bold px-2.5 py-1 rounded">VN 1737</span>
                              <span className="text-sm font-medium text-gray-500">24/09/2026</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">Hà Nội (HAN) <span className="text-[#006079] mx-2">✈</span> Hải Phòng (HPH)</h4>
                            <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                              <span className="text-gray-300">|</span> 
                              <span className="font-medium text-[#006079]">Thương Gia Linh Hoạt</span>
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-green-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                            <span className="text-2xl font-black text-[#1da040] tracking-widest">88A9B2</span>
                            <button onClick={() => router.push('/manage')} className="mt-3 text-sm text-[#006079] font-bold hover:underline">Xem chi tiết vé</button>
                          </div>
                        </div>

                        {/* Nếu U2PBZ3 đã thanh toán */}
                        {ticketU2Status === "PAID" && (
                          <div className="border border-green-100 rounded-xl p-5 bg-green-50/50 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all relative overflow-hidden mt-4">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#1da040]"></div>
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#006079] text-white text-xs font-bold px-2.5 py-1 rounded">VN 2104</span>
                                <span className="text-sm font-medium text-gray-500">26/09/2026</span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Hải Phòng (HPH) <span className="text-[#006079] mx-2">✈</span> Đà Nẵng (DAD)</h4>
                              <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                                <span className="text-gray-300">|</span> 
                                <span className="font-medium text-[#006079]">Phổ Thông Tiêu Chuẩn</span>
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-green-100">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                              <span className="text-2xl font-black text-[#1da040] tracking-widest">U2PBZ3</span>
                              <button onClick={() => router.push('/manage')} className="mt-3 text-sm text-[#006079] font-bold hover:underline">Xem chi tiết vé</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chưa thanh toán - Đang chờ */}
                    {ticketU2Status === "PENDING" && (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Thông tin vé chưa thanh toán
                          </h3>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm animate-pulse">Chờ thanh toán</span>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                          <div className="border border-orange-100 rounded-xl p-5 bg-orange-50/50 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all relative overflow-hidden opacity-90">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#006079] text-white text-xs font-bold px-2.5 py-1 rounded">VN 2104</span>
                                <span className="text-sm font-medium text-gray-500">26/09/2026</span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Hải Phòng (HPH) <span className="text-[#006079] mx-2">✈</span> Đà Nẵng (DAD)</h4>
                              <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                                <span className="text-gray-300">|</span> 
                                <span className="font-medium text-[#006079]">Phổ Thông Tiêu Chuẩn</span>
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-orange-100">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                              <span className="text-2xl font-black text-orange-500 tracking-widest">U2PBZ3</span>
                              
                              <div className="mt-4 flex flex-col items-end w-full">
                                <p className="text-sm font-medium text-orange-600 mb-1 flex items-center gap-1.5">
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                                  </span>
                                  Đang chờ thanh toán
                                </p>
                                <p className="text-xs text-gray-500 font-medium mb-3">Thời gian còn lại: {formatTime(timeLeft)}</p>
                                <button onClick={() => router.push('/checkout?bookingId=U2PBZ3')} className="text-sm bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md w-full md:w-auto text-center">Thanh toán ngay</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {flightSubTab === "history" && (
                  <div className="space-y-6">
                    {/* Đã hoàn thành (Quá khứ) */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-80">
                      <div className="bg-gray-500 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          Chuyến bay đã cất cánh
                        </h3>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">Đã hoàn thành</span>
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden grayscale-[30%]">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-gray-600 text-white text-xs font-bold px-2.5 py-1 rounded">VN 1205</span>
                              <span className="text-sm font-medium text-gray-500">10/08/2026</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-700">Đà Nẵng (DAD) <span className="text-gray-400 mx-2">✈</span> TP. Hồ Chí Minh (SGN)</h4>
                            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                              <span className="text-gray-300">|</span> 
                              <span className="font-medium">Phổ Thông Đặc Biệt</span>
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                            <span className="text-2xl font-black text-gray-500 tracking-widest">VN12DX</span>
                            <button className="mt-3 text-sm text-gray-500 font-bold hover:underline">Đặt lại chuyến bay này</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Đã hủy do hết hạn thanh toán */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-80">
                      <div className="bg-red-500 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Vé chưa thanh toán (Quá hạn)
                        </h3>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">Đã hủy</span>
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="border border-red-100 rounded-xl p-5 bg-red-50 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden grayscale-[20%]">
                          <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-gray-600 text-white text-xs font-bold px-2.5 py-1 rounded">VN 8812</span>
                              <span className="text-sm font-medium text-gray-500">15/07/2026</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-700">Hà Nội (HAN) <span className="text-gray-400 mx-2">✈</span> Phú Quốc (PQC)</h4>
                            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                              <span className="text-gray-300">|</span> 
                              <span className="font-medium">Thương Gia</span>
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-red-100">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                            <span className="text-2xl font-black text-gray-500 tracking-widest line-through decoration-red-500">A7F9R1</span>
                            
                            <div className="mt-4 flex flex-col items-end w-full">
                              <p className="text-sm font-medium text-red-600 mb-1">
                                Vé đã bị hủy do quá hạn thanh toán
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Đã hủy theo yêu cầu (Chờ hoàn tiền) */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-90">
                      <div className="bg-amber-500 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Vé đã hủy theo yêu cầu
                        </h3>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">Đang hoàn tiền</span>
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="border border-amber-200 rounded-xl p-5 bg-amber-50 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden grayscale-[10%]">
                          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-gray-600 text-white text-xs font-bold px-2.5 py-1 rounded">VJ 1598</span>
                              <span className="text-sm font-medium text-gray-500">22/09/2026</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-700">Hà Nội (HAN) <span className="text-gray-400 mx-2">✈</span> Hải Phòng (HPH)</h4>
                            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" /> Hành khách: Lê Viết Phạm Sang 
                              <span className="text-gray-300">|</span> 
                              <span className="font-medium">Thương Gia Linh Hoạt</span>
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-amber-200">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Mã đặt chỗ</span>
                            <span className="text-2xl font-black text-gray-500 tracking-widest line-through decoration-amber-500">MQGVTW</span>
                            
                            <div className="mt-4 flex flex-col items-end w-full">
                              <p className="text-sm font-medium text-amber-600 mb-1 flex items-center gap-1.5">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang xử lý hoàn tiền
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
