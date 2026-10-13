"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

interface Step2Props {
  onBack: () => void
  onSubmit: (data: any) => void
  loading?: boolean
  initialData?: {
    title: string
    gender: string
    firstName: string
    middleName: string
    lastName: string
    displayName: string
    dateOfBirth: string
    nationality: string
    language: string
    country: string
    province: string
    promoCode: string
    password: string
    confirmPassword: string
    receiveNewsletters: boolean
    agreeTerms: boolean
  }
}

export function LotusMilesRegisterStep2({ onBack, onSubmit, loading = false, initialData }: Step2Props) {
  const { locale } = useLocale()
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "Mr",
    gender: initialData?.gender || "Male",
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    displayName: initialData?.displayName || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    nationality: initialData?.nationality || "Vietnam",
    language: initialData?.language || "vi",
    country: initialData?.country || "Vietnam",
    province: initialData?.province || "",
    promoCode: initialData?.promoCode || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    receiveNewsletters: initialData?.receiveNewsletters || false,
    agreeTerms: initialData?.agreeTerms || false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = "Vui lòng chọn danh xưng"
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính"
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên"
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ"
    if (!formData.displayName.trim()) newErrors.displayName = "Vui lòng nhập tên hiển thị"
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh"
    } else {
      const today = new Date()
      const birthDate = new Date(formData.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const isOldEnough = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
        ? age - 1 >= 12 
        : age >= 12
      
      if (!isOldEnough) {
        newErrors.dateOfBirth = "Bạn phải đủ 12 tuổi để đăng ký."
      }
    }
    if (!formData.nationality.trim()) newErrors.nationality = "Vui lòng nhập quốc tịch"
    if (!formData.language) newErrors.language = "Vui lòng chọn ngôn ngữ"
    if (!formData.country.trim()) newErrors.country = "Vui lòng nhập quốc gia"
    if (!formData.province.trim()) newErrors.province = "Vui lòng nhập tỉnh/thành phố"
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất một chữ hoa"
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất một chữ thường"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất một số"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản và điều kiện"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;
    return score;
  };
  const strengthScore = getPasswordStrength(formData.password);

  const renderStrengthBar = () => {
    let color = "bg-muted";
    if (strengthScore > 0 && strengthScore <= 2) color = "bg-blue-300";
    else if (strengthScore === 3 || strengthScore === 4) color = "bg-[#38bdf8]";
    else if (strengthScore === 5) color = "bg-[#0ea5e9]";

    return (
      <div className="mt-2 space-y-2">
        <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-full flex-1 ${
                level <= strengthScore ? color : "bg-blue-50 border border-blue-100"
              } transition-colors`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
          <span className={`flex items-center gap-1.5 ${formData.password.length >= 8 ? "text-[#0ea5e9] font-medium" : ""}`}>
            {formData.password.length >= 8 ? "✓" : "○"} Ít nhất 8 ký tự
          </span>
          <span className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? "text-[#0ea5e9] font-medium" : ""}`}>
            {/[A-Z]/.test(formData.password) ? "✓" : "○"} Chữ hoa
          </span>
          <span className={`flex items-center gap-1.5 ${/[a-z]/.test(formData.password) ? "text-[#0ea5e9] font-medium" : ""}`}>
            {/[a-z]/.test(formData.password) ? "✓" : "○"} Chữ thường
          </span>
          <span className={`flex items-center gap-1.5 ${/[0-9]/.test(formData.password) ? "text-[#0ea5e9] font-medium" : ""}`}>
            {/[0-9]/.test(formData.password) ? "✓" : "○"} Số
          </span>
          <span className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-[#0ea5e9] font-medium" : ""}`}>
            {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "✓" : "○"} Ký tự đặc biệt
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-[#005f73] sm:text-4xl">
          Thông tin cá nhân
        </h1>
        <p className="text-sm text-muted-foreground">
          Hoàn tất thông tin để trở thành hội viên Bông Sen Vàng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Danh xưng *</span>
            </label>
            <select
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                errors.title
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            >
              <option value="">Chọn danh xưng</option>
              <option value="Mr">Ông (Mr)</option>
              <option value="Ms">Bà (Ms)</option>
              <option value="Mrs">Bà (Mrs)</option>
              <option value="Dr">Tiến sĩ (Dr)</option>
              <option value="Prof">Giáo sư (Prof)</option>
              <option value="Other">Khác</option>
            </select>
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Giới tính *</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                errors.gender
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Họ *</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Nguyễn"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.lastName
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Đệm</span>
            </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
              placeholder="Văn"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20 placeholder:text-slate-400"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Tên *</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="An"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.firstName
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
          </div>
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-semibold text-[#005f73]">
            <span className="text-[#005f73]">Tên hiển thị trên thẻ *</span>
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="NGUYEN VAN AN"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
              errors.displayName
                ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
            }`}
          />
          {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Ngày sinh *</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                errors.dateOfBirth
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Quốc tịch *</span>
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
              placeholder="Vietnam"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.nationality
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.nationality && <p className="text-sm text-destructive">{errors.nationality}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Ngôn ngữ *</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                errors.language
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
            </select>
            {errors.language && <p className="text-sm text-destructive">{errors.language}</p>}
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Quốc gia/Vùng *</span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Vietnam"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.country
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#005f73]">
              <span className="text-[#005f73]">Tỉnh/Thành phố *</span>
            </label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              placeholder="Hà Nội"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.province
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
            {errors.province && <p className="text-sm text-destructive">{errors.province}</p>}
          </div>
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-semibold text-[#005f73]">
            <span className="text-[#005f73]">Mã ưu đãi (tùy chọn)</span>
          </label>
          <input
            type="text"
            value={formData.promoCode}
            onChange={(e) => handleChange("promoCode", e.target.value)}
            placeholder="Nhập mã ưu đãi nếu có"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20 placeholder:text-slate-400"
          />
        </div>

        {/* Password Section */}
        <div className="border-t border-blue-100 pt-5">
          <h3 className="text-lg font-semibold text-[#005f73] mb-4">Bảo mật tài khoản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid gap-3">
              <label className="text-sm font-semibold text-[#005f73]">
                <span className="text-[#005f73]">Mật khẩu *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Ít nhất 8 ký tự, chữ hoa, chữ thường, số"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {renderStrengthBar()}
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold text-[#005f73]">
                <span className="text-[#005f73]">Nhắc lại mật khẩu *</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                    errors.confirmPassword
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 border-t border-blue-100 pt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.receiveNewsletters}
              onChange={(e) => handleChange("receiveNewsletters", e.target.checked)}
              className="w-5 h-5 rounded border-blue-200 accent-[#0ea5e9]"
            />
            <span className="text-sm text-foreground">
              Tôi muốn nhận thông tin khuyến mãi và tin tức từ Bông Sen Vàng
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange("agreeTerms", e.target.checked)}
              className={`w-5 h-5 mt-0.5 rounded accent-[#0ea5e9] ${
                errors.agreeTerms ? "border-destructive" : "border-blue-200"
              }`}
            />
            <span className="text-sm text-foreground">
              Tôi đồng ý với <a href="/terms" className="text-[#0ea5e9] font-medium hover:underline">Điều khoản và điều kiện</a> và <a href="/privacy" className="text-[#0ea5e9] font-medium hover:underline">Chính sách bảo mật</a> của Bông Sen Vàng *
            </span>
          </label>
          {errors.agreeTerms && <p className="text-sm text-destructive ml-8">{errors.agreeTerms}</p>}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1" disabled={loading}>
            Quay lại
          </Button>
          <Button type="submit" size="lg" className="flex-1 bg-[#005f73] hover:bg-[#004a5a] text-white" disabled={loading}>
            {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
          </Button>
        </div>
      </form>
    </div>
  )
}