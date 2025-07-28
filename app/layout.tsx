import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { WalletProvider } from "@/hooks/use-wallet"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SLERF Earning Game",
  description: "Play games and earn SLERF tokens on Base chain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <WalletProvider>{children}</WalletProvider>
        </Providers>
      </body>
    </html>
  )
}
