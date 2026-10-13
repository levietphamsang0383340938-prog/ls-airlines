"use client"

import { useEffect, type ReactNode } from "react"
import { X } from "lucide-react"

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function AuthModal({ isOpen, onClose, children }: AuthModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-screen-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
