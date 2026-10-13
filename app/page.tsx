"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/airline/site-header"
import { Hero } from "@/components/airline/hero"
import { Offers } from "@/components/airline/offers"
import { PromoVideo } from "@/components/airline/promo-video"
import { SiteFooter } from "@/components/airline/site-footer"

export default function HomePage() {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const handleSearch = (query?: string) => {
    if (query) {
      router.push(`/booking/availability?${query}`)
    }
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleBookOffer = () => {
    router.push("/booking/availability")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      
      <main className="flex-1 w-full flex flex-col">
        <Hero onSearch={handleSearch} />
        <Offers onBook={handleBookOffer} />
        <PromoVideo />
      </main>
      
      <SiteFooter />
    </div>
  )
}
