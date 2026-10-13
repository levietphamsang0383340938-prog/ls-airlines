"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LotusMilesRegisterStep1 } from "./lotusmiles-register-step1"
import { LotusMilesRegisterStep2 } from "./lotusmiles-register-step2"
import { Button } from "@/components/ui/button"

export function LotusMilesRegisterForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<{ email: string; phoneAreaCode: string; phoneNumber: string }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleStep1Next = (data: { email: string; phoneAreaCode: string; phoneNumber: string }) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
  }

  const handleStep2Submit = async (step2Data: any) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Xử lý chuẩn định dạng payload ngày sinh (nếu cần) và dữ liệu tổng hợp
      const fullData = {
        ...step1Data,
        ...step2Data
      }

      console.log("🚀 [REGISTER] Submitting registration for:", fullData.email)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      })

      // Fix runtime error: Tránh lỗi khi backend trả về text/html thay vì JSON
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("❌ [API ERROR] Phản hồi không phải JSON:", text);
        throw new Error("Lỗi hệ thống: Phản hồi từ máy chủ không đúng định dạng (Not JSON).");
      }

      console.log("📥 [REGISTER] Response status:", response.status, data.message)

      if (!response.ok) {
        // Bắt chính xác mã HTTP Status
        let errorMsg = data.message || "Đăng ký thất bại.";
        if (response.status === 409) {
          errorMsg = `[Trùng lặp dữ liệu] ${errorMsg}`;
        } else if (response.status === 400) {
          errorMsg = `[Lỗi dữ liệu] ${errorMsg}`;
        } else if (response.status >= 500) {
          errorMsg = `[Lỗi máy chủ] ${errorMsg}`;
        }
        throw new Error(errorMsg);
      }

      setSuccess(data.message || 'Đăng ký thành công!')
      
      // Show success message and redirect
      setTimeout(() => {
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        router.push('/login')
      }, 2000)

    } catch (err: any) {
      console.error("❌ LỖI ĐĂNG KÝ (RUNTIME/CATCH):", err)
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full flex-col items-center justify-center bg-slate-50/50 p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100 mx-auto">
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/40 bg-green-500/10 px-6 py-4 text-sm text-green-600">
            {success}
          </div>
        )}

        {currentStep === 1 && (
          <LotusMilesRegisterStep1 
            onNext={handleStep1Next}
            initialData={step1Data}
          />
        )}

        {currentStep === 2 && step1Data && (
          <LotusMilesRegisterStep2
            onBack={handleStep2Back}
            onSubmit={handleStep2Submit}
            loading={loading}
          />
        )}

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className={`h-2 w-8 rounded-full transition-colors ${
            currentStep >= 1 ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`h-2 w-8 rounded-full transition-colors ${
            currentStep >= 2 ? 'bg-primary' : 'bg-muted'
          }`} />
        </div>
      </div>
    </div>
  )
}