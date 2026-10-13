"use client"

import { useState, useEffect } from "react"
import { Plane, Globe, Menu, X, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export function SiteHeader({
  onLogoClick,
  onLoginClick,
  onRegisterClick,
}: {
  onLogoClick?: () => void
  onLoginClick?: () => void
  onRegisterClick?: () => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { language, locale, setLanguage } = useLocale()
  const [tempLang, setTempLang] = useState<"en" | "vi">(language)

  useEffect(() => {
    if (langOpen) {
      setTempLang(language)
    }
  }, [langOpen, language])

  const [user, setUser] = useState<StoredUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Tách logic kiểm tra user thành một hàm riêng biệt
  const checkAuth = () => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userData: StoredUser = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi đọc thông tin user từ localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Chạy lần đầu tiên khi trang tải
    checkAuth();

    // Lắng nghe sự kiện tùy chỉnh "auth-change" để cập nhật ngay lập tức
    window.addEventListener("auth-change", checkAuth);
    // Lắng nghe sự thay đổi của localStorage (nếu người dùng đăng xuất ở tab khác)
    window.addEventListener("storage", checkAuth);

    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // Cập nhật state ngay lập tức
    // Phát tín hiệu cho các component khác biết đã đăng xuất
    window.dispatchEvent(new Event("auth-change")); 
  };

  return (
    !isMounted ? (
      <header className="hidden md:block sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 outline-none"></div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>
    ) : (
      <header className="hidden md:block sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 outline-none"></div>

        <nav className="hidden items-center gap-1 lg:flex">
          {/* Navigation links removed per user request */}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-white transition-colors hover:opacity-90 bg-[#006079]"
              onClick={() => setLangOpen(!langOpen)}
              type="button"
            >
              {language === 'vi' ? (
                <span className="flex items-center justify-center w-5 h-3.5 bg-[#da251d] rounded-[2px] shadow-sm">
                  <span className="text-[#ffff00] text-[10px] leading-none mb-0.5">★</span>
                </span>
              ) : (
                <span className="flex items-center justify-center w-5 h-3.5 bg-[#012169] rounded-[2px] shadow-sm relative overflow-hidden">
                  <span className="absolute w-[200%] h-0.5 bg-white rotate-45"></span>
                  <span className="absolute w-[200%] h-0.5 bg-white -rotate-45"></span>
                  <span className="absolute w-[200%] h-0.5 bg-[#C8102E] rotate-45 scale-y-50"></span>
                  <span className="absolute w-[200%] h-0.5 bg-[#C8102E] -rotate-45 scale-y-50"></span>
                  <span className="absolute w-full h-1 bg-white"></span>
                  <span className="absolute h-full w-1 bg-white"></span>
                  <span className="absolute w-full h-0.5 bg-[#C8102E]"></span>
                  <span className="absolute h-full w-0.5 bg-[#C8102E]"></span>
                </span>
              )}
              <span className="mt-0.5 leading-none">{language.toUpperCase()}</span>
            </button>

            {/* Desktop Language Popover */}
            {langOpen && (
              <div className="absolute right-0 top-full mt-3 w-[340px] rounded-xl bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 z-[100] cursor-default" onClick={e => e.stopPropagation()}>
                <button 
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={() => setLangOpen(false)}
                >
                  <X className="size-5" />
                </button>
                
                <h2 className="text-lg font-bold text-[#004d61] mb-2 font-sans tracking-tight pr-6">Chọn khu vực và ngôn ngữ</h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Các dịch vụ và tính năng có thể khác nhau, tùy theo quốc gia hoặc ngôn ngữ đã chọn.
                </p>
                
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Chọn quốc gia/khu vực</label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#006079] focus:ring-1 focus:ring-[#006079] bg-white cursor-pointer"
                        defaultValue="vn"
                      >
                        <option value="vn">Vietnam</option>
                        <option value="uk">United Kingdom</option>
                        <option value="us">United States</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Ngôn ngữ</label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#006079] focus:ring-1 focus:ring-[#006079] bg-white cursor-pointer"
                        value={tempLang}
                        onChange={(e) => setTempLang(e.target.value as "vi" | "en")}
                      >
                        <option value="vi">Vietnamese</option>
                        <option value="en">English</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <button 
                  className="mt-6 w-full rounded-md bg-[#006079] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#004d61] shadow-sm"
                  onClick={() => {
                    setLanguage(tempLang);
                    setLangOpen(false);
                  }}
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>

          {/* === UI Đăng nhập/Đăng xuất cho Desktop === */}
          {user ? (
            <div className="hidden sm:block relative group">
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted">
                <User className="size-4" />
                Chào, {user.fullName || user.email}!
                <ChevronDown className="size-3.5" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-1">
                  <a href="/profile" className="block w-full text-left rounded-md px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                    Tài khoản của tôi
                  </a>
                  <button onClick={handleLogout} className="block w-full text-left rounded-md px-4 py-2 text-sm text-red-500 font-medium transition-colors hover:bg-red-50">
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <Button
            variant="ghost"
            size="icon-lg"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-card lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {/* Navigation links removed per user request */}
            {/* === UI Đăng nhập/Đăng xuất cho Mobile === */}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground">
                    <User className="size-5" />
                    <span>Chào, {user.fullName || user.email}!</span>
                  </div>
                  <div className="flex gap-2">
                    <a href="/profile" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-[#005f73] border-[#005f73]">
                        Hồ sơ của tôi
                      </Button>
                    </a>
                    <Button variant="outline" size="sm" className="w-full text-red-500 border-red-500 hover:bg-red-50" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="lg" className="flex-1" onClick={onLoginClick}>
                    {locale.header.login}
                  </Button>
                  <Button size="lg" className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90" onClick={onRegisterClick}>
                    {locale.header.register}
                  </Button>
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  onClick={() => setLangOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    {language === 'vi' ? '🇻🇳' : '🇬🇧'}
                    {language.toUpperCase()}
                  </span>
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
      {/* Mobile Language Modal Removed from bottom to prevent duplicate rendering */}
    </header>
    )
  )
}