"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

interface Step1Props {
  onNext: (data: { email: string; phoneAreaCode: string; phoneNumber: string }) => void
  initialData?: { email: string; phoneAreaCode: string; phoneNumber: string }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LotusMilesRegisterStep1({ onNext, initialData }: Step1Props) {
  const { locale } = useLocale()
  const [email, setEmail] = useState(initialData?.email || "")
  const [phoneAreaCode, setPhoneAreaCode] = useState(initialData?.phoneAreaCode || "+84")
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "")
  const [errors, setErrors] = useState<{ email?: string; phoneNumber?: string }>({})

  const validate = () => {
    const newErrors: { email?: string; phoneNumber?: string } = {}

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Email không đúng định dạng"
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{9,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải từ 9-15 chữ số"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const step1Data = {
        email: email.toLowerCase().trim(),
        phoneAreaCode: phoneAreaCode.trim(),
        phoneNumber: phoneNumber.trim()
      }
      onNext(step1Data)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-[#005f73] sm:text-4xl">
          Đăng ký hội viên Bông Sen Vàng
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin liên lạc của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-[#005f73]">
            <span className="text-[#005f73]">Email *</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
              errors.email
                ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-semibold text-[#005f73]">
            <span className="text-[#005f73]">Số điện thoại *</span>
          </label>
          <div className="flex gap-3">
            <select
              value={phoneAreaCode}
              onChange={(e) => setPhoneAreaCode(e.target.value)}
              className="w-32 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20"
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="912345678"
              className={`flex-1 rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 placeholder:text-slate-400 ${
                errors.phoneNumber
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-slate-300 focus:border-[#005f73] focus:ring-[#005f73]/20"
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full bg-[#005f73] hover:bg-[#004a5a] text-white">
          Tiếp tục
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Bạn đã có tài khoản hội viên?{" "}
          <a href="/login" className="font-semibold text-[#0ea5e9] transition hover:text-[#0284c7]">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  )
}