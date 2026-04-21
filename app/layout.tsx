import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Metadata shown in browser tab and search engines
export const metadata: Metadata = {
  title: "Interview Coach — AI Powered Interview Practice",
  description: "Practice interviews with real-time AI feedback on your answers, body language, and filler words.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navbar renders on every page automatically */}
        <Navbar />
        {children}
      </body>
    </html>
  )
}