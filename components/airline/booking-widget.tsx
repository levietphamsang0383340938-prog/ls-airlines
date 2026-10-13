"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftRight,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Users,
  Tag,
  Search,
  Minus,
  Plus,
  ChevronDown,
  Armchair,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

type TripType = "round" | "oneway" | "multi"

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="group flex-1 rounded-xl border border-border bg-card px-3.5 py-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 hover:border-primary/40">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

export function BookingWidget({ onSearch }: { onSearch?: () => void }) {
  const [tripType, setTripType] = useState<TripType>("round")
  const [from, setFrom] = useState("Ho Chi Minh City (SGN)")
  const [to, setTo] = useState("Tokyo (NRT)")
  const [paxOpen, setPaxOpen] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabin, setCabin] = useState("Economy")
  const paxRef = useRef<HTMLDivElement>(null)
  const { locale } = useLocale()
  const tripTabs = [
    { id: "round" as TripType, label: locale.bookingWidget.tripTabs[0] },
    { id: "oneway" as TripType, label: locale.bookingWidget.tripTabs[1] },
    { id: "multi" as TripType, label: locale.bookingWidget.tripTabs[2] },
  ]
  const cabinClasses = locale.bookingWidget.cabinClasses

  const totalPax = adults + children + infants

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (paxRef.current && !paxRef.current.contains(e.target as Node)) {
        setPaxOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function swap() {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card p-4 shadow-2xl shadow-primary/10 sm:p-5">
      {/* Trip type tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
        {tripTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTripType(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
              tripType === tab.id
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {/* From / To with swap */}
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <Field icon={<PlaneTakeoff className="size-3.5" />} label={locale.bookingWidget.from}>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              placeholder={locale.bookingWidget.originPlaceholder}
            />
          </Field>

          <button
            onClick={swap}
            aria-label="Swap origin and destination"
            className="absolute left-1/2 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-primary shadow-md transition-transform hover:rotate-180 hover:text-gold-foreground sm:flex"
          >
            <ArrowLeftRight className="size-4" />
          </button>

          <Field icon={<PlaneLanding className="size-3.5" />} label={locale.bookingWidget.to}>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              placeholder={locale.bookingWidget.destinationPlaceholder}
            />
          </Field>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Field icon={<Calendar className="size-3.5" />} label={locale.bookingWidget.departure}>
            <input
              type="date"
              defaultValue="2026-07-12"
              className="w-full bg-transparent text-sm font-semibold text-foreground outline-none"
            />
          </Field>
          <Field icon={<Calendar className="size-3.5" />} label={locale.bookingWidget.return}>
            <input
              type="date"
              defaultValue="2026-07-20"
              disabled={tripType === "oneway"}
              className="w-full bg-transparent text-sm font-semibold text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
          </Field>
        </div>

        {/* Passengers & cabin + promo */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Passenger selector */}
          <div className="relative flex-1" ref={paxRef}>
            <button
              onClick={() => setPaxOpen((v) => !v)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border bg-card px-3.5 py-2.5 text-left transition-colors hover:border-primary/40",
                paxOpen ? "border-primary ring-2 ring-primary/15" : "border-border",
              )}
            >
              <span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Users className="size-3.5 text-primary" />
                  {locale.bookingWidget.passengersAndClass}
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-foreground">
                  {totalPax} {totalPax > 1 ? locale.bookingWidget.passengersPlural : locale.bookingWidget.passengers} · {cabin}
                </span>
              </span>
              <ChevronDown
                className={cn("size-4 text-muted-foreground transition-transform", paxOpen && "rotate-180")}
              />
            </button>

            {paxOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-72 rounded-xl border border-border bg-card p-4 shadow-2xl">
                <Counter label={locale.bookingWidget.adults} hint={locale.bookingWidget.adultsHint} value={adults} min={1} onChange={setAdults} />
                <Counter label={locale.bookingWidget.children} hint={locale.bookingWidget.childrenHint} value={children} min={0} onChange={setChildren} />
                <Counter label={locale.bookingWidget.infants} hint={locale.bookingWidget.infantsHint} value={infants} min={0} onChange={setInfants} />
                <div className="mt-3 border-t border-border pt-3">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Armchair className="size-3.5 text-primary" />
                    {locale.bookingWidget.cabinClass}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {cabinClasses.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCabin(c)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          cabin === c
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-foreground hover:bg-muted",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="mt-3 w-full bg-primary text-primary-foreground"
                  size="lg"
                  onClick={() => setPaxOpen(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {/* Promo code */}
          <Field icon={<Tag className="size-3.5" />} label={locale.bookingWidget.promoCode}>
            <input
              className="w-full bg-transparent text-sm font-semibold uppercase text-foreground outline-none placeholder:font-normal placeholder:normal-case placeholder:text-muted-foreground"
              placeholder={locale.bookingWidget.promoCodePlaceholder}
            />
          </Field>
        </div>

        {/* Search */}
        <Button
          size="lg"
          onClick={onSearch}
          className="mt-1 h-12 w-full gap-2 bg-gold text-base font-bold text-gold-foreground shadow-lg shadow-gold/30 hover:bg-gold/90"
        >
          <Search className="size-5" />
          {locale.bookingWidget.searchFlights}
          <Plane className="size-5 -rotate-45" />
        </Button>
      </div>
    </div>
  )
}

function Counter({
  label,
  hint,
  value,
  min,
  onChange,
}: {
  label: string
  hint: string
  value: number
  min: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex size-8 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-foreground">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="flex size-8 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
