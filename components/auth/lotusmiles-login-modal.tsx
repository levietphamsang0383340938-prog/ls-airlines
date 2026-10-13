"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"

type LotusmilesLoginModalProps = {
  isOpen: boolean
  onClose: () => void
}

type LoginTab = "card" | "email" | "phone"

export function LotusmilesLoginModal({ isOpen, onClose }: LotusmilesLoginModalProps) {
  const [activeTab, setActiveTab] = useState<LoginTab>("card")
  const [showPassword, setShowPassword] = useState(false)
  const [identity, setIdentity] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setIdentity("")
      setPassword("")
      setShowPassword(false)
      setActiveTab("card")
    }
  }, [isOpen])

  if (!isOpen) return null

  const labelMap: Record<LoginTab, string> = {
    card: "Số thẻ",
    email: "Email",
    phone: "Số điện thoại",
  }

  const placeholderMap: Record<LoginTab, string> = {
    card: "Nhập số thẻ",
    email: "Nhập email",
    phone: "Nhập số điện thoại",
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("Login attempt:", { tab: activeTab, identity })
    // Implement login logic here
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl xl:ml-60"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label="Đóng"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#005d87]">Đăng nhập Lotusmiles</h2>
            <div className="mt-4 -space-x-4">
              <img src="/placeholder-logo.svg" alt="Titanium" className="inline-block h-12 w-auto" />
              <img src="/placeholder-logo.svg" alt="Gold" className="inline-block h-12 w-auto" />
              <img src="/placeholder-logo.svg" alt="Platinum" className="inline-block h-12 w-auto" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-full bg-slate-100 p-1">
            {[
              { id: "card", label: "Số thẻ" },
              { id: "email", label: "Email" },
              { id: "phone", label: "Số điện thoại" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as LoginTab)}
                className={cn(
                  "rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-[#006079] shadow"
                    : "text-slate-600 hover:bg-slate-200/70",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor={activeTab} className="mb-1.5 block text-xs font-medium text-slate-600">
                {labelMap[activeTab]}
              </label>
              <input
                id={activeTab}
                type={activeTab === "email" ? "email" : activeTab === "phone" ? "tel" : "text"}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={placeholderMap[activeTab]}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-[#006079] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#005269]"
            >
              Đăng nhập
            </button>
          </form>

          <button
            type="button"
            className="mx-auto block text-center text-sm font-medium text-[#006079] hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  )
}
