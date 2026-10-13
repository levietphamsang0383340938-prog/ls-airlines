"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import authService from "../../lib/authService"
import { cn } from "@/lib/utils"

type AuthFormProps = {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onSwitchMode?: (mode: 'login' | 'register') => void;
}

const phoneRegex = /^(0?)(3[2-9]|5[689]|7[06-9]|8[0-689]|9[0-46-9])[0-9]{7}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tái sử dụng class CSS chung cho tất cả input
const inputClassName = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20";

export function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const { locale } = useLocale();

  // 1. TỐI ƯU STATE: Gộp tất cả field vào 1 object duy nhất
  const [formData, setFormData] = useState({
    identifier: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Hàm xử lý chung khi người dùng gõ vào bất kỳ ô input nào
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Xóa lỗi của trường đang được sửa
    setFieldErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleValidation = () => {
    const { fullName, email, phoneNumber, password, confirmPassword, identifier } = formData;
    const errors: Record<string, string> = {};

    if (mode === 'register') {
      if (!fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ và tên';
      }
      if (!email) {
        errors.email = 'Vui lòng nhập email';
      } else if (!emailRegex.test(email)) {
        errors.email = 'Email không hợp lệ (ví dụ: user@gmail.com)';
      }
      if (!phoneNumber) {
        errors.phoneNumber = 'Vui lòng nhập số điện thoại';
      } else if (!phoneRegex.test(phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ';
      }
      if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu';
      } else if (password.length < 8) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        errors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
      }
      if (!confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    } else {
      if (!identifier) {
        errors.identifier = 'Vui lòng nhập email, số điện thoại hoặc số thẻ hội viên';
      }
      if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu';
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const validationError = handleValidation();
    if (validationError) {
      setFieldErrors(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await authService.register({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
        });
        setSuccessMessage(locale.auth.registerSuccess);
        onSwitchMode?.('login');
      // Tìm đến đoạn này trong auth-form.tsx (Khoảng dòng 86-90)
      } else {
        await authService.login({
          identifier: formData.identifier,
          password: formData.password,
        });
         setSuccessMessage("Đăng nhập thành công!");
         // Thêm dòng này để đánh thức thanh Header
         window.dispatchEvent(new Event("auth-change"));
        
        onSuccess?.(); // Đóng Modal

        // THÊM DÒNG NÀY: Tải lại trang để Header cập nhật trạng thái User từ LocalStorage
        window.location.reload(); 
      }
      
    } catch (error: any) {
      // Xử lý lỗi từ server với thông tin trường cụ thể
      if (error.response?.data?.errors) {
        // Server trả về lỗi theo từng trường
        setFieldErrors(error.response.data.errors);
        setErrorMessage('Vui lòng kiểm tra lại các thông tin bên dưới');
      } else if (error.response?.data?.message) {
        // Server trả về thông báo lỗi chung
        setErrorMessage(error.response.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-bold text-gray-900">
          {mode === 'register' ? locale.auth.registerTitle : locale.auth.loginTitle}
        </h2>
        <p className="text-sm text-gray-600">
          {mode === 'register'
            ? locale.auth.registerDescriptionAuthForm
            : "Đăng nhập để quản lý đặt chỗ, tích dặm và nhiều hơn nữa."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <form key={mode} onSubmit={handleSubmit}>
        {mode === 'register' ? (
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="font-semibold text-gray-800">{locale.auth.registerInfo}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-9">
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="mb-1 block text-xs text-gray-600">Họ và tên *</label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                  className={cn(inputClassName, fieldErrors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-xs text-gray-600">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập Email"
                  required
                  className={cn(inputClassName, fieldErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="country-code" className="mb-1 block text-xs text-gray-600">Mã Vùng *</label>
                <div className="relative">
                  <select
                    id="country-code"
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm transition-colors focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20"
                    disabled
                  >
                    <option>VIET NAM (84)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="mb-1 block text-xs text-gray-600">Số điện thoại *</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                  className={cn(inputClassName, fieldErrors.phoneNumber && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                />
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-xs text-gray-600">Mật khẩu *</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 8 ký tự"
                    required
                    className={cn(inputClassName, "pr-10", fieldErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-xs text-gray-600">Xác nhận mật khẩu *</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className={cn(inputClassName, "pr-10", fieldErrors.confirmPassword && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="font-semibold text-gray-800">{locale.auth.loginInfo}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-9">
              <div className="md:col-span-2">
                <label htmlFor="identifier" className="mb-1 block text-xs text-gray-600">Email / Số điện thoại / Số thẻ hội viên *</label>
                <input
                  id="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Nhập Email, Số điện thoại hoặc Số thẻ"
                  required
                  className={cn(inputClassName, fieldErrors.identifier && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                />
                {fieldErrors.identifier && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.identifier}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="password" className="mb-1 block text-xs text-gray-600">Mật khẩu *</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required
                    className={cn(inputClassName, "pr-10", fieldErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#006079] px-8 py-2.5 font-semibold text-white transition-colors hover:bg-[#004d61] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? locale.auth.processing : (mode === 'register' ? locale.auth.submitRegister : locale.auth.submitLogin)}
          </button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          {mode === 'register' ? (
            <p>{locale.auth.haveAccount}{" "}
              <button type="button" onClick={() => onSwitchMode?.('login')} className="font-semibold text-[#006079] hover:underline">
                {locale.auth.loginNow}
              </button>
            </p>
          ) : (
            <p>Chưa có tài khoản?{" "}
              <button type="button" onClick={() => onSwitchMode?.('register')} className="font-semibold text-[#006079] hover:underline">
                Đăng ký ngay
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}