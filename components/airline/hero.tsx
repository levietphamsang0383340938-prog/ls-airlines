"use client"

import Image from "next/image"
import { ShieldCheck, Award, Headset } from "lucide-react"
import { FlightSearchWidget } from "./flight-search-widget"
import { useLocale } from "@/components/locale-provider"

export function Hero({ onSearch }: { onSearch?: (query?: string) => void }) {
  const { locale } = useLocale()

  return (
    <section className="relative">
      {/* Background */}
      <div className="relative h-[460px] w-full overflow-hidden sm:h-[520px] lg:h-[560px]">
        <Image
          src="/images/hero-sky.png"
          alt="Azure Air jet flying above golden clouds at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              <Award className="size-3.5" />
              {locale.hero.badge}
            </span>
            <h1 className="max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-4xl lg:text-6xl">
              {locale.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/90 sm:text-base md:text-lg">
              {locale.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping booking widget */}
      <div className="relative z-10 mx-auto -mt-28 max-w-6xl px-4 sm:-mt-32 sm:px-6 lg:px-8">
        <FlightSearchWidget onSearch={onSearch} />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: locale.hero.features[0]?.title, desc: locale.hero.features[0]?.desc },
            { icon: Award, title: locale.hero.features[1]?.title, desc: locale.hero.features[1]?.desc },
            { icon: Headset, title: locale.hero.features[2]?.title, desc: locale.hero.features[2]?.desc },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}