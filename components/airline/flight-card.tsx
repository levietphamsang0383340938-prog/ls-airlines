"use client"

import { useState } from "react"
import { Plane, Clock, Check, ChevronDown } from "lucide-react"
import { type Flight, formatDuration } from "@/lib/airline-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { formatVND } from "@/lib/currency"

export function FlightCard({ flight }: { flight: Flight }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
        {/* Airline + route */}
        <div className="flex flex-1 items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Plane className="size-6 -rotate-45" />
          </div>
          <div className="flex flex-1 items-center gap-3 sm:gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">{flight.departTime}</p>
              <p className="text-xs font-medium text-muted-foreground">{flight.fromCode}</p>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                {formatDuration(flight.durationMinutes)}
              </p>
              <div className="my-1 flex w-full items-center gap-1">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="h-px flex-1 bg-border" />
                <Plane className="size-3 rotate-45 text-muted-foreground" />
                <span className="h-px flex-1 bg-border" />
                <span className="size-1.5 rounded-full bg-primary" />
              </div>
              <p
                className={cn(
                  "text-[11px] font-medium",
                  flight.stops === 0 ? "text-primary" : "text-muted-foreground",
                )}
              >
                {flight.stops === 0 ? "Non-stop" : flight.stopNote}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">{flight.arriveTime}</p>
              <p className="text-xs font-medium text-muted-foreground">{flight.toCode}</p>
            </div>
          </div>
        </div>

        {/* Airline name + flight number */}
        <div className="hidden w-32 shrink-0 border-l border-border pl-4 lg:block">
          <p className="text-sm font-semibold text-foreground">{flight.airline}</p>
          <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
        </div>
      </div>

      {/* Fare classes */}
      <div className="grid grid-cols-1 gap-2 border-t border-border bg-muted/40 p-3 sm:grid-cols-3">
        {flight.fares.map((fare) => {
          const isOpen = expanded === fare.name
          return (
            <div key={fare.name} className="rounded-xl border border-border bg-card">
              <button
                onClick={() => setExpanded(isOpen ? null : fare.name)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted",
                  isOpen && "bg-muted",
                )}
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{fare.name}</p>
                  <p className="text-lg font-bold text-primary">{formatVND(fare.price)}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <div className="border-t border-border px-3 py-3">
                  <ul className="space-y-1.5">
                    {fare.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-xs text-foreground">
                        <Check className="size-3.5 text-primary" />
                        {perk}
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-xs text-foreground">
                      <Check
                        className={cn(
                          "size-3.5",
                          fare.refundable ? "text-primary" : "text-muted-foreground/40",
                        )}
                      />
                      {fare.refundable ? "Refundable" : "Non-refundable"}
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="mt-3 w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  >
                    Select Fare
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
