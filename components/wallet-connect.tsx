"use client"

import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, LogOut, Copy, Check } from "lucide-react"
import { useState } from "react"

export function WalletConnect() {
  const { address, isConnected, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.log("Copy failed:", err)
      }
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } finally {
      setIsConnecting(false)
    }
  }

  if (isConnected && address) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="text-white font-medium">{formatAddress(address)}</div>
                <div className="text-white/70 text-sm">Base Network</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={copyAddress} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button onClick={disconnect} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full justify-start"
        variant="outline"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      <p className="text-white/60 text-xs text-center">Demo wallet - simulates Web3 functionality</p>
    </div>
  )
}
