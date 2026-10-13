"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService" // Import authService
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterForm() {
  const router = useRouter()
  const { locale } = useLocale()
  const [email, setEmail] = useState("")
  const [phoneAreaCode, setPhoneAreaCode] = useState("+84")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  function validate() {
    if (!email || !phoneNumber || !password || !confirmPassword) {
      return locale.auth.fillAllFields
    }
    if (!emailPattern.test(email)) {
      return locale.auth.invalidEmail
    }
    if (!/^[0-9]{9,15}$/.test(phoneNumber)) {
      return "Số điện thoại phải từ 9-15 chữ số"
    }
    if (password.length < 8) {
      return locale.auth.passwordLength
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return locale.auth.passwordComplexity // New locale key needed
    }
    if (password !== confirmPassword) {
      return locale.auth.passwordMismatch
    }
    return ""
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    // Explicitly create the payload with standardized keys matching backend API
    const payload = { 
      email: email.toLowerCase().trim(),
      phoneAreaCode: phoneAreaCode.trim(),
      phoneNumber: phoneNumber.trim(),
      password,
      confirmPassword,
      // Add required fields for simple registration
      title: "Mr",
      gender: "Male",
      firstName: "User",
      lastName: "User",
      displayName: "User",
      dateOfBirth: "2000-01-01",
      nationality: "Vietnam",
      language: "vi",
      country: "Vietnam",
      province: "Hanoi",
      agreeTerms: true
    };

    try { // Use authService for consistency and error handling
      const data = await authService.register(payload);
      console.log("RESPONSE TỪ authService.register:", data);

      // authService.register handles non-ok responses by throwing an error
      // so if we reach here, it was successful.
      if (data.message) {
        setSuccess(data.message);
      }
      
      setSuccess("Đăng ký thành công! Chuyển hướng...");
      setTimeout(() => router.push('/login'), 2000);

    } catch (err: any) {
      console.error("LỖI FETCH FRONTEND:", err);
      setError(err.response?.data?.message || err.message || "Lỗi kết nối Server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-10">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Xin chào!</p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{locale.auth.registerTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {locale.auth.registerDescription}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">{locale.auth.email}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={locale.auth.emailPlaceholder}
            className="w-full rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>

        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">Số điện thoại</span> 
          <div className="flex gap-3">
            <select
              value={phoneAreaCode}
              onChange={(event) => setPhoneAreaCode(event.target.value)}
              className="w-32 rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="+84">+84</option>
              <option value="+1">+1</option>
              <option value="+81">+81</option>
              <option value="+82">+82</option>
              <option value="+86">+86</option>
              <option value="+65">+65</option>
              <option value="+66">+66</option>
              <option value="+60">+60</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="912345678"
              className="flex-1 rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </label>

        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">{locale.auth.password}</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={locale.auth.passwordPlaceholder}
              className="w-full rounded-2xl border border-border bg-background/90 px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </label>

        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">{locale.auth.confirmPassword}</span>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={locale.auth.confirmPasswordPlaceholder}
              className="w-full rounded-2xl border border-border bg-background/90 px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </label>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-500">
            {success}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading || !!success}>
          {loading ? `${locale.auth.registerTitle}...` : locale.auth.submitRegister}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{locale.auth.haveAccount}</span>
        <a href="/login" className="font-semibold text-primary transition hover:text-primary/80">
          {locale.auth.loginNow}
        </a>
      </div>
    </div>
  )
}
