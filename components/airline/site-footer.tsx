"use client"

import { Plane, Globe, Camera, Send, Video, MessageCircle } from "lucide-react"
import { useLocale } from "@/components/locale-provider"

export function SiteFooter() {
  const { locale } = useLocale()
  const socials = [Globe, Camera, Send, Video, MessageCircle]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gold text-gold-foreground">
                <Plane className="size-5 -rotate-45" />
              </span>
              <span className="text-lg font-bold tracking-tight">{locale.footer.brand}</span>
            </div>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-primary-foreground/70">
              {locale.footer.description}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {locale.footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 sm:flex-row">
          <p className="text-sm text-primary-foreground/60">
            {locale.footer.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/60">
            <a href="#" className="hover:text-primary-foreground">
              {locale.footer.sitemap}
            </a>
            <a href="#" className="hover:text-primary-foreground">
              {locale.footer.accessibility}
            </a>
            <a href="#" className="hover:text-primary-foreground">
              {locale.footer.cookieSettings}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
