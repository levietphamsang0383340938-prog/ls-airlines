  import type { Metadata } from "next"
  import { Inter, Geist } from "next/font/google"
  import "./globals.css" // Đảm bảo file CSS toàn cục được import
  import { LocaleProvider } from "@/components/locale-provider"
  import { cn } from "@/lib/utils";
  import { SidebarWrapper } from "@/components/airline/sidebar-wrapper"

  const geist = Geist({subsets:['latin'],variable:'--font-sans'});

  const inter = Inter({ subsets: ["latin"] })

  export const metadata: Metadata = {
    title: "Airline Booking",
    description: "Book your flights with ease",
  }

  export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body suppressHydrationWarning className={inter.className}>
          <LocaleProvider>
            <SidebarWrapper>
              {children}
            </SidebarWrapper>
          </LocaleProvider>
        </body>
      </html>
    )
  }