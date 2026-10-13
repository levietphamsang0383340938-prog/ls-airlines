"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NavigationSidebar } from "./navigation-sidebar"
import { cn } from "@/lib/utils"
import { NeoChat } from "./neo-chat"

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 overflow-x-hidden">
      <NavigationSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
        onHomeClick={() => router.push('/')}
        onLoginClick={() => router.push('/login')}
        onRegister={() => router.push('/register')}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ml-0 pt-14 md:pt-0",
        isCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        {children}
      </div>
      <NeoChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}


