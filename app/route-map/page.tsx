"use client"

import { RouteMapWrapper } from "@/components/airline/RouteMapWrapper"

export default function RouteMapPage() {
  return (
    <div className="flex flex-1 flex-col h-full w-full">
      <main className="flex-1">
        <RouteMapWrapper />
      </main>
    </div>
  )
}

