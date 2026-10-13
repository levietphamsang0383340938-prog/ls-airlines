"use client"

import { useMemo, useState } from "react"
import {
  SlidersHorizontal,
  ArrowLeft,
  Plane,
  Calendar,
  Users,
  X,
  RotateCcw,
} from "lucide-react"
import { flights } from "@/lib/airline-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { ProgressSteps } from "./progress-steps"
import { FlightCard } from "./flight-card"
import { formatVND } from "@/lib/currency"

type StopFilter = "all" | "nonstop" | "onestop"
type SortKey = "price" | "duration" | "depart"

const airlineNames = Array.from(new Set(flights.map((f) => f.airline)))

function minPrice(fareList: { price: number }[]) {
  return Math.min(...fareList.map((f) => f.price))
}

function departWindow(time: string) {
  const hour = Number.parseInt(time.split(":")[0], 10)
  if (hour < 12) return "early"
  if (hour < 18) return "afternoon"
  return "evening"
}

export function FlightResults({ onBack }: { onBack?: () => void }) {
  const [maxPrice, setMaxPrice] = useState(1300)
  const [stops, setStops] = useState<StopFilter>("all")
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [windows, setWindows] = useState<string[]>([])
  const [sort, setSort] = useState<SortKey>("price")
  const [mobileFilters, setMobileFilters] = useState(false)
  const { locale } = useLocale()
  const timeWindows = locale.flightResults.timeWindows

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function reset() {
    setMaxPrice(1300)
    setStops("all")
    setSelectedAirlines([])
    setWindows([])
  }

  const filtered = useMemo(() => {
    const result = flights.filter((f) => {
      if (minPrice(f.fares) > maxPrice) return false
      if (stops === "nonstop" && f.stops !== 0) return false
      if (stops === "onestop" && f.stops < 1) return false
      if (selectedAirlines.length && !selectedAirlines.includes(f.airline)) return false
      if (windows.length && !windows.includes(departWindow(f.departTime))) return false
      return true
    })
    return result.sort((a, b) => {
      if (sort === "price") return minPrice(a.fares) - minPrice(b.fares)
      if (sort === "duration") return a.durationMinutes - b.durationMinutes
      return a.departTime.localeCompare(b.departTime)
    })
  }, [maxPrice, stops, selectedAirlines, windows, sort])

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          {locale.flightResults.filters}
        </h3>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="size-3" />
          {locale.flightResults.reset}
        </button>
      </div>

      {/* Price */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{locale.flightResults.maxPrice}</p>
          <span className="text-sm font-bold text-primary">{formatVND(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={290}
          max={1300}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--gold)]"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>{formatVND(290)}</span>
          <span>{formatVND(1300)}</span>
        </div>
      </div>

      {/* Stops */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">{locale.flightResults.stops}</p>
        <div className="flex flex-col gap-1.5">
          {(
            [
              { id: "all", label: locale.flightResults.anyStops },
              { id: "nonstop", label: locale.flightResults.nonstopOnly },
              { id: "onestop", label: locale.flightResults.onePlusStops },
            ] as { id: StopFilter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStops(opt.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                stops === opt.id
                  ? "border-primary bg-primary/5 font-medium text-primary"
                  : "border-border text-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border-2",
                  stops === opt.id ? "border-primary" : "border-muted-foreground/40",
                )}
              >
                {stops === opt.id && <span className="size-2 rounded-full bg-primary" />}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Departure time */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">{locale.flightResults.departureTime}</p>
        <div className="flex flex-col gap-1.5">
          {timeWindows.map((w) => (
            <Checkbox
              key={w.id}
              label={w.label}
              checked={windows.includes(w.id)}
              onChange={() => toggle(windows, w.id, setWindows)}
            />
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">{locale.flightResults.airlines}</p>
        <div className="flex flex-col gap-1.5">
          {airlineNames.map((name) => (
            <Checkbox
              key={name}
              label={name}
              checked={selectedAirlines.includes(name)}
              onChange={() => toggle(selectedAirlines, name, setSelectedAirlines)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <ProgressSteps current={2} />

      {/* Route summary bar */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
            {locale.flightResults.modifySearch}
          </button>
          <span className="hidden h-4 w-px bg-primary-foreground/20 sm:block" />
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Plane className="size-4 -rotate-45" />
            SGN <span className="text-primary-foreground/60">→</span> NRT
          </p>
          <p className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
            <Calendar className="size-4" />
            Sun, 12 Jul 2026
          </p>
          <p className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
            <Users className="size-4" />
            1 Adult · Economy
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
              {filterPanel}
            </div>
          </aside>

          {/* Flight list */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {filtered.length === 1
                    ? locale.flightResults.flightCountSingle
                    : locale.flightResults.flightCountMultiple.replace("{{count}}", String(filtered.length))}
                </h2>
                <p className="text-sm text-muted-foreground">{locale.flightResults.pricesPerPassenger}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-1.5 lg:hidden"
                  onClick={() => setMobileFilters(true)}
                >
                  <SlidersHorizontal className="size-4" />
                  {locale.flightResults.filters}
                </Button>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-sm text-muted-foreground">{locale.flightResults.sort}</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="price">{locale.flightResults.lowestPrice}</option>
                    <option value="duration">{locale.flightResults.shortestDuration}</option>
                    <option value="depart">{locale.flightResults.earliestDeparture}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filtered.length > 0 ? (
                filtered.map((flight) => <FlightCard key={flight.id} flight={flight} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <p className="font-semibold text-foreground">{locale.flightResults.noFlightsMessage}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locale.flightResults.noFlightsHint}
                  </p>
                  <Button onClick={reset} variant="outline" size="lg" className="mt-4">
                    {locale.flightResults.resetFilters}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">{locale.flightResults.refineResults}</span>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Close filters"
                onClick={() => setMobileFilters(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            {filterPanel}
            <Button
              size="lg"
              className="mt-6 w-full bg-primary text-primary-foreground"
              onClick={() => setMobileFilters(false)}
            >
              {locale.flightResults.showFlights.replace("{{count}}", String(filtered.length))}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 text-left text-sm text-foreground transition-colors hover:text-primary"
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
        )}
      >
        {checked && <Plane className="size-3 -rotate-45" />}
      </span>
      {label}
    </button>
  )
}
