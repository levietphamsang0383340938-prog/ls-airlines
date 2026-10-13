"use client"

import { Search, PlaneTakeoff, UserRound, CreditCard, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

export function ProgressSteps({ current = 2 }: { current?: number }) {
  const { locale } = useLocale()
  const steps = [
    { id: 1, label: locale.progressSteps[0], icon: Search },
    { id: 2, label: locale.progressSteps[1], icon: PlaneTakeoff },
    { id: 3, label: locale.progressSteps[2], icon: UserRound },
    { id: 4, label: locale.progressSteps[3], icon: CreditCard },
  ]

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {steps.map((step, i) => {
          const done = step.id < current
          const active = step.id === current
          return (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-gold bg-gold text-gold-foreground",
                    !done && !active && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : <step.icon className="size-4" />}
                </span>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Step {step.id}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      active || done ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    step.id < current ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
