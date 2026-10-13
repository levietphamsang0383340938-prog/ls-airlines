"use client"

import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import { offers } from "@/lib/airline-data"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import { formatVND } from "@/lib/currency"

export function Offers({ onBook }: { onBook?: () => void }) {
  const { locale } = useLocale()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-foreground/70">
            {locale.offers.label}
          </span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {locale.offers.title}
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            {locale.offers.description}
          </p>
        </div>
        <Button variant="outline" size="lg" className="gap-1.5">
          {locale.offers.viewAllDeals}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
        {offers.map((offer, index) => (
          <article
            key={offer.id}
            className="group relative overflow-hidden rounded-xl border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl aspect-[3/4] flex flex-col min-w-[85vw] sm:min-w-0 snap-center shrink-0"
          >
            <img
              src={offer.image || "/placeholder.svg"}
              alt={offer.country}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
            
            {/* Top Right Badge */}
            <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {index + 1}/12
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-4 flex flex-col z-10">
              <div className="mt-8 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {offer.country}
                </h3>
              </div>

              <div className="flex flex-col justify-end shrink-0">
                <div className="flex flex-col items-end text-white mb-3">
                  <span className="text-xs font-medium opacity-90">Từ</span>
                  <span className="text-2xl font-bold leading-tight shadow-black drop-shadow-md">{offer.price.toLocaleString("vi-VN")} VND*</span>
                  <span className="text-xs opacity-90 mt-0.5">{offer.tag}</span>
                  <span className="text-xs opacity-90">{offer.cabin}</span>
                </div>
                
                <Button
                  onClick={onBook}
                  className="w-full bg-[#006079] text-white hover:bg-[#004d61] font-semibold h-10 shrink-0 shadow-md"
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination dots (static for visual match) */}
      <div className="mt-8 flex justify-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[#006079]"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
      </div>
    </section>
  )
}
