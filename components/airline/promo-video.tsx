"use client"

import { useState, useRef } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

export function PromoVideo() {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-12">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-foreground/70">
            Khám Phá
          </span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trải nghiệm đẳng cấp cùng LS Airlines
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tận hưởng chuyến bay tuyệt vời với dịch vụ hàng không đạt chuẩn quốc tế.
          </p>
        </div>

        {/* Video Frame container simulating a mobile device / reels style */}
        <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[2.5rem] border-4 border-[#b8860b] shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black">
          <div className="relative aspect-[9/16] w-full group">
            <video
              ref={videoRef}
              src="/videos/promo.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted={isMuted}
              loop
              playsInline
            />

            {/* Subtle dark gradient at the bottom for better control visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none opacity-80" />

            {/* Video Controls matching the screenshot */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-4 z-10">
              <button
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
              
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg hover:bg-white transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
