"use client";

import { PaymentMethodModal } from "./payment-method-modal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubMenuFlyout } from "./SubMenuFlyout";
import Link from 'next/link';
import {
  Globe,
  ConciergeBell,
  HelpCircle,
  Crown,
  Plane,
  Sparkles,
  Ticket,
  User,
  UserPlus,
  ChevronLeft,
  ChevronDown,
  Bot,
  Map,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
};

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}
import { useLocale } from "@/components/locale-provider";

export function NavigationSidebar({
  onHomeClick,
  onRegister,
  onLoginClick,
  onOpenChat,
  isCollapsed,
  onToggle,
}: {
  onHomeClick?: () => void;
  onRegister?: () => void;
  onLoginClick?: () => void;
  onOpenChat?: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const { locale } = useLocale();

  const navItems: NavItem[] = [
    { id: "explore", label: locale.sidebar.explore, icon: Globe, href: "/explore" },
    { id: "book", label: locale.sidebar.book, icon: Ticket, href: "/" },
    { id: "service", label: locale.sidebar.service, icon: ConciergeBell, href: "/services" },
    { id: "journey", label: locale.sidebar.journey, icon: Map, href: "/manage" },
    { id: "experience", label: locale.sidebar.experience, icon: Sparkles, href: "/experience" },
  ];

  // 1. Thêm State để lưu thông tin người dùng
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();


  // 2. Hàm kiểm tra trạng thái đăng nhập từ localStorage
  const checkAuth = () => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        const userData: StoredUser = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi đọc thông tin user từ localStorage:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // 3. useEffect để lắng nghe sự kiện đăng nhập/đăng xuất
  useEffect(() => {
    checkAuth(); // Kiểm tra lần đầu khi tải trang

    // Lắng nghe tín hiệu 'auth-change' từ form đăng nhập
    window.addEventListener("auth-change", checkAuth);
    // Lắng nghe thay đổi storage nếu mở nhiều tab
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // 4. Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage")); 
    window.dispatchEvent(new Event("auth-change")); // Báo cho các component khác biết
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#005f73] text-white flex items-center justify-between px-4 z-40 shadow-md">
        <button onClick={onHomeClick} className="flex items-center gap-2 h-11 px-2 -ml-2">
          <Plane className="text-yellow-400 w-7 h-7" />
          <span className="font-bold text-base">LS Airlines</span>
        </button>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors -mr-2"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-45 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col bg-[#005f73] text-white py-4 z-50 transition-all duration-300 ease-in-out",
          "max-md:top-14 max-md:h-[calc(100vh-3.5rem)] max-md:w-64",
          isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        {/* --- Nút Thu gọn / Mở rộng (Chỉ trên Desktop) --- */}
        <button
          onClick={onToggle}
          className="hidden md:flex absolute top-1/2 right-0 z-50 h-10 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-r-md bg-[#3f7b87] text-white shadow-md transition-transform hover:scale-110"
          aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>


      {/* --- Header: Logo & Tên thương hiệu --- */}
      <div className="px-4 flex items-center h-16 border-b border-white/10">
        <button onClick={onHomeClick} className="flex items-center gap-3 w-full text-left">
          <Plane className="text-yellow-400 w-8 h-8 flex-shrink-0" />
          <span
            className={cn(
              "font-bold text-lg whitespace-nowrap transition-opacity duration-200",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}
          >
            LS Airlines
          </span>
        </button>
      </div>

      {/* --- Menu chính --- */}
      <nav className="flex-1 mt-6 px-4 space-y-2 relative">
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            {['explore', 'service', 'journey', 'experience'].includes(item.id) ? (
              <button
                onClick={() => setActiveFlyout(activeFlyout === item.id ? null : item.id)}
                className={cn(
                  "w-full flex items-center gap-3 h-11 px-3 cursor-pointer transition-colors text-left",
                  activeFlyout === item.id
                    ? "bg-[#dce9ee] text-[#005f73] rounded-l-full rounded-r-none relative z-50"
                    : "hover:bg-white/10 rounded-lg text-white",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span
                  className={cn(
                    "font-medium whitespace-nowrap transition-opacity duration-200",
                    isCollapsed ? "opacity-0" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </button>
            ) : (
              <Link href={item.href || '#'} passHref>
                <div
                  className={cn(
                    "flex items-center gap-3 h-11 px-3 rounded-lg cursor-pointer transition-colors hover:bg-white/10",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap transition-opacity duration-200",
                      isCollapsed ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            )}
          </div>
        ))}
        <SubMenuFlyout 
          activeFlyout={activeFlyout} 
          onClose={() => setActiveFlyout(null)}
          className={cn(
            "absolute top-0 w-80 rounded-2xl shadow-2xl z-40 transition-all",
            isCollapsed ? "left-[80px]" : "left-[256px]"
          )}
        />
      </nav>

      {/* --- Nút Chat với NEO --- */}
      <div className="px-4 my-4">
        <button 
          onClick={onOpenChat}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#004f61] px-3 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-colors hover:bg-[#004a5a]"
        >
          <div className="relative flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-300 flex-shrink-0" />
            <span
              className={cn(
                "font-semibold whitespace-nowrap text-white transition-opacity",
                isCollapsed ? "opacity-0" : "opacity-100"
              )}
            >
              {locale.sidebar.chatWithNeo}
            </span>
          </div>
        </button>
      </div>

      {/* --- Footer: Quản lý Đăng nhập / Tài khoản --- */}
      <div className="px-4 mb-4">
        <div
          className={cn(
            "bg-white/5 backdrop-blur-sm rounded-xl p-3 transition-all duration-300",
            isCollapsed ? "h-12 w-12 flex items-center justify-center" : "h-auto w-full"
          )}
        >
          <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <Crown className={cn("w-6 h-6 flex-shrink-0", user ? "text-cyan-300" : "text-yellow-400")} />
            <h3 className="font-bold">{user ? "LOTUSMILES" : locale.sidebar.lotusmilesUpper}</h3>
          </div>
          
          <div
            className={cn(
              "mt-3 flex flex-col gap-2 transition-opacity duration-200",
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            )}
          >
            {user ? (
              // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full text-left rounded-md px-1 py-1 transition-colors hover:bg-white/10 flex items-center justify-between group"
                >
                  <div className="text-base font-semibold truncate group-hover:text-cyan-200 transition-colors">
                    {user.fullName || user.email}
                  </div>
                  <ChevronLeft className="w-4 h-4 rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
              </div>
            ) : (
              // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
              <div className="flex w-full gap-2">
                <button 
                  onClick={onLoginClick}
                  className="flex h-9 flex-1 items-center justify-center rounded-md bg-white text-[#005f73] shadow-sm transition-colors hover:bg-gray-100"
                >
                  <span className="font-semibold text-[13px]">{locale.sidebar.login}</span>
                </button>
                <button 
                  onClick={() => router.push('/register')}
                  className="flex h-9 flex-1 items-center justify-center rounded-md bg-[#0ea5e9] text-white shadow-sm transition-colors hover:bg-[#0284c7]"
                >
                  <span className="font-semibold text-[13px]">{locale.sidebar.register}</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Icon hiển thị khi Sidebar bị thu gọn */}
          {isCollapsed && (user ? <User className="w-6 h-6 text-cyan-300" /> : <Crown className="w-6 h-6 text-yellow-400" />)}
        </div>
      </div>

      <PaymentMethodModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
    </aside>
    </>
  );
}